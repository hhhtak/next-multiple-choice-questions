"use client";
import { ResultButtons } from "@/components/result/ResultButtons";
import { ScoreCard } from "@/components/result/ScoreCard";
import { WrongQuestionsList } from "@/components/result/WrongQuestionsList";
import { MESSAGES } from "@/constants";
import {
  correctCountAtom,
  currentIndexAtom,
  questionsForRetryAtom,
  wrongCountAtom,
  wrongQuestionsAtom,
} from "@/jotai";
import { removeDuplicatesById } from "@/utils/arrayUtils";
import { convertWrongQuestionToQuestion } from "@/utils/quizUtils";
import { useAtom, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";

const ResultScreen = () => {
  const [correctCount, setCorrectCount] = useAtom(correctCountAtom);
  const [wrongCount, setWrongCount] = useAtom(wrongCountAtom);
  const setCurrentIndex = useSetAtom(currentIndexAtom);
  const setQuestionsForRetry = useSetAtom(questionsForRetryAtom);
  const [wrongQuestions, setWrongQuestions] = useAtom(wrongQuestionsAtom);
  const router = useRouter();

  const handleBackToTop = () => {
    setCurrentIndex(0);
    setCorrectCount(0);
    setWrongCount(0);
    setWrongQuestions([]);
    setQuestionsForRetry(null);
    router.push("/");
  };

  const handleRetryWrongQuestions = () => {
    if (wrongQuestions.length === 0) return;

    const uniqueRetryQuestions = removeDuplicatesById(wrongQuestions);
    const questionsToRetry = uniqueRetryQuestions.map(convertWrongQuestionToQuestion);

    setQuestionsForRetry(questionsToRetry);
    setCurrentIndex(0);
    setCorrectCount(0);
    setWrongCount(0);
    setWrongQuestions([]);
    router.push("/questions");
  };

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-600">試験結果</h1>

      <ScoreCard correctCount={correctCount} wrongCount={wrongCount} />

      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-600">
        {MESSAGES.REVIEW_WRONG_QUESTIONS}
      </h2>

      <WrongQuestionsList wrongQuestions={wrongQuestions} />

      <ResultButtons
        wrongQuestions={wrongQuestions}
        onBackToTop={handleBackToTop}
        onRetryWrongQuestions={handleRetryWrongQuestions}
      />
    </div>
  );
};

export default ResultScreen;
