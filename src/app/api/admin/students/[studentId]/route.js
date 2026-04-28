import dbConnect from "@/lib/db";
import Student from "@/models/Student";
import Class from "@/models/Class";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { studentId } = await params;

    if (!studentId) {
      return NextResponse.json(
        { message: "Missing studentId" },
        { status: 400 }
      );
    }

    const student = await Student.findById(studentId)
      .populate("currentClass")
      .lean();

    if (!student) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(student);
  } catch (err) {
    return NextResponse.json(
      { message: err.message },
      { status: 500 }
    );
  }
}

// ======================
// UPDATE STUDENT
// ======================
export async function PUT(req, { params }) {
  try {
    await dbConnect();

    const { studentId: id } = await params; // ✅ FIXED

    console.log("📌 UPDATE ID:", id);

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid student ID" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const student = await Student.findById(id);

    if (!student) {
      console.log("❌ STUDENT NOT FOUND IN DB");
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    if (body.password?.trim()) {
      body.password = await bcrypt.hash(body.password, 10);
    } else {
      delete body.password;
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );

    return NextResponse.json({
      message: "Student updated successfully",
      student: updatedStudent,
    });

  } catch (err) {
    console.log("❌ UPDATE ERROR:", err);

    return NextResponse.json(
      { message: err.message || "Server error" },
      { status: 500 }
    );
  }
}

// ======================
// DELETE STUDENT
// ======================
export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    const { studentId: id } = await params; // ✅ FIX (IMPORTANT)

    const deleted = await Student.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Student deleted successfully",
    });

  } catch (err) {
    return NextResponse.json(
      { message: err.message || "Server error" },
      { status: 500 }
    );
  }
}

