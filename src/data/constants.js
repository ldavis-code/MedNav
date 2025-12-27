// Last updated date - Update this when content changes
// Format: "Month Day, Year" (e.g., "November 24, 2025")
export const LAST_UPDATED = "December 27, 2025";

// User roles
export const Role = {
    PATIENT: 'Patient',
    CAREPARTNER: 'Carepartner / Family',
    SOCIAL_WORKER: 'Social Worker / Coordinator',
};

// Treatment status
export const TreatmentStatus = {
    NOT_STARTED: 'Not yet started',
    JUST_STARTED: 'Just started (less than 3 months)',
    ONGOING: 'Ongoing (more than 3 months)',
};

// Health conditions
export const HealthCondition = {
    AUTOIMMUNE: 'Autoimmune disease (lupus, RA, MS)',
    CANCER: 'Cancer',
    DIABETES: 'Diabetes',
    HEART: 'Heart disease or heart failure',
    HIGH_BP: 'High blood pressure',
    KIDNEY: 'Kidney disease',
    LIVER: 'Liver disease',
    LUNG: 'Lung disease (COPD, asthma)',
    MENTAL_HEALTH: 'Mental health (depression, anxiety)',
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

// For backward compatibility
export const OrganType = HealthCondition;
export const medicationStatus = TreatmentStatus;
export const medicationStage = {
    PRE: 'Not yet started',
    POST: 'Currently taking',
    BOTH: 'Both',
};
