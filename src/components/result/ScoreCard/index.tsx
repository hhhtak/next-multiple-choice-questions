import { MESSAGES } from "@/constants";
import { calculateCorrectRate } from "@/utils/quizUtils";

interface ScoreCardProps {
  correctCount: number;
  wrongCount: number;
}

export const ScoreCard = ({ correctCount, wrongCount }: ScoreCardProps) => {
  const totalAnswered = correctCount + wrongCount;
  const correctRate = calculateCorrectRate(correctCount, totalAnswered);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 mb-8">
      <p className="text-lg sm:text-xl font-semibold text-gray-600 mb-4">
        {MESSAGES.SCORE}
      </p>
      <div className="flex flex-col sm:flex-row sm:justify-around space-y-2 sm:space-y-0">
        <p className="text-base sm:text-lg text-gray-600">
          <span className="font-medium text-green-600">{MESSAGES.CORRECT_COUNT}</span>{" "}
          {correctCount}
        </p>
        <p className="text-base sm:text-lg text-gray-600">
          <span className="font-medium text-red-600">{MESSAGES.INCORRECT_COUNT}</span>{" "}
          {wrongCount}
        </p>
        <p className="text-base sm:text-lg text-gray-600">
          <span className="font-medium text-blue-600">{MESSAGES.CORRECT_RATE}</span>{" "}
          {correctRate}
        </p>
      </div>
    </div>
  );
};
