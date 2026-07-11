// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PUBLIC_DIR = fileURLToPath(new URL('./public', import.meta.url));

/**
 * Rehype plugin：Markdown 內文圖片加上 lazy loading 與實際尺寸（避免 CLS）。
 * 僅處理 /public 下的本地圖片；讀不到尺寸時仍會補 loading/decoding。
 */
function rehypeLazyImages() {
	return async (/** @type {any} */ tree) => {
		/** @type {any[]} */
		const imgs = [];
		(function walk(/** @type {any} */ node) {
			if (node.tagName === 'img') imgs.push(node);
			if (node.children) node.children.forEach(walk);
		})(tree);
		if (imgs.length === 0) return;
		const { default: sharp } = await import('sharp');
		for (const node of imgs) {
			node.properties = node.properties || {};
			node.properties.loading ||= 'lazy';
			node.properties.decoding ||= 'async';
			const src = node.properties.src;
			if (typeof src === 'string' && src.startsWith('/') && !node.properties.width) {
				try {
					const meta = await sharp(path.join(PUBLIC_DIR, src)).metadata();
					if (meta.width && meta.height) {
						node.properties.width = meta.width;
						node.properties.height = meta.height;
					}
				} catch {
					/* 外部或不存在的圖片：略過尺寸 */
				}
			}
		}
	};
}

// https://astro.build/config
export default defineConfig({
  site: 'https://www.sustainablemans.com',
  integrations: [sitemap()],
  markdown: {
    rehypePlugins: [rehypeLazyImages]
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      sourcemap: false
    }
  }
});
