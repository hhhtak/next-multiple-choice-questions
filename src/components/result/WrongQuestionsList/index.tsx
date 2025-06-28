import { MESSAGES } from "@/constants";
import { WrongQuestionItem } from "@/types";
import { removeDuplicatesById } from "@/utils/arrayUtils";

interface WrongQuestionsListProps {
  wrongQuestions: WrongQuestionItem[];
}

export const WrongQuestionsList = ({ wrongQuestions }: WrongQuestionsListProps) => {
  const uniqueWrongQuestions = removeDuplicatesById(wrongQuestions);

  if (uniqueWrongQuestions.length === 0) {
    return (
      <p className="text-base sm:text-lg text-gray-600 bg-gray-100 p-4 rounded-md border border-gray-200">
        {MESSAGES.PERFECT_SCORE}
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {uniqueWrongQuestions.map((wrongQuestion, index) => (
        <li
          key={wrongQuestion.id ?? index}
          className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white"
        >
          {/* 問題文 */}
          <p className="font-semibold mb-2 text-base sm:text-lg text-gray-600">
            Q: {wrongQuestion.question}
          </p>
          {/* あなたの回答 */}
          <p className="mb-1 text-sm sm:text-base text-gray-600">
            {MESSAGES.YOUR_ANSWER}{" "}
            <span className="text-red-600 font-medium">
              {wrongQuestion.selectedAnswer}
            </span>
          </p>
          {/* 正解 */}
          <p className="text-sm sm:text-base text-gray-600">
            {MESSAGES.CORRECT_ANSWER}{" "}
            <span className="text-green-600 font-medium">{wrongQuestion.answer}</span>
          </p>
          {/* 解説 (メモ) があれば表示 */}
          {wrongQuestion.memo && (
            <p className="mt-2 pt-2 border-t border-gray-200 text-sm sm:text-base text-gray-600 whitespace-pre-wrap">
              <span className="font-semibold block mb-1">{MESSAGES.EXPLANATION}</span>{" "}
              {wrongQuestion.memo}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
};
