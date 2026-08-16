export type Field = "it" | "customer" | "product";

export interface QuestionItem {
  id: string;
  field?: Field;
  category: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  answer: string;
  memo: string;
  answerCount: number;
}

export interface WrongQuestionItem extends QuestionItem {
  selectedAnswer: string | null;
  mistakeCount?: number;
}

export interface StoredWrongAnswer {
  id: string;
  field: Field;
  category: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  answer: string;
  memo: string;
  lastSelectedAnswer: string;
  mistakeCount: number;
  lastMistakenAt: string;
}

export interface QuizSettings {
  selectedFields: Field[];
  isRandom: boolean;
  startIndex: number | null;
  useStartIndex: boolean;
  showAnswers: boolean;
}
