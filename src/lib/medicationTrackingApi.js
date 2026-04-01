/**
 * Medication Tracking API Client
 * Tracks user interactions with medications (searches, views, program clicks)
 * All tracking calls fail silently to never break the user experience
 */

const API_BASE = '/.netlify/functions/medication-tracking';

/**
 * Track a medication interaction
 * @param {string} medicationName - Name of the medication
 * @param {string} interactionType - Type: 'search', 'view', 'add_to_list', 'program_click'
 * @param {string|null} searchQuery - Original search query (for search interactions)
 */
export async function trackMedication(medicationName, interactionType, searchQuery = null) {
  try {
    await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        medicationName,
        interactionType,
        searchQuery,
      }),
    });
  } catch {
    // Fail silently — never let tracking break the user experience
  }
}

/**
 * Track a medication search
 */
export function trackMedicationSearch(medicationName, searchQuery) {
  return trackMedication(medicationName, 'search', searchQuery);
}

/**
 * Track a medication view (detail page or expanded info)
 */
export function trackMedicationView(medicationName) {
  return trackMedication(medicationName, 'view');
}

/**
 * Track when a user adds a medication to their list
 */
export function trackMedicationAddToList(medicationName) {
  return trackMedication(medicationName, 'add_to_list');
}

/**
 * Track when a user clicks a program link (copay card, PAP, etc.)
 */
export function trackProgramClick(medicationName) {
  return trackMedication(medicationName, 'program_click');
}
