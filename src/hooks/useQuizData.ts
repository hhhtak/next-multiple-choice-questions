import { CSV_PATHS } from "@/constants";
import { Field, QuestionItem } from "@/types";
import { parseCsv } from "@/util/parseCsv";
import { shuffleArray } from "@/utils/arrayUtils";
import { useEffect, useState } from "react";

interface UseQuizDataReturn {
  questionData: QuestionItem[];
  loading: boolean;
  error: string | null;
}

export const useQuizData = (
  selectedFields: Field[],
  isRandom: boolean
): UseQuizDataReturn => {
  const [questionData, setQuestionData] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCsv = async () => {
      if (selectedFields.length === 0) {
        setQuestionData([]);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const csvPromises = selectedFields.map(async (field) => {
          const res = await fetch(CSV_PATHS[field]);
          if (!res.ok) {
            throw new Error(`Failed to fetch ${field}.csv: ${res.statusText}`);
          }
          const text = await res.text();
          return parseCsv(text);
        });

        const csvDataArrays = await Promise.all(csvPromises);
        let combinedData = csvDataArrays.flat();

        if (isRandom) {
          combinedData = shuffleArray(combinedData);
        }

        setQuestionData(combinedData);
      } catch (err) {
        console.error("CSVファイルの読み込みに失敗しました:", err);
        setError(err instanceof Error ? err.message : "不明なエラーが発生しました");
        setQuestionData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCsv();
  }, [selectedFields, isRandom]);

  return { questionData, loading, error };
};
