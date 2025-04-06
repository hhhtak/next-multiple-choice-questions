"use client";

import { correctCountAtom, questionDataAtom, wrongCountAtom } from "@/jotai";
import { useAtom } from "jotai";

const ResultScreen = () => {
  const [correctCount] = useAtom(correctCountAtom);
  const [wrongCount] = useAtom(wrongCountAtom);
  const [questionData] = useAtom(questionDataAtom);

  return (
    <div>
      <h1>結果</h1>
      <p>正解数: {correctCount}</p>
      <p>不正解数: {wrongCount}</p>
      <h2>採番されたID</h2>
      <ul>
        {questionData.map((item) => (
          <li key={item.id}>{item.id}</li>
        ))}
      </ul>
    </div>
  );
};

export default ResultScreen;
