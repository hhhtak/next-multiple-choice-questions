import { parse } from "csv-parse/sync";
import fs from "fs";
import path from "path";

/**
 * CSVファイルを比較して、新規追加された問題を抽出する
 * @param {string} originalFile - 比較元のCSVファイルパス
 * @param {string} backupFile - 比較先のCSVファイルパス
 * @returns {Object} 比較結果オブジェクト
 */
export function compareCsvFiles(originalFile, backupFile) {
  try {
    // 引数のバリデーション
    if (!originalFile || !backupFile) {
      throw new Error("使用方法: compareCsvFiles(<元ファイル>, <バックアップファイル>)");
    }

    // 相対パスの場合は絶対パスに変換
    const originalPath = path.isAbsolute(originalFile)
      ? originalFile
      : path.join(process.cwd(), originalFile);

    const backupPath = path.isAbsolute(backupFile)
      ? backupFile
      : path.join(process.cwd(), backupFile);

    // ファイルの存在確認
    if (!fs.existsSync(originalPath)) {
      throw new Error(`元ファイル "${originalFile}" が見つかりません`);
    }

    if (!fs.existsSync(backupPath)) {
      throw new Error(`バックアップファイル "${backupFile}" が見つかりません`);
    }

    // CSVファイルを読み込み
    const originalCsv = fs.readFileSync(originalPath, "utf-8");
    const backupCsv = fs.readFileSync(backupPath, "utf-8");

    // CSVをパース
    const originalData = parse(originalCsv, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
    });

    const backupData = parse(backupCsv, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
    });

    // 新規追加された問題を抽出
    const newQuestions = findNewQuestions(originalData, backupData);

    return {
      success: true,
      originalData,
      backupData,
      newQuestions,
      originalCount: originalData.length,
      backupCount: backupData.length,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * 新規追加された問題を検索
 * @param {Array} originalData - 元のCSVデータ
 * @param {Array} backupData - バックアップのCSVデータ
 * @returns {Array} 新規追加された問題の配列
 */
export function findNewQuestions(originalData, backupData) {
  const backupQuestions = new Set(backupData.map((item) => item.question));

  return originalData.filter((item) => {
    return !backupQuestions.has(item.question);
  });
}

/**
 * 比較結果を表示
 * @param {Object} result - 比較結果オブジェクト
 * @param {string} originalFile - 元ファイル名
 * @param {string} backupFile - バックアップファイル名
 */
export function displayComparisonResults(result, originalFile, backupFile) {
  if (!result.success) {
    console.error("❌ エラーが発生しました:", result.error);
    return;
  }

  console.log("📊 CSV比較結果");
  console.log("=".repeat(50));
  console.log(`元ファイル (${originalFile}): ${result.originalCount} 件`);
  console.log(`バックアップファイル (${backupFile}): ${result.backupCount} 件`);
  console.log("");

  // 新規追加された問題
  console.log("🆕 新規追加された問題");
  console.log("-".repeat(30));
  if (result.newQuestions.length === 0) {
    console.log("新規追加された問題はありません。");
  } else {
    result.newQuestions.forEach((item, index) => {
      console.log(`${index + 1}. ${item.question}`);
      console.log(`   回答: ${item.answer}`);
      console.log(`   カテゴリ: ${item.category}`);
      console.log("");
    });
  }

  console.log("");
  console.log(`新規追加問題: ${result.newQuestions.length} 件`);
}

/**
 * ヘルプメッセージを表示
 */
function showHelp() {
  console.log(`
📊 CSV比較ツール

使用方法:
  node csv-comparison.mjs <元ファイル> <バックアップファイル>

引数:
  <元ファイル>        比較元のCSVファイルパス
  <バックアップファイル> 比較先のCSVファイルパス

例:
  # customer.csvとcustomer_bk.csvを比較
  node csv-comparison.mjs public/csv/customer.csv public/csv/customer_bk.csv

  # it.csvとit_bk.csvを比較
  node csv-comparison.mjs public/csv/it.csv public/csv/it_bk.csv

  # 絶対パスで指定
  node csv-comparison.mjs /path/to/original.csv /path/to/backup.csv
`);
}

// スクリプト実行
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("--help")) {
    showHelp();
    process.exit(0);
  }

  if (args.length < 2) {
    console.error(
      "❌ 使用方法: node csv-comparison.mjs <元ファイル> <バックアップファイル>"
    );
    console.error(
      "例: node csv-comparison.mjs public/csv/customer.csv public/csv/customer_bk.csv"
    );
    process.exit(1);
  }

  const originalFile = args[0];
  const backupFile = args[1];

  try {
    const result = compareCsvFiles(originalFile, backupFile);
    displayComparisonResults(result, originalFile, backupFile);
  } catch (error) {
    console.error("❌ エラーが発生しました:", error.message);
    process.exit(1);
  }
}
