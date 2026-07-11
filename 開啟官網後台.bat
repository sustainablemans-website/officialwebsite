@echo off
chcp 65001 >nul
title 杉蔓官網 一鍵後台
cd /d "%~dp0"

echo ============================================================
echo   杉蔓官網 一鍵後台
echo ============================================================
echo.
echo   接下來會自動：
echo     1. 啟動本機網站伺服器（另開一個黑色視窗，請勿關閉）
echo     2. 等待約 10 秒
echo     3. 自動用瀏覽器開啟後台 http://localhost:4321/admin/index.html
echo.
echo   進入後台後：
echo     - 點「Work with Local Repository」（使用本機儲存庫）
echo     - 選擇這個資料夾（sustainable-mans-official）
echo     - 即可免登入直接編輯，存檔會直接寫入本機檔案
echo.
echo   ※ 請使用 Chrome 或 Edge 瀏覽器（本機模式不支援 Firefox）
echo   ※ 編輯完成後，內容要「上線」仍需 commit + push（可請 AI 代勞）
echo   ※ 全部用完後，把兩個黑色視窗都關掉即可
echo.
echo ============================================================
echo.

if not exist "node_modules" (
    echo [第一次使用] 偵測不到 node_modules，先安裝套件（約需 1~3 分鐘）...
    call npm install
    echo.
)

echo [1/3] 正在啟動本機網站伺服器...
start "杉蔓官網 dev server（請勿關閉）" cmd /c "npx astro dev"

echo [2/3] 等待伺服器啟動（約 10 秒）...
timeout /t 10 /nobreak >nul

echo [3/3] 開啟後台頁面...
start "" "http://localhost:4321/admin/index.html"

echo.
echo 完成！若瀏覽器顯示「無法連線」，請等幾秒後按 F5 重新整理。
echo 若後台網址打不開，請看 dev server 視窗顯示的實際網址（有時埠號不是 4321）。
echo.
pause
