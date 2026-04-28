import dbConnect from "@/lib/db";
import Student from "@/models/Student";
import Class from "@/models/Class";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// ======================
// GET ALL STUDENTS
// ======================
export async function GET() {
  try {
    await dbConnect();

    const students = await Student.find()
      .populate("currentClass", "className")
      .populate("parent", "parentId title firstName lastName phone email")
      .populate({
        path: "teacherAssigned",
        select: "title firstName lastName",
        options: { strictPopulate: false } // 🔥 IMPORTANT FIX
      })
      .lean()
      .sort({ createdAt: -1 });

    return NextResponse.json(students);
  } catch (err) {
    console.log("GET STUDENTS ERROR:", err); // 🔥 ADD THIS
    return NextResponse.json(
      { message: err.message || "Error fetching students" },
      { status: 500 }
    );
  }
}

// ======================
// CREATE STUDENT ONLY
// ======================
export async function POST(req) {
  try {
    await dbConnect();

    const data = await req.json();

    const {
      firstName,
      lastName,
      otherName,
      email,
      password,
      currentClass,
      parentId,
    } = data;

    // ======================
    // VALIDATION
    // ======================
    if (!firstName || !lastName || !currentClass || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // ======================
    // VALIDATE CLASS ID FIRST
    // ======================
    const classData = await Class.findById(currentClass);

    if (!classData) {
      return NextResponse.json(
        { message: "Class not found" },
        { status: 404 }
      );
    }

    const teachers = classData.teachers || [];

    // ======================
    // HASH PASSWORD
    // ======================
    const hashedPassword = await bcrypt.hash(password, 10);

    // ======================
    // GENERATE STUDENT ID
    // ======================
    const count = await Student.countDocuments();
    const year = new Date().getFullYear();

    const studentId = `DYNAMIC/STU/${year}/${String(count + 1).padStart(6, "0")}`;

    // ======================
    // CREATE STUDENT
    // ======================
    const student = await Student.create({
      studentId,
      firstName,
      lastName,
      otherName,
      email,
      password: hashedPassword,
      currentClass: classData._id,
      teacherAssigned: teachers,
      parent: parentId || null,
    });

    // ======================
    // POPULATE BEFORE RETURN
    // ======================
    const populatedStudent = await Student.findById(student._id)
      .populate({
        path: "currentClass",
        select: "className",
      })
      .populate({
        path: "parent",
        select: "parentId title firstName lastName phone email",
      })
      .populate({
        path: "teacherAssigned",
        select: "title firstName lastName",
      });

    return NextResponse.json({
      message: "Student created successfully",
      student: populatedStudent,
    });

  } catch (err) {
    console.log("CREATE STUDENT ERROR:", err);

    return NextResponse.json(
      { message: err.message || "Server error" },
      { status: 500 }
    );
  }
}