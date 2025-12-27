/**
 * Savings Tracker API Client
 * Handles all interactions with the savings-tracker Netlify function
 */

const API_BASE = '/.netlify/functions/savings-tracker';
const STORAGE_KEY = 'tmn_savings_user_id';
const LOCAL_CACHE_KEY = 'tmn_savings_cache';

// Get or create a persistent user ID (stored in localStorage)
export function getUserId() {
    let userId = localStorage.getItem(STORAGE_KEY);
    if (!userId) {
        userId = 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
        localStorage.setItem(STORAGE_KEY, userId);
    }
    return userId;
}

/**
 * Log a new savings entry
 */
export async function logSavings({
    medicationId,
    medicationName,
    programName,
    programType,
    originalPrice,
    paidPrice,
    fillDate,
    notes
}) {
    const userId = getUserId();

    try {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId,
                medicationId,
                medicationName,
                programName,
                programType,
                originalPrice,
                paidPrice,
                fillDate,
                notes
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to log savings');
        }

        const result = await response.json();

        // Update local cache with new totals
        updateLocalCache(result.totalSaved, result.totalEntries);

        return result;
    } catch (error) {
        console.error('Error logging savings:', error);

        // Fallback: store locally if API fails
        storeLocalFallback({
            medicationId,
            medicationName,
            programName,
            programType,
            originalPrice,
            paidPrice,
            fillDate,
            notes
        });

        throw error;
    }
}

/**
 * Fetch savings summary (totals, monthly breakdown, by program)
 */
export async function fetchSavingsSummary() {
    const userId = getUserId();

    try {
        const response = await fetch(`${API_BASE}?userId=${userId}&view=summary`);

        if (!response.ok) {
            throw new Error('Failed to fetch savings summary');
        }

        const data = await response.json();

        // Update local cache
        if (data.summary) {
            updateLocalCache(data.summary.total_saved, data.summary.total_entries);
        }

        return data;
    } catch (error) {
        console.error('Error fetching savings summary:', error);

        // Return cached data if available
        return getLocalCache();
    }
}

/**
 * Fetch individual savings entries
 */
export async function fetchSavingsEntries(limit = 50) {
    const userId = getUserId();

    try {
        const response = await fetch(`${API_BASE}?userId=${userId}&limit=${limit}`);

        if (!response.ok) {
            throw new Error('Failed to fetch savings entries');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching savings entries:', error);

        // Return local fallback entries
        const fallback = getLocalFallbackEntries();
        return { entries: fallback };
    }
}

/**
 * Delete a savings entry
 */
export async function deleteSavingsEntry(entryId) {
    const userId = getUserId();

    try {
        const response = await fetch(`${API_BASE}?id=${entryId}&userId=${userId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete entry');
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting savings entry:', error);
        throw error;
    }
}

// Local storage helpers for offline support
function updateLocalCache(totalSaved, totalEntries) {
    try {
        localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify({
            totalSaved: parseFloat(totalSaved) || 0,
            totalEntries: parseInt(totalEntries) || 0,
            lastUpdated: new Date().toISOString()
        }));
    } catch (e) {
        console.error('Error updating local cache:', e);
    }
}

function getLocalCache() {
    try {
        const cached = localStorage.getItem(LOCAL_CACHE_KEY);
        if (cached) {
            const data = JSON.parse(cached);
            return {
                summary: {
                    total_saved: data.totalSaved,
                    total_entries: data.totalEntries
                },
                monthly: [],
                byProgram: [],
                fromCache: true
            };
        }
    } catch (e) {
        console.error('Error reading local cache:', e);
    }
    return { summary: {}, monthly: [], byProgram: [], fromCache: true };
}

const LOCAL_FALLBACK_KEY = 'tmn_savings_pending';

function storeLocalFallback(entry) {
    try {
        const pending = JSON.parse(localStorage.getItem(LOCAL_FALLBACK_KEY) || '[]');
        pending.push({
            ...entry,
            id: 'local_' + Date.now(),
            created_at: new Date().toISOString(),
            amount_saved: parseFloat(entry.originalPrice) - parseFloat(entry.paidPrice)
        });
        localStorage.setItem(LOCAL_FALLBACK_KEY, JSON.stringify(pending));
    } catch (e) {
        console.error('Error storing local fallback:', e);
    }
}

function getLocalFallbackEntries() {
    try {
        return JSON.parse(localStorage.getItem(LOCAL_FALLBACK_KEY) || '[]');
    } catch (e) {
        return [];
    }
}

/**
 * Sync pending local entries to the server
 */
export async function syncPendingEntries() {
    const pending = getLocalFallbackEntries();
    if (pending.length === 0) return { synced: 0 };

    let synced = 0;
    const stillPending = [];

    for (const entry of pending) {
        try {
            await logSavings(entry);
            synced++;
        } catch (error) {
            stillPending.push(entry);
        }
    }

    localStorage.setItem(LOCAL_FALLBACK_KEY, JSON.stringify(stillPending));
    return { synced, remaining: stillPending.length };
}

// Program type display names
export const programTypeLabels = {
    copay_card: 'Copay Card',
    pap: 'Patient Assistance Program',
    foundation: 'Foundation Grant',
    discount_card: 'Discount Card (GoodRx, etc.)',
    negotiated_price: 'Medicare Negotiated Price',
    other: 'Other'
};
