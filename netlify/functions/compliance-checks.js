/**
 * Compliance Auto-Checks
 * Runs automated compliance checks (deploy status, HTTPS, FHIR, etc.)
 * and stores results in compliance_auto_checks table.
 */

import { neon } from '@neondatabase/serverless';

async function saveCheck(db, checkType, checkName, status, detail) {
  try {
    await db`
      INSERT INTO compliance_auto_checks (check_type, check_name, status, detail)
      VALUES (${checkType}, ${checkName}, ${status}, ${detail})
    `;
  } catch (e) {
    console.error('Failed to save check:', e.message);
  }
}

async function checkNetlifyDeploy(db) {
  const siteId = process.env.NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_API_TOKEN;
  if (!siteId || !token) {
    await saveCheck(db, 'netlify_deploy', 'Netlify Deploy Status', 'warn', 'NETLIFY_SITE_ID or NETLIFY_API_TOKEN not configured');
    return;
  }
  try {
    const res = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/deploys?per_page=1`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const [latest] = await res.json();
    if (!latest) { await saveCheck(db, 'netlify_deploy', 'Netlify Deploy Status', 'warn', 'No deploys found'); return; }
    await saveCheck(db, 'netlify_deploy', 'Netlify Latest Deploy',
      latest.state === 'ready' ? 'pass' : 'fail',
      `State: ${latest.state} | Branch: ${latest.branch} | Deployed: ${latest.created_at}`
    );
    const siteRes = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}`, { headers: { Authorization: `Bearer ${token}` } });
    const site = await siteRes.json();
    const sslReady = site.ssl === 'ready' || site.force_ssl;
    await saveCheck(db, 'https', 'HTTPS / SSL Certificate', sslReady ? 'pass' : 'fail', sslReady ? 'SSL active' : `SSL state: ${site.ssl}`);
  } catch (e) {
    await saveCheck(db, 'netlify_deploy', 'Netlify Deploy Status', 'fail', e.message);
  }
}

async function checkHTTPS(db) {
  const url = process.env.URL || 'https://medicationnavigator.com';
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    const isHTTPS = res.url.startsWith('https://');
    await saveCheck(db, 'https', 'Production HTTPS Check', isHTTPS && res.ok ? 'pass' : 'fail', `URL: ${res.url} | Status: ${res.status}`);
    const hsts = res.headers.get('strict-transport-security');
    await saveCheck(db, 'https', 'HSTS Header Present', hsts ? 'pass' : 'warn', hsts ? `HSTS: ${hsts}` : 'HSTS header missing');
  } catch (e) {
    await saveCheck(db, 'https', 'Production HTTPS Check', 'fail', e.message);
  }
}

async function checkEpicFHIR(db) {
  const fhirBase = process.env.EPIC_FHIR_BASE_URL || 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4';
  try {
    const res = await fetch(`${fhirBase}/metadata`, {
      signal: AbortSignal.timeout(8000),
      headers: { Accept: 'application/fhir+json' },
    });
    if (res.ok) {
      const meta = await res.json();
      await saveCheck(db, 'epic_fhir', 'Epic FHIR Metadata', 'pass',
        `FHIR version: ${meta.fhirVersion || 'unknown'} | Software: ${meta.software?.name || 'Epic FHIR'}`);

      const smartRes = await fetch(`${fhirBase}/.well-known/smart-configuration`, { headers: { Accept: 'application/json' } });
      if (smartRes.ok) {
        const smart = await smartRes.json();
        await saveCheck(db, 'epic_fhir', 'SMART on FHIR Config', 'pass',
          `Auth: ${smart.authorization_endpoint || 'n/a'} | EHR launch: ${smart.capabilities?.includes('launch-ehr') || false}`);
      } else {
        await saveCheck(db, 'epic_fhir', 'SMART on FHIR Config', 'warn', `Returned ${smartRes.status}`);
      }
    } else {
      await saveCheck(db, 'epic_fhir', 'Epic FHIR Metadata', 'warn', `HTTP ${res.status}`);
    }
  } catch (e) {
    await saveCheck(db, 'epic_fhir', 'Epic FHIR Metadata', e.name === 'AbortError' ? 'warn' : 'fail',
      e.name === 'AbortError' ? 'Timed out (8s)' : e.message);
  }
}

export async function handler(event) {
  const db = neon(process.env.DATABASE_URL);
  await Promise.allSettled([checkNetlifyDeploy(db), checkHTTPS(db), checkEpicFHIR(db)]);

  const results = await db`
    SELECT DISTINCT ON (check_name) check_type, check_name, status, detail, checked_at
    FROM compliance_auto_checks ORDER BY check_name, checked_at DESC
  `;

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ checked_at: new Date().toISOString(), results }),
  };
}
