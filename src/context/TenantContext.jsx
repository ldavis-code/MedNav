/**
 * Tenant Context Provider
 * Provides organization configuration throughout the app
 */

import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { detectTenantSlug, DEFAULT_ORG, getTenantStyles } from '../lib/tenant';

const TenantContext = createContext(null);

// API base URL for organization config
const API_BASE = '/.netlify/functions';

export function TenantProvider({ children }) {
  const [org, setOrg] = useState(DEFAULT_ORG);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadTenantConfig() {
      const slug = detectTenantSlug();

      // Skip API call for public tenant
      if (slug === 'public') {
        setOrg(DEFAULT_ORG);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/organization?slug=${slug}`);

        if (!response.ok) {
          if (response.status === 404) {
            // Organization not found, use default
            console.warn(`Organization "${slug}" not found, using default`);
            setOrg(DEFAULT_ORG);
          } else {
            throw new Error(`Failed to load organization: ${response.status}`);
          }
        } else {
          const data = await response.json();
          setOrg({
            id: data.id,
            slug: data.slug,
            name: data.name,
            logoUrl: data.logo_url,
            primaryColor: data.primary_color || DEFAULT_ORG.primaryColor,
            secondaryColor: data.secondary_color || DEFAULT_ORG.secondaryColor,
            contactEmail: data.contact_email,
            websiteUrl: data.website_url,
            features: data.features || DEFAULT_ORG.features,
            plan: data.plan || 'free',
          });
        }
      } catch (err) {
        console.error('Error loading tenant config:', err);
        setError(err.message);
        setOrg(DEFAULT_ORG);
      } finally {
        setLoading(false);
      }
    }

    loadTenantConfig();
  }, []);

  // Apply tenant branding via CSS variables
  useEffect(() => {
    if (org) {
      const styles = getTenantStyles(org);
      Object.entries(styles).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
    }
  }, [org]);

  const value = useMemo(
    () => ({
      org,
      loading,
      error,
      isPublic: org.slug === 'public',
      hasFeature: (feature) => org.features?.[feature] ?? false,
    }),
    [org, loading, error]
  );

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}

export default TenantContext;
