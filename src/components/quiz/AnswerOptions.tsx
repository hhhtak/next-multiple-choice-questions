interface AnswerOptionsProps {
  shuffledOptions: string[];
  selectedAnswer: string | null;
  handleAnswerChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isChecked: boolean;
  correctAnswer: string | null;
}

export const AnswerOptions = ({
  shuffledOptions,
  selectedAnswer,
  handleAnswerChange,
  isChecked,
  correctAnswer,
}: AnswerOptionsProps) => {
  return (
    <div className="space-y-3 sm:space-y-4">
      {shuffledOptions.map((option, index) => {
        const isCorrectOption = correctAnswer === option;
        const isSelectedOption = selectedAnswer === option;

        let optionContainerClasses =
          "flex items-center p-3 sm:p-4 border rounded-lg transition-colors duration-150 ease-in-out";
        let labelClasses = "text-base sm:text-lg w-full";

        if (isChecked) {
          optionContainerClasses += " cursor-default";
          labelClasses += " cursor-default";

          if (isCorrectOption) {
            optionContainerClasses +=
              " bg-green-50 border-green-500 ring-1 ring-green-500";
            labelClasses += " text-green-700 font-semibold";
          } else if (isSelectedOption) {
            optionContainerClasses += " bg-red-50 border-red-500 ring-1 ring-red-500";
            labelClasses += " text-red-700";
          } else {
            optionContainerClasses += " bg-gray-100 border-gray-300";
            labelClasses += " text-gray-500";
          }
        } else {
          optionContainerClasses +=
            " border-gray-300 hover:bg-blue-50 hover:border-blue-300 cursor-pointer";
          labelClasses += " cursor-pointer text-gray-700";
          if (isSelectedOption) {
            optionContainerClasses += " bg-blue-100 border-blue-400 ring-1 ring-blue-400";
          }
        }

        return (
          <div key={index} className={optionContainerClasses}>
            <input
              type="radio"
              id={`option${index + 1}`}
              name="answer"
              value={option}
              checked={isSelectedOption}
              onChange={handleAnswerChange}
              disabled={isChecked}
              className="mr-3 h-5 w-5 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <label htmlFor={`option${index + 1}`} className={labelClasses}>
              {option}
            </label>
          </div>
        );
      })}
    </div>
  );
};
