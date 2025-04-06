// utils/parseCsv.ts
import type { QuizItem } from "@/atoms";

export const parseCsv = (text: string): QuizItem[] => {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",").map((h) => h.trim());

  const rawData = lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim());
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const item: any = {};
    headers.forEach((header, i) => {
      item[header] = values[i];
    });
    return item;
  });

  const counters: Record<string, number> = {};
  const dataWithIds = rawData.map((item) => {
    console.log("item", item);
    const category = item["category"];
    console.log("category", category);
    if (!counters[category]) counters[category] = 1;
    const id = `${category.split("-")[0]}-${String(counters[category]++).padStart(
      4,
      "0"
    )}`;
    return { id, ...item } as QuizItem;
  });

  return dataWithIds;
};
