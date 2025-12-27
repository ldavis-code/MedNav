/**
 * Migration: Complete Medication Assistance Programs
 * MedicationNavigator.com
 *
 * Run this function to populate the savings_programs table with comprehensive
 * medication assistance program data.
 *
 * Usage: POST to /.netlify/functions/migrate-savings-programs
 * with header: x-migration-key: <MIGRATION_SECRET>
 */

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, x-migration-key',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

// All the savings programs to insert
const savingsPrograms = [
  // =====================================================
  // SECTION 1: IMMUNOSUPPRESSANTS
  // =====================================================

  // ----- TACROLIMUS (Prograf) -----
  {
    medication_id: 'tacrolimus',
    program_name: 'Prograf Copay Card',
    program_type: 'copay_card',
    commercial_eligible: true,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: false,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: 'None',
    max_benefit: 'Pay as little as $0, up to $3,000/year',
    application_url: 'https://www.prograf.com/savings-information',
    phone: '1-800-477-6472',
    state_restrictions: 'NOT valid in CA or MA',
    notes: 'Must have commercial insurance. Re-enroll annually.',
    is_active: true
  },
  {
    medication_id: 'tacrolimus',
    program_name: 'Astellas Patient Assistance Program',
    program_type: 'pap',
    commercial_eligible: false,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: true,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: '400% FPL',
    max_benefit: 'Free medication',
    application_url: 'https://www.astellaspharmasupportsolutions.com',
    phone: '1-800-477-6472',
    notes: 'For uninsured patients. Doctor must complete application.',
    is_active: true
  },
  {
    medication_id: 'tacrolimus',
    program_name: 'GoodRx / SingleCare Discount',
    program_type: 'discount_card',
    commercial_eligible: true,
    medicare_eligible: true,
    medicaid_eligible: true,
    uninsured_eligible: true,
    tricare_va_eligible: true,
    ihs_tribal_eligible: true,
    income_limit: 'None',
    max_benefit: 'Generic as low as $15-40/month',
    application_url: 'https://www.goodrx.com/tacrolimus',
    notes: 'Free discount card. Compare prices at pharmacies.',
    is_active: true
  },

  // Also for tacrolimus-001
  {
    medication_id: 'tacrolimus-001',
    program_name: 'Prograf Copay Card',
    program_type: 'copay_card',
    commercial_eligible: true,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: false,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: 'None',
    max_benefit: 'Pay as little as $0, up to $3,000/year',
    application_url: 'https://www.prograf.com/savings-information',
    phone: '1-800-477-6472',
    state_restrictions: 'NOT valid in CA or MA',
    notes: 'Must have commercial insurance.',
    is_active: true
  },
  {
    medication_id: 'tacrolimus-001',
    program_name: 'Astellas Patient Assistance Program',
    program_type: 'pap',
    commercial_eligible: false,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: true,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: '400% FPL',
    max_benefit: 'Free medication',
    application_url: 'https://www.astellaspharmasupportsolutions.com',
    phone: '1-800-477-6472',
    notes: 'For uninsured patients.',
    is_active: true
  },
  {
    medication_id: 'tacrolimus-001',
    program_name: 'GoodRx / SingleCare Discount',
    program_type: 'discount_card',
    commercial_eligible: true,
    medicare_eligible: true,
    medicaid_eligible: true,
    uninsured_eligible: true,
    tricare_va_eligible: true,
    ihs_tribal_eligible: true,
    income_limit: 'None',
    max_benefit: 'Generic as low as $15-40/month',
    application_url: 'https://www.goodrx.com/tacrolimus',
    notes: 'Free discount card.',
    is_active: true
  },

  // ----- MYCOPHENOLATE (CellCept) -----
  {
    medication_id: 'mycophenolate',
    program_name: 'CellCept Co-pay Card',
    program_type: 'copay_card',
    commercial_eligible: true,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: false,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: 'None',
    max_benefit: 'Pay as little as $0, up to $10,000/year',
    application_url: 'https://www.cellcept.com/patient/cost-and-financial-support.html',
    phone: '1-866-422-2377',
    state_restrictions: 'NOT valid in CA or MA',
    notes: 'For commercially insured patients on brand CellCept.',
    is_active: true
  },
  {
    medication_id: 'mycophenolate',
    program_name: 'Genentech Patient Foundation',
    program_type: 'pap',
    commercial_eligible: false,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: true,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: 'Based on financial need',
    max_benefit: 'Free medication',
    application_url: 'https://www.genentech-access.com/patient/brands/cellcept.html',
    phone: '1-866-422-2377',
    notes: 'For uninsured or denied coverage.',
    is_active: true
  },
  {
    medication_id: 'mycophenolate',
    program_name: 'GoodRx / SingleCare Discount',
    program_type: 'discount_card',
    commercial_eligible: true,
    medicare_eligible: true,
    medicaid_eligible: true,
    uninsured_eligible: true,
    tricare_va_eligible: true,
    ihs_tribal_eligible: true,
    income_limit: 'None',
    max_benefit: 'Generic as low as $10-25/month',
    application_url: 'https://www.goodrx.com/mycophenolate-mofetil',
    notes: 'Generic mycophenolate widely available.',
    is_active: true
  },

  // ----- MYFORTIC -----
  {
    medication_id: 'myfortic',
    program_name: 'Myfortic Co-pay Card',
    program_type: 'copay_card',
    commercial_eligible: true,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: false,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: 'None',
    max_benefit: 'Pay as little as $0',
    application_url: 'https://www.novartis.com/us-en/patients-and-caregivers/patient-assistance',
    phone: '1-800-277-2254',
    state_restrictions: 'NOT valid in CA or MA',
    notes: 'For commercially insured patients.',
    is_active: true
  },
  {
    medication_id: 'myfortic',
    program_name: 'Novartis Patient Assistance Foundation',
    program_type: 'pap',
    commercial_eligible: false,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: true,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: '400% FPL',
    max_benefit: 'Free medication',
    application_url: 'https://www.novartis.com/us-en/patients-and-caregivers/patient-assistance',
    phone: '1-800-277-2254',
    notes: 'For uninsured patients.',
    is_active: true
  },
  {
    medication_id: 'myfortic',
    program_name: 'GoodRx / SingleCare Discount',
    program_type: 'discount_card',
    commercial_eligible: true,
    medicare_eligible: true,
    medicaid_eligible: true,
    uninsured_eligible: true,
    tricare_va_eligible: true,
    ihs_tribal_eligible: true,
    income_limit: 'None',
    max_benefit: 'Generic mycophenolic acid available',
    application_url: 'https://www.goodrx.com/mycophenolic-acid',
    notes: 'Compare generic prices.',
    is_active: true
  },

  // ----- CYCLOSPORINE (Neoral/Sandimmune/Gengraf) -----
  {
    medication_id: 'cyclosporine',
    program_name: 'Neoral Co-pay Card',
    program_type: 'copay_card',
    commercial_eligible: true,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: false,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: 'None',
    max_benefit: 'Savings on brand Neoral',
    application_url: 'https://www.novartis.com/us-en/patients-and-caregivers/patient-assistance',
    phone: '1-800-277-2254',
    state_restrictions: 'NOT valid in CA or MA',
    notes: 'For brand Neoral only.',
    is_active: true
  },
  {
    medication_id: 'cyclosporine',
    program_name: 'Novartis Patient Assistance Foundation',
    program_type: 'pap',
    commercial_eligible: false,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: true,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: '400% FPL',
    max_benefit: 'Free medication',
    application_url: 'https://www.novartis.com/us-en/patients-and-caregivers/patient-assistance',
    phone: '1-800-277-2254',
    notes: 'For uninsured patients.',
    is_active: true
  },
  {
    medication_id: 'cyclosporine',
    program_name: 'GoodRx / SingleCare Discount',
    program_type: 'discount_card',
    commercial_eligible: true,
    medicare_eligible: true,
    medicaid_eligible: true,
    uninsured_eligible: true,
    tricare_va_eligible: true,
    ihs_tribal_eligible: true,
    income_limit: 'None',
    max_benefit: 'Generic cyclosporine modified available',
    application_url: 'https://www.goodrx.com/cyclosporine',
    notes: 'Generic widely available.',
    is_active: true
  },

  // ----- SIROLIMUS (Rapamune) -----
  {
    medication_id: 'sirolimus',
    program_name: 'Rapamune Co-pay Card',
    program_type: 'copay_card',
    commercial_eligible: true,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: false,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: 'None',
    max_benefit: 'Pay as little as $0',
    application_url: 'https://www.pfizerrxpathways.com/',
    phone: '1-844-989-7284',
    state_restrictions: 'NOT valid in CA or MA',
    notes: 'For commercially insured patients.',
    is_active: true
  },
  {
    medication_id: 'sirolimus',
    program_name: 'Pfizer RxPathways',
    program_type: 'pap',
    commercial_eligible: false,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: true,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: '400% FPL',
    max_benefit: 'Free medication',
    application_url: 'https://www.pfizerrxpathways.com/',
    phone: '1-844-989-7284',
    notes: 'For uninsured patients.',
    is_active: true
  },
  {
    medication_id: 'sirolimus',
    program_name: 'GoodRx / SingleCare Discount',
    program_type: 'discount_card',
    commercial_eligible: true,
    medicare_eligible: true,
    medicaid_eligible: true,
    uninsured_eligible: true,
    tricare_va_eligible: true,
    ihs_tribal_eligible: true,
    income_limit: 'None',
    max_benefit: 'Generic sirolimus available',
    application_url: 'https://www.goodrx.com/sirolimus',
    notes: 'Compare generic prices.',
    is_active: true
  },

  // ----- EVEROLIMUS (Zortress) -----
  {
    medication_id: 'everolimus',
    program_name: 'Zortress Co-pay Card',
    program_type: 'copay_card',
    commercial_eligible: true,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: false,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: 'None',
    max_benefit: 'Pay as little as $5',
    application_url: 'https://www.novartis.com/us-en/patients-and-caregivers/patient-assistance',
    phone: '1-800-277-2254',
    state_restrictions: 'NOT valid in CA or MA',
    notes: 'For commercially insured patients.',
    is_active: true
  },
  {
    medication_id: 'everolimus',
    program_name: 'Novartis Patient Assistance Foundation',
    program_type: 'pap',
    commercial_eligible: false,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: true,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: '400% FPL',
    max_benefit: 'Free medication',
    application_url: 'https://www.novartis.com/us-en/patients-and-caregivers/patient-assistance',
    phone: '1-800-277-2254',
    notes: 'For uninsured patients.',
    is_active: true
  },
  {
    medication_id: 'everolimus',
    program_name: 'GoodRx / SingleCare Discount',
    program_type: 'discount_card',
    commercial_eligible: true,
    medicare_eligible: true,
    medicaid_eligible: true,
    uninsured_eligible: true,
    tricare_va_eligible: true,
    ihs_tribal_eligible: true,
    income_limit: 'None',
    max_benefit: 'Generic everolimus available',
    application_url: 'https://www.goodrx.com/everolimus',
    notes: 'Compare prices.',
    is_active: true
  },

  // ----- AZATHIOPRINE (Imuran) -----
  {
    medication_id: 'imuran',
    program_name: 'GoodRx / SingleCare Discount',
    program_type: 'discount_card',
    commercial_eligible: true,
    medicare_eligible: true,
    medicaid_eligible: true,
    uninsured_eligible: true,
    tricare_va_eligible: true,
    ihs_tribal_eligible: true,
    income_limit: 'None',
    max_benefit: 'As low as $4-15/month',
    application_url: 'https://www.goodrx.com/azathioprine',
    notes: 'Very affordable generic. Often on $4 lists.',
    is_active: true
  },
  {
    medication_id: 'imuran',
    program_name: 'Walmart $4 Generics',
    program_type: 'discount_card',
    commercial_eligible: true,
    medicare_eligible: true,
    medicaid_eligible: true,
    uninsured_eligible: true,
    tricare_va_eligible: true,
    ihs_tribal_eligible: true,
    income_limit: 'None',
    max_benefit: '$4 for 30-day supply',
    application_url: 'https://www.walmart.com/cp/4-dollar-prescriptions/1078664',
    notes: 'Check if available at your local Walmart.',
    is_active: true
  },

  // ----- BELATACEPT (Nulojix) -----
  {
    medication_id: 'belatacept',
    program_name: 'Nulojix Co-pay Card',
    program_type: 'copay_card',
    commercial_eligible: true,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: false,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: 'None',
    max_benefit: 'Pay $0 per infusion',
    application_url: 'https://www.bms.com/patient-and-caregiver/get-help-paying-for-your-medicines.html',
    phone: '1-800-861-0048',
    state_restrictions: 'NOT valid in CA or MA',
    notes: 'For commercially insured patients. IV infusion medication.',
    is_active: true
  },
  {
    medication_id: 'belatacept',
    program_name: 'BMS Patient Assistance Foundation',
    program_type: 'pap',
    commercial_eligible: false,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: true,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: '300% FPL',
    max_benefit: 'Free medication',
    application_url: 'https://www.bms.com/patient-and-caregiver/get-help-paying-for-your-medicines.html',
    phone: '1-800-861-0048',
    notes: 'For uninsured patients.',
    is_active: true
  },

  // =====================================================
  // SECTION 2: ANTIVIRALS
  // =====================================================

  // ----- VALGANCICLOVIR (Valcyte) -----
  {
    medication_id: 'valcyte',
    program_name: 'SingleCare Valganciclovir Discount',
    program_type: 'discount_card',
    commercial_eligible: true,
    medicare_eligible: true,
    medicaid_eligible: true,
    uninsured_eligible: true,
    tricare_va_eligible: true,
    ihs_tribal_eligible: true,
    income_limit: 'None',
    max_benefit: 'Cash $6,600 → as low as $127 with card',
    application_url: 'https://www.singlecare.com/prescription/valganciclovir',
    notes: 'HUGE SAVINGS on generic. Compare to insurance copay!',
    is_active: true
  },
  {
    medication_id: 'valcyte',
    program_name: 'HealthWell Foundation - CMV Fund',
    program_type: 'foundation',
    commercial_eligible: true,
    medicare_eligible: true,
    medicaid_eligible: true,
    uninsured_eligible: false,
    tricare_va_eligible: true,
    ihs_tribal_eligible: true,
    income_limit: '500% FPL',
    max_benefit: 'Up to $15,000/year copay assistance',
    application_url: 'https://www.healthwellfoundation.org/fund/cytomegalovirus-cmv/',
    phone: '1-800-675-8416',
    fund_status_note: 'Check website - fund opens/closes',
    notes: 'Must have insurance. Helps with copays.',
    is_active: true
  },
  {
    medication_id: 'valcyte',
    program_name: 'PAN Foundation',
    program_type: 'foundation',
    commercial_eligible: false,
    medicare_eligible: true,
    medicaid_eligible: false,
    uninsured_eligible: false,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: '400% FPL',
    max_benefit: 'Copay assistance',
    application_url: 'https://www.panfoundation.org',
    phone: '1-866-316-7263',
    fund_status_note: 'Check fund status',
    notes: 'For Medicare patients.',
    is_active: true
  },
  {
    medication_id: 'valcyte',
    program_name: 'H2 Pharma Patient Assistance',
    program_type: 'pap',
    commercial_eligible: false,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: true,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: 'Based on financial need',
    max_benefit: 'Free medication',
    application_url: 'https://www.h2-pharma.com/patient-support/',
    phone: '1-866-946-3864',
    notes: 'For uninsured. Doctor must apply.',
    is_active: true
  },

  // Also for valganciclovir-002
  {
    medication_id: 'valganciclovir-002',
    program_name: 'SingleCare Valganciclovir Discount',
    program_type: 'discount_card',
    commercial_eligible: true,
    medicare_eligible: true,
    medicaid_eligible: true,
    uninsured_eligible: true,
    tricare_va_eligible: true,
    ihs_tribal_eligible: true,
    income_limit: 'None',
    max_benefit: 'Cash $6,600 → as low as $127',
    application_url: 'https://www.singlecare.com/prescription/valganciclovir',
    notes: 'HUGE SAVINGS on generic.',
    is_active: true
  },
  {
    medication_id: 'valganciclovir-002',
    program_name: 'HealthWell Foundation - CMV Fund',
    program_type: 'foundation',
    commercial_eligible: true,
    medicare_eligible: true,
    medicaid_eligible: true,
    uninsured_eligible: false,
    tricare_va_eligible: true,
    ihs_tribal_eligible: true,
    income_limit: '500% FPL',
    max_benefit: 'Up to $15,000/year',
    application_url: 'https://www.healthwellfoundation.org/fund/cytomegalovirus-cmv/',
    phone: '1-800-675-8416',
    fund_status_note: 'Check availability',
    notes: 'Must have insurance.',
    is_active: true
  },
  {
    medication_id: 'valganciclovir-002',
    program_name: 'H2 Pharma Patient Assistance',
    program_type: 'pap',
    commercial_eligible: false,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: true,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: 'Based on need',
    max_benefit: 'Free medication',
    application_url: 'https://www.h2-pharma.com/patient-support/',
    phone: '1-866-946-3864',
    notes: 'For uninsured.',
    is_active: true
  },

  // ----- GANCICLOVIR (Cytovene) - IV version -----
  {
    medication_id: 'cytovene',
    program_name: 'H2 Pharma Patient Assistance',
    program_type: 'pap',
    commercial_eligible: false,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: true,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: 'Based on need',
    max_benefit: 'Free medication',
    application_url: 'https://www.h2-pharma.com/patient-support/',
    phone: '1-866-946-3864',
    notes: 'IV form used in hospital/infusion centers.',
    is_active: true
  },

  // ----- ACYCLOVIR (Zovirax) -----
  {
    medication_id: 'zovirax',
    program_name: 'GoodRx / SingleCare Discount',
    program_type: 'discount_card',
    commercial_eligible: true,
    medicare_eligible: true,
    medicaid_eligible: true,
    uninsured_eligible: true,
    tricare_va_eligible: true,
    ihs_tribal_eligible: true,
    income_limit: 'None',
    max_benefit: 'As low as $4-10/month',
    application_url: 'https://www.goodrx.com/acyclovir',
    notes: 'Very affordable generic. Often on $4 lists.',
    is_active: true
  },

  // ----- VALACYCLOVIR (Valtrex) -----
  {
    medication_id: 'valtrex',
    program_name: 'GoodRx / SingleCare Discount',
    program_type: 'discount_card',
    commercial_eligible: true,
    medicare_eligible: true,
    medicaid_eligible: true,
    uninsured_eligible: true,
    tricare_va_eligible: true,
    ihs_tribal_eligible: true,
    income_limit: 'None',
    max_benefit: 'As low as $8-20/month',
    application_url: 'https://www.goodrx.com/valacyclovir',
    notes: 'Affordable generic available.',
    is_active: true
  },

  // ----- LETERMOVIR (Prevymis) - CMV prophylaxis -----
  {
    medication_id: 'prevymis',
    program_name: 'Prevymis Savings Program',
    program_type: 'copay_card',
    commercial_eligible: true,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: false,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: 'None',
    max_benefit: 'Pay $0 copay',
    application_url: 'https://www.merckaccessprogram-prevymis.com/',
    phone: '1-855-257-3932',
    state_restrictions: 'NOT valid in CA or MA',
    notes: 'For CMV prophylaxis post-medication. Brand only.',
    is_active: true
  },
  {
    medication_id: 'prevymis',
    program_name: 'Merck Patient Assistance Program',
    program_type: 'pap',
    commercial_eligible: false,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: true,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: '400% FPL',
    max_benefit: 'Free medication',
    application_url: 'https://www.merckaccessprogram-prevymis.com/',
    phone: '1-855-257-3932',
    notes: 'For uninsured patients.',
    is_active: true
  },

  // ----- MARIBAVIR (Livtencity) - CMV treatment -----
  {
    medication_id: 'livtencity',
    program_name: 'Livtencity Co-pay Program',
    program_type: 'copay_card',
    commercial_eligible: true,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: false,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: 'None',
    max_benefit: 'Pay $0 copay',
    application_url: 'https://www.livtencityhcp.com/patient-support',
    phone: '1-833-548-8362',
    state_restrictions: 'NOT valid in CA or MA',
    notes: 'For CMV treatment. Brand only.',
    is_active: true
  },
  {
    medication_id: 'livtencity',
    program_name: 'Takeda Patient Assistance',
    program_type: 'pap',
    commercial_eligible: false,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: true,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: 'Based on need',
    max_benefit: 'Free medication',
    application_url: 'https://www.livtencityhcp.com/patient-support',
    phone: '1-833-548-8362',
    notes: 'For uninsured patients.',
    is_active: true
  },

  // =====================================================
  // SECTION 3: ANTIFUNGALS
  // =====================================================

  // ----- FLUCONAZOLE (Diflucan) -----
  {
    medication_id: 'diflucan',
    program_name: 'GoodRx / SingleCare Discount',
    program_type: 'discount_card',
    commercial_eligible: true,
    medicare_eligible: true,
    medicaid_eligible: true,
    uninsured_eligible: true,
    tricare_va_eligible: true,
    ihs_tribal_eligible: true,
    income_limit: 'None',
    max_benefit: 'As low as $3-10',
    application_url: 'https://www.goodrx.com/fluconazole',
    notes: 'Very affordable generic.',
    is_active: true
  },

  // ----- VORICONAZOLE (Vfend) -----
  {
    medication_id: 'vfend',
    program_name: 'Vfend Co-pay Card',
    program_type: 'copay_card',
    commercial_eligible: true,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: false,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: 'None',
    max_benefit: 'Savings on brand Vfend',
    application_url: 'https://www.pfizerrxpathways.com/',
    phone: '1-844-989-7284',
    state_restrictions: 'NOT valid in CA or MA',
    notes: 'For brand Vfend only.',
    is_active: true
  },
  {
    medication_id: 'vfend',
    program_name: 'Pfizer RxPathways',
    program_type: 'pap',
    commercial_eligible: false,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: true,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: '400% FPL',
    max_benefit: 'Free medication',
    application_url: 'https://www.pfizerrxpathways.com/',
    phone: '1-844-989-7284',
    notes: 'For uninsured patients.',
    is_active: true
  },
  {
    medication_id: 'vfend',
    program_name: 'GoodRx / SingleCare Discount',
    program_type: 'discount_card',
    commercial_eligible: true,
    medicare_eligible: true,
    medicaid_eligible: true,
    uninsured_eligible: true,
    tricare_va_eligible: true,
    ihs_tribal_eligible: true,
    income_limit: 'None',
    max_benefit: 'Generic voriconazole available',
    application_url: 'https://www.goodrx.com/voriconazole',
    notes: 'Compare generic prices.',
    is_active: true
  },

  // ----- POSACONAZOLE (Noxafil) -----
  {
    medication_id: 'noxafil',
    program_name: 'Noxafil Co-pay Card',
    program_type: 'copay_card',
    commercial_eligible: true,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: false,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: 'None',
    max_benefit: 'Pay $0 copay',
    application_url: 'https://www.merckaccessprogram-noxafil.com/',
    phone: '1-800-672-6372',
    state_restrictions: 'NOT valid in CA or MA',
    notes: 'For commercially insured patients.',
    is_active: true
  },
  {
    medication_id: 'noxafil',
    program_name: 'Merck Patient Assistance Program',
    program_type: 'pap',
    commercial_eligible: false,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: true,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: '400% FPL',
    max_benefit: 'Free medication',
    application_url: 'https://www.merckaccessprogram-noxafil.com/',
    phone: '1-800-672-6372',
    notes: 'For uninsured patients.',
    is_active: true
  },

  // ----- ISAVUCONAZONIUM (Cresemba) -----
  {
    medication_id: 'cresemba',
    program_name: 'Cresemba Savings Card',
    program_type: 'copay_card',
    commercial_eligible: true,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: false,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: 'None',
    max_benefit: 'Pay as little as $0',
    application_url: 'https://www.cresemba.com/savings',
    phone: '1-844-287-2496',
    state_restrictions: 'NOT valid in CA or MA',
    notes: 'For commercially insured patients.',
    is_active: true
  },
  {
    medication_id: 'cresemba',
    program_name: 'Astellas Patient Assistance Program',
    program_type: 'pap',
    commercial_eligible: false,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: true,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: '400% FPL',
    max_benefit: 'Free medication',
    application_url: 'https://www.astellaspharmasupportsolutions.com',
    phone: '1-800-477-6472',
    notes: 'For uninsured patients.',
    is_active: true
  },

  // =====================================================
  // SECTION 4: INDUCTION AGENTS
  // =====================================================

  // ----- THYMOGLOBULIN (Anti-thymocyte globulin Rabbit) -----
  {
    medication_id: 'thymoglobulin',
    program_name: 'Sanofi Patient Assistance',
    program_type: 'pap',
    commercial_eligible: false,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: true,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: '400% FPL',
    max_benefit: 'Free medication',
    application_url: 'https://www.sanofipatientconnection.com/',
    phone: '1-888-847-4877',
    notes: 'For uninsured. Usually given during medication hospitalization.',
    is_active: true
  },

  // ----- ATGAM (Anti-thymocyte globulin Equine) -----
  {
    medication_id: 'atgam',
    program_name: 'Pfizer RxPathways',
    program_type: 'pap',
    commercial_eligible: false,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: true,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: '400% FPL',
    max_benefit: 'Free medication',
    application_url: 'https://www.pfizerrxpathways.com/',
    phone: '1-844-989-7284',
    notes: 'For uninsured. Hospital/infusion administered.',
    is_active: true
  },

  // ----- BASILIXIMAB (Simulect) -----
  {
    medication_id: 'simulect',
    program_name: 'Novartis Patient Assistance Foundation',
    program_type: 'pap',
    commercial_eligible: false,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: true,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: '400% FPL',
    max_benefit: 'Free medication',
    application_url: 'https://www.novartis.com/us-en/patients-and-caregivers/patient-assistance',
    phone: '1-800-277-2254',
    notes: 'For uninsured. Given at time of medication.',
    is_active: true
  },

  // ----- ALEMTUZUMAB (Campath/Lemtrada) -----
  {
    medication_id: 'campath',
    program_name: 'Sanofi Patient Assistance',
    program_type: 'pap',
    commercial_eligible: false,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: true,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: '400% FPL',
    max_benefit: 'Free medication',
    application_url: 'https://www.sanofipatientconnection.com/',
    phone: '1-888-847-4877',
    notes: 'For uninsured. Infusion medication.',
    is_active: true
  },

  // ----- RITUXIMAB (Rituxan) -----
  {
    medication_id: 'rituxan',
    program_name: 'Rituxan Co-pay Card',
    program_type: 'copay_card',
    commercial_eligible: true,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: false,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: 'None',
    max_benefit: 'Pay $0 per infusion',
    application_url: 'https://www.genentech-access.com/patient/brands/rituxan.html',
    phone: '1-888-249-4918',
    state_restrictions: 'NOT valid in CA or MA',
    notes: 'For commercially insured patients.',
    is_active: true
  },
  {
    medication_id: 'rituxan',
    program_name: 'Genentech Patient Foundation',
    program_type: 'pap',
    commercial_eligible: false,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: true,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: 'Based on need',
    max_benefit: 'Free medication',
    application_url: 'https://www.genentech-access.com/patient/brands/rituxan.html',
    phone: '1-888-249-4918',
    notes: 'For uninsured patients.',
    is_active: true
  },

  // =====================================================
  // SECTION 5: COMMON COMMON MEDICATIONS
  // =====================================================

  // ----- PREDNISONE -----
  {
    medication_id: 'prednisone',
    program_name: 'GoodRx / SingleCare Discount',
    program_type: 'discount_card',
    commercial_eligible: true,
    medicare_eligible: true,
    medicaid_eligible: true,
    uninsured_eligible: true,
    tricare_va_eligible: true,
    ihs_tribal_eligible: true,
    income_limit: 'None',
    max_benefit: 'As low as $3-5/month',
    application_url: 'https://www.goodrx.com/prednisone',
    notes: 'Very cheap generic. Often free or under $5.',
    is_active: true
  },
  {
    medication_id: 'prednisone',
    program_name: 'Walmart $4 Generics',
    program_type: 'discount_card',
    commercial_eligible: true,
    medicare_eligible: true,
    medicaid_eligible: true,
    uninsured_eligible: true,
    tricare_va_eligible: true,
    ihs_tribal_eligible: true,
    income_limit: 'None',
    max_benefit: '$4 for 30-day supply',
    application_url: 'https://www.walmart.com/cp/4-dollar-prescriptions/1078664',
    notes: 'Check Walmart pharmacy.',
    is_active: true
  },

  // ----- BACTRIM (Trimethoprim-Sulfamethoxazole) -----
  {
    medication_id: 'bactrim',
    program_name: 'GoodRx / SingleCare Discount',
    program_type: 'discount_card',
    commercial_eligible: true,
    medicare_eligible: true,
    medicaid_eligible: true,
    uninsured_eligible: true,
    tricare_va_eligible: true,
    ihs_tribal_eligible: true,
    income_limit: 'None',
    max_benefit: 'As low as $4-8/month',
    application_url: 'https://www.goodrx.com/sulfamethoxazole-trimethoprim',
    notes: 'Very affordable generic. PCP prophylaxis.',
    is_active: true
  },

  // ----- OMEPRAZOLE (Prilosec) - GI protection -----
  {
    medication_id: 'omeprazole',
    program_name: 'GoodRx / SingleCare Discount',
    program_type: 'discount_card',
    commercial_eligible: true,
    medicare_eligible: true,
    medicaid_eligible: true,
    uninsured_eligible: true,
    tricare_va_eligible: true,
    ihs_tribal_eligible: true,
    income_limit: 'None',
    max_benefit: 'As low as $3-8/month',
    application_url: 'https://www.goodrx.com/omeprazole',
    notes: 'Also available OTC. Very affordable.',
    is_active: true
  },

  // =====================================================
  // SECTION 6: DIABETES MEDICATIONS
  // =====================================================

  // ----- METFORMIN -----
  {
    medication_id: 'metformin',
    program_name: 'GoodRx / SingleCare Discount',
    program_type: 'discount_card',
    commercial_eligible: true,
    medicare_eligible: true,
    medicaid_eligible: true,
    uninsured_eligible: true,
    tricare_va_eligible: true,
    ihs_tribal_eligible: true,
    income_limit: 'None',
    max_benefit: 'As low as $4/month',
    application_url: 'https://www.goodrx.com/metformin',
    notes: 'Very cheap generic. Often on $4 lists.',
    is_active: true
  },

  // ----- INSULIN GLARGINE (Lantus/Basaglar) -----
  {
    medication_id: 'insulin-glargine',
    program_name: 'Lantus Savings Card',
    program_type: 'copay_card',
    commercial_eligible: true,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: false,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: 'None',
    max_benefit: 'Pay $0 per prescription',
    application_url: 'https://www.lantus.com/sign-up-for-savings',
    phone: '1-866-390-5622',
    state_restrictions: 'NOT valid in CA or MA',
    notes: 'For commercially insured patients.',
    is_active: true
  },
  {
    medication_id: 'insulin-glargine',
    program_name: 'Sanofi Patient Assistance',
    program_type: 'pap',
    commercial_eligible: false,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: true,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: '400% FPL',
    max_benefit: 'Free medication',
    application_url: 'https://www.sanofipatientconnection.com/',
    phone: '1-888-847-4877',
    notes: 'For uninsured patients.',
    is_active: true
  },
  {
    medication_id: 'insulin-glargine',
    program_name: 'Walmart ReliOn Insulin',
    program_type: 'discount_card',
    commercial_eligible: true,
    medicare_eligible: true,
    medicaid_eligible: true,
    uninsured_eligible: true,
    tricare_va_eligible: true,
    ihs_tribal_eligible: true,
    income_limit: 'None',
    max_benefit: '$72.88 per vial (no prescription in some states)',
    application_url: 'https://www.walmart.com/cp/relion/1078664',
    notes: 'Walmart ReliOn is biosimilar insulin glargine.',
    is_active: true
  },

  // ----- INSULIN LISPRO (Humalog) -----
  {
    medication_id: 'insulin-lispro',
    program_name: 'Humalog Savings Card',
    program_type: 'copay_card',
    commercial_eligible: true,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: false,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: 'None',
    max_benefit: 'Pay $35 per prescription',
    application_url: 'https://www.humalog.com/savings-card',
    phone: '1-800-545-6962',
    state_restrictions: 'NOT valid in CA or MA',
    notes: 'For commercially insured patients.',
    is_active: true
  },
  {
    medication_id: 'insulin-lispro',
    program_name: 'Lilly Cares',
    program_type: 'pap',
    commercial_eligible: false,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: true,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: '400% FPL',
    max_benefit: 'Free medication',
    application_url: 'https://www.lillycares.com/',
    phone: '1-800-545-6962',
    notes: 'For uninsured patients.',
    is_active: true
  },

  // ----- INSULIN ASPART (Novolog) -----
  {
    medication_id: 'insulin-aspart',
    program_name: 'NovoLog Savings Card',
    program_type: 'copay_card',
    commercial_eligible: true,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: false,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: 'None',
    max_benefit: 'Pay $25 per prescription',
    application_url: 'https://www.novocare.com/insulin/novolog/savings-card.html',
    phone: '1-866-310-7549',
    state_restrictions: 'NOT valid in CA or MA',
    notes: 'For commercially insured patients.',
    is_active: true
  },
  {
    medication_id: 'insulin-aspart',
    program_name: 'Novo Nordisk PAP',
    program_type: 'pap',
    commercial_eligible: false,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: true,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: '400% FPL',
    max_benefit: 'Free medication',
    application_url: 'https://www.novocare.com/pap.html',
    phone: '1-866-310-7549',
    notes: 'For uninsured patients.',
    is_active: true
  },

  // =====================================================
  // SECTION 7: BLOOD PRESSURE MEDICATIONS
  // =====================================================

  // ----- AMLODIPINE -----
  {
    medication_id: 'amlodipine',
    program_name: 'GoodRx / SingleCare Discount',
    program_type: 'discount_card',
    commercial_eligible: true,
    medicare_eligible: true,
    medicaid_eligible: true,
    uninsured_eligible: true,
    tricare_va_eligible: true,
    ihs_tribal_eligible: true,
    income_limit: 'None',
    max_benefit: 'As low as $3-5/month',
    application_url: 'https://www.goodrx.com/amlodipine',
    notes: 'Very cheap generic.',
    is_active: true
  },

  // ----- LISINOPRIL -----
  {
    medication_id: 'lisinopril',
    program_name: 'GoodRx / SingleCare Discount',
    program_type: 'discount_card',
    commercial_eligible: true,
    medicare_eligible: true,
    medicaid_eligible: true,
    uninsured_eligible: true,
    tricare_va_eligible: true,
    ihs_tribal_eligible: true,
    income_limit: 'None',
    max_benefit: 'As low as $3-5/month',
    application_url: 'https://www.goodrx.com/lisinopril',
    notes: 'Very cheap generic.',
    is_active: true
  },

  // ----- LOSARTAN -----
  {
    medication_id: 'losartan',
    program_name: 'GoodRx / SingleCare Discount',
    program_type: 'discount_card',
    commercial_eligible: true,
    medicare_eligible: true,
    medicaid_eligible: true,
    uninsured_eligible: true,
    tricare_va_eligible: true,
    ihs_tribal_eligible: true,
    income_limit: 'None',
    max_benefit: 'As low as $4-8/month',
    application_url: 'https://www.goodrx.com/losartan',
    notes: 'Affordable generic.',
    is_active: true
  },

  // ----- CARVEDILOL (Coreg) -----
  {
    medication_id: 'coreg',
    program_name: 'GoodRx / SingleCare Discount',
    program_type: 'discount_card',
    commercial_eligible: true,
    medicare_eligible: true,
    medicaid_eligible: true,
    uninsured_eligible: true,
    tricare_va_eligible: true,
    ihs_tribal_eligible: true,
    income_limit: 'None',
    max_benefit: 'As low as $4-10/month',
    application_url: 'https://www.goodrx.com/carvedilol',
    notes: 'Affordable generic carvedilol.',
    is_active: true
  },

  // =====================================================
  // SECTION 8: CHOLESTEROL MEDICATIONS
  // =====================================================

  // ----- ATORVASTATIN (Lipitor) -----
  {
    medication_id: 'atorvastatin',
    program_name: 'GoodRx / SingleCare Discount',
    program_type: 'discount_card',
    commercial_eligible: true,
    medicare_eligible: true,
    medicaid_eligible: true,
    uninsured_eligible: true,
    tricare_va_eligible: true,
    ihs_tribal_eligible: true,
    income_limit: 'None',
    max_benefit: 'As low as $4-8/month',
    application_url: 'https://www.goodrx.com/atorvastatin',
    notes: 'Very affordable generic.',
    is_active: true
  },

  // ----- ROSUVASTATIN (Crestor) -----
  {
    medication_id: 'rosuvastatin',
    program_name: 'GoodRx / SingleCare Discount',
    program_type: 'discount_card',
    commercial_eligible: true,
    medicare_eligible: true,
    medicaid_eligible: true,
    uninsured_eligible: true,
    tricare_va_eligible: true,
    ihs_tribal_eligible: true,
    income_limit: 'None',
    max_benefit: 'As low as $8-15/month',
    application_url: 'https://www.goodrx.com/rosuvastatin',
    notes: 'Generic available.',
    is_active: true
  },

  // =====================================================
  // SECTION 9: KIDNEY-SPECIFIC MEDICATIONS
  // =====================================================

  // ----- SEVELAMER (Renvela) -----
  {
    medication_id: 'renvela',
    program_name: 'Renvela Savings Card',
    program_type: 'copay_card',
    commercial_eligible: true,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: false,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: 'None',
    max_benefit: 'Pay $0 copay',
    application_url: 'https://www.renvela.com/savings-card',
    phone: '1-888-275-7376',
    state_restrictions: 'NOT valid in CA or MA',
    notes: 'Phosphate binder for CKD.',
    is_active: true
  },
  {
    medication_id: 'renvela',
    program_name: 'Sanofi Patient Assistance',
    program_type: 'pap',
    commercial_eligible: false,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: true,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: '400% FPL',
    max_benefit: 'Free medication',
    application_url: 'https://www.sanofipatientconnection.com/',
    phone: '1-888-847-4877',
    notes: 'For uninsured patients.',
    is_active: true
  },

  // ----- CINACALCET (Sensipar) -----
  {
    medication_id: 'sensipar',
    program_name: 'Sensipar Savings Card',
    program_type: 'copay_card',
    commercial_eligible: true,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: false,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: 'None',
    max_benefit: 'Savings on brand',
    application_url: 'https://www.amgen.com/patients/about-amgen-safety-net-foundation',
    phone: '1-888-427-7478',
    state_restrictions: 'NOT valid in CA or MA',
    notes: 'For secondary hyperparathyroidism.',
    is_active: true
  },
  {
    medication_id: 'sensipar',
    program_name: 'Amgen Safety Net Foundation',
    program_type: 'pap',
    commercial_eligible: false,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: true,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: '400% FPL',
    max_benefit: 'Free medication',
    application_url: 'https://www.amgen.com/patients/about-amgen-safety-net-foundation',
    phone: '1-888-427-7478',
    notes: 'For uninsured patients.',
    is_active: true
  },

  // ----- FERRIC CITRATE (Auryxia) -----
  {
    medication_id: 'auryxia',
    program_name: 'Auryxia Savings Card',
    program_type: 'copay_card',
    commercial_eligible: true,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: false,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: 'None',
    max_benefit: 'Pay $0 copay',
    application_url: 'https://www.auryxiahcp.com/patient-support',
    phone: '1-844-207-2117',
    state_restrictions: 'NOT valid in CA or MA',
    notes: 'Iron-based phosphate binder.',
    is_active: true
  },
  {
    medication_id: 'auryxia',
    program_name: 'Akebia Cares',
    program_type: 'pap',
    commercial_eligible: false,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: true,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: '500% FPL',
    max_benefit: 'Free medication',
    application_url: 'https://www.auryxiahcp.com/patient-support',
    phone: '1-844-207-2117',
    notes: 'For uninsured patients.',
    is_active: true
  },

  // =====================================================
  // SECTION 10: ANEMIA MEDICATIONS
  // =====================================================

  // ----- EPOETIN ALFA (Procrit/Epogen) -----
  {
    medication_id: 'procrit',
    program_name: 'Procrit Savings Card',
    program_type: 'copay_card',
    commercial_eligible: true,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: false,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: 'None',
    max_benefit: 'Pay $0 copay',
    application_url: 'https://www.jnjwithme.com/',
    phone: '1-800-652-6227',
    state_restrictions: 'NOT valid in CA or MA',
    notes: 'For anemia. Injection medication.',
    is_active: true
  },
  {
    medication_id: 'procrit',
    program_name: 'Janssen CarePath Savings',
    program_type: 'pap',
    commercial_eligible: false,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: true,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: '500% FPL',
    max_benefit: 'Free medication',
    application_url: 'https://www.jnjwithme.com/',
    phone: '1-800-652-6227',
    notes: 'For uninsured patients.',
    is_active: true
  },

  // ----- DARBEPOETIN ALFA (Aranesp) -----
  {
    medication_id: 'aranesp',
    program_name: 'Aranesp Savings Card',
    program_type: 'copay_card',
    commercial_eligible: true,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: false,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: 'None',
    max_benefit: 'Pay $5 per injection',
    application_url: 'https://www.aranesp.com/savings',
    phone: '1-888-427-7478',
    state_restrictions: 'NOT valid in CA or MA',
    notes: 'For anemia.',
    is_active: true
  },
  {
    medication_id: 'aranesp',
    program_name: 'Amgen Safety Net Foundation',
    program_type: 'pap',
    commercial_eligible: false,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: true,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: '400% FPL',
    max_benefit: 'Free medication',
    application_url: 'https://www.amgen.com/patients/about-amgen-safety-net-foundation',
    phone: '1-888-427-7478',
    notes: 'For uninsured patients.',
    is_active: true
  },

  // =====================================================
  // SECTION 11: PULMONARY HYPERTENSION MEDS
  // =====================================================

  // ----- SILDENAFIL (Revatio) -----
  {
    medication_id: 'revatio',
    program_name: 'Revatio Savings Card',
    program_type: 'copay_card',
    commercial_eligible: true,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: false,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: 'None',
    max_benefit: 'Pay $0 copay',
    application_url: 'https://www.pfizerrxpathways.com/',
    phone: '1-844-989-7284',
    state_restrictions: 'NOT valid in CA or MA',
    notes: 'For pulmonary arterial hypertension.',
    is_active: true
  },
  {
    medication_id: 'revatio',
    program_name: 'Pfizer RxPathways',
    program_type: 'pap',
    commercial_eligible: false,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: true,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: '400% FPL',
    max_benefit: 'Free medication',
    application_url: 'https://www.pfizerrxpathways.com/',
    phone: '1-844-989-7284',
    notes: 'For uninsured patients.',
    is_active: true
  },
  {
    medication_id: 'revatio',
    program_name: 'GoodRx / SingleCare Discount',
    program_type: 'discount_card',
    commercial_eligible: true,
    medicare_eligible: true,
    medicaid_eligible: true,
    uninsured_eligible: true,
    tricare_va_eligible: true,
    ihs_tribal_eligible: true,
    income_limit: 'None',
    max_benefit: 'Generic sildenafil available',
    application_url: 'https://www.goodrx.com/sildenafil',
    notes: 'Generic much cheaper than brand.',
    is_active: true
  },

  // ----- BOSENTAN (Tracleer) -----
  {
    medication_id: 'tracleer',
    program_name: 'Tracleer Savings Program',
    program_type: 'copay_card',
    commercial_eligible: true,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: false,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: 'None',
    max_benefit: 'Pay $0 copay',
    application_url: 'https://www.janssenprescriptionassistance.com/',
    phone: '1-800-526-7736',
    state_restrictions: 'NOT valid in CA or MA',
    notes: 'For PAH. Restricted distribution.',
    is_active: true
  },
  {
    medication_id: 'tracleer',
    program_name: 'Janssen Prescription Assistance',
    program_type: 'pap',
    commercial_eligible: false,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: true,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: '500% FPL',
    max_benefit: 'Free medication',
    application_url: 'https://www.janssenprescriptionassistance.com/',
    phone: '1-800-526-7736',
    notes: 'For uninsured patients.',
    is_active: true
  },

  // =====================================================
  // SECTION 12: LIVER SUPPORT MEDICATIONS
  // =====================================================

  // ----- XIFAXAN (Rifaximin) -----
  {
    medication_id: 'xifaxan',
    program_name: 'Xifaxan Copay Savings Program',
    program_type: 'copay_card',
    commercial_eligible: true,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: false,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: 'None',
    max_benefit: 'Pay as little as $0 per prescription',
    application_url: 'https://xifaxan.copaysavingsprogram.com/',
    phone: '1-866-209-7604',
    state_restrictions: 'NOT valid in CA or MA',
    notes: 'For hepatic encephalopathy in liver disease. Commercial insurance only.',
    is_active: true
  },
  {
    medication_id: 'xifaxan',
    program_name: 'Xifaxan Patient Assistance Program',
    program_type: 'pap',
    commercial_eligible: false,
    medicare_eligible: true,
    medicaid_eligible: true,
    uninsured_eligible: true,
    tricare_va_eligible: true,
    ihs_tribal_eligible: true,
    income_limit: '300% FPL',
    max_benefit: 'Free medication',
    application_url: 'https://www.bauschhealthpap.com/',
    phone: '1-800-321-4576',
    notes: 'For patients without commercial insurance.',
    is_active: true
  },
  {
    medication_id: 'xifaxan',
    program_name: 'GoodRx / SingleCare Discount',
    program_type: 'discount_card',
    commercial_eligible: true,
    medicare_eligible: true,
    medicaid_eligible: true,
    uninsured_eligible: true,
    tricare_va_eligible: true,
    ihs_tribal_eligible: true,
    income_limit: 'None',
    max_benefit: 'Savings on brand (no generic available)',
    application_url: 'https://www.goodrx.com/xifaxan',
    notes: 'Brand only - no generic rifaximin currently available.',
    is_active: true
  },

  // =====================================================
  // SECTION 13: HEPATITIS B/C MEDICATIONS
  // =====================================================

  // ----- ENTECAVIR (Baraclude) -----
  {
    medication_id: 'baraclude',
    program_name: 'Baraclude Savings Card',
    program_type: 'copay_card',
    commercial_eligible: true,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: false,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: 'None',
    max_benefit: 'Pay $0 copay',
    application_url: 'https://www.bms.com/patient-and-caregiver/get-help-paying-for-your-medicines.html',
    phone: '1-800-861-0048',
    state_restrictions: 'NOT valid in CA or MA',
    notes: 'For Hepatitis B.',
    is_active: true
  },
  {
    medication_id: 'baraclude',
    program_name: 'BMS Patient Assistance Foundation',
    program_type: 'pap',
    commercial_eligible: false,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: true,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: '300% FPL',
    max_benefit: 'Free medication',
    application_url: 'https://www.bms.com/patient-and-caregiver/get-help-paying-for-your-medicines.html',
    phone: '1-800-861-0048',
    notes: 'For uninsured patients.',
    is_active: true
  },
  {
    medication_id: 'baraclude',
    program_name: 'GoodRx / SingleCare Discount',
    program_type: 'discount_card',
    commercial_eligible: true,
    medicare_eligible: true,
    medicaid_eligible: true,
    uninsured_eligible: true,
    tricare_va_eligible: true,
    ihs_tribal_eligible: true,
    income_limit: 'None',
    max_benefit: 'Generic entecavir available',
    application_url: 'https://www.goodrx.com/entecavir',
    notes: 'Generic much cheaper.',
    is_active: true
  },

  // ----- TENOFOVIR ALAFENAMIDE (Vemlidy) -----
  {
    medication_id: 'vemlidy',
    program_name: 'Vemlidy Savings Card',
    program_type: 'copay_card',
    commercial_eligible: true,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: false,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: 'None',
    max_benefit: 'Pay $0 copay',
    application_url: 'https://www.gilead.com/purpose/medication-assistance',
    phone: '1-800-226-2056',
    state_restrictions: 'NOT valid in CA or MA',
    notes: 'For Hepatitis B.',
    is_active: true
  },
  {
    medication_id: 'vemlidy',
    program_name: 'Gilead Advancing Access',
    program_type: 'pap',
    commercial_eligible: false,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: true,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: '500% FPL',
    max_benefit: 'Free medication',
    application_url: 'https://www.gilead.com/purpose/medication-assistance',
    phone: '1-800-226-2056',
    notes: 'For uninsured patients.',
    is_active: true
  },

  // ----- SOFOSBUVIR/VELPATASVIR (Epclusa) - Hep C -----
  {
    medication_id: 'epclusa',
    program_name: 'Epclusa Savings Card',
    program_type: 'copay_card',
    commercial_eligible: true,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: false,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: 'None',
    max_benefit: 'Pay $5 per prescription',
    application_url: 'https://www.gilead.com/purpose/medication-assistance',
    phone: '1-800-226-2056',
    state_restrictions: 'NOT valid in CA or MA',
    notes: 'For Hepatitis C cure.',
    is_active: true
  },
  {
    medication_id: 'epclusa',
    program_name: 'Gilead Advancing Access',
    program_type: 'pap',
    commercial_eligible: false,
    medicare_eligible: false,
    medicaid_eligible: false,
    uninsured_eligible: true,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: '500% FPL',
    max_benefit: 'Free medication',
    application_url: 'https://www.gilead.com/purpose/medication-assistance',
    phone: '1-800-226-2056',
    notes: 'For uninsured patients.',
    is_active: true
  },

  // =====================================================
  // SECTION 13: UNIVERSAL PROGRAMS (Apply to ALL medications)
  // =====================================================
  {
    medication_id: null,
    program_name: 'HealthWell Foundation - Solid Organ medication Fund',
    program_type: 'foundation',
    commercial_eligible: true,
    medicare_eligible: true,
    medicaid_eligible: true,
    uninsured_eligible: false,
    tricare_va_eligible: true,
    ihs_tribal_eligible: true,
    income_limit: '500% FPL',
    max_benefit: 'Up to $15,000/year',
    application_url: 'https://www.healthwellfoundation.org/fund/solid-organ-and-hematopoietic-cell-medication/',
    phone: '1-800-675-8416',
    fund_status_note: 'Check website - opens/closes based on funding',
    notes: 'Covers multiple medications. Must have insurance.',
    is_active: true
  },
  {
    medication_id: null,
    program_name: 'PAN Foundation - medication Immunosuppressant',
    program_type: 'foundation',
    commercial_eligible: false,
    medicare_eligible: true,
    medicaid_eligible: false,
    uninsured_eligible: false,
    tricare_va_eligible: false,
    ihs_tribal_eligible: false,
    income_limit: '400% FPL',
    max_benefit: 'Copay assistance',
    application_url: 'https://www.panfoundation.org',
    phone: '1-866-316-7263',
    fund_status_note: 'Check website - fund status varies',
    notes: 'For Medicare patients with medication immunosuppressants.',
    is_active: true
  },
  {
    medication_id: null,
    program_name: 'Patient Advocate Foundation Co-Pay Relief',
    program_type: 'foundation',
    commercial_eligible: true,
    medicare_eligible: true,
    medicaid_eligible: true,
    uninsured_eligible: false,
    tricare_va_eligible: true,
    ihs_tribal_eligible: true,
    income_limit: '400% FPL',
    max_benefit: 'Copay assistance',
    application_url: 'https://www.copays.org',
    phone: '1-866-512-3861',
    notes: 'Multiple disease funds including medication.',
    is_active: true
  }
];

// Function to ensure required columns exist
async function ensureColumnsExist() {
  await sql`ALTER TABLE savings_programs ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true`;
  await sql`ALTER TABLE savings_programs ADD COLUMN IF NOT EXISTS fund_status_note TEXT`;
  await sql`ALTER TABLE savings_programs ADD COLUMN IF NOT EXISTS state_restrictions TEXT`;
  await sql`ALTER TABLE savings_programs ADD COLUMN IF NOT EXISTS enrollment_valid TEXT`;
}

// Function to insert a single program
async function insertProgram(program) {
  const result = await sql`
    INSERT INTO savings_programs (
      medication_id, program_name, program_type,
      commercial_eligible, medicare_eligible, medicaid_eligible,
      uninsured_eligible, tricare_va_eligible, ihs_tribal_eligible,
      income_limit, max_benefit, application_url, phone,
      state_restrictions, fund_status_note, notes, is_active
    ) VALUES (
      ${program.medication_id},
      ${program.program_name},
      ${program.program_type},
      ${program.commercial_eligible},
      ${program.medicare_eligible},
      ${program.medicaid_eligible},
      ${program.uninsured_eligible},
      ${program.tricare_va_eligible},
      ${program.ihs_tribal_eligible},
      ${program.income_limit || null},
      ${program.max_benefit || null},
      ${program.application_url || null},
      ${program.phone || null},
      ${program.state_restrictions || null},
      ${program.fund_status_note || null},
      ${program.notes || null},
      ${program.is_active}
    )
    ON CONFLICT DO NOTHING
    RETURNING id
  `;
  return result;
}

export async function handler(event) {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed. Use POST.' })
    };
  }

  // Check migration key for security (optional but recommended)
  const migrationKey = event.headers['x-migration-key'] || event.headers['X-Migration-Key'];
  const expectedKey = process.env.MIGRATION_SECRET;

  if (expectedKey && migrationKey !== expectedKey) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Unauthorized. Invalid migration key.' })
    };
  }

  try {
    console.log('Starting savings programs migration...');

    // Step 1: Ensure columns exist
    await ensureColumnsExist();
    console.log('Columns verified/created');

    // Step 2: Insert all programs
    let inserted = 0;
    let skipped = 0;
    const errors = [];

    for (const program of savingsPrograms) {
      try {
        const result = await insertProgram(program);
        if (result.length > 0) {
          inserted++;
        } else {
          skipped++;
        }
      } catch (err) {
        errors.push({
          program: program.program_name,
          medication: program.medication_id,
          error: err.message
        });
      }
    }

    // Step 3: Get summary counts
    const [typeCount] = await sql`
      SELECT program_type, COUNT(*) as count
      FROM savings_programs
      GROUP BY program_type
      ORDER BY count DESC
    `;

    const [totalCount] = await sql`SELECT COUNT(*) as total FROM savings_programs`;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Migration completed successfully',
        stats: {
          totalProgramsInDatabase: totalCount?.total || 0,
          inserted,
          skipped,
          errors: errors.length,
          errorDetails: errors.length > 0 ? errors : undefined
        }
      })
    };

  } catch (error) {
    console.error('Migration error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Migration failed',
        message: error.message
      })
    };
  }
}
