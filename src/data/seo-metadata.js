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
    ogTitle: 'Search medication Medications & Assistance',
    ogDescription: 'Comprehensive database of medications with pricing, manufacturer PAPs, and copay foundation eligibility. Find help paying for your medications.',
    twitterTitle: 'Search medication Medications',
    twitterDescription: 'Search medications, compare prices, and find Patient Assistance Programs. Get help paying for tacrolimus, mycophenolate, and more.',
    breadcrumbName: 'Medications',
  },

  education: {
    title: 'Resources & Education | Medication Navigator™',
    description: 'Learn about insurance coverage, copay foundations, specialty pharmacies, and medication assistance options for patients. Expert guidance and resources.',
    canonical: `${BASE_URL}/education`,
    ogTitle: 'medication Medication Education & Resources',
    ogDescription: 'Comprehensive guides on insurance, Medicare, Medicaid, copay foundations, specialty pharmacies, and financial assistance for medications.',
    twitterTitle: 'medication Medication Resources',
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
    ogTitle: 'medication Medication Assistance FAQs',
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
};

/**
 * Helper function to get metadata for a specific page
 * @param {string} page - Page key (home, wizard, medications, etc.)
 * @returns {Object} Meta tag configuration
 */
export function getPageMetadata(page) {
  return seoMetadata[page] || seoMetadata.home;
}
