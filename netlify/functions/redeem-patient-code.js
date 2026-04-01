/**
 * Redeem Patient Code
 * Validates a healthcare provider's patient code and upgrades the subscriber to Pro.
 */

import { neon } from '@neondatabase/serverless';

let sql;
const getDb = () => {
  if (!sql) sql = neon(process.env.DATABASE_URL);
  return sql;
};

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
    const { email, code } = JSON.parse(event.body || '{}');

    if (!email || !code) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Email and code are required' }) };
    }

    const db = getDb();

    // Validate the patient code
    const codeRows = await db`
      SELECT * FROM patient_codes
      WHERE code = ${code.trim().toUpperCase()}
        AND (expires_at IS NULL OR expires_at > NOW())
        AND (max_uses IS NULL OR uses_count < max_uses)
    `;

    if (codeRows.length === 0) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid or expired code' }) };
    }

    const patientCode = codeRows[0];

    // Check if already redeemed by this email
    const redemptions = await db`
      SELECT id FROM patient_code_redemptions WHERE code_id = ${patientCode.id} AND email = ${email.toLowerCase()}
    `;

    if (redemptions.length > 0) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'This code has already been redeemed with this email' }) };
    }

    // Record redemption and increment usage
    await db`INSERT INTO patient_code_redemptions (code_id, email, redeemed_at) VALUES (${patientCode.id}, ${email.toLowerCase()}, NOW())`;
    await db`UPDATE patient_codes SET uses_count = uses_count + 1 WHERE id = ${patientCode.id}`;

    // Upgrade subscriber if they have an account
    await db`
      UPDATE subscribers SET plan = 'pro', subscription_status = 'active'
      WHERE email = ${email.toLowerCase()}
    `;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Code redeemed successfully',
        partner: patientCode.partner_name || null,
      }),
    };
  } catch (err) {
    console.error('Redeem code error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error' }) };
  }
}
