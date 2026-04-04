"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";


export default function Dashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/performance/get")
      .then((res) => res.json())
      .then((d) => setData(d));
  }, []);

  if (!data) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="mb-4">
        <p>Average Score: {data.avgScore}</p>
        <p>Improvement: {data.improvementRate?.toFixed(2)}%</p>
      </div>

      <div className="mb-4">
        <h2 className="font-semibold">Weak Topics</h2>
        {data.weakTopics.length === 0
          ? "None 🎉"
          : data.weakTopics.join(", ")}
      </div>

      <h2 className="font-semibold mt-6 mb-2">Recent Scores</h2>

      {data.history.map((t: any) => (
        <div key={t._id} className="border p-2 mb-2 rounded">
          <p>Score: {t.score}</p>
          <p>Type: {t.type}</p>
        </div>

      ))}
      <LineChart width={400} height={300} data={data.history}>
  <XAxis dataKey="createdAt" />
  <YAxis />
  <Tooltip />
  <CartesianGrid strokeDasharray="3 3" />
  <Line type="monotone" dataKey="score" />
</LineChart>

    </div>
  );
}
