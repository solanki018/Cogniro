import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Test from "@/models/Test";
import Question from "@/models/Question";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

type GeminiQuestion = {
  question?: string;
  options?: string[];
  correctAnswer?: string;
  topic?: string;
  explanation?: string;
};

export async function POST(req: Request) {
  try {
    await connectDB();

    const { userId, type, difficulty, totalQuestions, topics = [] } = await req.json();

    if (!type || !difficulty || !totalQuestions) {
      return NextResponse.json(
        { message: "type, difficulty and totalQuestions are required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Generate ${totalQuestions} ${difficulty} level ${type} questions.

Topics: ${topics.join(", ")}

Return ONLY valid JSON array. Do not add markdown, code fences, or extra text.
Each item must follow:
[
  {
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "A",
    "topic": "topic name",
    "explanation": "short reason"
  }
]
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleaned = text.replace(/```json|```/g, "").trim();
    const jsonStart = cleaned.indexOf("[");
    const jsonEnd = cleaned.lastIndexOf("]");

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("Invalid Gemini response format");
    }

    const parsed = JSON.parse(cleaned.slice(jsonStart, jsonEnd + 1)) as GeminiQuestion[];

    const normalizedQuestions = parsed.map((q, index: number) => ({
      question: q.question || `Question ${index + 1}`,
      options: Array.isArray(q.options) ? q.options : [],
      correctAnswer: q.correctAnswer || "",
      topic: q.topic || topics[0] || "General",
      explanation: q.explanation || "",
    }));

    const createdTest = await Test.create({
      userId,
      type,
      difficulty,
      totalQuestions,
      score: 0,
    });

    const savedQuestions = await Question.insertMany(
      normalizedQuestions.map((q) => ({
        ...q,
        testId: createdTest._id,
      }))
    );

    return NextResponse.json({
      success: true,
      testId: createdTest._id,
      questions: savedQuestions,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to generate test" },
      { status: 500 }
    );
  }
}
