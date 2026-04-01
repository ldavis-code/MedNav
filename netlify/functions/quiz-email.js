/**
 * Quiz Email API
 * Sends quiz results to a user's email address.
 * Uses a simple email service or stores for later delivery.
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
    const { email, quizResults, wantsUpdates } = JSON.parse(event.body || '{}');

    if (!email) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Email is required' }) };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid email format' }) };
    }

    const db = getDb();

    // Store the email request for processing
    await db`
      INSERT INTO quiz_email_requests (email, quiz_results, wants_updates, created_at)
      VALUES (${email.toLowerCase()}, ${JSON.stringify(quizResults || {})}, ${wantsUpdates || false}, NOW())
    `;

    // If we also want to subscribe them to alerts
    if (wantsUpdates) {
      await db`
        INSERT INTO alert_subscriptions (email, wants_updates, created_at, updated_at)
        VALUES (${email.toLowerCase()}, true, NOW(), NOW())
        ON CONFLICT (email) DO UPDATE SET wants_updates = true, updated_at = NOW()
      `;
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: 'Results will be sent to your email' }),
    };
  } catch (err) {
    console.error('Quiz email error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error' }) };
  }
}
