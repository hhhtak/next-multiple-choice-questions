import { Field } from "@/types";

export const FIELDS: Field[] = ["it", "customer", "product"];

export const FIELD_LABELS: Record<Field, string> = {
  it: "IT分野",
  customer: "顧客分野",
  product: "商品分野",
};

export const CSV_PATHS: Record<Field, string> = {
  it: "/csv/it.csv",
  customer: "/csv/customer.csv",
  product: "/csv/product.csv",
};

export const DEFAULT_START_INDEX = 0;
export const MIN_START_INDEX = 0;

export const MESSAGES = {
  LOADING: "読み込み中...",
  NO_QUESTIONS: "問題データがありません。スタート画面で分野を選択してください。",
  INVALID_START_INDEX: "指定された開始位置の問題が見つかりません。",
  NO_RETRY_QUESTIONS: "再挑戦する問題がありません。",
  PERFECT_SCORE: "素晴らしい！間違った問題はありませんでした。",
  START_QUIZ: "試験スタート",
  BACK_TO_TOP: "トップに戻る",
  RETRY_WRONG_QUESTIONS: "間違った問題を再度解く",
  CHECK_ANSWER: "回答を確認",
  NEXT_QUESTION: "次の問題へ",
  INTERRUPT_AND_SEE_RESULT: "中断して結果を見る",
  SEE_FINAL_RESULT: "最終結果を見る",
  CORRECT: "✅ 正解！",
  INCORRECT: "❌ 不正解！",
  YOUR_ANSWER: "あなたの回答:",
  CORRECT_ANSWER: "正解:",
  EXPLANATION: "解説:",
  CATEGORY: "カテゴリ:",
  QUESTION: "問題:",
  CORRECT_COUNT: "正解:",
  INCORRECT_COUNT: "不正解:",
  SCORE: "スコア",
  CORRECT_RATE: "正解率:",
  REVIEW_WRONG_QUESTIONS: "間違った問題の確認",
} as const;
