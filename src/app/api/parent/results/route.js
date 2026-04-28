import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Result from "@/models/Result";
import Student from "@/models/Student";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await dbConnect();

    const token = req.cookies.get("token")?.value;

    console.log("🔐 TOKEN:", token);

    if (!token) {
      return NextResponse.json({ message: "No token" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("🧠 DECODED:", decoded);

    // 1️⃣ GET ALL STUDENTS BELONGING TO PARENT
    const students = await Student.find({ parent: decoded.id });

    console.log("👶 STUDENTS FOUND:", students.length);

    if (!students.length) {
      return NextResponse.json({ results: [] });
    }

    const studentIds = students.map((s) => s._id);

    console.log("🎯 STUDENT IDS:", studentIds);

    // 2️⃣ FETCH RESULTS
    const results = await Result.find({
      student: { $in: studentIds },
    })
      .populate("class", "className")
      .populate("student", "firstName lastName studentId")
      .lean();

    console.log("📦 RESULTS FOUND:", results.length);

    return NextResponse.json({ results });

  } catch (err) {
    console.log("🔥 ERROR:", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}