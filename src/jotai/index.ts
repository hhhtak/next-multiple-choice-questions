import { atom } from "jotai";

export type QuestionItem = {
  id: number;
  category: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  answer: string;
  memo: string;
};

export const questionDataAtom = atom<QuestionItem[]>([]);
export const currentIndexAtom = atom(0);
export const correctCountAtom = atom(0);
export const wrongCountAtom = atom(0);
export const wrongQuestionsAtom = atom<
  { question: string; selectedAnswer: string | null; correctAnswer: string }[]
>([]);
export const incrementCorrectAtom = atom(null, (get, set) => {
  set(correctCountAtom, get(correctCountAtom) + 1);
});
export const incrementWrongAtom = atom(null, (get, set) => {
  set(wrongCountAtom, get(wrongCountAtom) + 1);
});
export const startQuestionIndexAtom = atom<number>(0);
