/**
 * Authentication API
 * Handles login, register, and token verification
 *
 * NOTE: This is a basic implementation. For production, consider:
 * - Using a proper auth provider (Auth0, Clerk, Supabase Auth)
 * - Adding rate limiting
 * - Implementing refresh tokens
 * - Adding email verification
 */

import { neon } from '@neondatabase/serverless';
import crypto from 'crypto';

const sql = neon(process.env.DATABASE_URL);

// Simple JWT-like token (for demo - use proper JWT in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json',
};

// Hash password with salt
function hashPassword(password, salt = null) {
  const useSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, useSalt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt: useSalt };
}

// Verify password
function verifyPassword(password, storedHash, salt) {
  const { hash } = hashPassword(password, salt);
  return hash === storedHash;
}

// Generate token
function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    orgId: user.org_id,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };
  const data = Buffer.from(JSON.stringify(payload)).toString('base64');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(data)
    .digest('hex');
  return `${data}.${signature}`;
}

// Verify token
function verifyToken(token) {
  try {
    const [data, signature] = token.split('.');
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(data)
      .digest('hex');

    if (signature !== expectedSignature) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(data, 'base64').toString());

    if (payload.exp < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

// Main handler
export async function handler(event) {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const path = event.path.replace('/.netlify/functions/auth', '');

  try {
    // POST /auth/login
    if (event.httpMethod === 'POST' && path === '/login') {
      const { email, password, orgId } = JSON.parse(event.body);

      if (!email || !password) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Email and password required' }),
        };
      }

      // Find user
      const users = await sql`
        SELECT id, email, password_hash, name, role, org_id, is_active
        FROM users
        WHERE email = ${email.toLowerCase()}
      `;

      const user = users[0];

      if (!user || !user.is_active) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Invalid credentials' }),
        };
      }

      // Check org match if specified
      if (orgId && user.org_id !== orgId) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'User not found in this organization' }),
        };
      }

      // Verify password (format: hash:salt)
      const [storedHash, salt] = user.password_hash.split(':');
      if (!verifyPassword(password, storedHash, salt)) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Invalid credentials' }),
        };
      }

      // Update last login
      await sql`UPDATE users SET last_login_at = NOW() WHERE id = ${user.id}`;

      // Generate token
      const token = generateToken(user);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            orgId: user.org_id,
          },
        }),
      };
    }

    // POST /auth/register
    if (event.httpMethod === 'POST' && path === '/register') {
      const { email, password, name, orgId } = JSON.parse(event.body);

      if (!email || !password) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Email and password required' }),
        };
      }

      if (password.length < 8) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Password must be at least 8 characters' }),
        };
      }

      // Check if user exists
      const existing = await sql`SELECT id FROM users WHERE email = ${email.toLowerCase()}`;
      if (existing.length > 0) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Email already registered' }),
        };
      }

      // Hash password
      const { hash, salt } = hashPassword(password);
      const passwordHash = `${hash}:${salt}`;

      // Create user
      const result = await sql`
        INSERT INTO users (email, password_hash, name, org_id, role)
        VALUES (${email.toLowerCase()}, ${passwordHash}, ${name || null}, ${orgId || null}, 'viewer')
        RETURNING id, email, name, role, org_id
      `;

      const user = result[0];
      const token = generateToken(user);

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            orgId: user.org_id,
          },
        }),
      };
    }

    // GET /auth/verify
    if (event.httpMethod === 'GET' && path === '/verify') {
      const authHeader = event.headers.authorization || event.headers.Authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'No token provided' }),
        };
      }

      const token = authHeader.substring(7);
      const payload = verifyToken(token);

      if (!payload) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Invalid or expired token' }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ valid: true, user: payload }),
      };
    }

    // GET /auth/me - Get current user details
    if (event.httpMethod === 'GET' && path === '/me') {
      const authHeader = event.headers.authorization || event.headers.Authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'No token provided' }),
        };
      }

      const token = authHeader.substring(7);
      const payload = verifyToken(token);

      if (!payload) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Invalid or expired token' }),
        };
      }

      const users = await sql`
        SELECT u.id, u.email, u.name, u.role, u.org_id, o.name as org_name, o.slug as org_slug
        FROM users u
        LEFT JOIN organizations o ON u.org_id = o.id
        WHERE u.id = ${payload.id}
      `;

      if (users.length === 0) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'User not found' }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ user: users[0] }),
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' }),
    };
  } catch (error) {
    console.error('Auth error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
}
