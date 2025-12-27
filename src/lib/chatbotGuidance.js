/**
 * Chatbot Guidance Logic
 * Generates personalized medication assistance guidance based on user answers
 */

import { InsuranceType, FinancialStatus, medicationStatus } from '../data/constants.js';

/**
 * Get eligibility flags based on insurance type
 */
export const getEligibilityFlags = (insuranceType) => {
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
      flags.copayCards = false; // Medicare patients cannot use copay cards
      flags.medicarePartBID = true;
      break;
    case InsuranceType.MEDICAID:
      flags.stateFormulary = true;
      flags.discountCards = false; // Usually fully covered
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
      flags.manufacturerPAPs = true; // Primary option
      flags.discountCards = true; // Important for uninsured
      break;
    default:
      break;
  }

  return flags;
};

/**
 * Get priority order for assistance programs based on insurance
 */
export const getPriorityOrder = (insuranceType, financialStatus) => {
  const isUrgent = financialStatus === FinancialStatus.CRISIS ||
                   financialStatus === FinancialStatus.UNAFFORDABLE;

  switch (insuranceType) {
    case InsuranceType.COMMERCIAL:
      return isUrgent
        ? ['copayCards', 'foundations', 'manufacturerPAPs', 'discountCards']
        : ['copayCards', 'discountCards', 'foundations', 'manufacturerPAPs'];

    case InsuranceType.MEDICARE:
      return isUrgent
        ? ['manufacturerPAPs', 'foundations', 'discountCards', 'medicarePartBID']
        : ['foundations', 'discountCards', 'manufacturerPAPs', 'medicarePartBID'];

    case InsuranceType.MEDICAID:
      return ['stateFormulary', 'manufacturerPAPs'];

    case InsuranceType.TRICARE_VA:
      return ['vaPrograms', 'manufacturerPAPs'];

    case InsuranceType.IHS:
      return ['ihsResources', 'manufacturerPAPs'];

    case InsuranceType.UNINSURED:
      return isUrgent
        ? ['manufacturerPAPs', 'discountCards', 'foundations']
        : ['discountCards', 'manufacturerPAPs', 'foundations'];

    default:
      return ['manufacturerPAPs', 'foundations', 'discountCards'];
  }
};

/**
 * Generate guidance for a specific medication
 */
export const getMedicationGuidance = (medication, eligibilityFlags, insuranceType) => {
  const guidance = {
    medicationName: medication.brandName,
    genericName: medication.genericName,
    manufacturer: medication.manufacturer,
    costTier: medication.cost_tier,
    hasGeneric: medication.generic_available,
    actions: [],
  };

  // Copay card guidance (Commercial only)
  if (eligibilityFlags.copayCards && medication.manufacturer !== 'Generic') {
    guidance.actions.push({
      type: 'copayCard',
      priority: 1,
      title: `${medication.brandName} Copay Card`,
      description: `Check if ${medication.manufacturer} offers a copay assistance card. These can reduce your copay to $0-$50/month.`,
      link: medication.papUrl || null,
      steps: [
        `Visit the ${medication.manufacturer} patient website`,
        'Look for "Copay Card" or "Savings Program"',
        'Register with your prescription info',
        'Show card at your specialty pharmacy',
      ],
    });
  }

  // Manufacturer PAP guidance
  if (eligibilityFlags.manufacturerPAPs && medication.papUrl) {
    guidance.actions.push({
      type: 'pap',
      priority: insuranceType === InsuranceType.UNINSURED ? 1 : 2,
      title: `${medication.manufacturer} Patient Assistance Program`,
      description: `Apply for free medication directly from the manufacturer. Income limits typically 200-500% of Federal Poverty Level.`,
      link: medication.papUrl,
      steps: [
        'Visit the PAP website and download the application',
        'Complete the patient section of the form',
        'Send to your doctor to complete the medical section',
        'Attach proof of income (tax return or pay stubs)',
        'Submit and wait 2-4 weeks for approval',
      ],
    });
  }

  // Generic alternative guidance
  if (medication.generic_available && !medication.genericName.toLowerCase().includes(medication.brandName.toLowerCase())) {
    guidance.actions.push({
      type: 'generic',
      priority: 3,
      title: 'Generic Alternative Available',
      description: `${medication.genericName} is available as a generic. Ask your doctor if switching could save money while maintaining efficacy.`,
      steps: [
        'Ask your medication doctor if generic is appropriate',
        'Check if your insurance prefers the generic (often Tier 1)',
        'Monitor your labs closely after any medication change',
      ],
    });
  }

  // Discount card guidance
  if (eligibilityFlags.discountCards) {
    guidance.actions.push({
      type: 'discountCard',
      priority: insuranceType === InsuranceType.UNINSURED ? 2 : 4,
      title: 'Compare Discount Card Prices',
      description: 'GoodRx, SingleCare, and Cost Plus Drugs can offer significant savings, especially for generics.',
      links: [
        { name: 'GoodRx', url: `https://www.goodrx.com/` },
        { name: 'SingleCare', url: 'https://www.singlecare.com/' },
        { name: 'Cost Plus Drugs', url: 'https://costplusdrugs.com/' },
      ],
      steps: [
        'Compare prices across all three platforms',
        'Check if your pharmacy accepts the discount card',
        'Compare discount price to your insurance copay',
        'Use whichever is lower!',
      ],
    });
  }

  return guidance;
};

/**
 * Generate overall guidance summary based on profile
 */
export const generateGuidanceSummary = (answers, medications) => {
  const { insurance, financialStatus, status, organs } = answers;
  const eligibility = getEligibilityFlags(insurance);
  const priority = getPriorityOrder(insurance, financialStatus);

  const summary = {
    profile: {
      insuranceType: insurance,
      financialStatus,
      medicationStatus: status,
      organs,
    },
    eligibility,
    priorityOrder: priority,
    keyMessages: [],
    medicationGuidance: [],
    resources: [],
    urgentActions: [],
  };

  // Generate key messages based on insurance
  switch (insurance) {
    case InsuranceType.COMMERCIAL:
      summary.keyMessages.push({
        type: 'success',
        title: 'Copay Cards Available',
        message: 'With commercial insurance, you can use manufacturer copay cards to significantly reduce costs. Start here!',
      });
      summary.keyMessages.push({
        type: 'warning',
        title: 'Specialty Pharmacy Required',
        message: 'Most commercial plans require medications be filled at a designated specialty pharmacy. Using the wrong pharmacy = full price!',
      });
      break;

    case InsuranceType.MEDICARE:
      summary.keyMessages.push({
        type: 'warning',
        title: 'No Copay Cards Allowed',
        message: 'Medicare beneficiaries cannot use manufacturer copay cards (Anti-Kickback Statute). Focus on foundations and PAPs instead.',
      });
      if (organs?.includes('Kidney')) {
        summary.keyMessages.push({
          type: 'info',
          title: 'Part B-ID for Immunosuppressants',
          message: 'Kidney patients may qualify for Medicare Part B-ID, which covers immunosuppressants even after losing other Medicare coverage.',
        });
      }
      break;

    case InsuranceType.MEDICAID:
      summary.keyMessages.push({
        type: 'success',
        title: 'Comprehensive Coverage',
        message: 'Medicaid typically covers medications with low or no copay. Check your state\'s formulary for covered drugs.',
      });
      break;

    case InsuranceType.UNINSURED:
      summary.keyMessages.push({
        type: 'urgent',
        title: 'Focus on PAPs',
        message: 'Without insurance, manufacturer Patient Assistance Programs (PAPs) are your best option for FREE medications. Apply immediately!',
      });
      summary.keyMessages.push({
        type: 'info',
        title: 'Dramatic Discount Card Savings',
        message: 'For generics, discount cards (GoodRx, Cost Plus) can save 80-90% off retail price while your PAP is processing.',
      });
      break;

    case InsuranceType.TRICARE_VA:
      summary.keyMessages.push({
        type: 'info',
        title: 'VA Pharmacy Benefits',
        message: 'VA pharmacy can often fill medications at very low cost. Contact your VA pharmacy team.',
      });
      break;

    case InsuranceType.IHS:
      summary.keyMessages.push({
        type: 'info',
        title: 'IHS Resources Available',
        message: 'Indian Health Service facilities may provide medications. Contact your IHS pharmacy.',
      });
      break;
  }

  // Add financial-status-specific messages
  if (financialStatus === FinancialStatus.CRISIS) {
    summary.urgentActions.push({
      title: 'Immediate Steps',
      actions: [
        'Call your healthcare provider social worker TODAY',
        'Ask about emergency medication supplies',
        'Apply for manufacturer PAPs immediately (many offer bridge supplies)',
        'Contact HealthWell Foundation or PAN Foundation for emergency assistance',
      ],
    });
  }

  // Generate medication-specific guidance
  if (answers.medications && answers.medications.length > 0) {
    summary.medicationGuidance = answers.medications.map(medId => {
      const med = medications.find(m => m.id === medId);
      if (!med) return null;
      return getMedicationGuidance(med, eligibility, insurance);
    }).filter(Boolean);
  }

  // Add relevant resources based on insurance type
  summary.resources = getRelevantResources(insurance, organs);

  return summary;
};

/**
 * Get relevant resources based on insurance and organs
 */
export const getRelevantResources = (insuranceType, organs = []) => {
  const resources = [];

  // Universal resources
  resources.push({
    name: 'HealthWell Foundation',
    url: 'https://www.healthwellfoundation.org/',
    description: 'Disease-specific funds for copay assistance',
    category: 'Foundation',
  });

  resources.push({
    name: 'PAN Foundation',
    url: 'https://www.panfoundation.org/',
    description: 'Copay assistance for chronic conditions',
    category: 'Foundation',
  });

  resources.push({
    name: 'Patient Advocate Foundation',
    url: 'https://www.patientadvocate.org/',
    description: 'Free case management and financial assistance',
    category: 'Advocacy',
  });

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
      description: 'Compare Part D plans and check eligibility',
      category: 'Government',
    });

    if (organs?.includes('Kidney')) {
      resources.push({
        name: 'Medicare Part B-ID Information',
        url: 'https://www.medicare.gov/coverage/immunosuppressive-drugs',
        description: 'Information on Part B immunosuppressive drug coverage',
        category: 'Government',
      });
    }
  }

  // Discount cards
  resources.push({
    name: 'GoodRx',
    url: 'https://www.goodrx.com/',
    description: 'Compare pharmacy prices and get free coupons',
    category: 'Discount',
  });

  resources.push({
    name: 'Cost Plus Drugs',
    url: 'https://costplusdrugs.com/',
    description: 'Low-cost online pharmacy',
    category: 'Discount',
  });

  // Support groups
  resources.push({
    name: 'TRIO - medication Recipients International',
    url: 'https://www.trioweb.org/',
    description: 'Peer support and advocacy',
    category: 'Support',
  });

  return resources;
};

/**
 * Format guidance as chat messages
 */
export const formatGuidanceAsMessages = (summary) => {
  const messages = [];

  // Main summary message
  let mainMessage = `Based on your profile, here's your personalized medication assistance guide:\n\n`;

  // Add key messages
  summary.keyMessages.forEach(msg => {
    const emoji = msg.type === 'success' ? '✅' :
                  msg.type === 'warning' ? '⚠️' :
                  msg.type === 'urgent' ? '🚨' : 'ℹ️';
    mainMessage += `${emoji} **${msg.title}**\n${msg.message}\n\n`;
  });

  messages.push({
    type: 'assistant',
    text: mainMessage,
  });

  // Add urgent actions if any
  if (summary.urgentActions.length > 0) {
    let urgentMessage = `🚨 **${summary.urgentActions[0].title}:**\n\n`;
    summary.urgentActions[0].actions.forEach((action, i) => {
      urgentMessage += `${i + 1}. ${action}\n`;
    });
    messages.push({
      type: 'assistant',
      text: urgentMessage,
    });
  }

  // Add medication-specific guidance
  if (summary.medicationGuidance.length > 0) {
    let medMessage = `**Your Medication Assistance Options:**\n\n`;

    summary.medicationGuidance.forEach(med => {
      medMessage += `**${med.medicationName}** (${med.genericName})\n`;

      // Sort actions by priority and show top 2
      const sortedActions = med.actions.sort((a, b) => a.priority - b.priority).slice(0, 2);
      sortedActions.forEach(action => {
        medMessage += `• ${action.title}: ${action.description}\n`;
        if (action.link) {
          medMessage += `  → [Apply Here](${action.link})\n`;
        }
      });
      medMessage += '\n';
    });

    messages.push({
      type: 'assistant',
      text: medMessage,
    });
  }

  // Add resources
  let resourceMessage = `**Helpful Resources:**\n\n`;
  const topResources = summary.resources.slice(0, 5);
  topResources.forEach(resource => {
    resourceMessage += `• **${resource.name}**: ${resource.description}\n`;
  });
  resourceMessage += `\nWould you like more detailed steps for any of these options?`;

  messages.push({
    type: 'assistant',
    text: resourceMessage,
  });

  return messages;
};

/**
 * Get chatbot conversation questions
 */
export const getChatQuestions = () => [
  {
    id: 1,
    key: 'role',
    question: "Who am I helping today?",
    type: 'single',
    options: [
      { value: 'Patient', label: 'Patient', icon: '🙋' },
      { value: 'Carepartner / Family', label: 'Carepartner / Family', icon: '👨‍👩‍👧' },
      { value: 'Social Worker / Coordinator', label: 'Social Worker / Coordinator', icon: '👩‍⚕️' },
    ],
  },
  {
    id: 2,
    key: 'status',
    question: "Where are you in the medication process?",
    type: 'single',
    options: [
      { value: 'Pre-medication (Evaluation/Waitlist)', label: 'Pre-medication (Evaluation/Waitlist)', icon: '📋' },
      { value: 'Post-medication (Within 1st year)', label: 'Post-medication (Within 1st year)', icon: '🏥' },
      { value: 'Post-medication (1+ years)', label: 'Post-medication (1+ years)', icon: '🏠' },
    ],
  },
  {
    id: 3,
    key: 'organs',
    question: "What type of medication?",
    subtitle: "Select all that apply",
    type: 'multi',
    options: [
      { value: 'Kidney', label: 'Kidney', icon: '🫘' },
      { value: 'Liver', label: 'Liver', icon: '🫀' },
      { value: 'Heart', label: 'Heart', icon: '❤️' },
      { value: 'Lung', label: 'Lung', icon: '🫁' },
      { value: 'Pancreas', label: 'Pancreas', icon: '🥞' },
      { value: 'Multi-organ', label: 'Multi-organ', icon: '🔄' },
      { value: 'Other', label: 'Other', icon: '➕' },
    ],
  },
  {
    id: 4,
    key: 'insurance',
    question: "What's your primary insurance?",
    type: 'single',
    helpText: "This determines which assistance programs you're eligible for.",
    options: [
      { value: 'Commercial / Employer', label: 'Commercial / Employer', icon: '🏢', hint: 'Copay cards available!' },
      { value: 'Medicare', label: 'Medicare', icon: '🏛️', hint: 'No copay cards, but PAPs & foundations work' },
      { value: 'Medicaid (State)', label: 'Medicaid (State)', icon: '🏥', hint: 'Usually well covered' },
      { value: 'TRICARE / VA', label: 'TRICARE / VA', icon: '🎖️', hint: 'VA pharmacy programs' },
      { value: 'Indian Health Service / Tribal', label: 'Indian Health Service / Tribal', icon: '🪶', hint: 'IHS resources available' },
      { value: 'Uninsured / Self-pay', label: 'Uninsured / Self-pay', icon: '💳', hint: 'PAPs can provide FREE meds' },
    ],
  },
  {
    id: 5,
    key: 'medications',
    question: "Which medication do you need help with?",
    subtitle: "Select all that apply, or search by name",
    type: 'medication-select',
    searchable: true,
  },
  {
    id: 6,
    key: 'financialStatus',
    question: "How would you describe your current medication costs?",
    type: 'single',
    options: [
      { value: 'Manageable', label: 'Manageable', icon: '✅', description: 'I can afford my medications' },
      { value: 'Challenging', label: 'Challenging', icon: '😓', description: 'It\'s tight, but I manage' },
      { value: 'Unaffordable', label: 'Unaffordable', icon: '😰', description: 'I struggle to pay for meds' },
      { value: 'Crisis', label: 'Crisis', icon: '🆘', description: 'I\'ve skipped or rationed doses' },
    ],
  },
];
