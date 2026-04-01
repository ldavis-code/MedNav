import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const SubscriberAuthContext = createContext(undefined);

const STORAGE_KEYS = {
  TOKEN: 'mednav_subscriber_token',
  USER: 'mednav_subscriber_user',
};

const API_BASE = '/.netlify/functions';

/**
 * SubscriberAuthContext - Manages authentication state for subscribers (patients).
 * Uses Netlify Functions for backend auth. Supports demo mode for enterprise previews.
 */
export const SubscriberAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for demo mode
  const isDemoModeActive = useCallback(() => {
    try {
      const expiry = localStorage.getItem('mednav_demo_expiry');
      if (expiry && Date.now() < parseInt(expiry, 10)) {
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  }, []);

  // Load stored user on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
      }
    } catch {
      // Clear corrupted data
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    }
    setLoading(false);
  }, []);

  const getToken = useCallback(() => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/subscriber-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  const register = useCallback(async (email, password, name) => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/subscriber-register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
    setError(null);
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const refreshUser = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE}/subscriber-verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        if (response.status === 401) {
          logout();
        }
        return;
      }

      const data = await response.json();
      if (data.user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
        setUser(data.user);
      }
    } catch {
      // Silent fail on refresh
    }
  }, [getToken, logout]);

  const isAuthenticated = !!user;
  const isDemo = isDemoModeActive();
  const isPro = isDemo || (user?.plan === 'pro' && user?.subscription_status === 'active');

  const value = useMemo(() => ({
    user,
    loading,
    error,
    isAuthenticated,
    isPro,
    isDemo,
    login,
    register,
    logout,
    getToken,
    updateUser,
    refreshUser,
  }), [user, loading, error, isAuthenticated, isPro, isDemo, login, register, logout, getToken, updateUser, refreshUser]);

  return (
    <SubscriberAuthContext.Provider value={value}>
      {children}
    </SubscriberAuthContext.Provider>
  );
};

export const useSubscriberAuth = () => {
  const context = useContext(SubscriberAuthContext);
  if (context === undefined) {
    throw new Error('useSubscriberAuth must be used within a SubscriberAuthProvider');
  }
  return context;
};

export default SubscriberAuthContext;
