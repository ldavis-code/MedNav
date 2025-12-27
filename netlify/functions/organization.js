/**
 * Organization API
 * Fetches organization configuration by slug
 */

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json',
};

export async function handler(event) {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const params = event.queryStringParameters || {};
    const { slug, id } = params;

    if (!slug && !id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing slug or id parameter' }),
      };
    }

    let org;

    if (id) {
      const result = await sql`
        SELECT id, slug, name, logo_url, primary_color, secondary_color,
               contact_email, website_url, features, plan, is_active
        FROM organizations
        WHERE id = ${parseInt(id)} AND is_active = true
      `;
      org = result[0];
    } else {
      const result = await sql`
        SELECT id, slug, name, logo_url, primary_color, secondary_color,
               contact_email, website_url, features, plan, is_active
        FROM organizations
        WHERE slug = ${slug.toLowerCase()} AND is_active = true
      `;
      org = result[0];
    }

    if (!org) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Organization not found' }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(org),
    };
  } catch (error) {
    console.error('Organization API error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
}
