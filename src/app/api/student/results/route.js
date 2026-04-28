import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Result from "@/models/Result";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await dbConnect();

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "No token" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }

    // 🔥 FETCH ALL RESULTS FOR THIS STUDENT
    const results = await Result.find({ student: decoded.id })
      .populate("class", "className")
      .lean();

    return NextResponse.json({ results });

  } catch (err) {
    console.log("❌ STUDENT RESULTS ERROR:", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}