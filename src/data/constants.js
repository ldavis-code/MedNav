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
    // Kidney
    CKD_ESRD: 'Chronic Kidney Disease / End-Stage Renal Disease (ESRD)',
    // Liver
    HEPATITIS_C: 'Hepatitis C',
    LIVER: 'Liver disease (cirrhosis, fatty liver)',
    // Infectious
    HIV_AIDS: 'HIV/AIDS',
    // Autoimmune
    MS: 'Multiple Sclerosis',
    RA: 'Rheumatoid Arthritis',
    PSORIASIS: 'Psoriasis / Psoriatic Arthritis',
    // Digestive
    IBD: 'Inflammatory Bowel Disease (Crohn\'s / Ulcerative Colitis)',
    // Diabetes
    DIABETES: 'Type 2 Diabetes',
    // Cancers
    BLOOD_CANCER: 'Blood Cancers (Leukemia, Lymphoma, Multiple Myeloma)',
    BREAST_CANCER: 'Breast Cancer',
    PROSTATE_CANCER: 'Prostate Cancer',
    LUNG_CANCER: 'Lung Cancer (Non-Small Cell)',
    // Heart & Lung
    HEART_FAILURE: 'Heart Failure',
    PULMONARY: 'Pulmonary Fibrosis / Pulmonary Hypertension',
    // Mental Health
    MENTAL_HEALTH: 'Mental health (depression, anxiety, bipolar)',
    // Other
    HIGH_BP: 'High blood pressure',
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
