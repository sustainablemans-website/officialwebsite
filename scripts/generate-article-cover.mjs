// 文章封面自動生成器
// 用法：node scripts/generate-article-cover.mjs <文章slug>
// 讀取 src/content/articles/<slug>.md 的 frontmatter（title/category/accent），
// 產生品牌化封面 public/images/articles/<slug>.webp（1200x675，<150KB）。
// 供每週 AI 產文管線與手動補圖使用。設計語言對齊官網雙翼視覺。

import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const slug = process.argv[2];
if (!slug) {
	console.error('用法：node scripts/generate-article-cover.mjs <文章slug>');
	process.exit(1);
}

const mdPath = path.join('src/content/articles', `${slug}.md`);
if (!fs.existsSync(mdPath)) {
	console.error(`找不到文章：${mdPath}`);
	process.exit(1);
}

// 讀 frontmatter（簡易解析，僅取需要欄位）
const raw = fs.readFileSync(mdPath, 'utf8');
const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
const get = (key) =>
	fm.match(new RegExp(`^${key}:\\s*["']?(.*?)["']?\\s*$`, 'm'))?.[1] ?? '';
const title = get('title');
const category = get('category') || '永續知識';
const accent = get('accent') || 'emerald';

// 依 accent 對應雙翼色系（emerald/green 系 → 永續翼；blue/indigo/violet → 數位翼）
const palettes = {
	green: { primary: '#3ecf8e', glow: 'rgba(62,207,142,0.35)', canvasA: '#04130d', canvasB: '#021a15' },
	digital: { primary: '#828fff', glow: 'rgba(94,106,210,0.40)', canvasA: '#0b0b14', canvasB: '#010102' },
};
const isDigital = ['blue', 'indigo', 'violet', 'blue-accent'].includes(accent);
const p = isDigital ? palettes.digital : palettes.green;

// 標題斷行：去掉【】前綴標籤另行顯示，正文每行約 13 字、最多 3 行
const tagMatch = title.match(/^【(.+?)】\s*(.*)$/);
const eyebrow = tagMatch ? tagMatch[1] : category;
const mainTitle = tagMatch ? tagMatch[2] : title;
const wrap = (text, perLine = 13, maxLines = 3) => {
	const lines = [];
	let rest = text;
	while (rest.length && lines.length < maxLines) {
		lines.push(rest.slice(0, perLine));
		rest = rest.slice(perLine);
	}
	if (rest.length) lines[maxLines - 1] = lines[maxLines - 1].slice(0, perLine - 1) + '…';
	return lines;
};
const lines = wrap(mainTitle);
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const W = 1200, H = 675;
const titleSvg = lines
	.map((l, i) => `<text x="90" y="${330 + i * 84}" font-size="60" font-weight="700" fill="#f7f8f8" letter-spacing="1">${esc(l)}</text>`)
	.join('\n');

const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg" font-family="Microsoft JhengHei, Noto Sans TC, PingFang TC, sans-serif">
	<defs>
		<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
			<stop offset="0" stop-color="${p.canvasA}"/><stop offset="1" stop-color="${p.canvasB}"/>
		</linearGradient>
		<radialGradient id="glow" cx="0.85" cy="0.15" r="0.9">
			<stop offset="0" stop-color="${p.glow}"/><stop offset="0.6" stop-color="rgba(0,0,0,0)"/>
		</radialGradient>
		<pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
			<path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
		</pattern>
	</defs>
	<rect width="${W}" height="${H}" fill="url(#bg)"/>
	<rect width="${W}" height="${H}" fill="url(#grid)"/>
	<rect width="${W}" height="${H}" fill="url(#glow)"/>
	<rect x="90" y="196" width="56" height="4" fill="${p.primary}"/>
	<text x="90" y="248" font-size="26" font-weight="700" fill="${p.primary}" letter-spacing="6">${esc(eyebrow)}</text>
	${titleSvg}
	<text x="90" y="${H - 64}" font-size="22" font-weight="700" fill="rgba(255,255,255,0.55)" letter-spacing="4">SUSTAINABLE MAN｜杉蔓有限公司</text>
	<rect x="0" y="${H - 8}" width="${W}" height="8" fill="${p.primary}"/>
</svg>`;

const outPath = path.join('public/images/articles', `${slug}.webp`);
const info = await sharp(Buffer.from(svg), { density: 96 }).webp({ quality: 85 }).toFile(outPath);
console.log(`已生成 ${outPath}（${info.width}x${info.height}，${Math.round(info.size / 1024)}KB）`);
console.log(`frontmatter 請設：image: "/images/articles/${slug}.webp"`);
