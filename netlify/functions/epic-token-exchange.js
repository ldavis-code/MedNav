/**
 * Epic Token Exchange
 * Exchanges an authorization code + PKCE verifier for an access token.
 * Called by EpicCallback after the user authorizes at Epic.
 */

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers };
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { code, code_verifier, token_endpoint } = JSON.parse(event.body || '{}');

    if (!code || !code_verifier) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'code and code_verifier required' }) };
    }

    const clientId = process.env.EPIC_CLIENT_ID;
    const redirectUri = process.env.EPIC_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Epic not configured' }) };
    }

    // Use provided token endpoint or fallback
    const tokenUrl = token_endpoint || 'https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token';

    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      code_verifier,
    });

    const tokenRes = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenParams.toString(),
    });

    if (!tokenRes.ok) {
      const errorData = await tokenRes.text();
      console.error('Token exchange failed:', tokenRes.status, errorData);

      if (tokenRes.status === 403) {
        return { statusCode: 403, headers, body: JSON.stringify({ error: 'Permission denied. Your health system may not have granted medication read access.' }) };
      }

      return { statusCode: tokenRes.status, headers, body: JSON.stringify({ error: 'Token exchange failed' }) };
    }

    const tokenData = await tokenRes.json();

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
