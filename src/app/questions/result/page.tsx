"use client";

import {
  correctCountAtom,
  currentIndexAtom,
  questionDataAtom,
  wrongCountAtom,
} from "@/jotai";
import { useAtom, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";

const ResultScreen = () => {
  const [correctCount] = useAtom(correctCountAtom);
  const [wrongCount] = useAtom(wrongCountAtom);
  const [questionData] = useAtom(questionDataAtom);
  const setCurrentIndex = useSetAtom(currentIndexAtom);
  const setCorrectCount = useSetAtom(correctCountAtom);
  const setWrongCount = useSetAtom(wrongCountAtom);
  const router = useRouter();

  const handleBackToTop = () => {
    setCurrentIndex(0);
    setCorrectCount(0);
    setWrongCount(0);
    router.push("/");
  };

  return (
    <div>
      <h1>結果</h1>
      <p>正解数: {correctCount}</p>
      <p>不正解数: {wrongCount}</p>
      <h2>問題ID</h2>
      <ul>
        {/* questionData が空の場合は何も表示しない */}
        {questionData.length > 0 ? (
          questionData.map((item) => <li key={item.id}>{item.id}</li>)
        ) : (
          <li>問題がありませんでした。</li>
        )}
      </ul>
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
