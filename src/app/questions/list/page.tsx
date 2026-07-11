"use client";

import { QuestionListTable } from "@/components/quiz/QuestionListTable";
import { MESSAGES } from "@/constants";
import { questionDataAtom, selectedCategoriesAtom } from "@/jotai";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const QuestionListPage = () => {
  const questionData = useAtomValue(questionDataAtom);
  const selectedCategories = useAtomValue(selectedCategoriesAtom);
  const router = useRouter();

  useEffect(() => {
    if (questionData.length === 0) {
      router.replace("/questions/category");
    }
  }, [questionData.length, router]);

  if (questionData.length === 0) {
    return (
      <div className="text-center py-10 text-gray-600">{MESSAGES.LOADING}</div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-2">
          問題一覧
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          {selectedCategories.length > 0
            ? `選択カテゴリ: ${selectedCategories.join(" / ")}`
            : "全カテゴリ"}
          <span className="ml-2 text-teal-600 font-medium">
            （{questionData.length} 件）
          </span>
        </p>
      </div>

      <QuestionListTable questions={questionData} />

      <div className="flex flex-wrap gap-3 mt-8">
        <button
          onClick={() => router.push("/questions/category")}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg"
        >
          カテゴリ選択に戻る
        </button>
        <button
          onClick={() => router.push("/")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          {MESSAGES.BACK_TO_TOP}
        </button>
      </div>
    </div>
  );
};

export default QuestionListPage;
