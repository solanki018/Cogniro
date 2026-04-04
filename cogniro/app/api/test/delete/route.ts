import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Test from "@/models/Test";
import Question from "@/models/Question";

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const testId = searchParams.get("testId");

    if (!testId) return NextResponse.json({ message: "Test ID required" }, { status: 400 });

    // Test aur usse jude questions dono delete karo
    await Test.findByIdAndDelete(testId);
    await Question.deleteMany({ testId });

    return NextResponse.json({ success: true, message: "Test deleted" });
  } catch (err) {
    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}