/**
 * Subscriber Data API
 * Handles CRUD operations for authenticated subscriber data:
 * - Quiz progress
 * - Saved medications
 * - Data migration from localStorage to server
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
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json',
};

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

function getUser(event) {
  const auth = event.headers.authorization || '';
  const token = auth.replace('Bearer ', '');
  return verifyToken(token);
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers };

  const user = getUser(event);
  if (!user) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  const db = getDb();
  const path = event.path.replace('/.netlify/functions/subscriber-data', '');

  try {
    // GET / — Fetch all user data
    if (event.httpMethod === 'GET' && (path === '' || path === '/')) {
      const quizRows = await db`SELECT data FROM subscriber_quiz_data WHERE subscriber_id = ${user.userId} ORDER BY updated_at DESC LIMIT 1`;
      const medRows = await db`SELECT * FROM subscriber_medications WHERE subscriber_id = ${user.userId} ORDER BY created_at`;
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          quizData: quizRows[0]?.data || null,
          medications: medRows,
        }),
      };
    }

    // POST /migrate — Migrate localStorage data to server
    if (event.httpMethod === 'POST' && path === '/migrate') {
      const { quizData, medications, legacySavingsUserId } = JSON.parse(event.body || '{}');
      const migrated = { quiz: false, medications: 0 };

      if (quizData) {
        await db`
          INSERT INTO subscriber_quiz_data (subscriber_id, data, updated_at)
          VALUES (${user.userId}, ${JSON.stringify(quizData)}, NOW())
          ON CONFLICT (subscriber_id) DO UPDATE SET data = ${JSON.stringify(quizData)}, updated_at = NOW()
        `;
        migrated.quiz = true;
      }

      if (medications && Array.isArray(medications)) {
        for (const med of medications) {
          await db`
            INSERT INTO subscriber_medications (subscriber_id, medication_name, medication_data, created_at)
            VALUES (${user.userId}, ${med.name || med.medication_name}, ${JSON.stringify(med)}, NOW())
          `;
          migrated.medications++;
        }
      }

      if (legacySavingsUserId) {
        await db`UPDATE subscribers SET legacy_savings_user_id = ${legacySavingsUserId} WHERE id = ${user.userId}`;
      }

      return { statusCode: 200, headers, body: JSON.stringify({ success: true, migrated }) };
    }

    // GET/POST /quiz
    if (path === '/quiz') {
      if (event.httpMethod === 'GET') {
        const rows = await db`SELECT data FROM subscriber_quiz_data WHERE subscriber_id = ${user.userId} ORDER BY updated_at DESC LIMIT 1`;
        return { statusCode: 200, headers, body: JSON.stringify(rows[0]?.data || null) };
      }
      if (event.httpMethod === 'POST') {
        const data = JSON.parse(event.body || '{}');
        await db`
          INSERT INTO subscriber_quiz_data (subscriber_id, data, updated_at)
          VALUES (${user.userId}, ${JSON.stringify(data)}, NOW())
          ON CONFLICT (subscriber_id) DO UPDATE SET data = ${JSON.stringify(data)}, updated_at = NOW()
        `;
        return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
      }
    }

    // GET/POST /medications
    if (path === '/medications') {
      if (event.httpMethod === 'GET') {
        const rows = await db`SELECT * FROM subscriber_medications WHERE subscriber_id = ${user.userId} ORDER BY created_at`;
        return { statusCode: 200, headers, body: JSON.stringify(rows) };
      }
      if (event.httpMethod === 'POST') {
        const med = JSON.parse(event.body || '{}');
        const rows = await db`
          INSERT INTO subscriber_medications (subscriber_id, medication_name, medication_data, created_at)
          VALUES (${user.userId}, ${med.name || med.medication_name}, ${JSON.stringify(med)}, NOW())
          RETURNING *
        `;
        return { statusCode: 201, headers, body: JSON.stringify(rows[0]) };
      }
    }

    // POST /medications/sync — Bulk sync medications
    if (event.httpMethod === 'POST' && path === '/medications/sync') {
      const { medications } = JSON.parse(event.body || '{}');
      let synced = 0;
      if (medications && Array.isArray(medications)) {
        for (const med of medications) {
          await db`
            INSERT INTO subscriber_medications (subscriber_id, medication_name, medication_data, created_at)
            VALUES (${user.userId}, ${med.name || med.medication_name}, ${JSON.stringify(med)}, NOW())
          `;
          synced++;
        }
      }
      return { statusCode: 200, headers, body: JSON.stringify({ synced }) };
    }

    // PUT /medications/:id
    if (event.httpMethod === 'PUT' && path.startsWith('/medications/')) {
      const id = path.split('/').pop();
      const updates = JSON.parse(event.body || '{}');
      const rows = await db`
        UPDATE subscriber_medications SET medication_data = ${JSON.stringify(updates)}, medication_name = ${updates.name || updates.medication_name}
        WHERE id = ${id} AND subscriber_id = ${user.userId} RETURNING *
      `;
      if (rows.length === 0) return { statusCode: 404, headers, body: JSON.stringify({ error: 'Not found' }) };
      return { statusCode: 200, headers, body: JSON.stringify(rows[0]) };
    }

    // DELETE /medications/:id
    if (event.httpMethod === 'DELETE' && path.startsWith('/medications/')) {
      const id = path.split('/').pop();
      await db`DELETE FROM subscriber_medications WHERE id = ${id} AND subscriber_id = ${user.userId}`;
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    return { statusCode: 404, headers, body: JSON.stringify({ error: 'Not found' }) };
  } catch (err) {
    console.error('Subscriber data error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error' }) };
  }
}
