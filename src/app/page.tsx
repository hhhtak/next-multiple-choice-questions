"use client";

import { currentIndexAtom, questionDataAtom, startQuestionIndexAtom } from "@/jotai";
import { parseCsv } from "@/util/parseCsv";
import { useAtom, useSetAtom } from "jotai";
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
  const [, setStartQuestionIndex] = useAtom(startQuestionIndexAtom); // 追加
  const [loading, setLoading] = useState(true);
  const [selectedFields, setSelectedFields] = useState<Field[]>([]);
  const [isRandom, setIsRandom] = useState(false);
  const [startIndex, setStartIndex] = useState<number | null>(null); // 追加
  const [useStartIndex, setUseStartIndex] = useState(false); // 追加
  const router = useRouter();

  const handleFieldChange = (field: Field) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const handleRandomChange = () => {
    setIsRandom((prev) => !prev);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setStartIndex(isNaN(value) ? null : value);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUseStartIndex(event.target.checked);
  };

  const handleStart = () => {
    let start = 0; // デフォルトは0から開始
    if (useStartIndex && startIndex !== null && startIndex >= 0) {
      start = startIndex; // チェックボックスがオンで、かつ有効な開始位置が入力されている場合
    }
    setStartQuestionIndex(start);
    router.push("/questions");
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
      {/* 開始位置設定 */}
      <div className="flex flex-col items-start space-y-2 mb-6">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="useStartIndex"
            checked={useStartIndex}
            onChange={handleCheckboxChange}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="useStartIndex" className="text-lg">
            開始位置を指定する(選択した数値+1から開始します)
          </label>
        </div>
        <div className="flex items-center space-x-4">
          <label htmlFor="startIndex" className="text-lg">
            開始位置:
          </label>
          <input
            type="number"
            id="startIndex"
            value={startIndex !== null ? startIndex : ""}
            onChange={handleInputChange}
            disabled={!useStartIndex} // チェックボックスがオフの場合は無効化
            className={`border border-gray-300 rounded-md px-3 py-2 text-lg ${
              !useStartIndex ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>
      </div>
      <button
        onClick={handleStart}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg disabled:bg-gray-400" // ボタンのスタイルを調整
        disabled={selectedFields.length === 0}
      >
        試験スタート
      </button>
    </div>
  );
};

export default StartScreen;
