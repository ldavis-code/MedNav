import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const DemoModeContext = createContext(undefined);

const DEMO_MODE_KEY = 'mednav_demo_mode';
const DEMO_EXPIRY_KEY = 'mednav_demo_expiry';
const DEMO_TYPE_KEY = 'mednav_demo_type';
const DEMO_DURATION = 4 * 60 * 60 * 1000; // 4 hours

/**
 * DemoModeContext - Manages enterprise/partner demo mode.
 * Activated via URL (/demo), query params (?demo=true), or programmatically.
 * Grants Pro features without authentication for demo presentations.
 */
export const DemoModeProvider = ({ children }) => {
  const location = useLocation();
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoType, setDemoType] = useState(null);

  // Check for demo mode activation on mount and route changes
  useEffect(() => {
    // Check URL-based activation
    const isOnDemoRoute = location.pathname.startsWith('/demo');
    const params = new URLSearchParams(location.search);
    const demoParam = params.get('demo');
    const typeParam = params.get('type') || params.get('demo_type');

    if (isOnDemoRoute || demoParam === 'true' || demoParam === 'enterprise' || demoParam === 'partner') {
      const type = typeParam || (demoParam === 'enterprise' ? 'enterprise' : demoParam === 'partner' ? 'partner' : 'general');
      startDemoMode(type);
      return;
    }

    // Check stored demo session
    try {
      const storedMode = localStorage.getItem(DEMO_MODE_KEY);
      const storedExpiry = localStorage.getItem(DEMO_EXPIRY_KEY);
      const storedType = localStorage.getItem(DEMO_TYPE_KEY);

      if (storedMode === 'true' && storedExpiry) {
        if (Date.now() < parseInt(storedExpiry, 10)) {
          setIsDemoMode(true);
          setDemoType(storedType || 'general');
        } else {
          // Expired — clean up
          exitDemoMode();
        }
      }
    } catch {
      // ignore
    }
  }, [location.pathname, location.search]);

  const startDemoMode = useCallback((type = 'general') => {
    const expiry = Date.now() + DEMO_DURATION;
    try {
      localStorage.setItem(DEMO_MODE_KEY, 'true');
      localStorage.setItem(DEMO_EXPIRY_KEY, String(expiry));
      localStorage.setItem(DEMO_TYPE_KEY, type);
    } catch {
      // ignore
    }
    setIsDemoMode(true);
    setDemoType(type);
  }, []);

  const exitDemoMode = useCallback(() => {
    try {
      localStorage.removeItem(DEMO_MODE_KEY);
      localStorage.removeItem(DEMO_EXPIRY_KEY);
      localStorage.removeItem(DEMO_TYPE_KEY);
    } catch {
      // ignore
    }
    setIsDemoMode(false);
    setDemoType(null);
  }, []);

  const getDemoTimeRemaining = useCallback(() => {
    try {
      const expiry = localStorage.getItem(DEMO_EXPIRY_KEY);
      if (expiry) {
        const remaining = parseInt(expiry, 10) - Date.now();
        return Math.max(0, remaining);
      }
    } catch {
      // ignore
    }
    return 0;
  }, []);

  const value = useMemo(() => ({
    isDemoMode,
    demoType,
    startDemoMode,
    exitDemoMode,
    getDemoTimeRemaining,
  }), [isDemoMode, demoType, startDemoMode, exitDemoMode, getDemoTimeRemaining]);

  return (
    <DemoModeContext.Provider value={value}>
      {children}
    </DemoModeContext.Provider>
  );
};

export const useDemoMode = () => {
  const context = useContext(DemoModeContext);
  if (context === undefined) {
    throw new Error('useDemoMode must be used within a DemoModeProvider');
  }
  return context;
};

export default DemoModeContext;
