/**
 * Reporting Admin Login Page
 * Simple password-based login for analytics dashboard
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BarChart3, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useReportingAuth } from '../../context/ReportingAuthContext';

export default function ReportingLogin() {
    const navigate = useNavigate();
    const { login, isAuthenticated, loading: authLoading } = useReportingAuth();

    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated && !authLoading) {
            navigate('/reporting');
        }
    }, [isAuthenticated, authLoading, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        const result = await login(password);

        if (result.success) {
            navigate('/reporting');
        } else {
            setError(result.error || 'Login failed. Please check the password.');
        }

        setSubmitting(false);
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                        <BarChart3 className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
                    <p className="text-slate-400 mt-1">
                        Medication Navigator
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-xl shadow-2xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Admin Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoFocus
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter admin password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={submitting || !password}
                            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                                    Signing in...
                                </>
                            ) : (
                                'Access Dashboard'
                            )}
                        </button>
                    </form>

                    {/* Links */}
                    <div className="mt-6 text-center text-sm text-gray-600">
                        <Link to="/" className="text-blue-600 hover:underline">
                            Back to main site
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-slate-500 mt-6">
                    Partner analytics and reporting dashboard
                </p>
            </div>
        </div>
    );
}
