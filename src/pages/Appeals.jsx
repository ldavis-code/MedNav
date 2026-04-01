import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle, ChevronDown, ChevronUp, CheckCircle, Copy, Check,
  FileText, Phone, Clock, Shield, Scale, AlertCircle, Lightbulb,
  ArrowRight, ClipboardList
} from 'lucide-react';
import { useMetaTags } from '../hooks/useMetaTags';
import { seoMetadata } from '../data/seo-metadata';

const APPEAL_STEPS = [
  { id: 1, title: 'Get the denial in writing', description: 'Request a written explanation from your insurance company. This document should include the specific reason for denial and the policy or guideline they cited.' },
  { id: 2, title: 'Know your deadline', description: 'Most plans allow 30-60 days for internal appeals. Check your denial letter for exact deadlines. Request an expedited review if medically urgent.' },
  { id: 3, title: 'Gather documentation', description: 'Collect medical records, lab results, prescription history, and letters from your healthcare providers supporting medical necessity.' },
  { id: 4, title: 'Contact your doctor', description: 'Ask your prescribing physician to write a letter of medical necessity explaining why this specific medication is required for your condition.' },
  { id: 5, title: 'File your internal appeal', description: 'Submit your appeal with all supporting documentation. Keep copies of everything. Send via certified mail or fax with confirmation.' },
  { id: 6, title: 'Request external review if denied', description: 'If your internal appeal is denied, you have the right to an independent external review. This is conducted by a third party not connected to your insurance company.' },
];

const DENIAL_REASONS = [
  {
    reason: 'Not on formulary',
    explanation: 'Your insurance doesn\'t include this medication on their approved list.',
    action: 'Request a formulary exception or tier exception from your doctor. Provide evidence that formulary alternatives have failed or are inappropriate.'
  },
  {
    reason: 'Prior authorization required',
    explanation: 'Your insurance needs additional approval before covering this medication.',
    action: 'Work with your doctor\'s office to submit the prior authorization. Include clinical notes showing medical necessity.'
  },
  {
    reason: 'Step therapy required',
    explanation: 'Your insurance requires you to try cheaper medications first before covering the requested one.',
    action: 'If you\'ve already tried alternatives, document the results. If switching would be harmful, request a step therapy exception.'
  },
  {
    reason: 'Not medically necessary',
    explanation: 'Your insurance doesn\'t believe the medication is needed for your condition.',
    action: 'Have your doctor provide detailed clinical documentation explaining why this medication is essential for your treatment plan.'
  },
  {
    reason: 'Quantity limits exceeded',
    explanation: 'Your insurance limits how much of this medication you can get.',
    action: 'Ask your doctor to request a quantity limit exception with documentation of your required dosage.'
  },
];

export default function Appeals() {
  useMetaTags(seoMetadata.appeals || seoMetadata.applicationHelp);

  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [expandedSection, setExpandedSection] = useState(null);
  const [copiedLetter, setCopiedLetter] = useState(null);
  const [letterInputs, setLetterInputs] = useState({
    patientName: '',
    doctorName: '',
    medicationName: '',
    conditionName: '',
    insuranceName: '',
  });

  const toggleStep = (stepId) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(stepId)) {
        next.delete(stepId);
      } else {
        next.add(stepId);
      }
      return next;
    });
  };

  const toggleSection = (section) => {
    setExpandedSection(prev => prev === section ? null : section);
  };

  const progress = Math.round((completedSteps.size / APPEAL_STEPS.length) * 100);

  const generateDoctorLetter = () => {
    const { patientName, doctorName, medicationName, conditionName, insuranceName } = letterInputs;
    return `Dear Dr. ${doctorName || '[Doctor Name]'},

I am writing to request your support in appealing an insurance denial for my medication.

Patient: ${patientName || '[Your Name]'}
Medication: ${medicationName || '[Medication Name]'}
Condition: ${conditionName || '[Your Condition]'}
Insurance: ${insuranceName || '[Insurance Company]'}

My insurance company has denied coverage for ${medicationName || '[Medication Name]'}, which has been prescribed for my ${conditionName || '[condition]'}. I am requesting that you provide a letter of medical necessity to support my appeal.

Specifically, it would be helpful if your letter could address:

1. My diagnosis and treatment history
2. Why this specific medication is medically necessary
3. Any alternative medications that have been tried and why they were insufficient
4. The potential health consequences of not having access to this medication
5. Any relevant clinical guidelines supporting the use of this medication

I understand you are busy, and I greatly appreciate your support in helping me maintain access to the medication I need.

Thank you for your time and advocacy.

Sincerely,
${patientName || '[Your Name]'}`;
  };

  const handleCopyLetter = (type) => {
    const text = type === 'doctor' ? generateDoctorLetter() : '';
    navigator.clipboard.writeText(text).then(() => {
      setCopiedLetter(type);
      setTimeout(() => setCopiedLetter(null), 2000);
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <header className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <Scale size={32} className="text-red-700" aria-hidden="true" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
          Insurance Appeals Guide
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          If your insurance denied coverage for a medication, you have the right to appeal.
          Over 50% of appeals are successful. This guide walks you through the process step by step.
        </p>
      </header>

      {/* Key Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-emerald-700">50%+</p>
          <p className="text-sm text-emerald-600">Appeals succeed</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-700">30-60 days</p>
          <p className="text-sm text-blue-600">Typical deadline</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-purple-700">Free</p>
          <p className="text-sm text-purple-600">No cost to appeal</p>
        </div>
      </div>

      {/* Common Denial Reasons */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <button
          onClick={() => toggleSection('denials')}
          className="w-full flex items-center justify-between text-left"
          aria-expanded={expandedSection === 'denials'}
        >
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-red-600" aria-hidden="true" />
            </div>
            Common Denial Reasons & What To Do
          </h2>
          {expandedSection === 'denials' ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {expandedSection === 'denials' && (
          <div className="mt-6 space-y-4">
            {DENIAL_REASONS.map((item, index) => (
              <div key={index} className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-semibold text-red-700 mb-1">{item.reason}</h3>
                <p className="text-slate-600 text-sm mb-2">{item.explanation}</p>
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-sm text-slate-700 font-medium">{item.action}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Step-by-Step Appeal Process */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
            <ClipboardList className="w-5 h-5 text-emerald-600" aria-hidden="true" />
          </div>
          Your Appeal Checklist
        </h2>
        <p className="text-slate-600 text-sm mb-4">Track your progress through the appeals process</p>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-600">Progress</span>
            <span className="font-medium text-emerald-600">{progress}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
            <div
              className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="space-y-3">
          {APPEAL_STEPS.map((step) => (
            <div
              key={step.id}
              className={`flex items-start gap-3 p-4 rounded-lg border transition-colors ${
                completedSteps.has(step.id)
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <button
                onClick={() => toggleStep(step.id)}
                className="flex-shrink-0 mt-0.5 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label={`Mark step ${step.id} as ${completedSteps.has(step.id) ? 'incomplete' : 'complete'}`}
              >
                {completedSteps.has(step.id) ? (
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                ) : (
                  <div className="w-6 h-6 border-2 border-slate-300 rounded-full flex items-center justify-center text-xs font-bold text-slate-400">
                    {step.id}
                  </div>
                )}
              </button>
              <div>
                <h3 className={`font-semibold ${completedSteps.has(step.id) ? 'text-emerald-800 line-through' : 'text-slate-900'}`}>
                  {step.title}
                </h3>
                <p className="text-slate-600 text-sm mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Letter Builder */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <button
          onClick={() => toggleSection('letter')}
          className="w-full flex items-center justify-between text-left"
          aria-expanded={expandedSection === 'letter'}
        >
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-purple-600" aria-hidden="true" />
            </div>
            Letter to Your Doctor (Template)
          </h2>
          {expandedSection === 'letter' ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {expandedSection === 'letter' && (
          <div className="mt-6 space-y-4">
            <p className="text-slate-600 text-sm">
              Fill in your details below to generate a customizable letter requesting a medical necessity letter from your doctor.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="patient-name" className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
                <input
                  id="patient-name"
                  type="text"
                  value={letterInputs.patientName}
                  onChange={(e) => setLetterInputs(prev => ({ ...prev, patientName: e.target.value }))}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label htmlFor="doctor-name" className="block text-sm font-medium text-slate-700 mb-1">Doctor's Name</label>
                <input
                  id="doctor-name"
                  type="text"
                  value={letterInputs.doctorName}
                  onChange={(e) => setLetterInputs(prev => ({ ...prev, doctorName: e.target.value }))}
                  placeholder="Dr. Smith"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label htmlFor="medication-name" className="block text-sm font-medium text-slate-700 mb-1">Medication Name</label>
                <input
                  id="medication-name"
                  type="text"
                  value={letterInputs.medicationName}
                  onChange={(e) => setLetterInputs(prev => ({ ...prev, medicationName: e.target.value }))}
                  placeholder="e.g., Jardiance"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label htmlFor="condition-name" className="block text-sm font-medium text-slate-700 mb-1">Your Condition</label>
                <input
                  id="condition-name"
                  type="text"
                  value={letterInputs.conditionName}
                  onChange={(e) => setLetterInputs(prev => ({ ...prev, conditionName: e.target.value }))}
                  placeholder="e.g., Type 2 Diabetes"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="insurance-name" className="block text-sm font-medium text-slate-700 mb-1">Insurance Company</label>
                <input
                  id="insurance-name"
                  type="text"
                  value={letterInputs.insuranceName}
                  onChange={(e) => setLetterInputs(prev => ({ ...prev, insuranceName: e.target.value }))}
                  placeholder="e.g., Blue Cross Blue Shield"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 mt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-slate-900">Generated Letter</h3>
                <button
                  onClick={() => handleCopyLetter('doctor')}
                  className="flex items-center gap-1 px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition min-h-[44px]"
                >
                  {copiedLetter === 'doctor' ? (
                    <><Check className="w-4 h-4 text-emerald-500" /> Copied!</>
                  ) : (
                    <><Copy className="w-4 h-4" /> Copy Letter</>
                  )}
                </button>
              </div>
              <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
                {generateDoctorLetter()}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Important Tips */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <h2 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" aria-hidden="true" />
          Important Tips
        </h2>
        <ul className="space-y-3 text-amber-800">
          <li className="flex items-start gap-2">
            <Clock className="w-4 h-4 flex-shrink-0 mt-1 text-amber-600" aria-hidden="true" />
            <span><strong>Act quickly.</strong> Most internal appeals must be filed within 30-60 days of the denial.</span>
          </li>
          <li className="flex items-start gap-2">
            <FileText className="w-4 h-4 flex-shrink-0 mt-1 text-amber-600" aria-hidden="true" />
            <span><strong>Keep copies of everything.</strong> Document all communications, letters, and phone calls with dates and names.</span>
          </li>
          <li className="flex items-start gap-2">
            <Phone className="w-4 h-4 flex-shrink-0 mt-1 text-amber-600" aria-hidden="true" />
            <span><strong>Call your state insurance department.</strong> They can help you understand your rights and may assist with the appeal process.</span>
          </li>
          <li className="flex items-start gap-2">
            <Shield className="w-4 h-4 flex-shrink-0 mt-1 text-amber-600" aria-hidden="true" />
            <span><strong>Request expedited review</strong> if stopping medication would cause serious harm to your health.</span>
          </li>
        </ul>
      </div>

      {/* CTA */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
        <h2 className="text-xl font-bold text-emerald-900 mb-3">Need More Help?</h2>
        <p className="text-emerald-800 mb-6">
          While your appeal is in process, explore alternative ways to access your medication at a lower cost.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/medications"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-md transition min-h-[44px]"
          >
            Search Assistance Programs
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link
            to="/wizard"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-emerald-700 font-bold rounded-lg shadow-md border border-emerald-200 transition min-h-[44px]"
          >
            Take My Path Quiz
          </Link>
        </div>
      </div>
    </div>
  );
}
