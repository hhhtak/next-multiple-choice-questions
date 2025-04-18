"use client";

import {
  correctCountAtom,
  currentIndexAtom,
  wrongCountAtom,
  wrongQuestionsAtom,
} from "@/jotai";
import { useAtom, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";

const ResultScreen = () => {
  // --- ロジック部分は変更なし ---
  const [correctCount, setCorrectCount] = useAtom(correctCountAtom);
  const [wrongCount, setWrongCount] = useAtom(wrongCountAtom);
  const setCurrentIndex = useSetAtom(currentIndexAtom);
  // setCorrectCount, setWrongCount は useAtom から取得済みなので useSetAtom は不要
  // const setCorrectCount = useSetAtom(correctCountAtom);
  // const setWrongCount = useSetAtom(wrongCountAtom);
  const [wrongQuestions, setWrongQuestions] = useAtom(wrongQuestionsAtom);
  const router = useRouter();

  const handleBackToTop = () => {
    setCurrentIndex(0);
    setCorrectCount(0); // useAtom から取得した setter を使用
    setWrongCount(0); // useAtom から取得した setter を使用
    setWrongQuestions([]);
    router.push("/");
  };

  const totalAnswered = correctCount + wrongCount; // 回答総数を計算
  // --- ロジック部分は変更なし ここまで ---

  return (
    // layout.tsx でパディングが適用されるため、ここでは削除
    <div>
      {/* 見出し: スマホでは text-2xl, sm以上で text-3xl */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-white">試験結果</h1>

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
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">
        間違った問題の確認
      </h2>
      {wrongQuestions.length > 0 ? (
        <ul className="space-y-4">
          {/* リストの間隔を調整 */}
          {wrongQuestions.map((wrongQuestion, index) => (
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
                <span className="text-green-600 font-medium">
                  {wrongQuestion.correctAnswer}
                </span>
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

      {/* トップに戻るボタン */}
      <div className="mt-8 text-center sm:text-left">
        {/* ボタンの余白と配置を調整 */}
        <button
          onClick={handleBackToTop}
          // スマホでは幅いっぱい、sm以上で自動幅
          // パディング、文字サイズ、フォーカススタイルを調整
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 sm:py-3 sm:px-6 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-base sm:text-lg"
        >
          トップに戻る
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
