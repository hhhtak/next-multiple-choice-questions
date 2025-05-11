"use client";

import {
  correctCountAtom,
  currentIndexAtom,
  incrementCorrectAtom,
  incrementWrongAtom,
  questionDataAtom,
  showAnswersAtom,
  startQuestionIndexAtom,
  wrongCountAtom,
  wrongQuestionsAtom,
} from "@/jotai";
import { useAtom, useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react"; // useEffect をインポート

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// 問題文コンポーネント
const Question = ({ question }: { question: string }) => {
  return (
    // マージンと文字サイズを調整
    <div className="mb-4 sm:mb-6">
      <p className="text-lg sm:text-xl font-semibold whitespace-pre-wrap text-gray-600">
        {question}
      </p>
    </div>
  );
};

// 選択肢コンポーネント
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
    // 選択肢間のスペースを調整
    <div className="space-y-3 sm:space-y-4">
      {shuffledOptions.map((option, index) => (
        <div
          key={index}
          // パディング、ボーダー、ホバー効果、カーソルを調整
          // isChecked 時のスタイルを追加
          className={`flex items-center p-3 sm:p-4 border rounded-lg transition-colors duration-150 ease-in-out ${
            isChecked
              ? "bg-gray-100 border-gray-300 cursor-default" // チェック後はホバー効果なし
              : "border-gray-300 hover:bg-blue-50 hover:border-blue-300 cursor-pointer"
          } ${
            selectedAnswer === option && !isChecked
              ? "bg-blue-100 border-blue-400 ring-1 ring-blue-400" // 選択中のスタイル (チェック前)
              : ""
          } ${
            selectedAnswer === option && isChecked
              ? "bg-gray-200 border-gray-400" // 選択中のスタイル (チェック後)
              : ""
          }`}
        >
          <input
            type="radio"
            id={`option${index + 1}`}
            name="answer"
            value={option}
            checked={selectedAnswer === option}
            onChange={handleAnswerChange}
            disabled={isChecked}
            // ラジオボタンのサイズ、色、フォーカススタイルを調整
            className="mr-3 h-5 w-5 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <label
            htmlFor={`option${index + 1}`}
            // 文字サイズ、幅、カーソルを調整
            className={`text-base sm:text-lg w-full ${
              isChecked ? "cursor-default text-gray-600" : "cursor-pointer text-gray-600"
            }`}
          >
            {option}
          </label>
        </div>
      ))}
    </div>
  );
};

// 回答結果コンポーネント
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
    // マージン、パディング、ボーダー、背景色を調整
    <div className="mt-6 p-4 border rounded-lg shadow-sm bg-white border-gray-300">
      {/* 正解/不正解表示 */}
      <p className="mb-3 text-lg sm:text-xl font-bold">
        {isCorrect ? (
          <span className="text-green-600">✅ 正解！</span>
        ) : (
          <span className="text-red-600">❌ 不正解！</span>
        )}
      </p>
      {/* あなたの回答 */}
      {!isCorrect && ( // 不正解の場合のみ表示
        <p className="mb-2 text-sm sm:text-base text-gray-600">
          <span className="font-semibold">あなたの回答:</span>{" "}
          {selectedAnswer || "未選択"}
        </p>
      )}
      {/* 正解 */}
      <p className="mb-2 text-sm sm:text-base text-gray-600">
        <span className="font-semibold">正解:</span> {correctAnswer}
      </p>
      {/* メモ */}
      {memo && ( // メモがある場合のみ表示
        <p className="mb-4 text-sm sm:text-base text-gray-600 whitespace-pre-wrap bg-gray-50 p-3 rounded border border-gray-200">
          <span className="font-semibold block mb-1">解説:</span> {memo}
        </p>
      )}
      {/* 次の問題へボタン */}
      <div className="mt-4">
        <button
          onClick={handleNextQuestion}
          // ボタンのスタイル調整 (幅、パディング、文字サイズ、フォーカス)
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 font-bold py-2.5 px-5 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-base sm:text-lg text-white"
        >
          次の問題へ
        </button>
      </div>
    </div>
  );
};

// メインの画面コンポーネント
const QuestionScreen = () => {
  // --- フック呼び出し (すべてトップレベルに記述) ---
  const [questionData] = useAtom(questionDataAtom);
  const [startQuestionIndex] = useAtom(startQuestionIndexAtom);
  const [currentIndex, setCurrentIndex] = useAtom(currentIndexAtom);
  const [correctCount] = useAtom(correctCountAtom);
  const [wrongCount] = useAtom(wrongCountAtom);
  const [, incrementCorrect] = useAtom(incrementCorrectAtom);
  const [, incrementWrong] = useAtom(incrementWrongAtom);
  const [, setWrongQuestions] = useAtom(wrongQuestionsAtom);
  const router = useRouter();

  // const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  // const [isAnswered, setIsAnswered] = useState(false);
  // const [isChecked, setIsChecked] = useState(false);
  const showAnswersPermanently = useAtomValue(showAnswersAtom); // 回答常時表示フラグを取得

  // selectedAnswer, isAnswered, isChecked の初期値を showAnswersPermanently に基づいて設定
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null); // 初期値はnullのまま
  const [isAnswered, setIsAnswered] = useState(showAnswersPermanently);
  const [isChecked, setIsChecked] = useState(showAnswersPermanently);

  // --- useMemo もトップレベルに移動 ---
  const filteredQuestionData = useMemo(() => {
    // questionData が空の場合や startQuestionIndex が不正な場合は空配列
    if (
      !questionData ||
      questionData.length === 0 ||
      startQuestionIndex >= questionData.length
    ) {
      return [];
    }
    return questionData.slice(startQuestionIndex);
  }, [questionData, startQuestionIndex]);

  // currentQuestion は filteredQuestionData と currentIndex に依存
  // filteredQuestionData が空、または currentIndex が範囲外なら undefined
  const currentQuestion = filteredQuestionData[currentIndex];
  const totalQuestions = filteredQuestionData.length;

  // shuffledOptions の useMemo もトップレベルに移動
  const shuffledOptions = useMemo(() => {
    // currentQuestion が存在しない場合は空配列を返す
    if (!currentQuestion) return [];
    const options = [
      currentQuestion.option1,
      currentQuestion.option2,
      currentQuestion.option3,
      currentQuestion.option4,
    ].filter(Boolean); // filter(Boolean) で null や undefined を除去
    // currentQuestion が変わるたびにシャッフルされる
    return shuffleArray(options);
  }, [currentQuestion]); // currentQuestion オブジェクト自体が変わった時に再計算

  // --- useEffect もトップレベルに移動 ---
  useEffect(() => {
    // 条件を useEffect の中でチェック
    // filteredQuestionData が確定し、かつ全ての問題が終わった場合に結果画面へ遷移
    if (totalQuestions > 0 && currentIndex >= totalQuestions) {
      router.push("/questions/result");
    }
    // 依存配列: 条件判定に必要な値を含める
  }, [currentIndex, totalQuestions, router]); // filteredQuestionData は totalQuestions に含まれる

  // showAnswersPermanently が true の場合、selectedAnswer を正解に設定し、採点処理はスキップ
  useEffect(() => {
    if (showAnswersPermanently && currentQuestion) {
      setSelectedAnswer(currentQuestion.answer);
      setIsAnswered(true); // 回答済みとして扱う
      setIsChecked(true); // チェック済み（操作不可）として扱う
    }
  }, [showAnswersPermanently, currentQuestion]);

  // --- ここから条件分岐とJSX ---

  // 1. フィルター後の問題データがない場合 (開始位置が不正 or 元データがない)
  if (totalQuestions === 0) {
    // 元の questionData があるかどうかでメッセージを分岐
    if (questionData.length > 0) {
      // 開始位置が不正な場合
      return (
        <div className="p-4 sm:p-6 text-center text-gray-600">
          <p className="mb-4 text-lg">指定された開始位置の問題が見つかりません。</p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 hover:bg-blue-700 text-gray-600 font-bold py-2 px-4 rounded-lg transition duration-150 ease-in-out"
          >
            スタート画面に戻る
          </button>
        </div>
      );
    } else {
      // そもそも問題データがない場合 (初期状態など)
      return (
        <div className="p-4 sm:p-6 text-center text-gray-600">
          <p className="mb-4 text-lg">
            問題データがありません。スタート画面で分野を選択してください。
          </p>
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

  // 2. 現在の問題データ (currentQuestion) がまだ取得できていない場合 (読み込み中など)
  //    かつ、まだ全ての問題が終わっていない場合 (useEffectでの遷移前)
  if (!currentQuestion && currentIndex < totalQuestions) {
    return (
      <div className="p-4 sm:p-6 text-center text-gray-600">
        問題を読み込んでいます...
      </div>
    );
  }

  // 3. currentQuestion が確定したら、以下の処理を実行
  //    (useEffect で結果画面へ遷移する場合、この部分はレンダリングされない)

  // currentQuestion が null/undefined の可能性は上記の条件分岐でほぼ排除されているが、
  // 安全のため Optional Chaining (?.) や Nullish Coalescing (??) を使う

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isChecked && !showAnswersPermanently) {
      // 常時表示モードでは選択不可
      setSelectedAnswer(event.target.value);
    }
  };

  const handleCheckAnswer = () => {
    // selectedAnswer, currentQuestion が存在し、かつ常時表示モードでない場合のみ処理
    if (!selectedAnswer || !currentQuestion || showAnswersPermanently) return;

    if (selectedAnswer === currentQuestion.answer) {
      incrementCorrect();
    } else {
      incrementWrong();
      // 200行目付近のエラー対策: currentQuestion のプロパティに ?? でデフォルト値を与える
      setWrongQuestions((prevWrongQuestions) => [
        ...prevWrongQuestions,
        {
          // jotai/index.ts の WrongQuestion 型に合わせて調整
          id: currentQuestion.id ?? String(Date.now()), // id がなければ文字列のタイムスタンプ
          question: currentQuestion.question ?? "問題文不明",
          selectedAnswer: selectedAnswer, // selectedAnswer は null でないことが保証されている
          correctAnswer: currentQuestion.answer ?? "正解不明",
          category: currentQuestion.category ?? "カテゴリ不明",
          memo: currentQuestion.memo ?? "",
        },
      ]);
    }
    setIsAnswered(true);
    setIsChecked(true);
  };

  const handleNextQuestion = () => {
    // 次の問題がない場合は結果画面へ (useEffect でも遷移するが、ボタン押下時にもチェック)
    if (currentIndex + 1 >= totalQuestions) {
      router.push("/questions/result");
      return;
    }

    // setIsAnswered(false);
    // setIsChecked(false);
    // setSelectedAnswer(null);
    // // 216行目付近のエラー対策: setCurrentIndex 自体は問題ないはず
    // 常時表示モードの場合は、次の問題でも回答済み・チェック済み状態を維持
    setIsAnswered(showAnswersPermanently);
    setIsChecked(showAnswersPermanently);
    if (showAnswersPermanently) {
      // selectedAnswer は次の問題の useEffect で設定されるのでここでは null にしない
      // もし即座に次の問題の正解をセットしたい場合は、ここでも currentQuestion の次の問題の answer を使う必要があるが、
      // useEffect に任せる方がシンプル
    } else {
      setSelectedAnswer(null);
    }

    setCurrentIndex((prev) => prev + 1);
  };

  // currentQuestion が存在する前提のJSXレンダリング
  return (
    <div>
      {/* ヘッダー情報 */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-2 sm:space-y-0 border-b pb-4 border-gray-200">
        <p className="text-sm sm:text-base text-gray-600">
          カテゴリ:{" "}
          <span className="font-medium text-gray-600">
            {currentQuestion?.category ?? "N/A"} {/* ?. と ?? を併用 */}
          </span>
        </p>
        <p className="text-sm sm:text-base text-gray-600">
          問題:{" "}
          <span className="font-medium text-gray-600">
            {currentIndex + 1} / {totalQuestions}
          </span>
        </p>
        <div className="flex space-x-4">
          <p className="text-sm sm:text-base text-green-600">
            正解: <span className="font-medium">{correctCount}</span>
          </p>
          <p className="text-sm sm:text-base text-red-600">
            不正解: <span className="font-medium">{wrongCount}</span>
          </p>
        </div>
      </div>

      {/* 問題文 */}
      <div className="mb-6">
        <Question question={currentQuestion?.question ?? "問題読込中..."} />
      </div>

      {/* 選択肢 */}
      <div className="mb-6">
        <AnswerOptions
          shuffledOptions={shuffledOptions} // useMemo で計算済み
          selectedAnswer={selectedAnswer}
          handleAnswerChange={handleAnswerChange}
          isChecked={isChecked || showAnswersPermanently} // 常時表示なら常にチェック済み扱い
        />
      </div>

      {/* 確認ボタン */}
      {!isAnswered &&
        !showAnswersPermanently && ( // 常時表示モードでは表示しない
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
            <button
              onClick={handleCheckAnswer}
              disabled={selectedAnswer === null}
              className={`w-full sm:w-auto bg-blue-600 text-white font-bold py-2.5 px-5 rounded-lg transition duration-150 ease-in-out ${
                selectedAnswer === null
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              } text-base sm:text-lg`}
            >
              回答を確認
            </button>
            <button
              onClick={() => router.push("/questions/result")}
              className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2.5 px-5 rounded-lg transition duration-150 ease-in-out text-base sm:text-lg"
            >
              中断して結果を見る
            </button>
          </div>
        )}

      {/* 回答結果 */}
      {/* isAnswered が true で、かつ currentQuestion が存在する場合のみ表示 */}
      {(isAnswered || showAnswersPermanently) &&
        currentQuestion && ( // 常時表示モードでも表示
          <AnswerResult
            isCorrect={
              showAnswersPermanently ? true : selectedAnswer === currentQuestion.answer
            } // 常時表示なら常に正解
            correctAnswer={currentQuestion.answer ?? "正解不明"}
            memo={currentQuestion.memo ?? ""}
            handleNextQuestion={handleNextQuestion}
            selectedAnswer={
              showAnswersPermanently ? currentQuestion.answer : selectedAnswer
            } // 常時表示なら正解を表示
          />
        )}

      {/* 最終結果を見るボタン (最後の問題で回答後に表示) */}
      {/* 常時表示モードでも、最後の問題で「次の問題へ」の代わりに表示されるようにする */}
      {(isAnswered || showAnswersPermanently) && currentIndex + 1 === totalQuestions && (
        <div className="mt-6">
          <button
            onClick={() => router.push("/questions/result")}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-5 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-base sm:text-lg"
          >
            最終結果を見る
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionScreen;
