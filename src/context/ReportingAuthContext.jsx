/**
 * Reporting Admin Auth Context
 * Simple password-based authentication for the analytics admin area
 * Uses ADMIN_PASSWORD environment variable - no user accounts needed
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ReportingAuthContext = createContext(null);

const TOKEN_STORAGE_KEY = 'tmn_reporting_admin_token';
const API_BASE = '/.netlify/functions';

export function ReportingAuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check for existing token on mount
    useEffect(() => {
        const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
        if (storedToken) {
            // Verify the token is still valid
            verifyToken(storedToken).then(valid => {
                if (valid) {
                    setToken(storedToken);
                } else {
                    localStorage.removeItem(TOKEN_STORAGE_KEY);
                }
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, []);

    // Verify token validity
    const verifyToken = async (tokenToVerify) => {
        try {
            const response = await fetch(`${API_BASE}/admin-auth/verify`, {
                headers: {
                    'Authorization': `Bearer ${tokenToVerify}`,
                },
            });
            return response.ok;
        } catch {
            return false;
        }
    };

    // Login with password
    const login = useCallback(async (password) => {
        setError(null);

        try {
            const response = await fetch(`${API_BASE}/admin-auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Login failed');
                return { success: false, error: data.error };
            }

            setToken(data.token);
            localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
            return { success: true };
        } catch (err) {
            const errorMsg = 'Network error. Please try again.';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    }, []);

    // Logout
    const logout = useCallback(() => {
        setToken(null);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
    }, []);

    // Get auth headers for API calls
    const getAuthHeaders = useCallback(() => {
        if (!token) return {};
        return {
            'Authorization': `Bearer ${token}`,
        };
    }, [token]);

    // Make authenticated API call
    const fetchWithAuth = useCallback(async (url, options = {}) => {
        if (!token) {
            throw new Error('Not authenticated');
        }

        const response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.status === 401) {
            // Token expired or invalid
            logout();
            throw new Error('Session expired');
        }

        return response;
    }, [token, logout]);

    const value = {
        isAuthenticated: !!token,
        loading,
        error,
        login,
        logout,
        getAuthHeaders,
        fetchWithAuth,
        token,
    };

    return (
        <ReportingAuthContext.Provider value={value}>
            {children}
        </ReportingAuthContext.Provider>
    );
}

export function useReportingAuth() {
    const context = useContext(ReportingAuthContext);
    if (!context) {
        throw new Error('useReportingAuth must be used within a ReportingAuthProvider');
    }
    return context;
}
