/**
 * One-time admin user seed endpoint
 * POST /api/admin-seed
 *
 * Creates the initial super_admin user if no admin exists yet.
 * Returns 409 if an admin already exists (safe to call multiple times).
 * DELETE THIS FILE after first use for security.
 */

import { neon } from '@neondatabase/serverless';
import crypto from 'crypto';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

function hashPassword(password, salt = null) {
  const useSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, useSalt, 10000, 64, 'sha512').toString('hex');
  return `${hash}:${useSalt}`;
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  try {
    if (!process.env.DATABASE_URL) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'DATABASE_URL not configured' }) };
    }

    const db = neon(process.env.DATABASE_URL);

    await db`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        org_id INTEGER,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT,
        auth_provider TEXT DEFAULT 'email',
        name TEXT,
        role TEXT DEFAULT 'viewer',
        is_active BOOLEAN DEFAULT true,
        last_login_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    const existing = await db`SELECT id, email FROM users WHERE role IN ('super_admin', 'org_admin') LIMIT 1`;
    if (existing.length > 0) {
      return { statusCode: 409, headers, body: JSON.stringify({ message: 'Admin user already exists', email: existing[0].email }) };
    }

    let orgId = null;
    try {
      const orgs = await db`SELECT id FROM organizations WHERE slug = 'public' LIMIT 1`;
      if (orgs.length > 0) orgId = orgs[0].id;
    } catch { /* organizations table might not exist */ }

    const email = 'admin@medicationnavigator.com';
    const password = 'change-me-immediately';
    const passwordHash = hashPassword(password);

    await db`
      INSERT INTO users (org_id, email, password_hash, name, role, is_active)
      VALUES (${orgId}, ${email}, ${passwordHash}, 'MedNav Admin', 'super_admin', true)
    `;

    return {
      statusCode: 201, headers,
      body: JSON.stringify({
        message: 'Admin user created successfully',
        email,
        temporaryPassword: password,
        note: 'Change your password after first login. Delete the admin-seed function for security.',
      }),
    };
  } catch (error) {
    console.error('Admin seed error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: `Failed to seed admin user: ${error.message}` }) };
  }
}
