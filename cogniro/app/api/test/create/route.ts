import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Test from "@/models/Test";
import Question from "@/models/Question";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    await connectDB();
    const { userId, type, difficulty, totalQuestions, topics } = await req.json();

    // 1. Use the 2.0 series model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash", 
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `Generate ${totalQuestions} ${difficulty} level questions for ${type}. Topics: ${topics.join(",")}. Return JSON: [{"question": "...", "options": ["A","B","C","D"], "correctAnswer": "A"}]`;

    const result = await model.generateContent(prompt);
    const questions = JSON.parse(result.response.text());

    // 2. Create Test in DB
    const newTest = await Test.create({ userId, type, difficulty, totalQuestions });

    // 3. Save Questions to DB so frontend can fetch them later
    const questionsWithId = questions.map((q: any) => ({ ...q, testId: newTest._id }));
    const savedQuestions = await Question.insertMany(questionsWithId);

    return NextResponse.json({
      success: true,
      testId: newTest._id,
      questions: savedQuestions
    }, { status: 201 });

  } catch (err: any) {
    console.error("Gemini Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}