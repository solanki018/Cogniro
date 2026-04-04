"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/performance/get")
      .then((res) => res.json())
      .then((d) => {
        const formattedHistory = (d.history || []).map((t: any) => ({
          ...t,
          date: new Date(t.createdAt).toLocaleDateString(),
        }));

        setData({
          avgScore: d.avgScore || 0,
          improvementRate: d.improvementRate || 0,
          weakTopics: d.weakTopics || [],
          history: formattedHistory,
          streak: d.streak || 0,
        });
      })
      .catch(() =>
        setData({
          avgScore: 0,
          improvementRate: 0,
          weakTopics: [],
          history: [],
          streak: 0,
        })
      );
  }, []);

  if (!data)
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">Loading Dashboard...</p>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-black dark:to-zinc-900">

      {/* LEFT SIDEBAR */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 bg-gradient-to-b from-white/90 to-white/70 dark:from-zinc-900/80 dark:to-zinc-900/60 backdrop-blur-lg shadow-lg p-6 flex flex-col gap-6 rounded-tr-3xl rounded-br-3xl"
      >
        {/* LOGO */}
        <div className="flex items-center gap-2 mb-6">
          <img src="/logo.png" alt="Cogniro" className="w-10 h-10" />
          <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">
            Cogniro
          </h2>
        </div>

        {/* Quick Stats */}
        <div className="flex flex-col gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-4 rounded-xl bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 shadow-md"
          >
            <p className="text-gray-500 text-sm">Avg Score</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data.avgScore}%</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-4 rounded-xl bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 shadow-md"
          >
            <p className="text-gray-500 text-sm">Improvement</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{data.improvementRate}%</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-4 rounded-xl bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 shadow-md"
          >
            <p className="text-gray-500 text-sm">Streak 🔥</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{data.streak} days</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-4 rounded-xl bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 shadow-md"
          >
            <p className="text-gray-500 text-sm">Weak Topics</p>
            <p className="text-sm font-semibold text-red-600 dark:text-red-400">
              {data.weakTopics.length > 0 ? data.weakTopics.join(", ") : "None 🎉"}
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 flex flex-col gap-6">

        {/* NAVBAR */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white tracking-tight">
            📊 Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-yellow-400 text-black rounded-full font-semibold">
              🔥 Streak {data.streak}d
            </span>
            <button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white px-4 py-2 rounded-full shadow-lg">
              <span>Profile</span>
              <img
                src="/profile-icon.png"
                alt="profile"
                className="w-6 h-6 rounded-full"
              />
            </button>
          </div>
        </div>

        {/* PERFORMANCE GRAPH */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-800 p-6 rounded-3xl shadow-xl backdrop-blur-md"
        >
          <h2 className="font-semibold text-lg mb-4 text-gray-700 dark:text-gray-200">
            📈 Performance Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.history}>
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#f9fafb', borderRadius: 8 }} />
              <CartesianGrid strokeDasharray="3 3" />
              <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* RECENT TESTS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-800 p-6 rounded-3xl shadow-xl backdrop-blur-md flex flex-col gap-4"
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-200">
              📝 Recent Tests
            </h2>
            <button
              onClick={() => router.push("/middletest")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-md"
            >
              Start Test
            </button>
          </div>
          {data.history.length === 0 ? (
            <p className="text-gray-500">No tests yet</p>
          ) : (
            data.history.map((t: any) => (
              <motion.div
                whileHover={{ scale: 1.02 }}
                key={t._id}
                className="flex justify-between items-center p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
              >
                <p className="font-medium text-gray-800 dark:text-gray-200">{t.type}</p>
                <p className="font-bold text-blue-500">{t.score}%</p>
              </motion.div>
            ))
          )}
        </motion.div>

      </div>
    </div>
  );
}
