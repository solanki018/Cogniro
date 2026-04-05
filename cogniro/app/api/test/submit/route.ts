import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Question from "@/models/Question";
import Test from "@/models/Test";
import Mistake from "@/models/Mistake";
import Performance from "@/models/Performance";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { testId, answers, userId } = await req.json();


    const questions = await Question.find({ testId });

    let correct = 0;
    let total = questions.length;
    let weakTopicsMap: Record<string, number> = {};

    for (let q of questions) {
      const userAns = answers.find(
        (a: any) => a.questionId === q._id.toString()
      );

      const isCorrect = userAns?.selectedAnswer === q.correctAnswer;

      if (isCorrect) {
        correct++;
      } else {

        await Mistake.create({
          userId,
          question: q.question,
          selectedAnswer: userAns?.selectedAnswer || "",
          correctAnswer: q.correctAnswer,
          explanation: q.explanation || "",
          // Topic ko string me convert karo agar array ho
          topic: Array.isArray(q.topic) ? q.topic[0] : q.topic || "General",
        });


        // Track weak topics
        if (q.topic) {
          weakTopicsMap[q.topic] = (weakTopicsMap[q.topic] || 0) + 1;
        }
      }

      // Update question record
      q.userAnswer = userAns?.selectedAnswer;
      q.isCorrect = isCorrect;
      await q.save();

    }

    // ✅ Score calculate
    const score = Math.round((correct / total) * 100);

    // ✅ Update Test
    await Test.findByIdAndUpdate(testId, { score });

    // ✅ Weak topics array
    const weakTopics = Object.keys(weakTopicsMap).filter(
      (t) => weakTopicsMap[t] >= 1
    );

    // ✅ Update Performance
    let performance = await Performance.findOne({ userId });

    if (!performance) {
      performance = await Performance.create({
        userId,
        avgScore: score,
        weakTopics,
        improvementRate: 0,
      });
    } else {
      const newAvg = Math.round((performance.avgScore + score) / 2);

      const improvement =
        ((score - performance.avgScore) / performance.avgScore) * 100;

      performance.avgScore = newAvg;
      performance.weakTopics = weakTopics;
      performance.improvementRate = improvement;

      await performance.save();
    }

    return NextResponse.json({
      score,
      correct,
      total,
      weakTopics,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Submit failed" },
      { status: 500 }
    );
  }
}
