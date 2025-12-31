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

// Health conditions - organized by category for the searchable UI
export const HealthCondition = {
    // Diabetes
    TYPE_1_DIABETES: 'Type 1 Diabetes',
    TYPE_2_DIABETES: 'Type 2 Diabetes',
    GESTATIONAL_DIABETES: 'Gestational Diabetes',

    // Respiratory
    ASTHMA: 'Asthma',
    COPD: 'COPD (Chronic Obstructive Pulmonary Disease)',
    CYSTIC_FIBROSIS: 'Cystic Fibrosis',
    PULMONARY: 'Pulmonary Fibrosis / Pulmonary Hypertension',
    SLEEP_APNEA: 'Sleep Apnea',

    // Neurological
    EPILEPSY: 'Epilepsy / Seizure Disorders',
    PARKINSONS: 'Parkinson\'s Disease',
    ALZHEIMERS: 'Alzheimer\'s / Dementia',
    MS: 'Multiple Sclerosis',
    MIGRAINE: 'Chronic Migraine',
    NEUROPATHY: 'Neuropathy (Nerve Damage)',
    ALS: 'ALS (Amyotrophic Lateral Sclerosis)',

    // Mental Health
    DEPRESSION: 'Depression',
    ANXIETY: 'Anxiety Disorders',
    BIPOLAR: 'Bipolar Disorder',
    SCHIZOPHRENIA: 'Schizophrenia',
    PTSD: 'PTSD (Post-Traumatic Stress Disorder)',
    OCD: 'OCD (Obsessive-Compulsive Disorder)',
    ADHD: 'ADHD (Attention Deficit Hyperactivity Disorder)',
    EATING_DISORDERS: 'Eating Disorders',

    // Heart & Vascular
    HEART_FAILURE: 'Heart Failure',
    CORONARY_ARTERY_DISEASE: 'Coronary Artery Disease',
    ATRIAL_FIBRILLATION: 'Atrial Fibrillation (AFib)',
    HIGH_BP: 'High Blood Pressure (Hypertension)',
    HIGH_CHOLESTEROL: 'High Cholesterol',
    PERIPHERAL_ARTERY_DISEASE: 'Peripheral Artery Disease',
    DVT_PE: 'Blood Clots (DVT / Pulmonary Embolism)',

    // Cancers - Blood
    BLOOD_CANCER: 'Blood Cancers (Leukemia, Lymphoma, Myeloma)',

    // Cancers - Solid Tumors
    BREAST_CANCER: 'Breast Cancer',
    PROSTATE_CANCER: 'Prostate Cancer',
    LUNG_CANCER: 'Lung Cancer',
    COLORECTAL_CANCER: 'Colorectal Cancer',
    MELANOMA: 'Melanoma / Skin Cancer',
    OVARIAN_CANCER: 'Ovarian Cancer',
    PANCREATIC_CANCER: 'Pancreatic Cancer',
    THYROID_CANCER: 'Thyroid Cancer',
    BLADDER_CANCER: 'Bladder Cancer',
    KIDNEY_CANCER: 'Kidney Cancer',
    STOMACH_CANCER: 'Stomach / Esophageal Cancer',
    HEAD_NECK_CANCER: 'Head and Neck Cancer',
    BRAIN_CANCER: 'Brain Cancer',
    LIVER_CANCER: 'Liver Cancer',
    SARCOMA: 'Sarcoma',

    // Digestive / GI
    CROHNS_DISEASE: 'Crohn\'s Disease',
    ULCERATIVE_COLITIS: 'Ulcerative Colitis',
    IBS: 'Irritable Bowel Syndrome (IBS)',
    GERD: 'GERD / Acid Reflux',
    CELIAC: 'Celiac Disease',

    // Kidney
    CKD_ESRD: 'Chronic Kidney Disease / ESRD',

    // Liver
    HEPATITIS_C: 'Hepatitis C',
    HEPATITIS_B: 'Hepatitis B',
    LIVER: 'Liver Disease (Cirrhosis, Fatty Liver)',

    // Autoimmune
    RA: 'Rheumatoid Arthritis',
    PSORIASIS: 'Psoriasis / Psoriatic Arthritis',
    LUPUS: 'Lupus (Systemic Lupus Erythematosus)',
    SJOGRENS: 'Sjögren\'s Syndrome',
    ANKYLOSING_SPONDYLITIS: 'Ankylosing Spondylitis',
    MYASTHENIA_GRAVIS: 'Myasthenia Gravis',

    // Infectious
    HIV_AIDS: 'HIV/AIDS',

    // Bone & Joint
    OSTEOPOROSIS: 'Osteoporosis',
    OSTEOARTHRITIS: 'Osteoarthritis',
    GOUT: 'Gout',

    // Endocrine / Hormonal
    HYPOTHYROIDISM: 'Hypothyroidism (Underactive Thyroid)',
    HYPERTHYROIDISM: 'Hyperthyroidism (Overactive Thyroid)',
    ADRENAL_INSUFFICIENCY: 'Adrenal Insufficiency',
    GROWTH_HORMONE_DEFICIENCY: 'Growth Hormone Deficiency',

    // Eye Conditions
    MACULAR_DEGENERATION: 'Macular Degeneration',
    GLAUCOMA: 'Glaucoma',

    // Blood Disorders
    HEMOPHILIA: 'Hemophilia',
    SICKLE_CELL: 'Sickle Cell Disease',
    THALASSEMIA: 'Thalassemia',

    // Rare Diseases
    RARE_DISEASES: 'Rare Diseases (other)',

    // Other
    OTHER: 'Other condition not listed',
};

// Condition categories for organized display
export const ConditionCategories = {
    'Diabetes': ['TYPE_1_DIABETES', 'TYPE_2_DIABETES', 'GESTATIONAL_DIABETES'],
    'Respiratory': ['ASTHMA', 'COPD', 'CYSTIC_FIBROSIS', 'PULMONARY', 'SLEEP_APNEA'],
    'Neurological': ['EPILEPSY', 'PARKINSONS', 'ALZHEIMERS', 'MS', 'MIGRAINE', 'NEUROPATHY', 'ALS'],
    'Mental Health': ['DEPRESSION', 'ANXIETY', 'BIPOLAR', 'SCHIZOPHRENIA', 'PTSD', 'OCD', 'ADHD', 'EATING_DISORDERS'],
    'Heart & Vascular': ['HEART_FAILURE', 'CORONARY_ARTERY_DISEASE', 'ATRIAL_FIBRILLATION', 'HIGH_BP', 'HIGH_CHOLESTEROL', 'PERIPHERAL_ARTERY_DISEASE', 'DVT_PE'],
    'Cancer': ['BLOOD_CANCER', 'BREAST_CANCER', 'PROSTATE_CANCER', 'LUNG_CANCER', 'COLORECTAL_CANCER', 'MELANOMA', 'OVARIAN_CANCER', 'PANCREATIC_CANCER', 'THYROID_CANCER', 'BLADDER_CANCER', 'KIDNEY_CANCER', 'STOMACH_CANCER', 'HEAD_NECK_CANCER', 'BRAIN_CANCER', 'LIVER_CANCER', 'SARCOMA'],
    'Digestive / GI': ['CROHNS_DISEASE', 'ULCERATIVE_COLITIS', 'IBS', 'GERD', 'CELIAC'],
    'Kidney': ['CKD_ESRD'],
    'Liver': ['HEPATITIS_C', 'HEPATITIS_B', 'LIVER'],
    'Autoimmune': ['RA', 'PSORIASIS', 'LUPUS', 'SJOGRENS', 'ANKYLOSING_SPONDYLITIS', 'MYASTHENIA_GRAVIS'],
    'Infectious': ['HIV_AIDS'],
    'Bone & Joint': ['OSTEOPOROSIS', 'OSTEOARTHRITIS', 'GOUT'],
    'Endocrine / Hormonal': ['HYPOTHYROIDISM', 'HYPERTHYROIDISM', 'ADRENAL_INSUFFICIENCY', 'GROWTH_HORMONE_DEFICIENCY'],
    'Eye Conditions': ['MACULAR_DEGENERATION', 'GLAUCOMA'],
    'Blood Disorders': ['HEMOPHILIA', 'SICKLE_CELL', 'THALASSEMIA'],
    'Rare Diseases': ['RARE_DISEASES'],
    'Other': ['OTHER'],
};

// Legacy mapping for backward compatibility (maps old keys to new)
export const LegacyConditionMapping = {
    'DIABETES': 'TYPE_2_DIABETES',
    'IBD': 'CROHNS_DISEASE', // Map to Crohn's, users can also select UC
    'MENTAL_HEALTH': 'DEPRESSION', // Map to depression as default
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
