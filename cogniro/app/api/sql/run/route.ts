import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "SQL runner is active" });
}

// Ya agar tu POST use kar raha hai:
export async function POST(req: Request) {
  return NextResponse.json({ message: "Success" });
}