import { useState } from 'react';
import {
  DollarSign,
  Building2,
  Pill,
  ClipboardList,
  HeartHandshake,
  ChevronLeft
} from 'lucide-react';

// General Medication Survey
// For anyone managing chronic conditions
// HIPAA-free: All user self-reported, no PHI collected

export default function GeneralMedicationSurvey() {
  const [activeTab, setActiveTab] = useState(null);
  const [responses, setResponses] = useState({});
  const [completedSections, setCompletedSections] = useState(new Set());

  const updateResponse = (field, value) => {
    setResponses(prev => ({ ...prev, [field]: value }));
  };

  const sections = [
    {
      id: 'affordability',
      title: "Medication Affordability",
      shortTitle: "Affordability",
      icon: DollarSign,
      description: "How cost affects your medication access",
      questions: [
        { id: 'cost_barrier', label: 'Have you ever not filled a prescription because of cost?', type: 'yesno' },
        { id: 'cost_frequency', label: 'How often does cost affect your medication decisions?', type: 'select',
          options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'] },
        { id: 'rationing', label: 'Have you ever rationed medication (skipped doses, split pills) to make it last longer?', type: 'yesno' },
        { id: 'monthly_spend', label: 'What is your approximate monthly out-of-pocket cost for medications?', type: 'select',
          options: ['Under $50', '$50-$100', '$100-$250', '$250-$500', '$500-$1,000', 'Over $1,000'] },
        { id: 'financial_stress', label: 'How much financial stress do your medication costs cause?', type: 'select',
          options: ['None', 'Mild', 'Moderate', 'Significant', 'Severe'] },
      ]
    },
    {
      id: 'pharmacy',
      title: "Pharmacy Experience",
      shortTitle: "Pharmacy",
      icon: Building2,
      description: "Your experience getting medications filled",
      questions: [
        { id: 'pharmacy_type', label: 'Where do you primarily fill your prescriptions?', type: 'select',
          options: ['Local retail pharmacy', 'Chain pharmacy', 'Mail order', 'Specialty pharmacy', 'Hospital pharmacy', 'Multiple locations'] },
        { id: 'stockout_frequency', label: 'How often is your medication out of stock when you need it?', type: 'select',
          options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very often'] },
        { id: 'refill_difficulty', label: 'How difficult is the refill process for you?', type: 'select',
          options: ['Very easy', 'Easy', 'Neutral', 'Difficult', 'Very difficult'] },
        { id: 'pharmacist_helpful', label: 'Is your pharmacist helpful when you have questions or problems?', type: 'select',
          options: ['Very helpful', 'Somewhat helpful', 'Neutral', 'Not helpful', 'Never interacted'] },
        { id: 'auto_refill', label: 'Do you use automatic refills?', type: 'yesno' },
      ]
    },
    {
      id: 'insurance',
      title: "Insurance & Coverage",
      shortTitle: "Insurance",
      icon: ClipboardList,
      description: "How insurance affects your medication access",
      questions: [
        { id: 'has_insurance', label: 'Do you have prescription drug coverage?', type: 'yesno' },
        { id: 'insurance_type', label: 'What type of coverage do you have?', type: 'select',
          options: ['Employer', 'ACA Marketplace', 'Medicare Part D', 'Medicaid', 'VA', 'No coverage', 'Other'] },
        { id: 'prior_auth_experienced', label: 'Have you ever needed prior authorization for a medication?', type: 'yesno' },
        { id: 'prior_auth_delayed', label: 'If yes, did it delay getting your medication?', type: 'yesno_na' },
        { id: 'formulary_switch', label: 'Has your insurance ever required you to switch to a different medication than prescribed?', type: 'yesno' },
        { id: 'coverage_denial', label: 'Have you ever had a medication denied by insurance?', type: 'yesno' },
      ]
    },
    {
      id: 'assistance',
      title: "Assistance Programs",
      shortTitle: "Assistance",
      icon: HeartHandshake,
      description: "Your experience with help programs",
      questions: [
        { id: 'knows_about_pap', label: 'Are you aware that patient assistance programs exist?', type: 'yesno' },
        { id: 'uses_assistance', label: 'Do you currently use any assistance programs?', type: 'yesno' },
        { id: 'assistance_types', label: 'Which types have you used? (Select all that apply)', type: 'multiselect',
          options: ['Manufacturer copay card', 'Patient assistance program (free meds)', 'GoodRx or similar discount', 'State program', 'Charity/foundation', 'None'] },
        { id: 'assistance_found_how', label: 'How did you first learn about assistance options?', type: 'select',
          options: ['Doctor/provider', 'Pharmacist', 'Online search', 'Friend/family', 'Social worker', 'Never heard of them until now'] },
        { id: 'assistance_difficulty', label: 'How difficult was it to apply for assistance?', type: 'select',
          options: ['Very easy', 'Easy', 'Moderate', 'Difficult', 'Very difficult', 'Haven\'t applied'] },
      ]
    },
    {
      id: 'management',
      title: "Medication Management",
      shortTitle: "Management",
      icon: Pill,
      description: "Managing your daily medications",
      questions: [
        { id: 'num_medications', label: 'How many prescription medications do you take regularly?', type: 'select',
          options: ['1-2', '3-5', '6-10', '11-15', 'More than 15'] },
        { id: 'adherence_difficulty', label: 'How difficult is it to take your medications as prescribed?', type: 'select',
          options: ['Very easy', 'Easy', 'Moderate', 'Difficult', 'Very difficult'] },
        { id: 'missed_doses', label: 'How often do you miss doses?', type: 'select',
          options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very often'] },
        { id: 'understands_meds', label: 'Do you fully understand what each of your medications does?', type: 'select',
          options: ['Yes, completely', 'Mostly', 'Somewhat', 'Not really', 'No'] },
        { id: 'condition_type', label: 'What type of condition(s) do you manage? (Select all that apply)', type: 'multiselect',
          options: ['Diabetes', 'Heart disease', 'High blood pressure', 'Autoimmune condition', 'Mental health', 'Chronic pain', 'Cancer', 'Other chronic condition', 'Prefer not to say'] },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            General Medication Survey
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
          <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8">
            <div className="flex items-start gap-4 mb-6">
              <button
                onClick={() => setActiveTab(null)}
                className="mt-1 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <activeSection.icon className="w-7 h-7 text-slate-600" />
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
                    : 'bg-slate-700 text-white hover:bg-slate-800'
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
