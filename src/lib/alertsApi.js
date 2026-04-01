/**
 * Alerts Subscription API Client
 * Handles email signups for medication assistance alerts
 */

const API_BASE = '/.netlify/functions/subscribe-alerts';
const MEDICATIONS_STORAGE_KEY = 'mednav_my_medications';

/**
 * Get medications from localStorage
 * @returns {Array} Array of medication objects
 */
export function getMedicationsFromStorage() {
  try {
    const stored = localStorage.getItem(MEDICATIONS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading medications from localStorage:', e);
  }
  return [];
}

/**
 * Subscribe to medication assistance alerts
 * @param {Object} options
 * @param {string} options.email - User's email address
 * @param {boolean} options.wantsUpdates - Whether user wants ongoing updates
 * @param {Array} [options.medications] - Optional medications array (defaults to localStorage)
 * @returns {Promise<Object>} Response with success status
 */
export async function subscribeToAlerts({ email, wantsUpdates = false, medications = null }) {
  const medicationList = medications || getMedicationsFromStorage();

  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        medications: medicationList,
        wantsUpdates,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to subscribe');
    }

    return data;
  } catch (error) {
    console.error('Error subscribing to alerts:', error);
    throw error;
  }
}

/**
 * Simple email validation
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
