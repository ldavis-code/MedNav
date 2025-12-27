// Last updated date - Update this when content changes
// Format: "Month Day, Year" (e.g., "November 24, 2025")
export const LAST_UPDATED = "December 27, 2025";

// User roles
export const Role = {
    PATIENT: 'Patient',
    CAREPARTNER: 'Carepartner / Family',
    SOCIAL_WORKER: 'Social Worker / Coordinator',
};

// medication status
export const medicationStatus = {
    PRE_EVAL: 'Pre-medication (Evaluation/Waitlist)',
    POST_ACUTE: 'Post-medication (Within 1st year)',
    POST_STABLE: 'Post-medication (1+ years)',
};

// Organ types
export const OrganType = {
    KIDNEY: 'Kidney',
    LIVER: 'Liver',
    HEART: 'Heart',
    LUNG: 'Lung',
    PANCREAS: 'Pancreas',
    MULTI: 'Multi-organ',
    OTHER: 'Other',
};

// Insurance types
export const InsuranceType = {
    COMMERCIAL: 'Commercial / Employer',
    MEDICARE: 'Medicare',
    MEDICAID: 'Medicaid (State)',
    TRICARE_VA: 'TRICARE / VA',
    IHS: 'Indian Health Service / Tribal',
    UNINSURED: 'Uninsured / Self-pay',
    OTHER: 'Other / Not Sure',
};

// Financial status
export const FinancialStatus = {
    MANAGEABLE: 'Manageable',
    CHALLENGING: 'Challenging',
    UNAFFORDABLE: 'Unaffordable',
    CRISIS: 'Crisis',
};

// medication stage
export const medicationStage = {
    PRE: 'Pre-medication',
    POST: 'Post-medication',
    BOTH: 'Both (Pre & Post)',
};
