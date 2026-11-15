# Tetris — 仕様書

## 概要

React + TypeScript でブラウザベースのテトリスゲームを構築する。
PC でのみ動作を想定し、localStorage にハイスコアを保存する。

---

## 技術スタック

| 項目 | バリデーション |
|------|----------------|
| フレームワーク | [React 19](https://react.dev) + [TypeScript](https://typescriptlang.org) |
| ビルドツール | [Vite 6](https://vitejs.dev) |
| スタイル | [Tailwind CSS 4](https://tailwindcss.com) |
| 保存 | `localStorage` |
| テスト | Playwright + TypeScript |

---

## ゲーム仕様

### 盤面

| 項目 | 値 |
|------|-----|
| 横幅 | 10 マス |
| 縦幅 | 20 マス |
| 外枠 | 12 × 22（左右1マス、上下1マスのウォール） |

### テトリミノ

| 名前 | 形状 |
|------|------|
| I | `||||` |
| O | `[][]` |
| T | ` T ` `TTT` |
| S | ` .S. ` ` SS ` |
| Z | ` Z. ` ` ZZ ` |
| J | `J .` `JJJ` |
| L | `L .` `LLL` |

7 種類を 1 セットとし、7 バギンダー（bag randomizer）で出現順序を制御する。

### 操作方法（キーボード）

| キー | 動作 |
|------|------|
| ← / → | 左右移動 |
| ↓ | ソフトドロップ |
| Space | ハードドロップ |
| Z / Ctrl | カウントerclock（左回転） |
| X / ↑ | クロック（右回転） |
| P | ポーズ |

### スコア

| 条件 | ポイント |
|------|----------|
| 1 ライン消去 | 100 |
| 2 ライン消去 | 300 |
| 3 ライン消去 | 500 |
| 4 ライン消去 | 800 |
| ソフトドロップ | 1 ポイント/マス |
| ハードドロップ | 2 ポイント/マス |
| テトリス（4 ライン同時） | ボーナス |

### ゲームオーバー

- 積み上がったテトリミノが画面上端に達するとゲームオーバー。
- ゲームオーバー時はスコアとハイスコアを比較し、更新時は `localStorage` に保存。

---

## UI / コンポーネント構成

```
App
├── Header
│   ├── Title
│   ├── Score
│   └── HighScore
├── GameBoard
│   ├── Grid
│   └── NextPiece (プレビュー)
├── Controls
│   └── Start / Pause / Reset
└── GameOverOverlay
```

### 各画面

| ページ | 内容 |
|--------|------|
| Title | タイトル画面、「Start」ボタン |
| Game | ゲームボード、スコア、操作ガイド |
| Game Over | スコア表示、ハイスコア、Retry ボタン |

---

## デザイン

- **ダークモード対応** — `prefers-color-scheme` に従い自動切替、または手動トグル
- **モダンでミニマル** — 余白を重視、角丸、シャドウ
- **アニメーション** — ライン消去時にフェードアウト、ピース落下時にスライド
- **レスポンシブ** — PC 中心だが、タブレットでも表示可能

---

## 保存仕様（localStorage）

| キー | 値 |
|------|-----|
| `tetris.highScore` | ハイスコア（数値） |
| `tetris.darkMode` | `true` / `false`（手動トグル時のみ） |

### ルール

- ハイスコアはゲームオーバー時に自動保存
- 読み込み時は `App` の初期化時に復元
- 値は JSON 文字列、または `JSON.parse` で安全にパース

---

## ステート管理

- `useState` / `useReducer` でローカル状態管理
- カスタムフック（`useInterval`, `useGameLoop`）でゲームループを抽象化
- 状態遷移図は TSDoc で明記

---

## 実装フェーズ

| フェーズ | タスク |
|----------|--------|
| 1 | `npm create vite@latest . -- --template react-ts` + Tailwind CSS 導入 |
| 2 | セットアップ（eslint, prettier, Playwright） |
| 3 | 盤面表示（Grid コンポーネント） |
| 4 | テトリミノ描画・回転・移動 |
| 5 | ドロップループ（`useInterval`） |
| 6 | ライン消去・スコア計算 |
| 7 | ゲームオーバー判定 |
| 8 | localStorage（ハイスコア） |
| 9 | UI Polish（アニメーション、ダークモード） |
| 10 | Playwright テスト |

---

## ファイル構成（予定）

```
src/
├── components/
│   ├── GameBoard.tsx
│   ├── Grid.tsx
│   ├── Score.tsx
│   ├── NextPiece.tsx
│   ├── Controls.tsx
│   ├── GameOverOverlay.tsx
│   └── ...
├── hooks/
│   ├── useGameLoop.ts
│   ├── useInterval.ts
│   └── ...
├── lib/
│   ├── tetromino.ts
│   ├── board.ts
│   ├── scoring.ts
│   └── storage.ts
├── styles/
│   └── globals.css
├── App.tsx
└── main.tsx
```

---

## テスト項目（Playwright）

- [ ] キー入力でピースが正しく移動する
- [ ] ライン消去でスコアが増加する
- [ ] ゲームオーバーでハイスコアが保存される
- [ ] ダークモードが正しく切替する
- [ ] ページリロード後もハイスコアが保持される

---

## 制約

- PC 限定（タッチ操作なし）
- 外部ライブラリは最小限（ゲームロジックのみ）
- TypeScript Strict Mode 有効
