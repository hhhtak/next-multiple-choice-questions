import { parse } from "csv-parse/sync";
import fs from "fs";
import path from "path";

/**
 * CSVファイルを比較して、新規追加された問題と回答が同じ問題を抽出する
 * @param {string} originalFile - 比較元のCSVファイルパス
 * @param {string} backupFile - 比較先のCSVファイルパス
 */
function compareCsvFiles(originalFile, backupFile) {
  try {
    // 引数のバリデーション
    if (!originalFile || !backupFile) {
      console.error(
        "❌ 使用方法: node compare-csv.mjs <元ファイル> <バックアップファイル>"
      );
      console.error(
        "例: node compare-csv.mjs public/csv/customer.csv public/csv/customer_bk.csv"
      );
      return;
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
      console.error(`❌ 元ファイル "${originalFile}" が見つかりません`);
      return;
    }

    if (!fs.existsSync(backupPath)) {
      console.error(`❌ バックアップファイル "${backupFile}" が見つかりません`);
      return;
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

    console.log("📊 CSV比較結果");
    console.log("=".repeat(50));
    console.log(`元ファイル (${originalFile}): ${originalData.length} 件`);
    console.log(`バックアップファイル (${backupFile}): ${backupData.length} 件`);
    console.log("");

    // 新規追加された問題を抽出
    const newQuestions = findNewQuestions(originalData, backupData);

    // 回答が同じ問題を抽出（元ファイル内で同じ回答を持つ問題）
    const sameAnswerQuestions = findSameAnswerQuestionsInFile(originalData);

    // 結果を表示
    displayResults(newQuestions, sameAnswerQuestions);
  } catch (error) {
    console.error("❌ エラーが発生しました:", error.message);
  }
}

/**
 * 新規追加された問題を検索
 */
function findNewQuestions(originalData, backupData) {
  const backupQuestions = new Set(backupData.map((item) => item.question));

  return originalData.filter((item) => {
    return !backupQuestions.has(item.question);
  });
}

/**
 * 単一ファイル内で回答が同じ問題を検索
 */
function findSameAnswerQuestionsInFile(data) {
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
      });
    }
  }

  return results;
}

/**
 * 結果を表示
 */
function displayResults(newQuestions, sameAnswerQuestions) {
  // 新規追加された問題
  console.log("🆕 新規追加された問題");
  console.log("-".repeat(30));
  if (newQuestions.length === 0) {
    console.log("新規追加された問題はありません。");
  } else {
    newQuestions.forEach((item, index) => {
      console.log(`${index + 1}. ${item.question}`);
      console.log(`   回答: ${item.answer}`);
      console.log(`   カテゴリ: ${item.category}`);
      console.log("");
    });
  }

  console.log("");

  // 回答が同じ問題
  console.log("🔄 回答が同じ問題（元ファイル内）");
  console.log("-".repeat(30));
  if (sameAnswerQuestions.length === 0) {
    console.log("回答が同じ問題はありません。");
  } else {
    sameAnswerQuestions.forEach((group, groupIndex) => {
      console.log(`${groupIndex + 1}. 回答: "${group.answer}"`);
      group.questions.forEach((question, questionIndex) => {
        console.log(`   ${questionIndex + 1}. ${question.question}`);
        console.log(`      カテゴリ: ${question.category}`);
      });
      console.log("");
    });
  }

  // サマリー
  console.log("📈 サマリー");
  console.log("-".repeat(30));
  console.log(`新規追加問題: ${newQuestions.length} 件`);
  console.log(`回答が同じ問題グループ: ${sameAnswerQuestions.length} グループ`);
}

// スクリプト実行
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const originalFile = args[0];
  const backupFile = args[1];

  compareCsvFiles(originalFile, backupFile);
}

export { compareCsvFiles };
