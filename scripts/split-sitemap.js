import fs from 'fs';
import path from 'path';

const distDir = path.resolve('./dist');
const siteUrl = 'https://bengal.wiki';
const chunkSize = 100; // Granular chunks of 100 URLs each

console.log('Crawling built files inside dist/ to generate granular sitemaps...');

function getHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            getHtmlFiles(filePath, fileList);
        } else if (file === 'index.html') {
            fileList.push(filePath);
        }
    }
    return fileList;
}

if (!fs.existsSync(distDir)) {
    console.error('Error: dist/ directory not found. Please run build first.');
    process.exit(1);
}

const htmlFiles = getHtmlFiles(distDir);
const urls = [];

for (const file of htmlFiles) {
    const relativePath = path.relative(distDir, file);
    
    // Convert relative path to URL path
    let urlPath = '/' + relativePath.replace(/\\/g, '/');
    
    // Remove index.html
    urlPath = urlPath.replace(/\/index\.html$/, '');
    
    // Handle home index page
    if (urlPath === '') {
        urlPath = '/';
    }
    
    // Exclude 404 page if it exists
    if (urlPath.includes('404')) continue;
    
    const fullUrl = siteUrl + urlPath;
    urls.push(fullUrl);
}

// Sort URLs alphabetically
urls.sort();

console.log(`Found ${urls.length} built URLs in dist/. Dividing into chunks of ${chunkSize}...`);

const chunks = [];
for (let i = 0; i < urls.length; i += chunkSize) {
    chunks.push(urls.slice(i, i + chunkSize));
}

const lastmod = new Date().toISOString().split('T')[0];

const sitemapHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
          http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;

const sitemapFooter = `</urlset>`;

// Clean up any old sitemap files
const oldFiles = fs.readdirSync(distDir);
for (const file of oldFiles) {
    if (file.startsWith('sitemap-') && file.endsWith('.xml')) {
        fs.unlinkSync(path.join(distDir, file));
    }
}

// Save chunk sitemaps
const sitemapRefs = [];
chunks.forEach((chunk, index) => {
    const filename = `sitemap-part-${index + 1}.xml`;
    const chunkMarkup = chunk.map(url => {
        let priority = '0.5';
        let changefreq = 'monthly';
        
        if (url === siteUrl + '/') {
            priority = '1.0';
            changefreq = 'daily';
        } else if (url.includes('/category/') || ['/people', '/places', '/songs', '/businesses', '/books'].some(p => url.endsWith(p))) {
            priority = '0.8';
            changefreq = 'weekly';
        }
        
        return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    });
    
    const filePath = path.join(distDir, filename);
    const content = sitemapHeader + '\n' + chunkMarkup.join('\n') + '\n' + sitemapFooter;
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Saved ${filename} with ${chunk.length} URLs.`);
    sitemapRefs.push(filename);
});

// Generate sitemap index
const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapRefs.map(ref => `  <sitemap>
    <loc>${siteUrl}/${ref}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

const indexSitemapPath = path.join(distDir, 'sitemap.xml');
fs.writeFileSync(indexSitemapPath, sitemapIndex, 'utf8');
console.log(`Saved sitemap index at sitemap.xml listing ${sitemapRefs.length} granular files.`);
