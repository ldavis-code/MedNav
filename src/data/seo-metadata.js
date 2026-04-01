/**
 * SEO metadata configuration for all pages
 * Each page has unique title, description, and social media tags
 */

const BASE_URL = 'https://medicationnavigator.com';
const SITE_NAME = 'Medication Navigator™';

export const seoMetadata = {
  home: {
    title: 'Medication Navigator™ | Free Assistance Guide',
    description: 'Find free medication assistance for patients. Search Patient Assistance Programs, copay foundations, and help paying for immunosuppressants.',
    canonical: `${BASE_URL}/`,
    ogTitle: 'Medication Navigator™ - Medication Assistance Guide',
    ogDescription: 'Helping patients find medication assistance programs, Patient Assistance Programs (PAPs), and copay support for immunosuppressants. Free educational resources.',
    twitterTitle: 'Medication Navigator™',
    twitterDescription: 'Find free medication assistance programs for patients. Search PAPs, copay foundations, and get help paying for immunosuppressants.',
    breadcrumbName: 'Home',
  },

  wizard: {
    title: 'Personalized Medication Path | Medication Navigator™',
    description: 'Take our free personalized quiz to discover the best medication assistance programs for your medication needs. Get tailored recommendations in minutes.',
    canonical: `${BASE_URL}/wizard`,
    ogTitle: 'Find Your Medication Assistance Path',
    ogDescription: 'Answer a few questions to get personalized recommendations for Patient Assistance Programs and copay support tailored to your medication journey.',
    twitterTitle: 'Personalized Medication Assistance Quiz',
    twitterDescription: 'Take our free quiz to discover the best medication assistance programs for your medication needs. Get tailored recommendations in minutes.',
    breadcrumbName: 'My Path Quiz',
  },

  medications: {
    title: 'Search Medications & Assistance Programs | Medication Navigator™',
    description: 'Search and compare medications, prices, and Patient Assistance Programs. Find help paying for tacrolimus, mycophenolate, prednisone, and more.',
    canonical: `${BASE_URL}/medications`,
    ogTitle: 'Search Medications & Assistance',
    ogDescription: 'Comprehensive database of medications with pricing, manufacturer PAPs, and copay foundation eligibility. Find help paying for your medications.',
    twitterTitle: 'Search Medications',
    twitterDescription: 'Search medications, compare prices, and find Patient Assistance Programs. Get help paying for tacrolimus, mycophenolate, and more.',
    breadcrumbName: 'Medications',
  },

  education: {
    title: 'Resources & Education | Medication Navigator™',
    description: 'Learn about insurance coverage, copay foundations, specialty pharmacies, and medication assistance options for patients. Expert guidance and resources.',
    canonical: `${BASE_URL}/education`,
    ogTitle: 'Medication Education & Resources',
    ogDescription: 'Comprehensive guides on insurance, Medicare, Medicaid, copay foundations, specialty pharmacies, and financial assistance for medications.',
    twitterTitle: 'Medication Resources',
    twitterDescription: 'Learn about insurance, copay foundations, specialty pharmacies, and medication assistance options for patients.',
    breadcrumbName: 'Resources & Education',
  },

  applicationHelp: {
    title: 'How to Apply for Medication Assistance | Medication Navigator™',
    description: 'Step-by-step guide to applying for Patient Assistance Programs. Learn what documents you need, how to complete applications, and get approval faster.',
    canonical: `${BASE_URL}/application-help`,
    ogTitle: 'Apply for Patient Assistance Programs',
    ogDescription: 'Complete guide to applying for medication assistance. Get templates, checklists, and step-by-step instructions for Patient Assistance Program applications.',
    twitterTitle: 'Patient Assistance Program Grants & Foundations',
    twitterDescription: 'Step-by-step guide to applying for Patient Assistance Programs. Learn what documents you need and how to get approval faster.',
    breadcrumbName: 'Grants & Foundations',
  },

  faq: {
    title: 'Frequently Asked Questions | Medication Navigator™',
    description: 'Find answers to common questions about Patient Assistance Programs, copay foundations, medication costs, and financial help for patients.',
    canonical: `${BASE_URL}/faq`,
    ogTitle: 'Medication Assistance FAQs',
    ogDescription: 'Get answers to common questions about medication assistance, Patient Assistance Programs, copay support, and financial help for patients.',
    twitterTitle: 'Medication Assistance FAQs',
    twitterDescription: 'Answers to common questions about Patient Assistance Programs, copay foundations, and financial help for patients.',
    breadcrumbName: 'FAQ',
  },

  notFound: {
    title: 'Page Not Found | Medication Navigator™',
    description: 'The page you are looking for could not be found. Visit our homepage to find medication assistance programs and resources for patients.',
    canonical: `${BASE_URL}/`,
    ogTitle: 'Page Not Found',
    ogDescription: 'This page could not be found. Visit Medication Navigator™ to find medication assistance programs for patients.',
    twitterTitle: 'Page Not Found',
    twitterDescription: 'This page could not be found. Visit our homepage to find medication assistance programs for patients.',
    breadcrumbName: 'Page Not Found',
  },

  forHealthcarePrograms: {
    title: 'For Healthcare Programs | Medication Navigator™',
    description: 'Help patients navigate medication costs with our privacy-safe resource. Reduce financial barriers to adherence with verified assistance programs.',
    canonical: `${BASE_URL}/for-medication-programs`,
    ogTitle: 'Healthcare Program Partnerships',
    ogDescription: 'Partner with Medication Navigator to help your patients find medication assistance programs. Privacy-safe, no PHI collected.',
    twitterTitle: 'For Healthcare Programs',
    twitterDescription: 'Help your patients navigate medication costs with free educational resources and verified assistance programs.',
    breadcrumbName: 'For Healthcare Programs',
  },

  forEmployers: {
    title: 'For Employers | Medication Navigator™',
    description: 'Reduce specialty drug costs for medication employees. Connect your workforce to copay cards, manufacturer assistance, and foundation support.',
    canonical: `${BASE_URL}/for-employers`,
    ogTitle: 'Employer Benefits for medication Employees',
    ogDescription: 'Help medication employees find medication assistance programs. Complement existing pharmacy benefits with free educational resources.',
    twitterTitle: 'For Employers',
    twitterDescription: 'Reduce specialty drug costs for medication employees with our medication assistance resource and free educational content.',
    breadcrumbName: 'For Employers',
  },

  forPayers: {
    title: 'For Payers | Medication Navigator™',
    description: 'Help members access manufacturer assistance programs for medications. Reduce plan spend on high-cost drugs with our privacy-safe resource.',
    canonical: `${BASE_URL}/for-payers`,
    ogTitle: 'Payer Partnerships for Medication Assistance',
    ogDescription: 'Help members find manufacturer copay assistance and PAPs for medications. Privacy-safe engagement tracking.',
    twitterTitle: 'For Payers',
    twitterDescription: 'Help members access manufacturer assistance programs for medications.',
    breadcrumbName: 'For Payers',
  },

  pricing: {
    title: 'Pricing | Medication Navigator™',
    description: 'Free access to education, subscription options for patients, and partnership options for organizations. View our transparent pricing.',
    canonical: `${BASE_URL}/pricing`,
    ogTitle: 'Transparent Pricing',
    ogDescription: 'Free educational resources for all. Subscription and partnership options for patients and healthcare organizations.',
    twitterTitle: 'Pricing',
    twitterDescription: 'Free access to education, partnership options for organizations. View our transparent pricing.',
    breadcrumbName: 'Pricing & Partners',
  },

  pilot: {
    title: 'Partner Pilot Program | Medication Navigator™',
    description: 'Welcome to the pilot program. Find medication assistance programs, search medications, and access verified financial resources.',
    canonical: `${BASE_URL}/pilot`,
    ogTitle: 'Partner Pilot Program',
    ogDescription: 'Your healthcare provider has partnered with us to help you find medication assistance programs for medications.',
    twitterTitle: 'Partner Pilot Program',
    twitterDescription: 'Find medication assistance programs through your healthcare provider partnership.',
    breadcrumbName: 'Pilot Program',
  },

  appeals: {
    title: 'Insurance Appeals Guide | Medication Navigator™',
    description: 'Step-by-step guide to appealing insurance medication denials. Over 50% of appeals succeed. Free letter templates and checklist included.',
    canonical: `${BASE_URL}/appeals`,
    ogTitle: 'Insurance Appeals Guide for Medication Denials',
    ogDescription: 'Learn how to appeal insurance denials for your medications. Includes letter templates, checklists, and step-by-step instructions.',
    twitterTitle: 'Insurance Appeals Guide',
    twitterDescription: 'Step-by-step guide to appealing insurance medication denials. Over 50% of appeals succeed.',
    breadcrumbName: 'Insurance Appeals',
  },

  privacyPolicy: {
    title: 'Privacy Policy | Medication Navigator™',
    description: 'Learn how Medication Navigator collects, uses, and protects your personal information. We do not sell your data to third parties.',
    canonical: `${BASE_URL}/privacy-policy`,
    ogTitle: 'Privacy Policy',
    ogDescription: 'How we collect, use, and protect your information at Medication Navigator.',
    twitterTitle: 'Privacy Policy',
    twitterDescription: 'Learn how Medication Navigator protects your personal information.',
    breadcrumbName: 'Privacy Policy',
  },

  termsAndConditions: {
    title: 'Terms and Conditions | Medication Navigator™',
    description: 'Terms and conditions for using the Medication Navigator website. Educational resource for medication assistance - not medical advice.',
    canonical: `${BASE_URL}/terms-and-conditions`,
    ogTitle: 'Terms and Conditions',
    ogDescription: 'Terms governing use of the Medication Navigator website and its educational medication assistance resources.',
    twitterTitle: 'Terms and Conditions',
    twitterDescription: 'Terms and conditions for using Medication Navigator.',
    breadcrumbName: 'Terms and Conditions',
  },

  copayReminders: {
    title: 'Copay Card Reminders | Medication Navigator™',
    description: 'Never miss a copay card renewal. Track expiration dates, set reminders, and manage all your copay assistance programs in one place.',
    canonical: `${BASE_URL}/copay-reminders`,
    ogTitle: 'Copay Card Renewal Reminders',
    ogDescription: 'Track your copay card expiration dates and get reminders before they expire. Manage all your assistance programs in one place.',
    twitterTitle: 'Copay Card Reminders',
    twitterDescription: 'Never miss a copay card renewal. Track expiration dates and manage your assistance programs.',
    breadcrumbName: 'Copay Card Reminders',
  },

  feedbackSurvey: {
    title: 'Share Your Experience | Medication Navigator™',
    description: 'Tell us about your experience using Medication Navigator. Your feedback helps us improve medication assistance resources for all patients.',
    canonical: `${BASE_URL}/feedback`,
    ogTitle: 'Share Your Experience',
    ogDescription: 'Help us improve Medication Navigator by sharing your experience finding medication assistance programs.',
    twitterTitle: 'Share Your Feedback',
    twitterDescription: 'Tell us about your experience using Medication Navigator to find medication assistance programs.',
    breadcrumbName: 'Feedback',
  },

  accessibility: {
    title: 'Accessibility & Section 504 Compliance | Medication Navigator™',
    description: 'Learn about our commitment to accessibility and Section 504 compliance. WCAG 2.1 Level AA conformance for all patients.',
    canonical: `${BASE_URL}/accessibility`,
    ogTitle: 'Accessibility Statement',
    ogDescription: 'Medication Navigator is committed to WCAG 2.1 Level AA accessibility for all users, including people with disabilities.',
    twitterTitle: 'Accessibility & Section 504',
    twitterDescription: 'Our commitment to making medication assistance accessible to all patients.',
    breadcrumbName: 'Accessibility',
  },

  account: {
    title: 'My Account | Medication Navigator™',
    description: 'Manage your Medication Navigator account, subscription, and synced data.',
    canonical: `${BASE_URL}/account`,
    ogTitle: 'My Account',
    ogDescription: 'Manage your Medication Navigator account and subscription.',
    twitterTitle: 'My Account',
    twitterDescription: 'Manage your Medication Navigator account and subscription.',
    breadcrumbName: 'Account',
  },

  demo: {
    title: 'Interactive Demo | Medication Navigator™',
    description: 'Try Medication Navigator with a full interactive demo. Explore medication assistance programs, savings calculator, and AI assistant with Pro features unlocked.',
    canonical: `${BASE_URL}/demo`,
    ogTitle: 'Interactive Product Demo',
    ogDescription: 'Try Medication Navigator with all Pro features unlocked. See how patients find copay cards, PAPs, and foundation grants.',
    twitterTitle: 'Try the Interactive Demo',
    twitterDescription: 'Explore Medication Navigator with a full 4-hour interactive demo.',
    breadcrumbName: 'Demo',
  },

  epicCallback: {
    title: 'Connecting to Health System | Medication Navigator™',
    description: 'Securely importing your medications from your health system.',
    canonical: `${BASE_URL}/epic-callback`,
    ogTitle: 'Health System Connection',
    ogDescription: 'Securely importing medications from your health system via Epic FHIR.',
    twitterTitle: 'Health System Connection',
    twitterDescription: 'Securely importing medications from your health system.',
    breadcrumbName: 'Health System Connection',
  },

  notLicensed: {
    title: 'Health System Not Activated | Medication Navigator™',
    description: 'Your health system has not yet activated Medication Navigator. Contact us to get started.',
    canonical: `${BASE_URL}/not-licensed`,
    ogTitle: 'Health System Not Activated',
    ogDescription: 'Contact us to activate Medication Navigator for your health system.',
    twitterTitle: 'Health System Not Activated',
    twitterDescription: 'Contact us to activate Medication Navigator for your health system.',
    breadcrumbName: 'Not Licensed',
  },
};

/**
 * Helper function to get metadata for a specific page
 * @param {string} page - Page key (home, wizard, medications, etc.)
 * @returns {Object} Meta tag configuration
 */
export function getPageMetadata(page) {
  return seoMetadata[page] || seoMetadata.home;
}
