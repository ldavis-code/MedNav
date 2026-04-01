/**
 * Admin Medications Config API
 * GET - List org medication configs
 * PUT - Update a medication config (feature, hide, etc.)
 */

import { neon } from '@neondatabase/serverless';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'change-in-production';

let sql;
const getDb = () => {
  if (!sql) sql = neon(process.env.DATABASE_URL);
  return sql;
};

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Content-Type': 'application/json',
};

function checkAuth(event) {
  const authHeader = event.headers.authorization || event.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) return null;
  try {
    const [data, signature] = authHeader.substring(7).split('.');
    const expected = crypto.createHmac('sha256', JWT_SECRET).update(data).digest('hex');
    if (signature !== expected) return null;
    const payload = JSON.parse(Buffer.from(data, 'base64').toString());
    if (payload.exp < Date.now()) return null;
    if (payload.role !== 'super_admin' && payload.role !== 'org_admin') return null;
    return payload;
  } catch {
    return null;
  }
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

  const auth = checkAuth(event);
  if (!auth) return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };

  const db = getDb();

  try {
    if (event.httpMethod === 'GET') {
      const configs = auth.orgId
        ? await db`SELECT * FROM org_medication_configs WHERE org_id = ${auth.orgId}`
        : await db`SELECT * FROM org_medication_configs LIMIT 500`;
      return { statusCode: 200, headers, body: JSON.stringify({ configs }) };
    }

    if (event.httpMethod === 'PUT') {
      const { medicationId, orgId, is_featured, is_hidden, display_name, custom_notes, custom_pap_url, priority } = JSON.parse(event.body);
      const targetOrgId = orgId || auth.orgId;
      if (!medicationId || !targetOrgId) return { statusCode: 400, headers, body: JSON.stringify({ error: 'medicationId and orgId required' }) };

      const existing = await db`SELECT id FROM org_medication_configs WHERE org_id = ${targetOrgId} AND medication_id = ${medicationId}`;
      if (existing.length > 0) {
        await db`
          UPDATE org_medication_configs SET
            is_featured = COALESCE(${is_featured ?? null}, is_featured),
            is_hidden = COALESCE(${is_hidden ?? null}, is_hidden),
            display_name = COALESCE(${display_name ?? null}, display_name),
            custom_notes = COALESCE(${custom_notes ?? null}, custom_notes),
            custom_pap_url = COALESCE(${custom_pap_url ?? null}, custom_pap_url),
            priority = COALESCE(${priority ?? null}, priority)
          WHERE org_id = ${targetOrgId} AND medication_id = ${medicationId}
        `;
      } else {
        await db`
          INSERT INTO org_medication_configs (org_id, medication_id, is_featured, is_hidden, display_name, custom_notes, custom_pap_url, priority)
          VALUES (${targetOrgId}, ${medicationId}, ${is_featured || false}, ${is_hidden || false}, ${display_name || null}, ${custom_notes || null}, ${custom_pap_url || null}, ${priority || 0})
        `;
      }
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  } catch (error) {
    console.error('Admin medications error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
}
