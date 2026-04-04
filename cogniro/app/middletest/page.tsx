"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function TestSetup() {
  const router = useRouter();

  const [type, setType] = useState("sql");
  const [difficulty, setDifficulty] = useState("easy");
  const [numQuestions, setNumQuestions] = useState(5);
  const [topics, setTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const availableTopics = [
    "SQL Joins",
    "SQL Aggregates",
    "Arrays",
    "Strings",
    "Data Structures",
    "Logic",
    "Problem Solving",
  ];

  const toggleTopic = (topic: string) => {
    setTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const generateTest = async () => {
    if (topics.length === 0) {
      alert("Please select at least one topic");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/test/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "507f1f77bcf86cd799439011",
          type,
          difficulty,
          totalQuestions: numQuestions,
          topics,
        }),
      });

      const data = await res.json();

      if (res.ok || res.status === 201) {
        localStorage.setItem("currentTestId", data.testId);
        localStorage.setItem("currentQuestions", JSON.stringify(data.questions || []));
        localStorage.removeItem("currentAnswers");
        router.push("/test");
      } else {
        alert(data.message || "Error generating test");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10 relative overflow-hidden bg-black">

      {/* 🔥 BACKGROUND EFFECT */}
      <div className="absolute inset-0">
        <div className="absolute w-[500px] h-[500px] bg-blue-500/30 blur-[120px] top-[-100px] left-[-100px] rounded-full" />
        <div className="absolute w-[400px] h-[400px] bg-purple-500/30 blur-[120px] bottom-[-100px] right-[-100px] rounded-full" />
      </div>

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-3xl p-10 rounded-3xl bg-zinc-900/80 backdrop-blur-2xl border border-zinc-700 shadow-[0_0_60px_rgba(0,0,0,0.8)] text-white"
      >
        <h1 className="text-4xl font-extrabold mb-8 text-center">
          🚀 Customize Your Test
        </h1>

        {/* Type + Difficulty */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block mb-2 text-sm text-gray-300">Test Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-3 rounded-xl bg-black border border-zinc-700 focus:ring-2 focus:ring-blue-500"
            >
              <option value="sql">SQL</option>
              <option value="aptitude">Aptitude</option>
              <option value="logic">Logic</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-300">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-3 rounded-xl bg-black border border-zinc-700 focus:ring-2 focus:ring-purple-500"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Questions */}
        <div className="mb-6">
          <label className="block mb-2 text-sm text-gray-300">Number of Questions</label>
          <input
            type="number"
            value={numQuestions}
            onChange={(e) => setNumQuestions(parseInt(e.target.value))}
            min={1}
            max={50}
            className="w-32 p-3 rounded-xl bg-black border border-zinc-700 focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Topics */}
        <div className="mb-8">
          <p className="text-sm text-gray-300 mb-3">Select Topics</p>
          <div className="flex flex-wrap gap-3">
            {availableTopics.map((topic) => (
              <motion.button
                key={topic}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleTopic(topic)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  topics.includes(topic)
                    ? "bg-blue-500 text-white border-blue-500 shadow-lg"
                    : "bg-zinc-800 text-gray-300 border-zinc-600 hover:bg-zinc-700"
                }`}
              >
                {topic}
              </motion.button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generateTest}
          disabled={loading}
          className="w-full py-4 rounded-xl text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl"
        >
          {loading ? "Generating Test..." : "🚀 Start Test"}
        </motion.button>
      </motion.div>
    </div>
  );
}
