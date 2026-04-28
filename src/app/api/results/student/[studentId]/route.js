import dbConnect from "@/lib/db";
import Result from "@/models/Result";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);

    const session = searchParams.get("session");
    const term = searchParams.get("term");
    const type = searchParams.get("type");

    const result = await Result.findOne({
      student: params.studentId,
      session,
      term,
      type,
    })
      .populate("student")
      .populate("class")
      .populate("subjects.subject")
      .populate("subjects.teachers");

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { message: "Error fetching result", error: err.message },
      { status: 500 }
    );
  }
}