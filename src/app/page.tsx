"use client";

import { currentIndexAtom, questionDataAtom } from "@/jotai";
import { parseCsv } from "@/util/parseCsv";
import { useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const StartScreen = () => {
  const setQuestionData = useSetAtom(questionDataAtom);
  const setCurrentIndex = useSetAtom(currentIndexAtom);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCsv = async () => {
      const res = await fetch("/csv/sampleA.csv");
      const text = await res.text();
      const parsed = parseCsv(text);
      setQuestionData(parsed);
      setCurrentIndex(0);
      setLoading(false);
    };
    fetchCsv();
  }, [setQuestionData, setCurrentIndex]);

  if (loading) return <div>読み込み中...</div>;

  return (
    <>
      <h1 className="text-2xl mb-4">試験を開始しますか？</h1>
      <button
        onClick={() => router.push("/questions")}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        試験スタート
      </button>
    </>
  );
};

export default StartScreen;
