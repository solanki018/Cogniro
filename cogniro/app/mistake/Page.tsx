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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mistake Notebook 🧠</h1>

      {mistakes.length === 0 && <p>No mistakes yet 🎉</p>}

      {mistakes.map((m, index) => (
        <div key={index} className="border p-4 mb-4 rounded">
          <p className="font-semibold">{m.question}</p>

          <p>
            ❌ Your Answer:{" "}
            <span className="text-red-500">{m.selectedAnswer}</span>
          </p>

          <p>
            ✅ Correct Answer:{" "}
            <span className="text-green-500">{m.correctAnswer}</span>
          </p>

          <p className="text-sm text-gray-600">
            Topic: {m.topic || "General"}
          </p>
        </div>
      ))}
    </div>
  );
}
