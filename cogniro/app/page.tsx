"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-100 dark:bg-black text-center p-6">
      
      {/* 🔥 Title */}
      <h1 className="text-4xl font-bold mb-4">
        🚀 Cogniro AI Test Platform
      </h1>

      {/* Subtitle */}
      <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-xl">
        Practice Aptitude, SQL & Role-based questions with AI.  
        Track your performance, improve weak areas, and crack interviews.
      </p>

      {/* 🔥 Buttons */}
      <div className="flex gap-4 flex-wrap justify-center">
        
        <button
          onClick={() => router.push("/test")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-lg"
        >
          Start Test
        </button>

        <button
          onClick={() => router.push("/dashboard")}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-lg"
        >
          Dashboard
        </button>

        <button
          onClick={() => router.push("/mistakes")}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg text-lg"
        >
          Mistake Notebook
        </button>
      </div>

      {/* 🔥 Features */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
        
        <div className="p-4 bg-white dark:bg-zinc-900 rounded shadow">
          <h3 className="font-semibold text-lg">🤖 AI Questions</h3>
          <p className="text-sm text-gray-500">
            Dynamic questions generated using Gemini API
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-zinc-900 rounded shadow">
          <h3 className="font-semibold text-lg">📊 Analytics</h3>
          <p className="text-sm text-gray-500">
            Track your performance and improvement
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-zinc-900 rounded shadow">
          <h3 className="font-semibold text-lg">🧠 Smart Learning</h3>
          <p className="text-sm text-gray-500">
            Learn from mistakes with revision system
          </p>
        </div>

      </div>
    </div>
  );
}
