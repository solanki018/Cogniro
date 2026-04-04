import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Test from "@/models/Test";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // 🔥 temporary userId (baad me auth se lena)
    const userId = "507f1f77bcf86cd799439011";

    const tests = await Test.find({ userId }).sort({ createdAt: 1 });

    // ✅ SAFE DEFAULTS
    if (!tests || tests.length === 0) {
      return NextResponse.json({
        avgScore: 0,
        improvementRate: 0,
        weakTopics: [],
        history: [],
      });
    }

    // 🔥 Average Score
    const total = tests.reduce((sum, t) => sum + (t.score || 0), 0);
    const avgScore = total / tests.length;

    // 🔥 Improvement (last - first)
    const firstScore = tests[0]?.score || 0;
    const lastScore = tests[tests.length - 1]?.score || 0;
    const improvementRate =
      firstScore === 0
        ? 0
        : ((lastScore - firstScore) / firstScore) * 100;

    // 🔥 Weak Topics (simple logic)
    const weakTopicsMap: any = {};

    tests.forEach((t) => {
      if (t.score < 50) {
        weakTopicsMap[t.type] = (weakTopicsMap[t.type] || 0) + 1;
      }
    });

    const weakTopics = Object.keys(weakTopicsMap);

    // 🔥 History
    const history = tests.map((t) => ({
      _id: t._id,
      score: t.score || 0,
      type: t.type || "unknown",
      createdAt: t.createdAt,
    }));

    return NextResponse.json({
      avgScore: Number(avgScore.toFixed(2)),
      improvementRate: Number(improvementRate.toFixed(2)),
      weakTopics,
      history,
    });
  } catch (error) {
    console.error("PERFORMANCE API ERROR:", error);

    return NextResponse.json({
      avgScore: 0,
      improvementRate: 0,
      weakTopics: [],
      history: [],
    });
  }
}
