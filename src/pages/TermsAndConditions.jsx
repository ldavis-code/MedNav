import { Link } from 'react-router-dom';
import { FileText, Mail } from 'lucide-react';
import { useMetaTags } from '../hooks/useMetaTags.js';
import { seoMetadata } from '../data/seo-metadata.js';

const TermsAndConditions = () => {
    useMetaTags(seoMetadata.termsAndConditions);

    return (
        <article className="max-w-4xl mx-auto space-y-8 pb-12">
            <header className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                    <FileText size={32} className="text-emerald-700" aria-hidden="true" />
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Terms and Conditions</h1>
                <p className="text-slate-600">Last Updated: April 1, 2026</p>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-8">
                <section>
                    <p className="text-slate-700 leading-relaxed">
                        Welcome to the Medication Navigator website (the "Website"), operated by MedNav LLC ("we," "us," or "our"). These Terms and Conditions ("Terms") govern your access to and use of the Website and its content, which is intended to be an educational resource for patients and their caregivers.
                    </p>
                    <p className="text-slate-700 leading-relaxed mt-4">
                        By accessing or using the Website, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Website.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                        <span className="w-1 h-6 bg-emerald-600 rounded-full" aria-hidden="true"></span>
                        1. No Medical Advice
                    </h2>
                    <p className="text-slate-700 leading-relaxed">
                        This tool provides educational information to help you navigate medication assistance options. It is not a substitute for professional medical advice. Always consult your healthcare provider with any questions about your medical condition or treatment.
                    </p>
                    <p className="text-slate-700 leading-relaxed mt-4">
                        Never disregard professional medical advice or delay in seeking it because of something you have read on this Website.
                    </p>
                    <p className="text-slate-700 leading-relaxed mt-4 font-semibold bg-red-50 border border-red-200 rounded-lg p-4">
                        If you think you may have a medical emergency, call your doctor or 911 immediately.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                        <span className="w-1 h-6 bg-emerald-600 rounded-full" aria-hidden="true"></span>
                        2. Use of Information
                    </h2>
                    <p className="text-slate-700 leading-relaxed">
                        The Website provides information about patient assistance programs, copay cards, and other resources. We do not endorse, and are not responsible for, the accuracy or reliability of any information on the Website. We are not responsible for any decisions you make based on the information on the Website.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                        <span className="w-1 h-6 bg-emerald-600 rounded-full" aria-hidden="true"></span>
                        3. Third-Party Links
                    </h2>
                    <p className="text-slate-700 leading-relaxed">
                        The Website may contain links to third-party websites or services that are not owned or controlled by MedNav LLC. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You further acknowledge and agree that MedNav LLC shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods or services available on or through any such websites or services.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                        <span className="w-1 h-6 bg-emerald-600 rounded-full" aria-hidden="true"></span>
                        4. Intellectual Property
                    </h2>
                    <p className="text-slate-700 leading-relaxed">
                        The Website and its original content, features, and functionality are and will remain the exclusive property of MedNav LLC and its licensors. The Website is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of MedNav LLC.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                        <span className="w-1 h-6 bg-emerald-600 rounded-full" aria-hidden="true"></span>
                        5. Limitation of Liability
                    </h2>
                    <p className="text-slate-700 leading-relaxed">
                        In no event shall MedNav LLC, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Website; (ii) any conduct or content of any third party on the Website; (iii) any content obtained from the Website; and (iv) unauthorized access, use, or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence), or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                        <span className="w-1 h-6 bg-emerald-600 rounded-full" aria-hidden="true"></span>
                        6. Disclaimer
                    </h2>
                    <p className="text-slate-700 leading-relaxed">
                        Your use of the Website is at your sole risk. The Website is provided on an "AS IS" and "AS AVAILABLE" basis. The Website is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.
                    </p>
                    <p className="text-slate-700 leading-relaxed mt-4">
                        MedNav LLC its subsidiaries, affiliates, and its licensors do not warrant that a) the Website will function uninterrupted, secure, or available at any particular time or location; b) any errors or defects will be corrected; c) the Website is free of viruses or other harmful components; or d) the results of using the Website will meet your requirements.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                        <span className="w-1 h-6 bg-emerald-600 rounded-full" aria-hidden="true"></span>
                        7. Governing Law
                    </h2>
                    <p className="text-slate-700 leading-relaxed">
                        These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
                    </p>
                    <p className="text-slate-700 leading-relaxed mt-4">
                        Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us regarding our Website, and supersede and replace any prior agreements we might have between us regarding the Website.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                        <span className="w-1 h-6 bg-emerald-600 rounded-full" aria-hidden="true"></span>
                        8. Changes
                    </h2>
                    <p className="text-slate-700 leading-relaxed">
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                    </p>
                    <p className="text-slate-700 leading-relaxed mt-4">
                        By continuing to access or use our Website after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Website.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                        <span className="w-1 h-6 bg-emerald-600 rounded-full" aria-hidden="true"></span>
                        9. Contact Us
                    </h2>
                    <p className="text-slate-700 leading-relaxed">
                        If you have any questions about these Terms, please contact us at{' '}
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
                    If you have any questions about these terms or how to use our site, we're here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/faq"
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-md transition"
                    >
                        View FAQ
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

export default TermsAndConditions;
