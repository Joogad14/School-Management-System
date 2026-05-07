import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Result from "@/models/Result";
import "@/models/Student";
import "@/models/Class";
import "@/models/Subject";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { id: studentId } = await params;

    const { searchParams } = new URL(req.url);
    const session = searchParams.get("session");
    const term = searchParams.get("term");
    const type = searchParams.get("type");

    
    if (!studentId || !session || !term || !type) {
      return NextResponse.json(
        { message: "Missing required parameters" },
        { status: 400 }
      );
    }

    const result = await 
    Result.findById(studentId)
      .populate("subjects.subject")
      .populate({
        path: "student",
        populate: {
          path: "currentClass",
          model: "Class",
        },
      })
      .populate("class")
      .lean(); 

    if (!result) {
  return NextResponse.json(
    { message: "Result not found" },
    { status: 404 }
  );
}

const totalStudents = await Result.countDocuments({
  class: result.class._id,
  session,
  term,
  type,
});


return NextResponse.json({
  success: true,
  data: {
    ...result,
    totalStudents,
  },
});

  } catch (error) {
    console.error("VIEW RESULT ERROR:", error);

    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}