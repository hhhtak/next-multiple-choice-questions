"use client";

import { FieldSelector } from "@/components/quiz/FieldSelector";
import { QuizOptions } from "@/components/quiz/QuizOptions";
import { MESSAGES } from "@/constants";
import { useQuizData } from "@/hooks/useQuizData";
import {
  currentIndexAtom,
  questionDataAtom,
  showAnswersAtom,
  startQuestionIndexAtom,
} from "@/jotai";
import { Field } from "@/types";
import { useAtom, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const StartScreen = () => {
  const setQuestionData = useSetAtom(questionDataAtom);
  const setCurrentIndex = useSetAtom(currentIndexAtom);
  const [, setStartQuestionIndex] = useAtom(startQuestionIndexAtom);
  const [selectedFields, setSelectedFields] = useState<Field[]>([]);
  const [isRandom, setIsRandom] = useState(false);
  const [startIndex, setStartIndex] = useState<number | null>(null);
  const [useStartIndex, setUseStartIndex] = useState(false);
  const [showAnswers, setShowAnswers] = useAtom(showAnswersAtom);
  const router = useRouter();

  // カスタムフックを使用してクイズデータを取得
  const { questionData, loading, error } = useQuizData(selectedFields, isRandom);

  // クイズデータが更新されたらJotaiの状態も更新
  useEffect(() => {
    setQuestionData(questionData);
    setCurrentIndex(0);
  }, [questionData, setQuestionData, setCurrentIndex]);

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

  // エラー表示
  if (error) {
    return (
      <div className="p-4 sm:p-6 text-center text-red-600">
        <p className="mb-4 text-lg">エラーが発生しました: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-150 ease-in-out"
        >
          ページを再読み込み
        </button>
      </div>
    );
  }

  // ローディング表示
  if (loading && selectedFields.length > 0) {
    return <div className="text-center py-10">{MESSAGES.LOADING}</div>;
  }

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-600">
        試験を開始しますか？
      </h1>

      <FieldSelector selectedFields={selectedFields} onFieldChange={handleFieldChange} />

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

      <button
        onClick={handleStart}
        className={`w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-150 ease-in-out ${
          selectedFields.length === 0 || (loading && selectedFields.length > 0)
            ? "bg-gray-400 cursor-not-allowed"
            : "hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        } text-base sm:text-lg`}
        disabled={selectedFields.length === 0 || (loading && selectedFields.length > 0)}
      >
        {loading && selectedFields.length > 0 ? MESSAGES.LOADING : MESSAGES.START_QUIZ}
      </button>
    </div>
  );
};

export default StartScreen;
