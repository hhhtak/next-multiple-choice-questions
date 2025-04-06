"use client";

import { currentIndexAtom, questionDataAtom } from "@/jotai";
import { parseCsv } from "@/util/parseCsv";
import { useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Field = "it" | "customer" | "product";

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const StartScreen = () => {
  const setQuestionData = useSetAtom(questionDataAtom);
  const setCurrentIndex = useSetAtom(currentIndexAtom);
  const [loading, setLoading] = useState(true);
  const [selectedFields, setSelectedFields] = useState<Field[]>([]);
  const [isRandom, setIsRandom] = useState(false);
  const router = useRouter();

  const handleFieldChange = (field: Field) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const handleRandomChange = () => {
    setIsRandom((prev) => !prev);
  };

  useEffect(() => {
    const fetchCsv = async () => {
      if (selectedFields.length === 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const csvPromises = selectedFields.map(async (field) => {
        const res = await fetch(`/csv/${field}.csv`);
        const text = await res.text();
        return parseCsv(text);
      });

      try {
        const csvDataArrays = await Promise.all(csvPromises);
        let combinedData = csvDataArrays.flat();

        // isRandom が変更された場合もシャッフルする
        if (isRandom) {
          combinedData = shuffleArray(combinedData);
        }

        setQuestionData(combinedData);
        setCurrentIndex(0);
      } catch (error) {
        console.error("CSVファイルの読み込みに失敗しました:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCsv();
  }, [selectedFields, setQuestionData, setCurrentIndex, isRandom]); // isRandom を依存配列に追加

  if (loading) return <div>読み込み中...</div>;

  return (
    <>
      <h1 className="text-2xl mb-4">試験を開始しますか？</h1>
      <div className="mb-4">
        <div>
          <input
            type="checkbox"
            id="it"
            checked={selectedFields.includes("it")}
            onChange={() => handleFieldChange("it")}
          />
          <label htmlFor="it">IT分野</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="customer"
            checked={selectedFields.includes("customer")}
            onChange={() => handleFieldChange("customer")}
          />
          <label htmlFor="customer">顧客分野</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="product"
            checked={selectedFields.includes("product")}
            onChange={() => handleFieldChange("product")}
          />
          <label htmlFor="product">商品分野</label>
        </div>
      </div>
      <div className="mb-4">
        <input
          type="checkbox"
          id="random"
          checked={isRandom}
          onChange={handleRandomChange}
        />
        <label htmlFor="random">ランダム</label>
      </div>
      <button
        onClick={() => router.push("/questions")}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={selectedFields.length === 0}
      >
        試験スタート
      </button>
    </>
  );
};

export default StartScreen;
