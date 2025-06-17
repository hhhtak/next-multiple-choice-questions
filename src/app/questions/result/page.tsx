"use client";
import {
  correctCountAtom,
  currentIndexAtom,
  questionsForRetryAtom, // 追加: 再挑戦用の問題リストを管理するatom
  wrongCountAtom,
  wrongQuestionsAtom,
} from "@/jotai";
import { useAtom, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";

const ResultScreen = () => {
  const [correctCount, setCorrectCount] = useAtom(correctCountAtom);
  const [wrongCount, setWrongCount] = useAtom(wrongCountAtom);
  const setCurrentIndex = useSetAtom(currentIndexAtom);
  const setQuestionsForRetry = useSetAtom(questionsForRetryAtom); // 追加
  const [wrongQuestions, setWrongQuestions] = useAtom(wrongQuestionsAtom);
  const router = useRouter();

  const handleBackToTop = () => {
    setCurrentIndex(0);
    setCorrectCount(0);
    setWrongCount(0);
    setWrongQuestions([]);
    setQuestionsForRetry(null); // 再挑戦リストをクリア
    router.push("/");
  };

  // 追加: 間違った問題を再度解く処理
  const handleRetryWrongQuestions = () => {
    if (wrongQuestions.length === 0) return;

    // WrongQuestionItem型からselectedAnswerプロパティを除外し、QuestionItem[]型に変換
    // まず重複を排除したリストを作成
    const uniqueRetryQuestions = wrongQuestions.filter(
      (question, index, self) => index === self.findIndex((q) => q.id === question.id)
    );

    const questionsToRetry = uniqueRetryQuestions.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ selectedAnswer, ...questionData }) => questionData
    );

    setQuestionsForRetry(questionsToRetry);
    setCurrentIndex(0);
    setCorrectCount(0);
    setWrongCount(0);
    // 再挑戦する問題リストをセットしたら、元の間違った問題リストはクリアする。
    setWrongQuestions([]); // これにより、次回の結果画面では再挑戦の結果のみが「間違った問題」として扱われる。
    router.push("/questions"); // クイズページに遷移
  };

  const totalAnswered = correctCount + wrongCount; // 回答総数を計算

  // 間違った問題のリストから重複を排除する (id を基準)
  const uniqueWrongQuestions = wrongQuestions.filter(
    (question, index, self) => index === self.findIndex((q) => q.id === question.id)
  );

  return (
    // layout.tsx でパディングが適用されるため、ここでは削除
    <div>
      {/* 見出し: スマホでは text-2xl, sm以上で text-3xl */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-600">試験結果</h1>

      {/* 結果サマリー: カード風のデザイン */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 mb-8">
        <p className="text-lg sm:text-xl font-semibold text-gray-600 mb-4">スコア</p>
        <div className="flex flex-col sm:flex-row sm:justify-around space-y-2 sm:space-y-0">
          <p className="text-base sm:text-lg text-gray-600">
            <span className="font-medium text-green-600">正解数:</span> {correctCount}
          </p>
          <p className="text-base sm:text-lg text-gray-600">
            <span className="font-medium text-red-600">不正解数:</span> {wrongCount}
          </p>
          <p className="text-base sm:text-lg text-gray-600">
            <span className="font-medium text-blue-600">正解率:</span>{" "}
            {totalAnswered > 0
              ? `${((correctCount / totalAnswered) * 100).toFixed(1)}%`
              : "N/A"}
          </p>
        </div>
      </div>

      {/* 間違った問題セクション */}
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-600">
        間違った問題の確認
      </h2>
      {uniqueWrongQuestions.length > 0 ? (
        <ul className="space-y-4">
          {/* リストの間隔を調整 */}
          {uniqueWrongQuestions.map((wrongQuestion, index) => (
            <li
              key={wrongQuestion.id ?? index} // 可能なら固有IDを使用 (jotai/index.ts の型定義に依存)
              className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white" // 背景を白に、ボーダーを少し薄く
            >
              {/* 問題文 */}
              <p className="font-semibold mb-2 text-base sm:text-lg text-gray-600">
                Q: {wrongQuestion.question}
              </p>
              {/* あなたの回答 */}
              <p className="mb-1 text-sm sm:text-base text-gray-600">
                あなたの回答:{" "}
                <span className="text-red-600 font-medium">
                  {wrongQuestion.selectedAnswer}
                </span>
              </p>
              {/* 正解 */}
              <p className="text-sm sm:text-base text-gray-600">
                正解:{" "}
                <span className="text-green-600 font-medium">{wrongQuestion.answer}</span>
              </p>
              {/* 解説 (メモ) があれば表示 (memo プロパティが型に存在する場合) */}
              {wrongQuestion.memo && (
                <p className="mt-2 pt-2 border-t border-gray-200 text-sm sm:text-base text-gray-600 whitespace-pre-wrap">
                  <span className="font-semibold block mb-1">解説:</span>{" "}
                  {wrongQuestion.memo}
                </p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-base sm:text-lg text-gray-600 bg-gray-100 p-4 rounded-md border border-gray-200">
          素晴らしい！間違った問題はありませんでした。
        </p>
      )}

      {/* ボタンセクション */}
      <div className="mt-8 flex flex-col sm:flex-row sm:justify-start sm:space-x-4 space-y-4 sm:space-y-0">
        <button
          onClick={handleBackToTop}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 sm:py-3 sm:px-6 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-base sm:text-lg"
        >
          トップに戻る
        </button>
        {uniqueWrongQuestions.length > 0 && ( // 重複排除後のリストでボタン表示を判定
          <button
            onClick={handleRetryWrongQuestions}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-5 sm:py-3 sm:px-6 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-base sm:text-lg"
          >
            間違った問題を再度解く
          </button>
        )}
      </div>
    </div>
  );
};

export default ResultScreen;
