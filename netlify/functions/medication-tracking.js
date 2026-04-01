/**
 * Medication Tracking API
 * Records user interactions with medications (searches, views, program clicks).
 * Used for aggregate analytics — no PHI stored.
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

const ALLOWED_TYPES = ['search', 'view', 'add_to_list', 'program_click'];

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers };
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { medicationName, interactionType, searchQuery } = JSON.parse(event.body || '{}');

    if (!medicationName || !interactionType) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'medicationName and interactionType required' }) };
    }

    if (!ALLOWED_TYPES.includes(interactionType)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid interactionType' }) };
    }

    const db = getDb();

    // Fire-and-forget write
    db`
      INSERT INTO medication_tracking (medication_name, interaction_type, search_query, created_at)
      VALUES (${medicationName}, ${interactionType}, ${searchQuery || null}, NOW())
    `.catch(err => console.error('Medication tracking write failed:', err.message));

    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('Medication tracking error:', err);
    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  }
}
