import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle, AlertCircle, ShieldCheck, ArrowLeft } from 'lucide-react';

/**
 * EpicCallback - Handles OAuth2 PKCE callbacks from Epic health systems.
 * Exchanges authorization code for access token, then fetches medications.
 */
const EpicCallback = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('Connecting to your health system...');
  const [importResult, setImportResult] = useState(null);
  const [errorDetail, setErrorDetail] = useState(null);

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      // Handle OAuth errors
      if (error) {
        const errorDesc = searchParams.get('error_description') || '';
        let userMessage = 'Authorization was not completed.';

        if (error === 'access_denied') {
          userMessage = 'You declined to share your medication data. No data was imported.';
        } else if (error === 'invalid_client') {
          userMessage = 'The app is not configured correctly for your health system. Please contact support.';
        } else if (error === 'invalid_scope') {
          userMessage = 'Your health system does not support the required permissions for medication import.';
        } else if (errorDesc) {
          userMessage = errorDesc;
        }

        setStatus('error');
        setMessage(userMessage);
        setErrorDetail(error);
        return;
      }

      if (!code) {
        setStatus('error');
        setMessage('No authorization code received. Please try again.');
        return;
      }

      // Validate CSRF state
      const storedState = sessionStorage.getItem('epic_oauth_state');
      if (state !== storedState) {
        setStatus('error');
        setMessage('Security check failed. The authorization state does not match. Please try again.');
        return;
      }

      try {
        // Step 1: Exchange code for token
        setMessage('Exchanging authorization code...');
        const codeVerifier = sessionStorage.getItem('epic_pkce_code_verifier');
        const tokenEndpoint = sessionStorage.getItem('epic_token_endpoint');
        const fhirBaseUrl = sessionStorage.getItem('epic_fhir_base_url');

        const tokenResponse = await fetch('/api/epic-token-exchange', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code,
            code_verifier: codeVerifier,
            token_endpoint: tokenEndpoint,
          }),
        });

        if (!tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          if (tokenResponse.status === 403) {
            throw new Error('Your health system did not grant medication read permissions. Please contact your health system IT department.');
          }
          throw new Error(tokenData.error || 'Token exchange failed');
        }

        const tokenData = await tokenResponse.json();

        // Step 2: Fetch medications
        setMessage('Importing your medications...');
        const medsResponse = await fetch('/api/epic-medications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_token: tokenData.access_token,
            fhir_base_url: fhirBaseUrl,
            patient_id: tokenData.patient,
          }),
        });

        if (!medsResponse.ok) {
          throw new Error('Failed to retrieve medications from your health system');
        }

        const medsData = await medsResponse.json();

        // Store results for the originating page
        sessionStorage.setItem('epic_imported_meds', JSON.stringify(medsData));

        // Clean up PKCE session data
        sessionStorage.removeItem('epic_pkce_code_verifier');
        sessionStorage.removeItem('epic_oauth_state');
        sessionStorage.removeItem('epic_token_endpoint');
        sessionStorage.removeItem('epic_fhir_base_url');

        setImportResult(medsData);
        setStatus('success');
        setMessage(`Successfully imported ${medsData.matched?.length || 0} medication${(medsData.matched?.length || 0) !== 1 ? 's' : ''}.`);
      } catch (err) {
        console.error('Epic callback error:', err);
        setStatus('error');
        setMessage(err.message || 'An unexpected error occurred. Please try again.');
      }
    };

    processCallback();
  }, [searchParams]);

  const returnPath = sessionStorage.getItem('epic_return_path') || '/my-medications';

  return (
    <div className="max-w-lg mx-auto py-16 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        {status === 'processing' && (
          <>
            <Loader2 size={48} className="animate-spin text-blue-600 mx-auto mb-4" aria-hidden="true" />
            <h1 className="text-xl font-bold text-slate-900 mb-2">Connecting...</h1>
            <p className="text-slate-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle size={48} className="text-emerald-500 mx-auto mb-4" aria-hidden="true" />
            <h1 className="text-xl font-bold text-slate-900 mb-2">Medications Imported</h1>
            <p className="text-slate-600 mb-4">{message}</p>

            {importResult?.unmatched?.length > 0 && (
              <p className="text-sm text-slate-500 mb-4">
                {importResult.unmatched.length} medication{importResult.unmatched.length !== 1 ? 's' : ''} were not found in our database and were skipped.
              </p>
            )}

            {importResult?.assistancePrograms?.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-blue-700 text-sm font-medium">
                  {importResult.assistancePrograms.length} assistance program{importResult.assistancePrograms.length !== 1 ? 's' : ''} found for your medications!
                </p>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 mb-6 text-sm text-emerald-600">
              <ShieldCheck size={16} aria-hidden="true" />
              Your health system credentials were handled securely. We only received your medication list.
            </div>

            <Link
              to={returnPath}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition"
            >
              <ArrowLeft size={18} aria-hidden="true" />
              Continue
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle size={48} className="text-red-500 mx-auto mb-4" aria-hidden="true" />
            <h1 className="text-xl font-bold text-slate-900 mb-2">Connection Issue</h1>
            <p className="text-slate-600 mb-4">{message}</p>
            {errorDetail && (
              <p className="text-xs text-slate-400 mb-4">Error code: {errorDetail}</p>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to={returnPath}
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition"
              >
                <ArrowLeft size={18} aria-hidden="true" />
                Go Back & Try Again
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EpicCallback;
