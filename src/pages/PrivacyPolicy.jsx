import { Link } from 'react-router-dom';
import { Shield, Mail } from 'lucide-react';
import { useMetaTags } from '../hooks/useMetaTags.js';
import { seoMetadata } from '../data/seo-metadata.js';

const PrivacyPolicy = () => {
    useMetaTags(seoMetadata.privacyPolicy);

    return (
        <article className="max-w-4xl mx-auto space-y-8 pb-12">
            <header className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                    <Shield size={32} className="text-emerald-700" aria-hidden="true" />
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Privacy Policy</h1>
                <p className="text-slate-600">Last Updated: April 1, 2026</p>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-8">
                <section>
                    <p className="text-slate-700 leading-relaxed">
                        MedNav LLC ("we," "us," or "our") operates the Medication Navigator website (the "Website"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our Website.
                    </p>
                    <p className="text-slate-700 leading-relaxed mt-4">
                        Please read this Privacy Policy carefully. By using the Website, you agree to the collection and use of information in accordance with this policy.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                        <span className="w-1 h-6 bg-emerald-600 rounded-full" aria-hidden="true"></span>
                        1. Information We Collect
                    </h2>
                    <p className="text-slate-700 leading-relaxed mb-4">
                        We may collect information about you in a variety of ways. The information we may collect via the Website includes:
                    </p>
                    <div className="space-y-4">
                        <div className="bg-slate-50 rounded-lg p-4">
                            <h3 className="font-semibold text-slate-900 mb-2">Personal Data</h3>
                            <p className="text-slate-700">
                                When you subscribe to our service, we collect your email address and payment information. Payment processing is handled securely by Stripe, and we do not store your full credit card details on our servers.
                            </p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-4">
                            <h3 className="font-semibold text-slate-900 mb-2">Usage Data</h3>
                            <p className="text-slate-700">
                                We may automatically collect certain information when you visit the Website, including your IP address, browser type, operating system, access times, and the pages you have viewed. This data helps us improve the Website and user experience.
                            </p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-4">
                            <h3 className="font-semibold text-slate-900 mb-2">Survey Responses</h3>
                            <p className="text-slate-700">
                                If you participate in our surveys, we collect your responses. Survey data is collected anonymously—we do not collect names, dates of birth, or medical record numbers in surveys.
                            </p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                        <span className="w-1 h-6 bg-emerald-600 rounded-full" aria-hidden="true"></span>
                        2. How We Use Your Information
                    </h2>
                    <p className="text-slate-700 leading-relaxed mb-4">
                        We use the information we collect in the following ways:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-slate-700">
                        <li>To provide, operate, and maintain the Website</li>
                        <li>To process your subscription and payment transactions</li>
                        <li>To send you service-related communications</li>
                        <li>To improve and personalize your experience</li>
                        <li>To analyze usage trends and optimize our services</li>
                        <li>To comply with legal obligations</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                        <span className="w-1 h-6 bg-emerald-600 rounded-full" aria-hidden="true"></span>
                        3. Disclosure of Your Information
                    </h2>
                    <p className="text-slate-700 leading-relaxed mb-4">
                        We may share your information in the following situations:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-slate-700">
                        <li><strong>Service Providers:</strong> We may share your information with third-party vendors who perform services for us, such as payment processing (Stripe) and analytics.</li>
                        <li><strong>Legal Requirements:</strong> We may disclose your information if required by law or in response to valid requests by public authorities.</li>
                        <li><strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</li>
                    </ul>
                    <p className="text-slate-700 leading-relaxed mt-4 font-semibold bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                        We do not sell your personal information to third parties.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                        <span className="w-1 h-6 bg-emerald-600 rounded-full" aria-hidden="true"></span>
                        4. Cookies and Tracking Technologies
                    </h2>
                    <p className="text-slate-700 leading-relaxed">
                        We may use cookies, web beacons, and similar tracking technologies to collect and store information about your interactions with the Website. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some features of our Website.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                        <span className="w-1 h-6 bg-emerald-600 rounded-full" aria-hidden="true"></span>
                        5. Data Security
                    </h2>
                    <p className="text-slate-700 leading-relaxed">
                        We use administrative, technical, and physical security measures to protect your personal information. While we have taken reasonable steps to secure the information you provide to us, please be aware that no security measures are perfect or impenetrable, and we cannot guarantee that your information will not be accessed, disclosed, altered, or destroyed.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                        <span className="w-1 h-6 bg-emerald-600 rounded-full" aria-hidden="true"></span>
                        6. Data Retention
                    </h2>
                    <p className="text-slate-700 leading-relaxed">
                        We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                        <span className="w-1 h-6 bg-emerald-600 rounded-full" aria-hidden="true"></span>
                        7. Your Privacy Rights
                    </h2>
                    <p className="text-slate-700 leading-relaxed mb-4">
                        Depending on your location, you may have certain rights regarding your personal information:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-slate-700">
                        <li><strong>Access:</strong> You may request access to the personal information we hold about you.</li>
                        <li><strong>Correction:</strong> You may request that we correct any inaccurate or incomplete information.</li>
                        <li><strong>Deletion:</strong> You may request that we delete your personal information, subject to certain exceptions.</li>
                        <li><strong>Opt-out:</strong> You may opt out of receiving promotional communications from us by following the unsubscribe instructions in those messages.</li>
                    </ul>
                    <p className="text-slate-700 leading-relaxed mt-4">
                        To exercise any of these rights, please contact us using the information provided below.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                        <span className="w-1 h-6 bg-emerald-600 rounded-full" aria-hidden="true"></span>
                        8. Third-Party Websites
                    </h2>
                    <p className="text-slate-700 leading-relaxed">
                        The Website may contain links to third-party websites and services that are not owned or controlled by us. We are not responsible for the privacy practices of these third parties. We encourage you to review the privacy policies of any third-party sites you visit.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                        <span className="w-1 h-6 bg-emerald-600 rounded-full" aria-hidden="true"></span>
                        9. Children's Privacy
                    </h2>
                    <p className="text-slate-700 leading-relaxed">
                        The Website is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us so that we can delete such information.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                        <span className="w-1 h-6 bg-emerald-600 rounded-full" aria-hidden="true"></span>
                        10. Changes to This Privacy Policy
                    </h2>
                    <p className="text-slate-700 leading-relaxed">
                        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                        <span className="w-1 h-6 bg-emerald-600 rounded-full" aria-hidden="true"></span>
                        11. Contact Us
                    </h2>
                    <p className="text-slate-700 leading-relaxed">
                        If you have any questions about this Privacy Policy or our privacy practices, please contact us at{' '}
                        <a
                            href="mailto:info@medicationnavigator.com"
                            className="text-emerald-600 hover:text-emerald-700 underline inline-flex items-center gap-1"
                        >
                            <Mail size={16} aria-hidden="true" />
                            info@medicationnavigator.com
                        </a>
                    </p>
                </section>
            </div>

            <aside className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 md:p-8 text-center">
                <h2 className="text-xl font-bold text-emerald-900 mb-3">Have Questions?</h2>
                <p className="text-emerald-800 mb-6">
                    If you have any questions about our privacy practices or how we handle your data, we're here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/terms-and-conditions"
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-md transition"
                    >
                        View Terms & Conditions
                    </Link>
                    <Link
                        to="/"
                        className="px-6 py-3 bg-white hover:bg-slate-50 text-emerald-700 font-bold rounded-lg shadow-md border border-emerald-200 transition"
                    >
                        Back to Home
                    </Link>
                </div>
            </aside>
        </article>
    );
};

export default PrivacyPolicy;
