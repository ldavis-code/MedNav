import { Link } from 'react-router-dom';
import { Heart, Pill, Shield, Quote } from 'lucide-react';

// Survey Landing Page
// Offers medication-specific and general medication surveys

export default function SurveyLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-emerald-100">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Share Your Journey
          </h1>
          <p className="text-lg text-slate-600">
            Your experience can change the system
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Survey Cards */}
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          {/* medication Survey Card */}
          <div className="bg-white rounded-2xl border-2 border-emerald-200 p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                medication Journey Survey
              </h2>
            </div>
            <p className="text-slate-600 mb-4">
              For patients navigating immunosuppressants, specialty pharmacies, and insurance challenges.
            </p>
            <p className="text-sm text-slate-500 mb-6">
              8 topic areas - complete only the ones relevant to you
            </p>
            <Link
              to="/survey/medication"
              className="block w-full py-3 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-center rounded-xl font-medium hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg"
            >
              Start medication Survey
            </Link>
          </div>

          {/* General Medication Survey Card */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                <Pill className="w-6 h-6 text-slate-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                General Medication Survey
              </h2>
            </div>
            <p className="text-slate-600 mb-4">
              For anyone managing chronic conditions and facing medication access or affordability challenges.
            </p>
            <p className="text-sm text-slate-500 mb-6">
              5 topic areas - takes about 5 minutes
            </p>
            <Link
              to="/survey/general"
              className="block w-full py-3 px-6 bg-slate-700 text-white text-center rounded-xl font-medium hover:bg-slate-800 transition-all shadow-md hover:shadow-lg"
            >
              Start General Survey
            </Link>
          </div>
        </div>

        {/* Why We're Asking Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-8">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Quote className="w-5 h-5 text-emerald-600" />
            Why We're Asking
          </h3>
          <blockquote className="text-slate-600 italic mb-4 border-l-4 border-emerald-200 pl-4">
            "Every experience you share helps another patient navigate their journey. Together, we're building
            something that didn't exist for us — a roadmap through the medication maze, and the evidence we need
            to fix a broken system."
          </blockquote>
          <p className="text-sm text-slate-500">
            — Lorrinda, TRIO President & Liver patient
          </p>
        </div>

        {/* Privacy Notice */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm">
            <Shield className="w-4 h-4" />
            <span><strong>Privacy:</strong> No names, dates, or medical records collected</span>
          </div>
          <p className="text-xs text-slate-400 mt-4">
            Powered by MedicationNavigator.com — By patients, for patients
          </p>
        </div>
      </div>
    </div>
  );
}
