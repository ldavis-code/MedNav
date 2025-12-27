import { Link } from 'react-router-dom';
import { Building, DollarSign, Users, Shield, CheckCircle, ArrowRight, BarChart3, Lock, Mail } from 'lucide-react';
import { useMetaTags } from '../hooks/useMetaTags.js';
import { seoMetadata } from '../data/seo-metadata.js';

const ForPayers = () => {
    useMetaTags(seoMetadata.forPayers);

    const valueProps = [
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

    const outcomes = [
        'Members find manufacturer copay assistance',
        'Members access Patient Assistance Programs (PAPs)',
        'Reduced member out-of-pocket costs',
        'Potential claims offsets from manufacturer programs',
        'Improved member satisfaction with benefits',
        'Educational content on insurance navigation'
    ];

    return (
        <article className="max-w-5xl mx-auto space-y-12 pb-12">
            {/* Hero Section */}
            <header className="text-center py-8 md:py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
                    <Building size={32} className="text-purple-700" aria-hidden="true" />
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                    Help Members Access Manufacturer Assistance
                </h1>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
                    Reduce plan spend on high-cost medications by connecting members to manufacturer programs and foundations.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                        href="mailto:info@medicationnavigator.com?subject=Payer%20Demo%20Request"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition"
                    >
                        <Mail size={20} aria-hidden="true" />
                        Request Demo
                    </a>
                </div>
            </header>

            {/* Value Props */}
            <section className="grid md:grid-cols-2 gap-6">
                {valueProps.map((prop, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-purple-100 transition">
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4" aria-hidden="true">
                            <prop.icon size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">{prop.title}</h2>
                        <p className="text-slate-600">{prop.description}</p>
                    </div>
                ))}
            </section>

            {/* Outcomes */}
            <section className="bg-slate-50 rounded-2xl p-8 md:p-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Member Outcomes</h2>
                <div className="grid md:grid-cols-2 gap-3">
                    {outcomes.map((outcome, index) => (
                        <div key={index} className="flex items-center gap-3 bg-white p-4 rounded-lg">
                            <CheckCircle size={20} className="text-purple-600 flex-shrink-0" aria-hidden="true" />
                            <span className="text-slate-700">{outcome}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* How It Works */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">How It Works</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-purple-700 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">1</div>
                        <h3 className="font-bold text-slate-900 mb-2">Integrate as a Resource</h3>
                        <p className="text-slate-600 text-sm">Add the link to member portals, EOBs, or care management communications</p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-purple-700 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">2</div>
                        <h3 className="font-bold text-slate-900 mb-2">Members Self-Serve</h3>
                        <p className="text-slate-600 text-sm">Members search medications, find assistance programs, and access applications directly</p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-purple-700 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">3</div>
                        <h3 className="font-bold text-slate-900 mb-2">Measure Impact</h3>
                        <p className="text-slate-600 text-sm">Receive engagement reports showing member utilization and programs accessed</p>
                    </div>
                </div>
            </section>

            {/* Compliance Note */}
            <section className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-4">
                    <Shield size={24} className="text-purple-700" aria-hidden="true" />
                    <h2 className="text-xl font-bold text-slate-900">Privacy & Compliance</h2>
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
                    <h2 className="text-xl font-bold text-purple-900">What Members See</h2>
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

            {/* CTA */}
            <section className="text-center py-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Ready to Support Your Members?</h2>
                <p className="text-slate-600 mb-6 max-w-xl mx-auto">
                    Contact us to schedule a demo and learn how we can help reduce medication cost burdens for your members.
                </p>
                <a
                    href="mailto:info@medicationnavigator.com?subject=Payer%20Demo%20Request"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition"
                >
                    <Mail size={20} aria-hidden="true" />
                    Contact Us
                </a>
            </section>
        </article>
    );
};

export default ForPayers;
