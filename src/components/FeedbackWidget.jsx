import { useState } from 'react';
import { MessageSquare, CheckCircle, X } from 'lucide-react';

const SAVINGS_OPTIONS = [
  '$0–$50',
  '$50–$100',
  '$100–$250',
  '$250–$500',
  '$500+',
];

const WITHOUT_TOOL_OPTIONS = [
  'Skipped my medication',
  'Paid full price',
  'Asked my healthcare provider for samples',
  'Searched online for hours',
  'Given up looking',
];

/**
 * FeedbackWidget - Compact 3-question feedback flow
 * Collects: got medication? → savings range → what without tool
 * Stores responses in localStorage for later retrieval.
 */
const FeedbackWidget = ({ medicationName = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [responses, setResponses] = useState({
    medication_searched: medicationName,
    got_medication: null,
    savings_range: null,
    without_tool: null,
  });
  const [submitted, setSubmitted] = useState(false);

  const saveFeedback = (finalResponses) => {
    try {
      const existing = JSON.parse(localStorage.getItem('mednav_feedback') || '[]');
      existing.push({
        ...finalResponses,
        created_at: new Date().toISOString(),
      });
      localStorage.setItem('mednav_feedback', JSON.stringify(existing));
    } catch {
      // localStorage unavailable — silent fail
    }
  };

  const handleGotMedication = (answer) => {
    const updated = { ...responses, got_medication: answer };
    setResponses(updated);
    if (answer === 'yes' || answer === 'partially') {
      setStep(2);
    } else {
      setStep(3);
    }
  };

  const handleSavings = (range) => {
    const updated = { ...responses, savings_range: range };
    setResponses(updated);
    setStep(3);
  };

  const handleWithoutTool = (option) => {
    const updated = { ...responses, without_tool: option };
    setResponses(updated);
    saveFeedback(updated);
    setSubmitted(true);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-full shadow-lg transition-colors min-w-[44px] min-h-[44px]"
        aria-label="Give feedback"
      >
        <MessageSquare size={22} aria-hidden="true" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-emerald-600 text-white">
        <span className="font-semibold text-sm">Quick Feedback</span>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-emerald-700 rounded min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Close feedback"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="p-4">
        {submitted ? (
          <div className="text-center py-4">
            <CheckCircle size={40} className="text-emerald-500 mx-auto mb-3" aria-hidden="true" />
            <p className="font-semibold text-slate-900">Thank you!</p>
            <p className="text-sm text-slate-600 mt-1">Your feedback helps us improve.</p>
          </div>
        ) : step === 1 ? (
          <div>
            <p className="font-semibold text-slate-900 mb-3 text-sm">
              Did you get your medication today?
            </p>
            <div className="space-y-2">
              <button
                onClick={() => handleGotMedication('yes')}
                className="w-full px-3 py-2 text-sm rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition"
              >
                Yes, I got it!
              </button>
              <button
                onClick={() => handleGotMedication('partially')}
                className="w-full px-3 py-2 text-sm rounded-lg border border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100 transition"
              >
                Partially — still working on it
              </button>
              <button
                onClick={() => handleGotMedication('no')}
                className="w-full px-3 py-2 text-sm rounded-lg border border-red-200 bg-red-50 text-red-800 hover:bg-red-100 transition"
              >
                Not yet
              </button>
              <button
                onClick={() => handleGotMedication('just_browsing')}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition"
              >
                Just browsing
              </button>
            </div>
          </div>
        ) : step === 2 ? (
          <div>
            <p className="font-semibold text-slate-900 mb-3 text-sm">
              How much did you save?
            </p>
            <div className="space-y-2">
              {SAVINGS_OPTIONS.map((range) => (
                <button
                  key={range}
                  onClick={() => handleSavings(range)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition"
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <p className="font-semibold text-slate-900 mb-3 text-sm">
              What would you have done without this tool?
            </p>
            <div className="space-y-2">
              {WITHOUT_TOOL_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => handleWithoutTool(option)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition text-left"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackWidget;
