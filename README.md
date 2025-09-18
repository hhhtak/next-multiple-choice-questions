# 多肢選択式クイズアプリ

## 概要

このプロジェクトは、CSV ファイルから読み込んだ問題を出題する多肢選択式クイズアプリです。Next.js、Jotai、Tailwind CSS を使用して構築されています。
今回は、AI にコード生成をお願いし、9 割 9 分くらい AI に実装してもらっています。
そのため、コンポーネントやコードの分割などには着手できていない状態です(今後の課題)。

## 機能

- **CSV ファイルからの問題読み込み:**
  - `it.csv`、`customer.csv`、`product.csv` などの CSV ファイルから問題データを読み込みます。
  - CSV ファイルの形式は、`category,question,option1,option2,option3,option4,answer,memo` の 8 つのカラムで構成されています。
- **カテゴリ選択:**
  - IT 分野、顧客分野、商品分野などのカテゴリを選択して、出題範囲を絞り込むことができます。
  - 複数のカテゴリを同時に選択することも可能です。
- **問題のランダム表示:**
  - 「問題をランダムで表示させる」チェックボックスをオンにすることで、問題の出題順序をランダムにすることができます。
- **開始位置の指定:**
  - 「開始位置を指定する」チェックボックスをオンにすることで、問題の開始位置を自由に設定できます。
  - チェックボックスをオフにした場合は、常に最初（0 番目）の問題から開始されます。
- **回答の常時表示:**
  - 「回答を常に表示する」チェックボックスをオンにすることで、問題画面で最初から正解が表示されます。
  - このモードでは、選択肢の選択や回答確認の操作は無効になり、問題と正解を素早く確認できます。
- **問題の表示と解答:**
  - 問題文と 4 つの選択肢が表示されます。
  - 選択肢をクリックして解答します。
- **解答の確認:**
  - 「確認」ボタンをクリックすると、正誤判定と解説（memo）が表示されます。
- **次の問題への遷移:**
  - 「次の問題へ」ボタンをクリックすると、次の問題に進みます。
- **結果画面:**
  - すべての問題に解答すると、結果画面が表示されます。
  - 正解数と不正解数が表示されます。
  - 間違えた問題の一覧と、選択した解答、正しい解答が表示されます。
- **状態管理**
  - Jotai を使用して、問題データ、現在の問題番号、正解数、不正解数、間違えた問題などの状態を管理しています。

## 使用技術

- **Next.js:** React ベースのフレームワーク。サーバーサイドレンダリングやルーティングなどの機能を提供します。
- **Jotai:** React の状態管理ライブラリ。シンプルで使いやすい API を提供します。
- **Tailwind CSS:** ユーティリティファーストの CSS フレームワーク。効率的なスタイリングを実現します。
- **TypeScript:** JavaScript のスーパーセット。静的型付けにより、コードの品質を向上させます。
- **CSV ファイルの読み込み**
  - `parseCsv`関数を使用して、CSV ファイルをパースしています。

## 開発環境の構築

1.  **リポジトリのクローン:**

    ```bash
    git clone <リポジトリのURL>
    cd multiple-questions
    ```

2.  **依存関係のインストール:**

    ```bash
    npm install
    ```

3.  **開発サーバーの起動:**

    ```bash
    npm run dev
    ```

    ブラウザで `http://localhost:3000` にアクセスします。

## CSV ファイルの作成方法

- `public/csv/` フォルダに、`it.csv`、`customer.csv`、`product.csv` などの CSV ファイルを作成します。
- CSV ファイルの形式は、以下の 8 つのカラムで構成されます。
  - `category`: 問題のカテゴリ（例：IT 分野-Chapter1）
  - `question`: 問題文
  - `option1`: 選択肢 1
  - `option2`: 選択肢 2
  - `option3`: 選択肢 3
  - `option4`: 選択肢 4
  - `answer`: 正解の選択肢
  - `memo`: 解説や参照情報

## CSV 管理ツール

このプロジェクトには、CSV ファイルの管理と分析のためのツールが含まれています。

### 利用可能なコマンド

#### 1. CSV フォーマット整理

```bash
npm run format-csv
```

- **機能**: `public/csv/` フォルダ内の CSV ファイル（`it.csv`, `product.csv`, `customer.csv`）を自動的にフォーマット整理
- **処理内容**: ヘッダー行の追加、改行の正規化、末尾カンマの追加など

#### 2. ファイル比較（新規追加問題の抽出）

```bash
npm run compare-csv <元ファイル> <バックアップファイル>
```

- **機能**: 2 つの CSV ファイルを比較して新規追加された問題を抽出
- **使用例**:

  ```bash
  # customer.csvとcustomer_bk.csvを比較
  npm run compare-csv public/csv/customer.csv public/csv/customer_bk.csv

  # it.csvとit_bk.csvを比較
  npm run compare-csv public/csv/it.csv public/csv/it_bk.csv
  ```

#### 3. 重複チェック（同じ回答の問題検出）

```bash
npm run check-duplicates <ファイルパス>
```

- **機能**: 単一ファイル内で回答が同じ問題を検出
- **使用例**:

  ```bash
  # customer.csv内の重複をチェック
  npm run check-duplicates public/csv/customer.csv

  # it.csv内の重複をチェック
  npm run check-duplicates public/csv/it.csv
  ```

### 高度な分析ツール

#### 統合分析ツール

```bash
# 直接実行（npmスクリプトなし）
node scripts/analyze-csv.mjs <元ファイル> [バックアップファイル] [オプション]
```

**オプション**:

- `--no-comparison`: ファイル比較をスキップ
- `--no-duplicates`: 重複検出をスキップ
- `--no-summary`: サマリー表示をスキップ
- `--help`: ヘルプを表示

**使用例**:

```bash
# 重複検出のみ実行
node scripts/analyze-csv.mjs public/csv/customer.csv --no-comparison

# 比較と重複検出の両方を実行
node scripts/analyze-csv.mjs public/csv/customer.csv public/csv/customer_bk.csv

# 比較のみ実行
node scripts/analyze-csv.mjs public/csv/customer.csv public/csv/customer_bk.csv --no-duplicates
```

### 機能の詳細

#### ファイル比較機能

- 問題文を基準に比較を行います
- 新規追加された問題は、問題番号、問題文、回答、カテゴリを表示
- 比較結果のサマリーも表示されます

#### 重複検出機能

- 同じ回答を持つ問題をグループ化して表示
- 各問題の番号、問題文、カテゴリを表示
- 重複グループの総数を表示

### バックアップファイルの作成

比較を行う前に、バックアップファイルを作成してください：

```bash
# customer.csvのバックアップを作成
cp public/csv/customer.csv public/csv/customer_bk.csv

# it.csvのバックアップを作成
cp public/csv/it.csv public/csv/it_bk.csv

# product.csvのバックアップを作成
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
