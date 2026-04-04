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
    if (typeof window === "undefined") {
      return [];
    }
    const stored = localStorage.getItem("currentQuestions");
    return stored ? JSON.parse(stored) : [];
  });
  const [answers, setAnswers] = useState<UserAnswer[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }
    const stored = localStorage.getItem("currentAnswers");
    return stored ? JSON.parse(stored) : [];
  });
  const [testId] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }
    return localStorage.getItem("currentTestId") || "";
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME_SECONDS);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitTest = useCallback(async () => {
    if (!testId || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/test/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          testId,
          userId: "507f1f77bcf86cd799439011",
          answers,
        }),
      });

      const result = await res.json();
      const qRes = await fetch(`/api/question/get?testId=${testId}`);
      const qData = await qRes.json();

      localStorage.setItem(
        "result",
        JSON.stringify({
          ...result,
          questions: qData.questions || [],
        })
      );

      localStorage.removeItem("currentAnswers");
      localStorage.removeItem("currentQuestions");
      localStorage.removeItem("currentTestId");

      router.replace("/result");
    } catch (err) {
      console.error("Submit error", err);
      setIsSubmitting(false);
    }
  }, [answers, isSubmitting, router, testId]);

  useEffect(() => {
    if (questions.length === 0 || !testId) {
      router.replace("/middletest");
    }
  }, [questions.length, router, testId]);

  useEffect(() => {
    if (questions.length === 0 || isSubmitting) {
      return;
    }

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
          if (nextCount > MAX_TAB_SWITCHES) {
            submitTest();
          }
          return nextCount;
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
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

  if (!currentQuestion) {
    return <p className="p-6">Loading test...</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">AI Test</h1>
        <p className="font-semibold">⏱ {formatTime(timeLeft)}</p>
      </div>

      <p className="mb-2 text-sm text-gray-600">
        Tab switches used: {tabSwitches}/{MAX_TAB_SWITCHES}
      </p>
      <p className="mb-4 text-sm text-gray-600">
        Question {currentIndex + 1} of {questions.length}
      </p>

      <div className="mb-6 border p-4 rounded">
        <p className="font-semibold mb-3">
          {currentIndex + 1}. {currentQuestion.question}
        </p>

        {currentQuestion.options.map((opt, i) => (
          <label key={i} className="block mb-2 cursor-pointer">
            <input
              type="radio"
              name={currentQuestion._id}
              checked={selectedAnswer === opt}
              onChange={() => handleAnswer(currentQuestion._id, opt)}
            />
            <span className="ml-2">{opt}</span>
          </label>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="bg-gray-400 text-white px-4 py-2 rounded disabled:opacity-60"
        >
          Previous
        </button>

        {currentIndex < questions.length - 1 ? (
          <button
            onClick={() => setCurrentIndex((prev) => prev + 1)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        ) : (
          <button
            onClick={submitTest}
            disabled={isSubmitting}
            className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Submit Test"}
          </button>
        )}
      </div>
    </div>
  );
}
