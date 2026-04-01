import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { User, CreditCard, LogOut, Crown, Cloud, CloudOff, Loader2, AlertTriangle, CheckCircle, KeyRound, Trash2 } from 'lucide-react';
import { useSubscriberAuth } from '../context/SubscriberAuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { useDataSync } from '../hooks/useDataSync';
import { useMetaTags } from '../hooks/useMetaTags.js';
import { seoMetadata } from '../data/seo-metadata.js';

const Account = () => {
  useMetaTags(seoMetadata.account || seoMetadata.home);

  const { user, isAuthenticated, isPro, login, register, logout } = useSubscriberAuth();
  const { subscription, isPastDue, openPortal } = useSubscription(user?.email);
  const { migrationNeeded, migrateLocalData, syncing } = useDataSync();

  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authError, setAuthError] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Patient code redemption
  const [codeEmail, setCodeEmail] = useState('');
  const [patientCode, setPatientCode] = useState('');
  const [codeStatus, setCodeStatus] = useState(null);
  const [codeLoading, setCodeLoading] = useState(false);

  // Account deletion
  const [showDelete, setShowDelete] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const handleAuth = useCallback(async (e) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    const result = authMode === 'register'
      ? await register(email, password, name)
      : await login(email, password);

    if (!result.success) {
      setAuthError(result.error);
    }
    setAuthLoading(false);
  }, [authMode, email, password, name, login, register]);

  const handleRedeemCode = useCallback(async (e) => {
    e.preventDefault();
    if (!codeEmail || !patientCode) return;
    setCodeLoading(true);
    setCodeStatus(null);

    try {
      const response = await fetch('/.netlify/functions/redeem-patient-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: codeEmail, code: patientCode }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to redeem code');
      setCodeStatus({ type: 'success', message: 'Code redeemed successfully! Pro features are now unlocked.' });
    } catch (err) {
      setCodeStatus({ type: 'error', message: err.message });
    } finally {
      setCodeLoading(false);
    }
  }, [codeEmail, patientCode]);

  const handleDeleteAccount = useCallback(async () => {
    if (deleteConfirm !== 'DELETE') return;
    try {
      // Clear all local data
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('mednav_') || key?.startsWith('medication_navigator')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      sessionStorage.clear();
      logout();
    } catch {
      // Force logout even on error
      logout();
    }
  }, [deleteConfirm, logout]);

  // Unauthenticated view
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-12 px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={32} className="text-emerald-700" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
              {authMode === 'register' ? 'Create Account' : 'Sign In'}
            </h1>
            <p className="text-slate-600 text-sm">
              Sign in to access your account and sync your data across devices.
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700" role="alert">
              {authError}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === 'register' && (
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1">Name</label>
                <input
                  id="name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Your name"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
              <input
                id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
              <input
                id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit" disabled={authLoading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition disabled:opacity-50"
            >
              {authLoading ? <Loader2 size={20} className="animate-spin mx-auto" /> : authMode === 'register' ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-4">
            {authMode === 'login' ? (
              <>Don&apos;t have an account?{' '}<button onClick={() => setAuthMode('register')} className="text-emerald-600 font-semibold hover:underline">Sign up</button></>
            ) : (
              <>Already have an account?{' '}<button onClick={() => setAuthMode('login')} className="text-emerald-600 font-semibold hover:underline">Sign in</button></>
            )}
          </p>
        </div>

        {/* Patient Code Redemption */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <KeyRound size={20} className="text-emerald-600" aria-hidden="true" />
            <h2 className="font-bold text-slate-900">Have a Patient Code?</h2>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            If your healthcare provider gave you an access code, enter it below to unlock Pro features.
          </p>
          {codeStatus && (
            <div className={`mb-3 p-3 rounded-lg text-sm ${codeStatus.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-red-50 border border-red-200 text-red-700'}`} role="status">
              {codeStatus.message}
            </div>
          )}
          <form onSubmit={handleRedeemCode} className="space-y-3">
            <input type="email" value={codeEmail} onChange={(e) => setCodeEmail(e.target.value)} required placeholder="Your email" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm" />
            <input type="text" value={patientCode} onChange={(e) => setPatientCode(e.target.value)} required placeholder="Access code" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm" />
            <button type="submit" disabled={codeLoading} className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition text-sm disabled:opacity-50">
              {codeLoading ? 'Redeeming...' : 'Redeem Code'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Authenticated view
  return (
    <div className="max-w-2xl mx-auto py-12 px-4 space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User size={32} className="text-emerald-700" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-1">My Account</h1>
        <p className="text-slate-600">{user?.email}</p>
      </div>

      {/* Subscription Status */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Crown size={20} className={isPro ? 'text-amber-500' : 'text-slate-400'} aria-hidden="true" />
            <h2 className="font-bold text-slate-900">Subscription</h2>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${isPro ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
            {isPro ? 'Pro' : 'Free'}
          </span>
        </div>

        {isPastDue && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2" role="alert">
            <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-amber-700 text-sm">Your payment is past due. Please update your payment method to maintain Pro access.</p>
          </div>
        )}

        {isPro ? (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              {subscription?.plan_type === 'yearly' ? 'Yearly Plan ($79.99/year)' : 'Monthly Plan ($8.99/month)'}
            </p>
            <button onClick={openPortal} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-sm transition">
              <CreditCard size={16} aria-hidden="true" />
              Manage Billing
            </button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-slate-600 mb-3">Upgrade to Pro for premium features.</p>
            <Link to="/subscribe" className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-sm transition">
              <Crown size={16} aria-hidden="true" />
              Upgrade to Pro
            </Link>
          </div>
        )}
      </div>

      {/* Data Sync */}
      {migrationNeeded && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <Cloud size={24} className="text-blue-600 flex-shrink-0" aria-hidden="true" />
            <div className="flex-1">
              <h2 className="font-bold text-blue-900 mb-1">Sync Your Data</h2>
              <p className="text-blue-700 text-sm mb-3">
                We found saved data on this device. Would you like to sync it to your account so you can access it anywhere?
              </p>
              <button
                onClick={migrateLocalData} disabled={syncing}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition disabled:opacity-50"
              >
                {syncing ? <><Loader2 size={16} className="animate-spin" /> Syncing...</> : <><CloudOff size={16} /> Sync to Cloud</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sign Out & Delete */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
        <button onClick={logout} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-sm transition">
          <LogOut size={16} aria-hidden="true" />
          Sign Out
        </button>

        <div className="border-t border-slate-100 pt-4">
          {!showDelete ? (
            <button onClick={() => setShowDelete(true)} className="text-sm text-red-600 hover:text-red-700 hover:underline">
              Delete my account
            </button>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-2 mb-3">
                <Trash2 size={16} className="text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-sm text-red-700">This will permanently delete your account and all saved data. Type <strong>DELETE</strong> to confirm.</p>
              </div>
              <input
                type="text" value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)}
                className="w-full px-3 py-2 border border-red-300 rounded-lg text-sm mb-3 focus:ring-2 focus:ring-red-500"
                placeholder="Type DELETE to confirm"
              />
              <div className="flex gap-2">
                <button onClick={handleDeleteAccount} disabled={deleteConfirm !== 'DELETE'} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-sm transition disabled:opacity-50">
                  Delete Account
                </button>
                <button onClick={() => { setShowDelete(false); setDeleteConfirm(''); }} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-sm transition">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
