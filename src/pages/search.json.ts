import { getCollection } from 'astro:content';

export async function GET() {
	try {
		const allPages = await getCollection('pages');
		
		const index = allPages.map(page => ({
			title: page.data.title,
			slug: page.id,
			description: page.data.description || ''
		}));

		return new Response(JSON.stringify(index), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'public, max-age=3600'
			}
		});
	} catch (error) {
		console.error("Error generating search index JSON:", error);
		return new Response(JSON.stringify({ error: "Failed to generate search index" }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
}
