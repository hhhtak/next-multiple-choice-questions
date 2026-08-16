const ASKED_COUNT_STORAGE_KEY = "quizAskedCounts";

function getAllAskedCounts(): Record<string, number> {
  if (typeof window === "undefined") {
    return {};
  }
  try {
    const storedCounts = localStorage.getItem(ASKED_COUNT_STORAGE_KEY);
    return storedCounts ? JSON.parse(storedCounts) : {};
  } catch (error) {
    console.error("Failed to parse asked counts from localStorage:", error);
    return {};
  }
}

function saveAllAskedCounts(counts: Record<string, number>): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    localStorage.setItem(ASKED_COUNT_STORAGE_KEY, JSON.stringify(counts));
  } catch (error) {
    console.error("Failed to save asked counts to localStorage:", error);
  }
}

export function getAskedCount(questionId: string): number {
  const allCounts = getAllAskedCounts();
  return allCounts[questionId] || 0;
}

export function incrementAskedCount(questionId: string): void {
  const allCounts = getAllAskedCounts();
  allCounts[questionId] = (allCounts[questionId] || 0) + 1;
  saveAllAskedCounts(allCounts);
}
