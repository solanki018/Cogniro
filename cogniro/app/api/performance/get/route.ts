import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Test from "@/models/Test";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // 🔥 temporary userId (Baad mein auth se connect karna)
    const userId = "507f1f77bcf86cd799439011";

    // Tests ko sort karo: Latest pehle (Streak ke liye zaroori hai)
    const tests = await Test.find({ userId }).sort({ createdAt: -1 });

    if (!tests || tests.length === 0) {
      return NextResponse.json({
        avgScore: 0,
        improvementRate: 0,
        weakTopics: [],
        history: [],
        streak: 0,
      });
    }

    // 1. 🔥 AVERAGE SCORE
    const total = tests.reduce((sum, t) => sum + (t.score || 0), 0);
    const avgScore = total / tests.length;

    // 2. 🔥 IMPROVEMENT RATE (Last vs Previous)
    // Sirf 1 test hai toh improvement 0, warna last 2 tests ka comparison
    let improvementRate = 0;
    if (tests.length > 1) {
      const latestScore = tests[0].score || 0;
      const previousScore = tests[1].score || 0;
      improvementRate = previousScore === 0 ? latestScore : ((latestScore - previousScore) / previousScore) * 100;
    }

    // 3. 🔥 STREAK CALCULATION (Logic)
    let streak = 0;
    let lastTestDate = new Date(); // Aaj se start
    lastTestDate.setHours(0, 0, 0, 0);

    // Unique dates nikal lo (agar ek din me 2 test diye toh streak 1 hi count hogi)
    const uniqueDates = Array.from(
      new Set(
        tests.map((t) => {
          const d = new Date(t.createdAt);
          d.setHours(0, 0, 0, 0);
          return d.getTime();
        })
      )
    ).sort((a, b) => b - a); // Latest dates first

    // Streak count loop
    for (let i = 0; i < uniqueDates.length; i++) {
      const currentTestDate = new Date(uniqueDates[i]);
      const diffInMs = lastTestDate.getTime() - currentTestDate.getTime();
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

      // Agar test aaj ka hai ya pichle din ka (consecutive)
      if (diffInDays === 0 || diffInDays === 1) {
        streak++;
        lastTestDate = currentTestDate;
      } else {
        // Gap aa gaya, streak toot gayi
        break;
      }
    }

    // 4. 🔥 WEAK TOPICS
    const weakTopicsMap: any = {};
    tests.forEach((t) => {
      if (t.score < 60) { // 60 se niche weak mana jayega
        weakTopicsMap[t.type] = (weakTopicsMap[t.type] || 0) + 1;
      }
    });
    const weakTopics = Object.keys(weakTopicsMap).slice(0, 3); // Top 3 weak topics

    // 5. 🔥 HISTORY (Graph ke liye wapas old-to-new sort kar dete hain)
    const history = [...tests]
      .reverse()
      .map((t) => ({
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