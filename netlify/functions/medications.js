import { neon } from '@neondatabase/serverless';

// Initialize Neon client lazily
let sql = null;
const getDb = () => {
    if (!sql) {
        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL environment variable is not set');
        }
        sql = neon(process.env.DATABASE_URL);
    }
    return sql;
};

// CORS headers for browser requests
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
    // Aggressive caching: medications rarely change
    // max-age: browser cache (1 hour), s-maxage: CDN cache (6 hours)
    // stale-while-revalidate: serve stale content while fetching fresh (24 hours)
    'Cache-Control': 'public, max-age=3600, s-maxage=21600, stale-while-revalidate=86400'
};

// Transform database row to frontend format (snake_case to camelCase)
function transformMedication(row) {
    return {
        id: row.id,
        brandName: row.brand_name,
        genericName: row.generic_name,
        rxcui: row.rxcui,
        category: row.category,
        manufacturer: row.manufacturer,
        stage: row.stage,
        commonOrgans: row.common_organs || [],
        papUrl: row.pap_url,
        papProgramId: row.pap_program_id,
        copayUrl: row.copay_url,
        copayProgramId: row.copay_program_id,
        supportUrl: row.support_url,
        cost_tier: row.cost_tier,
        generic_available: row.generic_available,
        typical_copay_tier: row.typical_copay_tier
    };
}

export async function handler(event) {
    // Handle preflight CORS requests
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers };
    }

    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const db = getDb();
        const { id, category, search } = event.queryStringParameters || {};

        // Fetch single medication by ID
        if (id) {
            const results = await db`
                SELECT * FROM medications WHERE id = ${id}
            `;

            if (results.length === 0) {
                return {
                    statusCode: 404,
                    headers,
                    body: JSON.stringify({ error: 'Medication not found' })
                };
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ medication: transformMedication(results[0]) })
            };
        }

        // Search medications by name
        if (search) {
            const searchPattern = `%${search}%`;
            const results = await db`
                SELECT * FROM medications
                WHERE generic_name ILIKE ${searchPattern}
                OR brand_name ILIKE ${searchPattern}
                ORDER BY generic_name
                LIMIT 50
            `;

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    medications: results.map(transformMedication),
                    count: results.length
                })
            };
        }

        // Filter by category
        if (category) {
            const results = await db`
                SELECT * FROM medications
                WHERE category = ${category}
                ORDER BY generic_name
            `;

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    medications: results.map(transformMedication),
                    count: results.length
                })
            };
        }

        // Fetch all medications (default)
        const results = await db`
            SELECT * FROM medications
            ORDER BY category, generic_name
        `;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                medications: results.map(transformMedication),
                count: results.length
            })
        };

    } catch (error) {
        console.error('Medications API error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
}
