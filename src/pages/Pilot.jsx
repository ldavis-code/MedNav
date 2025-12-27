import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { HeartHandshake, Search, Map, Building2, ShieldCheck } from 'lucide-react';
import { useMetaTags } from '../hooks/useMetaTags.js';
import { seoMetadata } from '../data/seo-metadata.js';

// Partner configuration - add new partners here
const PARTNER_CONFIG = {
    methodist: {
        name: 'Methodist Health System',
        displayName: 'Methodist',
        welcome: 'Welcome, Methodist Patients'
    },
    duke: {
        name: 'Duke medication Center',
        displayName: 'Duke',
        welcome: 'Welcome, Duke Patients'
    },
    mayo: {
        name: 'Mayo Clinic',
        displayName: 'Mayo Clinic',
        welcome: 'Welcome, Mayo Clinic Patients'
    },
    // Default fallback for unknown partners
    default: {
        name: 'Partner',
        displayName: 'Partner',
        welcome: 'Welcome, Partner Patients'
    }
};

const Pilot = () => {
    const { partner } = useParams();

    // Get partner config or use default
    const partnerConfig = PARTNER_CONFIG[partner?.toLowerCase()] || PARTNER_CONFIG.default;
    const isGenericPilot = !partner;

    useMetaTags(seoMetadata.pilot);

    // Track page view with partner tag
    useEffect(() => {
        // Send page_view event with partner tag for analytics
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'page_view', {
                page_title: isGenericPilot ? 'Pilot Landing' : `Pilot - ${partnerConfig.name}`,
                page_location: window.location.href,
                partner_tag: partner || 'generic',
                pilot_partner: partnerConfig.name
            });
        }
    }, [partner, partnerConfig.name, isGenericPilot]);

    return (
        <article className="max-w-4xl mx-auto space-y-10 pb-12">
            {/* Hero Section */}
            <header className="text-center py-8 md:py-12">
                {!isGenericPilot && (
                    <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <Building2 size={16} aria-hidden="true" />
                        {partnerConfig.name} Partner Program
                    </div>
                )}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-6">
                    <HeartHandshake size={32} className="text-emerald-700" aria-hidden="true" />
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                    {isGenericPilot ? 'Welcome, Partner Patients' : partnerConfig.welcome}
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                    {isGenericPilot
                        ? 'Your healthcare provider has partnered with us to help you find medication assistance programs.'
                        : `${partnerConfig.displayName} has partnered with Medication Navigator to help you find medication assistance programs.`
                    }
                </p>
            </header>

            {/* Main CTAs */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">Get Started</h2>
                <div className="grid md:grid-cols-3 gap-4">
                    <Link
                        to="/medications"
                        className="flex flex-col items-center text-center p-6 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition group"
                    >
                        <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center mb-4 group-hover:bg-emerald-700 transition">
                            <Search size={24} aria-hidden="true" />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2">Search Medications</h3>
                        <p className="text-slate-600 text-sm">Find your medications and compare prices</p>
                    </Link>
                    <Link
                        to="/wizard"
                        className="flex flex-col items-center text-center p-6 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition group"
                    >
                        <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-700 transition">
                            <Map size={24} aria-hidden="true" />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2">My Path Quiz</h3>
                        <p className="text-slate-600 text-sm">Get personalized assistance recommendations</p>
                    </Link>
                    <Link
                        to="/application-help"
                        className="flex flex-col items-center text-center p-6 bg-purple-50 hover:bg-purple-100 rounded-xl border border-purple-200 transition group"
                    >
                        <div className="w-14 h-14 bg-purple-600 text-white rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-700 transition">
                            <HeartHandshake size={24} aria-hidden="true" />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2">Find Grants & Foundations</h3>
                        <p className="text-slate-600 text-sm">Explore financial assistance programs</p>
                    </Link>
                </div>
            </section>

            {/* What This Site Does */}
            <section className="bg-slate-50 rounded-2xl p-6 md:p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4">What You Can Do Here</h2>
                <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                        <ShieldCheck size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <span className="text-slate-700">Search for your medications and compare prices</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <ShieldCheck size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <span className="text-slate-700">Find Patient Assistance Programs (PAPs) for free medications</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <ShieldCheck size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <span className="text-slate-700">Discover copay cards and manufacturer savings programs</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <ShieldCheck size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <span className="text-slate-700">Access foundation grants for financial assistance</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <ShieldCheck size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <span className="text-slate-700">Learn about insurance navigation and specialty pharmacies</span>
                    </li>
                </ul>
            </section>

            {/* Trust Indicators */}
            <section className="grid md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                    <p className="font-bold text-emerald-700 text-lg">Free Education</p>
                    <p className="text-slate-600 text-sm">Educational resources at no cost</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                    <p className="font-bold text-emerald-700 text-lg">No Login</p>
                    <p className="text-slate-600 text-sm">No account required</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                    <p className="font-bold text-emerald-700 text-lg">Privacy-Safe</p>
                    <p className="text-slate-600 text-sm">No personal data collected</p>
                </div>
            </section>

            {/* Safety Note */}
            <section className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
                <p className="text-amber-800 font-medium">
                    <strong>Important:</strong> Patient Assistance Programs provide FREE medication—never pay to apply.
                    If a site claims to be a PAP but charges fees, it's a scam. Report it.
                </p>
            </section>

            {/* About Section */}
            <section className="text-center py-4">
                <p className="text-slate-600 text-sm">
                    Medication Navigator™ was built by a medication recipient to help patients find medication assistance with free educational resources.
                </p>
                <Link to="/" className="text-emerald-700 font-medium hover:underline text-sm mt-2 inline-block">
                    Learn more about us
                </Link>
            </section>
        </article>
    );
};

export default Pilot;
