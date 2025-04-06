"use client";

import { currentIndexAtom, questionDataAtom } from "@/jotai";
import { parseCsv } from "@/util/parseCsv";
import { useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Field = "it" | "customer" | "product";

const StartScreen = () => {
  const setQuestionData = useSetAtom(questionDataAtom);
  const setCurrentIndex = useSetAtom(currentIndexAtom);
  const [loading, setLoading] = useState(true);
  const [selectedFields, setSelectedFields] = useState<Field[]>([]); // 選択された分野を保持
  const router = useRouter();

  const handleFieldChange = (field: Field) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  useEffect(() => {
    const fetchCsv = async () => {
      if (selectedFields.length === 0) {
        setLoading(false);
        return; // 選択されていない場合は読み込まない
      }

      setLoading(true);
      const csvPromises = selectedFields.map(async (field) => {
        const res = await fetch(`/csv/${field}.csv`);
        const text = await res.text();
        return parseCsv(text);
      });

      try {
        const csvDataArrays = await Promise.all(csvPromises);
        const combinedData = csvDataArrays.flat(); // 複数のCSVデータを結合
        setQuestionData(combinedData);
        setCurrentIndex(0);
      } catch (error) {
        console.error("CSVファイルの読み込みに失敗しました:", error);
        // エラー処理を追加
      } finally {
        setLoading(false);
      }
    };

    fetchCsv();
  }, [selectedFields, setQuestionData, setCurrentIndex]);

  if (loading) return <div>読み込み中...</div>;

  return (
    <>
      <h1 className="text-2xl mb-4">試験を開始しますか？</h1>
      <div className="mb-4">
        {/* チェックボックス */}
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
      <button
        onClick={() => router.push("/questions")}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={selectedFields.length === 0} // 選択されていない場合はボタンを無効化
      >
        試験スタート
      </button>
    </>
  );
};

export default StartScreen;
