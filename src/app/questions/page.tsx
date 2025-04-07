"use client";

import {
  correctCountAtom,
  currentIndexAtom,
  incrementCorrectAtom,
  incrementWrongAtom,
  questionDataAtom,
  startQuestionIndexAtom,
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
  return (
    <div className="mb-4">
      <p className="text-xl font-semibold whitespace-pre-wrap">{question}</p>
    </div>
  );
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
    <div className="space-y-3">
      {shuffledOptions.map((option, index) => (
        <div
          key={index}
          className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-black hover:cursor-pointer"
        >
          <input
            type="radio"
            id={`option${index + 1}`}
            name="answer"
            value={option}
            checked={selectedAnswer === option}
            onChange={handleAnswerChange}
            disabled={isChecked}
            className="mr-3 text-blue-600"
          />
          <label
            htmlFor={`option${index + 1}`}
            className="text-lg w-full hover:cursor-pointer"
          >
            {option}
          </label>
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
  selectedAnswer,
}: {
  isCorrect: boolean;
  correctAnswer: string;
  memo: string;
  handleNextQuestion: () => void;
  selectedAnswer: string | null;
}) => {
  return (
    <div className="mt-4 p-4 border border-gray-300 rounded-lg shadow-md bg-gray-100">
      <p className="mb-2">
        {isCorrect ? (
          <span className="text-green-500 font-bold">正解！</span>
        ) : (
          <span className="text-red-500 font-bold">不正解！</span>
        )}
      </p>
      <p className="mb-2 text-black">
        <span className="font-bold">あなたの回答:</span> {selectedAnswer}
      </p>
      <p className="mb-2 text-black">
        <span className="font-bold">正解:</span> {correctAnswer}
      </p>
      <p className="mb-2 text-black">
        <span className="font-bold">メモ:</span> {memo}
      </p>
      <div className="mt-4">
        <button
          onClick={handleNextQuestion}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          次の問題へ
        </button>
      </div>
    </div>
  );
};

const QuestionScreen = () => {
  const [questionData] = useAtom(questionDataAtom);
  const [startQuestionIndex] = useAtom(startQuestionIndexAtom);
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

  const filteredQuestionData = useMemo(() => {
    return questionData.slice(startQuestionIndex);
  }, [questionData, startQuestionIndex]);

  const currentQuestion = filteredQuestionData[currentIndex];
  const totalQuestions = filteredQuestionData?.length || 0;

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
        setWrongQuestions((prevWrongQuestions) => [
          ...prevWrongQuestions,
          {
            id: Date.now(),
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

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <p className="text-lg">カテゴリ: {currentQuestion?.category}</p>
        <p className="text-lg">
          問題数: {currentIndex + 1}/{totalQuestions}
        </p>
        <div className="flex">
          <p className="mr-4">正解数: {correctCount}</p>
          <p>不正解数: {wrongCount}</p>
        </div>
      </div>
      <div className="mb-6">
        <Question question={currentQuestion?.question || ""} />
      </div>
      <div className="mb-6">
        <AnswerOptions
          shuffledOptions={shuffledOptions}
          selectedAnswer={selectedAnswer}
          handleAnswerChange={handleAnswerChange}
          isChecked={isChecked}
        />
      </div>
      <div className="mt-4">
        <button
          onClick={handleCheckAnswer}
          disabled={isAnswered || selectedAnswer === null}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          確認
        </button>
      </div>
      {isAnswered && (
        <AnswerResult
          isCorrect={selectedAnswer === currentQuestion?.answer}
          correctAnswer={currentQuestion?.answer || ""}
          memo={currentQuestion?.memo || ""}
          handleNextQuestion={handleNextQuestion}
          selectedAnswer={selectedAnswer}
        />
      )}
      {/* 結果画面へのボタンを追加 */}
      <div className="mt-6">
        <button
          onClick={() => router.push("/questions/result")}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          結果画面へ
        </button>
      </div>
    </div>
  );
};

export default QuestionScreen;
