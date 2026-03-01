import { CSV_PATHS } from "@/constants";
import { Field, QuestionItem } from "@/types";
import { parseCsv } from "@/util/parseCsv";
import { useEffect, useState } from "react";

/**
 * 「1-1」「1-2」「1-10」形式のカテゴリを自然順（数値順）でソートする
 */
function naturalCategorySort(a: string, b: string): number {
  const partsA = a.split("-").map((p) => {
    const num = parseInt(p, 10);
    return Number.isNaN(num) ? p : num;
  });
  const partsB = b.split("-").map((p) => {
    const num = parseInt(p, 10);
    return Number.isNaN(num) ? p : num;
  });
  const len = Math.max(partsA.length, partsB.length);
  for (let i = 0; i < len; i++) {
    const pa = partsA[i];
    const pb = partsB[i];
    if (pa === undefined) return -1;
    if (pb === undefined) return 1;
    if (typeof pa === "number" && typeof pb === "number") {
      if (pa !== pb) return pa - pb;
    } else {
      const sa = String(pa);
      const sb = String(pb);
      if (sa !== sb) return sa < sb ? -1 : 1;
    }
  }
  return 0;
}

interface UseCategoriesReturn {
  categories: string[];
  allQuestionData: QuestionItem[];
  loading: boolean;
  error: string | null;
}

/**
 * 選択した分野のCSVを読み込み、ユニークなカテゴリ一覧と問題データを返す
 */
export const useCategories = (selectedFields: Field[]): UseCategoriesReturn => {
  const [categories, setCategories] = useState<string[]>([]);
  const [allQuestionData, setAllQuestionData] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCsv = async () => {
      if (selectedFields.length === 0) {
        setCategories([]);
        setAllQuestionData([]);
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
        const combined = csvDataArrays.flat();

        const categorySet = new Set<string>();
        combined.forEach((item) => {
          if (item.category?.trim()) {
            categorySet.add(item.category.trim());
          }
        });
        setCategories(Array.from(categorySet).sort(naturalCategorySort));
        setAllQuestionData(combined);
      } catch (err) {
        console.error("CSVファイルの読み込みに失敗しました:", err);
        setError(err instanceof Error ? err.message : "不明なエラーが発生しました");
        setCategories([]);
        setAllQuestionData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCsv();
  }, [selectedFields]);

  return { categories, allQuestionData, loading, error };
};
