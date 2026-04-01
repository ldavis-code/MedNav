import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * RouteAnnouncer Component
 *
 * Announces page navigation to screen readers in single-page applications.
 * When the route changes, it reads the new document.title via an aria-live region.
 *
 * This addresses WCAG 2.1 success criteria:
 * - 2.4.2 Page Titled: Pages have descriptive titles
 * - 4.1.3 Status Messages: Status updates are announced without focus change
 *
 * Required for HHS Section 504 compliance (WCAG 2.1 Level AA).
 */
const RouteAnnouncer = () => {
  const location = useLocation();
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    // Small delay to allow useMetaTags to update document.title first
    const timer = setTimeout(() => {
      const pageTitle = document.title || 'Page loaded';
      setAnnouncement(pageTitle);
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div
      role="status"
      aria-live="assertive"
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
};

export default RouteAnnouncer;
