import dbConnect from "@/lib/db";
import Result from "@/models/Result";
import SessionTerm from "@/models/SessionTerm";
import { NextResponse } from "next/server";

async function recalcRanking(classId, session, term, type) {
  const results = await Result.find({ class: classId, session, term, type });

  results.sort((a, b) => b.totalObtained - a.totalObtained);

  for (let i = 0; i < results.length; i++) {
    results[i].position = i + 1;
    await results[i].save();
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();

    const body = await req.json();

    const updated = await Result.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    );

    await recalcRanking(
      updated.class,
      updated.session,
      updated.term,
      updated.type
    );

    return NextResponse.json({
      message: "Result updated successfully",
      result: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating result", error: error.message },
      { status: 500 }
    );
  }
}