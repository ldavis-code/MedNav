import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Users, Building2, Briefcase, CheckCircle, ArrowRight, Mail, DollarSign, HeartHandshake, Shield, TrendingUp, ShieldCheck, BarChart3, Lock, Building } from 'lucide-react';
import { useMetaTags } from '../hooks/useMetaTags.js';
import { seoMetadata } from '../data/seo-metadata.js';

const Pricing = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Determine initial tab from URL hash or default to 'pricing'
    const getInitialTab = () => {
        const hash = location.hash.replace('#', '');
        if (['pricing', 'medication-programs', 'employers', 'payers'].includes(hash)) {
            return hash;
        }
        return 'pricing';
    };

    const [activeTab, setActiveTab] = useState(getInitialTab);

    // Update tab when URL hash changes
    useEffect(() => {
        const hash = location.hash.replace('#', '');
        if (['pricing', 'medication-programs', 'employers', 'payers'].includes(hash)) {
            setActiveTab(hash);
        }
    }, [location.hash]);

    // Update URL hash when tab changes
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        navigate(`/pricing#${tabId}`, { replace: true });
    };

    useMetaTags(seoMetadata.pricing);

    const tiers = [
        {
            name: 'Free',
            description: 'For individual patients',
            price: '$0',
            priceSubtext: '— always free',
            color: 'emerald',
            icon: Users,
            features: [
                '4 My Path Quizzes',
                'All assistance program links',
                'Educational resources',
                'No login required',
                'Medication lists are not saved'
            ],
            cta: 'Start Searching',
            ctaLink: '/wizard',
            highlighted: false
        },
        {
            name: 'Monthly',
            description: 'Pro subscription',
            price: '$8.99',
            priceSubtext: 'per month',
            color: 'blue',
            icon: CreditCard,
            features: [
                'Unlimited My Path Quiz',
                'Save medications on your device',
                'Export or print your medication list',
                'Unlimited medications in Search Meds',
                'Personal copay card reminders stored on your device',
                'Track your estimated medication savings locally'
            ],
            importantNote: 'Your medication information stays on your device. Medication Navigator does not store or access your medication list.',
            cta: 'Subscribe Monthly',
            ctaLink: '/subscribe?plan=monthly',
            highlighted: true
        },
        {
            name: 'Yearly',
            description: 'Pro subscription - Save 26%',
            price: '$79.99',
            priceSubtext: 'per year',
            color: 'purple',
            icon: CreditCard,
            features: [
                'Unlimited My Path Quiz',
                'Save medications on your device',
                'Export or print your medication list',
                'Unlimited medications in Search Meds',
                'Personal copay card reminders stored on your device',
                'Track your estimated medication savings locally'
            ],
            importantNote: 'Your medication information stays on your device. Medication Navigator does not store or access your medication list.',
            cta: 'Subscribe Yearly',
            ctaLink: '/subscribe?plan=yearly',
            highlighted: false
        }
    ];

    const colorClasses = {
        emerald: {
            bg: 'bg-emerald-50',
            border: 'border-emerald-200',
            icon: 'bg-emerald-100 text-emerald-600',
            button: 'bg-emerald-700 hover:bg-emerald-800',
            check: 'text-emerald-600'
        },
        blue: {
            bg: 'bg-blue-50',
            border: 'border-blue-300',
            icon: 'bg-blue-100 text-blue-600',
            button: 'bg-blue-700 hover:bg-blue-800',
            check: 'text-blue-600'
        },
        purple: {
            bg: 'bg-purple-50',
            border: 'border-purple-200',
            icon: 'bg-purple-100 text-purple-600',
            button: 'bg-purple-700 hover:bg-purple-800',
            check: 'text-purple-600'
        }
    };

    const tabs = [
        { id: 'pricing', label: 'Pricing', icon: CreditCard },
        { id: 'medication-programs', label: 'Healthcare Programs', icon: Building2 },
        { id: 'employers', label: 'Employers', icon: Briefcase },
        { id: 'payers', label: 'Payers', icon: Building }
    ];

    const TabButton = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => handleTabChange(id)}
            role="tab"
            id={`${id}-tab`}
            aria-selected={activeTab === id}
            aria-controls={`${id}-panel`}
            tabIndex={activeTab === id ? 0 : -1}
            className={`flex items-center gap-2 px-4 py-3 font-bold text-sm md:text-base transition-all border-b-4 min-h-[44px] whitespace-nowrap
                ${activeTab === id
                    ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50'
                    : 'border-transparent text-slate-700 hover:text-emerald-600 hover:bg-slate-50'
                }`}
        >
            <Icon size={18} aria-hidden="true" />
            <span className="hidden md:inline">{label}</span>
            <span className="md:hidden">{label.split(' ')[0]}</span>
        </button>
    );

    // Partner page data
    const medicationProgramsValueProps = [
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

    const employerValueProps = [
        {
            icon: DollarSign,
            title: 'Reduce Specialty Drug Costs',
            description: 'Connect employees to copay cards and manufacturer programs that offset out-of-pocket costs for expensive medications.'
        },
        {
            icon: HeartHandshake,
            title: 'Connect to Copay Cards & Foundations',
            description: 'Help employees access legitimate assistance programs that can cover copays, coinsurance, and even full medication costs.'
        },
        {
            icon: Shield,
            title: 'Complement Existing Pharmacy Benefits',
            description: 'Works alongside your PBM and specialty pharmacy. We help employees find additional savings programs, not replace your benefits.'
        },
        {
            icon: Lock,
            title: 'No Login Required for Employees',
            description: 'Employees access resources instantly—no accounts, no app downloads, no personal information required. Frictionless support.'
        }
    ];

    const employerBenefits = [
        'Reduced employee out-of-pocket medication costs',
        'Lower claims for specialty medications through manufacturer programs',
        'Improved medication adherence for medication employees',
        'Privacy-safe—no employee health data collected',
        'No integration required with existing benefits',
        'Easy to communicate via benefits portal or HR'
    ];

    const payerValueProps = [
        {
            icon: DollarSign,
            title: 'Reduce Plan Spend on High-Cost Medications',
            description: 'Help members access manufacturer assistance programs that offset costs, potentially reducing claims for expensive immunosuppressants.'
        },
        {
            icon: Users,
            title: 'Patient-Friendly Resource',
            description: 'Members can access medication assistance information without downloading an app, creating an account, or calling a support line.'
        },
        {
            icon: BarChart3,
            title: 'Privacy-Safe Engagement Tracking',
            description: 'Understand how members engage with resources without collecting PHI. Get aggregate engagement data for pilot reporting.'
        },
        {
            icon: Lock,
            title: 'No App Download Required',
            description: 'A mobile-responsive web tool that works instantly on any device. No friction for members seeking help with medication costs.'
        }
    ];

    const payerOutcomes = [
        'Members find manufacturer copay assistance',
        'Members access Patient Assistance Programs (PAPs)',
        'Reduced member out-of-pocket costs',
        'Potential claims offsets from manufacturer programs',
        'Improved member satisfaction with benefits',
        'Educational content on insurance navigation'
    ];

    return (
        <article className="max-w-6xl mx-auto space-y-8 pb-12">
            {/* Hero Section */}
            <header className="text-center py-8 md:py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-6">
                    <CreditCard size={32} className="text-emerald-700" aria-hidden="true" />
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                    Pricing & Partners
                </h1>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                    Free access to education. Partnership options for organizations.
                </p>
            </header>

            {/* Tab Navigation */}
            <nav className="bg-white rounded-xl shadow-sm border border-slate-200 p-2" role="tablist" aria-label="Pricing and partner sections">
                <div className="flex overflow-x-auto gap-1">
                    {tabs.map((tab) => (
                        <TabButton key={tab.id} id={tab.id} label={tab.label} icon={tab.icon} />
                    ))}
                </div>
            </nav>

            {/* Tab Content */}
            <div role="tabpanel" id={`${activeTab}-panel`} aria-labelledby={`${activeTab}-tab`} className="space-y-12">
                {/* Pricing Tab */}
                {activeTab === 'pricing' && (
                    <>
                        {/* Pricing Tiers */}
                        <section className="grid md:grid-cols-3 gap-6">
                            {tiers.map((tier, index) => {
                                const colors = colorClasses[tier.color];
                                return (
                                    <div
                                        key={index}
                                        className={`relative bg-white rounded-2xl shadow-sm border-2 ${tier.highlighted ? colors.border + ' ring-2 ring-blue-200' : 'border-slate-200'} p-6 flex flex-col`}
                                    >
                                        {tier.highlighted && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-700 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                Most Popular
                                            </div>
                                        )}
                                        <div className={`w-12 h-12 ${colors.icon} rounded-full flex items-center justify-center mb-4`} aria-hidden="true">
                                            <tier.icon size={24} />
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-900 mb-1">{tier.name}</h2>
                                        <p className="text-slate-600 text-sm mb-4">{tier.description}</p>
                                        <div className="mb-6">
                                            <span className="text-3xl font-bold text-slate-900">{tier.price}</span>
                                            <span className="text-slate-500 text-sm ml-2">{tier.priceSubtext}</span>
                                        </div>
                                        <ul className="space-y-3 mb-6 flex-grow">
                                            {tier.features.map((feature, fIndex) => (
                                                <li key={fIndex} className="flex items-start gap-2">
                                                    <CheckCircle size={18} className={`${colors.check} flex-shrink-0 mt-0.5`} aria-hidden="true" />
                                                    <span className="text-slate-700 text-sm">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        {tier.importantNote && (
                                            <p className="text-xs text-slate-500 mb-6 italic">
                                                {tier.importantNote}
                                            </p>
                                        )}
                                        {tier.ctaLink.startsWith('mailto:') ? (
                                            <a
                                                href={tier.ctaLink}
                                                className={`${colors.button} text-white font-bold py-3 px-6 rounded-xl text-center transition flex items-center justify-center gap-2`}
                                            >
                                                <Mail size={18} aria-hidden="true" />
                                                {tier.cta}
                                            </a>
                                        ) : (
                                            <Link
                                                to={tier.ctaLink}
                                                className={`${colors.button} text-white font-bold py-3 px-6 rounded-xl text-center transition flex items-center justify-center gap-2`}
                                            >
                                                {tier.cta}
                                                <ArrowRight size={18} aria-hidden="true" />
                                            </Link>
                                        )}
                                    </div>
                                );
                            })}
                        </section>

                        {/* Medical Disclaimer */}
                        <p className="text-center text-sm text-slate-500 max-w-2xl mx-auto">
                            This tool is designed to help you organize and understand your medications. It does not replace medical advice. Always review medication changes with your care team.
                        </p>

                        {/* FAQ Section */}
                        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Common Questions</h2>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-2">What's included in the Free plan?</h3>
                                    <p className="text-slate-600">
                                        The Free plan includes 4 My Path Quizzes, all assistance program links, educational resources, and no login required. Medication lists are not saved in the free plan.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-2">Why upgrade to Pro?</h3>
                                    <p className="text-slate-600">
                                        Pro gives you unlimited My Path Quizzes, the ability to save medications on your device, export or print your medication list, unlimited medications in Search Meds, personal copay card reminders, and savings tracking—all stored locally on your device. Choose Monthly at $8.99/month or save 26% with Yearly at $79.99/year.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-2">Is my medication data private?</h3>
                                    <p className="text-slate-600">
                                        Yes. With Pro, your medications are stored only on your device (in your browser), not on our servers. Medication Navigator does not store or access your medication list.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-2">Can I cancel my subscription?</h3>
                                    <p className="text-slate-600">
                                        Yes, you can cancel your subscription at any time. Your Pro features will remain active until the end of your billing period, and you'll still have full access to the Free plan.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </>
                )}

                {/* Healthcare Programs Tab */}
                {activeTab === 'medication-programs' && (
                    <>
                        {/* Hero */}
                        <section className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-6">
                                <Building2 size={32} className="text-emerald-700" aria-hidden="true" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4">
                                Help Your Patients Navigate Medication Costs
                            </h2>
                            <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-8">
                                Give patients a trusted resource with free educational content to find assistance programs and reduce financial barriers to medication adherence.
                            </p>
                            <a
                                href="mailto:info@medicationnavigator.com?subject=Pilot%20Program%20Request"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition"
                            >
                                <Mail size={20} aria-hidden="true" />
                                Request a Pilot
                            </a>
                        </section>

                        {/* Value Props */}
                        <section className="grid md:grid-cols-2 gap-6">
                            {medicationProgramsValueProps.map((prop, index) => (
                                <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-emerald-100 transition">
                                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4" aria-hidden="true">
                                        <prop.icon size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{prop.title}</h3>
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
                                <h3 className="text-2xl font-bold text-slate-900">What You Can Report</h3>
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
                            <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">How the Pilot Works</h3>
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-emerald-700 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">1</div>
                                    <h4 className="font-bold text-slate-900 mb-2">Get Your Pilot URL</h4>
                                    <p className="text-slate-600 text-sm">We create a branded landing page for your program (e.g., /pilot/your-program)</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-emerald-700 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">2</div>
                                    <h4 className="font-bold text-slate-900 mb-2">Share With Patients</h4>
                                    <p className="text-slate-600 text-sm">Give patients the link via discharge materials, patient portals, or social workers</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-emerald-700 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">3</div>
                                    <h4 className="font-bold text-slate-900 mb-2">Review Engagement</h4>
                                    <p className="text-slate-600 text-sm">After 90 days, receive a detailed report on patient engagement with resources</p>
                                </div>
                            </div>
                        </section>

                        {/* For Patients Callout */}
                        <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <Users size={24} className="text-emerald-700" aria-hidden="true" />
                                <h3 className="text-xl font-bold text-emerald-900">What Patients See</h3>
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
                    </>
                )}

                {/* Employers Tab */}
                {activeTab === 'employers' && (
                    <>
                        {/* Hero */}
                        <section className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                                <Briefcase size={32} className="text-blue-700" aria-hidden="true" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4">
                                Reduce Specialty Drug Costs for Your medication Employees
                            </h2>
                            <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-8">
                                Connect employees to copay cards, manufacturer assistance programs, and foundations—complementing your existing pharmacy benefits.
                            </p>
                            <a
                                href="mailto:info@medicationnavigator.com?subject=Employer%20Partnership%20Inquiry"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition"
                            >
                                <Mail size={20} aria-hidden="true" />
                                Learn More
                            </a>
                        </section>

                        {/* Value Props */}
                        <section className="grid md:grid-cols-2 gap-6">
                            {employerValueProps.map((prop, index) => (
                                <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-100 transition">
                                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4" aria-hidden="true">
                                        <prop.icon size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{prop.title}</h3>
                                    <p className="text-slate-600">{prop.description}</p>
                                </div>
                            ))}
                        </section>

                        {/* Benefits List */}
                        <section className="bg-slate-50 rounded-2xl p-8 md:p-10">
                            <h3 className="text-2xl font-bold text-slate-900 mb-6">Employer Benefits</h3>
                            <div className="grid md:grid-cols-2 gap-3">
                                {employerBenefits.map((benefit, index) => (
                                    <div key={index} className="flex items-center gap-3 bg-white p-4 rounded-lg">
                                        <CheckCircle size={20} className="text-blue-600 flex-shrink-0" aria-hidden="true" />
                                        <span className="text-slate-700">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* How It Works */}
                        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-10">
                            <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">How It Works</h3>
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-blue-700 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">1</div>
                                    <h4 className="font-bold text-slate-900 mb-2">Share the Resource</h4>
                                    <p className="text-slate-600 text-sm">Add the link to your benefits portal, open enrollment materials, or HR communications</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-blue-700 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">2</div>
                                    <h4 className="font-bold text-slate-900 mb-2">Employees Search</h4>
                                    <p className="text-slate-600 text-sm">Employees search for their medications and find applicable assistance programs</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-blue-700 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">3</div>
                                    <h4 className="font-bold text-slate-900 mb-2">Lower Costs</h4>
                                    <p className="text-slate-600 text-sm">Employees apply for copay cards and PAPs, reducing their costs and potentially plan spend</p>
                                </div>
                            </div>
                        </section>

                        {/* Use Case */}
                        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8">
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Real Impact for medication Employees</h3>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                patients typically take 3-5 medications daily for life. Immunosuppressants like tacrolimus and mycophenolate can cost hundreds to thousands per month. Even with good insurance, copays add up.
                            </p>
                            <p className="text-slate-700 leading-relaxed">
                                By connecting employees to manufacturer copay cards and Patient Assistance Programs, you help them save money while potentially reducing high-cost claims. It's a win-win for employees and your benefits program.
                            </p>
                        </section>

                        {/* For Employees Callout */}
                        <section className="bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center">
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <Users size={24} className="text-blue-700" aria-hidden="true" />
                                <h3 className="text-xl font-bold text-blue-900">What Employees See</h3>
                            </div>
                            <p className="text-blue-800 mb-6 max-w-2xl mx-auto">
                                Employees get access to medication search, assistance programs, and free educational resources—no login required for education.
                            </p>
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 text-blue-700 font-medium hover:underline"
                            >
                                Preview the employee experience
                                <ArrowRight size={16} aria-hidden="true" />
                            </Link>
                        </section>
                    </>
                )}

                {/* Payers Tab */}
                {activeTab === 'payers' && (
                    <>
                        {/* Hero */}
                        <section className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
                                <Building size={32} className="text-purple-700" aria-hidden="true" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4">
                                Help Members Access Manufacturer Assistance
                            </h2>
                            <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-8">
                                Reduce plan spend on high-cost medications by connecting members to manufacturer programs and foundations.
                            </p>
                            <a
                                href="mailto:info@medicationnavigator.com?subject=Payer%20Demo%20Request"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition"
                            >
                                <Mail size={20} aria-hidden="true" />
                                Request Demo
                            </a>
                        </section>

                        {/* Value Props */}
                        <section className="grid md:grid-cols-2 gap-6">
                            {payerValueProps.map((prop, index) => (
                                <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-purple-100 transition">
                                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4" aria-hidden="true">
                                        <prop.icon size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{prop.title}</h3>
                                    <p className="text-slate-600">{prop.description}</p>
                                </div>
                            ))}
                        </section>

                        {/* Outcomes */}
                        <section className="bg-slate-50 rounded-2xl p-8 md:p-10">
                            <h3 className="text-2xl font-bold text-slate-900 mb-6">Member Outcomes</h3>
                            <div className="grid md:grid-cols-2 gap-3">
                                {payerOutcomes.map((outcome, index) => (
                                    <div key={index} className="flex items-center gap-3 bg-white p-4 rounded-lg">
                                        <CheckCircle size={20} className="text-purple-600 flex-shrink-0" aria-hidden="true" />
                                        <span className="text-slate-700">{outcome}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* How It Works */}
                        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-10">
                            <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">How It Works</h3>
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-purple-700 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">1</div>
                                    <h4 className="font-bold text-slate-900 mb-2">Integrate as a Resource</h4>
                                    <p className="text-slate-600 text-sm">Add the link to member portals, EOBs, or care management communications</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-purple-700 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">2</div>
                                    <h4 className="font-bold text-slate-900 mb-2">Members Self-Serve</h4>
                                    <p className="text-slate-600 text-sm">Members search medications, find assistance programs, and access applications directly</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-purple-700 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">3</div>
                                    <h4 className="font-bold text-slate-900 mb-2">Measure Impact</h4>
                                    <p className="text-slate-600 text-sm">Receive engagement reports showing member utilization and programs accessed</p>
                                </div>
                            </div>
                        </section>

                        {/* Compliance Note */}
                        <section className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <Shield size={24} className="text-purple-700" aria-hidden="true" />
                                <h3 className="text-xl font-bold text-slate-900">Privacy & Compliance</h3>
                            </div>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                We do not collect, store, or transmit PHI. Members use the tool anonymously—no accounts, no personal information required. All tracking is aggregate and privacy-safe.
                            </p>
                            <p className="text-slate-700 leading-relaxed">
                                The tool provides educational information and links to official manufacturer programs. Members apply directly with manufacturers, not through our platform.
                            </p>
                        </section>

                        {/* For Members Callout */}
                        <section className="bg-purple-50 border border-purple-200 rounded-2xl p-8 text-center">
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <Users size={24} className="text-purple-700" aria-hidden="true" />
                                <h3 className="text-xl font-bold text-purple-900">What Members See</h3>
                            </div>
                            <p className="text-purple-800 mb-6 max-w-2xl mx-auto">
                                Members get access to medication search, assistance programs, and free educational resources—no login required for education.
                            </p>
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 text-purple-700 font-medium hover:underline"
                            >
                                Preview the member experience
                                <ArrowRight size={16} aria-hidden="true" />
                            </Link>
                        </section>
                    </>
                )}
            </div>

            {/* CTA - Always Visible */}
            <section className="text-center py-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Questions?</h2>
                <p className="text-slate-600 mb-6 max-w-xl mx-auto">
                    We're happy to discuss options that work for your organization.
                </p>
                <a
                    href="mailto:info@medicationnavigator.com?subject=Pricing%20Question"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition"
                >
                    <Mail size={20} aria-hidden="true" />
                    Contact Us
                </a>
            </section>
        </article>
    );
};

export default Pricing;
