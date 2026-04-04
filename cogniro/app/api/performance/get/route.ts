import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Performance from "@/models/Performance";
import Test from "@/models/Test";

export async function GET() {
  try {
    await connectDB();

    const userId = "507f1f77bcf86cd799439011";

    const performance = await Performance.findOne({ userId });

    const tests = await Test.find({ userId }).sort({ createdAt: -1 }).limit(5);

    return NextResponse.json({
      avgScore: performance?.avgScore || 0,
      improvementRate: performance?.improvementRate || 0,
      weakTopics: performance?.weakTopics || [],
      history: tests,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching performance" },
      { status: 500 }
    );
  }
}
