"use client";

import {
  currentIndexAtom,
  questionDataAtom,
  showAnswersAtom,
  startQuestionIndexAtom,
} from "@/jotai";
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
  const [, setStartQuestionIndex] = useAtom(startQuestionIndexAtom);
  const [loading, setLoading] = useState(true);
  const [selectedFields, setSelectedFields] = useState<Field[]>([]);
  const [isRandom, setIsRandom] = useState(false);
  const [startIndex, setStartIndex] = useState<number | null>(null);
  const [useStartIndex, setUseStartIndex] = useState(false);
  const [showAnswers, setShowAnswers] = useAtom(showAnswersAtom); // Jotai atom を使用
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

  const handleShowAnswersChange = () => {
    setShowAnswers((prev) => !prev);
  };

  const handleStart = () => {
    let start = 0;
    if (useStartIndex && startIndex !== null && startIndex >= 0) {
      start = startIndex;
    }
    setStartQuestionIndex(start);
    router.push("/questions");
  };

  useEffect(() => {
    const fetchCsv = async () => {
      if (selectedFields.length === 0) {
        // 初期表示時や選択解除時にデータとローディング状態をリセット
        setQuestionData([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const csvPromises = selectedFields.map(async (field) => {
        const res = await fetch(`/csv/${field}.csv`);
        if (!res.ok) {
          throw new Error(`Failed to fetch ${field}.csv: ${res.statusText}`);
        }
        const text = await res.text();
        return parseCsv(text);
      });

      try {
        const csvDataArrays = await Promise.all(csvPromises);
        let combinedData = csvDataArrays.flat();

        if (isRandom) {
          combinedData = shuffleArray(combinedData);
        }

        setQuestionData(combinedData);
        setCurrentIndex(0); // インデックスをリセット
      } catch (error) {
        console.error("CSVファイルの読み込みに失敗しました:", error);
        // エラー発生時もデータとローディング状態をリセット
        setQuestionData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCsv();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFields, isRandom]); // setQuestionData, setCurrentIndex は通常変更されないため依存配列から除外可能

  // ローディング表示に少し余白を追加
  if (loading && selectedFields.length > 0)
    return <div className="text-center py-10">読み込み中...</div>;

  return (
    // 全体のパディングを調整 (スマホ: p-4, sm以上: p-6)
    <div className="p-4 sm:p-6">
      {/* 見出し: スマホでは text-2xl, sm以上で text-3xl */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-600">
        試験を開始しますか？
      </h1>

      {/* 分野選択: チェックボックス間のスペースを調整 */}
      <div className="mb-6 space-y-4">
        <p className="text-lg font-semibold mb-3 text-gray-600">
          出題分野を選択してください:
        </p>
        {/* 各チェックボックス要素 */}
        {(["it", "customer", "product"] as Field[]).map((field) => (
          <div key={field} className="flex items-center">
            <input
              type="checkbox"
              id={field}
              checked={selectedFields.includes(field)}
              onChange={() => handleFieldChange(field)}
              // チェックボックスのサイズとフォーカススタイル調整
              className="mr-3 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
            />
            {/* ラベル: スマホでは text-base, sm以上で text-lg */}
            <label
              htmlFor={field}
              className="text-base sm:text-lg text-gray-600 capitalize"
            >
              {field === "it" ? "IT分野" : field === "customer" ? "顧客分野" : "商品分野"}
            </label>
          </div>
        ))}
      </div>

      {/* ランダム表示 */}
      <div className="mb-6 flex items-center">
        <input
          type="checkbox"
          id="random"
          checked={isRandom}
          onChange={handleRandomChange}
          className="mr-3 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
        />
        <label htmlFor="random" className="text-base sm:text-lg text-gray-600">
          問題をランダムで表示させる
        </label>
      </div>

      {/* 開始位置設定 */}
      <div className="flex flex-col items-start space-y-3 mb-8 border-t pt-6 mt-6 border-gray-200">
        {" "}
        {/* 区切り線とマージン追加 */}
        <p className="text-lg font-semibold mb-1 text-gray-600">オプション:</p>
        {/* 開始位置指定チェックボックス */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="useStartIndex"
            checked={useStartIndex}
            onChange={handleCheckboxChange}
            // サイズ調整
            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-offset-1"
          />
          <label htmlFor="useStartIndex" className="text-base sm:text-lg text-gray-600">
            開始位置を指定する <span className="text-sm text-gray-600">(0から開始)</span>
          </label>
        </div>
        {/* 開始位置入力 */}
        <div className="flex items-center space-x-3 w-full sm:w-auto pl-7">
          {/* チェックボックスに合わせてインデント */}
          <label
            htmlFor="startIndex"
            className="text-base sm:text-lg text-gray-600 whitespace-nowrap"
          >
            開始番号:
          </label>
          <input
            type="number"
            id="startIndex"
            value={startIndex !== null ? startIndex : ""}
            onChange={handleInputChange}
            disabled={!useStartIndex}
            // サイズ、文字サイズ、幅を調整
            className={`border border-gray-300 rounded-md px-3 py-1.5 text-base sm:text-lg w-24 text-gray-500 ${
              // スマホ用に少し小さく
              !useStartIndex ? "bg-gray-200 cursor-not-allowed" : ""
            } focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none`}
            min="0" // マイナス値を入力できないように
            placeholder="0"
          />
        </div>
        {/* 回答を確認するチェックボックス */}
        <div className="flex items-center space-x-2 pt-2">
          <input
            type="checkbox"
            id="showAnswers"
            checked={showAnswers}
            onChange={handleShowAnswersChange}
            className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-offset-1"
          />
          <label htmlFor="showAnswers" className="text-base sm:text-lg text-gray-600">
            回答を常に表示する (デバッグ用)
            {/* TODO: この機能の具体的な実装は別途必要です */}
          </label>
        </div>
      </div>

      {/* 開始ボタン */}
      <button
        onClick={handleStart}
        // スマホでは幅いっぱい(w-full), sm以上で自動幅(w-auto)
        // パディング、文字サイズ、フォーカススタイルを調整
        className={`w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-150 ease-in-out ${
          selectedFields.length === 0 || (loading && selectedFields.length > 0)
            ? "bg-gray-400 cursor-not-allowed" // disabled時のスタイルを明確化
            : "hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        } text-base sm:text-lg`}
        // disabled 属性を動的に設定
        disabled={selectedFields.length === 0 || (loading && selectedFields.length > 0)}
      >
        {loading && selectedFields.length > 0 ? "読み込み中..." : "試験スタート"}
      </button>
    </div>
  );
};

export default StartScreen;
