// Last updated date - Update this when content changes
// Format: "Month Day, Year" (e.g., "November 24, 2025")
export const LAST_UPDATED = "December 27, 2025";

// User roles
export const Role = {
    PATIENT: 'Me — I take medicine myself',
    CAREPARTNER: 'Someone I care for — I help a family member or friend with their medicine',
};

// Treatment status
export const TreatmentStatus = {
    NOT_STARTED: 'Not yet — My doctor wants me to start soon',
    JUST_STARTED: 'Yes, I just started — Less than 3 months ago',
    ONGOING: 'Yes, I\'ve been taking it — More than 3 months',
};

// Health conditions
export const HealthCondition = {
    AUTOIMMUNE: 'Autoimmune disease (like lupus, rheumatoid arthritis, or MS)',
    CANCER: 'Cancer',
    DIABETES: 'Diabetes (high blood sugar)',
    GI: 'Digestive disorders (IBS, IBD, Crohn\'s, colitis)',
    HEART: 'Heart disease or heart failure',
    HIGH_BP: 'High blood pressure',
    KIDNEY: 'Kidney disease',
    LIVER: 'Liver disease (including hepatitis, cirrhosis, or fatty liver)',
    LUNG: 'Lung disease (COPD, asthma, pulmonary fibrosis)',
    MENTAL_HEALTH: 'Mental health (depression, anxiety, bipolar)',
    OTHER: 'Other',
};

// Insurance - Do you have insurance?
export const HasInsurance = {
    YES: 'Yes',
    NO: 'No',
    NOT_SURE: 'I\'m not sure',
};

// Insurance source
export const InsuranceSource = {
    EMPLOYER: 'My job or my spouse\'s job',
    MEDICARE: 'Medicare (the program for people 65+ or with disabilities)',
    MEDICAID: 'Medicaid (state program for people with lower income)',
    MARKETPLACE: 'I bought it myself (from Healthcare.gov or an insurance company)',
    MILITARY: 'Military or VA (Veterans)',
    NOT_SURE: 'I\'m not sure',
};

// Has prescription drug plan
export const HasDrugPlan = {
    YES: 'Yes',
    NO: 'No',
    NOT_SURE: 'I\'m not sure',
};

// Legacy insurance types for backward compatibility
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
