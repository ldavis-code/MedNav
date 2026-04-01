/**
 * Subscribe Alerts API
 * Handles email signups for medication assistance alerts.
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
    const { email, medications, wantsUpdates } = JSON.parse(event.body || '{}');

    if (!email) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Email is required' }) };
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid email format' }) };
    }

    const db = getDb();

    // Upsert the alert subscription
    await db`
      INSERT INTO alert_subscriptions (email, medications, wants_updates, created_at, updated_at)
      VALUES (${email.toLowerCase()}, ${JSON.stringify(medications || [])}, ${wantsUpdates || false}, NOW(), NOW())
      ON CONFLICT (email) DO UPDATE SET
        medications = ${JSON.stringify(medications || [])},
        wants_updates = ${wantsUpdates || false},
        updated_at = NOW()
    `;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: 'Successfully subscribed to alerts' }),
    };
  } catch (err) {
    console.error('Subscribe alerts error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error' }) };
  }
}
