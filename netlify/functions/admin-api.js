/**
 * Admin API - Analytics and Reporting
 *
 * All endpoints require admin authentication via Bearer token
 *
 * GET /api/admin-api/stats - Summary statistics
 * GET /api/admin-api/events - Paginated events list
 * GET /api/admin-api/events/by-partner - Events aggregated by partner
 * GET /api/admin-api/events/by-program - Events aggregated by program
 * GET /api/admin-api/funnel - Funnel metrics
 * GET /api/admin-api/export/csv - CSV export
 * GET /api/admin-api/report/:partner - Partner pilot report
 */

import { neon } from '@neondatabase/serverless';
import crypto from 'crypto';

// Initialize Neon client lazily
let sql;
const getDb = () => {
    if (!sql) {
        sql = neon(process.env.DATABASE_URL);
    }
    return sql;
};

// Token secret for verification
const TOKEN_SECRET = process.env.JWT_SECRET || process.env.ADMIN_PASSWORD || 'admin-secret-change-me';

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
};

const csvHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'text/csv',
};

// Verify admin token
function verifyAdminToken(token) {
    try {
        const [data, signature] = token.split('.');
        const expectedSignature = crypto
            .createHmac('sha256', TOKEN_SECRET)
            .update(data)
            .digest('hex');

        if (signature !== expectedSignature) {
            return null;
        }

        const payload = JSON.parse(Buffer.from(data, 'base64').toString());

        if (payload.exp < Date.now()) {
            return null;
        }

        if (payload.type !== 'admin') {
            return null;
        }

        return payload;
    } catch {
        return null;
    }
}

// Check admin auth from request
function checkAuth(event) {
    const authHeader = event.headers.authorization || event.headers.Authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.substring(7);
    return verifyAdminToken(token);
}

// Parse date range from query params
function parseDateRange(params) {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let start = params.start ? new Date(params.start) : null;
    let end = params.end ? new Date(params.end) : null;

    // Ensure end is end of day
    if (end) {
        end.setHours(23, 59, 59, 999);
    }

    return {
        start,
        end,
        startOfWeek,
        startOfMonth,
        now,
    };
}

// Get summary stats
async function getStats(db) {
    const dates = parseDateRange({});

    // Total events all time
    const totalEvents = await db`SELECT COUNT(*) as count FROM events`;

    // Events this week
    const eventsThisWeek = await db`
        SELECT COUNT(*) as count FROM events
        WHERE ts >= ${dates.startOfWeek.toISOString()}
    `;

    // Events this month
    const eventsThisMonth = await db`
        SELECT COUNT(*) as count FROM events
        WHERE ts >= ${dates.startOfMonth.toISOString()}
    `;

    // Unique sessions this month (approximation using meta_json->sessionId or distinct partner+page_source combos)
    const uniqueSessions = await db`
        SELECT COUNT(DISTINCT COALESCE(
            meta_json->>'sessionId',
            CONCAT(COALESCE(partner, 'public'), '-', page_source, '-', DATE(ts))
        )) as count
        FROM events
        WHERE ts >= ${dates.startOfMonth.toISOString()}
    `;

    // Program click stats
    const clickStats = await db`
        SELECT
            COUNT(*) FILTER (WHERE event_name = 'copay_card_click') as copay_clicks,
            COUNT(*) FILTER (WHERE event_name = 'foundation_click') as foundation_clicks,
            COUNT(*) FILTER (WHERE event_name = 'pap_click') as pap_clicks,
            COUNT(*) FILTER (WHERE event_name = 'quiz_start') as quiz_starts,
            COUNT(*) FILTER (WHERE event_name = 'quiz_complete') as quiz_completes
        FROM events
    `;

    return {
        totalEvents: parseInt(totalEvents[0]?.count || 0),
        eventsThisWeek: parseInt(eventsThisWeek[0]?.count || 0),
        eventsThisMonth: parseInt(eventsThisMonth[0]?.count || 0),
        uniqueSessionsThisMonth: parseInt(uniqueSessions[0]?.count || 0),
        copayClicks: parseInt(clickStats[0]?.copay_clicks || 0),
        foundationClicks: parseInt(clickStats[0]?.foundation_clicks || 0),
        papClicks: parseInt(clickStats[0]?.pap_clicks || 0),
        quizStarts: parseInt(clickStats[0]?.quiz_starts || 0),
        quizCompletes: parseInt(clickStats[0]?.quiz_completes || 0),
    };
}

// Get events list with pagination
async function getEvents(db, params) {
    const limit = Math.min(parseInt(params.limit) || 50, 100);
    const offset = parseInt(params.offset) || 0;
    const { partner, event_name, start, end } = params;

    // Build dynamic query conditions
    let conditions = [];
    let values = [];

    if (partner) {
        conditions.push(`partner = $${values.length + 1}`);
        values.push(partner);
    }

    if (event_name) {
        conditions.push(`event_name = $${values.length + 1}`);
        values.push(event_name);
    }

    if (start) {
        conditions.push(`ts >= $${values.length + 1}`);
        values.push(new Date(start).toISOString());
    }

    if (end) {
        const endDate = new Date(end);
        endDate.setHours(23, 59, 59, 999);
        conditions.push(`ts <= $${values.length + 1}`);
        values.push(endDate.toISOString());
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countResult = await db.query(
        `SELECT COUNT(*) as count FROM events ${whereClause}`,
        values
    );

    // Get events
    const eventsResult = await db.query(
        `SELECT id, ts, event_name, partner, page_source, program_type, program_id, meta_json
         FROM events ${whereClause}
         ORDER BY ts DESC
         LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
        [...values, limit, offset]
    );

    return {
        events: eventsResult,
        total: parseInt(countResult[0]?.count || 0),
        limit,
        offset,
    };
}

// Get events by partner
async function getEventsByPartner(db, params) {
    const dates = parseDateRange(params);

    const result = await db`
        SELECT
            COALESCE(partner, '(none)') as partner,
            COUNT(*) as total,
            COUNT(*) FILTER (WHERE ts >= ${dates.startOfWeek.toISOString()}) as this_week,
            COUNT(*) FILTER (WHERE ts >= ${dates.startOfMonth.toISOString()}) as this_month
        FROM events
        WHERE (${params.start ? db`ts >= ${new Date(params.start).toISOString()}` : db`TRUE`})
          AND (${params.end ? db`ts <= ${new Date(params.end).toISOString()}` : db`TRUE`})
        GROUP BY partner
        ORDER BY total DESC
    `;

    // Get top program for each partner
    const topPrograms = await db`
        SELECT DISTINCT ON (COALESCE(partner, '(none)'))
            COALESCE(partner, '(none)') as partner,
            program_id as top_program
        FROM events
        WHERE program_id IS NOT NULL
        GROUP BY partner, program_id
        ORDER BY COALESCE(partner, '(none)'), COUNT(*) DESC
    `;

    const programMap = Object.fromEntries(
        topPrograms.map(p => [p.partner, p.top_program])
    );

    return result.map(r => ({
        partner: r.partner,
        thisWeek: parseInt(r.this_week),
        thisMonth: parseInt(r.this_month),
        allTime: parseInt(r.total),
        topProgram: programMap[r.partner] || null,
    }));
}

// Get events by program
async function getEventsByProgram(db, params) {
    const dates = parseDateRange(params);
    const { program_type } = params;

    let result;
    if (program_type) {
        result = await db`
            SELECT
                program_id,
                program_type,
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE ts >= ${dates.startOfWeek.toISOString()}) as this_week,
                COUNT(*) FILTER (WHERE ts >= ${dates.startOfMonth.toISOString()}) as this_month
            FROM events
            WHERE program_id IS NOT NULL
              AND program_type = ${program_type}
              AND (${params.start ? db`ts >= ${new Date(params.start).toISOString()}` : db`TRUE`})
              AND (${params.end ? db`ts <= ${new Date(params.end).toISOString()}` : db`TRUE`})
            GROUP BY program_id, program_type
            ORDER BY total DESC
        `;
    } else {
        result = await db`
            SELECT
                program_id,
                program_type,
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE ts >= ${dates.startOfWeek.toISOString()}) as this_week,
                COUNT(*) FILTER (WHERE ts >= ${dates.startOfMonth.toISOString()}) as this_month
            FROM events
            WHERE program_id IS NOT NULL
              AND (${params.start ? db`ts >= ${new Date(params.start).toISOString()}` : db`TRUE`})
              AND (${params.end ? db`ts <= ${new Date(params.end).toISOString()}` : db`TRUE`})
            GROUP BY program_id, program_type
            ORDER BY total DESC
        `;
    }

    return result.map(r => ({
        programId: r.program_id,
        programType: r.program_type,
        thisWeek: parseInt(r.this_week),
        thisMonth: parseInt(r.this_month),
        allTime: parseInt(r.total),
    }));
}

// Get funnel metrics
async function getFunnel(db, params) {
    const { partner, start, end } = params;

    let result;
    if (partner) {
        result = await db`
            SELECT event_name, COUNT(*) as count
            FROM events
            WHERE partner = ${partner}
              AND (${start ? db`ts >= ${new Date(start).toISOString()}` : db`TRUE`})
              AND (${end ? db`ts <= ${new Date(end).toISOString()}` : db`TRUE`})
            GROUP BY event_name
        `;
    } else {
        result = await db`
            SELECT event_name, COUNT(*) as count
            FROM events
            WHERE (${start ? db`ts >= ${new Date(start).toISOString()}` : db`TRUE`})
              AND (${end ? db`ts <= ${new Date(end).toISOString()}` : db`TRUE`})
            GROUP BY event_name
        `;
    }

    const counts = Object.fromEntries(
        result.map(r => [r.event_name, parseInt(r.count)])
    );

    const pageViews = counts.page_view || 0;
    const quizStarts = counts.quiz_start || 0;
    const quizCompletes = counts.quiz_complete || 0;
    const medSearches = counts.med_search || 0;
    const applicationClicks = (counts.copay_card_click || 0) +
        (counts.foundation_click || 0) +
        (counts.pap_click || 0);

    return {
        pageViews,
        quizStarts,
        quizCompletes,
        medSearches,
        applicationClicks,
        // Calculated percentages
        quizStartRate: pageViews > 0 ? Math.round((quizStarts / pageViews) * 100) : 0,
        quizCompleteRate: quizStarts > 0 ? Math.round((quizCompletes / quizStarts) * 100) : 0,
        medSearchRate: quizCompletes > 0 ? Math.round((medSearches / quizCompletes) * 100) : 0,
        applicationClickRate: medSearches > 0 ? Math.round((applicationClicks / medSearches) * 100) : 0,
    };
}

// Generate CSV export
async function exportCsv(db, params) {
    const { partner, start, end } = params;

    let result;
    if (partner) {
        result = await db`
            SELECT id, ts, event_name, partner, page_source, program_type, program_id
            FROM events
            WHERE partner = ${partner}
              AND (${start ? db`ts >= ${new Date(start).toISOString()}` : db`TRUE`})
              AND (${end ? db`ts <= ${new Date(end).toISOString()}` : db`TRUE`})
            ORDER BY ts DESC
            LIMIT 10000
        `;
    } else {
        result = await db`
            SELECT id, ts, event_name, partner, page_source, program_type, program_id
            FROM events
            WHERE (${start ? db`ts >= ${new Date(start).toISOString()}` : db`TRUE`})
              AND (${end ? db`ts <= ${new Date(end).toISOString()}` : db`TRUE`})
            ORDER BY ts DESC
            LIMIT 10000
        `;
    }

    // Build CSV
    const csvRows = [
        ['ID', 'Timestamp', 'Event Name', 'Partner', 'Page Source', 'Program Type', 'Program ID'].join(','),
        ...result.map(r => [
            r.id,
            r.ts,
            r.event_name,
            r.partner || '',
            `"${(r.page_source || '').replace(/"/g, '""')}"`,
            r.program_type || '',
            r.program_id || '',
        ].join(',')),
    ];

    return csvRows.join('\n');
}

// Generate partner pilot report
async function getPartnerReport(db, partner, params) {
    const { start, end } = params;

    // Default to last 90 days if no date range specified
    const endDate = end ? new Date(end) : new Date();
    const startDate = start ? new Date(start) : new Date(endDate.getTime() - 90 * 24 * 60 * 60 * 1000);

    // Get funnel metrics for this partner
    const funnel = await getFunnel(db, { partner, start: startDate.toISOString(), end: endDate.toISOString() });

    // Get event counts by type
    const eventCounts = await db`
        SELECT event_name, COUNT(*) as count
        FROM events
        WHERE partner = ${partner}
          AND ts >= ${startDate.toISOString()}
          AND ts <= ${endDate.toISOString()}
        GROUP BY event_name
        ORDER BY count DESC
    `;

    // Get top 5 programs
    const topPrograms = await db`
        SELECT program_id, program_type, COUNT(*) as clicks
        FROM events
        WHERE partner = ${partner}
          AND program_id IS NOT NULL
          AND ts >= ${startDate.toISOString()}
          AND ts <= ${endDate.toISOString()}
        GROUP BY program_id, program_type
        ORDER BY clicks DESC
        LIMIT 5
    `;

    // Get clicks by type
    const clicksByType = await db`
        SELECT
            COUNT(*) FILTER (WHERE event_name = 'copay_card_click') as copay,
            COUNT(*) FILTER (WHERE event_name = 'foundation_click') as foundation,
            COUNT(*) FILTER (WHERE event_name = 'pap_click') as pap
        FROM events
        WHERE partner = ${partner}
          AND ts >= ${startDate.toISOString()}
          AND ts <= ${endDate.toISOString()}
    `;

    // Get weekly trend data
    const weeklyTrend = await db`
        SELECT
            DATE_TRUNC('week', ts) as week,
            COUNT(*) as events,
            COUNT(*) FILTER (WHERE event_name IN ('copay_card_click', 'foundation_click', 'pap_click')) as clicks
        FROM events
        WHERE partner = ${partner}
          AND ts >= ${startDate.toISOString()}
          AND ts <= ${endDate.toISOString()}
        GROUP BY DATE_TRUNC('week', ts)
        ORDER BY week ASC
    `;

    return {
        partner,
        reportPeriod: {
            start: startDate.toISOString().split('T')[0],
            end: endDate.toISOString().split('T')[0],
            days: Math.round((endDate - startDate) / (24 * 60 * 60 * 1000)),
        },
        summary: {
            totalEvents: eventCounts.reduce((sum, e) => sum + parseInt(e.count), 0),
            pageViews: funnel.pageViews,
            quizStarts: funnel.quizStarts,
            quizCompletes: funnel.quizCompletes,
            medSearches: funnel.medSearches,
            applicationClicks: funnel.applicationClicks,
        },
        clicksByType: {
            copay: parseInt(clicksByType[0]?.copay || 0),
            foundation: parseInt(clicksByType[0]?.foundation || 0),
            pap: parseInt(clicksByType[0]?.pap || 0),
        },
        topPrograms: topPrograms.map(p => ({
            programId: p.program_id,
            programType: p.program_type,
            clicks: parseInt(p.clicks),
        })),
        weeklyTrend: weeklyTrend.map(w => ({
            week: w.week,
            events: parseInt(w.events),
            clicks: parseInt(w.clicks),
        })),
        conversionRates: {
            quizStartRate: funnel.quizStartRate,
            quizCompleteRate: funnel.quizCompleteRate,
            medSearchRate: funnel.medSearchRate,
            applicationClickRate: funnel.applicationClickRate,
        },
    };
}

export async function handler(event) {
    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    // Check authentication
    const auth = checkAuth(event);
    if (!auth) {
        return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ error: 'Unauthorized' }),
        };
    }

    const path = event.path.replace('/.netlify/functions/admin-api', '');
    const params = event.queryStringParameters || {};

    try {
        const db = getDb();

        // GET /admin-api/stats
        if (path === '/stats') {
            const stats = await getStats(db);
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(stats),
            };
        }

        // GET /admin-api/events
        if (path === '/events') {
            const result = await getEvents(db, params);
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(result),
            };
        }

        // GET /admin-api/events/by-partner
        if (path === '/events/by-partner') {
            const result = await getEventsByPartner(db, params);
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(result),
            };
        }

        // GET /admin-api/events/by-program
        if (path === '/events/by-program') {
            const result = await getEventsByProgram(db, params);
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(result),
            };
        }

        // GET /admin-api/funnel
        if (path === '/funnel') {
            const result = await getFunnel(db, params);
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(result),
            };
        }

        // GET /admin-api/export/csv
        if (path === '/export/csv') {
            const csv = await exportCsv(db, params);
            const filename = params.partner
                ? `partner_report_${params.partner}_${new Date().toISOString().split('T')[0]}.csv`
                : `events_export_${new Date().toISOString().split('T')[0]}.csv`;

            return {
                statusCode: 200,
                headers: {
                    ...csvHeaders,
                    'Content-Disposition': `attachment; filename="${filename}"`,
                },
                body: csv,
            };
        }

        // GET /admin-api/report/:partner
        if (path.startsWith('/report/')) {
            const partner = path.replace('/report/', '');
            if (!partner) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Partner name required' }),
                };
            }
            const report = await getPartnerReport(db, partner, params);
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(report),
            };
        }

        // GET /admin-api/partners (list of unique partners)
        if (path === '/partners') {
            const partners = await db`
                SELECT DISTINCT COALESCE(partner, '(none)') as partner
                FROM events
                ORDER BY partner
            `;
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(partners.map(p => p.partner)),
            };
        }

        return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Not found' }),
        };
    } catch (error) {
        console.error('Admin API error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' }),
        };
    }
}
