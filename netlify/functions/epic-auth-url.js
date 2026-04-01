/**
 * Epic FHIR OAuth2 Authorization URL Generator
 * Uses SMART on FHIR discovery to find the authorize endpoint,
 * generates PKCE code_verifier + code_challenge server-side,
 * and returns the authorization URL + code_verifier to the frontend.
 */

import crypto from 'crypto';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json',
};

function generateCodeVerifier() {
  return crypto.randomBytes(32).toString('base64url');
}

function generateCodeChallenge(codeVerifier) {
  return crypto.createHash('sha256').update(codeVerifier, 'ascii').digest('base64url');
}

function normalizeUrl(url) {
  return url ? url.replace(/\/+$/, '') : url;
}

/**
 * Discover OAuth2 endpoints from the FHIR server's SMART configuration.
 * Tries .well-known/smart-configuration first, then /metadata CapabilityStatement.
 */
async function discoverSmartEndpoints(fhirBaseUrl) {
  const base = normalizeUrl(fhirBaseUrl);

  // Try .well-known/smart-configuration (SMART App Launch STU2+)
  try {
    const res = await fetch(`${base}/.well-known/smart-configuration`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      const config = await res.json();
      if (config.authorization_endpoint && config.token_endpoint) {
        return {
          authorize: config.authorization_endpoint,
          token: config.token_endpoint,
          scopes_supported: config.scopes_supported || [],
        };
      }
    }
  } catch (e) {
    console.log('[epic-auth-url] .well-known discovery failed:', e.message);
  }

  // Fallback: /metadata CapabilityStatement
  try {
    const res = await fetch(`${base}/metadata`, {
      headers: { Accept: 'application/fhir+json' },
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      const cap = await res.json();
      const oauthExt = cap.rest?.[0]?.security?.extension?.find(
        ext => ext.url === 'http://fhir-registry.smarthealthit.org/StructureDefinition/oauth-uris'
      );
      if (oauthExt) {
        const authorize = oauthExt.extension?.find(e => e.url === 'authorize')?.valueUri;
        const token = oauthExt.extension?.find(e => e.url === 'token')?.valueUri;
        if (authorize && token) {
          return { authorize, token, scopes_supported: [] };
        }
      }
    }
  } catch (e) {
    console.log('[epic-auth-url] /metadata discovery failed:', e.message);
  }

  return null;
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const clientId = process.env.EPIC_CLIENT_ID;
    let redirectUri = process.env.EPIC_REDIRECT_URI;

    // Support dynamic FHIR base URL from query param (multi-health-system)
    const queryFhirBaseUrl = event.queryStringParameters?.fhir_base_url;
    const rawFhirBaseUrl = queryFhirBaseUrl || process.env.EPIC_FHIR_BASE_URL;

    if (!clientId || !redirectUri) {
      return {
        statusCode: 500, headers,
        body: JSON.stringify({ error: 'Epic FHIR integration not configured. Set EPIC_CLIENT_ID and EPIC_REDIRECT_URI.' }),
      };
    }

    // Auto-fix redirect URI protocol
    if (redirectUri && !redirectUri.startsWith('http://') && !redirectUri.startsWith('https://')) {
      redirectUri = 'https://' + redirectUri;
    }
    redirectUri = normalizeUrl(redirectUri);

    if (!rawFhirBaseUrl) {
      return {
        statusCode: 500, headers,
        body: JSON.stringify({ error: 'No FHIR base URL provided. Please select your health system or set EPIC_FHIR_BASE_URL.' }),
      };
    }

    const fhirBaseUrl = normalizeUrl(rawFhirBaseUrl);

    // Generate PKCE
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);

    // Discover endpoints
    let authorizeUrl = process.env.EPIC_AUTHORIZE_URL;
    let tokenUrl = process.env.EPIC_TOKEN_URL;
    let discoveryMethod = 'env_override';
    let scopesSupported = [];

    if (!authorizeUrl || !tokenUrl) {
      const discovered = await discoverSmartEndpoints(fhirBaseUrl);
      if (discovered) {
        authorizeUrl = authorizeUrl || discovered.authorize;
        tokenUrl = tokenUrl || discovered.token;
        scopesSupported = discovered.scopes_supported;
        discoveryMethod = 'smart_discovery';
      }
    }

    // URL derivation fallback
    if (!authorizeUrl) {
      if (/\/api\/FHIR\/R4\/?$/.test(fhirBaseUrl)) {
        authorizeUrl = fhirBaseUrl.replace(/\/api\/FHIR\/R4\/?$/, '/oauth2/authorize');
      } else if (/\/FHIR\/R4\/?$/.test(fhirBaseUrl)) {
        authorizeUrl = fhirBaseUrl.replace(/\/FHIR\/R4\/?$/, '/oauth2/authorize');
      } else {
        return {
          statusCode: 500, headers,
          body: JSON.stringify({
            error: 'Could not determine the authorization endpoint. SMART discovery failed and URL pattern not recognized.',
            fhir_base_url: fhirBaseUrl,
          }),
        };
      }
      discoveryMethod = 'url_derivation';
    }

    // SMART on FHIR scopes for standalone patient-facing launch
    const scope = process.env.EPIC_SCOPES ||
      'launch/patient openid fhirUser patient/Patient.read patient/MedicationRequest.read';

    // Pre-flight scope check: remove unsupported scopes to prevent Epic from
    // rejecting the entire request with a generic error page
    let effectiveScope = scope;
    let scopeWarnings = [];
    if (scopesSupported.length > 0) {
      const requested = scope.split(' ');
      const unsupported = requested.filter(s => !scopesSupported.includes(s));
      if (unsupported.length > 0) {
        scopeWarnings = unsupported;
        const supported = requested.filter(s => scopesSupported.includes(s));
        if (supported.length > 0) {
          effectiveScope = supported.join(' ');
        }
        console.warn('[epic-auth-url] Removed unsupported scopes:', unsupported.join(', '));
      }
    }

    // Generate state for CSRF protection
    const state = crypto.randomBytes(24).toString('base64url');

    // Build authorization URL with encodeURIComponent (not URLSearchParams which
    // encodes spaces as '+' — Epic may reject '+'-encoded scope values)
    const authParams = [
      ['response_type', 'code'],
      ['client_id', clientId],
      ['redirect_uri', redirectUri],
      ['scope', effectiveScope],
      ['state', state],
      ['aud', fhirBaseUrl],
      ['code_challenge', codeChallenge],
      ['code_challenge_method', 'S256'],
    ];
    const queryString = authParams
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');

    const authUrl = `${authorizeUrl}?${queryString}`;

    console.log('[epic-auth-url] Authorization URL generated, discovery_method=%s', discoveryMethod);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        url: authUrl,
        state,
        code_verifier: codeVerifier,
        token_endpoint: tokenUrl || null,
        fhir_base_url: fhirBaseUrl,
        _debug: {
          discovery_method: discoveryMethod,
          scope_warnings: scopeWarnings.length > 0 ? scopeWarnings : undefined,
        },
      }),
    };
  } catch (error) {
    console.error('Epic auth URL error:', error);
    return {
      statusCode: 500, headers,
      body: JSON.stringify({ error: 'Failed to generate authorization URL', details: error.message }),
    };
  }
}
