"use client";

import { QuizOptions } from "@/components/quiz/QuizOptions";
import { MESSAGES } from "@/constants";
import { useCategories } from "@/hooks/useCategories";
import {
  currentIndexAtom,
  questionDataAtom,
  selectedCategoriesAtom,
  selectedFieldsAtom,
  showAnswersAtom,
  startQuestionIndexAtom,
} from "@/jotai";
import { shuffleArray } from "@/utils/arrayUtils";
import { useAtom, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CategoryPage = () => {
  const [selectedFields] = useAtom(selectedFieldsAtom);
  const [selectedCategories, setSelectedCategories] = useAtom(selectedCategoriesAtom);
  const setQuestionData = useSetAtom(questionDataAtom);
  const setCurrentIndex = useSetAtom(currentIndexAtom);
  const setStartQuestionIndex = useSetAtom(startQuestionIndexAtom);
  const [showAnswers, setShowAnswers] = useAtom(showAnswersAtom);

  const [isRandom, setIsRandom] = useState(false);
  const [startIndex, setStartIndex] = useState<number | null>(null);
  const [useStartIndex, setUseStartIndex] = useState(false);

  const { categories, allQuestionData, loading, error } = useCategories(selectedFields);
  const router = useRouter();

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSelectAll = () => {
    setSelectedCategories([...categories]);
  };

  const handleDeselectAll = () => {
    setSelectedCategories([]);
  };

  const isAllSelected =
    categories.length > 0 &&
    categories.length === selectedCategories.length &&
    categories.every((c) => selectedCategories.includes(c));

  const handleRandomChange = () => setIsRandom((prev) => !prev);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setStartIndex(isNaN(value) ? null : value);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUseStartIndex(event.target.checked);
  };

  const handleShowAnswersChange = () => setShowAnswers((prev) => !prev);

  const handleStart = () => {
    const targetCategories =
      selectedCategories.length > 0 ? selectedCategories : categories;
    const filtered = allQuestionData.filter((q) =>
      targetCategories.includes(q.category?.trim() ?? "")
    );
    const dataToUse = isRandom ? shuffleArray(filtered) : filtered;

    let start = 0;
    if (useStartIndex && startIndex !== null && startIndex >= 0) {
      start = Math.min(startIndex, dataToUse.length - 1);
    }
    setQuestionData(dataToUse);
    setCurrentIndex(0);
    setStartQuestionIndex(start);
    router.push("/questions");
  };

  const canStart =
    !loading && selectedFields.length > 0 && categories.length > 0;

  // カテゴリページに来たときに、前回の選択をクリアする
  useEffect(() => {
    setSelectedCategories([]);
  }, [setSelectedCategories]);

  useEffect(() => {
    if (selectedFields.length === 0) {
      router.replace("/");
    }
  }, [selectedFields.length, router]);

  if (error) {
    return (
      <div className="p-4 sm:p-6 text-center text-red-600">
        <p className="mb-4 text-lg">エラーが発生しました: {error}</p>
        <button
          onClick={() => router.push("/")}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          トップに戻る
        </button>
      </div>
    );
  }

  if (selectedFields.length === 0) {
    return (
      <div className="p-4 sm:p-6 text-center text-gray-600">
        <p className="mb-4">分野が選択されていません。</p>
        <button
          onClick={() => router.push("/")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          トップに戻る
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-600">
        出題カテゴリを選択
      </h1>
      <p className="text-gray-500 mb-6 text-sm sm:text-base">
        チェックを付けた分類のみ出題されます。未選択の場合は全カテゴリが出題されます。
      </p>

      {loading ? (
        <div className="text-center py-10">{MESSAGES.LOADING}</div>
      ) : (
        <>
          <div className="mb-6 space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="text-lg font-semibold text-gray-600">
                カテゴリ一覧（複数選択可）:
              </p>
              <button
                type="button"
                onClick={isAllSelected ? handleDeselectAll : handleSelectAll}
                disabled={categories.length === 0}
                className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-1.5 px-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAllSelected ? "すべて解除" : "すべて"}
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
              {categories.length === 0 ? (
                <p className="text-gray-500">カテゴリがありません</p>
              ) : (
                categories.map((cat) => (
                  <label
                    key={cat}
                    className="flex items-center py-2 px-2 hover:bg-gray-100 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => handleCategoryChange(cat)}
                      className="mr-3 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                    />
                    <span className="text-gray-700">{cat}</span>
                  </label>
                ))
              )}
            </div>

            {selectedCategories.length > 0 && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  選択中のカテゴリ（{selectedCategories.length}件）:
                </p>
                <p className="text-sm text-gray-600 break-words">
                  {selectedCategories.join(" / ")}
                </p>
              </div>
            )}
          </div>

          <QuizOptions
            isRandom={isRandom}
            onRandomChange={handleRandomChange}
            useStartIndex={useStartIndex}
            onUseStartIndexChange={handleCheckboxChange}
            startIndex={startIndex}
            onStartIndexChange={handleInputChange}
            showAnswers={showAnswers}
            onShowAnswersChange={handleShowAnswersChange}
          />

          <div className="flex flex-wrap gap-3 items-center mt-6">
            <button
              onClick={() => router.push("/")}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg"
            >
              トップに戻る
            </button>
            <button
              onClick={handleStart}
              disabled={!canStart}
              className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg ${
                !canStart ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {MESSAGES.START_QUIZ}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryPage;
