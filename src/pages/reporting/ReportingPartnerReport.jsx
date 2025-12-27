/**
 * Reporting Partner Report Page
 * 90-day pilot report for a specific partner
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Download,
    LogOut,
    ExternalLink,
    Building2,
    Calendar,
    TrendingUp,
    Eye,
    PlayCircle,
    CheckCircle,
    Search,
    MousePointerClick,
    CreditCard,
    Heart,
    Pill,
    BarChart3,
    FileText,
} from 'lucide-react';
import { useReportingAuth } from '../../context/ReportingAuthContext';

const API_BASE = '/.netlify/functions/admin-api';

export default function ReportingPartnerReport() {
    const navigate = useNavigate();
    const { partner } = useParams();
    const { isAuthenticated, loading: authLoading, logout, fetchWithAuth } = useReportingAuth();

    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated && !authLoading) {
            navigate('/reporting/login');
        }
    }, [isAuthenticated, authLoading, navigate]);

    // Load report data
    useEffect(() => {
        async function loadReport() {
            try {
                setLoading(true);
                const params = new URLSearchParams();
                if (dateRange.start) params.set('start', dateRange.start);
                if (dateRange.end) params.set('end', dateRange.end);

                const response = await fetchWithAuth(`${API_BASE}/report/${partner}?${params}`);
                if (!response.ok) {
                    throw new Error('Failed to load report');
                }
                const data = await response.json();
                setReport(data);
            } catch (err) {
                console.error('Error loading report:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        if (isAuthenticated && partner) {
            loadReport();
        }
    }, [isAuthenticated, fetchWithAuth, partner, dateRange]);

    const handleExportCsv = async () => {
        try {
            const params = new URLSearchParams();
            params.set('partner', partner);
            if (dateRange.start) params.set('start', dateRange.start);
            if (dateRange.end) params.set('end', dateRange.end);

            const response = await fetchWithAuth(`${API_BASE}/export/csv?${params}`);
            if (!response.ok) {
                throw new Error('Export failed');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `partner_report_${partner}_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        } catch (err) {
            console.error('Export error:', err);
            setError('Failed to export CSV');
        }
    };

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

    const programTypeConfig = {
        copay: { icon: CreditCard, color: 'bg-blue-100 text-blue-600', label: 'Copay' },
        foundation: { icon: Heart, color: 'bg-pink-100 text-pink-600', label: 'Foundation' },
        pap: { icon: Pill, color: 'bg-green-100 text-green-600', label: 'PAP' },
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center gap-3">
                            <Link to="/reporting/partners" className="text-gray-400 hover:text-gray-600">
                                <ArrowLeft className="h-6 w-6" />
                            </Link>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Partner Report</h1>
                                <p className="text-sm text-gray-500">Pilot performance for {partner}</p>
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

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Date Range Filter */}
                <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                    <div className="flex flex-wrap items-end gap-4">
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
                            onClick={() => setDateRange({ start: '', end: '' })}
                            className="px-4 py-2 text-gray-600 hover:text-gray-900"
                        >
                            Reset to 90 days
                        </button>
                        <div className="flex-1" />
                        <button
                            onClick={handleExportCsv}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            <Download className="h-4 w-4" />
                            Export CSV
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="py-12 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
                    </div>
                ) : report ? (
                    <>
                        {/* Report Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 mb-6 text-white">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/20 rounded-lg">
                                    <Building2 className="h-8 w-8" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{report.partner}</h2>
                                    <p className="text-blue-100 flex items-center gap-2 mt-1">
                                        <Calendar className="h-4 w-4" />
                                        {report.reportPeriod.start} to {report.reportPeriod.end}
                                        ({report.reportPeriod.days} days)
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Summary Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                            <div className="bg-white rounded-lg shadow-sm border p-4">
                                <div className="flex items-center gap-2 text-gray-500 mb-2">
                                    <Eye className="h-4 w-4" />
                                    <span className="text-sm">Page Views</span>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {report.summary.pageViews.toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm border p-4">
                                <div className="flex items-center gap-2 text-gray-500 mb-2">
                                    <PlayCircle className="h-4 w-4" />
                                    <span className="text-sm">Quiz Starts</span>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {report.summary.quizStarts.toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm border p-4">
                                <div className="flex items-center gap-2 text-gray-500 mb-2">
                                    <CheckCircle className="h-4 w-4" />
                                    <span className="text-sm">Quiz Completes</span>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {report.summary.quizCompletes.toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm border p-4">
                                <div className="flex items-center gap-2 text-gray-500 mb-2">
                                    <Search className="h-4 w-4" />
                                    <span className="text-sm">Med Searches</span>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {report.summary.medSearches.toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm border p-4">
                                <div className="flex items-center gap-2 text-gray-500 mb-2">
                                    <MousePointerClick className="h-4 w-4" />
                                    <span className="text-sm">App Clicks</span>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {report.summary.applicationClicks.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {/* Clicks by Type & Conversion Rates */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            {/* Clicks by Type */}
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <h3 className="font-semibold text-gray-900 mb-4">Application Clicks by Type</h3>
                                <div className="space-y-4">
                                    {Object.entries(report.clicksByType).map(([type, count]) => {
                                        const config = programTypeConfig[type];
                                        const IconComponent = config?.icon || FileText;
                                        const total = report.clicksByType.copay + report.clicksByType.foundation + report.clicksByType.pap;
                                        const percent = total > 0 ? Math.round((count / total) * 100) : 0;

                                        return (
                                            <div key={type}>
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`p-1.5 rounded ${config?.color || 'bg-gray-100 text-gray-600'}`}>
                                                            <IconComponent className="h-4 w-4" />
                                                        </div>
                                                        <span className="text-gray-700 capitalize">{config?.label || type}</span>
                                                    </div>
                                                    <span className="font-semibold text-gray-900">
                                                        {count.toLocaleString()} ({percent}%)
                                                    </span>
                                                </div>
                                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${type === 'copay' ? 'bg-blue-500' : type === 'foundation' ? 'bg-pink-500' : 'bg-green-500'}`}
                                                        style={{ width: `${percent}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Conversion Rates */}
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <h3 className="font-semibold text-gray-900 mb-4">Conversion Rates</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                                        <p className="text-3xl font-bold text-blue-600">
                                            {report.conversionRates.quizStartRate}%
                                        </p>
                                        <p className="text-sm text-blue-700 mt-1">Quiz Start Rate</p>
                                    </div>
                                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                                        <p className="text-3xl font-bold text-purple-600">
                                            {report.conversionRates.quizCompleteRate}%
                                        </p>
                                        <p className="text-sm text-purple-700 mt-1">Quiz Completion</p>
                                    </div>
                                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                                        <p className="text-3xl font-bold text-orange-600">
                                            {report.conversionRates.medSearchRate}%
                                        </p>
                                        <p className="text-sm text-orange-700 mt-1">Search Rate</p>
                                    </div>
                                    <div className="text-center p-4 bg-green-50 rounded-lg">
                                        <p className="text-3xl font-bold text-green-600">
                                            {report.conversionRates.applicationClickRate}%
                                        </p>
                                        <p className="text-sm text-green-700 mt-1">Click Rate</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Top Programs */}
                        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Top 5 Programs</h3>
                            {report.topPrograms.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No program clicks recorded</p>
                            ) : (
                                <div className="space-y-3">
                                    {report.topPrograms.map((program, index) => {
                                        const config = programTypeConfig[program.programType];
                                        const IconComponent = config?.icon || FileText;
                                        const maxClicks = report.topPrograms[0]?.clicks || 1;
                                        const widthPercent = (program.clicks / maxClicks) * 100;

                                        return (
                                            <div key={program.programId} className="flex items-center gap-4">
                                                <div className="w-8 text-center">
                                                    <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                                                </div>
                                                <div className={`p-2 rounded-lg ${config?.color || 'bg-gray-100 text-gray-600'}`}>
                                                    <IconComponent className="h-5 w-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="font-medium text-gray-900">{program.programId}</span>
                                                        <span className="text-gray-600">{program.clicks} clicks</span>
                                                    </div>
                                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-blue-500"
                                                            style={{ width: `${widthPercent}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Weekly Trend */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-gray-400" />
                                Week-over-Week Trend
                            </h3>
                            {report.weeklyTrend.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No trend data available</p>
                            ) : (
                                <div className="space-y-3">
                                    {report.weeklyTrend.map((week, index) => {
                                        const weekDate = new Date(week.week);
                                        const maxEvents = Math.max(...report.weeklyTrend.map(w => w.events)) || 1;
                                        const widthPercent = (week.events / maxEvents) * 100;

                                        return (
                                            <div key={week.week} className="flex items-center gap-4">
                                                <div className="w-24 text-sm text-gray-600">
                                                    {weekDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-sm text-gray-600">
                                                            {week.events} events / {week.clicks} clicks
                                                        </span>
                                                    </div>
                                                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
                                                        <div
                                                            className="h-full bg-blue-200"
                                                            style={{ width: `${widthPercent}%` }}
                                                        />
                                                        <div
                                                            className="h-full bg-blue-600 -ml-1"
                                                            style={{ width: `${(week.clicks / maxEvents) * 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </>
                ) : null}
            </main>
        </div>
    );
}
