import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Test from "@/models/Test";
import Question from "@/models/Question";
import { generateQuestions } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { userId, type, difficulty, totalQuestions } = await req.json();

    // ✅ 1. Create Test Entry
    const test = await Test.create({
      userId,
      type,
      difficulty,
      totalQuestions,
      score: 0,
    });

    // ✅ 2. Gemini Prompt
    const prompt = `
    Generate ${totalQuestions} ${type} questions of ${difficulty} difficulty.

    Return ONLY JSON:
    [
      {
        "question": "",
        "options": ["", "", "", ""],
        "correctAnswer": "",
        "explanation": "",
        "topic": ""
      }
    ]
    `;

    const aiText = await generateQuestions(prompt);

    // ✅ 3. Clean AI response
    const cleaned = aiText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let questions;

    try {
      questions = JSON.parse(cleaned);
    } catch (err) {
      console.error("❌ Parsing Error:", cleaned);
      return NextResponse.json(
        { message: "AI parsing failed", raw: cleaned },
        { status: 500 }
      );
    }

    // ✅ 4. Save Questions in DB
    const savedQuestions = await Promise.all(
      questions.map((q: any) =>
        Question.create({
          testId: test._id,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          topic: q.topic,
        })
      )
    );

    // ✅ 5. Return response
    return NextResponse.json(
      {
        message: "Test created successfully",
        testId: test._id,
        questions: savedQuestions,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
