import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Monitor, TrendingDown, DollarSign, Pill, Sparkles, Calculator, Search, Bell, ClipboardList, Bot, ArrowRight } from 'lucide-react';
import { useDemoMode } from '../context/DemoModeContext';
import { useMetaTags } from '../hooks/useMetaTags.js';
import { seoMetadata } from '../data/seo-metadata.js';

const Demo = () => {
  useMetaTags(seoMetadata.demo || seoMetadata.home);

  const { startDemoMode } = useDemoMode();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleStartDemo = () => {
    setLoading(true);
    startDemoMode('enterprise');
    navigate('/wizard');
  };

  const stats = [
    { value: '30%+', label: 'of patients experience medication non-adherence due to cost barriers' },
    { value: '$500K+', label: 'average treatment cost at risk from medication non-adherence' },
    { value: '100+', label: 'medications with mapped assistance pathways' },
  ];

  const features = [
    { icon: ClipboardList, title: 'My Path Quiz', desc: 'Guided assessment to find the right assistance programs', highlight: true },
    { icon: Calculator, title: 'Savings Calculator', desc: 'Estimate potential savings across programs' },
    { icon: Search, title: 'Medication Search', desc: 'Search our database of assistance programs' },
    { icon: Bell, title: 'Copay Reminders', desc: 'Track card expirations and renewal dates' },
    { icon: Pill, title: 'My Medications', desc: 'Save and manage your medication list' },
    { icon: Bot, title: 'AI Assistant', desc: 'Get answers about medication assistance' },
  ];

  return (
    <article className="max-w-5xl mx-auto space-y-12 pb-12">
      {/* Hero */}
      <header className="text-center py-12 bg-gradient-to-br from-purple-600 to-blue-700 rounded-2xl text-white px-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
          <Monitor size={32} aria-hidden="true" />
        </div>
        <p className="text-purple-200 font-semibold text-lg mb-2">Interactive Product Demo</p>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
          Medication Navigator&trade;
        </h1>
        <p className="text-xl text-purple-100 max-w-2xl mx-auto mb-8">
          See how patients find copay cards, patient assistance programs, and foundation grants — all in one place.
        </p>
        <button
          onClick={handleStartDemo}
          disabled={loading}
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-700 font-bold rounded-xl shadow-lg hover:shadow-xl transition text-lg disabled:opacity-70"
        >
          {loading ? (
            <Sparkles size={22} className="animate-pulse" aria-hidden="true" />
          ) : (
            <Sparkles size={22} aria-hidden="true" />
          )}
          Start Interactive Demo
        </button>
        <p className="text-purple-200 text-sm mt-4">4-hour demo with all Pro features unlocked</p>
      </header>

      {/* Stats */}
      <section className="grid md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center">
            <div className="text-3xl font-extrabold text-emerald-600 mb-2">{stat.value}</div>
            <p className="text-slate-600 text-sm">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Features */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Explore the Platform</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, desc, highlight }, i) => (
            <div
              key={i}
              className={`p-5 rounded-xl border transition ${
                highlight
                  ? 'bg-purple-50 border-purple-200 hover:border-purple-300'
                  : 'bg-white border-slate-200 hover:border-emerald-200'
              }`}
            >
              <Icon size={24} className={highlight ? 'text-purple-600 mb-3' : 'text-emerald-600 mb-3'} aria-hidden="true" />
              <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
              <p className="text-sm text-slate-600">{desc}</p>
              {highlight && (
                <span className="inline-block mt-2 text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                  Start here
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center bg-slate-50 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-3">Ready for Your Organization?</h2>
        <p className="text-slate-600 mb-6 max-w-xl mx-auto">
          See how Medication Navigator can support your patients and improve medication adherence across your organization.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/pricing" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition">
            View Pricing <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <a
            href="mailto:info@medicationnavigator.com?subject=Enterprise%20Demo%20Follow-up"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl border-2 border-slate-200 transition"
          >
            Contact Sales
          </a>
        </div>
      </section>
    </article>
  );
};

export default Demo;
