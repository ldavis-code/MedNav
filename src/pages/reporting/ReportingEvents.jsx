/**
 * Reporting Events Page
 * Shows raw event log with pagination and filters
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeft,
    Download,
    LogOut,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    Clock,
    Search,
} from 'lucide-react';
import { useReportingAuth } from '../../context/ReportingAuthContext';

const API_BASE = '/.netlify/functions/admin-api';

const eventNameLabels = {
    page_view: 'Page View',
    quiz_start: 'Quiz Start',
    quiz_complete: 'Quiz Complete',
    med_search: 'Med Search',
    resource_view: 'Resource View',
    copay_card_click: 'Copay Click',
    foundation_click: 'Foundation Click',
    pap_click: 'PAP Click',
    helpful_vote_yes: 'Helpful Yes',
    helpful_vote_no: 'Helpful No',
};

const eventNameColors = {
    page_view: 'bg-gray-100 text-gray-700',
    quiz_start: 'bg-purple-100 text-purple-700',
    quiz_complete: 'bg-green-100 text-green-700',
    med_search: 'bg-orange-100 text-orange-700',
    resource_view: 'bg-blue-100 text-blue-700',
    copay_card_click: 'bg-blue-100 text-blue-700',
    foundation_click: 'bg-pink-100 text-pink-700',
    pap_click: 'bg-green-100 text-green-700',
    helpful_vote_yes: 'bg-emerald-100 text-emerald-700',
    helpful_vote_no: 'bg-red-100 text-red-700',
};

export default function ReportingEvents() {
    const navigate = useNavigate();
    const { isAuthenticated, loading: authLoading, logout, fetchWithAuth } = useReportingAuth();

    const [events, setEvents] = useState([]);
    const [total, setTotal] = useState(0);
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [filters, setFilters] = useState({
        partner: '',
        event_name: '',
        start: '',
        end: '',
    });

    const ITEMS_PER_PAGE = 50;

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
                    setPartners(data);
                }
            } catch (err) {
                console.error('Error loading partners:', err);
            }
        }

        if (isAuthenticated) {
            loadPartners();
        }
    }, [isAuthenticated, fetchWithAuth]);

    // Load events data
    useEffect(() => {
        async function loadEvents() {
            try {
                setLoading(true);
                const params = new URLSearchParams();
                params.set('limit', ITEMS_PER_PAGE);
                params.set('offset', page * ITEMS_PER_PAGE);
                if (filters.partner) params.set('partner', filters.partner);
                if (filters.event_name) params.set('event_name', filters.event_name);
                if (filters.start) params.set('start', filters.start);
                if (filters.end) params.set('end', filters.end);

                const response = await fetchWithAuth(`${API_BASE}/events?${params}`);
                if (!response.ok) {
                    throw new Error('Failed to load events');
                }
                const data = await response.json();
                setEvents(data.events);
                setTotal(data.total);
            } catch (err) {
                console.error('Error loading events:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        if (isAuthenticated) {
            loadEvents();
        }
    }, [isAuthenticated, fetchWithAuth, page, filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(0); // Reset to first page
    };

    const handleExportCsv = async () => {
        try {
            const params = new URLSearchParams();
            if (filters.partner) params.set('partner', filters.partner);
            if (filters.start) params.set('start', filters.start);
            if (filters.end) params.set('end', filters.end);

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

    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

    const formatTimestamp = (ts) => {
        const date = new Date(ts);
        return date.toLocaleString();
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
                                <h1 className="text-xl font-bold text-gray-900">Event Log</h1>
                                <p className="text-sm text-gray-500">Browse raw event data</p>
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
                                Event Type
                            </label>
                            <select
                                value={filters.event_name}
                                onChange={(e) => handleFilterChange('event_name', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Events</option>
                                {Object.entries(eventNameLabels).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Partner
                            </label>
                            <select
                                value={filters.partner}
                                onChange={(e) => handleFilterChange('partner', e.target.value)}
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
                                value={filters.start}
                                onChange={(e) => handleFilterChange('start', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Date
                            </label>
                            <input
                                type="date"
                                value={filters.end}
                                onChange={(e) => handleFilterChange('end', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <button
                            onClick={() => {
                                setFilters({ partner: '', event_name: '', start: '', end: '' });
                                setPage(0);
                            }}
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

                {/* Results Info */}
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-600">
                        Showing {events.length > 0 ? page * ITEMS_PER_PAGE + 1 : 0} - {Math.min((page + 1) * ITEMS_PER_PAGE, total)} of {total.toLocaleString()} events
                    </p>
                </div>

                {/* Events Table */}
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Timestamp
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Event
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Partner
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Page Source
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Program Type
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Program ID
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-12 text-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
                                        </td>
                                    </tr>
                                ) : events.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                                            No events found
                                        </td>
                                    </tr>
                                ) : (
                                    events.map((event) => (
                                        <tr key={event.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    {formatTimestamp(event.ts)}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${eventNameColors[event.event_name] || 'bg-gray-100 text-gray-700'}`}>
                                                    {eventNameLabels[event.event_name] || event.event_name}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                {event.partner || '-'}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                                                {event.page_source}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                                {event.program_type || '-'}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                                {event.program_id || '-'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-4 flex items-center justify-between">
                        <button
                            onClick={() => setPage(p => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className="inline-flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </button>
                        <span className="text-sm text-gray-600">
                            Page {page + 1} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                            disabled={page >= totalPages - 1}
                            className="inline-flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
