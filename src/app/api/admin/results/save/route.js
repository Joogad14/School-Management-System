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
      studentActivity,
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

        const getGrade = (score, type) => {
  if (type === "CA") {
    const percent = (score / 30) * 100;

    if (percent >= 70) return "A";
    if (percent >= 60) return "B";
    if (percent >= 50) return "C";
    if (percent >= 45) return "D";
    if (percent >= 40) return "E";
    return "F";
  } else {
    // EXAM (over 100)
    if (score >= 70) return "A";
    if (score >= 60) return "B";
    if (score >= 50) return "C";
    if (score >= 45) return "D";
    if (score >= 40) return "E";
    return "F";
  }
};

    const updatedSubjects = subjects.map((s) => {
  const score = type === "CA" ? s.total : s.total;

  return {
    ...s,
    grade: getGrade(score || 0, type),
  };
});


    // ================= PAYLOAD =================
    const payload = {
  student: studentId,
  class: classId,
  studentId,
  session,
  term,
  type,
  subjects: updatedSubjects,

  daysOpen: attendance?.daysOpen ?? result?.daysOpen ?? 0,
  daysPresent: attendance?.daysPresent ?? result?.daysPresent ?? 0,

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

      studentActivity:
      Array.isArray(studentActivity) && studentActivity.length > 0
        ? studentActivity
        : result?.studentActivity || [],
};


    // ================= CREATE OR UPDATE =================
    if (result) {
      result = await Result.findByIdAndUpdate(result._id, payload, {
        new: true,
      });
    } else {
      result = await Result.create(payload);
    }

    // ================= 🔥 GENERAL POSITION =================
const allResults = await Result.find({
  class: classId,
  session,
  term,
  type,
}).sort({ percentage: -1 });

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

// ================= 🔥 SUBJECT POSITION =================
for (let subjectIndex = 0; subjectIndex < updatedSubjects.length; subjectIndex++) {

  const subjectId = updatedSubjects[subjectIndex].subject;

  const subjectResults = await Result.find({
    class: classId,
    session,
    term,
    type,
    "subjects.subject": subjectId,
  });

  subjectResults.sort((a, b) => {
    const aScore =
      a.subjects.find(
        (s) => String(s.subject) === String(subjectId)
      )?.total || 0;

    const bScore =
      b.subjects.find(
        (s) => String(s.subject) === String(subjectId)
      )?.total || 0;

    return bScore - aScore;
  });

  for (let i = 0; i < subjectResults.length; i++) {
    const current = subjectResults[i];

    const subject = current.subjects.find(
      (s) => String(s.subject) === String(subjectId)
    );

    if (!subject) continue;

    let pos;
    if (i === 0) pos = "1st";
    else if (i === 1) pos = "2nd";
    else if (i === 2) pos = "3rd";
    else pos = `${i + 1}th`;

    await Result.updateOne(
      { _id: current._id, "subjects.subject": subjectId },
      {
        $set: {
          "subjects.$.position": pos,
          "subjects.$.grade": getGrade(subject.total || 0, type),
        },
      }
    );
  }
}

// ================= FINAL RESPONSE =================
return NextResponse.json({
  success: true,
  message: "Result saved, positions & subject rankings updated",
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