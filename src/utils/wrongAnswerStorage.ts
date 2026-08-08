import { Field, QuestionItem, StoredWrongAnswer } from "@/types";
import { getQuestionKey } from "@/utils/questionId";

const STORAGE_KEY = "quiz-wrong-answers";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function loadStore(): Record<string, StoredWrongAnswer> {
  if (!isBrowser()) return {};

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, StoredWrongAnswer>;
  } catch {
    return {};
  }
}

function saveStore(store: Record<string, StoredWrongAnswer>): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function toStoredWrongAnswer(
  question: QuestionItem,
  selectedAnswer: string,
  mistakeCount: number
): StoredWrongAnswer {
  return {
    id: getQuestionKey(question),
    field: question.field!,
    category: question.category,
    question: question.question,
    option1: question.option1,
    option2: question.option2,
    option3: question.option3,
    option4: question.option4,
    answer: question.answer,
    memo: question.memo,
    lastSelectedAnswer: selectedAnswer,
    mistakeCount,
    lastMistakenAt: new Date().toISOString(),
  };
}

export function recordWrongAnswer(question: QuestionItem, selectedAnswer: string): number {
  if (!question.field) return 1;

  const key = getQuestionKey(question);
  const store = loadStore();
  const existing = store[key];
  const mistakeCount = (existing?.mistakeCount ?? 0) + 1;

  store[key] = toStoredWrongAnswer(question, selectedAnswer, mistakeCount);
  saveStore(store);

  return mistakeCount;
}

export function getMistakeCount(question: QuestionItem): number {
  const store = loadStore();
  const key = getQuestionKey(question);
  return store[key]?.mistakeCount ?? 0;
}

export function getStoredWrongAnswer(questionId: string): StoredWrongAnswer | undefined {
  const store = loadStore();
  return store[questionId];
}

export function getWrongAnswersByField(field: Field): StoredWrongAnswer[] {
  const store = loadStore();
  return Object.values(store)
    .filter((item) => item.field === field)
    .sort((a, b) => b.lastMistakenAt.localeCompare(a.lastMistakenAt));
}

export function getWrongAnswerCountByField(field: Field): number {
  return getWrongAnswersByField(field).length;
}

export function storedToQuestionItem(stored: StoredWrongAnswer): QuestionItem {
  return {
    id: stored.id,
    field: stored.field,
    category: stored.category,
    question: stored.question,
    option1: stored.option1,
    option2: stored.option2,
    option3: stored.option3,
    option4: stored.option4,
    answer: stored.answer,
    memo: stored.memo,
  };
}

export function clearWrongAnswers(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEY);
}
