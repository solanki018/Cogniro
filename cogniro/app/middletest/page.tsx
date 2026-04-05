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
  const [statusCard, setStatusCard] = useState<{ title: string; message: string } | null>(null);

  // Dynamic topics based on type
  const availableTopics = type === "sql"
    ? [
        "Introduction to Databases",
        "Database Concepts",
        "Database Models",
        "DBMS vs. RDBMS",
        "SQL Basics",
        "DDL",
        "DML",
        "Data Querying and Filtering",
        "Advanced Querying",
        "Data Integrity and Constraints",
        "Views and Indexes",
        "Transaction Management",
        "Stored Procedures and Functions",
        "Advanced Topics",
        "Optimization and Performance Tuning",
        "Data Security",
        "Practical Applications",
      ]
    : type === "aptitude"
    ? [
        "Numbers",
        "Work and Wages",
        "Pipes and Cistern",
        "Time, Speed, and Distance",
        "Trains, Boats, and Streams",
        "LCM and HCF",
        "Percentages",
        "Ratio, Proportion, and Partnership",
        "Mixture and Alligations",
        "Algebra",
        "Average",
        "Problem on Age",
        "Profit and Loss",
        "Simple Interest",
        "Compound Interest",
        "Mensuration 2D",
        "Mensuration 3D",
        "Trigonometry & Height and Distances",
        "Progressions",
        "Logarithms",
        "Permutation and Combination",
        "Probability",
        "Geometry",
        "Clocks",
        "Calendars",
        "Race",
        "Simplification and Approximation",
        "Data Interpretation",
      ]
    : [
        "Number Series",
        "Letter and Symbol Series",
        "Verbal Classification",
        "Analogies",
        "Logical Problems",
        "Course of Action",
        "Statement and Conclusion",
        "Theme Detection",
        "Blood Relations",
        "Directions",
        "Statement and Argument",
        "Logical Deduction",
        "Letter Series",
        "Coding Decoding",
        "Statement and Assumptions",
        "Logical Venn Diagram",
        "Verbal Analogies",
      ];

  const toggleTopic = (topic: string) => {
    setTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const toggleSelectAll = () => {
    if (topics.length === availableTopics.length) {
      setTopics([]); // Deselect all
    } else {
      setTopics([...availableTopics]); // Select all
    }
  };

  const generateTest = async () => {
    if (topics.length === 0) {
      setStatusCard({
        title: "Topic Required",
        message: "Test start karne se pehle kam se kam 1 topic select karo.",
      });
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    let userId = "";
    try {
      userId = JSON.parse(storedUser)?._id;
    } catch {
      router.push("/login");
      return;
    }

    if (!userId) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/test/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
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
        setStatusCard({
          title: "Test Create Failed",
          message: data.message || "Test generate nahi ho paya. Please try again.",
        });
      }
    } catch (err) {
      console.error(err);
      setStatusCard({
        title: "Something Went Wrong",
        message: "Network issue aaya. Thoda baad try karo.",
      });
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
        <h1 className="text-4xl font-extrabold mb-2 text-center">
          🚀 Customize Your Test
        </h1>
        <p className="text-sm text-gray-400 mb-6 text-center">
          Each question has 60 seconds. You cannot tap more than once on an option.
        </p>

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
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-gray-300">Select Topics</p>
            <button
              onClick={toggleSelectAll}
              className="text-xs px-3 py-1 rounded-full bg-zinc-700 hover:bg-zinc-600 transition"
            >
              {topics.length === availableTopics.length ? "Deselect All" : "Select All"}
            </button>
          </div>

          <div className="flex flex-wrap gap-3 max-h-64 overflow-y-auto">
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

      {statusCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl text-white">
            <h3 className="text-xl font-bold">{statusCard.title}</h3>
            <p className="mt-2 text-sm text-zinc-300">{statusCard.message}</p>
            <button
              onClick={() => setStatusCard(null)}
              className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
