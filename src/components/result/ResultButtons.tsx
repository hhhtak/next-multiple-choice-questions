import { MESSAGES } from "@/constants";
import { WrongQuestionItem } from "@/types";
import { removeDuplicatesById } from "@/utils/arrayUtils";

interface ResultButtonsProps {
  wrongQuestions: WrongQuestionItem[];
  onBackToTop: () => void;
  onRetryWrongQuestions: () => void;
}

export const ResultButtons = ({
  wrongQuestions,
  onBackToTop,
  onRetryWrongQuestions,
}: ResultButtonsProps) => {
  const uniqueWrongQuestions = removeDuplicatesById(wrongQuestions);

  return (
    <div className="mt-8 flex flex-col sm:flex-row sm:justify-start sm:space-x-4 space-y-4 sm:space-y-0">
      <button
        onClick={onBackToTop}
        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 sm:py-3 sm:px-6 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-base sm:text-lg"
      >
        {MESSAGES.BACK_TO_TOP}
      </button>
      {uniqueWrongQuestions.length > 0 && (
        <button
          onClick={onRetryWrongQuestions}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-5 sm:py-3 sm:px-6 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-base sm:text-lg"
        >
          {MESSAGES.RETRY_WRONG_QUESTIONS}
        </button>
      )}
    </div>
  );
};
