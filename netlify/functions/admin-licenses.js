/**
 * Admin Licenses API
 * CRUD for licensed_organizations — controls which health systems
 * can use MedNav via Epic EHR launch.
 *
 * Requires ADMIN_SECRET_KEY in the Authorization header.
 *
 * GET    /api/admin-licenses              — list all orgs
 * GET    /api/admin-licenses?id=<id>      — get one org
 * POST   /api/admin-licenses              — create a new license
 * PATCH  /api/admin-licenses              — update an existing license
 * DELETE /api/admin-licenses?id=<id>      — hard-delete
 * GET    /api/admin-licenses/access-log   — recent access log entries
 */

import { neon } from '@neondatabase/serverless';

let sql;
const getDb = () => {
  if (!sql) sql = neon(process.env.DATABASE_URL);
  return sql;
};

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Content-Type': 'application/json',
};

function checkAdminSecret(event) {
  const authHeader = event.headers.authorization || event.headers.Authorization;
  if (!authHeader) return false;
  const secret = process.env.ADMIN_SECRET_KEY;
  if (!secret) return false;
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
  return token === secret;
}

function json(statusCode, data) {
  return { statusCode, headers, body: JSON.stringify(data) };
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers };
  if (!checkAdminSecret(event)) return json(401, { error: 'Unauthorized' });

  const db = getDb();
  const path = event.path.replace('/.netlify/functions/admin-licenses', '');
  const params = event.queryStringParameters || {};

  try {
    // GET /access-log
    if (event.httpMethod === 'GET' && path === '/access-log') {
      const limit = Math.min(parseInt(params.limit) || 100, 500);
      const rows = params.org_id
        ? await db`SELECT * FROM access_log WHERE epic_org_id = ${params.org_id} ORDER BY ts DESC LIMIT ${limit}`
        : await db`SELECT * FROM access_log ORDER BY ts DESC LIMIT ${limit}`;
      return json(200, { entries: rows, count: rows.length });
    }

    // GET
    if (event.httpMethod === 'GET') {
      if (params.id) {
        const rows = await db`SELECT * FROM licensed_organizations WHERE epic_org_id = ${params.id} LIMIT 1`;
        if (rows.length === 0) return json(404, { error: 'Organization not found' });
        return json(200, { org: rows[0] });
      }
      const rows = await db`SELECT * FROM licensed_organizations ORDER BY org_name`;
      return json(200, { orgs: rows, count: rows.length });
    }

    // POST — create
    if (event.httpMethod === 'POST') {
      const { epic_org_id, org_name, tier = 'standard', contract_start = null, contract_end = null, notes = null } = JSON.parse(event.body || '{}');
      if (!epic_org_id || !org_name) return json(400, { error: 'epic_org_id and org_name are required' });

      const existing = await db`SELECT epic_org_id FROM licensed_organizations WHERE epic_org_id = ${epic_org_id} LIMIT 1`;
      if (existing.length > 0) return json(409, { error: 'Organization already exists. Use PATCH to update.' });

      await db`
        INSERT INTO licensed_organizations (epic_org_id, org_name, tier, contract_start, contract_end, notes)
        VALUES (${epic_org_id}, ${org_name}, ${tier}, ${contract_start}, ${contract_end}, ${notes})
      `;
      return json(201, { created: true, epic_org_id, org_name, tier });
    }

    // PATCH — update
    if (event.httpMethod === 'PATCH') {
      const body = JSON.parse(event.body || '{}');
      if (!body.epic_org_id) return json(400, { error: 'epic_org_id is required' });

      const existing = await db`SELECT epic_org_id FROM licensed_organizations WHERE epic_org_id = ${body.epic_org_id} LIMIT 1`;
      if (existing.length === 0) return json(404, { error: 'Organization not found' });

      const id = body.epic_org_id;
      if (body.org_name !== undefined) await db`UPDATE licensed_organizations SET org_name = ${body.org_name}, updated_at = NOW() WHERE epic_org_id = ${id}`;
      if (body.tier !== undefined) await db`UPDATE licensed_organizations SET tier = ${body.tier}, updated_at = NOW() WHERE epic_org_id = ${id}`;
      if (body.contract_start !== undefined) await db`UPDATE licensed_organizations SET contract_start = ${body.contract_start}, updated_at = NOW() WHERE epic_org_id = ${id}`;
      if (body.contract_end !== undefined) await db`UPDATE licensed_organizations SET contract_end = ${body.contract_end}, updated_at = NOW() WHERE epic_org_id = ${id}`;
      if (body.active !== undefined) await db`UPDATE licensed_organizations SET active = ${body.active}, updated_at = NOW() WHERE epic_org_id = ${id}`;
      if (body.notes !== undefined) await db`UPDATE licensed_organizations SET notes = ${body.notes}, updated_at = NOW() WHERE epic_org_id = ${id}`;

      const rows = await db`SELECT * FROM licensed_organizations WHERE epic_org_id = ${id} LIMIT 1`;
      return json(200, { updated: true, org: rows[0] });
    }

    // DELETE
    if (event.httpMethod === 'DELETE') {
      if (!params.id) return json(400, { error: 'id query param is required' });
      const result = await db`DELETE FROM licensed_organizations WHERE epic_org_id = ${params.id} RETURNING epic_org_id`;
      if (result.length === 0) return json(404, { error: 'Organization not found' });
      return json(200, { deleted: true, epic_org_id: params.id });
    }

    return json(405, { error: 'Method not allowed' });
  } catch (error) {
    console.error('[admin-licenses] Error:', error);
    return json(500, { error: 'Internal server error' });
  }
}
