import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Student from "@/models/Student";

export async function POST(req) {
  try {
    await dbConnect();

    const { studentId, toClass } = await req.json();

    // ================= VALIDATION =================
    if (!studentId || !toClass) {
      return NextResponse.json(
        { success: false, message: "Missing studentId or class" },
        { status: 400 }
      );
    }

    // ================= FIND STUDENT =================
    const student = await Student.findById(studentId);

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    // ================= UPDATE =================
    student.currentClass = toClass;
    await student.save();

    return NextResponse.json({
      success: true,
      message: "Student promoted successfully",
      data: student, // 🔥 useful for frontend update
    });

  } catch (error) {
    console.error("PROMOTION ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Promotion failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}