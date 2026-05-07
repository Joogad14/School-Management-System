import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";

import Result from "@/models/Result";

// ✅ IMPORT THESE
import Student from "@/models/Student";
import Class from "@/models/Class";

export async function GET() {
  try {

    await dbConnect();

    const results = await Result.find({})
      .populate("student")
      .populate("class")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      results,
    });

  } catch (error) {

    console.log("ADMIN RESULTS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch results",
        error: error.message,
      },
      { status: 500 }
    );
  }
}