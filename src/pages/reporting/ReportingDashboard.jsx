/**
 * Reporting Dashboard
 * Main admin dashboard showing analytics summary
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    BarChart3,
    Users,
    MousePointerClick,
    Calendar,
    Activity,
    TrendingUp,
    ExternalLink,
    LogOut,
    ChevronRight,
    Building2,
    FileText,
    Filter,
    CreditCard,
    Heart,
    Pill,
    ClipboardList,
} from 'lucide-react';
import { useReportingAuth } from '../../context/ReportingAuthContext';

const API_BASE = '/.netlify/functions/admin-api';

export default function ReportingDashboard() {
    const navigate = useNavigate();
    const { isAuthenticated, loading: authLoading, logout, fetchWithAuth } = useReportingAuth();

    const [stats, setStats] = useState(null);
    const [loadingStats, setLoadingStats] = useState(true);
    const [error, setError] = useState(null);

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated && !authLoading) {
            navigate('/reporting/login');
        }
    }, [isAuthenticated, authLoading, navigate]);

    // Load dashboard stats
    useEffect(() => {
        async function loadStats() {
            try {
                const response = await fetchWithAuth(`${API_BASE}/stats`);
                if (!response.ok) {
                    throw new Error('Failed to load stats');
                }
                const data = await response.json();
                setStats(data);
            } catch (err) {
                console.error('Error loading stats:', err);
                setError(err.message);
            } finally {
                setLoadingStats(false);
            }
        }

        if (isAuthenticated) {
            loadStats();
        }
    }, [isAuthenticated, fetchWithAuth]);

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

    const summaryCards = [
        {
            label: 'Total Events',
            value: stats?.totalEvents || 0,
            icon: Activity,
            color: 'bg-blue-500',
            description: 'All time',
        },
        {
            label: 'This Week',
            value: stats?.eventsThisWeek || 0,
            icon: Calendar,
            color: 'bg-green-500',
            description: 'Events this week',
        },
        {
            label: 'This Month',
            value: stats?.eventsThisMonth || 0,
            icon: TrendingUp,
            color: 'bg-purple-500',
            description: 'Events this month',
        },
        {
            label: 'Unique Sessions',
            value: stats?.uniqueSessionsThisMonth || 0,
            icon: Users,
            color: 'bg-orange-500',
            description: 'This month',
        },
    ];

    const clickStats = [
        {
            label: 'Copay Card Clicks',
            value: stats?.copayClicks || 0,
            icon: CreditCard,
            color: 'text-blue-600 bg-blue-100',
        },
        {
            label: 'Foundation Clicks',
            value: stats?.foundationClicks || 0,
            icon: Heart,
            color: 'text-pink-600 bg-pink-100',
        },
        {
            label: 'PAP Clicks',
            value: stats?.papClicks || 0,
            icon: Pill,
            color: 'text-green-600 bg-green-100',
        },
    ];

    const quizStats = [
        {
            label: 'Quiz Starts',
            value: stats?.quizStarts || 0,
        },
        {
            label: 'Quiz Completes',
            value: stats?.quizCompletes || 0,
        },
        {
            label: 'Completion Rate',
            value: stats?.quizStarts > 0
                ? `${Math.round((stats.quizCompletes / stats.quizStarts) * 100)}%`
                : 'N/A',
        },
    ];

    const menuItems = [
        {
            title: 'Events by Partner',
            description: 'View aggregated stats per partner',
            icon: Building2,
            href: '/reporting/partners',
            color: 'bg-blue-100 text-blue-600',
        },
        {
            title: 'Events by Program',
            description: 'View clicks by assistance program',
            icon: FileText,
            href: '/reporting/programs',
            color: 'bg-green-100 text-green-600',
        },
        {
            title: 'Conversion Funnel',
            description: 'View user flow metrics',
            icon: Filter,
            href: '/reporting/funnel',
            color: 'bg-purple-100 text-purple-600',
        },
        {
            title: 'Event Log',
            description: 'Browse raw event data',
            icon: ClipboardList,
            href: '/reporting/events',
            color: 'bg-orange-100 text-orange-600',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center gap-3">
                            <BarChart3 className="h-8 w-8 text-blue-600" />
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Analytics Dashboard</h1>
                                <p className="text-sm text-gray-500">Medication Navigator</p>
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
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                        {error}
                    </div>
                )}

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {summaryCards.map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-white rounded-lg shadow-sm border p-6"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">
                                        {loadingStats ? '...' : stat.value.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
                                </div>
                                <div className={`p-3 rounded-full ${stat.color}`}>
                                    <stat.icon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Program Clicks */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Program Clicks</h2>
                        <div className="space-y-4">
                            {clickStats.map((stat) => (
                                <div key={stat.label} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${stat.color}`}>
                                            <stat.icon className="h-5 w-5" />
                                        </div>
                                        <span className="text-gray-700">{stat.label}</span>
                                    </div>
                                    <span className="text-xl font-bold text-gray-900">
                                        {loadingStats ? '...' : stat.value.toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quiz Stats */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quiz Engagement</h2>
                        <div className="grid grid-cols-3 gap-4">
                            {quizStats.map((stat) => (
                                <div key={stat.label} className="text-center">
                                    <p className="text-2xl font-bold text-gray-900">
                                        {loadingStats ? '...' : stat.value.toLocaleString()}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Navigation Menu */}
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Analytics Views</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {menuItems.map((item) => (
                        <Link
                            key={item.title}
                            to={item.href}
                            className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow group"
                        >
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-lg ${item.color}`}>
                                    <item.icon className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-100">
                    <h3 className="font-semibold text-blue-900 mb-2">Quick Actions</h3>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            to="/reporting/events"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50 text-sm"
                        >
                            <MousePointerClick className="h-4 w-4" />
                            View Recent Events
                        </Link>
                        <Link
                            to="/reporting/partners"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50 text-sm"
                        >
                            <Building2 className="h-4 w-4" />
                            Partner Stats
                        </Link>
                        <Link
                            to="/reporting/funnel"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50 text-sm"
                        >
                            <TrendingUp className="h-4 w-4" />
                            View Funnel
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
