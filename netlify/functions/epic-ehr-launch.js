/**
 * Epic EHR Launch Handler
 * Handles SMART on FHIR EHR launch from within Epic/MyChart.
 * Redirects to the OAuth2 authorization flow with the launch context.
 *
 * Required env vars:
 * - EPIC_CLIENT_ID
 * - EPIC_REDIRECT_URI
 */

import crypto from 'crypto';

export async function handler(event) {
  const params = event.queryStringParameters || {};
  const iss = params.iss;
  const launch = params.launch;

  if (!iss) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing iss parameter' }),
      headers: { 'Content-Type': 'application/json' },
    };
  }

  const clientId = process.env.EPIC_CLIENT_ID;
  const redirectUri = process.env.EPIC_REDIRECT_URI || process.env.URL + '/epic-callback';

  if (!clientId) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Epic not configured' }),
      headers: { 'Content-Type': 'application/json' },
    };
  }

  try {
    // Discover endpoints from FHIR server metadata
    let authorizeUrl;
    let tokenEndpoint;

    const metadataRes = await fetch(`${iss}/metadata`, {
      headers: { Accept: 'application/fhir+json' },
    });
    const metadata = await metadataRes.json();
    const security = metadata.rest?.[0]?.security;
    const oauthExt = security?.extension?.find(e =>
      e.url === 'http://fhir-registry.smarthealthit.org/StructureDefinition/oauth-uris'
    );

    if (oauthExt) {
      authorizeUrl = oauthExt.extension?.find(e => e.url === 'authorize')?.valueUri;
      tokenEndpoint = oauthExt.extension?.find(e => e.url === 'token')?.valueUri;
    }

    if (!authorizeUrl) {
      const wellKnownRes = await fetch(`${iss}/.well-known/smart-configuration`);
      const smartConfig = await wellKnownRes.json();
      authorizeUrl = smartConfig.authorization_endpoint;
      tokenEndpoint = smartConfig.token_endpoint;
    }

    if (!authorizeUrl) {
      return { statusCode: 400, body: 'Could not discover authorize endpoint', headers: { 'Content-Type': 'text/plain' } };
    }

    // Generate PKCE
    const codeVerifier = crypto.randomBytes(32).toString('base64url');
    const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');
    const state = crypto.randomBytes(16).toString('hex');

    // Build scopes
    const scopes = ['openid', 'fhirUser', 'launch', 'patient/MedicationRequest.read', 'patient/Medication.read', 'patient/Patient.read'];

    const authParams = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: scopes.join(' '),
      state,
      aud: iss,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    if (launch) authParams.set('launch', launch);

    // Store session data in a short-lived cookie for the callback
    const sessionData = JSON.stringify({ codeVerifier, state, tokenEndpoint, iss });
    const cookieValue = Buffer.from(sessionData).toString('base64');

    return {
      statusCode: 302,
      headers: {
        Location: `${authorizeUrl}?${authParams.toString()}`,
        'Set-Cookie': `epic_session=${cookieValue}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
      },
    };
  } catch (err) {
    console.error('EHR launch error:', err);
    return { statusCode: 500, body: 'EHR launch failed', headers: { 'Content-Type': 'text/plain' } };
  }
}
