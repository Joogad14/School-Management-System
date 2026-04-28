import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Result from "@/models/Result";

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();

    const {
      studentId,
      session,
      term,
      type,
      subjects,
      attendance,
      comments,
      classId,
    } = body;

    // ================= CHECK IF RESULT EXISTS =================
    let result = await Result.findOne({
      student: studentId,
      session,
      term,
      type,
    });

    // ================= CALCULATIONS =================
    const totalObtained = subjects.reduce((sum, s) => {
      return sum + (s.total || s.grandTotal || 0);
    }, 0);

    const totalObtainable =
      type === "CA"
        ? subjects.length * 30
        : subjects.length * 100;

    const percentage =
      totalObtainable > 0
        ? (totalObtained / totalObtainable) * 100
        : 0;

    // ================= PAYLOAD =================
    const payload = {
  student: studentId,
  class: classId,
  studentId,
  session,
  term,
  type,
  subjects,

  daysOpen: attendance.daysOpen,
  daysPresent: attendance.daysPresent,

  totalObtained,
  totalObtainable,
  percentage: Number(percentage.toFixed(2)),

  teacherComment: comments.teacherComment,
  directorComment: comments.directorComment,

  // ✅ FIX STARTS HERE

  firstTermTotal:
    body.firstTermTotal ?? result?.firstTermTotal ?? 0,

  secondTermTotal:
    body.secondTermTotal ?? result?.secondTermTotal ?? 0,

  firstTermSubjects:
    body.firstTermSubjects && body.firstTermSubjects.length > 0
      ? body.firstTermSubjects
      : result?.firstTermSubjects || [],

  secondTermSubjects:
    body.secondTermSubjects && body.secondTermSubjects.length > 0
      ? body.secondTermSubjects
      : result?.secondTermSubjects || [],
};

    // ================= CREATE OR UPDATE =================
    if (result) {
      result = await Result.findByIdAndUpdate(result._id, payload, {
        new: true,
      });
    } else {
      result = await Result.create(payload);
    }

    // ================= 🔥 POSITION LOGIC =================

    // 1️⃣ Get all results in same class/session/term/type
    const allResults = await Result.find({
      class: classId,
      session,
      term,
      type,
    }).sort({ percentage: -1 }); // highest first

    console.log("📊 TOTAL STUDENTS FOR POSITION:", allResults.length);

    // 2️⃣ Assign positions
    for (let i = 0; i < allResults.length; i++) {
      let pos;

      if (i === 0) pos = "1st";
      else if (i === 1) pos = "2nd";
      else if (i === 2) pos = "3rd";
      else pos = `${i + 1}th`;

      await Result.findByIdAndUpdate(allResults[i]._id, {
        position: pos,
      });
    }

    console.log("✅ POSITIONS UPDATED");

    return NextResponse.json({
      success: true,
      message: "Result saved and positions updated",
      data: result,
    });

  } catch (error) {
    console.log("🔥 ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to save result",
        error: error.message,
      },
      { status: 500 }
    );
  }
}