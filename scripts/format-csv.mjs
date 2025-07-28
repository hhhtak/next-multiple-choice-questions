import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import fs from "fs";
import path from "path";

const csvDir = path.join(process.cwd(), "public/csv");

const filesToProcess = ["it.csv", "product.csv", "customer.csv"];

filesToProcess.forEach((file) => {
  const filePath = path.join(csvDir, file);

  if (!fs.existsSync(filePath)) {
    console.warn(`ファイルが見つかりません: ${filePath}。スキップします。`);
    return;
  }

  const input = fs.readFileSync(filePath, "utf-8");

  // 1行目・2行目を削除
  const lines = input.split(/\r?\n/);
  const csvBody = lines.slice(2).join("\n");

  // パース（カンマや改行を含むフィールドも正確に分割）
  const records = parse(csvBody, {
    relax_quotes: true,
    relax_column_count: true,
    trim: true,
  });

  // ヘッダーを挿入
  const header = [
    "no",
    "memo",
    "category",
    "question",
    "option1",
    "option2",
    "option3",
    "option4",
    "answer",
  ];
  const allRecords = [header, ...records];

  // 最終行がカンマのみなら削除
  if (
    allRecords.length > 0 &&
    allRecords[allRecords.length - 1].every((cell) => cell === "")
  ) {
    allRecords.pop();
  }

  // フィールド内の改行をスペースに置換
  const cleanedRecords = allRecords.map((row) =>
    row.map((cell) => (typeof cell === "string" ? cell.replace(/\r?\n/g, " ") : cell))
  );

  // 各行の末尾にカンマを追加（空文字列を追加）
  const withTrailingComma = cleanedRecords.map((row) => [...row, ""]);

  // 1行1レコードでCSV出力
  const output = stringify(withTrailingComma, {
    quoted: true,
    record_delimiter: "\n",
  }).replace(/\r\n/g, "");

  fs.writeFileSync(filePath, output, "utf-8");
  console.log(`${file} のフォーマットを更新しました。`);
});
