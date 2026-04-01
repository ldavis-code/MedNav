/**
 * Epic Medications API
 * Fetches a patient's medications from their health system via FHIR R4.
 * Matches against our medication database and finds assistance programs.
 * Includes retry logic for token propagation delays.
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

const FHIR_HEADERS = (token) => ({
  Authorization: `Bearer ${token}`,
  Accept: 'application/fhir+json',
});

/**
 * FHIR GET with retry on 403/401 (handles token propagation delays).
 */
async function fhirFetchWithRetry(url, accessToken, { retries = 1, delayMs = 1000 } = {}) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(url, { headers: FHIR_HEADERS(accessToken) });
    if (res.ok || (res.status !== 403 && res.status !== 401)) return res;
    if (attempt < retries) {
      console.log(`FHIR request returned ${res.status}, retrying in ${delayMs}ms (attempt ${attempt + 1}/${retries + 1})`);
      await new Promise(r => setTimeout(r, delayMs));
    } else {
      return res;
    }
  }
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers };
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const accessToken = body.access_token || body.accessToken;
    const patientId = body.patient_id || body.patientId || body.patient;
    const fhirBaseUrl = body.fhir_base_url || process.env.EPIC_FHIR_BASE_URL;

    if (!accessToken) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'access_token is required' }) };
    }

    if (!fhirBaseUrl) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'fhir_base_url is required' }) };
    }

    // Step 1: Validate token with Patient endpoint (warms Epic's token cache)
    if (patientId) {
      const patientUrl = `${fhirBaseUrl}/Patient/${patientId}`;
      const patientRes = await fetch(patientUrl, { headers: FHIR_HEADERS(accessToken) });
      if (!patientRes.ok && (patientRes.status === 403 || patientRes.status === 401)) {
        const wwwAuth = patientRes.headers.get('WWW-Authenticate') || 'none';
        return {
          statusCode: patientRes.status, headers,
          body: JSON.stringify({
            error: 'Your health system authorization does not have sufficient permissions. Please reconnect and approve all requested permissions.',
            status: patientRes.status,
            wwwAuthenticate: wwwAuth,
          }),
        };
      }
    }

    // Step 2: Fetch MedicationRequests with retry logic
    const fhirUrl = patientId
      ? `${fhirBaseUrl}/MedicationRequest?patient=${patientId}&status=active`
      : `${fhirBaseUrl}/MedicationRequest?status=active`;

    const fhirRes = await fhirFetchWithRetry(fhirUrl, accessToken, { retries: 2, delayMs: 1500 });

    if (!fhirRes.ok) {
      const wwwAuth = fhirRes.headers.get('WWW-Authenticate') || 'none';
      console.error('FHIR medication fetch failed:', fhirRes.status);

      let userError = 'Failed to fetch medications from health system';
      if (fhirRes.status === 403) {
        userError = 'Your health system did not grant permission to read medication data. This may happen if required scopes were not approved during sign-in.';
      } else if (fhirRes.status === 401) {
        userError = 'Your authorization has expired. Please reconnect to your health system.';
      }

      return {
        statusCode: fhirRes.status, headers,
        body: JSON.stringify({ error: userError, status: fhirRes.status, wwwAuthenticate: wwwAuth }),
      };
    }

    const bundle = await fhirRes.json();
    const entries = bundle.entry || [];

    // Extract medication names from FHIR resources
    const fhirMedications = [];
    for (const entry of entries) {
      const resource = entry.resource;
      if (resource?.resourceType !== 'MedicationRequest') continue;

      const name = resource.medicationCodeableConcept?.text
        || resource.medicationCodeableConcept?.coding?.[0]?.display
        || resource.medicationReference?.display
        || null;

      if (name) {
        fhirMedications.push({
          name,
          status: resource.status,
          dosage: resource.dosageInstruction?.[0]?.text || '',
          prescriber: resource.requester?.display || '',
          dateWritten: resource.authoredOn || '',
          rxNormCode: resource.medicationCodeableConcept?.coding?.find(
            c => c.system === 'http://www.nlm.nih.gov/research/umls/rxnorm'
          )?.code || '',
        });
      }
    }

    // Match against our medication database
    const db = getDb();
    const allMeds = await db`SELECT id, name, generic_name FROM medications`;

    const matched = [];
    const unmatched = [];

    for (const fhirMed of fhirMedications) {
      const lower = fhirMed.name.toLowerCase();
      const match = allMeds.find(m =>
        lower.includes(m.name.toLowerCase()) ||
        (m.generic_name && lower.includes(m.generic_name.toLowerCase())) ||
        m.name.toLowerCase().includes(lower.split(' ')[0].toLowerCase())
      );

      if (match) {
        if (!matched.includes(match.id)) {
          matched.push(match.id);
        }
      } else {
        unmatched.push(fhirMed.name);
      }
    }

    // Find assistance programs for matched medications
    let assistancePrograms = [];
    if (matched.length > 0) {
      assistancePrograms = await db`
        SELECT DISTINCT p.id, p.name, p.type, p.medication_id
        FROM programs p
        WHERE p.medication_id = ANY(${matched})
      `;
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        medications: fhirMedications,
        matched,
        unmatched,
        fhirMedicationCount: fhirMedications.length,
        assistancePrograms,
      }),
    };
  } catch (err) {
    console.error('Epic medications error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error' }) };
  }
}
