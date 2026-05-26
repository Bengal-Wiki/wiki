import { getCollection } from 'astro:content';

export async function GET() {
	const allPages = await getCollection('pages');
	const baseUrl = 'https://bengal.wiki';

	// Separate pages by portal section for structured sections
	const people = allPages
		.filter(p => p.id.startsWith('people/'))
		.sort((a, b) => a.data.title.localeCompare(b.data.title));

	const places = allPages
		.filter(p => p.id.startsWith('places/'))
		.sort((a, b) => a.data.title.localeCompare(b.data.title));

	const songs = allPages
		.filter(p => p.id.startsWith('songs/'))
		.sort((a, b) => a.data.title.localeCompare(b.data.title));

	// Top-level editorial/utility pages (exclude index.md itself)
	const topLevel = allPages
		.filter(p => !p.id.startsWith('people/') && !p.id.startsWith('places/') && !p.id.startsWith('songs/') && p.id !== 'index')
		.sort((a, b) => a.data.title.localeCompare(b.data.title));

	const lines: string[] = [];

	// ── H1: Project name (required by spec) ─────────────────────────────────
	lines.push('# Bengal Wiki');
	lines.push('');

	// ── Blockquote: Short summary (recommended by spec) ──────────────────────
	lines.push('> Bengal Wiki is a free, open-knowledge digital encyclopedia dedicated to the history, culture, eminent people, prominent places, and legendary songs of the Bengal region. All content is written in clean Markdown and freely accessible. Each article page provides a `.md` endpoint for direct LLM consumption.');
	lines.push('');

	// ── Context notes ────────────────────────────────────────────────────────
	lines.push('Bengal Wiki covers the Bengal region spanning West Bengal (India) and Bangladesh, including biographical profiles of notable historical and contemporary figures, geographic and architectural landmarks, national anthems, patriotic songs, and cultural heritage content.');
	lines.push('');
	lines.push('All article URLs follow the pattern `https://bengal.wiki/{section}/{slug}`. A clean Markdown version of every article is available at the same URL with `.md` appended, e.g. `https://bengal.wiki/people/rabindranath-tagore.md`.');
	lines.push('');

	// ── H2: Eminent People ───────────────────────────────────────────────────
	if (people.length > 0) {
		lines.push('## Eminent People');
		lines.push('');
		for (const page of people) {
			const mdUrl = `${baseUrl}/${page.id}.md`;
			const desc = page.data.description ? `: ${page.data.description}` : '';
			lines.push(`- [${page.data.title}](${mdUrl})${desc}`);
		}
		lines.push('');
	}

	// ── H2: Prominent Places ────────────────────────────────────────────────
	if (places.length > 0) {
		lines.push('## Prominent Places');
		lines.push('');
		for (const page of places) {
			const mdUrl = `${baseUrl}/${page.id}.md`;
			const desc = page.data.description ? `: ${page.data.description}` : '';
			lines.push(`- [${page.data.title}](${mdUrl})${desc}`);
		}
		lines.push('');
	}

	// ── H2: Legendary Songs ─────────────────────────────────────────────────
	if (songs.length > 0) {
		lines.push('## Legendary Songs');
		lines.push('');
		for (const page of songs) {
			const mdUrl = `${baseUrl}/${page.id}.md`;
			const desc = page.data.description ? `: ${page.data.description}` : '';
			lines.push(`- [${page.data.title}](${mdUrl})${desc}`);
		}
		lines.push('');
	}

	// ── H2: Optional — secondary / utility pages ─────────────────────────────
	// The spec defines "Optional" as a special keyword: LLMs can skip if context is limited
	if (topLevel.length > 0) {
		lines.push('## Optional');
		lines.push('');
		for (const page of topLevel) {
			const mdUrl = `${baseUrl}/${page.id}.md`;
			const desc = page.data.description ? `: ${page.data.description}` : '';
			lines.push(`- [${page.data.title}](${mdUrl})${desc}`);
		}
		lines.push('');
	}

	return new Response(lines.join('\n'), {
		status: 200,
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
}
