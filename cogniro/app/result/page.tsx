"use client";

import { useEffect, useState } from "react";

export default function ResultPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("result");
    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

  if (!data) return <p className="p-6">No result found</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Result</h1>

      <p className="text-lg mb-2">Score: {data.score}</p>
      <p className="mb-4">
        Correct: {data.correct} / {data.total}
      </p>

      <div className="mb-4">
        <h2 className="font-semibold">Weak Topics:</h2>
        {data.weakTopics.length === 0
          ? "None 🎉"
          : data.weakTopics.join(", ")}
      </div>

      <h2 className="font-semibold mb-2">Detailed Analysis</h2>

      {data.questions.map((q: any, index: number) => (
        <div
          key={q._id}
          className={`p-4 mb-4 border rounded ${
            q.isCorrect ? "border-green-500" : "border-red-500"
          }`}
        >
          <p className="font-medium">
            {index + 1}. {q.question}
          </p>

          <p>
            Your Answer:{" "}
            <span className="font-semibold">{q.userAnswer || "Not Attempted"}</span>
          </p>

          <p>
            Correct Answer:{" "}
            <span className="font-semibold">{q.correctAnswer}</span>
          </p>

          <p className="text-sm text-gray-600">
            Explanation: {q.explanation}
          </p>
        </div>
      ))}
    </div>
  );
}
