/**
 * Epic EHR Launch Handler
 * Handles SMART on FHIR EHR launch from within Epic/MyChart.
 * Discovers the authorize endpoint, generates PKCE, encodes state,
 * and redirects the browser to Epic's authorization page.
 */

import crypto from 'crypto';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json',
};

function normalizeUrl(url) {
  return url ? url.replace(/\/+$/, '') : url;
}

function generateCodeVerifier() {
  return crypto.randomBytes(32).toString('base64url');
}

function generateCodeChallenge(codeVerifier) {
  return crypto.createHash('sha256').update(codeVerifier, 'ascii').digest('base64url');
}

async function discoverSmartEndpoints(fhirBaseUrl) {
  const base = normalizeUrl(fhirBaseUrl);

  // .well-known/smart-configuration
  try {
    const res = await fetch(`${base}/.well-known/smart-configuration`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      const config = await res.json();
      if (config.authorization_endpoint && config.token_endpoint) {
        return { authorize: config.authorization_endpoint, token: config.token_endpoint };
      }
    }
  } catch (e) {
    console.log('[epic-ehr-launch] .well-known discovery failed:', e.message);
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
        if (authorize && token) return { authorize, token };
      }
    }
  } catch (e) {
    console.log('[epic-ehr-launch] /metadata discovery failed:', e.message);
  }

  return null;
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers };

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const params = event.queryStringParameters || {};
    const iss = params.iss;
    const launch = params.launch;

    if (!iss || !launch) {
      console.error('[epic-ehr-launch] Missing params: iss=%s launch=%s', iss, launch);
      return { statusCode: 302, headers: { Location: '/error?msg=missing_launch_params' } };
    }

    const fhirBaseUrl = normalizeUrl(iss);

    const clientId = process.env.EPIC_CLIENT_ID;
    let redirectUri = process.env.EPIC_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      return {
        statusCode: 500, headers,
        body: JSON.stringify({ error: 'Epic integration not configured. Set EPIC_CLIENT_ID and EPIC_REDIRECT_URI.' }),
      };
    }

    // Auto-fix redirect URI
    if (!redirectUri.startsWith('http://') && !redirectUri.startsWith('https://')) {
      redirectUri = 'https://' + redirectUri;
    }
    redirectUri = normalizeUrl(redirectUri);

    // Discover authorize endpoint
    let authorizeUrl = process.env.EPIC_AUTHORIZE_URL;
    let tokenUrl = process.env.EPIC_TOKEN_URL;

    if (!authorizeUrl || !tokenUrl) {
      const discovered = await discoverSmartEndpoints(fhirBaseUrl);
      if (discovered) {
        authorizeUrl = authorizeUrl || discovered.authorize;
        tokenUrl = tokenUrl || discovered.token;
      }
    }

    if (!authorizeUrl) {
      if (/\/api\/FHIR\/R4\/?$/.test(fhirBaseUrl)) {
        authorizeUrl = fhirBaseUrl.replace(/\/api\/FHIR\/R4\/?$/, '/oauth2/authorize');
      } else {
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Could not determine authorize endpoint' }) };
      }
    }

    // Generate PKCE
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);

    // EHR launch scopes: 'launch' (not 'launch/patient') — Epic supplies patient
    // context via the launch token rather than a patient picker
    const scope = process.env.EPIC_EHR_SCOPES ||
      'launch openid fhirUser patient/Patient.read patient/MedicationRequest.read';

    // Encode state with iss, code_verifier, and token_endpoint for the callback
    const state = Buffer.from(
      JSON.stringify({
        iss: fhirBaseUrl,
        cv: codeVerifier,
        te: tokenUrl || null,
      })
    ).toString('base64url');

    // Build authorization URL
    const authParams = [
      ['response_type', 'code'],
      ['client_id', clientId],
      ['redirect_uri', redirectUri],
      ['launch', launch],
      ['scope', scope],
      ['state', state],
      ['aud', fhirBaseUrl],
      ['code_challenge', codeChallenge],
      ['code_challenge_method', 'S256'],
    ];
    const queryString = authParams
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');

    const authUrl = `${authorizeUrl}?${queryString}`;

    console.log('[epic-ehr-launch] Redirecting to:', authorizeUrl);

    return {
      statusCode: 302,
      headers: { Location: authUrl, 'Cache-Control': 'no-store' },
    };
  } catch (err) {
    console.error('[epic-ehr-launch] Error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'EHR launch failed: ' + err.message }) };
  }
}
