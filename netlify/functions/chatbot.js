import { neon } from '@neondatabase/serverless';

// Initialize Neon client
const sql = neon(process.env.DATABASE_URL);

// CORS headers for browser requests
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
};

// Insurance type mappings
const InsuranceType = {
    COMMERCIAL: 'Commercial / Employer',
    MEDICARE: 'Medicare',
    MEDICAID: 'Medicaid (State)',
    TRICARE_VA: 'TRICARE / VA',
    IHS: 'Indian Health Service / Tribal',
    UNINSURED: 'Uninsured / Self-pay',
};

// Get eligibility flags based on insurance type
const getEligibilityFlags = (insuranceType) => {
    const flags = {
        copayCards: false,
        manufacturerPAPs: true,
        foundations: true,
        discountCards: true,
        medicarePartBID: false,
        stateFormulary: false,
        vaPrograms: false,
        ihsResources: false,
    };

    switch (insuranceType) {
        case InsuranceType.COMMERCIAL:
            flags.copayCards = true;
            break;
        case InsuranceType.MEDICARE:
            flags.copayCards = false;
            flags.medicarePartBID = true;
            break;
        case InsuranceType.MEDICAID:
            flags.stateFormulary = true;
            flags.discountCards = false;
            break;
        case InsuranceType.TRICARE_VA:
            flags.vaPrograms = true;
            flags.copayCards = false;
            break;
        case InsuranceType.IHS:
            flags.ihsResources = true;
            flags.copayCards = false;
            break;
        case InsuranceType.UNINSURED:
            flags.copayCards = false;
            flags.manufacturerPAPs = true;
            flags.discountCards = true;
            break;
    }

    return flags;
};

// Generate key messages based on insurance type
const generateKeyMessages = (insuranceType, organs = [], financialStatus) => {
    const messages = [];

    switch (insuranceType) {
        case InsuranceType.COMMERCIAL:
            messages.push({
                type: 'success',
                title: 'Copay Cards Available',
                message: 'With commercial insurance, you can use manufacturer copay cards to reduce costs to $0-$50/month.',
            });
            messages.push({
                type: 'warning',
                title: 'Specialty Pharmacy Required',
                message: 'Most commercial plans require medications be filled at a designated specialty pharmacy.',
            });
            break;

        case InsuranceType.MEDICARE:
            messages.push({
                type: 'warning',
                title: 'No Copay Cards Allowed',
                message: 'Medicare beneficiaries cannot use manufacturer copay cards. Focus on foundations and PAPs instead.',
            });
            if (organs?.includes('Kidney')) {
                messages.push({
                    type: 'info',
                    title: 'Part B-ID for Immunosuppressants',
                    message: 'Kidney patients may qualify for Medicare Part B-ID for immunosuppressant coverage.',
                });
            }
            break;

        case InsuranceType.MEDICAID:
            messages.push({
                type: 'success',
                title: 'Comprehensive Coverage',
                message: 'Medicaid typically covers medications with low or no copay.',
            });
            break;

        case InsuranceType.UNINSURED:
            messages.push({
                type: 'urgent',
                title: 'Focus on PAPs',
                message: 'Without insurance, manufacturer PAPs are your best option for FREE medications.',
            });
            messages.push({
                type: 'info',
                title: 'Discount Card Savings',
                message: 'For generics, discount cards (GoodRx, Cost Plus) can save 80-90% off retail.',
            });
            break;

        case InsuranceType.TRICARE_VA:
            messages.push({
                type: 'info',
                title: 'VA Pharmacy Benefits',
                message: 'VA pharmacy can often fill medications at very low cost.',
            });
            break;

        case InsuranceType.IHS:
            messages.push({
                type: 'info',
                title: 'IHS Resources Available',
                message: 'Contact your IHS pharmacy for medication coverage.',
            });
            break;
    }

    // Financial status messages
    if (financialStatus === 'Crisis' || financialStatus === 'Unaffordable') {
        messages.unshift({
            type: 'urgent',
            title: 'Immediate Help Available',
            message: 'Contact your healthcare provider social worker TODAY. Ask about emergency medication supplies.',
        });
    }

    return messages;
};

// Get medication guidance from database
const getMedicationsGuidance = async (medicationIds, insuranceType) => {
    if (!medicationIds || medicationIds.length === 0) {
        return [];
    }

    try {
        // Query medications from database
        const medications = await sql`
            SELECT
                id, brand_name, generic_name, manufacturer,
                pap_url, cost_tier, generic_available
            FROM medications
            WHERE id = ANY(${medicationIds})
        `;

        const eligibility = getEligibilityFlags(insuranceType);

        return medications.map(med => {
            const guidance = {
                medicationName: med.brand_name,
                genericName: med.generic_name,
                manufacturer: med.manufacturer,
                costTier: med.cost_tier,
                hasGeneric: med.generic_available,
                actions: [],
            };

            // Copay card (Commercial only)
            if (eligibility.copayCards && med.manufacturer !== 'Generic') {
                guidance.actions.push({
                    type: 'copayCard',
                    priority: 1,
                    title: `${med.brand_name} Copay Card`,
                    description: `Check if ${med.manufacturer} offers a copay card for $0-$50/month.`,
                    link: med.pap_url,
                });
            }

            // PAP
            if (eligibility.manufacturerPAPs && med.pap_url) {
                guidance.actions.push({
                    type: 'pap',
                    priority: insuranceType === InsuranceType.UNINSURED ? 1 : 2,
                    title: `${med.manufacturer} Patient Assistance`,
                    description: 'Apply for free medication from the manufacturer.',
                    link: med.pap_url,
                });
            }

            // Generic alternative
            if (med.generic_available) {
                guidance.actions.push({
                    type: 'generic',
                    priority: 3,
                    title: 'Generic Available',
                    description: `${med.generic_name} is available as a lower-cost generic.`,
                });
            }

            // Discount cards
            if (eligibility.discountCards) {
                guidance.actions.push({
                    type: 'discountCard',
                    priority: 4,
                    title: 'Compare Discount Prices',
                    description: 'GoodRx, SingleCare, and Cost Plus may offer savings.',
                });
            }

            return guidance;
        });
    } catch (error) {
        console.error('Error fetching medications:', error);
        return [];
    }
};

// Get resources based on profile
const getResources = (insuranceType, organs = []) => {
    const resources = [
        {
            name: 'HealthWell Foundation',
            url: 'https://www.healthwellfoundation.org/',
            description: 'Copay assistance funds',
            category: 'Foundation',
        },
        {
            name: 'PAN Foundation',
            url: 'https://www.panfoundation.org/',
            description: 'Copay assistance for chronic conditions',
            category: 'Foundation',
        },
        {
            name: 'Patient Advocate Foundation',
            url: 'https://www.patientadvocate.org/',
            description: 'Free case management',
            category: 'Advocacy',
        },
    ];

    // Kidney-specific
    if (organs?.includes('Kidney')) {
        resources.push({
            name: 'American Kidney Fund',
            url: 'https://www.kidneyfund.org/',
            description: 'Financial assistance for kidney patients',
            category: 'Kidney',
        });
    }

    // Medicare-specific
    if (insuranceType === InsuranceType.MEDICARE) {
        resources.push({
            name: 'Medicare.gov',
            url: 'https://www.medicare.gov/',
            description: 'Compare Part D plans',
            category: 'Government',
        });
    }

    // Discount cards
    resources.push({
        name: 'GoodRx',
        url: 'https://www.goodrx.com/',
        description: 'Free prescription coupons',
        category: 'Discount',
    });

    resources.push({
        name: 'Cost Plus Drugs',
        url: 'https://costplusdrugs.com/',
        description: 'Low-cost online pharmacy',
        category: 'Discount',
    });

    return resources;
};

export async function handler(event) {
    // Handle preflight CORS requests
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers };
    }

    try {
        // POST: Generate guidance based on user answers
        if (event.httpMethod === 'POST') {
            const body = JSON.parse(event.body || '{}');
            const { action, answers } = body;

            if (action === 'generateGuidance') {
                const { insurance, financialStatus, organs, medications } = answers || {};

                // Validate required fields
                if (!insurance) {
                    return {
                        statusCode: 400,
                        headers,
                        body: JSON.stringify({ error: 'Insurance type is required' })
                    };
                }

                // Generate eligibility flags
                const eligibility = getEligibilityFlags(insurance);

                // Generate key messages
                const keyMessages = generateKeyMessages(insurance, organs, financialStatus);

                // Get medication-specific guidance
                const medicationGuidance = await getMedicationsGuidance(medications, insurance);

                // Get relevant resources
                const resources = getResources(insurance, organs);

                // Determine priority order
                const isUrgent = financialStatus === 'Crisis' || financialStatus === 'Unaffordable';
                let priorityOrder;

                switch (insurance) {
                    case InsuranceType.COMMERCIAL:
                        priorityOrder = isUrgent
                            ? ['copayCards', 'foundations', 'manufacturerPAPs']
                            : ['copayCards', 'discountCards', 'foundations'];
                        break;
                    case InsuranceType.MEDICARE:
                        priorityOrder = ['foundations', 'manufacturerPAPs', 'discountCards'];
                        break;
                    case InsuranceType.UNINSURED:
                        priorityOrder = ['manufacturerPAPs', 'discountCards', 'foundations'];
                        break;
                    default:
                        priorityOrder = ['manufacturerPAPs', 'foundations', 'discountCards'];
                }

                const response = {
                    success: true,
                    guidance: {
                        profile: answers,
                        eligibility,
                        priorityOrder,
                        keyMessages,
                        medicationGuidance,
                        resources,
                        urgentActions: financialStatus === 'Crisis' ? [{
                            title: 'Immediate Steps',
                            actions: [
                                'Call your healthcare provider social worker TODAY',
                                'Ask about emergency medication supplies',
                                'Apply for manufacturer PAPs immediately',
                            ],
                        }] : [],
                    }
                };

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify(response)
                };
            }

            // Action: Search medications
            if (action === 'searchMedications') {
                const { query, stage, organs } = body;

                let medications;

                if (query) {
                    // Search by name
                    medications = await sql`
                        SELECT id, brand_name, generic_name, category, manufacturer, stage
                        FROM medications
                        WHERE
                            brand_name ILIKE ${'%' + query + '%'}
                            OR generic_name ILIKE ${'%' + query + '%'}
                        ORDER BY brand_name
                        LIMIT 20
                    `;
                } else {
                    // Get all medications (optionally filtered)
                    medications = await sql`
                        SELECT id, brand_name, generic_name, category, manufacturer, stage
                        FROM medications
                        ORDER BY category, brand_name
                        LIMIT 50
                    `;
                }

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ medications })
                };
            }

            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid action' })
            };
        }

        // GET: Health check
        if (event.httpMethod === 'GET') {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ status: 'ok', message: 'Chatbot API is running' })
            };
        }

        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };

    } catch (error) {
        console.error('Chatbot API error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
}
