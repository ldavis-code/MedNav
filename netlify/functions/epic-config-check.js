/**
 * Epic Configuration Check
 * Pre-flight check to verify Epic integration is configured correctly.
 * Called by EpicConnectButton before redirecting to Epic.
 */

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json',
};

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers };
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const issues = [];

  if (!process.env.EPIC_CLIENT_ID) {
    issues.push('EPIC_CLIENT_ID is not set');
  }

  if (!process.env.EPIC_REDIRECT_URI) {
    issues.push('EPIC_REDIRECT_URI is not set');
  } else if (!process.env.EPIC_REDIRECT_URI.startsWith('https')) {
    issues.push('EPIC_REDIRECT_URI does not start with https');
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      status: issues.length > 0 ? 'ISSUES_FOUND' : 'OK',
      issues,
    }),
  };
}
