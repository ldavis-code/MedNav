/**
 * Admin Impact Report API
 * Combines Netlify Analytics (real traffic) with DB events (program interactions).
 */

import { neon } from '@neondatabase/serverless';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'change-in-production';
const NETLIFY_API_TOKEN = process.env.NETLIFY_API_TOKEN;
const NETLIFY_SITE_ID = process.env.NETLIFY_SITE_ID;

let sql;
const getDb = () => {
  if (!sql) sql = neon(process.env.DATABASE_URL);
  return sql;
};

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json',
};

function checkAuth(event) {
  const authHeader = event.headers.authorization || event.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  try {
    const [data, signature] = authHeader.substring(7).split('.');
    const expected = crypto.createHmac('sha256', JWT_SECRET).update(data).digest('hex');
    if (signature !== expected) return null;
    const payload = JSON.parse(Buffer.from(data, 'base64').toString());
    if (payload.exp < Date.now()) return null;
    if (payload.role !== 'super_admin' && payload.role !== 'org_admin') return null;
    return payload;
  } catch {
    return null;
  }
}

async function fetchNetlifyAnalytics(endpoint, from, to, extraParams = '') {
  if (!NETLIFY_API_TOKEN || !NETLIFY_SITE_ID) return null;
  const url = `https://analytics.services.netlify.com/v2/${NETLIFY_SITE_ID}/${endpoint}?from=${from}&to=${to}&timezone=America/New_York${extraParams}`;
  try {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${NETLIFY_API_TOKEN}` } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function sumAnalyticsData(dataArray) {
  if (!dataArray?.length) return 0;
  return dataArray.reduce((sum, d) => sum + (Array.isArray(d) ? (d[1] || 0) : (d.count || 0)), 0);
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'GET') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  const auth = checkAuth(event);
  if (!auth) return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };

  try {
    const params = event.queryStringParameters || {};
    const days = parseInt(params.days) || 90;
    const now = new Date();
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const cutoff = cutoffDate.toISOString();
    const fromTs = cutoffDate.getTime();
    const toTs = now.getTime();

    // Netlify Analytics
    const [pageviewsData, visitorsData, topPagesData, topSourcesData] = await Promise.all([
      fetchNetlifyAnalytics('pageviews', fromTs, toTs, '&resolution=day'),
      fetchNetlifyAnalytics('visitors', fromTs, toTs, '&resolution=day'),
      fetchNetlifyAnalytics('ranking/pages', fromTs, toTs, '&limit=20'),
      fetchNetlifyAnalytics('ranking/sources', fromTs, toTs, '&limit=15'),
    ]);

    const netlifyPageviews = pageviewsData?.data ? sumAnalyticsData(pageviewsData.data) : 0;
    const netlifyVisitors = visitorsData?.data ? sumAnalyticsData(visitorsData.data) : 0;
    const hasNetlifyData = !!(NETLIFY_API_TOKEN && NETLIFY_SITE_ID);

    // Database metrics
    let connections = {};
    let funnelCounts = {};
    let topPrograms = [];
    let weeklyTrend = [];
    let medicationInsights = [];
    let dbAvailable = false;

    try {
      const db = getDb();
      const [connResult, reachResult, progResult, trendResult] = await Promise.all([
        db`
          SELECT
            COUNT(*) FILTER (WHERE event_name IN ('copay_card_click', 'foundation_click', 'pap_click')) as total_connections,
            COUNT(*) FILTER (WHERE event_name = 'copay_card_click') as copay_connections,
            COUNT(*) FILTER (WHERE event_name = 'foundation_click') as foundation_connections,
            COUNT(*) FILTER (WHERE event_name = 'pap_click') as pap_connections,
            COUNT(*) FILTER (WHERE event_name = 'quiz_start') as quiz_starts,
            COUNT(*) FILTER (WHERE event_name = 'quiz_complete') as quiz_completions,
            COUNT(*) FILTER (WHERE event_name = 'med_search') as med_searches,
            COUNT(DISTINCT COALESCE(meta_json->>'sessionId', CONCAT(COALESCE(partner, 'public'), '-', page_source))) as unique_sessions,
            COUNT(DISTINCT partner) FILTER (WHERE partner IS NOT NULL) as partner_count
          FROM events WHERE ts >= ${cutoff}
        `,
        db`SELECT event_name, COUNT(*) as count FROM events WHERE ts >= ${cutoff} GROUP BY event_name`,
        db`SELECT program_id, program_type, COUNT(*) as clicks FROM events WHERE program_id IS NOT NULL AND ts >= ${cutoff} GROUP BY program_id, program_type ORDER BY clicks DESC LIMIT 15`,
        db`
          SELECT DATE_TRUNC('week', ts) as week, COUNT(*) as events,
            COUNT(*) FILTER (WHERE event_name IN ('copay_card_click', 'foundation_click', 'pap_click')) as program_connections
          FROM events WHERE ts >= ${cutoff} GROUP BY DATE_TRUNC('week', ts) ORDER BY week ASC
        `,
      ]);

      connections = connResult[0] || {};
      reachResult.forEach(r => { funnelCounts[r.event_name] = parseInt(r.count); });
      topPrograms = progResult;
      weeklyTrend = trendResult;
      dbAvailable = true;

      // Medication insights
      try {
        const topMeds = await db`
          SELECT medication_name, interaction_type, COUNT(*) as count
          FROM medication_tracking WHERE created_at >= ${cutoff}
          GROUP BY medication_name, interaction_type ORDER BY count DESC LIMIT 30
        `;
        const medMap = {};
        topMeds.forEach(row => {
          if (!medMap[row.medication_name]) medMap[row.medication_name] = { name: row.medication_name, searches: 0, views: 0, clicks: 0, adds: 0 };
          const m = medMap[row.medication_name];
          if (row.interaction_type === 'search') m.searches = parseInt(row.count);
          if (row.interaction_type === 'view') m.views = parseInt(row.count);
          if (row.interaction_type === 'program_click') m.clicks = parseInt(row.count);
          if (row.interaction_type === 'add_to_list') m.adds = parseInt(row.count);
        });
        medicationInsights = Object.values(medMap).sort((a, b) => (b.searches + b.views + b.clicks) - (a.searches + a.views + a.clicks)).slice(0, 15);
      } catch { /* table may not exist */ }
    } catch (dbErr) {
      console.warn('Events table query failed:', dbErr.message);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        period: { days, start: cutoff.split('T')[0], end: now.toISOString().split('T')[0] },
        dataSources: { netlify: hasNetlifyData, database: dbAvailable },
        traffic: {
          pageviews: hasNetlifyData ? netlifyPageviews : 0,
          uniqueVisitors: hasNetlifyData ? netlifyVisitors : 0,
          topPages: (topPagesData?.data || []).map(p => ({ path: p.resource, count: p.count || 0 })),
          topSources: (topSourcesData?.data || []).map(s => ({ source: s.resource || 'Direct', count: s.count || 0 })),
        },
        programConnections: {
          total: parseInt(connections.total_connections || 0),
          copay: parseInt(connections.copay_connections || 0),
          foundation: parseInt(connections.foundation_connections || 0),
          pap: parseInt(connections.pap_connections || 0),
          quizStarts: parseInt(connections.quiz_starts || 0),
          quizCompletions: parseInt(connections.quiz_completions || 0),
          medSearches: parseInt(connections.med_searches || 0),
        },
        funnel: {
          pageViews: funnelCounts.page_view || 0,
          quizStarts: funnelCounts.quiz_start || 0,
          quizCompletes: funnelCounts.quiz_complete || 0,
          medSearches: funnelCounts.med_search || 0,
          applicationClicks: (funnelCounts.copay_card_click || 0) + (funnelCounts.foundation_click || 0) + (funnelCounts.pap_click || 0),
        },
        topPrograms: topPrograms.map(p => ({ programId: p.program_id, programType: p.program_type, clicks: parseInt(p.clicks) })),
        medicationInsights,
        weeklyTrend: weeklyTrend.map(w => ({ week: w.week, events: parseInt(w.events), programConnections: parseInt(w.program_connections) })),
      }),
    };
  } catch (error) {
    console.error('Impact report error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
}
