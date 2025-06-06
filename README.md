
# 今天好嗎? - 溫暖陪伴聊天機器人

「今天好嗎?」是一個使用 Google Gemini API 打造的溫暖聊天機器人。它旨在提供一個充滿同理心、支持與溫和建議的對話空間，特別為繁體中文用戶設計，並融入了台灣的在地生活情境。

本專案使用 React、TypeScript、Tailwind CSS 和 Google Gemini API (`@google/genai`) 實現。

## ✨ 功能特色

*   **溫暖同理的回應**：AI 優先以溫暖的語氣表達同理與理解。
*   **正向肯定與鼓勵**：給予用戶正向肯定，提供心理支持。
*   **溫和具體的小建議**：在適當時機提供溫和、簡單、具體的小建議，並以邀請方式提出。
*   **尊重用戶意願**：若用戶只想傾訴，AI 會尊重其意願，僅作陪伴。
*   **情境感知與在地化**：能針對親子、職場、情感等不同場景調整語氣，並融入台灣用語與生活經驗。
*   **極端情緒初步應對**：偵測到極度負面情緒時，會避免給予建議，並溫和提醒尋求專業協助。
*   **模擬長期陪伴**：AI 被設計為能夠記住用戶先前分享的努力方向，並在後續對話中給予支持 (此功能依賴 Gemini API 的上下文處理能力)。
*   **即時串流回覆**：AI 的回覆會以串流方式即時顯示，提升互動體驗。
*   **簡潔美觀的界面**：使用 Tailwind CSS 打造，提供乾淨、響應式的用戶界面。

## 🛠️ 技術棧

*   **前端框架**：React 19
*   **程式語言**：TypeScript
*   **AI 模型 API**：Google Gemini API (`@google/genai`)
*   **樣式**：Tailwind CSS (via CDN)
*   **模組系統**：ES Modules (透過 `index.html` 中的 `importmap` 管理 CDN 依賴)

## 🚀 開始使用

### 環境準備

1.  現代網頁瀏覽器 (如 Chrome, Firefox, Edge, Safari) 支援 ES Modules 和 `importmap`。
2.  若要在本地修改或擴展功能，建議安裝 [Node.js](https://nodejs.org/) (包含 npm) 以便使用相關開發工具 (例如，若未來想加入打包工具)。
3.  一個 Google Gemini API 金鑰。您可以從 [Google AI Studio](https://aistudio.google.com/app/apikey) 取得。

### 本地設置與執行

1.  **複製專案庫**：
    ```bash
    git clone https://github.com/your-username/your-repository-name.git
    cd your-repository-name
    ```

2.  **設定 API 金鑰**：
    本應用程式期望 Gemini API 金鑰透過環境變數 `process.env.API_KEY` 提供給 `services/geminiService.ts`。

    *   **對於 Vercel 部署 (建議)**：您將在 Vercel 的專案設定中設定此環境變數。
    *   **對於純前端本地開發/測試**：
        瀏覽器環境本身無法直接讀取 `process.env`。有幾種方式處理：
        1.  **臨時修改 (不推薦用於正式提交)**：您可以暫時在 `services/geminiService.ts` 中修改 `getApiKey` 函數，直接回傳您的 API 金鑰字串。**請務必不要將含有 API 金鑰的此類修改提交到版本控制系統 (Git)！**
            ```typescript
            // In services/geminiService.ts - FOR LOCAL TESTING ONLY
            const getApiKey = (): string => {
              // const apiKey = process.env.API_KEY; // Original
              const apiKey = "YOUR_ACTUAL_API_KEY_HERE"; // Temporary for local testing
              if (!apiKey) {
                throw new Error("API_KEY environment variable not set.");
              }
              return apiKey;
            };
            ```
        2.  **使用支援環境變數的本地伺服器**：如果您使用如 Vite 或 Create React App 等開發伺服器 (目前專案未使用)，它們通常有機制透過 `.env` 文件加載環境變數。
        3.  **瀏覽器擴充功能**：有些瀏覽器開發者擴充功能允許您為特定網站設定 JavaScript 環境變數。

3.  **執行應用程式**：
    *   最簡單的方式是使用一個本地網頁伺服器來提供 `index.html` 檔案。這有助於避免潛在的檔案路徑或 CORS 問題。許多編輯器 (如 VS Code) 都有 "Live Server" 之類的擴充功能。
    *   或者，您可以使用 Python 內建的 HTTP 伺服器：
        ```bash
        # 在專案根目錄執行 (Python 3)
        python -m http.server
        ```
        然後在瀏覽器中開啟 `http://localhost:8000/`。
    *   如果沒有本地伺服器，直接在瀏覽器中開啟 `index.html` 檔案也可能可以運作，但使用伺服器是更穩健的做法。

## ☁️ 部署到 Vercel

Vercel 非常適合部署此類靜態網站與前端應用。

1.  **將您的專案推送到 GitHub Repository**。
2.  **登入 Vercel** 並選擇 "Add New..." -> "Project"。
3.  **從 GitHub 匯入您的專案**。
4.  **設定專案**：
    *   **Framework Preset**：Vercel 通常能自動偵測。如果沒有，您可以選擇 "Other"。
    *   **Build and Output Settings**：
        *   由於這是一個不需額外構建步驟的靜態 HTML/JS 專案 (JS 是透過瀏覽器直接載入的 ES 模組)，您可以將 Build Command 留空。
        *   Output Directory 通常是根目錄，除非您有特定的構建輸出。此專案應可直接從根目錄提供服務。
    *   **Environment Variables**：這是最重要的步驟！
        *   新增一個環境變數：
            *   **Name**: `API_KEY`
            *   **Value**: 貼上您的 Google Gemini API 金鑰。
5.  **點擊 "Deploy"**。Vercel 將會部署您的應用程式。

部署完成後，Vercel 會提供您一個網址，您的「今天好嗎?」聊天機器人即可在線上使用。

## 📁 專案結構

```
.
├── README.md                 # 本說明文件
├── index.html                # HTML 入口檔案，載入 Tailwind CSS 和 React 腳本
├── index.tsx                 # React 應用程式的主要進入點
├── metadata.json             # 應用程式元數據
├── App.tsx                   # 主要的 React 根組件，管理聊天界面和狀態
├── components/               # 可重用的 React 組件
│   ├── ChatMessage.tsx       # 用於顯示單條聊天訊息的組件
│   └── ChatInput.tsx         # 用於用戶輸入和傳送按鈕的組件
├── services/                 # 與外部服務互動的模組
│   └── geminiService.ts      # 封裝與 Google Gemini API 通訊的邏輯
├── types.ts                  # TypeScript 類型定義
└── constants.ts              # 應用程式常數 (例如 Gemini 模型名稱、系統指令)
```

## 🔑 Gemini API 整合

*   與 Gemini API 的所有互動都封裝在 `services/geminiService.ts` 中。
*   此服務使用 `@google/genai` SDK 來初始化聊天和傳送訊息。
*   聊天機器人的核心行為和語氣很大程度上由 `constants.ts` 中的 `SYSTEM_INSTRUCTION` 定義。若要調整機器人的個性或回應風格，修改此處的指令是關鍵。

## 🤝 貢獻

歡迎提交問題報告 (issues) 或功能請求！如果您想貢獻程式碼，請先開一個 issue 討論您的想法。

## 📝 授權

此專案可考慮使用 MIT License 或其他您選擇的開源授權。
(目前未包含 LICENSE 文件，您可以自行添加一個。)

---

希望這個「今天好嗎?」聊天機器人能為您帶來一些溫暖！
