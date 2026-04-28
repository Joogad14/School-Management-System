import dbConnect from "@/lib/db";
import Result from "@/models/Result";
import SessionTerm from "@/models/SessionTerm";
import { NextResponse } from "next/server";

// ================= AUTO RANK FUNCTION =================
async function calculateRanking(classId, session, term, type) {
  const results = await Result.find({
    class: classId,
    session,
    term,
    type,
  });

  // sort highest first
  results.sort((a, b) => b.totalObtained - a.totalObtained);

  // assign positions
  for (let i = 0; i < results.length; i++) {
    results[i].position = i + 1;
    await results[i].save();
  }
}

// ================= CREATE RESULT =================
export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();

    const {
      student,
      studentId,
      class: classId,
      session,
      term,
      type,
      subjects,
      daysOpen,
      daysPresent,
      teacherComment,
      directorComment,
    } = body;

    // ================= VALIDATE SESSION =================
    const validSession = await SessionTerm.findOne({ session, term });

    if (!validSession) {
      return NextResponse.json(
        { message: "Invalid session or term" },
        { status: 400 }
      );
    }

    // ================= AUTO CALCULATE TOTAL =================
    let totalObtained = 0;

    subjects.forEach((sub) => {
      const total =
        (sub.ca1 || 0) +
        (sub.ca2 || 0) +
        (sub.exam || 0);

      sub.total = total;
      totalObtained += total;
    });

    const percentage = subjects.length
      ? (totalObtained / (subjects.length * 100)) * 100
      : 0;

    // ================= SAVE RESULT =================
    const result = await Result.create({
      student,
      studentId,
      class: classId,
      session,
      term,
      type,
      subjects,
      daysOpen,
      daysPresent,
      totalObtained,
      percentage,
      teacherComment,
      directorComment,
    });

    // ================= AUTO RANK AFTER SAVE =================
    await calculateRanking(classId, session, term, type);

    return NextResponse.json({
      message: "Result saved & ranked successfully",
      result,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error saving result", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);

    const classId = searchParams.get("classId");
    const session = searchParams.get("session");
    const term = searchParams.get("term");
    const type = searchParams.get("type");

    const filter = {};

    if (classId) filter.class = classId;
    if (session) filter.session = session;
    if (term) filter.term = term;
    if (type) filter.type = type;

    const results = await Result.find(filter)
      .populate("student")
      .populate("class")
      .sort({ position: 1 });

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching results", error: error.message },
      { status: 500 }
    );
  }
}