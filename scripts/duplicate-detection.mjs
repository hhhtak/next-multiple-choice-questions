import { parse } from "csv-parse/sync";
import fs from "fs";
import path from "path";

/**
 * CSVファイル内で回答が同じ問題を検出する
 * @param {string} filePath - 検出対象のCSVファイルパス
 * @returns {Object} 重複検出結果オブジェクト
 */
export function detectDuplicateAnswers(filePath) {
  try {
    // 引数のバリデーション
    if (!filePath) {
      throw new Error("使用方法: detectDuplicateAnswers(<ファイルパス>)");
    }

    // 相対パスの場合は絶対パスに変換
    const absolutePath = path.isAbsolute(filePath)
      ? filePath
      : path.join(process.cwd(), filePath);

    // ファイルの存在確認
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`ファイル "${filePath}" が見つかりません`);
    }

    // CSVファイルを読み込み
    const csvContent = fs.readFileSync(absolutePath, "utf-8");

    // CSVをパース
    const data = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
    });

    // 回答が同じ問題を検出
    const duplicateGroups = findSameAnswerQuestions(data);

    return {
      success: true,
      data,
      duplicateGroups,
      totalQuestions: data.length,
      duplicateGroupCount: duplicateGroups.length,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * 単一ファイル内で回答が同じ問題を検索
 * @param {Array} data - CSVデータ
 * @returns {Array} 重複グループの配列
 */
export function findSameAnswerQuestions(data) {
  const answerGroups = {};
  const results = [];

  // 回答ごとに問題をグループ化
  for (const item of data) {
    if (!answerGroups[item.answer]) {
      answerGroups[item.answer] = [];
    }
    answerGroups[item.answer].push(item);
  }

  // 同じ回答を持つ問題が2つ以上ある場合のみ結果に追加
  for (const [answer, questions] of Object.entries(answerGroups)) {
    if (questions.length > 1) {
      results.push({
        answer: answer,
        questions: questions.map((q) => ({
          no: q.no,
          question: q.question,
          category: q.category,
        })),
        count: questions.length,
      });
    }
  }

  return results;
}

/**
 * 重複検出結果を表示
 * @param {Object} result - 重複検出結果オブジェクト
 * @param {string} fileName - ファイル名
 */
export function displayDuplicateResults(result, fileName) {
  if (!result.success) {
    console.error("❌ エラーが発生しました:", result.error);
    return;
  }

  console.log("🔄 回答が同じ問題（重複検出）");
  console.log("-".repeat(30));
  console.log(`対象ファイル: ${fileName}`);
  console.log(`総問題数: ${result.totalQuestions} 件`);
  console.log("");

  if (result.duplicateGroups.length === 0) {
    console.log("回答が同じ問題はありません。");
  } else {
    result.duplicateGroups.forEach((group, groupIndex) => {
      console.log(`${groupIndex + 1}. 回答: "${group.answer}" (${group.count}件)`);
      group.questions.forEach((question, questionIndex) => {
        console.log(`   ${questionIndex + 1}. ${question.question}`);
        console.log(`      カテゴリ: ${question.category}`);
      });
      console.log("");
    });
  }

  console.log(`回答が同じ問題グループ: ${result.duplicateGroupCount} グループ`);
}

/**
 * 複数のCSVファイルに対して重複検出を実行
 * @param {Array} filePaths - 検出対象のCSVファイルパスの配列
 * @returns {Object} 全ファイルの重複検出結果
 */
export function detectDuplicatesInMultipleFiles(filePaths) {
  const results = [];
  let totalDuplicateGroups = 0;

  for (const filePath of filePaths) {
    const result = detectDuplicateAnswers(filePath);
    results.push({
      filePath,
      ...result,
    });

    if (result.success) {
      totalDuplicateGroups += result.duplicateGroupCount;
    }
  }

  return {
    results,
    totalDuplicateGroups,
    success: results.every((r) => r.success),
  };
}

/**
 * 複数ファイルの重複検出結果を表示
 * @param {Object} multiResult - 複数ファイルの重複検出結果
 */
export function displayMultipleDuplicateResults(multiResult) {
  if (!multiResult.success) {
    console.error("❌ 一部のファイルでエラーが発生しました");
    multiResult.results.forEach((result) => {
      if (!result.success) {
        console.error(`  - ${result.filePath}: ${result.error}`);
      }
    });
    return;
  }

  console.log("🔄 複数ファイルの重複検出結果");
  console.log("=".repeat(50));

  multiResult.results.forEach((result, index) => {
    console.log(`\n📁 ファイル ${index + 1}: ${result.filePath}`);
    console.log("-".repeat(30));
    displayDuplicateResults(result, result.filePath);
  });

  console.log("\n📈 全体サマリー");
  console.log("-".repeat(30));
  console.log(`総重複グループ数: ${multiResult.totalDuplicateGroups} グループ`);
}

/**
 * ヘルプメッセージを表示
 */
function showHelp() {
  console.log(`
🔄 重複検出ツール

使用方法:
  node duplicate-detection.mjs <ファイルパス> [オプション]

引数:
  <ファイルパス>        検出対象のCSVファイルパス

オプション:
  --help             このヘルプを表示

例:
  # 単一ファイルの重複をチェック
  node duplicate-detection.mjs public/csv/customer.csv

  # 絶対パスで指定
  node duplicate-detection.mjs /path/to/file.csv
`);
}

// スクリプト実行
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("--help")) {
    showHelp();
    process.exit(0);
  }

  const filePath = args[0];

  try {
    const result = detectDuplicateAnswers(filePath);
    displayDuplicateResults(result, filePath);
  } catch (error) {
    console.error("❌ エラーが発生しました:", error.message);
    process.exit(1);
  }
}
