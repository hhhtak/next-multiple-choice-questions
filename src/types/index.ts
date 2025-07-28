export type Field = "it" | "customer" | "product";

export interface QuestionItem {
  id: string;
  category: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  answer: string;
  memo: string;
}

export interface WrongQuestionItem extends QuestionItem {
  selectedAnswer: string | null;
}

export interface QuizSettings {
  selectedFields: Field[];
  isRandom: boolean;
  startIndex: number | null;
  useStartIndex: boolean;
  showAnswers: boolean;
}
