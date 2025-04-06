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
  return <h2 className="text-2xl font-bold mb-4">{question}</h2>;
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
          className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-black hover:cursor-pointer" // ボーダーの色を調整
        >
          <input
            type="radio"
            id={`option${index + 1}`}
            name="answer"
            value={option}
            checked={selectedAnswer === option}
            onChange={handleAnswerChange}
            disabled={isChecked}
            className="mr-3 text-blue-600" // チェックボックスの色を調整
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
}: {
  isCorrect: boolean;
  correctAnswer: string;
  memo: string;
  handleNextQuestion: () => void;
}) => {
  return (
    <div className="mt-4 p-4 border border-gray-300 rounded-lg shadow-md bg-gray-100">
      {/* ボーダーの色を調整 */}
      <p className="mb-2">
        {isCorrect ? (
          <span className="text-green-500 font-bold">正解！</span>
        ) : (
          <span className="text-red-500 font-bold">不正解！</span>
        )}
      </p>
      <p className="mb-2">
        <span className="font-bold">正解:</span> {correctAnswer}
      </p>
      <p className="mb-2">
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
    <div className="p-4">
      {/* 全体の余白を調整 */}
      <div className="flex justify-between items-center mb-6">
        {/* ヘッダーの配置を調整 */}
        <p className="text-lg">カテゴリ: {currentQuestion.category}</p>
        {/* カテゴリの文字サイズを調整 */}
        <p className="text-lg">
          問題数: {currentIndex + 1}/{totalQuestions}
        </p>
        <div className="flex">
          <p className="mr-4">正解数: {correctCount}</p>
          <p>不正解数: {wrongCount}</p>
        </div>
      </div>
      <div className="mb-6">
        <Question question={currentQuestion.question} />
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
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" // ボタンの色とホバー時の色を変更
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
