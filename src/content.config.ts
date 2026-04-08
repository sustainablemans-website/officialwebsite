import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "src/content/articles" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.date().optional(),
		category: z.string(),
		image: z.string().optional(),
		accent: z.string().optional(),
		isFeatured: z.boolean().default(false)
	}),
});

export const collections = {
	'articles': articles,
};
