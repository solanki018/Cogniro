"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    alert(data.message);

    if (res.status === 201) {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Create Your Account
        </h1>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <input
            placeholder="Name"
            className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-gray-800 dark:text-white"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            placeholder="Email"
            type="email"
            className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-gray-800 dark:text-white"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-gray-800 dark:text-white"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            onClick={handleSubmit}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg"
          >
            Signup
          </button>
        </div>

        {/* Login redirect */}
        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-purple-600 hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
