import { Link } from 'react-router-dom';
import { Accessibility as AccessibilityIcon, Mail, Shield, CheckCircle, AlertTriangle, Monitor, Smartphone, Eye } from 'lucide-react';
import { useMetaTags } from '../hooks/useMetaTags.js';
import { seoMetadata } from '../data/seo-metadata.js';

const Accessibility = () => {
  useMetaTags(seoMetadata.accessibility || seoMetadata.home);

  return (
    <article className="max-w-4xl mx-auto space-y-8 pb-12">
      <header className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
          <AccessibilityIcon size={32} className="text-emerald-700" aria-hidden="true" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
          Accessibility &amp; Section 504 Compliance
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          MedNav LLC is committed to ensuring that Medication Navigator&trade; is accessible to all users,
          including people with disabilities.
        </p>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-8">
        {/* Section 504 Notice */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <span className="w-1 h-6 bg-emerald-600 rounded-full" aria-hidden="true"></span>
            Section 504 Non-Discrimination Notice
          </h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-slate-700 leading-relaxed">
              In accordance with Section 504 of the Rehabilitation Act of 1973, MedNav LLC does not
              discriminate on the basis of disability in admission to, access to, or operations of its programs,
              services, or activities. MedNav LLC does not discriminate on the basis of disability in its hiring
              or employment practices.
            </p>
          </div>
          <p className="text-slate-700 leading-relaxed">
            This notice is provided as required by Title II of the Americans with Disabilities Act of 1990 and
            Section 504 of the Rehabilitation Act of 1973, as amended, and their implementing regulations, and
            the U.S. Department of Health and Human Services (HHS) regulations at 45 CFR Part 84.
          </p>
        </section>

        {/* Commitment */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <span className="w-1 h-6 bg-emerald-600 rounded-full" aria-hidden="true"></span>
            Our Commitment
          </h2>
          <p className="text-slate-700 leading-relaxed">
            We believe that all patients deserve equal access to medication assistance resources.
            Medication Navigator&trade; is designed and developed with accessibility as a core principle,
            targeting conformance with the{' '}
            <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong> standard.
          </p>
          <p className="text-slate-700 leading-relaxed mt-4">
            Our goal is to ensure that every feature of this educational resource is usable by people with
            visual, auditory, motor, and cognitive disabilities.
          </p>
        </section>

        {/* Conformance Status */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <span className="w-1 h-6 bg-emerald-600 rounded-full" aria-hidden="true"></span>
            Conformance Status
          </h2>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield size={24} className="text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-semibold text-emerald-900">Partially Conformant</p>
                <p className="text-emerald-800 text-sm mt-1">
                  Medication Navigator&trade; is partially conformant with WCAG 2.1 Level AA. &quot;Partially
                  conformant&quot; means that some parts of the content do not fully conform to the accessibility
                  standard. We are actively working toward full conformance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Accessibility Features */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <span className="w-1 h-6 bg-emerald-600 rounded-full" aria-hidden="true"></span>
            Accessibility Features
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            We have implemented the following accessibility features:
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: Monitor, text: 'Full keyboard navigation for all interactive elements' },
              { icon: Eye, text: 'Screen reader compatibility with ARIA labels and roles' },
              { icon: Monitor, text: 'High contrast support and forced colors mode' },
              { icon: Smartphone, text: 'Minimum 44×44 pixel touch targets' },
              { icon: Eye, text: 'Focus indicators visible on all interactive elements' },
              { icon: Monitor, text: 'Skip navigation links' },
              { icon: Eye, text: 'Route change announcements for screen readers' },
              { icon: Monitor, text: 'Reduced motion support (prefers-reduced-motion)' },
              { icon: Eye, text: 'Read Aloud feature using Web Speech API' },
              { icon: Smartphone, text: 'Responsive design for all device sizes' },
              { icon: Eye, text: 'Plain language content (5th–7th grade reading level)' },
              { icon: Monitor, text: 'Simple View toggle for enhanced readability' },
              { icon: Eye, text: 'Color is never the sole means of conveying information' },
              { icon: Monitor, text: 'Form inputs with associated labels and error messages' },
              { icon: Eye, text: 'Glossary tooltips for medical and insurance terms' },
            ].map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg">
                <CheckCircle size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-sm text-slate-700">{text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Details */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <span className="w-1 h-6 bg-emerald-600 rounded-full" aria-hidden="true"></span>
            Technical Implementation
          </h2>
          <ul className="space-y-2 text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 mt-1" aria-hidden="true" />
              Semantic HTML5 elements (nav, main, article, section, header, footer)
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 mt-1" aria-hidden="true" />
              ARIA landmarks, roles, and properties where semantic HTML is insufficient
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 mt-1" aria-hidden="true" />
              aria-live regions for dynamic content updates
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 mt-1" aria-hidden="true" />
              Focus management for modals, dialogs, and single-page navigation
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 mt-1" aria-hidden="true" />
              Logical heading hierarchy (h1–h6)
            </li>
          </ul>
        </section>

        {/* Compatibility */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <span className="w-1 h-6 bg-emerald-600 rounded-full" aria-hidden="true"></span>
            Compatibility
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Medication Navigator&trade; is designed to be compatible with the following assistive technologies:
          </p>
          <ul className="space-y-2 text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 mt-1" aria-hidden="true" />
              NVDA and JAWS screen readers on Windows
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 mt-1" aria-hidden="true" />
              VoiceOver on macOS and iOS
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 mt-1" aria-hidden="true" />
              TalkBack on Android
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 mt-1" aria-hidden="true" />
              Voice control and switch access devices
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 mt-1" aria-hidden="true" />
              Browser zoom up to 200% without loss of content
            </li>
          </ul>
        </section>

        {/* Known Limitations */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <span className="w-1 h-6 bg-emerald-600 rounded-full" aria-hidden="true"></span>
            Known Limitations
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Despite our best efforts, some areas may have limitations:
          </p>
          <div className="space-y-3">
            {[
              {
                title: 'Infographic Descriptions',
                desc: 'Some complex infographics may have simplified alternative text. We are working to provide more detailed descriptions.',
              },
              {
                title: 'Third-Party Content',
                desc: 'Links to external websites (manufacturer programs, foundations) may not meet the same accessibility standards.',
              },
              {
                title: 'AI Chat Feature',
                desc: 'The AI-powered medication assistant may not fully support all screen readers in real-time conversation mode.',
              },
            ].map(({ title, desc }, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{title}</p>
                  <p className="text-sm text-slate-600">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testing */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <span className="w-1 h-6 bg-emerald-600 rounded-full" aria-hidden="true"></span>
            Testing Methodology
          </h2>
          <p className="text-slate-700 leading-relaxed">
            Accessibility is tested using a combination of automated tools (axe-core, Lighthouse, WAVE) and
            manual testing with screen readers (NVDA, VoiceOver) and keyboard-only navigation. We conduct
            periodic reviews and address issues as they are identified.
          </p>
        </section>

        {/* Section 504 Grievance Procedure */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <span className="w-1 h-6 bg-emerald-600 rounded-full" aria-hidden="true"></span>
            Section 504 Grievance Procedure
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            If you believe you have been discriminated against on the basis of disability in accessing
            Medication Navigator&trade;, you may file a grievance with our Section 504 Coordinator:
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
            <p className="text-slate-700">
              <strong>Section 504 Coordinator</strong>
            </p>
            <p className="text-slate-700">MedNav LLC</p>
            <p className="text-slate-700">
              Email:{' '}
              <a
                href="mailto:504coordinator@medicationnavigator.com"
                className="text-emerald-600 hover:text-emerald-700 underline inline-flex items-center gap-1"
              >
                <Mail size={14} aria-hidden="true" />
                504coordinator@medicationnavigator.com
              </a>
            </p>
          </div>
          <p className="text-slate-700 leading-relaxed mt-4">
            The grievance procedure includes the right to file a complaint with the U.S. Department of Health
            and Human Services, Office for Civil Rights (OCR), if you are not satisfied with the resolution.
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mt-4">
            <p className="text-slate-700 font-semibold mb-1">U.S. Department of Health and Human Services</p>
            <p className="text-slate-700 text-sm">Office for Civil Rights</p>
            <p className="text-slate-700 text-sm">
              Complaint Portal:{' '}
              <a
                href="https://ocrportal.hhs.gov/ocr/portal/lobby.jsf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:text-emerald-700 underline"
              >
                ocrportal.hhs.gov
              </a>
            </p>
            <p className="text-slate-700 text-sm">Phone: 1-800-368-1019 (voice) | 1-800-537-7697 (TDD)</p>
          </div>
        </section>

        {/* Feedback */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <span className="w-1 h-6 bg-emerald-600 rounded-full" aria-hidden="true"></span>
            Feedback &amp; Contact
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            We welcome your feedback on the accessibility of Medication Navigator&trade;. If you encounter
            accessibility barriers or have suggestions for improvement, please contact us:
          </p>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <p className="text-slate-700">
              <a
                href="mailto:info@medicationnavigator.com"
                className="text-emerald-600 hover:text-emerald-700 underline inline-flex items-center gap-1"
              >
                <Mail size={16} aria-hidden="true" />
                info@medicationnavigator.com
              </a>
            </p>
            <p className="text-sm text-slate-600 mt-2">
              We aim to respond to accessibility feedback within 5 business days.
            </p>
          </div>
        </section>
      </div>

      <aside className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 md:p-8 text-center">
        <h2 className="text-xl font-bold text-emerald-900 mb-3">Need Help?</h2>
        <p className="text-emerald-800 mb-6">
          If you need assistance using this website, we&apos;re here to help.
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

export default Accessibility;
