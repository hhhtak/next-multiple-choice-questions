"use client";

import { currentIndexAtom, quizDataAtom } from "@/atoms";
import { parseCsv } from "@/util/parseCsv";
import { useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const StartScreen = () => {
  const setQuizData = useSetAtom(quizDataAtom);
  const setCurrentIndex = useSetAtom(currentIndexAtom);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCsv = async () => {
      const res = await fetch("/csv/sampleA.csv");
      const text = await res.text();
      const parsed = parseCsv(text);
      setQuizData(parsed);
      setCurrentIndex(0);
      setLoading(false);
    };
    fetchCsv();
  }, [setQuizData, setCurrentIndex]);

  if (loading) return <div>読み込み中...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">クイズを開始しますか？</h1>
      <button
        onClick={() => router.push("/quiz")}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        開始
      </button>
    </div>
  );
};

export default StartScreen;
