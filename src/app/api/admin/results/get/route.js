import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Result from "@/models/Result";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);

    const studentId = searchParams.get("studentId");
    const session = searchParams.get("session");
    const term = searchParams.get("term");
    const type = searchParams.get("type");

    if (!studentId || !session || !term) {
      return NextResponse.json(
        { message: "Missing query parameters" },
        { status: 400 }
      );
    }

    // ================= 1️⃣ EXACT MATCH =================
    let result = await Result.findOne({
      student: studentId,
      session,
      term,
      type,
    })
      .populate("subjects.subject")
      .populate("student")
      .populate("class");

    // ================= 2️⃣ FALLBACK =================
    if (!result) {
      result = await Result.findOne({
        student: studentId,
        session,
        term,
      }).sort({ createdAt: -1 }); // latest
    }

    return NextResponse.json({
      success: true,
      data: result || null,
    });

  } catch (error) {
    console.log("GET RESULT ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch result",
        error: error.message,
      },
      { status: 500 }
    );
  }
}