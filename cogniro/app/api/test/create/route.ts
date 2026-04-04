// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import Test from "@/models/Test";
// import Question from "@/models/Question";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// type GeminiQuestion = {
//   question?: string;
//   options?: string[];
//   correctAnswer?: string;
//   topic?: string;
//   explanation?: string;
// };

// export async function POST(req: Request) {
//   try {
//     await connectDB();

//     const { userId, type, difficulty, totalQuestions, topics = [] } = await req.json();

//     if (!type || !difficulty || !totalQuestions) {
//       return NextResponse.json(
//         { message: "type, difficulty and totalQuestions are required" },
//         { status: 400 }
//       );
//     }

//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     const prompt = `
// Generate ${totalQuestions} ${difficulty} level ${type} questions.

// Topics: ${topics.join(", ")}

// Return ONLY valid JSON array. Do not add markdown, code fences, or extra text.
// Each item must follow:
// [
//   {
//     "question": "...",
//     "options": ["A", "B", "C", "D"],
//     "correctAnswer": "A",
//     "topic": "topic name",
//     "explanation": "short reason"
//   }
// ]
// `;

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();

//     const cleaned = text.replace(/```json|```/g, "").trim();
//     const jsonStart = cleaned.indexOf("[");
//     const jsonEnd = cleaned.lastIndexOf("]");

//     if (jsonStart === -1 || jsonEnd === -1) {
//       throw new Error("Invalid Gemini response format");
//     }

//     const parsed = JSON.parse(cleaned.slice(jsonStart, jsonEnd + 1)) as GeminiQuestion[];

//     const normalizedQuestions = parsed.map((q, index: number) => ({
//       question: q.question || `Question ${index + 1}`,
//       options: Array.isArray(q.options) ? q.options : [],
//       correctAnswer: q.correctAnswer || "",
//       topic: q.topic || topics[0] || "General",
//       explanation: q.explanation || "",
//     }));

//     const createdTest = await Test.create({
//       userId,
//       type,
//       difficulty,
//       totalQuestions,
//       score: 0,
//     });

//     const savedQuestions = await Question.insertMany(
//       normalizedQuestions.map((q) => ({
//         ...q,
//         testId: createdTest._id,
//       }))
//     );

//     return NextResponse.json({
//       success: true,
//       testId: createdTest._id,
//       questions: savedQuestions,
//     });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json(
//       { message: "Failed to generate test" },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Test from "@/models/Test";
import Question from "@/models/Question";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { userId, type, difficulty, totalQuestions, topics = [] } = await req.json();

    // 🔥 GEMINI KO ABHI CALL NAHI KARENGE (Mock Data Use Kar Rahe Hain)
    const mockQuestions = [
      {
        question: "What is a JOIN in SQL?",
        options: ["To combine rows", "To delete table", "To create index", "To sort data"],
        correctAnswer: "To combine rows",
        topic: "SQL Joins",
        explanation: "JOIN is used to combine rows from two or more tables based on a related column."
      },
      {
        question: "Which keyword is used to return only different values?",
        options: ["SELECT DISTINCT", "SELECT UNIQUE", "SELECT DIFFERENT", "SELECT ALL"],
        correctAnswer: "SELECT DISTINCT",
        topic: "Basics",
        explanation: "The SELECT DISTINCT statement is used to return only distinct (different) values."
      },
      {
        question: "Which function is used to count the number of rows?",
        options: ["SUM()", "COUNT()", "TOTAL()", "MAX()"],
        correctAnswer: "COUNT()",
        topic: "Aggregates",
        explanation: "COUNT() function returns the number of rows that matches a specified criterion."
      }
    ];

    // 1. Create Test in DB
    const createdTest = await Test.create({
      userId,
      type,
      difficulty,
      totalQuestions: mockQuestions.length, // Mock data ke length ke hisab se
      score: 0,
    });

    // 2. Save Mock Questions to DB
    const questionsWithId = mockQuestions.map((q) => ({
      ...q,
      testId: createdTest._id,
    }));

    const savedQuestions = await Question.insertMany(questionsWithId);

    // 3. Return Response (Frontend ko lagega AI ne bheja hai)
    return NextResponse.json({
      success: true,
      testId: createdTest._id,
      questions: savedQuestions,
    }, { status: 201 });

  } catch (err: any) {
    console.error("Mock Error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}