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
		isFeatured: z.boolean().default(false),
		// 草稿：true 時不出現在列表、路由、RSS、llms.txt（供 AI 草稿管線使用）
		draft: z.boolean().default(false)
	}),
});

export const collections = {
	'articles': articles,
};
