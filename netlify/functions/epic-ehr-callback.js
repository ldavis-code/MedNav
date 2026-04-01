/**
 * Epic EHR Callback Handler
 * Handles the server-side OAuth2 callback for EHR-launched sessions.
 * Decodes state (from epic-ehr-launch), exchanges the code for tokens,
 * sets an httpOnly session cookie, and redirects to the app.
 */

const headers = {
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
      if (config.token_endpoint) return config.token_endpoint;
    }
  } catch (e) {
    console.log('[epic-ehr-callback] SMART discovery failed:', e.message);
  }
  return null;
}

function buildCookie(name, value, maxAge) {
  return [
    `${name}=${encodeURIComponent(value)}`,
    'Path=/',
    'HttpOnly',
    'Secure',
    'SameSite=Lax',
    `Max-Age=${maxAge}`,
  ].join('; ');
}

function redirectTo(path, cookies) {
  const resHeaders = { Location: path, 'Cache-Control': 'no-store' };
  if (cookies && cookies.length > 0) {
    return { statusCode: 302, headers: resHeaders, multiValueHeaders: { 'Set-Cookie': cookies } };
  }
  return { statusCode: 302, headers: resHeaders };
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers };
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { code, state, error: epicError, error_description: epicErrorDesc } =
      event.queryStringParameters || {};

    // Handle Epic-side errors
    if (epicError) {
      console.error('[epic-ehr-callback] Epic error: %s — %s', epicError, epicErrorDesc);
      return redirectTo(`/error?msg=epic_auth_error&detail=${encodeURIComponent(epicErrorDesc || epicError)}`);
    }

    if (!code || !state) {
      console.error('[epic-ehr-callback] Missing callback params');
      return redirectTo('/error?msg=missing_callback_params');
    }

    // Decode state (base64url JSON from epic-ehr-launch)
    let stateData;
    try {
      stateData = JSON.parse(Buffer.from(state, 'base64url').toString());
    } catch {
      try {
        stateData = JSON.parse(Buffer.from(state, 'base64').toString());
      } catch {
        console.error('[epic-ehr-callback] Failed to decode state');
        return redirectTo('/error?msg=invalid_state');
      }
    }

    const iss = normalizeUrl(stateData.iss);
    const codeVerifier = stateData.cv;
    let tokenUrl = stateData.te;

    if (!iss) return redirectTo('/error?msg=invalid_state');

    // Resolve token endpoint
    if (!tokenUrl) tokenUrl = process.env.EPIC_TOKEN_URL;
    if (!tokenUrl) tokenUrl = await discoverTokenEndpoint(iss);
    if (!tokenUrl) {
      tokenUrl = iss.replace(/\/api\/FHIR\/R4\/?$/, '/oauth2/token');
      console.warn('[epic-ehr-callback] Using URL-derived token endpoint:', tokenUrl);
    }

    // Normalize redirect URI
    let redirectUri = process.env.EPIC_REDIRECT_URI;
    if (redirectUri && !redirectUri.startsWith('http://') && !redirectUri.startsWith('https://')) {
      redirectUri = 'https://' + redirectUri;
    }
    if (redirectUri) redirectUri = normalizeUrl(redirectUri);

    // Exchange code for tokens
    console.log('[epic-ehr-callback] Exchanging code at %s', tokenUrl);

    const tokenParams = {
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: process.env.EPIC_CLIENT_ID,
    };
    if (codeVerifier) tokenParams.code_verifier = codeVerifier;

    const tokenRes = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(tokenParams),
    });

    const responseText = await tokenRes.text();
    let tokenData;
    try {
      tokenData = JSON.parse(responseText);
    } catch {
      console.error('[epic-ehr-callback] Non-JSON token response:', responseText.substring(0, 300));
      return redirectTo('/error?msg=token_exchange_failed');
    }

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('[epic-ehr-callback] Token error:', JSON.stringify(tokenData));
      return redirectTo(`/error?msg=token_exchange_failed&detail=${encodeURIComponent(tokenData.error_description || tokenData.error || 'unknown')}`);
    }

    console.log('[epic-ehr-callback] Token granted: scope="%s" patient=%s', tokenData.scope || 'NONE', tokenData.patient);

    // Build session cookie with token data
    const sessionPayload = JSON.stringify({
      accessToken: tokenData.access_token,
      patientId: tokenData.patient,
      iss,
    });

    const cookies = [
      buildCookie('mednav_session', sessionPayload, 3600),
    ];

    const appUrl = process.env.URL || 'https://medicationnavigator.com';
    return redirectTo(`${appUrl}/epic-callback?code=exchanged&patient=${tokenData.patient || ''}`, cookies);
  } catch (error) {
    console.error('[epic-ehr-callback] Error:', error);
    return redirectTo('/error?msg=callback_error');
  }
}
