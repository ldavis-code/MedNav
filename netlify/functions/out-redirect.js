import { neon } from '@neondatabase/serverless';

// Initialize Neon client lazily to avoid cold start overhead
let sql;
const getDb = () => {
    if (!sql) {
        sql = neon(process.env.DATABASE_URL);
    }
    return sql;
};

// Valid program types for redirects
const VALID_PROGRAM_TYPES = ['copay', 'foundation', 'pap'];

// Map program types to event names
const EVENT_NAMES = {
    copay: 'copay_card_click',
    foundation: 'foundation_click',
    pap: 'pap_click'
};

export async function handler(event) {
    try {
        // Parse the path to extract program type and ID
        // Expected paths: /out/copay/:program_id, /out/foundation/:program_id, /out/pap/:program_id
        const pathParts = event.path.split('/').filter(Boolean);

        // pathParts should be ['out', 'copay|foundation|pap', 'program_id']
        if (pathParts.length < 3 || pathParts[0] !== 'out') {
            return {
                statusCode: 404,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Invalid path format' })
            };
        }

        const programType = pathParts[1];
        const programId = pathParts[2];

        // Validate program type
        if (!VALID_PROGRAM_TYPES.includes(programType)) {
            return {
                statusCode: 404,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Invalid program type' })
            };
        }

        // Get page source from referer header or query param
        const referer = event.headers.referer || event.headers.Referer || null;
        const querySource = event.queryStringParameters?.source || null;
        const pageSource = querySource || referer || '/unknown';

        // Get partner from query param if provided
        const partner = event.queryStringParameters?.partner || null;

        const db = getDb();

        // Look up the program in the database
        const programs = await db`
            SELECT program_id, program_type, name, official_url, active
            FROM programs
            WHERE program_id = ${programId}
            AND program_type = ${programType}
        `;

        // Check if program exists
        if (programs.length === 0) {
            return {
                statusCode: 404,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Program not found' })
            };
        }

        const program = programs[0];

        // Check if program is active
        if (!program.active) {
            return {
                statusCode: 404,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Program is not currently active' })
            };
        }

        // Log the event to the database
        const eventName = EVENT_NAMES[programType];
        await db`
            INSERT INTO events (event_name, partner, page_source, program_type, program_id, meta_json)
            VALUES (
                ${eventName},
                ${partner},
                ${pageSource},
                ${programType},
                ${programId},
                ${JSON.stringify({ redirect: true })}
            )
        `;

        // 302 redirect to the official URL
        return {
            statusCode: 302,
            headers: {
                'Location': program.official_url,
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            }
        };

    } catch (error) {
        console.error('Redirect error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
}
