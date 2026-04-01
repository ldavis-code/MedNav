/**
 * Subscriber Authentication API
 * Handles login, register, and token verification for patient subscribers.
 * Uses Neon PostgreSQL for persistence.
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
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json',
};

function hashPassword(password, salt = null) {
  const useSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, useSalt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt: useSalt };
}

function verifyPassword(password, storedHash, salt) {
  const { hash } = hashPassword(password, salt);
  return hash === storedHash;
}

function generateToken(userId, email) {
  const payload = { userId, email, iat: Date.now(), exp: Date.now() + 30 * 24 * 60 * 60 * 1000 };
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', JWT_SECRET).update(data).digest('base64url');
  return `${data}.${sig}`;
}

function verifyToken(token) {
  try {
    const [data, sig] = token.split('.');
    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(data).digest('base64url');
    if (sig !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString());
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  const db = getDb();
  const path = event.path.replace('/.netlify/functions/subscriber-auth', '');

  try {
    // POST /login
    if (event.httpMethod === 'POST' && (path === '/login' || path === '')) {
      const { email, password, action } = JSON.parse(event.body || '{}');

      if (action === 'register' || path === '/register') {
        return await handleRegister(db, email, password, JSON.parse(event.body || '{}').name);
      }
      return await handleLogin(db, email, password);
    }

    // GET /verify
    if (event.httpMethod === 'GET' && path === '/verify') {
      const auth = event.headers.authorization || '';
      const token = auth.replace('Bearer ', '');
      const payload = verifyToken(token);
      if (!payload) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: 'Invalid or expired token' }) };
      }
      const rows = await db`SELECT id, email, name, plan, subscription_status, created_at FROM subscribers WHERE id = ${payload.userId}`;
      if (rows.length === 0) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: 'User not found' }) };
      }
      return { statusCode: 200, headers, body: JSON.stringify({ user: rows[0] }) };
    }

    return { statusCode: 404, headers, body: JSON.stringify({ error: 'Not found' }) };
  } catch (err) {
    console.error('Subscriber auth error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error' }) };
  }
}

async function handleLogin(db, email, password) {
  if (!email || !password) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Email and password required' }) };
  }

  const rows = await db`SELECT id, email, name, password_hash, password_salt, plan, subscription_status FROM subscribers WHERE email = ${email.toLowerCase()}`;
  if (rows.length === 0) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Invalid email or password' }) };
  }

  const user = rows[0];
  if (!verifyPassword(password, user.password_hash, user.password_salt)) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Invalid email or password' }) };
  }

  const token = generateToken(user.id, user.email);
  const { password_hash, password_salt, ...safeUser } = user;
  return { statusCode: 200, headers, body: JSON.stringify({ token, user: safeUser }) };
}

async function handleRegister(db, email, password, name) {
  if (!email || !password) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Email and password required' }) };
  }
  if (password.length < 8) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Password must be at least 8 characters' }) };
  }

  const existing = await db`SELECT id FROM subscribers WHERE email = ${email.toLowerCase()}`;
  if (existing.length > 0) {
    return { statusCode: 409, headers, body: JSON.stringify({ error: 'An account with this email already exists' }) };
  }

  const { hash, salt } = hashPassword(password);
  const rows = await db`
    INSERT INTO subscribers (email, name, password_hash, password_salt, plan, subscription_status)
    VALUES (${email.toLowerCase()}, ${name || null}, ${hash}, ${salt}, 'free', 'none')
    RETURNING id, email, name, plan, subscription_status, created_at
  `;

  const user = rows[0];
  const token = generateToken(user.id, user.email);
  return { statusCode: 201, headers, body: JSON.stringify({ token, user }) };
}
