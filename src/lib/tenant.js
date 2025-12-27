/**
 * Tenant Detection & Configuration
 * Detects organization from subdomain or path
 */

// Default organization config (public site)
export const DEFAULT_ORG = {
  id: null,
  slug: 'public',
  name: 'Medication Navigator™',
  logoUrl: null,
  primaryColor: '#1e40af',
  secondaryColor: '#3b82f6',
  features: {
    price_reports: true,
    surveys: true,
    wizard: true,
    education: true,
    custom_medications: false,
    analytics_dashboard: false,
  },
  plan: 'free',
};

/**
 * Extract tenant slug from current URL
 * Supports: subdomain (mayo.medicationnavigator.com)
 *           path prefix (/org/mayo/...)
 *           query param (?org=mayo) - for development
 */
export function detectTenantSlug() {
  if (typeof window === 'undefined') return 'public';

  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);

  // 1. Check query param (development/testing)
  const queryOrg = searchParams.get('org');
  if (queryOrg) return queryOrg;

  // 2. Check path prefix (/org/mayo/...)
  const pathMatch = pathname.match(/^\/org\/([a-z0-9-]+)/i);
  if (pathMatch) return pathMatch[1].toLowerCase();

  // 3. Check subdomain
  const parts = hostname.split('.');

  // Handle localhost and IP addresses
  if (hostname === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return 'public';
  }

  // Handle subdomains: mayo.medicationnavigator.com
  // Ignore www, app, admin subdomains
  const ignoredSubdomains = ['www', 'app', 'admin', 'api', 'staging', 'dev'];
  if (parts.length >= 3 && !ignoredSubdomains.includes(parts[0])) {
    return parts[0].toLowerCase();
  }

  return 'public';
}

/**
 * Build tenant-aware URL
 */
export function buildTenantUrl(path, tenantSlug = null) {
  const slug = tenantSlug || detectTenantSlug();

  if (slug === 'public') {
    return path;
  }

  // For subdomain-based routing, just return the path
  // The subdomain handles the tenant context
  return path;
}

/**
 * Get CSS variables for tenant branding
 */
export function getTenantStyles(org) {
  return {
    '--primary-color': org.primaryColor || DEFAULT_ORG.primaryColor,
    '--secondary-color': org.secondaryColor || DEFAULT_ORG.secondaryColor,
  };
}

/**
 * Check if a feature is enabled for the tenant
 */
export function isFeatureEnabled(org, featureName) {
  if (!org || !org.features) return DEFAULT_ORG.features[featureName] ?? false;
  return org.features[featureName] ?? false;
}

/**
 * Format organization display name
 */
export function getOrgDisplayName(org) {
  if (!org || org.slug === 'public') {
    return 'Medication Navigator™';
  }
  return `${org.name} - Medication Navigator`;
}
