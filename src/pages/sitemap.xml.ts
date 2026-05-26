import { getCollection } from 'astro:content';

export async function GET() {
	try {
		const allPages = await getCollection('pages');
		const baseUrl = 'https://bengal.wiki';

		// Today's date in W3C datetime format (YYYY-MM-DD) for lastmod
		const today = new Date().toISOString().split('T')[0];

		// Core static portal routes defined in src/pages/
		const baseRoutes = [
			{ url: '', priority: '1.0', changefreq: 'daily', lastmod: today },
			{ url: 'people', priority: '0.9', changefreq: 'daily', lastmod: today },
			{ url: 'places', priority: '0.9', changefreq: 'daily', lastmod: today },
			{ url: 'songs', priority: '0.9', changefreq: 'daily', lastmod: today },
			{ url: 'statistics', priority: '0.7', changefreq: 'weekly', lastmod: today }
		];

		// Dynamic content routes loaded from the 'pages' collection
		const dynamicUrls = allPages
			.filter(page => page.id !== 'index') // 'index' is represented by base route
			.map(page => {
				let priority = '0.8';
				let changefreq = 'weekly';

				// Differentiate core biographies/places from basic policy pages
				if (page.id.startsWith('people/') || page.id.startsWith('places/') || page.id.startsWith('songs/')) {
					priority = '0.8';
					changefreq = 'weekly';
				} else {
					priority = '0.5'; // Utility and policy documents
					changefreq = 'monthly';
				}

				return {
					url: page.id,
					priority,
					changefreq,
					lastmod: today
				};
			});

		// Consolidate all endpoints
		const urls = [...baseRoutes, ...dynamicUrls];

		// Build the XML body
		const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
          http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.map(route => `  <url>
    <loc>${baseUrl}/${route.url}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

		return new Response(xml, {
			status: 200,
			headers: {
				'Content-Type': 'application/xml; charset=utf-8',
				'Cache-Control': 'public, max-age=86400'
			}
		});
	} catch (error) {
		console.error("Error generating sitemap.xml:", error);
		return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>', {
			status: 500,
			headers: {
				'Content-Type': 'application/xml'
			}
		});
	}
}
