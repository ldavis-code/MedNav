import { useState } from 'react';
import { Loader2, ShieldCheck, AlertCircle, Zap, ChevronDown, Search } from 'lucide-react';

/**
 * Known Epic health systems with their FHIR R4 endpoints.
 * Patients select their health system, and we use that system's FHIR endpoint
 * for the OAuth2 flow. The Epic sandbox is included for testing.
 */
const HEALTH_SYSTEMS = [
  { id: 'epic-sandbox', name: 'Epic Sandbox (Test Patients)', fhirBaseUrl: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4' },
  { id: 'mychart', name: 'MyChart (Epic)', fhirBaseUrl: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4' },
  // Major health systems
  { id: 'mayo-clinic', name: 'Mayo Clinic', fhirBaseUrl: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4' },
  { id: 'cleveland-clinic', name: 'Cleveland Clinic', fhirBaseUrl: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4' },
  { id: 'johns-hopkins', name: 'Johns Hopkins', fhirBaseUrl: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4' },
  { id: 'ucsf', name: 'UCSF Health', fhirBaseUrl: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4' },
  { id: 'duke', name: 'Duke Health', fhirBaseUrl: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4' },
  { id: 'upmc', name: 'UPMC', fhirBaseUrl: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4' },
  { id: 'mass-general', name: 'Mass General Brigham', fhirBaseUrl: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4' },
  { id: 'cedars-sinai', name: 'Cedars-Sinai', fhirBaseUrl: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4' },
  { id: 'northwestern', name: 'Northwestern Medicine', fhirBaseUrl: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4' },
  { id: 'emory', name: 'Emory Healthcare', fhirBaseUrl: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4' },
];

/**
 * EpicConnectButton - Shared button that initiates Epic FHIR OAuth2 PKCE flow.
 * Includes a health system selector so patients from any Epic-connected hospital
 * can import their medications.
 *
 * @param {function} onMedicationsImported - Called with (matchedIds[], unmatchedNames[])
 * @param {string} className - Optional additional CSS classes
 */
const EpicConnectButton = ({ onMedicationsImported, className = '' }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSystem, setSelectedSystem] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Check on mount/render if medications were imported via callback
  const checkForImportedMeds = () => {
    try {
      const stored = sessionStorage.getItem('epic_imported_meds');
      if (stored) {
        const data = JSON.parse(stored);
        sessionStorage.removeItem('epic_imported_meds');
        if (data.matched && data.matched.length > 0 && onMedicationsImported) {
          onMedicationsImported(data.matched, data.unmatched || []);
        }
        return data;
      }
    } catch {
      // ignore parse errors
    }
    return null;
  };

  const importedData = checkForImportedMeds();

  const filteredSystems = HEALTH_SYSTEMS.filter(sys =>
    sys.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedSystemData = HEALTH_SYSTEMS.find(s => s.id === selectedSystem);

  const handleConnect = async () => {
    if (!selectedSystem) {
      setError('Please select your health system first.');
      return;
    }

    setLoading(true);
    setError(null);

    const system = HEALTH_SYSTEMS.find(s => s.id === selectedSystem);
    if (!system) {
      setError('Invalid health system selection.');
      setLoading(false);
      return;
    }

    try {
      // Pre-flight: verify Epic configuration
      try {
        const configRes = await fetch('/api/epic-config-check');
        if (configRes.ok) {
          const configData = await configRes.json();
          if (configData.status === 'ISSUES_FOUND' && configData.issues?.length > 0) {
            const critical = configData.issues.filter(i =>
              i.includes('is not set') || i.includes('does not start with https')
            );
            if (critical.length > 0) {
              setError('Epic integration is not configured correctly: ' + critical[0]);
              setLoading(false);
              return;
            }
          }
        }
      } catch {
        // Don't block on config check failure
      }

      // Get auth URL with selected health system's FHIR base URL
      const response = await fetch('/api/epic-auth-url?fhir_base_url=' + encodeURIComponent(system.fhirBaseUrl));
      const data = await response.json();

      if (!response.ok || !data.url) {
        setError(data.error || 'Could not connect to your health system. Please try again.');
        setLoading(false);
        return;
      }

      // Store PKCE values and session data
      sessionStorage.setItem('epic_pkce_code_verifier', data.code_verifier);
      sessionStorage.setItem('epic_oauth_state', data.state);
      if (data.token_endpoint) {
        sessionStorage.setItem('epic_token_endpoint', data.token_endpoint);
      }
      sessionStorage.setItem('epic_fhir_base_url', data.fhir_base_url || system.fhirBaseUrl);
      sessionStorage.setItem('epic_return_path', window.location.pathname + window.location.search);

      // Redirect to Epic authorization
      window.location.href = data.url;
    } catch {
      setError('Could not connect to your health system. Please check your connection and try again.');
      setLoading(false);
    }
  };

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 ${className}`}>
      <div className="flex items-start gap-4">
        <div className="bg-blue-600 text-white p-2.5 rounded-lg flex-shrink-0">
          <Zap size={22} aria-hidden="true" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-blue-900 mb-1">
            Connect to My Health System
          </h3>
          <p className="text-blue-700 text-sm mb-3">
            Securely connect to your health system to automatically import your current medications. This saves time and helps us find the right assistance programs for you.
          </p>

          {error && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2" role="alert">
              <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {importedData && importedData.matched && importedData.matched.length > 0 && (
            <div className="mb-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg" role="status">
              <div className="flex items-start gap-2">
                <ShieldCheck size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div className="text-sm">
                  <p className="text-emerald-700">
                    Imported {importedData.matched.length} medication{importedData.matched.length !== 1 ? 's' : ''} from your health system.
                    {importedData.unmatched && importedData.unmatched.length > 0 && (
                      <span className="block mt-1 text-slate-600">
                        {importedData.unmatched.length} medication{importedData.unmatched.length !== 1 ? 's' : ''} not in our database were skipped.
                      </span>
                    )}
                  </p>
                  {importedData.assistancePrograms && importedData.assistancePrograms.length > 0 && (
                    <p className="text-blue-700 mt-2 font-medium">
                      {importedData.assistancePrograms.length} assistance program{importedData.assistancePrograms.length !== 1 ? 's' : ''} found for your medications.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Health System Selector */}
          <div className="mb-3 relative">
            <label htmlFor="health-system-search" className="block text-sm font-semibold text-blue-900 mb-1.5">
              Select Your Health System
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-slate-400" aria-hidden="true" />
              </div>
              <input
                id="health-system-search"
                type="text"
                placeholder="Search for your hospital or health system..."
                value={showDropdown ? searchTerm : (selectedSystemData?.name || searchTerm)}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSelectedSystem('');
                  setShowDropdown(true);
                }}
                onFocus={() => {
                  setShowDropdown(true);
                  if (selectedSystemData) setSearchTerm('');
                }}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                className="w-full pl-9 pr-8 py-2.5 border border-blue-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoComplete="off"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown size={16} className="text-slate-400" aria-hidden="true" />
              </div>
            </div>

            {showDropdown && (
              <ul className="absolute z-10 w-full mt-1 bg-white border border-blue-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredSystems.length === 0 ? (
                  <li className="px-4 py-3 text-sm text-slate-500">
                    No matching health systems found. Contact us to add yours.
                  </li>
                ) : (
                  filteredSystems.map(sys => (
                    <li key={sys.id}>
                      <button
                        type="button"
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors ${
                          selectedSystem === sys.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700'
                        }`}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setSelectedSystem(sys.id);
                          setSearchTerm('');
                          setShowDropdown(false);
                          setError(null);
                        }}
                      >
                        {sys.name}
                        {sys.id === 'epic-sandbox' && (
                          <span className="ml-2 text-xs text-amber-600 font-normal">(Testing Only)</span>
                        )}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>

          <button
            onClick={handleConnect}
            disabled={loading || !selectedSystem}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            aria-label="Connect to your health system to import your medications"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                Connecting...
              </>
            ) : (
              <>
                <ShieldCheck size={18} aria-hidden="true" />
                Connect to My Health System
              </>
            )}
          </button>

          <p className="text-xs text-blue-600 mt-2">
            Your data is transmitted securely using PKCE. We do not store your login credentials.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EpicConnectButton;
