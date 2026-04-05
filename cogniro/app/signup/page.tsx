"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Signup() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      setStatus({ type: "error", message: "Name, email aur password required hai." });
      return;
    }

    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setStatus({
        type: res.status === 201 ? "success" : "error",
        message: data.message || "Signup failed",
      });

      if (res.status === 201) {
        setTimeout(() => router.push("/login"), 800);
      }
    } catch {
      setStatus({ type: "error", message: "Network issue. Please try again." });
    } finally {
      setLoading(false);
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
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800 dark:text-white">
          Create Account
        </h1>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
          Join Cogniro and start improving your skills
        </p>

        {status && (
          <div
            className={`mb-4 rounded-lg border px-3 py-2 text-sm ${
              status.type === "success"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {status.message}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <input
            placeholder="Name"
            className="border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-zinc-800 dark:text-white"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            placeholder="Email"
            type="email"
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
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-70 text-white font-semibold py-3 rounded-lg transition-all duration-200"
          >
            {loading ? "Creating Account..." : "Signup"}
          </button>
        </div>

        <p className="mt-6 text-center text-gray-400 dark:text-gray-500 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </motion.div>
    </div>
  );
}
