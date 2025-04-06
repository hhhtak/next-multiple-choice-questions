"use client";

import {
  correctCountAtom,
  currentIndexAtom,
  incrementCorrectAtom,
  incrementWrongAtom,
  questionDataAtom,
  wrongCountAtom,
} from "@/jotai";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";

const QuestionScreen = () => {
  const [questionData] = useAtom(questionDataAtom);
  const [currentIndex, setCurrentIndex] = useAtom(currentIndexAtom);
  const [correctCount] = useAtom(correctCountAtom);
  const [wrongCount] = useAtom(wrongCountAtom);
  const [, incrementCorrect] = useAtom(incrementCorrectAtom);
  const [, incrementWrong] = useAtom(incrementWrongAtom);

  const currentQuestion = questionData[currentIndex];
  const router = useRouter();

  const handleAnswer = (answer: string) => {
    if (answer === currentQuestion.answer) {
      incrementCorrect();
    } else {
      incrementWrong();
    }
    setCurrentIndex((prev: number) => prev + 1);
  };

  if (!currentQuestion) {
    return <div>問題がありません。</div>;
  }

  return (
    <div>
      <h2>{currentQuestion.question}</h2>
      <div>
        <button onClick={() => handleAnswer(currentQuestion.option1)}>
          {currentQuestion.option1}
        </button>
        <button onClick={() => handleAnswer(currentQuestion.option2)}>
          {currentQuestion.option2}
        </button>
        <button onClick={() => handleAnswer(currentQuestion.option3)}>
          {currentQuestion.option3}
        </button>
        <button onClick={() => handleAnswer(currentQuestion.option4)}>
          {currentQuestion.option4}
        </button>
      </div>
      <div>正解数: {correctCount}</div>
      <div>不正解数: {wrongCount}</div>
      <button onClick={() => router.push("/questions/result")}>結果</button>
    </div>
  );
};

export default QuestionScreen;
