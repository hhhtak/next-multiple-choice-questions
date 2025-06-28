import { MIN_START_INDEX } from "@/constants";

interface QuizOptionsProps {
  isRandom: boolean;
  onRandomChange: () => void;
  useStartIndex: boolean;
  onUseStartIndexChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  startIndex: number | null;
  onStartIndexChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  showAnswers: boolean;
  onShowAnswersChange: () => void;
}

export const QuizOptions = ({
  isRandom,
  onRandomChange,
  useStartIndex,
  onUseStartIndexChange,
  startIndex,
  onStartIndexChange,
  showAnswers,
  onShowAnswersChange,
}: QuizOptionsProps) => {
  return (
    <div className="flex flex-col items-start space-y-3 mb-8 border-t pt-6 mt-6 border-gray-200">
      <p className="text-lg font-semibold mb-1 text-gray-600">オプション:</p>

      {/* ランダム表示 */}
      <div className="mb-6 flex items-center">
        <input
          type="checkbox"
          id="random"
          checked={isRandom}
          onChange={onRandomChange}
          className="mr-3 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
        />
        <label htmlFor="random" className="text-base sm:text-lg text-gray-600">
          問題をランダムで表示させる
        </label>
      </div>

      {/* 開始位置指定チェックボックス */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="useStartIndex"
          checked={useStartIndex}
          onChange={onUseStartIndexChange}
          className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-offset-1"
        />
        <label htmlFor="useStartIndex" className="text-base sm:text-lg text-gray-600">
          開始位置を指定する <span className="text-sm text-gray-600">(0から開始)</span>
        </label>
      </div>

      {/* 開始位置入力 */}
      <div className="flex items-center space-x-3 w-full sm:w-auto pl-7">
        <label
          htmlFor="startIndex"
          className="text-base sm:text-lg text-gray-600 whitespace-nowrap"
        >
          開始番号:
        </label>
        <input
          type="number"
          id="startIndex"
          value={startIndex !== null ? startIndex : ""}
          onChange={onStartIndexChange}
          disabled={!useStartIndex}
          className={`border border-gray-300 rounded-md px-3 py-1.5 text-base sm:text-lg w-24 text-gray-500 ${
            !useStartIndex ? "bg-gray-200 cursor-not-allowed" : ""
          } focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none`}
          min={MIN_START_INDEX}
          placeholder="0"
        />
      </div>

      {/* 回答を確認するチェックボックス */}
      <div className="flex items-center space-x-2 pt-2">
        <input
          type="checkbox"
          id="showAnswers"
          checked={showAnswers}
          onChange={onShowAnswersChange}
          className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-offset-1"
        />
        <label htmlFor="showAnswers" className="text-base sm:text-lg text-gray-600">
          回答を常に表示する
        </label>
      </div>
    </div>
  );
};
