// /util/parseCsv.ts

import { QuestionItem } from "@/types";

export const parseCsv = (csvText: string): QuestionItem[] => {
  const lines = csvText.split("\n");
  const headers = lines[0].split(",");
  const data: QuestionItem[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === "") continue; // 空行をスキップ

    const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // カンマ区切りで分割（ただし、ダブルクォート内のカンマは無視）
    const row: { [key: string]: string } = {};

    for (let j = 0; j < headers.length; j++) {
      let value = values[j].replace(/^"|"$/g, "").replace(/""/g, '"'); // ダブルクォートを削除し、エスケープされたダブルクォートを戻す
      // 改行コードを \\n に置き換える
      if (value.includes("\n")) {
        value = value.replace(/\n/g, "\\n");
      }
      row[headers[j]] = value;
    }

    // QuestionItem 型に変換
    const questionItem: QuestionItem = {
      id: Date.now() + i, // 一意なIDを生成
      category: row["category"],
      question: row["question"],
      option1: row["option1"],
      option2: row["option2"],
      option3: row["option3"],
      option4: row["option4"],
      answer: row["answer"],
      memo: row["memo"],
    };
    data.push(questionItem);
  }

  return data;
};
