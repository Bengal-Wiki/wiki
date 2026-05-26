import { getCollection } from 'astro:content';
import fs from 'node:fs';
import path from 'node:path';

/**
 * /llms-full.txt
 *
 * A single-file concatenation of ALL Bengal Wiki article content in clean
 * Markdown, intended for LLMs that need full context in one request.
 *
 * Format follows the llms.txt convention:
 *   https://llmstxt.org/
 *
 * Each article is wrapped in <document> XML-style tags (as used by Claude/Anthropic)
 * for unambiguous section boundaries when processing with LLMs.
 */
export async function GET() {
	const allPages = await getCollection('pages');
	const baseUrl = 'https://bengal.wiki';
	const today = new Date().toISOString().split('T')[0];

	// Separate and sort by portal section
	const people  = allPages.filter(p => p.id.startsWith('people/')).sort((a, b) => a.data.title.localeCompare(b.data.title));
	const places  = allPages.filter(p => p.id.startsWith('places/')).sort((a, b) => a.data.title.localeCompare(b.data.title));
	const songs   = allPages.filter(p => p.id.startsWith('songs/')).sort((a, b) => a.data.title.localeCompare(b.data.title));
	const topLevel = allPages
		.filter(p => !p.id.startsWith('people/') && !p.id.startsWith('places/') && !p.id.startsWith('songs/') && p.id !== 'index')
		.sort((a, b) => a.data.title.localeCompare(b.data.title));

	const ordered = [...people, ...places, ...songs, ...topLevel];

	const chunks: string[] = [];

	// ── Preamble ─────────────────────────────────────────────────────────────
	chunks.push(`# Bengal Wiki — Full Content Export`);
	chunks.push(`Generated: ${today}`);
	chunks.push(`Source: ${baseUrl}/llms-full.txt`);
	chunks.push(`Index: ${baseUrl}/llms.txt`);
	chunks.push('');
	chunks.push('This file contains the full text of all Bengal Wiki articles in clean Markdown.');
	chunks.push(`Total articles: ${ordered.length}`);
	chunks.push('');
	chunks.push('---');
	chunks.push('');

	// ── Article documents ────────────────────────────────────────────────────
	for (const page of ordered) {
		const { title, description, facts, categories } = page.data;
		const pageUrl = `${baseUrl}/${page.id}`;
		const mdUrl   = `${baseUrl}/${page.id}.md`;

		// Read the raw article source
		const rawPath = path.join(process.cwd(), 'src', 'content', 'pages', `${page.id}.md`);
		let body = '';
		try {
			const raw = fs.readFileSync(rawPath, 'utf-8');
			// Strip YAML frontmatter
			body = raw.replace(/^---[\s\S]*?---\n?/, '').trimStart();
		} catch {
			body = description ?? '';
		}

		// Open XML document wrapper (Anthropic-style for Claude compatibility)
		chunks.push(`<document>`);
		chunks.push(`<source>${mdUrl}</source>`);
		chunks.push(`<document_content>`);
		chunks.push('');

		// Article header
		chunks.push(`# ${title}`);
		chunks.push('');
		if (description) {
			chunks.push(`> ${description}`);
			chunks.push('');
		}

		// Structured infobox facts as a table
		if (facts && Object.keys(facts).length > 0) {
			chunks.push('## Quick Facts');
			chunks.push('');
			chunks.push('| Field | Value |');
			chunks.push('|---|---|');
			for (const [key, value] of Object.entries(facts)) {
				const cleanValue = String(value).replace(/<br\s*\/?>/gi, ' · ').replace(/<[^>]+>/g, '');
				chunks.push(`| ${key} | ${cleanValue} |`);
			}
			chunks.push('');
		}

		// Article body
		chunks.push(body.trimEnd());
		chunks.push('');

		// Footer metadata
		if (categories && categories.length > 0) {
			chunks.push('---');
			chunks.push('');
			chunks.push(`**Categories:** ${categories.join(' · ')}`);
			chunks.push('');
		}

		chunks.push(`**URL:** ${pageUrl}`);
		chunks.push('');

		// Close XML document wrapper
		chunks.push(`</document_content>`);
		chunks.push(`</document>`);
		chunks.push('');
	}

	return new Response(chunks.join('\n'), {
		status: 200,
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
}
