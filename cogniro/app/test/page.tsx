"use client";
import { useState, useEffect } from "react";

export default function TestPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<any[]>([]);
  const [testId, setTestId] = useState("");

  useEffect(() => {
    // 1. Check karo ki kya setup page ne questions bhej diye hain?
    const savedQuestions = localStorage.getItem("testQuestions");
    const savedTestId = localStorage.getItem("currentTestId");

    if (savedQuestions && savedTestId) {
      setQuestions(JSON.parse(savedQuestions));
      setTestId(savedTestId);
    } else {
      // Agar direct is page pe aaya hai bina setup ke, toh redirect kar do
      window.location.href = "/setup"; 
    }
  }, []);

  const handleAnswer = (qid: string, option: string) => {
    setAnswers((prev) => {
      const filtered = prev.filter((a) => a.questionId !== qid);
      return [...filtered, { questionId: qid, selectedAnswer: option }];
    });
  };

  // Submit function wahi rahega jo tune likha hai...
  const submitTest = async () => { /* ...tera purana logic... */ };

  if (questions.length === 0) return <div className="text-white">Loading questions from local storage...</div>;

  return (
    <div className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Test Started</h1>
      
      {questions.map((q, index) => (
        <div key={q._id || index} className="mb-6 border border-zinc-700 p-4 rounded-xl bg-zinc-900">
          <p className="font-semibold mb-3">{index + 1}. {q.question}</p>
          <div className="space-y-2">
            {q.options.map((opt: string, i: number) => (
              <label key={i} className="flex items-center gap-3 p-2 hover:bg-zinc-800 rounded cursor-pointer">
                <input
                  type="radio"
                  name={q._id || index}
                  onChange={() => handleAnswer(q._id, opt)}
                  className="accent-blue-500"
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      ))}

      <button onClick={submitTest} className="bg-green-600 px-6 py-3 rounded-xl font-bold">
        Submit Test
      </button>
    </div>
  );
}