import { QuestionItem, WrongQuestionItem } from "@/types";
import { atom } from "jotai";

export const questionDataAtom = atom<QuestionItem[]>([]);
export const currentIndexAtom = atom(0);
export const correctCountAtom = atom(0);
export const wrongCountAtom = atom(0);
export const wrongQuestionsAtom = atom<WrongQuestionItem[]>([]);
export const incrementCorrectAtom = atom(null, (get, set) => {
  set(correctCountAtom, get(correctCountAtom) + 1);
});
export const incrementWrongAtom = atom(null, (get, set) => {
  set(wrongCountAtom, get(wrongCountAtom) + 1);
});
export const startQuestionIndexAtom = atom<number>(0);

// スタート画面で設定する「回答を常に表示する」の状態
export const showAnswersAtom = atom(false);

// 間違った問題を再挑戦するための問題リスト
export const questionsForRetryAtom = atom<QuestionItem[] | null>(null);
