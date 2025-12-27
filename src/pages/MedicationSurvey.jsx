import { useState } from 'react';
import {
  Building2,
  Pill,
  Package,
  ClipboardList,
  HeartHandshake,
  Phone,
  Heart,
  ChevronLeft
} from 'lucide-react';

// Medication Journey Survey
// Captures medication-specific failure points in medication access
// HIPAA-free: All user self-reported, no PHI collected

export default function MedicationSurvey() {
  const [activeTab, setActiveTab] = useState(null);
  const [responses, setResponses] = useState({});
  const [completedSections, setCompletedSections] = useState(new Set());

  const updateResponse = (field, value) => {
    setResponses(prev => ({ ...prev, [field]: value }));
  };

  const sections = [
    {
      id: 'discharge',
      title: "Discharge & Transition",
      shortTitle: "Discharge",
      icon: Building2,
      description: "Your experience leaving the hospital after medication",
      questions: [
        { id: 'meds_in_hand_at_discharge', label: 'Did you leave the hospital with all your medications in hand?', type: 'yesno' },
        { id: 'discharge_med_education', label: 'How would you rate the medication education you received before discharge?', type: 'select',
          options: ['Excellent - felt fully prepared', 'Good - had most info I needed', 'Fair - had significant gaps', 'Poor - felt unprepared', 'None - figured it out myself'] },
        { id: 'knew_costs_before_discharge', label: 'Did you know what your medications would cost before you left the hospital?', type: 'yesno' },
        { id: 'social_worker_met', label: 'Did a social worker or financial counselor meet with you about medication costs?', type: 'yesno' },
        { id: 'first_refill_gap', label: 'Did you experience a gap in medication when it was time for your first refill?', type: 'yesno' },
      ]
    },
    {
      id: 'immunosuppressants',
      title: "Immunosuppressant Experience",
      shortTitle: "Immunosuppressants",
      icon: Pill,
      description: "Challenges specific to your anti-rejection medications",
      questions: [
        { id: 'generic_switch_forced', label: 'Have you ever been switched from brand to generic (or vice versa) without your input?', type: 'yesno' },
        { id: 'generic_switch_problems', label: 'If switched, did you experience level fluctuations or side effects?', type: 'yesno_na' },
        { id: 'trough_timing_issues', label: 'Have you had difficulty coordinating lab timing with medication doses?', type: 'yesno' },
        { id: 'dose_change_delay', label: 'After a dose adjustment, how long until you received the new prescription?', type: 'select',
          options: ['Same day', '1-2 days', '3-5 days', 'More than 5 days', 'Had to use old dose while waiting'] },
        { id: 'ever_missed_immunosuppressant', label: 'Have you ever missed a dose of anti-rejection medication due to access issues (not forgetfulness)?', type: 'yesno' },
        { id: 'missed_reason', label: 'If yes, what was the primary reason?', type: 'select',
          options: ['Cost', 'Pharmacy delay', 'Prior authorization', 'Out of stock', 'Shipping issue', 'Insurance denial', 'Not applicable'] },
      ]
    },
    {
      id: 'specialty',
      title: "Specialty Pharmacy",
      shortTitle: "Specialty Pharmacy",
      icon: Package,
      description: "Your experience with specialty pharmacy services",
      questions: [
        { id: 'uses_specialty_pharmacy', label: 'Are any of your medications filled through a specialty pharmacy?', type: 'yesno' },
        { id: 'specialty_choice', label: 'Did you get to choose your specialty pharmacy?', type: 'select',
          options: ['Yes, I chose', 'No, insurance mandated one', 'No, healthcare provider assigned one', 'Not sure', 'Don\'t use specialty pharmacy'] },
        { id: 'specialty_shipping_issues', label: 'Have you experienced shipping delays or temperature concerns with specialty deliveries?', type: 'yesno_na' },
        { id: 'specialty_refill_calls', label: 'How many calls does it typically take to complete a specialty refill?', type: 'select',
          options: ['None - it\'s automatic', '1 call', '2-3 calls', '4+ calls', 'Don\'t use specialty pharmacy'] },
        { id: 'specialty_coordinator_helpful', label: 'If you have a specialty pharmacy coordinator, how helpful are they?', type: 'select',
          options: ['Very helpful', 'Somewhat helpful', 'Not helpful', 'Never talked to one', 'Don\'t have one'] },
      ]
    },
    {
      id: 'insurance',
      title: "Insurance & Coverage",
      shortTitle: "Insurance",
      icon: ClipboardList,
      description: "Insurance challenges post-medication",
      questions: [
        { id: 'insurance_changed_post_tx', label: 'Has your insurance changed since your medication?', type: 'yesno' },
        { id: 'coverage_gap_experienced', label: 'Have you experienced a gap in insurance coverage post-medication?', type: 'yesno' },
        { id: 'medicare_36_month_aware', label: 'Are you aware that Medicare coverage for immunosuppressants was limited to 36 months (before the 2020 change)?', type: 'select',
          options: ['Yes, it affected me', 'Yes, but didn\'t affect me', 'No, wasn\'t aware', 'Not on Medicare'] },
        { id: 'prior_auth_immunosuppressants', label: 'Have you needed prior authorization for immunosuppressant medications?', type: 'yesno' },
        { id: 'step_therapy_post_tx', label: 'Has insurance ever required you to try a different immunosuppressant than what your healthcare provider prescribed?', type: 'yesno' },
        { id: 'annual_oop_range', label: 'What is your approximate annual out-of-pocket cost for medications?', type: 'select',
          options: ['Under $500', '$500-$1,000', '$1,000-$2,500', '$2,500-$5,000', '$5,000-$10,000', 'Over $10,000'] },
      ]
    },
    {
      id: 'center',
      title: "medication Center Support",
      shortTitle: "Center Support",
      icon: Building2,
      description: "Support from your care team",
      questions: [
        { id: 'center_has_pharmacy', label: 'Does your healthcare provider have an in-house or affiliated pharmacy?', type: 'select',
          options: ['Yes, and I use it', 'Yes, but I don\'t use it', 'No', 'Not sure'] },
        { id: 'coordinator_helps_with_meds', label: 'Does your medication coordinator help resolve medication access issues?', type: 'select',
          options: ['Yes, very involved', 'Sometimes', 'Rarely', 'Never', 'Don\'t have a coordinator'] },
        { id: 'center_told_about_assistance', label: 'Did your healthcare provider inform you about patient assistance programs?', type: 'yesno' },
        { id: 'center_helped_apply', label: 'Did someone at your center help you apply for assistance programs?', type: 'yesno' },
        { id: 'knows_who_to_call', label: 'Do you know who to call at your center when you have a medication problem?', type: 'select',
          options: ['Yes, specific person', 'Yes, general number', 'Not sure who to call', 'No one to call'] },
      ]
    },
    {
      id: 'pap',
      title: "Patient Assistance Programs",
      shortTitle: "Assistance Programs",
      icon: HeartHandshake,
      description: "Your experience with financial assistance",
      questions: [
        { id: 'uses_pap', label: 'Do you currently use any patient assistance programs for medications?', type: 'yesno' },
        { id: 'pap_types_used', label: 'Which types have you used? (Select all that apply)', type: 'multiselect',
          options: ['Manufacturer copay card', 'Foundation grant (NTF, AAKP, etc.)', 'State program', 'Hospital charity care', 'Pharmacy discount program', 'None'] },
        { id: 'pap_found_how', label: 'How did you first learn about assistance programs?', type: 'select',
          options: ['medication center', 'Social worker', 'Peer/support group', 'Found online myself', 'Pharmacy', 'Never learned - found out now'] },
        { id: 'pap_gap_experienced', label: 'Have you ever had a gap between assistance program renewals that affected your access?', type: 'yesno' },
        { id: 'pap_application_burden', label: 'How would you describe the burden of applying for and maintaining assistance?', type: 'select',
          options: ['Easy - minimal effort', 'Moderate - some paperwork', 'Difficult - significant time', 'Overwhelming - nearly gave up', 'Haven\'t applied'] },
      ]
    },
    {
      id: 'communication',
      title: "Communication & Coordination",
      shortTitle: "Communication",
      icon: Phone,
      description: "How well the system communicates with you",
      questions: [
        { id: 'pharmacy_center_communicate', label: 'Do your pharmacy and healthcare provider communicate well with each other?', type: 'select',
          options: ['Yes, seamlessly', 'Usually', 'Sometimes', 'Rarely', 'I\'m the middleman'] },
        { id: 'notified_of_changes', label: 'Are you notified in advance when your medication coverage or cost will change?', type: 'select',
          options: ['Always', 'Usually', 'Sometimes', 'Rarely', 'Never'] },
        { id: 'understood_all_meds', label: 'Do you feel you fully understand what each of your medications does?', type: 'select',
          options: ['Yes, completely', 'Mostly', 'Somewhat', 'Not really', 'No'] },
        { id: 'feels_like_burden', label: 'How often do you feel like managing medications is a second job?', type: 'select',
          options: ['Never', 'Occasionally', 'Often', 'Always'] },
      ]
    },
    {
      id: 'about',
      title: "About Your medication Journey",
      shortTitle: "About You",
      icon: Heart,
      description: "Optional background (helps us segment the data)",
      questions: [
        { id: 'organ_type', label: 'What type of medication did you receive?', type: 'select',
          options: ['Kidney', 'Liver', 'Heart', 'Lung', 'Pancreas', 'Multi-organ', 'Other', 'Prefer not to say'] },
        { id: 'years_post_medication', label: 'How long ago was your medication?', type: 'select',
          options: ['Less than 1 year', '1-2 years', '3-5 years', '5-10 years', '10+ years', 'Waiting for medication'] },
        { id: 'num_medications', label: 'Approximately how many medications do you take daily?', type: 'select',
          options: ['1-5', '6-10', '11-15', '16-20', 'More than 20'] },
        { id: 'insurance_type', label: 'What is your primary insurance?', type: 'select',
          options: ['Employer', 'ACA Marketplace', 'Medicare only', 'Medicaid only', 'Medicare + Medicaid', 'Medicare + Supplement', 'VA', 'Uninsured', 'Other'] },
        { id: 'region', label: 'What region are you in?', type: 'select',
          options: ['Northeast', 'Southeast', 'Midwest', 'Southwest', 'West Coast', 'Outside US'] },
      ]
    }
  ];

  const handleSubmitSection = (sectionId) => {
    setCompletedSections(prev => new Set([...prev, sectionId]));
    setActiveTab(null);
  };

  const getSectionResponseCount = (section) => {
    return section.questions.filter(q => responses[q.id] !== undefined).length;
  };

  const renderQuestion = (q) => {
    if (q.type === 'yesno') {
      return (
        <div className="flex gap-3 mt-2">
          {['Yes', 'No'].map(opt => (
            <button
              key={opt}
              onClick={() => updateResponse(q.id, opt)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                responses[q.id] === opt
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      );
    }
    if (q.type === 'yesno_na') {
      return (
        <div className="flex gap-3 mt-2 flex-wrap">
          {['Yes', 'No', 'N/A'].map(opt => (
            <button
              key={opt}
              onClick={() => updateResponse(q.id, opt)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                responses[q.id] === opt
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      );
    }
    if (q.type === 'select') {
      return (
        <div className="flex flex-wrap gap-2 mt-3">
          {q.options.map(opt => (
            <button
              key={opt}
              onClick={() => updateResponse(q.id, opt)}
              className={`px-4 py-2.5 rounded-lg text-sm transition-all ${
                responses[q.id] === opt
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      );
    }
    if (q.type === 'multiselect') {
      const selected = responses[q.id] || [];
      return (
        <div className="flex flex-wrap gap-2 mt-3">
          {q.options.map(opt => (
            <button
              key={opt}
              onClick={() => {
                const current = responses[q.id] || [];
                if (current.includes(opt)) {
                  updateResponse(q.id, current.filter(x => x !== opt));
                } else {
                  updateResponse(q.id, [...current, opt]);
                }
              }}
              className={`px-4 py-2.5 rounded-lg text-sm transition-all ${
                selected.includes(opt)
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {selected.includes(opt) && '✓ '}{opt}
            </button>
          ))}
        </div>
      );
    }
  };

  const activeSection = sections.find(s => s.id === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-emerald-100">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Medication Journey Survey
          </h1>
          <p className="text-slate-600">
            Choose the topics that matter most to you. Each section can be submitted independently.
          </p>
          {completedSections.size > 0 && (
            <div className="mt-3 flex items-center gap-2 text-sm text-emerald-600">
              <span className="font-medium">{completedSections.size} of {sections.length} sections completed</span>
              <span className="text-emerald-400">- Thank you for sharing your experience!</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Topic Selection View */}
        {!activeTab && (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              {sections.map((section) => {
                const isCompleted = completedSections.has(section.id);
                const responseCount = getSectionResponseCount(section);
                const hasResponses = responseCount > 0;

                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveTab(section.id)}
                    className={`text-left p-6 rounded-2xl border-2 transition-all hover:shadow-lg ${
                      isCompleted
                        ? 'bg-emerald-50 border-emerald-200 hover:border-emerald-300'
                        : hasResponses
                        ? 'bg-amber-50 border-amber-200 hover:border-amber-300'
                        : 'bg-white border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isCompleted ? 'bg-emerald-100' : 'bg-slate-100'
                      }`}>
                        <section.icon className={`w-6 h-6 ${isCompleted ? 'text-emerald-600' : 'text-slate-600'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-800">{section.title}</h3>
                          {isCompleted && (
                            <span className="text-emerald-600 text-sm">✓ Submitted</span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 mt-1">{section.description}</p>
                        <p className="text-xs text-slate-400 mt-2">
                          {section.questions.length} questions
                          {hasResponses && !isCompleted && (
                            <span className="text-amber-600 ml-2">({responseCount} answered)</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Privacy Notice */}
            <div className="mt-10 text-center">
              <div className="inline-block bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                <p className="text-sm text-slate-500">
                  <strong>Your privacy is protected:</strong> No names, dates, or medical record numbers are collected.<br/>
                  All responses are anonymous and help us advocate for better medication access.
                </p>
              </div>
              <p className="text-xs text-slate-400 mt-4">
                Powered by MedicationNavigator.com — By patients, for patients
              </p>
            </div>
          </>
        )}

        {/* Active Section View */}
        {activeTab && activeSection && (
          <div className="bg-white rounded-3xl shadow-lg border border-emerald-100 p-8">
            <div className="flex items-start gap-4 mb-6">
              <button
                onClick={() => setActiveTab(null)}
                className="mt-1 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <activeSection.icon className="w-7 h-7 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">{activeSection.title}</h2>
                <p className="text-sm text-slate-500">{activeSection.description}</p>
              </div>
            </div>

            <div className="space-y-7">
              {activeSection.questions.map((q) => (
                <div key={q.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                  <p className="text-slate-700 font-medium leading-relaxed">{q.label}</p>
                  {renderQuestion(q)}
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
              <button
                onClick={() => setActiveTab(null)}
                className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-all"
              >
                ← Back to Topics
              </button>
              <button
                onClick={() => handleSubmitSection(activeSection.id)}
                className={`px-8 py-3 rounded-xl font-medium transition-all shadow-md hover:shadow-lg ${
                  completedSections.has(activeSection.id)
                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700'
                }`}
              >
                {completedSections.has(activeSection.id) ? 'Update Responses ✓' : 'Submit This Section ✓'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
