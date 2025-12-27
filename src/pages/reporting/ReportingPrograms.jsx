/**
 * Reporting Programs Page
 * Shows events aggregated by program
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeft,
    Download,
    FileText,
    LogOut,
    ExternalLink,
    CreditCard,
    Heart,
    Pill,
    ArrowUpDown,
} from 'lucide-react';
import { useReportingAuth } from '../../context/ReportingAuthContext';

const API_BASE = '/.netlify/functions/admin-api';

const programTypeConfig = {
    copay: { icon: CreditCard, color: 'bg-blue-100 text-blue-600', label: 'Copay Card' },
    foundation: { icon: Heart, color: 'bg-pink-100 text-pink-600', label: 'Foundation' },
    pap: { icon: Pill, color: 'bg-green-100 text-green-600', label: 'PAP' },
};

export default function ReportingPrograms() {
    const navigate = useNavigate();
    const { isAuthenticated, loading: authLoading, logout, fetchWithAuth } = useReportingAuth();

    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [programTypeFilter, setProgramTypeFilter] = useState('');
    const [sortField, setSortField] = useState('allTime');
    const [sortDirection, setSortDirection] = useState('desc');

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated && !authLoading) {
            navigate('/reporting/login');
        }
    }, [isAuthenticated, authLoading, navigate]);

    // Load program data
    useEffect(() => {
        async function loadPrograms() {
            try {
                setLoading(true);
                const params = new URLSearchParams();
                if (dateRange.start) params.set('start', dateRange.start);
                if (dateRange.end) params.set('end', dateRange.end);
                if (programTypeFilter) params.set('program_type', programTypeFilter);

                const response = await fetchWithAuth(`${API_BASE}/events/by-program?${params}`);
                if (!response.ok) {
                    throw new Error('Failed to load program data');
                }
                const data = await response.json();
                setPrograms(data);
            } catch (err) {
                console.error('Error loading programs:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        if (isAuthenticated) {
            loadPrograms();
        }
    }, [isAuthenticated, fetchWithAuth, dateRange, programTypeFilter]);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    const sortedPrograms = [...programs].sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        const direction = sortDirection === 'asc' ? 1 : -1;

        if (typeof aVal === 'number' && typeof bVal === 'number') {
            return (aVal - bVal) * direction;
        }
        return String(aVal).localeCompare(String(bVal)) * direction;
    });

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
            a.download = `programs_export_${new Date().toISOString().split('T')[0]}.csv`;
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

    const SortHeader = ({ field, children }) => (
        <th
            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            onClick={() => handleSort(field)}
        >
            <div className="flex items-center justify-end gap-1">
                {children}
                <ArrowUpDown className={`h-4 w-4 ${sortField === field ? 'text-blue-600' : 'text-gray-400'}`} />
            </div>
        </th>
    );

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
                                <h1 className="text-xl font-bold text-gray-900">Events by Program</h1>
                                <p className="text-sm text-gray-500">View clicks by assistance program</p>
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
                                Program Type
                            </label>
                            <select
                                value={programTypeFilter}
                                onChange={(e) => setProgramTypeFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Types</option>
                                <option value="copay">Copay Cards</option>
                                <option value="foundation">Foundations</option>
                                <option value="pap">PAPs</option>
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
                                setProgramTypeFilter('');
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

                {/* Programs Table */}
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Program
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <SortHeader field="thisWeek">This Week</SortHeader>
                                <SortHeader field="thisMonth">This Month</SortHeader>
                                <SortHeader field="allTime">All Time</SortHeader>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
                                    </td>
                                </tr>
                            ) : sortedPrograms.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No program data found
                                    </td>
                                </tr>
                            ) : (
                                sortedPrograms.map((program) => {
                                    const config = programTypeConfig[program.programType] || {
                                        icon: FileText,
                                        color: 'bg-gray-100 text-gray-600',
                                        label: program.programType,
                                    };
                                    const IconComponent = config.icon;

                                    return (
                                        <tr key={program.programId} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg ${config.color}`}>
                                                        <IconComponent className="h-5 w-5" />
                                                    </div>
                                                    <div className="font-medium text-gray-900">
                                                        {program.programId}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                                                    {config.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900">
                                                {program.thisWeek.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900">
                                                {program.thisMonth.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-gray-900">
                                                {program.allTime.toLocaleString()}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
