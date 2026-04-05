import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Question from "@/models/Question";
import Test from "@/models/Test";
import Mistake from "@/models/Mistake";
import Performance from "@/models/Performance";
import mongoose from "mongoose";

type SubmittedAnswer = {
  questionId: string;
  selectedAnswer: string;
};

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { testId, answers, userId } = await req.json();

    if (!testId || !userId || !Array.isArray(answers)) {
      return NextResponse.json(
        { message: "testId, userId and answers are required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(testId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: "Invalid testId or userId" }, { status: 400 });
    }

    const test = await Test.findOne({ _id: testId, userId });
    if (!test) {
      return NextResponse.json({ message: "Test not found for this user" }, { status: 404 });
    }

    const questions = await Question.find({ testId });
    if (!questions.length) {
      return NextResponse.json({ message: "No questions found for this test" }, { status: 404 });
    }

    let correct = 0;
    const total = questions.length;
    const weakTopicsMap: Record<string, number> = {};

    for (const q of questions) {
      const userAns = answers.find(
        (a: SubmittedAnswer) => a.questionId === q._id.toString()
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
