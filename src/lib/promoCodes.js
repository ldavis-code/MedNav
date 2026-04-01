/**
 * Promo Code System
 * Manages promotional code validation, redemption, and feature access.
 * Codes are stored in localStorage after redemption.
 */

const STORAGE_KEY = 'mednav_promo_codes';

const VALID_CODES = {
  FREEQUIZ: { features: ['quiz'], description: 'Free access to the guided quiz' },
  FREECALC: { features: ['calculator'], description: 'Free access to the savings calculator' },
  FREEACCESS: { features: ['quiz', 'calculator'], description: 'Full free access' },
  MEDNAV2026: { features: ['quiz', 'calculator'], description: 'Full free access' },
  PATIENT2026: { features: ['quiz', 'calculator'], description: 'Patient advocacy access' },
};

/**
 * Normalize a promo code for lookup
 */
function normalize(code) {
  if (!code || typeof code !== 'string' || code.trim().length < 3) return null;
  return code.trim().toUpperCase();
}

/**
 * Validate a promo code without redeeming it
 * @param {string} code
 * @returns {{ valid: boolean, features?: string[], description?: string }}
 */
export function validatePromoCode(code) {
  const normalized = normalize(code);
  if (!normalized) return { valid: false };

  const entry = VALID_CODES[normalized];
  if (!entry) return { valid: false };

  // Check expiration if set
  if (entry.expires && Date.now() > entry.expires) {
    return { valid: false };
  }

  return { valid: true, features: entry.features, description: entry.description };
}

/**
 * Redeem a promo code (validates and stores it)
 * @param {string} code
 * @returns {{ success: boolean, error?: string, features?: string[] }}
 */
export function redeemPromoCode(code) {
  const validation = validatePromoCode(code);
  if (!validation.valid) {
    return { success: false, error: 'Invalid or expired promo code' };
  }

  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const normalized = normalize(code);

    // Check for duplicate
    if (existing.some(e => e.code === normalized)) {
      return { success: false, error: 'This code has already been redeemed' };
    }

    existing.push({
      code: normalized,
      features: validation.features,
      redeemedAt: new Date().toISOString(),
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    return { success: true, features: validation.features };
  } catch {
    return { success: false, error: 'Could not save promo code' };
  }
}

/**
 * Check if user has access to a specific feature via promo codes
 * @param {string} feature - 'quiz' or 'calculator'
 * @returns {boolean}
 */
export function hasPromoAccess(feature) {
  try {
    const codes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return codes.some(c => c.features?.includes(feature));
  } catch {
    return false;
  }
}

/**
 * Check if any promo codes have been redeemed
 * @returns {boolean}
 */
export function hasAnyPromoAccess() {
  try {
    const codes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return codes.length > 0;
  } catch {
    return false;
  }
}
