"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { Trash2, Flame, TrendingUp, Target, BrainCircuit, User } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);

  // Data fetch karne ka function (Delete ke baad refresh karne ke liye kaam aayega)
  const fetchDashboardData = useCallback(() => {
    fetch("/api/performance/get")
      .then((res) => res.json())
      .then((d) => {
        const formattedHistory = (d.history || []).map((t: any) => ({
          ...t,
          date: new Date(t.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
          }),
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

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // DELETE FUNCTION
  const handleDeleteTest = async (testId: string) => {
    if (!confirm("Bhai, pakka delete karna hai ye test?")) return;

    try {
      const res = await fetch(`/api/test/delete?testId=${testId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchDashboardData(); // List refresh karo
      } else {
        alert("Delete nahi ho paya!");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Dynamic Streak Color Logic
  const getStreakStyles = (streak: number) => {
    if (streak >= 7) return "from-orange-500 to-red-600 shadow-orange-500/50";
    if (streak > 0) return "from-yellow-400 to-orange-500 shadow-yellow-500/50";
    return "from-zinc-400 to-zinc-500 shadow-zinc-500/50";
  };

  if (!data)
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium">Loading your progress...</p>
        </div>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100">
      
      {/* LEFT SIDEBAR */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-72 bg-white dark:bg-zinc-900/50 backdrop-blur-xl border-r border-zinc-200 dark:border-zinc-800 p-6 flex flex-col gap-6"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-blue-600 rounded-lg">
            <BrainCircuit className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-bold tracking-tighter italic">COGNiro</h2>
        </div>

        <div className="flex flex-col gap-4">
          {/* STREAK CARD */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`p-5 rounded-2xl bg-gradient-to-br ${getStreakStyles(data.streak)} text-white shadow-lg transition-all`}
          >
            <div className="flex justify-between items-start">
              <p className="text-white/80 text-sm font-medium">Daily Streak</p>
              <Flame size={20} className={data.streak > 0 ? "animate-pulse" : ""} />
            </div>
            <p className="text-3xl font-black mt-1">{data.streak} Days</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center gap-2 text-blue-500 mb-1">
                <Target size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Avg Score</span>
              </div>
              <p className="text-2xl font-bold">{data.avgScore}%</p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center gap-2 text-green-500 mb-1">
                <TrendingUp size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Improvement</span>
              </div>
              <p className="text-2xl font-bold">+{data.improvementRate}%</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
            <p className="text-red-500 text-xs font-bold uppercase mb-2">Focus Areas</p>
            <div className="flex flex-wrap gap-2">
              {data.weakTopics.length > 0 ? (
                data.weakTopics.map((topic: string) => (
                  <span key={topic} className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] rounded-md font-bold">
                    {topic}
                  </span>
                ))
              ) : (
                <p className="text-zinc-500 text-xs italic">All topics look solid! 🎉</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight">Performance</h1>
            <p className="text-zinc-500 mt-1">Track your growth and test history.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition">
              <User size={20} />
            </button>
            <button 
              onClick={() => router.push("/middletest")}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-lg shadow-blue-600/20"
            >
              Start New Test
            </button>
          </div>
        </header>

        {/* CHART SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl mb-8"
        >
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-500" />
            Growth Analytics
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.history}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.2} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#3b82f6" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* RECENT TESTS TABLE */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
            <h2 className="text-lg font-bold">Recent Test History</h2>
          </div>
          
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            <AnimatePresence>
              {data.history.length === 0 ? (
                <div className="p-10 text-center text-zinc-500 italic">Abhi tak koi test nahi diya hai...</div>
              ) : (
                data.history.map((t: any) => (
                  <motion.div
                    key={t._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="group flex justify-between items-center p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${t.score >= 70 ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                        {t.score}%
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-zinc-100 uppercase text-sm">{t.type}</p>
                        <p className="text-xs text-zinc-500">{t.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => handleDeleteTest(t._id)}
                        className="p-2 opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                        title="Delete record"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}