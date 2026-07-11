// scripts/optimize-images.mjs
// 批次圖片優化：public/images/** 與 public/*.png 大圖轉 WebP 並縮至合理上限。
// 用法：node scripts/optimize-images.mjs
// - 各類別最大寬度：hero/內容大圖 1600、服務/文章封面 1200、活動/gallery 1000、夥伴 400、團隊 600
// - 品質 ~80，輸出 .webp 同目錄同名
// - 另產出：/logo-192.png（favicon 用，<20KB）、/images/logo.webp（header/footer 用）、/images/og.jpg（og:image 用，1200x630 <200KB）
// - 不動：public/favicon*、public/images/uploads/、public/admin/
import { readdir, stat, mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(process.cwd(), 'public');
const QUALITY = 80;

/** 依路徑決定最大寬度 */
function maxWidthFor(relPath) {
  const p = relPath.replace(/\\/g, '/');
  if (p.startsWith('images/partners/')) return 400;
  if (p.startsWith('images/team/')) return 600;
  if (p.startsWith('images/activities/')) return 1000;
  // 服務子資料夾（esg-game / green-expo / msrdk）為 gallery 照片
  if (/^images\/services\/[^/]+\//.test(p)) return 1000;
  // 服務封面與文章圖
  if (p.startsWith('images/services/') || p.startsWith('images/articles/')) return 1200;
  // 其餘（hero_2026 / about / bg-ai / mockup-esg / msrdk_solution / logo 等內容大圖）
  return 1600;
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const rel = path.relative(ROOT, full).replace(/\\/g, '/');
      if (rel === 'admin' || rel === 'images/uploads') continue; // 不動
      yield* walk(full);
    } else {
      yield full;
    }
  }
}

const results = [];
for await (const file of walk(ROOT)) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  if (!/\.(png|jpe?g)$/i.test(rel)) continue;
  if (/^favicon/i.test(path.basename(rel))) continue; // favicon 系列不動
  // 只處理 images/**（根目錄 logo.png 由下方特製資產個別處理，避免產生無引用的 logo.webp）
  if (!rel.startsWith('images/')) continue;

  const maxW = maxWidthFor(rel);
  const out = file.replace(/\.(png|jpe?g)$/i, '.webp');
  const img = sharp(file);
  const meta = await img.metadata();
  const width = Math.min(meta.width ?? maxW, maxW);
  await img
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(out);
  const before = (await stat(file)).size;
  const after = (await stat(out)).size;
  results.push({ rel, before, after, width });
}

// 特製資產 -------------------------------------------------------------
// 1) /logo-192.png：favicon / apple-touch-icon 用（192x192 PNG）
await sharp(path.join(ROOT, 'logo.png'))
  .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ compressionLevel: 9, palette: true, quality: 70, colors: 128 })
  .toFile(path.join(ROOT, 'logo-192.png'));

// 2) /images/logo.webp：Header/Footer/入口頁 logo（顯示 ≤64px，輸出 200px 寬）
await sharp(path.join(ROOT, 'images', 'logo.png'))
  .resize({ width: 200, withoutEnlargement: true })
  .webp({ quality: QUALITY })
  .toFile(path.join(ROOT, 'images', 'logo.webp'));

// 3) /images/og.jpg：og:image 專用 1200x630（jpg 相容性佳，<200KB）
await sharp(path.join(ROOT, 'images', 'hero_2026.png'))
  .resize(1200, 630, { fit: 'cover' })
  .jpeg({ quality: 78, progressive: true })
  .toFile(path.join(ROOT, 'images', 'og.jpg'));

// 報表 ------------------------------------------------------------------
let tb = 0, ta = 0;
for (const r of results.sort((a, b) => b.before - a.before)) {
  tb += r.before; ta += r.after;
  console.log(`${(r.before / 1024).toFixed(0).padStart(5)}K -> ${(r.after / 1024).toFixed(0).padStart(5)}K  (w${r.width})  ${r.rel}`);
}
for (const extra of ['logo-192.png', 'images/logo.webp', 'images/og.jpg']) {
  const s = (await stat(path.join(ROOT, extra))).size;
  console.log(`extra: ${extra} = ${(s / 1024).toFixed(0)}K`);
}
console.log(`TOTAL: ${(tb / 1048576).toFixed(1)}MB -> ${(ta / 1048576).toFixed(1)}MB (${results.length} files)`);
