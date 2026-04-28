import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Student from "@/models/Student";
import Subject from "@/models/Subject";
import dbConnect from "@/lib/db";

export async function GET(req) {
  try {
    await dbConnect();

    const authHeader = req.headers.get("authorization");

    // ✅ CHECK 1: Header exists
    if (!authHeader) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );
    }

    // ✅ CHECK 2: Must be Bearer token
    if (!authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Invalid token format" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // ✅ CHECK 3: Token must not be null/undefined
    if (!token || token === "null" || token === "undefined") {
      return NextResponse.json(
        { message: "Invalid token value" },
        { status: 401 }
      );
    }

    let decoded;

    // ✅ CHECK 4: Safe JWT verification
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.log("❌ JWT ERROR:", err.message);
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // ✅ FETCH STUDENT
    const student = await Student.findById(decoded.id).populate("currentClass");

    if (!student) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    // ✅ FETCH SUBJECTS BASED ON CLASS
    const subjects = await Subject.find({
      class: student.currentClass._id,
    }).populate("class");

    return NextResponse.json({
      student,
      subjects,
    });

  } catch (err) {
    console.log("❌ SERVER ERROR:", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}