"use client";

import {
  correctCountAtom,
  currentIndexAtom,
  incrementCorrectAtom,
  incrementWrongAtom,
  questionDataAtom,
  wrongCountAtom,
  wrongQuestionsAtom,
} from "@/jotai";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const Question = ({ question }: { question: string }) => {
  return <h2>{question}</h2>;
};

const AnswerOptions = ({
  shuffledOptions,
  selectedAnswer,
  handleAnswerChange,
  isChecked,
}: {
  shuffledOptions: string[];
  selectedAnswer: string | null;
  handleAnswerChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isChecked: boolean;
}) => {
  return (
    <div>
      {shuffledOptions.map((option, index) => (
        <div key={index}>
          <input
            type="radio"
            id={`option${index + 1}`}
            name="answer"
            value={option}
            checked={selectedAnswer === option}
            onChange={handleAnswerChange}
            disabled={isChecked}
          />
          <label htmlFor={`option${index + 1}`}>{option}</label>
        </div>
      ))}
    </div>
  );
};

const AnswerResult = ({
  isCorrect,
  correctAnswer,
  memo,
  handleNextQuestion,
}: {
  isCorrect: boolean;
  correctAnswer: string;
  memo: string;
  handleNextQuestion: () => void;
}) => {
  return (
    <div className="mt-4">
      <p>
        {isCorrect ? "正解！" : "不正解！"}
        <br />
        正解: {correctAnswer}
        <br />
        メモ: {memo}
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
  );
};

const QuestionScreen = () => {
  const [questionData] = useAtom(questionDataAtom);
  const [currentIndex, setCurrentIndex] = useAtom(currentIndexAtom);
  const [correctCount] = useAtom(correctCountAtom);
  const [wrongCount] = useAtom(wrongCountAtom);
  const [, incrementCorrect] = useAtom(incrementCorrectAtom);
  const [, incrementWrong] = useAtom(incrementWrongAtom);
  const [, setWrongQuestions] = useAtom(wrongQuestionsAtom);
  const router = useRouter();

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const currentQuestion = questionData[currentIndex];
  const totalQuestions = questionData?.length || 0;

  // 選択肢をシャッフルし、メモ化
  const shuffledOptions = useMemo(() => {
    if (!currentQuestion) return [];
    const options = [
      currentQuestion.option1,
      currentQuestion.option2,
      currentQuestion.option3,
      currentQuestion.option4,
    ];
    return shuffleArray(options);
  }, [currentQuestion]);

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAnswer(event.target.value);
  };

  const handleCheckAnswer = () => {
    if (currentQuestion) {
      if (selectedAnswer === currentQuestion.answer) {
        incrementCorrect();
      } else {
        incrementWrong();
        // 不正解の場合、間違った問題を wrongQuestionsAtom に追加
        setWrongQuestions((prevWrongQuestions) => [
          ...prevWrongQuestions,
          {
            id: Date.now(), // 一意なIDを生成
            question: currentQuestion.question,
            selectedAnswer: selectedAnswer,
            correctAnswer: currentQuestion.answer,
          },
        ]);
      }
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
    router.push("/questions/result");
    return null;
  }

  return (
    <div>
      <div className="flex justify-between">
        <p>カテゴリ: {currentQuestion.category}</p>
        <p>
          {currentIndex + 1}/{totalQuestions}
        </p>
        <div className="flex">
          <p className="mr-4">正解数: {correctCount}</p>
          <p>不正解数: {wrongCount}</p>
        </div>
      </div>
      <Question question={currentQuestion.question} />
      <AnswerOptions
        shuffledOptions={shuffledOptions}
        selectedAnswer={selectedAnswer}
        handleAnswerChange={handleAnswerChange}
        isChecked={isChecked}
      />
      <div className="mt-4">
        <button
          onClick={handleCheckAnswer}
          disabled={isAnswered || selectedAnswer === null}
        >
          確認
        </button>
      </div>

      {isAnswered && (
        <AnswerResult
          isCorrect={selectedAnswer === currentQuestion.answer}
          correctAnswer={currentQuestion.answer}
          memo={currentQuestion.memo}
          handleNextQuestion={handleNextQuestion}
        />
      )}
    </div>
  );
};

export default QuestionScreen;
