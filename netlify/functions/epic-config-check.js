/**
 * Epic Configuration Check
 * Diagnostic endpoint to verify Epic OAuth2 configuration.
 * Returns masked values and tests SMART discovery.
 */

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json',
};

function mask(value, showChars = 6) {
  if (!value) return '(NOT SET)';
  if (value.length <= showChars) return value;
  return value.substring(0, showChars) + '...' + `[${value.length} chars]`;
}

function normalizeUrl(url) {
  return url ? url.replace(/\/+$/, '') : url;
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers };
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const clientId = process.env.EPIC_CLIENT_ID;
  const redirectUri = process.env.EPIC_REDIRECT_URI;
  const fhirBaseUrl = process.env.EPIC_FHIR_BASE_URL;
  const scopes = process.env.EPIC_SCOPES;

  const issues = [];

  // Check required vars
  if (!clientId) issues.push('EPIC_CLIENT_ID is not set');
  if (!redirectUri) issues.push('EPIC_REDIRECT_URI is not set');

  // Check redirect URI format
  if (redirectUri) {
    if (!redirectUri.startsWith('https')) {
      issues.push('EPIC_REDIRECT_URI does not start with https');
    }
    if (redirectUri.endsWith('/')) {
      issues.push('EPIC_REDIRECT_URI has a trailing slash — Epic requires exact URI matching');
    }
    if (redirectUri.includes('localhost')) {
      issues.push('EPIC_REDIRECT_URI contains localhost — must be production domain');
    }
  }

  // Check for sandbox indicators
  if (fhirBaseUrl && fhirBaseUrl.includes('interconnect-fhir-oauth')) {
    issues.push('EPIC_FHIR_BASE_URL is using Epic SANDBOX — use production FHIR endpoint for real patients');
  }

  // Try SMART discovery
  let discoveryResult = null;
  const base = normalizeUrl(fhirBaseUrl || 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4');
  try {
    const res = await fetch(`${base}/.well-known/smart-configuration`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      const config = await res.json();
      discoveryResult = {
        status: 'OK',
        authorization_endpoint: config.authorization_endpoint || '(not found)',
        token_endpoint: config.token_endpoint || '(not found)',
        scopes_supported: config.scopes_supported || [],
      };

      // Check scope compatibility
      const requestedScopes = (scopes || 'launch/patient openid fhirUser patient/Patient.read patient/MedicationRequest.read').split(' ');
      if (config.scopes_supported?.length > 0) {
        const unsupported = requestedScopes.filter(s => !config.scopes_supported.includes(s));
        if (unsupported.length > 0) {
          issues.push(`Unsupported scopes: ${unsupported.join(', ')}. Update EPIC_SCOPES to match your app registration.`);
        }
      }
    } else {
      discoveryResult = { status: 'FAILED', http_status: res.status };
      issues.push('SMART discovery failed — FHIR base URL may be incorrect');
    }
  } catch (e) {
    discoveryResult = { status: 'ERROR', message: e.message };
    issues.push(`SMART discovery request failed: ${e.message}`);
  }

  // Check FHIR server reachability
  if (fhirBaseUrl) {
    try {
      const metaRes = await fetch(`${normalizeUrl(fhirBaseUrl)}/metadata`, {
        headers: { Accept: 'application/fhir+json' },
        signal: AbortSignal.timeout(5000),
      });
      if (!metaRes.ok) {
        issues.push(`FHIR metadata endpoint returned HTTP ${metaRes.status}`);
      }
    } catch (e) {
      issues.push(`Cannot reach FHIR server: ${e.message}`);
    }
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      status: issues.length === 0 ? 'OK' : 'ISSUES_FOUND',
      issues,
      config: {
        epic_client_id: mask(clientId, 8),
        epic_redirect_uri: redirectUri || '(NOT SET)',
        epic_fhir_base_url: fhirBaseUrl || '(NOT SET — using sandbox default)',
        epic_scopes: scopes || '(NOT SET — using defaults)',
        netlify_url: process.env.URL || '(NOT SET)',
      },
      smart_discovery: discoveryResult,
    }, null, 2),
  };
}
