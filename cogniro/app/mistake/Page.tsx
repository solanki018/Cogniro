"use client";

import { useEffect, useState } from "react";

export default function MistakesPage() {
  const [mistakes, setMistakes] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/mistake/get")
      .then((res) => res.json())
      .then((data) => setMistakes(data.mistakes));
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-6 text-zinc-900 dark:text-white">
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-black tracking-tight">
          Mistake Notebook 🧠
        </h1>
        <p className="text-zinc-500 mt-1">
          Learn from your mistakes and improve faster.
        </p>
      </div>

      {/* EMPTY STATE */}
      {mistakes.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-20 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <p className="text-lg font-semibold">No mistakes yet</p>
          <p className="text-zinc-500 text-sm">
            You're doing great! Keep practicing.
          </p>
        </div>
      )}

      {/* GRID LAYOUT */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mistakes.map((m, index) => (
          <div
            key={index}
            className="group p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
          >
            {/* QUESTION */}
            <p className="font-semibold text-lg mb-3 leading-snug">
              {m.question}
            </p>

            {/* ANSWERS */}
            <div className="space-y-2 text-sm">
              <p>
                ❌ Your Answer:{" "}
                <span className="text-red-500 font-semibold">
                  {m.selectedAnswer || "Not Attempted"}
                </span>
              </p>

              <p>
                ✅ Correct Answer:{" "}
                <span className="text-green-500 font-semibold">
                  {m.correctAnswer}
                </span>
              </p>
            </div>

            {/* EXPLANATION (if exists) */}
            {m.explanation && (
              <div className="mt-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30">
                <p className="text-xs font-bold text-blue-600 mb-1">
                  💡 Explanation
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  {m.explanation}
                </p>
              </div>
            )}

            {/* FOOTER */}
            <div className="mt-4 flex justify-between items-center">
              <span className="text-xs px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-medium">
                {m.topic || "General"}
              </span>

              <span className="text-[10px] text-zinc-400 opacity-0 group-hover:opacity-100 transition">
                Mistake #{index + 1}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}