import { compareCsvFiles, displayComparisonResults } from "./csv-comparison.mjs";
import {
  detectDuplicateAnswers,
  displayDuplicateResults,
} from "./duplicate-detection.mjs";

/**
 * CSV分析のメイン関数
 * @param {string} originalFile - 比較元のCSVファイルパス
 * @param {string} backupFile - 比較先のCSVファイルパス（オプション）
 * @param {Object} options - オプション設定
 */
export function analyzeCsv(originalFile, backupFile = null, options = {}) {
  const { showComparison = true, showDuplicates = true, showSummary = true } = options;

  console.log("🔍 CSV分析を開始します...");
  console.log("=".repeat(50));

  let comparisonResult = null;
  let duplicateResult = null;

  // 比較処理（バックアップファイルが指定されている場合）
  if (showComparison && backupFile) {
    console.log("\n📊 ファイル比較を実行中...");
    comparisonResult = compareCsvFiles(originalFile, backupFile);
    displayComparisonResults(comparisonResult, originalFile, backupFile);
  }

  // 重複検出処理
  if (showDuplicates) {
    console.log("\n🔄 重複検出を実行中...");
    duplicateResult = detectDuplicateAnswers(originalFile);
    displayDuplicateResults(duplicateResult, originalFile);
  }

  // サマリー表示
  if (showSummary) {
    displayOverallSummary(comparisonResult, duplicateResult, originalFile, backupFile);
  }

  return {
    comparison: comparisonResult,
    duplicates: duplicateResult,
  };
}

/**
 * 全体のサマリーを表示
 * @param {Object} comparisonResult - 比較結果
 * @param {Object} duplicateResult - 重複検出結果
 * @param {string} originalFile - 元ファイル名
 * @param {string} backupFile - バックアップファイル名
 */
function displayOverallSummary(
  comparisonResult,
  duplicateResult,
  originalFile,
  backupFile
) {
  console.log("\n📈 全体サマリー");
  console.log("=".repeat(50));

  if (comparisonResult && comparisonResult.success) {
    console.log(`新規追加問題: ${comparisonResult.newQuestions.length} 件`);
  }

  if (duplicateResult && duplicateResult.success) {
    console.log(`重複グループ: ${duplicateResult.duplicateGroupCount} グループ`);
  }

  console.log(`\n分析対象ファイル: ${originalFile}`);
  if (backupFile) {
    console.log(`比較対象ファイル: ${backupFile}`);
  }
}

/**
 * コマンドライン引数からオプションを解析
 * @param {Array} args - コマンドライン引数
 * @returns {Object} 解析されたオプション
 */
function parseCommandLineArgs(args) {
  const options = {
    showComparison: true,
    showDuplicates: true,
    showSummary: true,
  };

  // フラグの解析
  for (const arg of args) {
    switch (arg) {
      case "--no-comparison":
        options.showComparison = false;
        break;
      case "--no-duplicates":
        options.showDuplicates = false;
        break;
      case "--no-summary":
        options.showSummary = false;
        break;
      case "--help":
        showHelp();
        process.exit(0);
        break;
    }
  }

  return options;
}

/**
 * ヘルプメッセージを表示
 */
function showHelp() {
  console.log(`
🔍 CSV分析ツール

使用方法:
  node analyze-csv.mjs <元ファイル> [バックアップファイル] [オプション]

引数:
  <元ファイル>        分析対象のCSVファイルパス
  [バックアップファイル] 比較対象のCSVファイルパス（オプション）

オプション:
  --no-comparison    ファイル比較をスキップ
  --no-duplicates    重複検出をスキップ
  --no-summary       サマリー表示をスキップ
  --help             このヘルプを表示

例:
  # 重複検出のみ実行
  node analyze-csv.mjs public/csv/customer.csv --no-comparison

  # 比較と重複検出の両方を実行
  node analyze-csv.mjs public/csv/customer.csv public/csv/customer_bk.csv

  # 比較のみ実行
  node analyze-csv.mjs public/csv/customer.csv public/csv/customer_bk.csv --no-duplicates
`);
}

// スクリプト実行
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("--help")) {
    showHelp();
    process.exit(0);
  }

  const originalFile = args[0];
  const backupFile = args[1] && !args[1].startsWith("--") ? args[1] : null;
  const options = parseCommandLineArgs(args);

  try {
    analyzeCsv(originalFile, backupFile, options);
  } catch (error) {
    console.error("❌ エラーが発生しました:", error.message);
    process.exit(1);
  }
}
