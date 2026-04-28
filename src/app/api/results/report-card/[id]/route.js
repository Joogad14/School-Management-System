import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Result from "@/models/Result";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const result = await Result.findById(params.id)
      .populate("student")
      .populate("class")
      .populate("subjects.subject");

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
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch report card",
        error: error.message,
      },
      { status: 500 }
    );
  }
}