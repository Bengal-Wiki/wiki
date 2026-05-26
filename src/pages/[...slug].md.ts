import { getCollection } from 'astro:content';
import fs from 'node:fs';
import path from 'node:path';

// Generate static paths for every content page — each produces a /{id}.md file.
// Astro derives the URL from the filename: [...slug].md.ts → /{slug}.md
export async function getStaticPaths() {
	const allPages = await getCollection('pages');
	return allPages
		.filter(page => page.id !== 'index')
		.map(page => ({
			params: { slug: page.id },
			props: { page },
		}));
}

export async function GET({ props }: { props: { page: any } }) {
	const { page } = props;

	// Read the raw source file directly — this gives us clean markdown with frontmatter intact.
	// The content collection loader stores the original file path in page.filePath.
	const rawPath = path.join(process.cwd(), 'src', 'content', 'pages', `${page.id}.md`);

	let raw = '';
	try {
		raw = fs.readFileSync(rawPath, 'utf-8');
	} catch {
		// Fallback: build from structured data if file read fails
		raw = buildMarkdownFallback(page);
	}

	// Strip YAML frontmatter (--- ... ---) and produce a clean LLM-friendly document
	const withoutFrontmatter = raw.replace(/^---[\s\S]*?---\n?/, '').trimStart();

	// Compose a clean markdown document with a header block for LLM context
	const { title, description, facts, categories } = page.data;

	const headerLines: string[] = [];
	headerLines.push(`# ${title}`);
	headerLines.push('');

	if (description) {
		headerLines.push(`> ${description}`);
		headerLines.push('');
	}

	// Render infobox facts as a markdown table for structured data
	if (facts && Object.keys(facts).length > 0) {
		headerLines.push('## Quick Facts');
		headerLines.push('');
		headerLines.push('| Field | Value |');
		headerLines.push('|---|---|');
		for (const [key, value] of Object.entries(facts)) {
			// Strip HTML tags that appear in some fact values (e.g. <br>)
			const cleanValue = String(value).replace(/<br\s*\/?>/gi, ' · ').replace(/<[^>]+>/g, '');
			headerLines.push(`| ${key} | ${cleanValue} |`);
		}
		headerLines.push('');
	}

	// Prepend the structured header, then append the article body
	const output = headerLines.join('\n') + withoutFrontmatter;

	// Append categories as a footer if present
	const footer: string[] = [];
	if (categories && categories.length > 0) {
		footer.push('');
		footer.push('---');
		footer.push('');
		footer.push(`**Categories:** ${categories.join(' · ')}`);
	}

	const fullOutput = output + footer.join('\n');

	return new Response(fullOutput, {
		status: 200,
		headers: {
			'Content-Type': 'text/markdown; charset=utf-8',
			'Cache-Control': 'public, max-age=3600',
			'X-Content-Type-Options': 'nosniff'
		}
	});
}

/**
 * Fallback markdown builder using structured data when the raw file can't be read.
 */
function buildMarkdownFallback(page: any): string {
	const { title, description } = page.data;
	return `# ${title}\n\n${description ?? ''}\n`;
}
