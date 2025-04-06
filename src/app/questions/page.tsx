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
import React, { useState } from "react";

const QuestionScreen = () => {
  const [quizData] = useAtom(questionDataAtom);
  const [currentIndex, setCurrentIndex] = useAtom(currentIndexAtom);
  const [correctCount] = useAtom(correctCountAtom);
  const [wrongCount] = useAtom(wrongCountAtom);
  const [, incrementCorrect] = useAtom(incrementCorrectAtom);
  const [, incrementWrong] = useAtom(incrementWrongAtom);

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const currentQuestion = quizData[currentIndex];
  // const router = useRouter();

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAnswer(event.target.value);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === currentQuestion.answer) {
      incrementCorrect();
    } else {
      incrementWrong();
    }
    setIsAnswered(true);
    setIsChecked(true);
  };

  const handleNextQuestion = () => {
    setIsAnswered(false);
    setIsChecked(false);
    setSelectedAnswer(null);
    setCurrentIndex((prev) => prev + 1);
  };

  if (!currentQuestion) {
    return <div>問題がありません。</div>;
  }

  return (
    <div>
      <h2>{currentQuestion.question}</h2>
      <div>
        <input
          type="radio"
          id="option1"
          name="answer"
          value={currentQuestion.option1}
          checked={selectedAnswer === currentQuestion.option1}
          onChange={handleAnswerChange}
          disabled={isChecked}
        />
        <label htmlFor="option1">{currentQuestion.option1}</label>
      </div>
      <div>
        <input
          type="radio"
          id="option2"
          name="answer"
          value={currentQuestion.option2}
          checked={selectedAnswer === currentQuestion.option2}
          onChange={handleAnswerChange}
          disabled={isChecked}
        />
        <label htmlFor="option2">{currentQuestion.option2}</label>
      </div>
      <div>
        <input
          type="radio"
          id="option3"
          name="answer"
          value={currentQuestion.option3}
          checked={selectedAnswer === currentQuestion.option3}
          onChange={handleAnswerChange}
          disabled={isChecked}
        />
        <label htmlFor="option3">{currentQuestion.option3}</label>
      </div>
      <div>
        <input
          type="radio"
          id="option4"
          name="answer"
          value={currentQuestion.option4}
          checked={selectedAnswer === currentQuestion.option4}
          onChange={handleAnswerChange}
          disabled={isChecked}
        />
        <label htmlFor="option4">{currentQuestion.option4}</label>
      </div>
      <div className="mt-4">
        <button
          onClick={handleCheckAnswer}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={isAnswered || selectedAnswer === null}
        >
          確認
        </button>
      </div>

      {isAnswered && (
        <div className="mt-4">
          <p>
            {selectedAnswer === currentQuestion.answer ? "正解！" : "不正解！"}
            <br />
            正解: {currentQuestion.answer}
            <br />
            メモ: {currentQuestion.memo}
          </p>
          <div className="mt-4">
            <button
              onClick={handleNextQuestion}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              次の問題へ
            </button>
          </div>
        </div>
      )}

      <div className="mt-4">
        <p>正解数: {correctCount}</p>
        <p>不正解数: {wrongCount}</p>
      </div>
    </div>
  );
};

export default QuestionScreen;
