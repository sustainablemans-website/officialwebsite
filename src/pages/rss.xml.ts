// RSS：全部非 draft 文章，供訂閱器與生成式引擎抓取
import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import site from '../data/site.json';
import { SITE_URL } from '../lib/schema';

export const GET: APIRoute = async (context) => {
	const articles = await getCollection('articles', ({ data }) => !data.draft);

	return rss({
		title: `永續知識庫 | ${site.companyName}`,
		description: '淨零轉型、碳管理與 ESG 趨勢的深度解析——杉蔓永續知識專刊。',
		site: context.site ?? SITE_URL,
		items: articles.map((a) => {
			const slug = a.id.replace(/\.md$/, '').replace(/^\.\//, '');
			return {
				title: a.data.title,
				description: a.data.description,
				link: `/knowledge/${slug}/`,
				pubDate: a.data.pubDate,
				categories: [a.data.category]
			};
		}),
		customData: '<language>zh-tw</language>'
	});
};
