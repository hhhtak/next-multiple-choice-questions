import { MESSAGES } from "@/constants";

interface AnswerResultProps {
  isCorrect: boolean;
  correctAnswer: string;
  memo: string;
  handleNextQuestion: () => void;
  selectedAnswer: string | null;
}

export const AnswerResult = ({
  isCorrect,
  correctAnswer,
  memo,
  handleNextQuestion,
  selectedAnswer,
}: AnswerResultProps) => {
  return (
    <div className="mt-6 p-4 border rounded-lg shadow-sm bg-white border-gray-300">
      {/* 正解/不正解表示 */}
      <p className="mb-3 text-lg sm:text-xl font-bold">
        {isCorrect ? (
          <span className="text-green-600">{MESSAGES.CORRECT}</span>
        ) : (
          <span className="text-red-600">{MESSAGES.INCORRECT}</span>
        )}
      </p>

      {/* あなたの回答 */}
      {!isCorrect && (
        <p className="mb-2 text-sm sm:text-base text-gray-600">
          <span className="font-semibold">{MESSAGES.YOUR_ANSWER}</span>{" "}
          {selectedAnswer || "未選択"}
        </p>
      )}

      {/* 正解 */}
      <p className="mb-2 text-sm sm:text-base text-gray-600">
        <span className="font-semibold">{MESSAGES.CORRECT_ANSWER}</span> {correctAnswer}
      </p>

      {/* メモ */}
      {memo && (
        <p className="mb-4 text-sm sm:text-base text-gray-600 whitespace-pre-wrap bg-gray-50 p-3 rounded border border-gray-200">
          <span className="font-semibold block mb-1">{MESSAGES.EXPLANATION}</span> {memo}
        </p>
      )}

      {/* 次の問題へボタン */}
      <div className="mt-4">
        <button
          onClick={handleNextQuestion}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 font-bold py-2.5 px-5 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-base sm:text-lg text-white"
        >
          {MESSAGES.NEXT_QUESTION}
        </button>
      </div>
    </div>
  );
};
