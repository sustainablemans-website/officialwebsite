# 杉蔓有限公司網站更新手冊 (Update Guide)

這份手冊將指引您如何自行更新網站內容（例如：修改聯絡資訊、調整服務項目、新增案例文章），而不需要透過 AI 助理協助。

## 🚀 快速上手：預覽您的修改

在開始編輯之前，建議先在本地環境預覽修改結果：

1.  **開啟終端機 (Terminal)**：在 VS Code 中按下 `Ctrl + ~`。
2.  **進入專案目錄**：在終端機輸入 `cd sustainable-mans-official` 並按 Enter。
3.  **啟動開發伺服器**：輸入 `npm run dev` 並按 Enter。
4.  **查看網頁**：在瀏覽器開啟 `http://localhost:4321`，您所做的任何存檔修改都會即時顯示在這裡。

---

## 🛠️ 修改基本資訊 (聯絡電話、Email、社群連結)

所有全站通用的資訊都儲存在 `src/data/site.json` 中。

-   **檔案位置**: `src/data/site.json`
-   **可修改欄位**:
    -   `companyName`: 公司名稱
    -   `slogan`: 標語（顯示在首頁大標）
    -   `contact`: 包含 `email`, `phone`, `address`
    -   `social`: 各個社群平台的網址
    -   `footer`: 頁尾的版權宣告文字

> [!IMPORTANT]
> **注意 JSON 格式**：請務必保留引號 `"` 與逗號 `,`。如果不小心刪掉括號或逗號，網站會報錯。

---

## 💼 修改服務項目 (Services)

首頁的服務卡片內容儲存在 `src/data/services.json`。

-   **檔案位置**: `src/data/services.json`
-   **如何新增**: 複製一個 `{ ... }` 區塊，貼在最後一個項目的後面（記得在前面的項目補上逗號）。
-   **欄位說明**:
    -   `title`: 服務名稱
    -   `description`: 詳細描述
    -   `icon`: 使用的圖示名稱（支援 Lucide 圖示）
    -   `accent`: 顏色風格（如 `emerald`, `blue`, `yellow`, `purple`）
    -   `isFlagship`: 若設為 `true`，該項目會顯示為大卡片。

---

## 📝 新增或編輯文章 (Knowledge / Case Studies)

文章使用 Markdown 格式編寫，非常直覺。

-   **目錄位置**: `src/content/articles/`
-   **新增文章步驟**:
    1.  在該目錄下建立一個新檔案，副檔名為 `.md`（例如：`new-case-study.md`）。
    2.  複製現有文章頂部的「前綴資訊 (Frontmatter)」：
        ```markdown
        ---
        title: "您的標題"
        category: "分類名稱"
        description: "簡短摘要"
        accent: "emerald"
        ---
        ```
    3.  在 `---` 下方開始撰寫您的內容。
-   **編輯現有文章**: 直接打開對應的 `.md` 檔案修改文字即可。

---

## 🤝 修改合作夥伴 (Partners)

-   **檔案位置**: `src/data/partners.json`
-   **操作**: 這裡存放合作單位的名稱。

---

## 📤 儲存並發佈 (Deployment)

當您在本地預覽滿意後，請執行以下步驟將修改推送到線上：

1.  **開啟 Git 面板**：在 VS Code 左側點擊「原始檔控制 (Source Control)」。
2.  **提交修改 (Commit)**：輸入您的更新說明（例如：「更新聯絡電話」），點擊「提交 (Commit)」。
3.  **同步變更 (Push)**：點擊「同步變更」或「推送到遠端」。
4.  **自動發佈**：您的網站（預設為 Vercel）會自動感應到更新並在 1-2 分鐘內完成發佈。

---

## ❓ 常見問題 Q&A

**Q: 如果修改後網站壞掉了怎麼辦？**
A: 使用 VS Code 的 `Ctrl + Z` 撤銷修改，或在 Git 面板點擊「捨棄變更 (Discard Changes)」即可恢復到修改前的狀態。

**Q: 如何更換圖片？**
A: 將新圖片放入 `public/images/` 目錄下，然後在代碼中引用該路徑即可。

**Q: 我可以修改頁面排版嗎？**
A: 排版邏輯位於 `src/pages/` 與 `src/components/` 底下的 `.astro` 檔案中。這部分涉及 HTML 與 CSS，若不熟悉建議小心修改。
