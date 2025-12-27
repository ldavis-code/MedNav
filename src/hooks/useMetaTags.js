import { useEffect } from 'react';

const BASE_URL = 'https://medicationnavigator.com';

/**
 * Custom hook for managing dynamic meta tags for SEO
 * @param {Object} config - Meta tag configuration
 * @param {string} config.title - Page title
 * @param {string} config.description - Meta description (150-160 chars recommended)
 * @param {string} config.canonical - Canonical URL for the page
 * @param {string} [config.ogTitle] - Open Graph title (defaults to title)
 * @param {string} [config.ogDescription] - Open Graph description (defaults to description)
 * @param {string} [config.ogImage] - Open Graph image URL
 * @param {string} [config.ogUrl] - Open Graph URL (defaults to canonical)
 * @param {string} [config.twitterTitle] - Twitter card title (defaults to title)
 * @param {string} [config.twitterDescription] - Twitter card description (defaults to description)
 * @param {string} [config.twitterImage] - Twitter card image URL
 * @param {string} [config.breadcrumbName] - Name for breadcrumb (if different from title)
 */
export function useMetaTags(config) {
  useEffect(() => {
    const {
      title,
      description,
      canonical,
      ogTitle,
      ogDescription,
      ogImage = '/og-image.png',
      ogUrl,
      twitterTitle,
      twitterDescription,
      twitterImage = '/twitter-image.png',
      breadcrumbName,
    } = config;

    // Update document title
    if (title) {
      document.title = title;
    }

    // Helper function to update or create meta tag
    const updateMetaTag = (selector, attribute, content) => {
      if (!content) return;

      let element = document.querySelector(selector);
      if (element) {
        element.setAttribute(attribute, content);
      } else {
        element = document.createElement('meta');
        const [attrName, attrValue] = selector.match(/\[(.+?)=['"](.+?)['"]\]/)?.slice(1, 3) || [];
        if (attrName && attrValue) {
          element.setAttribute(attrName, attrValue);
          element.setAttribute(attribute, content);
          document.head.appendChild(element);
        }
      }
    };

    // Helper function to update or create link tag
    const updateLinkTag = (rel, href) => {
      if (!href) return;

      let element = document.querySelector(`link[rel="${rel}"]`);
      if (element) {
        element.setAttribute('href', href);
      } else {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        element.setAttribute('href', href);
        document.head.appendChild(element);
      }
    };

    // Update basic meta tags
    updateMetaTag('meta[name="description"]', 'content', description);

    // Update canonical URL
    updateLinkTag('canonical', canonical);

    // Update Open Graph tags
    updateMetaTag('meta[property="og:title"]', 'content', ogTitle || title);
    updateMetaTag('meta[property="og:description"]', 'content', ogDescription || description);
    updateMetaTag('meta[property="og:url"]', 'content', ogUrl || canonical);
    updateMetaTag('meta[property="og:image"]', 'content', ogImage);

    // Update Twitter Card tags
    updateMetaTag('meta[name="twitter:title"]', 'content', twitterTitle || title);
    updateMetaTag('meta[name="twitter:description"]', 'content', twitterDescription || description);
    updateMetaTag('meta[name="twitter:image"]', 'content', twitterImage);

    // Add BreadcrumbList structured data for non-home pages
    const existingBreadcrumb = document.querySelector('script[data-breadcrumb="true"]');
    if (existingBreadcrumb) {
      existingBreadcrumb.remove();
    }

    // Only add breadcrumb for non-home pages
    if (canonical && canonical !== `${BASE_URL}/`) {
      const pageName = breadcrumbName || title?.split(' | ')[0] || 'Page';
      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': `${BASE_URL}/`
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': pageName,
            'item': canonical
          }
        ]
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-breadcrumb', 'true');
      script.textContent = JSON.stringify(breadcrumbSchema);
      document.head.appendChild(script);
    }

    // Cleanup function - restore default values and remove breadcrumb
    return () => {
      document.title = 'Medication Navigator - Medication Assistance Guide for medication Patients';
      const breadcrumbScript = document.querySelector('script[data-breadcrumb="true"]');
      if (breadcrumbScript) {
        breadcrumbScript.remove();
      }
    };
  }, [config]);
}
