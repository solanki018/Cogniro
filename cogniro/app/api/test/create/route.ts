import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { type, difficulty, totalQuestions, topics } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Generate ${totalQuestions} ${difficulty} level ${type} questions.

Topics: ${topics.join(", ")}

Return JSON format like:
[
  {
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "A"
  }
]
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // IMPORTANT: parse safely
    const cleaned = text.replace(/```json|```/g, "");
    const questions = JSON.parse(cleaned);

    return NextResponse.json({
      success: true,
      testId: Date.now(), // temp
      questions,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}