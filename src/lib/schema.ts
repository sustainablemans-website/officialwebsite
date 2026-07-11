// 集中管理 JSON-LD 結構化資料（schema.org）產生器
// 所有頁面共用，資料來源為 src/data/*.json 與 content collections，不寫死內容
import site from '../data/site.json';

export const SITE_URL = 'https://www.sustainablemans.com';

/** 全站 Organization + LocalBusiness（注入於 Layout，每頁都有） */
export function organizationSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': ['Organization', 'LocalBusiness', 'ProfessionalService'],
		'@id': `${SITE_URL}/#organization`,
		name: `${site.companyName} (${site.companyEnglishName})`,
		alternateName: site.companyEnglishName,
		url: `${SITE_URL}/`,
		logo: `${SITE_URL}/logo-192.png`,
		image: `${SITE_URL}/logo-192.png`,
		description: site.description,
		slogan: site.slogan,
		email: site.contact.email,
		telephone: site.contact.phone,
		address: {
			'@type': 'PostalAddress',
			addressCountry: 'TW',
			addressLocality: '楠梓區',
			addressRegion: '高雄市',
			streetAddress: '秀群路499巷28號'
		},
		areaServed: 'Taiwan',
		knowsAbout: [
			'Carbon Management',
			'ESG Consultancy',
			'ISO 14064',
			'Net Zero Transition',
			'Digital Transformation',
			'AI Consulting'
		],
		sameAs: Object.values(site.social)
	};
}

interface ServiceLike {
	slug: string;
	title: string;
	description: string;
	longDescription?: string;
	faqs?: { q: string; a: string }[];
}

/** 服務內頁 Service schema */
export function serviceSchema(service: ServiceLike, base: string) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Service',
		'@id': `${SITE_URL}${base}/${service.slug}/#service`,
		name: service.title,
		description: service.longDescription || service.description,
		url: `${SITE_URL}${base}/${service.slug}/`,
		provider: {
			'@type': 'Organization',
			'@id': `${SITE_URL}/#organization`,
			name: `${site.companyName} (${site.companyEnglishName})`,
			url: `${SITE_URL}/`
		},
		areaServed: 'Taiwan'
	};
}

/** 服務內頁 FAQPage schema（內容必須同時可見於 HTML） */
export function faqSchema(faqs: { q: string; a: string }[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqs.map((f) => ({
			'@type': 'Question',
			name: f.q,
			acceptedAnswer: { '@type': 'Answer', text: f.a }
		}))
	};
}

/** 麵包屑 BreadcrumbList schema */
export function breadcrumbSchema(items: { name: string; path: string }[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: item.name,
			item: `${SITE_URL}${item.path}`
		}))
	};
}

/** 文章頁 Article schema */
export function articleSchema(article: {
	title: string;
	description: string;
	pubDate?: Date;
	image?: string;
	path: string;
}) {
	const ld: Record<string, unknown> = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: article.title,
		description: article.description,
		url: `${SITE_URL}${article.path}`,
		mainEntityOfPage: `${SITE_URL}${article.path}`,
		inLanguage: 'zh-TW',
		author: {
			'@type': 'Organization',
			'@id': `${SITE_URL}/#organization`,
			name: `${site.companyName} (${site.companyEnglishName})`
		},
		publisher: {
			'@type': 'Organization',
			'@id': `${SITE_URL}/#organization`,
			name: `${site.companyName} (${site.companyEnglishName})`,
			logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo-192.png` }
		}
	};
	if (article.pubDate) ld.datePublished = article.pubDate.toISOString();
	if (article.image) ld.image = `${SITE_URL}${article.image}`;
	return ld;
}

/** 知識庫列表 CollectionPage schema */
export function collectionPageSchema(articles: { title: string; path: string }[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: '永續知識庫 | 杉蔓有限公司',
		description: '淨零轉型、碳管理與 ESG 趨勢的深度解析——杉蔓永續知識專刊。',
		url: `${SITE_URL}/knowledge/`,
		inLanguage: 'zh-TW',
		isPartOf: { '@type': 'WebSite', url: `${SITE_URL}/`, name: site.companyName },
		mainEntity: {
			'@type': 'ItemList',
			itemListElement: articles.map((a, i) => ({
				'@type': 'ListItem',
				position: i + 1,
				name: a.title,
				url: `${SITE_URL}${a.path}`
			}))
		}
	};
}
