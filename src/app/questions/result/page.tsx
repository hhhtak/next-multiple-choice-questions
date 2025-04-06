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
  const [correctCount] = useAtom(correctCountAtom);
  const [wrongCount] = useAtom(wrongCountAtom);
  const setCurrentIndex = useSetAtom(currentIndexAtom);
  const setCorrectCount = useSetAtom(correctCountAtom);
  const setWrongCount = useSetAtom(wrongCountAtom);
  const [wrongQuestions, setWrongQuestions] = useAtom(wrongQuestionsAtom);
  const router = useRouter();

  const handleBackToTop = () => {
    setCurrentIndex(0);
    setCorrectCount(0);
    setWrongCount(0);
    setWrongQuestions([]);
    router.push("/");
  };

  return (
    <div className="p-4">
      {/* 全体の余白を調整 */}
      <h1 className="text-3xl font-bold mb-6">結果</h1>
      {/* 見出しの文字サイズと太字 */}
      <p className="text-lg mb-2">正解数: {correctCount}</p>
      {/* 正解数の文字サイズを調整 */}
      <p className="text-lg mb-6">不正解数: {wrongCount}</p>
      {/* 不正解数の文字サイズを調整 */}
      <h2 className="text-2xl font-bold mb-4">間違った問題</h2>
      {/* 見出しの文字サイズと太字 */}
      {wrongQuestions.length > 0 ? (
        <ul className="space-y-4">
          {/* リストの間隔を調整 */}
          {wrongQuestions.map((wrongQuestion, index) => (
            <li key={index} className="p-4 border rounded-lg shadow-md bg-gray-100">
              {/* 各問題の背景色とボーダー */}
              <p className="font-bold mb-2">問題: {wrongQuestion.question}</p>
              {/* 問題の文字を太字 */}
              <p className="mb-2">
                あなたの回答:
                <span className="text-red-500">{wrongQuestion.selectedAnswer}</span>
              </p>
              <p>正解: {wrongQuestion.correctAnswer}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>間違った問題はありませんでした。</p>
      )}
      <div className="mt-8">
        {/* ボタンの余白を調整 */}
        <button
          onClick={handleBackToTop}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg" // ボタンのスタイルを調整
        >
          トップに戻る
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
