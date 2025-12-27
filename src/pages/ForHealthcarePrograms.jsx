import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, BarChart3, Lock, CheckCircle, ArrowRight, Users, TrendingUp, Mail } from 'lucide-react';
import { useMetaTags } from '../hooks/useMetaTags.js';
import { seoMetadata } from '../data/seo-metadata.js';

const ForHealthcarePrograms = () => {
    useMetaTags(seoMetadata.forHealthcarePrograms);

    const valueProps = [
        {
            icon: TrendingUp,
            title: 'Reduce Financial Barriers to Adherence',
            description: 'Help patients find manufacturer assistance, copay cards, and foundation support before cost becomes a reason for non-adherence.'
        },
        {
            icon: ShieldCheck,
            title: 'Verified Assistance Programs, Not Scams',
            description: 'Every program listed is vetted. We link directly to official manufacturer and foundation sites—no third-party schemes.'
        },
        {
            icon: BarChart3,
            title: 'Privacy-Safe Engagement Analytics',
            description: 'Track how patients engage with resources without collecting PHI. See which programs are most accessed and measure pilot impact.'
        },
        {
            icon: Lock,
            title: 'No PHI Collected',
            description: 'Patients use the tool without creating accounts or entering protected health information. Zero compliance burden for your program.'
        }
    ];

    const trackingCapabilities = [
        'Page views by pilot partner tag',
        'Clicks to medication search',
        'Clicks to assistance program links',
        'Applications initiated (outbound clicks)',
        'Program types most accessed',
        'Engagement over 90-day pilot period'
    ];

    return (
        <article className="max-w-5xl mx-auto space-y-12 pb-12">
            {/* Hero Section */}
            <header className="text-center py-8 md:py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-6">
                    <Building2 size={32} className="text-emerald-700" aria-hidden="true" />
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                    Help Your Patients Navigate Medication Costs
                </h1>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
                    Give patients a trusted resource with free educational content to find assistance programs and reduce financial barriers to medication adherence.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                        href="mailto:info@medicationnavigator.com?subject=Pilot%20Program%20Request"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition"
                    >
                        <Mail size={20} aria-hidden="true" />
                        Request a Pilot
                    </a>
                </div>
            </header>

            {/* Value Props */}
            <section className="grid md:grid-cols-2 gap-6">
                {valueProps.map((prop, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-emerald-100 transition">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4" aria-hidden="true">
                            <prop.icon size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">{prop.title}</h2>
                        <p className="text-slate-600">{prop.description}</p>
                    </div>
                ))}
            </section>

            {/* What You Can Track */}
            <section className="bg-slate-50 rounded-2xl p-8 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-emerald-100 p-2 rounded-lg" aria-hidden="true">
                        <BarChart3 size={24} className="text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">What You Can Report</h2>
                </div>
                <p className="text-slate-600 mb-6">
                    With a pilot partnership, you receive a 90-day engagement report showing:
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                    {trackingCapabilities.map((capability, index) => (
                        <div key={index} className="flex items-center gap-3 bg-white p-3 rounded-lg">
                            <CheckCircle size={20} className="text-emerald-600 flex-shrink-0" aria-hidden="true" />
                            <span className="text-slate-700">{capability}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* How It Works */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">How the Pilot Works</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-emerald-700 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">1</div>
                        <h3 className="font-bold text-slate-900 mb-2">Get Your Pilot URL</h3>
                        <p className="text-slate-600 text-sm">We create a branded landing page for your program (e.g., /pilot/your-program)</p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-emerald-700 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">2</div>
                        <h3 className="font-bold text-slate-900 mb-2">Share With Patients</h3>
                        <p className="text-slate-600 text-sm">Give patients the link via discharge materials, patient portals, or social workers</p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-emerald-700 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">3</div>
                        <h3 className="font-bold text-slate-900 mb-2">Review Engagement</h3>
                        <p className="text-slate-600 text-sm">After 90 days, receive a detailed report on patient engagement with resources</p>
                    </div>
                </div>
            </section>

            {/* For Patients Callout */}
            <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Users size={24} className="text-emerald-700" aria-hidden="true" />
                    <h2 className="text-xl font-bold text-emerald-900">What Patients See</h2>
                </div>
                <p className="text-emerald-800 mb-6 max-w-2xl mx-auto">
                    Patients get access to medication search, assistance programs, and free educational resources—no login required for education.
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-emerald-700 font-medium hover:underline"
                >
                    Preview the patient experience
                    <ArrowRight size={16} aria-hidden="true" />
                </Link>
            </section>

            {/* CTA */}
            <section className="text-center py-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Ready to Help Your Patients?</h2>
                <p className="text-slate-600 mb-6 max-w-xl mx-auto">
                    Contact us to discuss a pilot partnership and see how we can support your healthcare program.
                </p>
                <a
                    href="mailto:info@medicationnavigator.com?subject=Pilot%20Program%20Inquiry"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition"
                >
                    <Mail size={20} aria-hidden="true" />
                    Contact Us
                </a>
            </section>
        </article>
    );
};

export default ForHealthcarePrograms;
