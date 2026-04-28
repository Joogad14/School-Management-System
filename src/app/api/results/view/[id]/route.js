import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Result from "@/models/Result";
import "@/models/Student";
import "@/models/Class";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Missing result ID" },
        { status: 400 }
      );
    }

    console.time("DB_QUERY");

    const result = await Result.findById(id)
      .populate({
        path: "student",
        select: "firstName lastName studentId currentClass",
        populate: {
          path: "currentClass",
          model: "Class",
          select: "className",
        },
      })
      .populate("class", "className")
      .lean();

    console.timeEnd("DB_QUERY");

    if (!result) {
      return NextResponse.json(
        { message: "Result not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error("VIEW RESULT ERROR:", error);

    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}