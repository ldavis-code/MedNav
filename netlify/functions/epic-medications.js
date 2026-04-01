/**
 * Epic Medications API
 * Fetches a patient's medications from their health system via FHIR R4.
 * Matches against our medication database and finds assistance programs.
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

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers };
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { access_token, fhir_base_url, patient_id } = JSON.parse(event.body || '{}');

    if (!access_token || !fhir_base_url) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'access_token and fhir_base_url required' }) };
    }

    // Fetch MedicationRequest resources from FHIR
    const fhirUrl = patient_id
      ? `${fhir_base_url}/MedicationRequest?patient=${patient_id}&status=active`
      : `${fhir_base_url}/MedicationRequest?status=active`;

    const fhirRes = await fetch(fhirUrl, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/fhir+json',
      },
    });

    if (!fhirRes.ok) {
      console.error('FHIR medication fetch failed:', fhirRes.status);
      return { statusCode: fhirRes.status, headers, body: JSON.stringify({ error: 'Failed to fetch medications from health system' }) };
    }

    const bundle = await fhirRes.json();
    const entries = bundle.entry || [];

    // Extract medication names from FHIR resources
    const fhirMedNames = [];
    for (const entry of entries) {
      const resource = entry.resource;
      if (resource?.resourceType !== 'MedicationRequest') continue;

      const display = resource.medicationCodeableConcept?.text
        || resource.medicationCodeableConcept?.coding?.[0]?.display
        || null;

      if (display) {
        fhirMedNames.push(display);
      }
    }

    // Match against our medication database
    const db = getDb();
    const allMeds = await db`SELECT id, name, generic_name FROM medications`;

    const matched = [];
    const unmatched = [];

    for (const fhirName of fhirMedNames) {
      const lower = fhirName.toLowerCase();
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
        unmatched.push(fhirName);
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
        matched,
        unmatched,
        fhirMedicationCount: fhirMedNames.length,
        assistancePrograms,
      }),
    };
  } catch (err) {
    console.error('Epic medications error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error' }) };
  }
}
