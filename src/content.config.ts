import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const pages = defineCollection({
	loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/pages" }),
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		image: z.string().optional(),
		image_type: z.enum(['person', 'monument', 'nature', 'map', 'song', 'generic', 'business', 'book']).optional(),
		image_caption: z.string().optional(),
		facts: z.record(z.string()).optional(),
		categories: z.array(z.string()).optional(),
	}),
});

export const collections = { pages };
