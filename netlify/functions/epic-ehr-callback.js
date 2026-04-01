/**
 * Epic EHR Callback Handler
 * Handles the server-side OAuth2 callback for EHR-launched sessions.
 * Exchanges the code for a token and redirects the user to the app.
 */

import crypto from 'crypto';

export async function handler(event) {
  const params = event.queryStringParameters || {};
  const code = params.code;
  const state = params.state;
  const error = params.error;

  const appUrl = process.env.URL || 'https://medicationnavigator.com';

  if (error) {
    return {
      statusCode: 302,
      headers: { Location: `${appUrl}/epic-callback?error=${encodeURIComponent(error)}` },
    };
  }

  if (!code) {
    return {
      statusCode: 302,
      headers: { Location: `${appUrl}/epic-callback?error=no_code` },
    };
  }

  // Parse session cookie
  let session;
  try {
    const cookies = event.headers.cookie || '';
    const match = cookies.match(/epic_session=([^;]+)/);
    if (match) {
      session = JSON.parse(Buffer.from(match[1], 'base64').toString());
    }
  } catch {
    // ignore
  }

  if (!session) {
    return {
      statusCode: 302,
      headers: { Location: `${appUrl}/epic-callback?error=session_expired` },
    };
  }

  // Validate state
  if (state !== session.state) {
    return {
      statusCode: 302,
      headers: { Location: `${appUrl}/epic-callback?error=state_mismatch` },
    };
  }

  try {
    const clientId = process.env.EPIC_CLIENT_ID;
    const redirectUri = process.env.EPIC_REDIRECT_URI || `${appUrl}/epic-callback`;
    const tokenUrl = session.tokenEndpoint || 'https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token';

    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      code_verifier: session.codeVerifier,
    });

    const tokenRes = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenParams.toString(),
    });

    if (!tokenRes.ok) {
      console.error('EHR token exchange failed:', tokenRes.status);
      return {
        statusCode: 302,
        headers: { Location: `${appUrl}/epic-callback?error=token_exchange_failed` },
      };
    }

    const tokenData = await tokenRes.json();

    // Redirect to the client-side callback with token info in a fragment
    // The client-side EpicCallback page will read this and fetch medications
    const callbackParams = new URLSearchParams({
      code: 'exchanged',
      patient: tokenData.patient || '',
    });

    // Store token data in a short-lived cookie for the client
    const tokenCookie = Buffer.from(JSON.stringify({
      access_token: tokenData.access_token,
      patient: tokenData.patient,
      fhir_base_url: session.iss,
    })).toString('base64');

    return {
      statusCode: 302,
      headers: {
        Location: `${appUrl}/epic-callback?${callbackParams.toString()}`,
        'Set-Cookie': [
          `epic_token=${tokenCookie}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=300`,
          'epic_session=; Path=/; Max-Age=0',
        ].join(', '),
      },
    };
  } catch (err) {
    console.error('EHR callback error:', err);
    return {
      statusCode: 302,
      headers: { Location: `${appUrl}/epic-callback?error=internal_error` },
    };
  }
}
