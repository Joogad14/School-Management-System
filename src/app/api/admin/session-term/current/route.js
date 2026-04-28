import dbConnect from "@/lib/db";
import SessionTerm from "@/models/SessionTerm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const now = new Date();

    const current = await SessionTerm.findOne({
      from: { $lte: now },
      to: { $gte: now },
    }).sort({ from: -1 }); // ✅ IMPORTANT FIX

    if (!current) {
      return NextResponse.json({
        session: "Not Active",
        term: "Not Active",
      });
    }

    return NextResponse.json({
      session: current.session,
      term: current.term,
    });

  } catch (err) {
    return NextResponse.json(
      { message: "Error fetching current session" },
      { status: 500 }
    );
  }
}