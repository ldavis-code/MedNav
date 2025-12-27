import { neon } from '@neondatabase/serverless';

// Initialize Neon client
const sql = neon(process.env.DATABASE_URL);

// CORS headers for browser requests
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Content-Type': 'application/json'
};

export async function handler(event) {
    // Handle preflight CORS requests
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers };
    }

    try {
        // GET: Fetch savings for a user
        if (event.httpMethod === 'GET') {
            const { userId, view, limit = '50' } = event.queryStringParameters || {};

            if (!userId) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Missing required field: userId' })
                };
            }

            // Summary view - aggregate stats
            if (view === 'summary') {
                const summary = await sql`
                    SELECT
                        COUNT(*) as total_entries,
                        COALESCE(SUM(original_price - paid_price), 0) as total_saved,
                        COALESCE(SUM(original_price), 0) as total_original,
                        COALESCE(SUM(paid_price), 0) as total_paid,
                        MIN(fill_date) as first_fill_date,
                        MAX(fill_date) as last_fill_date,
                        COUNT(DISTINCT medication_id) as unique_medications,
                        ROUND(COALESCE(AVG(original_price - paid_price), 0), 2) as avg_savings_per_fill
                    FROM user_savings
                    WHERE user_id = ${userId}
                `;

                // Get monthly breakdown for chart
                const monthly = await sql`
                    SELECT
                        DATE_TRUNC('month', fill_date) as month,
                        SUM(original_price - paid_price) as monthly_saved,
                        SUM(original_price) as monthly_original,
                        SUM(paid_price) as monthly_paid,
                        COUNT(*) as fill_count
                    FROM user_savings
                    WHERE user_id = ${userId} AND fill_date IS NOT NULL
                    GROUP BY DATE_TRUNC('month', fill_date)
                    ORDER BY month DESC
                    LIMIT 12
                `;

                // Get savings by program type
                const byProgram = await sql`
                    SELECT
                        COALESCE(program_type, 'other') as program_type,
                        SUM(original_price - paid_price) as total_saved,
                        COUNT(*) as count
                    FROM user_savings
                    WHERE user_id = ${userId}
                    GROUP BY program_type
                    ORDER BY total_saved DESC
                `;

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        summary: summary[0] || {},
                        monthly,
                        byProgram
                    })
                };
            }

            // Default: list of individual savings entries
            const entries = await sql`
                SELECT
                    id, medication_id, medication_name, program_name, program_type,
                    original_price, paid_price,
                    (original_price - paid_price) as amount_saved,
                    fill_date, notes, created_at
                FROM user_savings
                WHERE user_id = ${userId}
                ORDER BY fill_date DESC NULLS LAST, created_at DESC
                LIMIT ${parseInt(limit)}
            `;

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ entries })
            };
        }

        // POST: Log a new savings entry
        if (event.httpMethod === 'POST') {
            const body = JSON.parse(event.body || '{}');
            const {
                userId,
                medicationId,
                medicationName,
                programName,
                programType,
                originalPrice,
                paidPrice,
                fillDate,
                notes
            } = body;

            // Validate required fields
            if (!userId || !medicationName || originalPrice === undefined || paidPrice === undefined) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({
                        error: 'Missing required fields: userId, medicationName, originalPrice, paidPrice'
                    })
                };
            }

            // Validate prices are positive numbers
            const origPrice = parseFloat(originalPrice);
            const pPrice = parseFloat(paidPrice);
            if (isNaN(origPrice) || isNaN(pPrice) || origPrice < 0 || pPrice < 0) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Invalid price values' })
                };
            }

            if (pPrice > origPrice) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Paid price cannot exceed original price' })
                };
            }

            // Validate program type if provided
            const validProgramTypes = ['copay_card', 'pap', 'foundation', 'discount_card', 'negotiated_price', 'other'];
            const type = programType && validProgramTypes.includes(programType) ? programType : null;

            // Insert the savings entry
            const result = await sql`
                INSERT INTO user_savings (
                    user_id, medication_id, medication_name, program_name, program_type,
                    original_price, paid_price, fill_date, notes
                )
                VALUES (
                    ${userId}, ${medicationId || null}, ${medicationName}, ${programName || null},
                    ${type}, ${origPrice}, ${pPrice}, ${fillDate || null}, ${notes || null}
                )
                RETURNING id, (original_price - paid_price) as amount_saved
            `;

            // Get updated totals for the user
            const totals = await sql`
                SELECT
                    SUM(original_price - paid_price) as total_saved,
                    COUNT(*) as total_entries
                FROM user_savings
                WHERE user_id = ${userId}
            `;

            return {
                statusCode: 201,
                headers,
                body: JSON.stringify({
                    success: true,
                    id: result[0].id,
                    amountSaved: result[0].amount_saved,
                    totalSaved: totals[0].total_saved,
                    totalEntries: totals[0].total_entries,
                    message: `Logged $${result[0].amount_saved.toFixed(2)} in savings!`
                })
            };
        }

        // DELETE: Remove a savings entry
        if (event.httpMethod === 'DELETE') {
            const { id, userId } = event.queryStringParameters || {};

            if (!id || !userId) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Missing required fields: id, userId' })
                };
            }

            // Only allow deletion of user's own entries
            const result = await sql`
                DELETE FROM user_savings
                WHERE id = ${parseInt(id)} AND user_id = ${userId}
                RETURNING id
            `;

            if (result.length === 0) {
                return {
                    statusCode: 404,
                    headers,
                    body: JSON.stringify({ error: 'Entry not found or unauthorized' })
                };
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true, message: 'Entry deleted' })
            };
        }

        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };

    } catch (error) {
        console.error('Savings tracker error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
}
