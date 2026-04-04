"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Login() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-black p-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8"
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          Welcome Back 👋
        </h1>

        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
          Login to access your Cogniro account
        </p>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-zinc-800 dark:text-white"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-zinc-800 dark:text-white"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            onClick={handleLogin}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-all duration-200"
          >
            Login
          </button>
        </div>

        <p className="text-center text-gray-400 dark:text-gray-500 mt-6 text-sm">
          Don’t have an account?{" "}
          <span
            className="text-blue-500 hover:underline cursor-pointer"
            onClick={() => router.push("/signup")}
          >
            Signup
          </span>
        </p>
      </motion.div>
    </div>
  );
}
