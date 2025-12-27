/**
 * Reporting Funnel Page
 * Shows conversion funnel metrics
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeft,
    Download,
    LogOut,
    ExternalLink,
    Eye,
    PlayCircle,
    CheckCircle,
    Search,
    MousePointerClick,
    ArrowDown,
} from 'lucide-react';
import { useReportingAuth } from '../../context/ReportingAuthContext';

const API_BASE = '/.netlify/functions/admin-api';

export default function ReportingFunnel() {
    const navigate = useNavigate();
    const { isAuthenticated, loading: authLoading, logout, fetchWithAuth } = useReportingAuth();

    const [funnel, setFunnel] = useState(null);
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [partnerFilter, setPartnerFilter] = useState('');

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated && !authLoading) {
            navigate('/reporting/login');
        }
    }, [isAuthenticated, authLoading, navigate]);

    // Load partners list
    useEffect(() => {
        async function loadPartners() {
            try {
                const response = await fetchWithAuth(`${API_BASE}/partners`);
                if (response.ok) {
                    const data = await response.json();
                    setPartners(data.filter(p => p !== '(none)'));
                }
            } catch (err) {
                console.error('Error loading partners:', err);
            }
        }

        if (isAuthenticated) {
            loadPartners();
        }
    }, [isAuthenticated, fetchWithAuth]);

    // Load funnel data
    useEffect(() => {
        async function loadFunnel() {
            try {
                setLoading(true);
                const params = new URLSearchParams();
                if (dateRange.start) params.set('start', dateRange.start);
                if (dateRange.end) params.set('end', dateRange.end);
                if (partnerFilter) params.set('partner', partnerFilter);

                const response = await fetchWithAuth(`${API_BASE}/funnel?${params}`);
                if (!response.ok) {
                    throw new Error('Failed to load funnel data');
                }
                const data = await response.json();
                setFunnel(data);
            } catch (err) {
                console.error('Error loading funnel:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        if (isAuthenticated) {
            loadFunnel();
        }
    }, [isAuthenticated, fetchWithAuth, dateRange, partnerFilter]);

    const handleLogout = () => {
        logout();
        navigate('/reporting/login');
    };

    if (authLoading || !isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
        );
    }

    const funnelSteps = funnel ? [
        {
            label: 'Page Views',
            value: funnel.pageViews,
            rate: 100,
            icon: Eye,
            color: 'bg-blue-500',
        },
        {
            label: 'Quiz Starts',
            value: funnel.quizStarts,
            rate: funnel.quizStartRate,
            icon: PlayCircle,
            color: 'bg-purple-500',
        },
        {
            label: 'Quiz Completes',
            value: funnel.quizCompletes,
            rate: funnel.quizCompleteRate,
            icon: CheckCircle,
            color: 'bg-green-500',
            rateLabel: 'of starts',
        },
        {
            label: 'Med Searches',
            value: funnel.medSearches,
            rate: funnel.medSearchRate,
            icon: Search,
            color: 'bg-orange-500',
            rateLabel: 'of completes',
        },
        {
            label: 'Application Clicks',
            value: funnel.applicationClicks,
            rate: funnel.applicationClickRate,
            icon: MousePointerClick,
            color: 'bg-red-500',
            rateLabel: 'of searches',
        },
    ] : [];

    const maxValue = funnel ? funnel.pageViews : 1;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center gap-3">
                            <Link to="/reporting" className="text-gray-400 hover:text-gray-600">
                                <ArrowLeft className="h-6 w-6" />
                            </Link>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Conversion Funnel</h1>
                                <p className="text-sm text-gray-500">View user flow metrics</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link
                                to="/"
                                className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                            >
                                <ExternalLink className="h-4 w-4" />
                                View Site
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                    <div className="flex flex-wrap items-end gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Partner
                            </label>
                            <select
                                value={partnerFilter}
                                onChange={(e) => setPartnerFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Partners</option>
                                {partners.map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={dateRange.start}
                                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Date
                            </label>
                            <input
                                type="date"
                                value={dateRange.end}
                                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <button
                            onClick={() => {
                                setDateRange({ start: '', end: '' });
                                setPartnerFilter('');
                            }}
                            className="px-4 py-2 text-gray-600 hover:text-gray-900"
                        >
                            Clear
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                        {error}
                    </div>
                )}

                {/* Funnel Visualization */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    {loading ? (
                        <div className="py-12 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {funnelSteps.map((step, index) => {
                                const widthPercent = maxValue > 0 ? (step.value / maxValue) * 100 : 0;
                                const IconComponent = step.icon;

                                return (
                                    <div key={step.label}>
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className={`p-2 rounded-lg ${step.color} text-white`}>
                                                <IconComponent className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-baseline justify-between mb-1">
                                                    <span className="font-medium text-gray-900">{step.label}</span>
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-2xl font-bold text-gray-900">
                                                            {step.value.toLocaleString()}
                                                        </span>
                                                        {index > 0 && (
                                                            <span className="text-sm text-gray-500">
                                                                ({step.rate}% {step.rateLabel || 'of total'})
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${step.color} transition-all duration-500`}
                                                        style={{ width: `${Math.max(widthPercent, 1)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        {index < funnelSteps.length - 1 && (
                                            <div className="flex justify-center py-2">
                                                <ArrowDown className="h-5 w-5 text-gray-300" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Conversion Summary */}
                {funnel && !loading && (
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
                            <p className="text-3xl font-bold text-blue-600">{funnel.quizStartRate}%</p>
                            <p className="text-sm text-gray-500 mt-1">Quiz Start Rate</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
                            <p className="text-3xl font-bold text-purple-600">{funnel.quizCompleteRate}%</p>
                            <p className="text-sm text-gray-500 mt-1">Quiz Completion</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
                            <p className="text-3xl font-bold text-orange-600">{funnel.medSearchRate}%</p>
                            <p className="text-sm text-gray-500 mt-1">Search Rate</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
                            <p className="text-3xl font-bold text-green-600">{funnel.applicationClickRate}%</p>
                            <p className="text-sm text-gray-500 mt-1">Click Rate</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
