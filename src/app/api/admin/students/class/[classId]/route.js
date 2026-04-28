import dbConnect from "@/lib/db";
import Student from "@/models/Student";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    console.time("STUDENT_API");

    await dbConnect();

    const { classId } = await params; // ✅ KEEP await

    if (!classId) {
      return NextResponse.json(
        { message: "Class ID is required" },
        { status: 400 }
      );
    }

    const students = await Student.find({
      currentClass: classId,
    })
      .select("firstName lastName studentId currentClass")
      .lean();

    console.timeEnd("STUDENT_API");

    return NextResponse.json(students);
  } catch (err) {
    console.log("❌ STUDENT FETCH ERROR:", err);

    return NextResponse.json(
      { message: "Error fetching students", error: err.message },
      { status: 500 }
    );
  }
}