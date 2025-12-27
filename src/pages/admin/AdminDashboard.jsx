/**
 * Hospital Admin Dashboard
 * Main admin panel for hospital administrators
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  Users,
  Pill,
  Settings,
  BarChart3,
  FileText,
  ExternalLink,
  ChevronRight,
  Shield,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const { org, loading: tenantLoading } = useTenant();
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin && !tenantLoading) {
      navigate('/');
    }
  }, [isAdmin, tenantLoading, navigate]);

  // Load dashboard stats
  useEffect(() => {
    async function loadStats() {
      try {
        // TODO: Implement stats API
        setStats({
          totalUsers: 5,
          activeUsers: 3,
          priceReports: 127,
          surveyResponses: 45,
          pageViews: 1234,
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoadingStats(false);
      }
    }

    if (isAdmin) {
      loadStats();
    }
  }, [isAdmin]);

  if (tenantLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const menuItems = [
    {
      title: 'Organization Settings',
      description: 'Branding, colors, contact info',
      icon: Building2,
      href: '/admin/settings',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'User Management',
      description: 'Manage staff accounts & roles',
      icon: Users,
      href: '/admin/users',
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Medication Config',
      description: 'Customize medications & resources',
      icon: Pill,
      href: '/admin/medications',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Analytics',
      description: 'Usage statistics & reports',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'bg-orange-100 text-orange-600',
    },
    {
      title: 'Survey Responses',
      description: 'View patient survey data',
      icon: FileText,
      href: '/admin/surveys',
      color: 'bg-pink-100 text-pink-600',
    },
    {
      title: 'Feature Settings',
      description: 'Enable/disable features',
      icon: Settings,
      href: '/admin/features',
      color: 'bg-gray-100 text-gray-600',
    },
  ];

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users },
    { label: 'Price Reports', value: stats?.priceReports || 0, icon: FileText },
    { label: 'Survey Responses', value: stats?.surveyResponses || 0, icon: BarChart3 },
    { label: 'Page Views (30d)', value: stats?.pageViews || 0, icon: ExternalLink },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">{org.name}</p>
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
              <div className="text-sm text-gray-600">
                {user?.name || user?.email}
              </div>
              <button
                onClick={logout}
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat) => (
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
                </div>
                <stat.icon className="h-8 w-8 text-gray-400" />
              </div>
            </div>
          ))}
        </div>

        {/* Menu Grid */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          <h3 className="font-semibold text-blue-900 mb-2">Getting Started</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• Upload your hospital logo in Organization Settings</li>
            <li>• Invite staff members in User Management</li>
            <li>• Customize which medications to feature for your patients</li>
            <li>• Add hospital-specific resources and links</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
