import { neon } from '@neondatabase/serverless';

// Initialize Neon client lazily
let sql;
const getDb = () => {
    if (!sql) {
        sql = neon(process.env.DATABASE_URL);
    }
    return sql;
};

// CORS headers for browser requests
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
};

// Allowed event names - whitelist approach for security
const ALLOWED_EVENT_NAMES = [
    'page_view',
    'quiz_start',
    'quiz_complete',
    'med_search',
    'resource_view',
    'copay_card_click',
    'foundation_click',
    'pap_click',
    'helpful_vote_yes',
    'helpful_vote_no'
];

// PHI fields that must NEVER be accepted (for security validation)
const BLOCKED_PHI_FIELDS = [
    'name',
    'first_name',
    'last_name',
    'dob',
    'date_of_birth',
    'birthday',
    'mrn',
    'medical_record_number',
    'ssn',
    'social_security',
    'address',
    'street',
    'city',
    'zip',
    'zipcode',
    'phone',
    'telephone',
    'email',
    'ip',
    'ip_address',
    'drug_name_text',
    'medication_text',
    'free_text'
];

// Check if any PHI fields are present in the request
function containsPhiFields(obj, path = '') {
    if (!obj || typeof obj !== 'object') return null;

    for (const key of Object.keys(obj)) {
        const lowerKey = key.toLowerCase();
        if (BLOCKED_PHI_FIELDS.includes(lowerKey)) {
            return path ? `${path}.${key}` : key;
        }
        // Recursively check nested objects
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            const found = containsPhiFields(obj[key], path ? `${path}.${key}` : key);
            if (found) return found;
        }
    }
    return null;
}

export async function handler(event) {
    // Handle preflight CORS requests
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Parse request body
        let body;
        try {
            body = JSON.parse(event.body || '{}');
        } catch {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid JSON body' })
            };
        }

        const { event_name, partner, page_source, meta } = body;

        // Validate required fields
        if (!event_name) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing required field: event_name' })
            };
        }

        if (!page_source) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing required field: page_source' })
            };
        }

        // Validate event_name against allowed list
        if (!ALLOWED_EVENT_NAMES.includes(event_name)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Invalid event_name',
                    allowed: ALLOWED_EVENT_NAMES
                })
            };
        }

        // Check for PHI fields in the entire request body
        const phiField = containsPhiFields(body);
        if (phiField) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: `PHI field not allowed: ${phiField}`,
                    message: 'This endpoint does not accept personally identifiable health information'
                })
            };
        }

        // Sanitize partner (only alphanumeric, dash, underscore allowed)
        let sanitizedPartner = null;
        if (partner) {
            sanitizedPartner = String(partner).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 50);
        }

        // Sanitize page_source (URL path format)
        const sanitizedPageSource = String(page_source).slice(0, 255);

        // Sanitize meta - remove any PHI fields that might have slipped through
        let sanitizedMeta = null;
        if (meta && typeof meta === 'object') {
            sanitizedMeta = {};
            for (const [key, value] of Object.entries(meta)) {
                const lowerKey = key.toLowerCase();
                // Skip any PHI fields
                if (!BLOCKED_PHI_FIELDS.includes(lowerKey)) {
                    // Only allow primitive values or arrays of primitives
                    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                        sanitizedMeta[key] = value;
                    } else if (Array.isArray(value) && value.every(v => typeof v === 'string' || typeof v === 'number')) {
                        sanitizedMeta[key] = value;
                    }
                }
            }
        }

        // Fire-and-forget: Start the DB write but don't await it
        // This makes analytics non-blocking under high load
        const writeEvent = async () => {
            try {
                const db = getDb();
                await db`
                    INSERT INTO events (event_name, partner, page_source, program_type, program_id, meta_json)
                    VALUES (
                        ${event_name},
                        ${sanitizedPartner},
                        ${sanitizedPageSource},
                        ${null},
                        ${null},
                        ${sanitizedMeta ? JSON.stringify(sanitizedMeta) : null}
                    )
                `;
            } catch (err) {
                // Log but don't fail - analytics should never block user experience
                console.error('Analytics write failed:', err.message);
            }
        };

        // Start the write without awaiting (fire-and-forget)
        // Netlify functions will still complete the write before cold shutdown
        writeEvent();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true })
        };

    } catch (error) {
        console.error('Event logging error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
}
