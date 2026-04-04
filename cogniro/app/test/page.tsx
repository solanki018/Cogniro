"use client";

import { useState } from "react";

export default function TestPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [testId, setTestId] = useState("");

  // 🔥 Generate Test
  const startTest = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/test/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "507f1f77bcf86cd799439011",
          type: "sql",
          difficulty: "easy",
          totalQuestions: 5,
        }),
      });

      const data = await res.json();

      setQuestions(data.questions);
      setTestId(data.testId);
    } catch (err) {
      console.error("Error creating test", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Select Answer
  const handleAnswer = (qid: string, option: string) => {
    setAnswers((prev) => {
      const filtered = prev.filter((a) => a.questionId !== qid);
      return [...filtered, { questionId: qid, selectedAnswer: option }];
    });
  };

  // 🚀 Submit Test (FINAL VERSION 🔥)
  const submitTest = async () => {
    try {
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

      // 🔥 fetch full questions with answers + explanation
      const qRes = await fetch(`/api/question/get?testId=${testId}`);
      const qData = await qRes.json();

      const finalData = {
        ...result,
        questions: qData.questions,
      };

      // ✅ store result
      localStorage.setItem("result", JSON.stringify(finalData));

      // ✅ redirect
      window.location.href = "/result";
    } catch (err) {
      console.error("Submit error", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">AI Test</h1>

      {!questions.length && (
        <button
          onClick={startTest}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? "Generating..." : "Start Test"}
        </button>
      )}

      {questions.map((q, index) => (
        <div key={q._id} className="mb-6 border p-4 rounded">
          <p className="font-semibold">
            {index + 1}. {q.question}
          </p>

          {q.options.map((opt: string, i: number) => (
            <div key={i}>
              <label>
                <input
                  type="radio"
                  name={q._id}
                  onChange={() => handleAnswer(q._id, opt)}
                />
                {" "}{opt}
              </label>
            </div>
          ))}
        </div>
      ))}

      {questions.length > 0 && (
        <button
          onClick={submitTest}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Submit Test
        </button>
      )}
    </div>
  );
}
