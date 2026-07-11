import { QuestionItem } from "@/types";

interface QuestionListTableProps {
  questions: QuestionItem[];
}

const TABLE_COLUMNS = [
  { key: "no", label: "No", className: "w-16 min-w-[4rem]" },
  { key: "memo", label: "Memo", className: "min-w-[8rem]" },
  { key: "category", label: "Category", className: "min-w-[6rem]" },
  { key: "question", label: "Question", className: "min-w-[12rem]" },
  { key: "answer", label: "Answer", className: "min-w-[8rem]" },
] as const;

export const QuestionListTable = ({ questions }: QuestionListTableProps) => {
  if (questions.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
        表示する問題がありません。
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
      <table className="w-full border-collapse text-sm sm:text-base">
        <thead>
          <tr className="bg-teal-600 text-white">
            {TABLE_COLUMNS.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-left font-semibold whitespace-nowrap sticky top-0 bg-teal-600 ${col.className}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {questions.map((q, index) => (
            <tr
              key={`${q.id}-${index}`}
              className={`border-b border-gray-100 transition-colors hover:bg-teal-50 ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <td className="px-4 py-3 text-gray-700 font-medium whitespace-nowrap align-top">
                {q.id}
              </td>
              <td className="px-4 py-3 text-gray-600 align-top whitespace-pre-wrap break-words">
                {q.memo || "—"}
              </td>
              <td className="px-4 py-3 text-gray-600 align-top whitespace-nowrap">
                {q.category}
              </td>
              <td className="px-4 py-3 text-gray-800 align-top whitespace-pre-wrap break-words">
                {q.question}
              </td>
              <td className="px-4 py-3 text-teal-700 font-medium align-top whitespace-pre-wrap break-words">
                {q.answer}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
