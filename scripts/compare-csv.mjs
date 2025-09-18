import { compareCsvFiles, displayComparisonResults } from "./csv-comparison.mjs";

/**
 * CSVファイルを比較して、新規追加された問題を抽出する
 * この関数は後方互換性のために残されています。
 * 新しいコードでは csv-comparison.mjs を直接使用することを推奨します。
 * @param {string} originalFile - 比較元のCSVファイルパス
 * @param {string} backupFile - 比較先のCSVファイルパス
 */
function compareCsvFilesWrapper(originalFile, backupFile) {
  if (!originalFile || !backupFile) {
    console.error(
      "❌ 使用方法: node compare-csv.mjs <元ファイル> <バックアップファイル>"
    );
    console.error(
      "例: node compare-csv.mjs public/csv/customer.csv public/csv/customer_bk.csv"
    );
    console.error(
      "\n💡 新しい使用方法: node csv-comparison.mjs <元ファイル> <バックアップファイル>"
    );
    return;
  }

  // csv-comparison.mjs の関数を使用（重複検出は実行しない）
  const result = compareCsvFiles(originalFile, backupFile);
  displayComparisonResults(result, originalFile, backupFile);
}

// スクリプト実行
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const originalFile = args[0];
  const backupFile = args[1];

  compareCsvFilesWrapper(originalFile, backupFile);
}

export { compareCsvFilesWrapper };
