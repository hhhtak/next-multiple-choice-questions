const ANSWER_COUNT_STORAGE_KEY = "quizAnswerCounts";

function getAllAnswerCounts(): Record<string, number> {
  if (typeof window === "undefined") {
    return {};
  }
  try {
    const storedCounts = localStorage.getItem(ANSWER_COUNT_STORAGE_KEY);
    return storedCounts ? JSON.parse(storedCounts) : {};
  } catch (error) {
    console.error("Failed to parse answer counts from localStorage:", error);
    return {};
  }
}

function saveAllAnswerCounts(counts: Record<string, number>): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    localStorage.setItem(ANSWER_COUNT_STORAGE_KEY, JSON.stringify(counts));
  } catch (error) {
    console.error("Failed to save answer counts to localStorage:", error);
  }
}

export function getAnswerCount(questionId: string): number {
  const allCounts = getAllAnswerCounts();
  return allCounts[questionId] || 0;
}

export function incrementAnswerCount(questionId: string): void {
  const allCounts = getAllAnswerCounts();
  allCounts[questionId] = (allCounts[questionId] || 0) + 1;
  saveAllAnswerCounts(allCounts);
}
