/**
 * Netlify Analytics API
 * Provides aggregate analytics data for the admin dashboard.
 * All data is anonymous — no PHI.
 */

import { neon } from '@neondatabase/serverless';
import crypto from 'crypto';

let sql;
const getDb = () => {
  if (!sql) sql = neon(process.env.DATABASE_URL);
  return sql;
};

const JWT_SECRET = process.env.JWT_SECRET || 'change-in-production';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json',
};

function verifyAdmin(event) {
  const auth = event.headers.authorization || '';
  const token = auth.replace('Bearer ', '');
  try {
    const [data, sig] = token.split('.');
    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(data).digest('base64url');
    if (sig !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString());
    if (payload.exp < Date.now()) return null;
    if (payload.role !== 'admin') return null;
    return payload;
  } catch {
    return null;
  }
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers };
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const admin = verifyAdmin(event);
  if (!admin) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  const db = getDb();
  const params = event.queryStringParameters || {};
  const days = parseInt(params.days) || 30;

  try {
    // Get event counts by type for the period
    const eventCounts = await db`
      SELECT event_name, COUNT(*)::int as count
      FROM events
      WHERE created_at > NOW() - INTERVAL '1 day' * ${days}
      GROUP BY event_name
      ORDER BY count DESC
    `;

    // Get daily event counts
    const dailyCounts = await db`
      SELECT DATE(created_at) as date, COUNT(*)::int as count
      FROM events
      WHERE created_at > NOW() - INTERVAL '1 day' * ${days}
      GROUP BY DATE(created_at)
      ORDER BY date
    `;

    // Get top searched medications
    const topMedications = await db`
      SELECT medication_name, COUNT(*)::int as count
      FROM medication_tracking
      WHERE created_at > NOW() - INTERVAL '1 day' * ${days}
        AND interaction_type = 'search'
      GROUP BY medication_name
      ORDER BY count DESC
      LIMIT 20
    `;

    // Get partner traffic
    const partnerTraffic = await db`
      SELECT partner, COUNT(*)::int as count
      FROM events
      WHERE partner IS NOT NULL
        AND created_at > NOW() - INTERVAL '1 day' * ${days}
      GROUP BY partner
      ORDER BY count DESC
    `;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        period_days: days,
        event_counts: eventCounts,
        daily_counts: dailyCounts,
        top_medications: topMedications,
        partner_traffic: partnerTraffic,
      }),
    };
  } catch (err) {
    console.error('Analytics error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error' }) };
  }
}
