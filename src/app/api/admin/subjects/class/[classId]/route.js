import dbConnect from "@/lib/db";
import Subject from "@/models/Subject";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    console.log("🔥 SUBJECT ROUTE LOADED");

    const { classId } = await params; // ✅ FIXED

    console.log("🔥 CLASS ID:", classId);

    if (!classId) {
      return NextResponse.json(
        { message: "Invalid classId" },
        { status: 400 }
      );
    }

    const subjects = await Subject.find({
      class: classId,
    });

    console.log("✅ SUBJECTS FOUND:", subjects.length);

    return NextResponse.json(subjects);

  } catch (err) {
    console.log("❌ ERROR:", err);

    return NextResponse.json(
      { message: err.message },
      { status: 500 }
    );
  }
}