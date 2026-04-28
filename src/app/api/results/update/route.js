import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Student from "@/models/Student"; // ✅ THIS FIXES YOUR ERROR

export async function PUT(req) {
  await dbConnect();

  const { studentId, resultId } = await req.json();

  const student = await Student.findOne({
    studentId,
    "results._id": resultId,
  });

  const result = student.results.id(resultId);

  if (result.isLocked) {
    return NextResponse.json(
      { message: "Result is locked" },
      { status: 403 }
    );
  }

  //
}