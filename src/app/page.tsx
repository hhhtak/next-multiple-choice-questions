"use client";

import { FieldSelector } from "@/components/quiz/FieldSelector";
import { selectedFieldsAtom } from "@/jotai";
import { Field } from "@/types";
import { useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useState } from "react";

const StartScreen = () => {
  const setSelectedFields = useSetAtom(selectedFieldsAtom);
  const [selectedFields, setSelectedFieldsLocal] = useState<Field[]>([]);
  const router = useRouter();

  const handleFieldChange = (field: Field) => {
    setSelectedFieldsLocal((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const handleGoToCategory = () => {
    setSelectedFields(selectedFields);
    router.push("/questions/category");
  };

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-600">
        試験を開始しますか？
      </h1>

      <FieldSelector
        selectedFields={selectedFields}
        onFieldChange={handleFieldChange}
      />

      <button
        onClick={handleGoToCategory}
        className={`w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-150 ease-in-out ${
          selectedFields.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        } text-base sm:text-lg`}
        disabled={selectedFields.length === 0}
      >
        カテゴリを選択して試験へ
      </button>
    </div>
  );
};

export default StartScreen;
