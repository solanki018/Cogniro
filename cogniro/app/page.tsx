"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import "./global.css";
export default function Home() {
  const router = useRouter();

  const [showIntro, setShowIntro] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setTimeout(() => {
      setShowIntro(false);
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    }, 1800);
  }, []);

  useEffect(() => {
    if (user) router.push("/dashboard");
  }, [user]);

  // 🚀 INTRO SCREEN
  if (showIntro) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black text-white">
        <motion.h1
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1.2 }}
          transition={{ duration: 1 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-wide"
        >
          Cogniro
        </motion.h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-black dark:to-zinc-900 text-center px-6 py-10">

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-3xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
          Welcome to Cogniro
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          Practice smarter with AI-generated questions, track progress, and level up your skills.
        </p>
      </motion.div>

      {/* BUTTONS */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-12"
      >
        <button
          onClick={() => router.push("/login")}
          className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow-lg hover:scale-105 transition"
        >
          Login
        </button>

        <button
          onClick={() => router.push("/signup")}
          className="w-full sm:w-auto px-8 py-3 rounded-xl bg-zinc-800 text-white font-semibold shadow-lg hover:scale-105 transition"
        >
          Signup
        </button>
      </motion.div>

      {/* FEATURE CARDS */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
      >
        {[
          {
            title: "AI Questions",
            icon: "🤖",
            desc: "Dynamic questions powered by Gemini AI",
          },
          {
            title: "Analytics",
            icon: "📊",
            desc: "Track performance and growth visually",
          },
          {
            title: "Smart Learning",
            icon: "🧠",
            desc: "Learn from mistakes with insights",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-2xl backdrop-blur-lg bg-white/70 dark:bg-white/5 border border-white/20 shadow-xl"
          >
            <div className="text-4xl mb-3">{item.icon}</div>
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* FOOTER */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-16 text-sm text-gray-500"
      >
        © {new Date().getFullYear()} Cogniro • Built with ❤️
      </motion.p>
    </div>
  );
}
