"use client";

import { FIELDS, FIELD_LABELS, MESSAGES } from "@/constants";
import {
  correctCountAtom,
  currentIndexAtom,
  questionsForRetryAtom,
  wrongCountAtom,
  wrongQuestionsAtom,
} from "@/jotai";
import { Field } from "@/types";
import { getWrongAnswersByField, storedToQuestionItem } from "@/utils/wrongAnswerStorage";
import { useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface FieldSummary {
  field: Field;
  questionCount: number;
  totalMistakes: number;
}

export const StoredWrongReviewSection = () => {
  const router = useRouter();
  const setQuestionsForRetry = useSetAtom(questionsForRetryAtom);
  const setCurrentIndex = useSetAtom(currentIndexAtom);
  const setCorrectCount = useSetAtom(correctCountAtom);
  const setWrongCount = useSetAtom(wrongCountAtom);
  const setWrongQuestions = useSetAtom(wrongQuestionsAtom);
  const [fieldSummaries, setFieldSummaries] = useState<FieldSummary[]>([]);
  const [minMistakeCount, setMinMistakeCount] = useState(1);

  const refreshSummaries = useCallback(() => {
    const summaries = FIELDS.map((field) => {
      const stored = getWrongAnswersByField(field, minMistakeCount);
      return {
        field,
        questionCount: stored.length,
        totalMistakes: stored.reduce((sum, item) => sum + item.mistakeCount, 0),
      };
    });
    setFieldSummaries(summaries);
  }, [minMistakeCount]);

  useEffect(() => {
    refreshSummaries();
  }, [refreshSummaries]);

  const handleReviewField = (field: Field) => {
    const storedQuestions = getWrongAnswersByField(field, minMistakeCount);
    if (storedQuestions.length === 0) return;

    const questionsToRetry = storedQuestions.map(storedToQuestionItem);

    setQuestionsForRetry(questionsToRetry);
    setCurrentIndex(0);
    setCorrectCount(0);
    setWrongCount(0);
    setWrongQuestions([]);
    router.push("/questions");
  };

  const totalStoredQuestions = fieldSummaries.reduce(
    (sum, s) => sum + s.questionCount,
    0,
  );

  return (
    <div className="mt-10 pt-8 border-t border-gray-200">
      <h2 className="text-xl sm:text-2xl font-bold mb-2 text-gray-600">
        {MESSAGES.STORED_WRONG_REVIEW}
      </h2>
      <p className="text-sm sm:text-base text-gray-500 mb-6">
        {MESSAGES.STORED_WRONG_REVIEW_DESC}
      </p>

      <div className="mb-4">
        <label
          htmlFor="min-mistake-count"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          間違えた回数が次の値以上の問題
        </label>
        <input
          type="number"
          id="min-mistake-count"
          value={minMistakeCount}
          onChange={(e) =>
            setMinMistakeCount(Math.max(1, parseInt(e.target.value, 10) || 1))
          }
          className="w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          min="1"
        />
      </div>

      {!totalStoredQuestions ? (
        <p className="text-base text-gray-600 bg-gray-100 p-4 rounded-md border border-gray-200">
          {MESSAGES.NO_STORED_WRONG_QUESTIONS}
        </p>
      ) : (
        <div className="space-y-3">
          {fieldSummaries.map(({ field, questionCount, totalMistakes }) => (
            <button
              key={field}
              onClick={() => handleReviewField(field)}
              disabled={questionCount === 0}
              className={`w-full text-left p-4 rounded-lg border transition duration-150 ease-in-out ${
                questionCount === 0
                  ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white border-gray-200 hover:border-orange-300 hover:bg-orange-50 text-gray-600"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="font-semibold text-base sm:text-lg">
                  {FIELD_LABELS[field]}
                  {MESSAGES.REVIEW_FIELD_QUESTIONS}
                </span>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm sm:text-base">
                  <span>
                    {MESSAGES.STORED_WRONG_COUNT}{" "}
                    <span className="font-medium">{questionCount}問</span>
                  </span>
                  <span className="text-orange-600">
                    {MESSAGES.TOTAL_MISTAKE_COUNT}{" "}
                    <span className="font-medium">{totalMistakes}回</span>
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
