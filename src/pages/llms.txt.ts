// GEO：llms.txt — 供生成式引擎（ChatGPT/Perplexity/Gemini）快速理解本站的精簡索引
// build 時從 JSON 與 content collections 動態組出，內容更新後自動重生
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import site from '../data/site.json';
import servicesData from '../data/services.json';
import digitalData from '../data/digital-services.json';
import { SITE_URL } from '../lib/schema';

export const GET: APIRoute = async () => {
	const articles = (await getCollection('articles', ({ data }) => !data.draft)).map((a) => ({
		title: a.data.title,
		url: `${SITE_URL}/knowledge/${a.id.replace(/\.md$/, '').replace(/^\.\//, '')}/`
	}));

	const greenServices = servicesData.services.map(
		(s) => `### ${s.title}\n${s.description}\n${SITE_URL}/green/services/${s.slug}/`
	);
	const digitalServices = digitalData.services.map(
		(s) => `### ${s.title}\n${s.description}\n${SITE_URL}/digital/services/${s.slug}/`
	);

	const lines = [
		`# ${site.companyName} (${site.companyEnglishName})`,
		'',
		`> ${site.slogan}。${site.description}`,
		'',
		`杉蔓有限公司是台灣的永續與數位雙軸轉型顧問公司，總部位於高雄。服務分為兩大主軸（雙翼）：`,
		'',
		`- **永續綠色服務（Green Wing）**：${SITE_URL}/green/ — 碳盤查、碳足跡、ESG 顧問與空調專利節能技術`,
		`- **數位智慧服務（Digital Wing）**：${SITE_URL}/digital/ — AI 導入顧問、網站設計與數位行銷`,
		'',
		'## 永續綠色服務',
		'',
		greenServices.join('\n\n'),
		'',
		'## 數位智慧服務',
		'',
		digitalServices.join('\n\n'),
		'',
		'## 永續知識庫文章',
		'',
		articles.map((a) => `- [${a.title}](${a.url})`).join('\n'),
		'',
		'## 聯絡方式',
		'',
		`- 公司：${site.companyName} (${site.companyEnglishName})`,
		`- Email：${site.contact.email}`,
		`- 電話：${site.contact.phone}`,
		`- 地址：${site.contact.address}`,
		`- 官網：${SITE_URL}/`,
		`- 聯絡表單：${SITE_URL}/contact/`,
		'',
		`完整內容版本：${SITE_URL}/llms-full.txt`,
		''
	];

	return new Response(lines.join('\n'), {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' }
	});
};
