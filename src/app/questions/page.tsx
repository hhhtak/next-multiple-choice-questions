"use client";

import { AnswerOptions } from "@/components/quiz/AnswerOptions";
import { AnswerResult } from "@/components/quiz/AnswerResult";
import { QuestionDisplay } from "@/components/quiz/QuestionDisplay";
import { QuizButtons } from "@/components/quiz/QuizButtons";
import { MESSAGES } from "@/constants";
import {
  correctCountAtom,
  currentIndexAtom,
  incrementCorrectAtom,
  incrementWrongAtom,
  questionDataAtom,
  questionsForRetryAtom,
  showAnswersAtom,
  startQuestionIndexAtom,
  wrongCountAtom,
  wrongQuestionsAtom,
} from "@/jotai";
import { shuffleArray } from "@/utils/arrayUtils";
import { getQuestionOptions } from "@/utils/quizUtils";
import { useAtom, useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";

const QuestionScreen = () => {
  // --- フック呼び出し ---
  const [initialQuestionData] = useAtom(questionDataAtom);
  const [questionsForRetry, setQuestionsForRetry] = useAtom(questionsForRetryAtom);
  const [startQuestionIndex] = useAtom(startQuestionIndexAtom);
  const [currentIndex, setCurrentIndex] = useAtom(currentIndexAtom);
  const [correctCount] = useAtom(correctCountAtom);
  const [wrongCount] = useAtom(wrongCountAtom);
  const [, incrementCorrect] = useAtom(incrementCorrectAtom);
  const [, incrementWrong] = useAtom(incrementWrongAtom);
  const [, setWrongQuestions] = useAtom(wrongQuestionsAtom);
  const router = useRouter();

  const showAnswersPermanently = useAtomValue(showAnswersAtom);

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(showAnswersPermanently);
  const [isChecked, setIsChecked] = useState(showAnswersPermanently);

  // 現在アクティブな問題リストを決定
  const activeQuestionData = useMemo(() => {
    return questionsForRetry && questionsForRetry.length > 0
      ? questionsForRetry
      : initialQuestionData;
  }, [questionsForRetry, initialQuestionData]);

  const filteredQuestionData = useMemo(() => {
    if (!activeQuestionData || activeQuestionData.length === 0) {
      return [];
    }
    if (questionsForRetry && questionsForRetry.length > 0) {
      return activeQuestionData;
    }
    if (startQuestionIndex >= activeQuestionData.length) {
      return [];
    }
    return activeQuestionData.slice(startQuestionIndex);
  }, [activeQuestionData, startQuestionIndex, questionsForRetry]);

  const currentQuestion = filteredQuestionData[currentIndex];
  const totalQuestions = filteredQuestionData.length;

  const shuffledOptions = useMemo(() => {
    if (!currentQuestion) return [];
    const options = getQuestionOptions(currentQuestion);
    return shuffleArray(options);
  }, [currentQuestion]);

  // 結果画面へ遷移する際に questionsForRetry をクリアする処理
  const goToResultScreen = useCallback(() => {
    if (questionsForRetry && questionsForRetry.length > 0) {
      setQuestionsForRetry(null);
    }
    router.push("/questions/result");
  }, [questionsForRetry, setQuestionsForRetry, router]);

  useEffect(() => {
    if (totalQuestions > 0 && currentIndex >= totalQuestions) {
      goToResultScreen();
    }
  }, [currentIndex, totalQuestions, goToResultScreen]);

  // showAnswersPermanently が true の場合、selectedAnswer を正解に設定
  useEffect(() => {
    if (showAnswersPermanently && currentQuestion) {
      setSelectedAnswer(currentQuestion.answer);
      setIsAnswered(true);
      setIsChecked(true);
    }
  }, [showAnswersPermanently, currentQuestion]);

  // --- 条件分岐とJSX ---

  // 1. フィルター後の問題データがない場合
  if (totalQuestions === 0) {
    if (questionsForRetry && questionsForRetry.length === 0) {
      return (
        <div className="p-4 sm:p-6 text-center text-gray-600">
          <p className="mb-4 text-lg">{MESSAGES.NO_RETRY_QUESTIONS}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 rounded-lg transition duration-150 ease-in-out"
          >
            {MESSAGES.BACK_TO_TOP}
          </button>
        </div>
      );
    } else if (
      initialQuestionData.length > 0 &&
      (!questionsForRetry || questionsForRetry.length === 0)
    ) {
      return (
        <div className="p-4 sm:p-6 text-center text-gray-600">
          <p className="mb-4 text-lg">{MESSAGES.INVALID_START_INDEX}</p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-150 ease-in-out"
          >
            スタート画面に戻る
          </button>
        </div>
      );
    } else {
      return (
        <div className="p-4 sm:p-6 text-center text-gray-600">
          <p className="mb-4 text-lg">{MESSAGES.NO_QUESTIONS}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 rounded-lg transition duration-150 ease-in-out"
          >
            スタート画面に戻る
          </button>
        </div>
      );
    }
  }

  // 2. 現在の問題データがまだ取得できていない場合
  if (!currentQuestion && currentIndex < totalQuestions) {
    return <div className="p-4 sm:p-6 text-center text-gray-600">{MESSAGES.LOADING}</div>;
  }

  // 3. currentQuestion が確定したら、以下の処理を実行
  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isChecked && !showAnswersPermanently) {
      setSelectedAnswer(event.target.value);
    }
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswer || !currentQuestion || showAnswersPermanently) return;

    if (selectedAnswer === currentQuestion.answer) {
      incrementCorrect();
    } else {
      incrementWrong();
      setWrongQuestions((prevWrongQuestions) => [
        ...prevWrongQuestions,
        {
          ...currentQuestion,
          selectedAnswer: selectedAnswer,
        },
      ]);
    }
    setIsAnswered(true);
    setIsChecked(true);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 >= totalQuestions) {
      goToResultScreen();
      return;
    }

    setIsAnswered(showAnswersPermanently);
    setIsChecked(showAnswersPermanently);
    if (!showAnswersPermanently) {
      setSelectedAnswer(null);
    }

    setCurrentIndex((prev) => prev + 1);
  };

  // currentQuestion が存在する前提のJSXレンダリング
  return (
    <div>
      <QuestionDisplay
        question={currentQuestion}
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
        correctCount={correctCount}
        wrongCount={wrongCount}
      />

      <div className="mb-6">
        <AnswerOptions
          shuffledOptions={shuffledOptions}
          selectedAnswer={selectedAnswer}
          handleAnswerChange={handleAnswerChange}
          isChecked={isChecked || showAnswersPermanently}
          correctAnswer={currentQuestion?.answer ?? null}
        />
      </div>

      <QuizButtons
        isAnswered={isAnswered}
        showAnswersPermanently={showAnswersPermanently}
        selectedAnswer={selectedAnswer}
        onCheckAnswer={handleCheckAnswer}
        onInterrupt={goToResultScreen}
        isLastQuestion={currentIndex + 1 === totalQuestions}
        onSeeFinalResult={goToResultScreen}
      />

      {(isAnswered || showAnswersPermanently) && currentQuestion && (
        <AnswerResult
          isCorrect={
            showAnswersPermanently ? true : selectedAnswer === currentQuestion.answer
          }
          correctAnswer={currentQuestion.answer ?? "正解不明"}
          memo={currentQuestion.memo ?? ""}
          handleNextQuestion={handleNextQuestion}
          selectedAnswer={
            showAnswersPermanently ? currentQuestion.answer : selectedAnswer
          }
        />
      )}
    </div>
  );
};

export default QuestionScreen;
