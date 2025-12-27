import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SITE_URL = 'https://medicationnavigator.com';

// Define all routes with their SEO metadata
// Note: Excludes redirect routes (/for-*), admin routes (/reporting/*), and confirmation pages
const routes = [
    { path: '/', changefreq: 'weekly', priority: 1.0 },
    { path: '/wizard', changefreq: 'monthly', priority: 0.9 },
    { path: '/medications', changefreq: 'monthly', priority: 0.9 },
    { path: '/education', changefreq: 'monthly', priority: 0.8 },
    { path: '/application-help', changefreq: 'monthly', priority: 0.8 },
    { path: '/pricing', changefreq: 'monthly', priority: 0.8 },
    { path: '/my-medications', changefreq: 'monthly', priority: 0.8 },
    { path: '/savings-tracker', changefreq: 'monthly', priority: 0.8 },
    { path: '/subscribe', changefreq: 'monthly', priority: 0.8 },
    { path: '/faq', changefreq: 'monthly', priority: 0.7 },
    { path: '/survey', changefreq: 'monthly', priority: 0.7 },
    { path: '/pilot', changefreq: 'monthly', priority: 0.6 },
    { path: '/survey/medication', changefreq: 'monthly', priority: 0.6 },
    { path: '/survey/general', changefreq: 'monthly', priority: 0.6 },
];

function generateSitemap() {
    const today = new Date().toISOString().split('T')[0];

    const urls = routes.map(route => `    <url>
        <loc>${SITE_URL}${route.path}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>${route.changefreq}</changefreq>
        <priority>${route.priority}</priority>
    </url>`).join('\n');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

    const outputPath = join(__dirname, '..', 'public', 'sitemap.xml');
    writeFileSync(outputPath, sitemap);
    console.log(`Sitemap generated: ${outputPath}`);
    console.log(`Pages included: ${routes.length}`);
    console.log(`Last modified: ${today}`);
}

generateSitemap();
