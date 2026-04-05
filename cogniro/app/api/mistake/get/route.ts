import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Mistake from "@/models/Mistake";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.nextUrl.searchParams.get("userId") || "507f1f77bcf86cd799439011";

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: "Invalid userId" }, { status: 400 });
    }

    const mistakes = await Mistake.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 });

    return NextResponse.json({ mistakes });

  } catch (error) {
    console.error("MISTAKES API ERROR:", error);
    return NextResponse.json(
      { message: "Error fetching mistakes" },
      { status: 500 }
    );
  }
}
