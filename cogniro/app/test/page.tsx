"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const TOTAL_TIME_SECONDS = 5 * 60;
const MAX_TAB_SWITCHES = 1;

type Question = {
  _id: string;
  question: string;
  options: string[];
};

type UserAnswer = {
  questionId: string;
  selectedAnswer: string;
};

export default function TestPage() {
  const router = useRouter();
  const [questions] = useState<Question[]>(() => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("currentQuestions");
    return stored ? JSON.parse(stored) : [];
  });
  const [answers, setAnswers] = useState<UserAnswer[]>(() => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("currentAnswers");
    return stored ? JSON.parse(stored) : [];
  });
  const [testId] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("currentTestId") || "";
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME_SECONDS);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitTest = useCallback(async () => {
  if (!testId || isSubmitting) return;

  try {
    setIsSubmitting(true);
    
    const res = await fetch("/api/test/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ testId, userId: "507f1f77bcf86cd799439011", answers }),
    });

    const result = await res.json();
    
    // Full questions fetch karo (explanations ke liye)
    const qRes = await fetch(`/api/question/get?testId=${testId}`);
    const qData = await qRes.json();

    // Result store karo
    const finalResult = { 
      ...result, 
      questions: qData.questions || [],
      testType: questions[0]?.topic || "AI Test" 
    };
    
    localStorage.setItem("result", JSON.stringify(finalResult));

    // YAHAN SE REDIRECT (Wait 500ms for safety)
    setTimeout(() => {
      router.push("/result");
    }, 500);
    
  } catch (err) {
    console.error("Submit error", err);
    setIsSubmitting(false);
  }
}, [answers, isSubmitting, router, testId, questions]);

  useEffect(() => {
    if (questions.length === 0 || !testId) router.replace("/middletest");
  }, [questions.length, router, testId]);

  useEffect(() => {
    if (questions.length === 0 || isSubmitting) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [questions.length, isSubmitting, submitTest]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches((prev) => {
          const nextCount = prev + 1;
          if (nextCount > MAX_TAB_SWITCHES) submitTest();
          return nextCount;
        });
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [submitTest]);

  useEffect(() => {
    localStorage.setItem("currentAnswers", JSON.stringify(answers));
  }, [answers]);

  const currentQuestion = questions[currentIndex];
  const selectedAnswer = useMemo(
    () => answers.find((a) => a.questionId === currentQuestion?._id)?.selectedAnswer,
    [answers, currentQuestion?._id]
  );

  const handleAnswer = (qid: string, option: string) => {
    setAnswers((prev) => {
      const filtered = prev.filter((a) => a.questionId !== qid);
      return [...filtered, { questionId: qid, selectedAnswer: option }];
    });
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  if (!currentQuestion)
    return <p className="p-6 text-center text-gray-700 dark:text-gray-300">Loading test...</p>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100">
      {/* Navbar */}
      <nav className="w-full h-16 flex items-center justify-between px-6 bg-white dark:bg-zinc-800 shadow-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <img src="/cognipro-logo.png" alt="Cognipro Logo" className="h-10 w-auto" />
          <h1 className="font-bold text-xl text-blue-600 dark:text-blue-400">Cogniro AI Test</h1>
        </div>
        <div className="font-mono font-semibold text-lg text-gray-900 dark:text-gray-100">
          ⏱ {formatTime(timeLeft)}
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex gap-6 px-6 pt-6">
        {/* Left Panel - Question */}
        <div className="flex-1">
          <div className="mb-4 text-gray-700 dark:text-gray-300">
            Question {currentIndex + 1} of {questions.length} | Tab switches: {tabSwitches}/{MAX_TAB_SWITCHES}
          </div>

          <div className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-md border border-gray-200 dark:border-zinc-700">
            <p className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">
              {currentIndex + 1}. {currentQuestion.question}
            </p>

            {currentQuestion.options.map((opt, i) => (
              <label
                key={i}
                className={`block mb-3 cursor-pointer px-4 py-2 rounded-lg border transition-all
                  ${selectedAnswer === opt
                    ? "bg-blue-600 text-white border-blue-700"
                    : "bg-gray-100 dark:bg-zinc-700 border-gray-300 dark:border-zinc-600 hover:bg-gray-200 dark:hover:bg-zinc-600 text-gray-900 dark:text-gray-100"
                  }`}
              >
                <input
                  type="radio"
                  name={currentQuestion._id}
                  checked={selectedAnswer === opt}
                  onChange={() => handleAnswer(currentQuestion._id, opt)}
                  className="mr-2 accent-blue-500"
                />
                {opt}
              </label>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="flex-1 bg-gray-500 text-white py-2 rounded-lg disabled:opacity-50 hover:bg-gray-600 transition-colors"
            >
              Previous
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={submitTest}
                disabled={isSubmitting}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? "Submitting..." : "Submit Test"}
              </button>
            )}
          </div>
        </div>

        {/* Right Panel - Progress */}
        <div className="w-60 flex-shrink-0">
          <div className="p-4 bg-white dark:bg-zinc-800 rounded-xl shadow-md border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300">
            <h2 className="font-semibold mb-2">Progress</h2>
            <ul className="space-y-1">
              {questions.map((q, i) => (
                <li
                  key={q._id}
                  className={`${
                    answers.find((a) => a.questionId === q._id)
                      ? "text-green-600 dark:text-green-400 font-semibold"
                      : ""
                  }`}
                >
                  Q{i + 1}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
