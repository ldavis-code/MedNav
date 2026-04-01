import { ShieldAlert, Mail, Building2 } from 'lucide-react';

/**
 * NotLicensed - Displayed when an EHR launch originates from an unlicensed health system.
 */
const NotLicensed = () => {
  return (
    <div className="max-w-lg mx-auto py-16 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert size={32} className="text-amber-600" aria-hidden="true" />
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 mb-4">
          Health System Not Activated
        </h1>

        <p className="text-slate-600 mb-6 leading-relaxed">
          Your health system hasn&apos;t activated Medication Navigator yet. Contact us to get your organization set up — it takes less than a week and integrates directly into Epic.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-blue-700 text-sm">
            <Building2 size={16} aria-hidden="true" />
            <span className="font-semibold">FHIR R4 compliant, zero PHI stored</span>
          </div>
        </div>

        <a
          href="mailto:info@medicationnavigator.com?subject=Health%20System%20Activation%20Request"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-md transition"
        >
          <Mail size={18} aria-hidden="true" />
          Contact Us to Get Started
        </a>

        <p className="text-sm text-slate-500 mt-6">
          If your organization has already activated, your Epic system administrator may need to complete the connection setup.
        </p>
      </div>
    </div>
  );
};

export default NotLicensed;
