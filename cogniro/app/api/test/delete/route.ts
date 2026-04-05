import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Test from "@/models/Test";
import Question from "@/models/Question";
import mongoose from "mongoose";

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const testId = searchParams.get("testId");
    const userId = searchParams.get("userId");

    if (!testId || !userId) {
      return NextResponse.json({ message: "testId and userId required" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(testId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: "Invalid testId or userId" }, { status: 400 });
    }

    const test = await Test.findOne({ _id: testId, userId });
    if (!test) {
      return NextResponse.json({ message: "Test not found for this user" }, { status: 404 });
    }

    // Test aur usse jude questions dono delete karo
    await Test.findByIdAndDelete(testId);
    await Question.deleteMany({ testId });

    return NextResponse.json({ success: true, message: "Test deleted" });
  } catch (err) {
    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}
