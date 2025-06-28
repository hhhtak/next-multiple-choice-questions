import { MESSAGES } from "@/constants";

interface QuizButtonsProps {
  isAnswered: boolean;
  showAnswersPermanently: boolean;
  selectedAnswer: string | null;
  onCheckAnswer: () => void;
  onInterrupt: () => void;
  isLastQuestion: boolean;
  onSeeFinalResult: () => void;
}

export const QuizButtons = ({
  isAnswered,
  showAnswersPermanently,
  selectedAnswer,
  onCheckAnswer,
  onInterrupt,
  isLastQuestion,
  onSeeFinalResult,
}: QuizButtonsProps) => {
  // 確認ボタン
  if (!isAnswered && !showAnswersPermanently) {
    return (
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <button
          onClick={onCheckAnswer}
          disabled={selectedAnswer === null}
          className={`w-full sm:w-auto bg-blue-600 text-white font-bold py-2.5 px-5 rounded-lg transition duration-150 ease-in-out ${
            selectedAnswer === null
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          } text-base sm:text-lg`}
        >
          {MESSAGES.CHECK_ANSWER}
        </button>
        <button
          onClick={onInterrupt}
          className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2.5 px-5 rounded-lg transition duration-150 ease-in-out text-base sm:text-lg"
        >
          {MESSAGES.INTERRUPT_AND_SEE_RESULT}
        </button>
      </div>
    );
  }

  // 最終結果を見るボタン（最後の問題で回答後に表示）
  if ((isAnswered || showAnswersPermanently) && isLastQuestion) {
    return (
      <div className="mt-6">
        <button
          onClick={onSeeFinalResult}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-5 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-base sm:text-lg"
        >
          {MESSAGES.SEE_FINAL_RESULT}
        </button>
      </div>
    );
  }

  return null;
};
