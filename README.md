# 多肢選択式クイズアプリ

## 概要

このプロジェクトは、CSV ファイルから読み込んだ問題を出題する多肢選択式クイズアプリです。Next.js、Jotai、Tailwind CSS を使用して構築されています。
今回は、AI にコード生成をお願いし、9 割 9 分くらい AI に実装してもらっています。
そのため、コンポーネントやコードの分割などには着手できていない状態です(今後の課題)。

## 機能

- **分野選択（トップ画面）**
  - IT 分野、顧客分野、商品分野から出題する分野を選択します。
  - 選択後「カテゴリを選択して試験へ」でカテゴリ選択画面へ進みます。
- **カテゴリ選択**
  - 選択した分野の CSV から抽出したカテゴリ一覧を表示します。
  - カテゴリは自然順でソートされます（例: 1-1, 1-2, 1-10）。
  - 複数カテゴリを選択可能で、未選択の場合は全カテゴリが出題対象です。
- **CSV ファイルからの問題読み込み**
  - `it.csv`、`customer.csv`、`product.csv` を `public/csv/` に配置し、選択した分野に応じて読み込みます。
  - アプリ側では `parseCsv`（`src/util/parseCsv.ts`）でパースしています。
- **出題オプション**
  - **問題をランダムで表示する**: 出題順をシャッフルします。
  - **開始位置を指定する**: 先頭から何問目から開始するかを指定できます。
  - **回答を常に表示する**: 問題画面で最初から正解を表示し、選択・確認操作は行いません。
- **問題の表示と解答**
  - 問題文と 4 つの選択肢を表示し、選択肢をクリックして解答します。
- **解答の確認**
  - 「確認」ボタンで正誤判定と解説（memo）を表示します。
- **次の問題・結果**
  - 「次の問題へ」で次問へ進み、全問解答後に結果画面へ遷移します。
  - 「中断して結果を見る」で途中で結果画面に移れます。
- **結果画面**
  - 正解数・不正解数・正解率を表示します。
  - 間違えた問題の一覧と、選択した解答・正解を表示します。
  - 「間違った問題を再度解く」で不正解のみを再出題できます。
- **状態管理**
  - Jotai で問題データ、現在インデックス、正解数・不正解数、間違えた問題一覧、分野・カテゴリ選択、開始位置・回答常時表示などを管理しています。

## 使用技術

- **Next.js 16:** App Router によるルーティング（`src/app/`）。
- **React 19**
- **Jotai:** グローバル状態（問題データ、スコア、選択中の分野・カテゴリなど）。
- **Tailwind CSS 4:** スタイリング。
- **TypeScript 5**
- **CSV 処理**
  - ブラウザ: `src/util/parseCsv.ts` で CSV テキストをパース。
  - スクリプト: `csv-parse` / `csv-stringify`（format-csv 等で使用）。

## 開発環境の構築

1. **リポジトリのクローン**

   ```bash
   git clone <リポジトリのURL>
   cd <プロジェクトフォルダ>
   ```

2. **依存関係のインストール**

   ```bash
   npm install
   ```

3. **開発サーバーの起動**

   ```bash
   npm run dev
   ```

   ブラウザで `http://localhost:3000` にアクセスします。

## 画面フロー

1. トップ（`/`）: 分野を選択 → 「カテゴリを選択して試験へ」
2. カテゴリ選択（`/questions/category`）: 出題カテゴリとオプションを設定 → 「試験スタート」
3. 問題（`/questions`）: 出題・解答・確認
4. 結果（`/questions/result`）: スコア・誤答一覧・再挑戦

## CSV ファイルの形式

- `public/csv/` に `it.csv`、`customer.csv`、`product.csv` を配置します。
- 1 行目はヘッダー、2 行目以降がデータです。
- カラムは次の 9 つです（順不同ではなく、ヘッダー名でマッピングされます）。
  - `no`: 問題番号（アプリでは `id` として利用）
  - `memo`: 解説・参照情報
  - `category`: カテゴリ（例: IT分野-Chapter1、1-1 など）
  - `question`: 問題文
  - `option1` 〜 `option4`: 選択肢
  - `answer`: 正解の選択肢（option1 〜 option4 のいずれかの値）

## CSV 管理ツール

### 利用可能なコマンド

#### 1. CSV フォーマット整理

```bash
npm run format-csv
```

- **機能**: `public/csv/` 内の `it.csv`、`product.csv`、`customer.csv` をフォーマット整理します。
- **処理内容**: ヘッダー行の統一、改行の正規化、末尾カンマの調整など。

#### 2. ファイル比較（新規追加問題の抽出）

```bash
npm run compare-csv <元ファイル> <バックアップファイル>
```

- **機能**: 2 つの CSV を比較し、新規追加された問題を抽出します。
- **使用例**:

  ```bash
  npm run compare-csv public/csv/customer.csv public/csv/customer_bk.csv
  npm run compare-csv public/csv/it.csv public/csv/it_bk.csv
  ```

#### 3. 重複チェック（同じ回答の問題検出）

```bash
npm run check-duplicates <ファイルパス>
```

- **機能**: 指定した CSV 内で、回答が同じ問題を検出します。
- **使用例**:

  ```bash
  npm run check-duplicates public/csv/customer.csv
  npm run check-duplicates public/csv/it.csv
  ```

### 高度な分析ツール

`scripts/analyze-csv.mjs` を直接実行して、比較・重複検出・サマリーを組み合わせて利用できます。

```bash
node scripts/analyze-csv.mjs <元ファイル> [バックアップファイル] [オプション]
```

**オプション**

- `--no-comparison`: ファイル比較をスキップ
- `--no-duplicates`: 重複検出をスキップ
- `--no-summary`: サマリー表示をスキップ
- `--help`: ヘルプ表示

**使用例**

```bash
node scripts/analyze-csv.mjs public/csv/customer.csv --no-comparison
node scripts/analyze-csv.mjs public/csv/customer.csv public/csv/customer_bk.csv
node scripts/analyze-csv.mjs public/csv/customer.csv public/csv/customer_bk.csv --no-duplicates
```

### バックアップの作成

比較前にバックアップを取る場合の例です。

```bash
cp public/csv/customer.csv public/csv/customer_bk.csv
cp public/csv/it.csv public/csv/it_bk.csv
cp public/csv/product.csv public/csv/product_bk.csv
```

## 今後の課題

- 問題データの追加
- デザインの改善
- エラー処理の強化
- 問題の難易度設定
- タイマー機能の追加
- ユーザー認証機能の追加

## ライセンス

このプロジェクトは、MIT ライセンスの下で公開されています。
