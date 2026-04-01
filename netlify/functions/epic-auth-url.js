/**
 * Epic Auth URL Generator
 * Generates an OAuth2 authorization URL with PKCE for Epic FHIR.
 * Called by EpicConnectButton to initiate the connection flow.
 *
 * Required env vars:
 * - EPIC_CLIENT_ID: Epic app client ID
 * - EPIC_REDIRECT_URI: OAuth callback URL (e.g., https://medicationnavigator.com/epic-callback)
 */

import crypto from 'crypto';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json',
};

// FHIR scopes needed for medication import
const SCOPES = [
  'openid',
  'fhirUser',
  'patient/MedicationRequest.read',
  'patient/Medication.read',
  'patient/Patient.read',
];

function generateCodeVerifier() {
  return crypto.randomBytes(32).toString('base64url');
}

function generateCodeChallenge(verifier) {
  return crypto.createHash('sha256').update(verifier).digest('base64url');
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers };
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const clientId = process.env.EPIC_CLIENT_ID;
  const redirectUri = process.env.EPIC_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Epic integration not configured' }) };
  }

  try {
    const params = event.queryStringParameters || {};
    const fhirBaseUrl = params.fhir_base_url;

    if (!fhirBaseUrl) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'fhir_base_url parameter required' }) };
    }

    // Discover authorization endpoint from FHIR metadata
    let authorizeUrl;
    let tokenEndpoint;

    try {
      const metadataRes = await fetch(`${fhirBaseUrl}/metadata`, {
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
    } catch {
      // Fallback to well-known endpoint
    }

    if (!authorizeUrl) {
      try {
        const wellKnownRes = await fetch(`${fhirBaseUrl}/.well-known/smart-configuration`);
        const smartConfig = await wellKnownRes.json();
        authorizeUrl = smartConfig.authorization_endpoint;
        tokenEndpoint = smartConfig.token_endpoint;
      } catch {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Could not discover OAuth endpoints for this health system' }) };
      }
    }

    if (!authorizeUrl) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'No authorization endpoint found for this health system' }) };
    }

    // Generate PKCE
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);
    const state = crypto.randomBytes(16).toString('hex');

    // Build authorization URL
    const authParams = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: SCOPES.join(' '),
      state,
      aud: fhirBaseUrl,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    const url = `${authorizeUrl}?${authParams.toString()}`;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        url,
        code_verifier: codeVerifier,
        state,
        token_endpoint: tokenEndpoint,
        fhir_base_url: fhirBaseUrl,
      }),
    };
  } catch (err) {
    console.error('Epic auth URL error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to generate authorization URL' }) };
  }
}
