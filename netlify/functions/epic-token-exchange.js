/**
 * Epic Token Exchange
 * Exchanges an authorization code + PKCE verifier for an access token.
 * Supports SMART on FHIR discovery for the token endpoint.
 */

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

function normalizeUrl(url) {
  return url ? url.replace(/\/+$/, '') : url;
}

async function discoverTokenEndpoint(fhirBaseUrl) {
  const base = normalizeUrl(fhirBaseUrl);
  try {
    const res = await fetch(`${base}/.well-known/smart-configuration`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      const config = await res.json();
      if (config.token_endpoint) {
        console.log('[epic-token-exchange] Discovered token endpoint:', config.token_endpoint);
        return config.token_endpoint;
      }
    }
  } catch (e) {
    console.log('[epic-token-exchange] SMART discovery failed:', e.message);
  }
  return null;
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers };
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { code, code_verifier, token_endpoint: clientTokenEndpoint, fhir_base_url: clientFhirBaseUrl } = JSON.parse(event.body || '{}');

    if (!code || !code_verifier) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'code and code_verifier required' }) };
    }

    const clientId = process.env.EPIC_CLIENT_ID;
    let redirectUri = process.env.EPIC_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Epic not configured' }) };
    }

    // Auto-fix redirect URI
    if (redirectUri && !redirectUri.startsWith('http://') && !redirectUri.startsWith('https://')) {
      redirectUri = 'https://' + redirectUri;
    }
    redirectUri = normalizeUrl(redirectUri);

    // Resolve FHIR base URL
    const rawFhirBaseUrl = clientFhirBaseUrl || process.env.EPIC_FHIR_BASE_URL;
    const fhirBaseUrl = rawFhirBaseUrl ? normalizeUrl(rawFhirBaseUrl) : null;

    // Determine token endpoint with fallback chain
    let tokenUrl = process.env.EPIC_TOKEN_URL;

    if (!tokenUrl && clientTokenEndpoint) {
      tokenUrl = clientTokenEndpoint;
    }

    if (!tokenUrl && fhirBaseUrl) {
      tokenUrl = await discoverTokenEndpoint(fhirBaseUrl);
    }

    if (!tokenUrl && fhirBaseUrl) {
      // URL derivation fallback
      if (/\/api\/FHIR\/R4\/?$/.test(fhirBaseUrl)) {
        tokenUrl = fhirBaseUrl.replace(/\/api\/FHIR\/R4\/?$/, '/oauth2/token');
      } else if (/\/FHIR\/R4\/?$/.test(fhirBaseUrl)) {
        tokenUrl = fhirBaseUrl.replace(/\/FHIR\/R4\/?$/, '/oauth2/token');
      }
    }

    if (!tokenUrl) {
      tokenUrl = 'https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token';
    }

    console.log('[epic-token-exchange] Token URL:', tokenUrl);

    const tokenRes = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        code_verifier,
      }),
    });

    const responseText = await tokenRes.text();
    console.log('[epic-token-exchange] Response status:', tokenRes.status);

    let tokenData;
    try {
      tokenData = JSON.parse(responseText);
    } catch {
      console.error('[epic-token-exchange] Non-JSON response:', responseText.substring(0, 300));
      return {
        statusCode: 502, headers,
        body: JSON.stringify({ error: 'Token endpoint returned an invalid response. The token URL may be incorrect.', token_url: tokenUrl }),
      };
    }

    if (!tokenRes.ok) {
      console.error('[epic-token-exchange] Token error:', JSON.stringify(tokenData));

      // Provide specific guidance based on error type
      let userMessage = 'Token exchange failed';
      if (tokenData.error === 'invalid_grant') {
        userMessage = 'The authorization code has expired or was already used. Please try connecting again.';
      } else if (tokenData.error === 'invalid_client') {
        userMessage = 'The app client ID is not recognized by this FHIR server. Verify EPIC_CLIENT_ID.';
      } else if (tokenData.error === 'invalid_request') {
        userMessage = 'The token request was rejected. EPIC_REDIRECT_URI may not match what is registered, or the PKCE code_verifier is invalid.';
      } else if (tokenData.error === 'unauthorized_client') {
        userMessage = 'This client is not authorized for the authorization_code grant type.';
      } else if (tokenData.error) {
        userMessage = `Epic token error: ${tokenData.error}${tokenData.error_description ? ' — ' + tokenData.error_description : ''}`;
      }

      if (tokenRes.status === 403) {
        return { statusCode: 403, headers, body: JSON.stringify({ error: 'Permission denied. Your health system may not have granted medication read access.' }) };
      }

      return { statusCode: 400, headers, body: JSON.stringify({ error: userMessage, details: tokenData, token_url: tokenUrl }) };
    }

    console.log('[epic-token-exchange] Token granted: scope="%s" patient=%s', tokenData.scope || 'NONE', tokenData.patient);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        access_token: tokenData.access_token,
        token_type: tokenData.token_type,
        patient: tokenData.patient,
        scope: tokenData.scope,
        expires_in: tokenData.expires_in,
      }),
    };
  } catch (err) {
    console.error('Epic token exchange error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error' }) };
  }
}
