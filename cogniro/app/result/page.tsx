"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem("result");
    if (data) {
      setResult(JSON.parse(data));
    } else {
      router.replace("/"); // Agar result nahi hai toh home bhej do
    }
  }, [router]);

  const goToDashboard = () => {
    // Ab memory clear karo
    localStorage.removeItem("result");
    localStorage.removeItem("currentAnswers");
    localStorage.removeItem("currentQuestions");
    localStorage.removeItem("currentTestId");
    router.push("/dashboard"); // Ya jo bhi tera home route hai
  };

  if (!result) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading Results...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-zinc-900 border border-zinc-800 p-10 rounded-3xl shadow-2xl text-center"
      >
        <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Test Completed! 🚀
        </h1>
        
        <div className="my-8">
          <p className="text-gray-400 text-lg">Your Score</p>
          <div className="text-7xl font-black text-white mt-2">
            {result.score} <span className="text-2xl text-gray-500">/ {result.totalQuestions || result.questions?.length}</span>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-zinc-800/50 p-4 rounded-2xl border border-zinc-700">
            <p className="text-xs text-gray-400 uppercase">Status</p>
            <p className="font-bold text-green-400">Success</p>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-2xl border border-zinc-700">
            <p className="text-xs text-gray-400 uppercase">Test Type</p>
            <p className="font-bold text-blue-400 uppercase">{result.testType || "SQL"}</p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={goToDashboard}
          className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all shadow-lg"
        >
          Go to Dashboard
        </button>

        <button 
          onClick={() => window.print()}
          className="mt-4 text-zinc-500 hover:text-white text-sm transition"
        >
          Download Report (PDF)
        </button>
      </motion.div>
    </div>
  );
}