# bible-verse-404-

安靜的靜態 404 頁。每次顯示一句**新標點和合本（繁體）**與 **King James Version**，並配上一張主題相近的 Unsplash 風景。`index.html` 與 `404.html` 內容相同，可直接交給 GitHub Pages 作為自訂 404。

純 HTML / CSS / JavaScript，沒有建置步驟。

## 啟用 GitHub Pages

1. 打開此儲存庫的 **Settings**。
2. 左側選 **Pages**。
3. 在 **Build and deployment** 裡，**Source** 選 **Deploy from a branch**。
4. **Branch** 選 `main`，資料夾選 **`/ (root)`**，然後儲存。
5. 等部署完成。網站位址是：

<https://breezyjack459.github.io/bible-verse-404-/>

儲存庫名稱結尾有一個連字號，網址也要保留它。根目錄的 `.nojekyll` 讓 Pages 直接送出檔案，不經 Jekyll 處理。

## 本機預覽

在儲存庫根目錄執行：

```bash
python3 -m http.server 8000
```

然後打開 <http://127.0.0.1:8000/> 。`404.html` 可從 <http://127.0.0.1:8000/404.html> 直接看。Python 內建伺服器不會把找不到的路徑改送 `404.html`；GitHub Pages 會。

## 查詢參數

用 `v` 固定某一句，重新整理仍是同一句：

- `/?v=genesis-1-3` — 以經文 id 指定
- `/?v=0` — 以清單索引指定，`0` 是創世記 1:1，`1` 是創世記 1:3

id 一覽：

| 索引 | id |
| --- | --- |
| 0 | `genesis-1-1` |
| 1 | `genesis-1-3` |
| 2 | `numbers-6-24` |
| 3 | `joshua-1-9` |
| 4 | `psalm-19-1` |
| 5 | `psalm-23-1` |
| 6 | `psalm-23-4` |
| 7 | `psalm-27-1` |
| 8 | `psalm-34-8` |
| 9 | `psalm-46-1` |
| 10 | `psalm-91-1` |
| 11 | `psalm-119-105` |
| 12 | `psalm-121-1` |
| 13 | `psalm-139-14` |
| 14 | `proverbs-3-5` |
| 15 | `ecclesiastes-3-1` |
| 16 | `isaiah-26-3` |
| 17 | `isaiah-40-31` |
| 18 | `isaiah-41-10` |
| 19 | `jeremiah-29-11` |
| 20 | `lamentations-3-22` |
| 21 | `micah-6-8` |
| 22 | `matthew-5-9` |
| 23 | `matthew-5-14` |
| 24 | `matthew-6-26` |
| 25 | `matthew-11-28` |
| 26 | `matthew-28-20` |
| 27 | `john-3-16` |
| 28 | `john-8-12` |
| 29 | `john-14-6` |
| 30 | `romans-8-28` |
| 31 | `romans-15-13` |
| 32 | `1-corinthians-13-4` |
| 33 | `philippians-4-13` |
| 34 | `2-timothy-1-7` |
| 35 | `revelation-21-4` |

按 **換一句** 會清掉 `v`，接著從這個分頁尚未讀過的句子繼續。順序存在 `sessionStorage`。36 句走完後重新洗牌，且不會把剛剛那句排在下一句。

## 檔案

- `index.html` — 示範頁
- `404.html` — 與首頁相同，供 GitHub Pages 自訂 404
- `css/style.css` — 版面：寬螢幕左圖右文，窄螢幕圖在上、文在下
- `js/verses.js` — 36 句經文、主題標籤、Unsplash 相片 id
- `js/app.js` — 洗牌輪替、查詢參數、圖片載入失敗時改顯示主題色塊
- `favicon.svg`
- `.nojekyll`

圖片網址使用固定的 `images.unsplash.com/photo-…?auto=format&fit=crop&w=…`，沒有簽章參數。圖片載不到時，左側改為該句主題的純色，經文仍在。
