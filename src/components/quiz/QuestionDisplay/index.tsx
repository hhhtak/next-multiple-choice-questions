import { MESSAGES } from "@/constants";
import { QuestionItem } from "@/types";

interface QuestionDisplayProps {
  question: QuestionItem;
  currentIndex: number;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
}

export const QuestionDisplay = ({
  question,
  currentIndex,
  totalQuestions,
  correctCount,
  wrongCount,
}: QuestionDisplayProps) => {
  return (
    <>
      {/* ヘッダー情報 */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-2 sm:space-y-0 border-b pb-4 border-gray-200">
        <p className="text-sm sm:text-base text-gray-600">
          {MESSAGES.CATEGORY}{" "}
          <span className="font-medium text-gray-600">{question?.category ?? "N/A"}</span>
        </p>
        <p className="text-sm sm:text-base text-gray-600">
          {MESSAGES.QUESTION}{" "}
          <span className="font-medium text-gray-600">
            {currentIndex + 1} / {totalQuestions}
          </span>
        </p>
        <div className="flex space-x-4">
          <p className="text-sm sm:text-base text-green-600">
            {MESSAGES.CORRECT_COUNT} <span className="font-medium">{correctCount}</span>
          </p>
          <p className="text-sm sm:text-base text-red-600">
            {MESSAGES.INCORRECT_COUNT} <span className="font-medium">{wrongCount}</span>
          </p>
        </div>
      </div>

      {/* 問題文 */}
      <div className="mb-6">
        <div className="mb-4 sm:mb-6">
          <p className="text-lg sm:text-xl font-semibold whitespace-pre-wrap text-gray-600">
            {question?.question ?? "問題読込中..."}
          </p>
        </div>
      </div>
    </>
  );
};
