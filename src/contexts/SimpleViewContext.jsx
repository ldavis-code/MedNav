import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const SimpleViewContext = createContext(undefined);

/**
 * SimpleViewProvider - Provides a toggle for simplified view mode.
 * Persists preference to localStorage and adds/removes 'simple-view'
 * class on the document root element for CSS-based styling.
 */
export const SimpleViewProvider = ({ children }) => {
  const [isSimpleView, setIsSimpleView] = useState(() => {
    try {
      return localStorage.getItem('tmn_simple_view') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('tmn_simple_view', String(isSimpleView));
    } catch {
      // localStorage unavailable
    }

    if (isSimpleView) {
      document.documentElement.classList.add('simple-view');
    } else {
      document.documentElement.classList.remove('simple-view');
    }
  }, [isSimpleView]);

  const toggleSimpleView = useCallback(() => {
    setIsSimpleView((prev) => !prev);
  }, []);

  return (
    <SimpleViewContext.Provider value={{ isSimpleView, toggleSimpleView }}>
      {children}
    </SimpleViewContext.Provider>
  );
};

/**
 * useSimpleView - Hook to access simple view state and toggle
 */
export const useSimpleView = () => {
  const context = useContext(SimpleViewContext);
  if (context === undefined) {
    throw new Error('useSimpleView must be used within a SimpleViewProvider');
  }
  return context;
};

export default SimpleViewContext;
