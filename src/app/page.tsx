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

  if (loading) return <div className="text-center">読み込み中...</div>;

  return (
    <div className="p-4">
      {/* 全体の余白を調整 */}
      <h1 className="text-3xl font-bold mb-6">試験を開始しますか？</h1>
      {/* 見出しの文字サイズと太字 */}
      <div className="mb-6 space-y-3">
        {/* チェックボックスの間隔を調整 */}
        <div className="flex items-center">
          {/* チェックボックスとラベルを横並びにする */}
          <input
            type="checkbox"
            id="it"
            checked={selectedFields.includes("it")}
            onChange={() => handleFieldChange("it")}
            className="mr-3 h-5 w-5 text-blue-600 rounded" // チェックボックスの色を調整
          />
          <label htmlFor="it" className="text-lg">
            IT分野
          </label>
        </div>
        <div className="flex items-center">
          {/* チェックボックスとラベルを横並びにする */}
          <input
            type="checkbox"
            id="customer"
            checked={selectedFields.includes("customer")}
            onChange={() => handleFieldChange("customer")}
            className="mr-3 h-5 w-5 text-blue-600 rounded" // チェックボックスの色を調整
          />
          <label htmlFor="customer" className="text-lg">
            顧客分野
          </label>
        </div>
        <div className="flex items-center">
          {/* チェックボックスとラベルを横並びにする */}
          <input
            type="checkbox"
            id="product"
            checked={selectedFields.includes("product")}
            onChange={() => handleFieldChange("product")}
            className="mr-3 h-5 w-5 text-blue-600 rounded" // チェックボックスの色を調整
          />
          <label htmlFor="product" className="text-lg">
            商品分野
          </label>
        </div>
      </div>
      <div className="mb-6 flex items-center">
        {/* チェックボックスとラベルを横並びにする */}
        <input
          type="checkbox"
          id="random"
          checked={isRandom}
          onChange={handleRandomChange}
          className="mr-3 h-5 w-5 text-blue-600 rounded" // チェックボックスの色を調整
        />
        <label htmlFor="random" className="text-lg">
          問題をランダムで表示させる
        </label>
      </div>
      <button
        onClick={() => router.push("/questions")}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg disabled:bg-gray-400" // ボタンのスタイルを調整
        disabled={selectedFields.length === 0}
      >
        試験スタート
      </button>
    </div>
  );
};

export default StartScreen;
