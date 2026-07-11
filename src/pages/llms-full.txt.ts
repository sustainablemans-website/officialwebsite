// GEO：llms-full.txt — 完整版，含每個服務的完整說明/特色/FAQ 與每篇文章全文
// build 時從 JSON 與 content collections 動態組出，內容更新後自動重生
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import site from '../data/site.json';
import servicesData from '../data/services.json';
import digitalData from '../data/digital-services.json';
import { SITE_URL } from '../lib/schema';

interface ServiceLike {
	slug: string;
	title: string;
	description: string;
	longDescription?: string;
	features?: string[];
	faqs?: { q: string; a: string }[];
}

function renderService(s: ServiceLike, base: string): string {
	const parts = [
		`### ${s.title}`,
		'',
		`網址：${SITE_URL}${base}/${s.slug}/`,
		'',
		s.longDescription || s.description
	];
	if (s.features?.length) {
		parts.push('', '核心特色：', ...s.features.map((f) => `- ${f}`));
	}
	if (s.faqs?.length) {
		parts.push('', '常見問題：');
		for (const f of s.faqs) {
			parts.push('', `**Q：${f.q}**`, `A：${f.a}`);
		}
	}
	return parts.join('\n');
}

export const GET: APIRoute = async () => {
	const articles = await getCollection('articles', ({ data }) => !data.draft);

	const articleSections = articles.map((a) => {
		const slug = a.id.replace(/\.md$/, '').replace(/^\.\//, '');
		return [
			`### ${a.data.title}`,
			'',
			`網址：${SITE_URL}/knowledge/${slug}/`,
			`分類：${a.data.category}`,
			'',
			a.data.description,
			'',
			(a.body ?? '').trim()
		].join('\n');
	});

	const lines = [
		`# ${site.companyName} (${site.companyEnglishName}) — 完整內容`,
		'',
		`> ${site.slogan}。${site.description}`,
		'',
		'## 永續綠色服務',
		'',
		servicesData.services.map((s) => renderService(s, '/green/services')).join('\n\n---\n\n'),
		'',
		'## 數位智慧服務',
		'',
		digitalData.services.map((s) => renderService(s, '/digital/services')).join('\n\n---\n\n'),
		'',
		'## 永續知識庫文章（全文）',
		'',
		articleSections.join('\n\n---\n\n'),
		'',
		'## 聯絡方式',
		'',
		`- 公司：${site.companyName} (${site.companyEnglishName})`,
		`- Email：${site.contact.email}`,
		`- 電話：${site.contact.phone}`,
		`- 地址：${site.contact.address}`,
		`- 官網：${SITE_URL}/`,
		`- 聯絡表單：${SITE_URL}/contact/`,
		''
	];

	return new Response(lines.join('\n'), {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' }
	});
};
