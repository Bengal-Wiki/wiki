import fs from 'fs';
import path from 'path';

const distDir = path.resolve('./dist');
const originalSitemapPath = path.join(distDir, 'sitemap.xml');

if (!fs.existsSync(originalSitemapPath)) {
    console.error('Error: sitemap.xml not found in dist/. Please run astro build first.');
    process.exit(1);
}

console.log('Parsing sitemap.xml to split into smaller files...');

const content = fs.readFileSync(originalSitemapPath, 'utf8');

// Parse URLs using simple regex to avoid external parser dependency
const urlRegex = /<url>[\s\S]*?<\/url>/g;
const urls = content.match(urlRegex) || [];

const mainUrls = [];
const placesUrls = [];
const peopleUrls = [];

for (const urlMarkup of urls) {
    const locMatch = urlMarkup.match(/<loc>(.*?)<\/loc>/);
    if (!locMatch) continue;
    
    const loc = locMatch[1];
    if (loc.includes('/places/')) {
        placesUrls.push(urlMarkup);
    } else if (loc.includes('/people/')) {
        peopleUrls.push(urlMarkup);
    } else {
        mainUrls.push(urlMarkup);
    }
}

const lastmod = new Date().toISOString().split('T')[0];

const sitemapHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
          http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;

const sitemapFooter = `</urlset>`;

function saveSitemap(filename, urlList) {
    const filePath = path.join(distDir, filename);
    const content = sitemapHeader + '\n' + urlList.join('\n') + '\n' + sitemapFooter;
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Saved ${filename} with ${urlList.length} URLs.`);
}

// Save split sitemaps
saveSitemap('sitemap-main.xml', mainUrls);
saveSitemap('sitemap-places.xml', placesUrls);
saveSitemap('sitemap-people.xml', peopleUrls);

// Generate sitemap index
const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://bengal.wiki/sitemap-main.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://bengal.wiki/sitemap-places.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://bengal.wiki/sitemap-people.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
</sitemapindex>`;

fs.writeFileSync(originalSitemapPath, sitemapIndex, 'utf8');
console.log('Overwrote sitemap.xml with the sitemap index.');
