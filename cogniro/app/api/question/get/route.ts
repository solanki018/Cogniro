import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Question from "@/models/Question";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const testId = searchParams.get("testId");

    const questions = await Question.find({ testId });

    return NextResponse.json({ questions });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching questions" },
      { status: 500 }
    );
  }
}
