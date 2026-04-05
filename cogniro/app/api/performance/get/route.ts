import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Test from "@/models/Test";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "userId is required" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: "Invalid userId" }, { status: 400 });
    }

    const tests = await Test.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 });

    if (!tests || tests.length === 0) {
      return NextResponse.json({
        avgScore: 0,
        improvementRate: 0,
        weakTopics: [],
        history: [],
        streak: 0,
      });
    }

    const total = tests.reduce((sum, t) => sum + (t.score || 0), 0);
    const avgScore = total / tests.length;

    let improvementRate = 0;
    if (tests.length > 1) {
      const latestScore = tests[0].score || 0;
      const previousScore = tests[1].score || 0;
      improvementRate = previousScore === 0 ? latestScore : ((latestScore - previousScore) / previousScore) * 100;
    }

    let streak = 0;
    let lastTestDate = new Date();
    lastTestDate.setHours(0, 0, 0, 0);

    const uniqueDates = Array.from(
      new Set(
        tests.map((t) => {
          const d = new Date(t.createdAt);
          d.setHours(0, 0, 0, 0);
          return d.getTime();
        })
      )
    ).sort((a, b) => b - a);

    for (let i = 0; i < uniqueDates.length; i++) {
      const currentTestDate = new Date(uniqueDates[i]);
      const diffInDays = (lastTestDate.getTime() - currentTestDate.getTime()) / (1000 * 60 * 60 * 24);
      if (diffInDays === 0 || diffInDays === 1) {
        streak++;
        lastTestDate = currentTestDate;
      } else break;
    }

    const weakTopicsMap: Record<string, number> = {};
    tests.forEach((t) => {
      if (t.score < 60) weakTopicsMap[t.type] = (weakTopicsMap[t.type] || 0) + 1;
    });
    const weakTopics = Object.keys(weakTopicsMap).slice(0, 3);

    const history = [...tests].reverse().map((t) => ({
      _id: t._id,
      score: t.score || 0,
      type: t.type || "unknown",
      createdAt: t.createdAt,
    }));

    return NextResponse.json({
      avgScore: Number(avgScore.toFixed(1)),
      improvementRate: Number(improvementRate.toFixed(1)),
      streak,
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
      streak: 0,
    }, { status: 500 });
  }
}
