/**
 * Medications API Client
 * Fetches medication data from the Neon database via Netlify functions
 */

const API_BASE = '/.netlify/functions/medications';

// Cache for medications data
let cachedMedications = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Check if cache is still valid
 */
function isCacheValid() {
    return cachedMedications && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION);
}

/**
 * Fetch all medications from the database
 * Results are cached for 5 minutes
 */
export async function fetchAllMedications() {
    // Return cached data if still valid
    if (isCacheValid()) {
        return cachedMedications;
    }

    try {
        const response = await fetch(API_BASE);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Update cache
        cachedMedications = data.medications;
        cacheTimestamp = Date.now();

        return data.medications;
    } catch (error) {
        console.error('Error fetching medications:', error);

        // Return cached data even if stale, as fallback
        if (cachedMedications) {
            console.warn('Returning stale cached medications data');
            return cachedMedications;
        }

        throw error;
    }
}

/**
 * Fetch a single medication by ID
 */
export async function fetchMedicationById(id) {
    // Check cache first
    if (isCacheValid() && cachedMedications) {
        const cached = cachedMedications.find(m => m.id === id);
        if (cached) return cached;
    }

    try {
        const response = await fetch(`${API_BASE}?id=${encodeURIComponent(id)}`);

        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.medication;
    } catch (error) {
        console.error('Error fetching medication by ID:', error);
        throw error;
    }
}

/**
 * Search medications by name (generic or brand)
 */
export async function searchMedications(query) {
    if (!query || query.length < 2) {
        return [];
    }

    try {
        const response = await fetch(`${API_BASE}?search=${encodeURIComponent(query)}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.medications;
    } catch (error) {
        console.error('Error searching medications:', error);
        throw error;
    }
}

/**
 * Fetch medications by category
 */
export async function fetchMedicationsByCategory(category) {
    try {
        const response = await fetch(`${API_BASE}?category=${encodeURIComponent(category)}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.medications;
    } catch (error) {
        console.error('Error fetching medications by category:', error);
        throw error;
    }
}

/**
 * Clear the medications cache
 * Useful when you know data has been updated
 */
export function clearMedicationsCache() {
    cachedMedications = null;
    cacheTimestamp = null;
}

/**
 * Preload medications data
 * Call this early in app initialization for better UX
 */
export async function preloadMedications() {
    try {
        await fetchAllMedications();
        return true;
    } catch (error) {
        console.warn('Failed to preload medications:', error);
        return false;
    }
}
