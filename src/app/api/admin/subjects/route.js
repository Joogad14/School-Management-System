import dbConnect from "@/lib/db";
import Subject from "@/models/Subject";
import Class from "@/models/Class";
import { NextResponse } from "next/server";

// ======================
// GET ALL SUBJECTS
// ======================
export async function GET() {
  try {
    await dbConnect();

    const subjects = await Subject.find()
      .populate("class", "className")
      .populate("teachers", "staffId title firstName lastName")
      .sort({ createdAt: -1 });

    return NextResponse.json(subjects);
  } catch (err) {
    return NextResponse.json(
      { message: err.message || "Error fetching subjects" },
      { status: 500 }
    );
  }
}

// ======================
// CREATE SUBJECT
// ======================
export async function POST(req) {
  try {
    await dbConnect();

    const data = await req.json();

    const {
      subjectCode,
      subjectName,
      classId,
      teachers,
    } = data;

    // ======================
    // VALIDATION
    // ======================
    if (!subjectCode || !subjectName || !classId) {
      return NextResponse.json(
        { message: "Subject code, name and class are required" },
        { status: 400 }
      );
    }

    // ======================
// CHECK DUPLICATE SUBJECT IN CLASS
// ======================
const duplicateSubject = await Subject.findOne({
  subjectName,
  class: classId,
});

if (duplicateSubject) {
  return NextResponse.json(
    { message: "This subject already exists for this class" },
    { status: 409 }
  );
}

    // ======================
    // VALIDATE CLASS
    // ======================
    const classExists = await Class.findById(classId);

    if (!classExists) {
      return NextResponse.json(
        { message: "Class not found" },
        { status: 404 }
      );
    }

    // ======================
    // CREATE SUBJECT
    // ======================
    const subject = await Subject.create({
      subjectCode,
      subjectName,
      class: classId,
      teachers: teachers || [],
    });

    return NextResponse.json({
      message: "Subject created successfully",
      subject,
    });

  } catch (err) {
    return NextResponse.json(
      { message: err.message || "Server error" },
      { status: 500 }
    );
  }
}