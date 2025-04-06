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
    <div>
      <h1>結果</h1>
      <p>正解数: {correctCount}</p>
      <p>不正解数: {wrongCount}</p>
      <h2>間違った問題</h2>
      {wrongQuestions.length > 0 ? (
        <ul>
          {wrongQuestions.map(
            (
              wrongQuestion,
              index // index を使用
            ) => (
              <li key={index} className="mb-4 border p-4 rounded">
                <p className="font-bold">問題: {wrongQuestion.question}</p>
                <p>
                  あなたの回答:
                  <span className="text-red-500">{wrongQuestion.selectedAnswer}</span>
                </p>
                <p>正解: {wrongQuestion.correctAnswer}</p> {/* correctAnswer を参照 */}
              </li>
            )
          )}
        </ul>
      ) : (
        <p>間違った問題はありませんでした。</p>
      )}
      <div className="mt-4">
        <button
          onClick={handleBackToTop}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          トップに戻る
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
