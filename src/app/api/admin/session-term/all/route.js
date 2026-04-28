import dbConnect from "@/lib/db";
import SessionTerm from "@/models/SessionTerm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const sessions = await SessionTerm.find().sort({ createdAt: -1 });

    return NextResponse.json({ sessions });

  } catch (err) {
    return NextResponse.json(
      { message: "Error fetching sessions" },
      { status: 500 }
    );
  }
}