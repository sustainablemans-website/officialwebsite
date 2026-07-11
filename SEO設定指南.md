# SEO 設定指南（給 Feba）

這份文件說明：網站上線後，你需要**手動做一次**的搜尋引擎設定，以及哪些東西**已經全自動**、完全不用你維護。

---

## 一、已經全自動的部分（不用做任何事）

只要內容有更新並 push 到 GitHub，Vercel 會自動重新建置，以下所有東西都會**自動重生**：

| 項目 | 網址 | 作用 |
|---|---|---|
| Sitemap（網站地圖） | `https://www.sustainablemans.com/sitemap-index.xml` | 告訴 Google 全站有哪些頁面 |
| robots.txt | `https://www.sustainablemans.com/robots.txt` | 告訴搜尋引擎哪些可以抓（後台 /admin/ 不給抓） |
| llms.txt | `https://www.sustainablemans.com/llms.txt` | 給 ChatGPT、Perplexity、Gemini 等 AI 讀的網站精簡索引 |
| llms-full.txt | `https://www.sustainablemans.com/llms-full.txt` | AI 專用完整版：所有服務細節 + 文章全文 |
| RSS | `https://www.sustainablemans.com/rss.xml` | 知識庫文章訂閱源 |
| 結構化資料（JSON-LD） | 藏在每一頁的 HTML 裡 | 讓 Google 顯示公司資訊、FAQ、麵包屑等豐富搜尋結果 |

具體來說：

- **新增或修改文章**（`src/content/articles/` 或後台）→ 文章頁、知識庫列表、sitemap、RSS、llms.txt 全部自動更新
- **修改服務內容**（`src/data/services.json` / `digital-services.json`）→ 服務頁、FAQ、結構化資料、llms.txt 全部自動更新
- **修改聯絡資訊**（`src/data/site.json`）→ 全站公司資訊（含 Google 用的結構化資料）自動更新

### 文章草稿功能

文章的開頭資訊（frontmatter）加上一行 `draft: true`，這篇文章就**完全不會出現在網站上**——沒有網址、不在列表、不在 RSS、不在 llms.txt。要發布時把這行刪掉（或改成 `false`）再 push 即可。

```yaml
---
title: "文章標題"
description: "文章摘要"
category: "碳管理入門"
draft: true   # ← 加這行 = 草稿；刪掉 = 發布
---
```

---

## 二、需要你手動做一次：Google Search Console

Google Search Console（GSC）是 Google 官方的免費工具，用來：確認網站有被 Google 收錄、提交 sitemap、看搜尋成效。

### 步驟 1：登入

1. 打開 <https://search.google.com/search-console>
2. 用公司的 Google 帳號登入

### 步驟 2：新增資源（驗證你是網站擁有者）

1. 左上角「新增資源」
2. 選右邊的「**網址前置字元**」，輸入 `https://www.sustainablemans.com`
3. 驗證方式建議選「**HTML 標記**」以外的方式——因為網站放在 Vercel，最簡單的是：
   - 如果網域是在 Vercel 管理：選「**網域**」方式，Google 會給你一筆 TXT 紀錄，到 Vercel 的 Domains → DNS 設定裡新增這筆 TXT 紀錄，回 GSC 按「驗證」。
   - 或選「**HTML 檔案**」：下載 Google 給的驗證檔，請工程師放到網站的 `public/` 資料夾後 push，再回 GSC 按「驗證」。

### 步驟 3：提交 Sitemap

1. 驗證成功後，左側選單點「**Sitemap**」
2. 在「新增 Sitemap」欄位輸入：`sitemap-index.xml`
3. 按「提交」
4. 狀態顯示「成功」即完成（有時要等幾小時到一兩天）

**這個動作只需要做一次。** 之後每次網站更新，Google 會自動來抓最新的 sitemap。

### 步驟 4：確認收錄狀況（之後偶爾看看）

- 左側「**網頁**」（索引 → 網頁）：看有多少頁已被 Google 收錄。全站共 26 頁，收錄需要數天到數週，是正常的。
- 快速檢查單一頁面：在 Google 搜尋框輸入 `site:www.sustainablemans.com`，看會列出哪些頁。
- 左側「**成效**」：看網站在 Google 搜尋的曝光次數、點擊次數、熱門關鍵字。

---

## 三、需要你手動做一次：Bing Webmaster Tools

Bing 是微軟的搜尋引擎，**ChatGPT 的網頁搜尋主要用 Bing 的索引**，所以這一步對「讓 AI 找到我們」特別重要。

1. 打開 <https://www.bing.com/webmasters>
2. 用 Microsoft 帳號（或直接用 Google 帳號）登入
3. 最省事的方式：選「**從 Google Search Console 匯入**」——前面 GSC 做完後，一鍵把驗證與 sitemap 全部帶過來
4. 如果不匯入，就手動「新增網站」輸入 `https://www.sustainablemans.com`，依指示驗證（DNS 或檔案方式，同 GSC）
5. 到左側「Sitemap」確認 `https://www.sustainablemans.com/sitemap-index.xml` 已提交

---

## 四、生成式引擎（GEO）怎麼運作

ChatGPT、Perplexity、Gemini 這些 AI 回答問題時會參考網站內容。我們已經做了：

1. **llms.txt / llms-full.txt**：AI 界正在採用的標準，等於「給 AI 看的網站說明書」。AI 爬蟲來的時候能一次讀懂：公司是誰、有哪 8 項服務、有哪些文章、怎麼聯絡。
2. **FAQ 結構化資料**：每個服務頁的常見問答，用 Google 與 AI 都認得的格式（FAQPage schema）標記，AI 引用時能直接抓到問答。
3. **robots.txt 開放所有爬蟲**：包含 GPTBot、PerplexityBot、Google-Extended 等 AI 爬蟲都可以抓取。

**你不需要額外做什麼**，AI 引擎會自己來抓。想加速的話，可以偶爾在 ChatGPT / Perplexity 問「杉蔓有限公司是做什麼的？」看它有沒有引用到官網，通常上線後一至數週會開始出現。

---

## 五、常見問題

**Q：我改了文章 / 服務內容，需要重新提交 sitemap 嗎？**
不用。push 之後全部自動重生，Google 會定期自己來抓。

**Q：怎麼知道某一頁有沒有被 Google 收錄？**
GSC 上方搜尋框貼上該頁完整網址，會顯示「已建立索引」或「未建立索引」。未收錄可以按「要求建立索引」催一下。

**Q：新文章多久會出現在 Google？**
通常幾天到兩週。想加速：在 GSC 用「要求建立索引」提交該篇網址。

**Q：需要付費買 SEO 工具嗎？**
不需要。GSC 和 Bing Webmaster Tools 都免費，且已足夠。
