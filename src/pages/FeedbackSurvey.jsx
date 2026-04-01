import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Heart } from 'lucide-react';
import { useMetaTags } from '../hooks/useMetaTags.js';
import { seoMetadata } from '../data/seo-metadata.js';

const PROGRAM_OPTIONS = [
  { label: 'Yes — a copay card or savings program', value: 'copay_card', color: 'emerald' },
  { label: 'Yes — a Patient Assistance Program (PAP)', value: 'pap', color: 'emerald' },
  { label: 'Yes — a foundation grant', value: 'foundation', color: 'emerald' },
  { label: 'Not yet, but I have leads', value: 'leads', color: 'blue' },
  { label: 'No, I didn\'t find anything helpful', value: 'none', color: 'rose' },
];

const SAVINGS_OPTIONS = [
  '$0–$50 per month',
  '$50–$100 per month',
  '$100–$250 per month',
  '$250–$500 per month',
  '$500+ per month',
  'Not sure yet',
];

const WITHOUT_TOOL_OPTIONS = [
  'Skipped doses or rationed my medication',
  'Paid full price out of pocket',
  'Asked my healthcare provider for help',
  'Spent hours searching online',
  'Called the manufacturer directly',
  'Gone without my medication entirely',
];

const FeedbackSurvey = () => {
  useMetaTags(seoMetadata.feedbackSurvey || seoMetadata.home);

  const [step, setStep] = useState(1);
  const [responses, setResponses] = useState({
    program_found: null,
    savings_range: null,
    without_tool: null,
    comment: '',
    email: '',
    source: 'feedback_survey',
  });
  const [submitted, setSubmitted] = useState(false);

  const totalSteps = 4;
  const showSavingsStep = responses.program_found && !['none', 'leads'].includes(responses.program_found);

  const saveFeedback = (finalResponses) => {
    try {
      const existing = JSON.parse(localStorage.getItem('mednav_survey_feedback') || '[]');
      existing.push({
        ...finalResponses,
        created_at: new Date().toISOString(),
      });
      localStorage.setItem('mednav_survey_feedback', JSON.stringify(existing));
    } catch {
      // localStorage unavailable
    }
  };

  const handleProgramFound = (value) => {
    const updated = { ...responses, program_found: value };
    setResponses(updated);
    if (['none', 'leads'].includes(value)) {
      setStep(3); // Skip savings step
    } else {
      setStep(2);
    }
  };

  const handleSavings = (range) => {
    setResponses({ ...responses, savings_range: range });
    setStep(3);
  };

  const handleWithoutTool = (option) => {
    setResponses({ ...responses, without_tool: option });
    setStep(4);
  };

  const handleSubmit = () => {
    saveFeedback(responses);
    setSubmitted(true);
  };

  // Progress dots
  const ProgressDots = () => (
    <div className="flex justify-center gap-2 mb-6">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={`w-3 h-3 rounded-full transition-colors ${
            i + 1 === step
              ? 'bg-emerald-500'
              : i + 1 < step
              ? 'bg-emerald-300'
              : 'bg-slate-200'
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  );

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 md:p-12 text-center border border-emerald-200">
          <CheckCircle size={56} className="text-emerald-500 mx-auto mb-4" aria-hidden="true" />
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3">
            Thank You!
          </h1>
          <p className="text-slate-700 mb-6 leading-relaxed">
            Your feedback helps us improve this tool for patients and healthcare providers everywhere.
            Every response helps us build better resources.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-md transition"
            >
              Back to Home
            </Link>
            <Link
              to="/medications"
              className="px-6 py-3 bg-white hover:bg-slate-50 text-emerald-700 font-bold rounded-lg shadow-md border border-emerald-200 transition"
            >
              Search Medications
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 md:p-12 border border-emerald-200">
        <div className="text-center mb-8">
          <Heart size={32} className="text-emerald-500 mx-auto mb-3" aria-hidden="true" />
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">
            Share Your Experience
          </h1>
          <p className="text-slate-600">Help us help more patients find medication assistance.</p>
        </div>

        <ProgressDots />

        {/* Step 1: Program Found */}
        {step === 1 && (
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4 text-center">
              Did you find a helpful program?
            </h2>
            <div className="space-y-3">
              {PROGRAM_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleProgramFound(opt.value)}
                  className={`w-full px-4 py-3 text-left rounded-lg border transition font-medium ${
                    opt.color === 'emerald'
                      ? 'border-emerald-200 bg-white hover:bg-emerald-50 text-emerald-800'
                      : opt.color === 'blue'
                      ? 'border-blue-200 bg-white hover:bg-blue-50 text-blue-800'
                      : 'border-rose-200 bg-white hover:bg-rose-50 text-rose-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Savings (conditional) */}
        {step === 2 && showSavingsStep && (
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4 text-center">
              How much are you saving?
            </h2>
            <div className="space-y-3">
              {SAVINGS_OPTIONS.map((range) => (
                <button
                  key={range}
                  onClick={() => handleSavings(range)}
                  className="w-full px-4 py-3 text-left rounded-lg border border-emerald-200 bg-white hover:bg-emerald-50 text-emerald-800 transition font-medium"
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Without Tool */}
        {step === 3 && (
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4 text-center">
              What would you have done without this tool?
            </h2>
            <div className="space-y-3">
              {WITHOUT_TOOL_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => handleWithoutTool(option)}
                  className="w-full px-4 py-3 text-left rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition font-medium"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Optional Comment & Submit */}
        {step === 4 && (
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4 text-center">
              Anything else you'd like to share?
            </h2>
            <textarea
              value={responses.comment}
              onChange={(e) => setResponses({ ...responses, comment: e.target.value })}
              placeholder="Share your experience, suggestions, or a testimonial (optional)"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none h-28 mb-4"
              maxLength={1000}
            />
            <input
              type="email"
              value={responses.email}
              onChange={(e) => setResponses({ ...responses, email: e.target.value })}
              placeholder="Your email (optional, for follow-up)"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 mb-2"
            />
            <p className="text-xs text-slate-500 mb-6">
              Submission is anonymous unless you provide your email. We never share your information.
            </p>
            <button
              onClick={handleSubmit}
              className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-md transition disabled:opacity-50"
            >
              Submit Feedback
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackSurvey;
