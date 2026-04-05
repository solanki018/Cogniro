"use client";

import { useEffect, useState } from "react";

type Question = {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  userAnswer?: string;
  explanation?: string;
};

export default function ResultPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
  const stored = localStorage.getItem("result");
  if (stored) {
    const result = JSON.parse(stored);
    setQuestions(result.questions || []);

    // 🔹 USE BACKEND SCORE
    const backendScore = result.score || 0;
    const correct = result.correctCount || 0;

    setScore(backendScore);
    setCorrectCount(correct);
  }
}, []);


  if (questions.length === 0) return <p className="p-6 text-center">Loading results...</p>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-blue-600 dark:text-blue-400">
            🎯 Your Test Results
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Score: <span className="font-semibold">{score}</span> / 100 | Correct: <span className="font-semibold">{correctCount}</span> / {questions.length}
          </p>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {questions.map((q, i) => (
            <div key={q._id} className="p-6 bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-700">
              <p className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">
                Q{i + 1}. {q.question}
              </p>

              {/* Options */}
              <div className="flex flex-col gap-2">
                {q.options.map((opt) => {
                  const isSelected = q.userAnswer === opt;
                  const isCorrect = q.correctAnswer === opt;

                  // 🔹 Logic:
                  // 1. Agar user ne correct select kiya → green
                  // 2. Agar user ne galat select kiya → red
                  // 3. Unselected options normal
                  let classes = "p-3 rounded-lg border flex justify-between items-center transition-all ";
                  if (isSelected && isCorrect) classes += "bg-green-600 text-white border-green-700";
                  else if (isSelected && !isCorrect) classes += "bg-red-500 text-white border-red-600";
                  else classes += "bg-gray-100 dark:bg-zinc-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-zinc-600";

                  return (
                    <div key={opt} className={classes}>
                      <span>{opt}</span>
                      {isSelected && isCorrect ? "✅" : ""}
                      {isSelected && !isCorrect ? "❌" : ""}
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              {q.explanation && (
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 italic">
                  Explanation: {q.explanation}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => (window.location.href = "/")}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            🔙 Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
