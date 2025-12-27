/**
 * Reporting Partners Page
 * Shows events aggregated by partner
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    BarChart3,
    Building2,
    ArrowLeft,
    Download,
    Calendar,
    ChevronRight,
    FileText,
    LogOut,
    ExternalLink,
} from 'lucide-react';
import { useReportingAuth } from '../../context/ReportingAuthContext';

const API_BASE = '/.netlify/functions/admin-api';

export default function ReportingPartners() {
    const navigate = useNavigate();
    const { isAuthenticated, loading: authLoading, logout, fetchWithAuth } = useReportingAuth();

    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated && !authLoading) {
            navigate('/reporting/login');
        }
    }, [isAuthenticated, authLoading, navigate]);

    // Load partner data
    useEffect(() => {
        async function loadPartners() {
            try {
                setLoading(true);
                const params = new URLSearchParams();
                if (dateRange.start) params.set('start', dateRange.start);
                if (dateRange.end) params.set('end', dateRange.end);

                const response = await fetchWithAuth(`${API_BASE}/events/by-partner?${params}`);
                if (!response.ok) {
                    throw new Error('Failed to load partner data');
                }
                const data = await response.json();
                setPartners(data);
            } catch (err) {
                console.error('Error loading partners:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        if (isAuthenticated) {
            loadPartners();
        }
    }, [isAuthenticated, fetchWithAuth, dateRange]);

    const handleExportCsv = async () => {
        try {
            const params = new URLSearchParams();
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
            a.download = `events_export_${new Date().toISOString().split('T')[0]}.csv`;
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
                                <h1 className="text-xl font-bold text-gray-900">Events by Partner</h1>
                                <p className="text-sm text-gray-500">View aggregated stats per partner</p>
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

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
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
                            Clear
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

                {/* Partner Table */}
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Partner
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    This Week
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    This Month
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    All Time
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Top Program
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
                                    </td>
                                </tr>
                            ) : partners.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No partner data found
                                    </td>
                                </tr>
                            ) : (
                                partners.map((partner) => (
                                    <tr key={partner.partner} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                                                    <Building2 className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {partner.partner}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900">
                                            {partner.thisWeek.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900">
                                            {partner.thisMonth.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-gray-900">
                                            {partner.allTime.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                            {partner.topProgram || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            {partner.partner !== '(none)' && (
                                                <Link
                                                    to={`/reporting/report/${partner.partner}`}
                                                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                                                >
                                                    <FileText className="h-4 w-4" />
                                                    View Report
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
