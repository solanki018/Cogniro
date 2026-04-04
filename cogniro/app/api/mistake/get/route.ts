import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Mistake from "@/models/Mistake";

export async function GET() {
  try {
    await connectDB();

    const userId = "507f1f77bcf86cd799439011";

    const mistakes = await Mistake.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ mistakes });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching mistakes" },
      { status: 500 }
    );
  }
}
