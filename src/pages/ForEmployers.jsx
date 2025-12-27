import { Link } from 'react-router-dom';
import { Briefcase, DollarSign, HeartHandshake, Shield, CheckCircle, ArrowRight, Users, Lock, Mail } from 'lucide-react';
import { useMetaTags } from '../hooks/useMetaTags.js';
import { seoMetadata } from '../data/seo-metadata.js';

const ForEmployers = () => {
    useMetaTags(seoMetadata.forEmployers);

    const valueProps = [
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

    const benefits = [
        'Reduced employee out-of-pocket medication costs',
        'Lower claims for specialty medications through manufacturer programs',
        'Improved medication adherence for medication employees',
        'Privacy-safe—no employee health data collected',
        'No integration required with existing benefits',
        'Easy to communicate via benefits portal or HR'
    ];

    return (
        <article className="max-w-5xl mx-auto space-y-12 pb-12">
            {/* Hero Section */}
            <header className="text-center py-8 md:py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                    <Briefcase size={32} className="text-blue-700" aria-hidden="true" />
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                    Reduce Specialty Drug Costs for Your medication Employees
                </h1>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
                    Connect employees to copay cards, manufacturer assistance programs, and foundations—complementing your existing pharmacy benefits.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                        href="mailto:info@medicationnavigator.com?subject=Employer%20Partnership%20Inquiry"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition"
                    >
                        <Mail size={20} aria-hidden="true" />
                        Learn More
                    </a>
                </div>
            </header>

            {/* Value Props */}
            <section className="grid md:grid-cols-2 gap-6">
                {valueProps.map((prop, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-100 transition">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4" aria-hidden="true">
                            <prop.icon size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">{prop.title}</h2>
                        <p className="text-slate-600">{prop.description}</p>
                    </div>
                ))}
            </section>

            {/* Benefits List */}
            <section className="bg-slate-50 rounded-2xl p-8 md:p-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Employer Benefits</h2>
                <div className="grid md:grid-cols-2 gap-3">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-3 bg-white p-4 rounded-lg">
                            <CheckCircle size={20} className="text-blue-600 flex-shrink-0" aria-hidden="true" />
                            <span className="text-slate-700">{benefit}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* How It Works */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">How It Works</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-blue-700 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">1</div>
                        <h3 className="font-bold text-slate-900 mb-2">Share the Resource</h3>
                        <p className="text-slate-600 text-sm">Add the link to your benefits portal, open enrollment materials, or HR communications</p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-blue-700 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">2</div>
                        <h3 className="font-bold text-slate-900 mb-2">Employees Search</h3>
                        <p className="text-slate-600 text-sm">Employees search for their medications and find applicable assistance programs</p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-blue-700 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">3</div>
                        <h3 className="font-bold text-slate-900 mb-2">Lower Costs</h3>
                        <p className="text-slate-600 text-sm">Employees apply for copay cards and PAPs, reducing their costs and potentially plan spend</p>
                    </div>
                </div>
            </section>

            {/* Use Case */}
            <section className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Real Impact for medication Employees</h2>
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
                    <h2 className="text-xl font-bold text-blue-900">What Employees See</h2>
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

            {/* CTA */}
            <section className="text-center py-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Ready to Support Your medication Employees?</h2>
                <p className="text-slate-600 mb-6 max-w-xl mx-auto">
                    Contact us to learn how we can help your employees find medication assistance programs.
                </p>
                <a
                    href="mailto:info@medicationnavigator.com?subject=Employer%20Partnership%20Inquiry"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition"
                >
                    <Mail size={20} aria-hidden="true" />
                    Contact Us
                </a>
            </section>
        </article>
    );
};

export default ForEmployers;
