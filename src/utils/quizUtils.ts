import { QuestionItem, WrongQuestionItem } from "@/types";

/**
 * 正解率を計算する関数
 */
export function calculateCorrectRate(correctCount: number, totalCount: number): string {
  if (totalCount === 0) return "N/A";
  return `${((correctCount / totalCount) * 100).toFixed(1)}%`;
}

/**
 * WrongQuestionItemからselectedAnswerを除去してQuestionItemに変換する関数
 */
export function convertWrongQuestionToQuestion(
  wrongQuestion: WrongQuestionItem
): QuestionItem {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { selectedAnswer, ...questionData } = wrongQuestion;
  return questionData;
}

/**
 * 問題の選択肢を取得する関数
 */
export function getQuestionOptions(question: QuestionItem): string[] {
  return [question.option1, question.option2, question.option3, question.option4].filter(
    Boolean
  );
}
