import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";

import Staff from "@/models/Staff";
import Class from "@/models/Class";
import Subject from "@/models/Subject";
import Student from "@/models/Student";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const staffId = searchParams.get("staffId");

    if (!staffId) {
      return NextResponse.json(
        { message: "Missing staffId" },
        { status: 400 }
      );
    }

    // ======================
    // GET STAFF
    // ======================
    const staff = await Staff.findById(staffId).lean();

    if (!staff) {
      return NextResponse.json(
        { message: "Staff not found" },
        { status: 404 }
      );
    }

    // ======================
    // GET CLASSES (REAL DATA)
    // ======================
    const classes = await Class.find({
      _id: { $in: staff.classAssigned || [] },
    }).lean();

    // ======================
    // GET SUBJECTS (REAL DATA)
    // ======================
    const subjects = await Subject.find({
      _id: { $in: staff.subject || [] },
    }).lean();

    // ======================
    // STUDENT COUNT (ALL CLASSES)
    // ======================
    const studentCount = await Student.countDocuments({
      currentClass: { $in: staff.classAssigned || [] },
    });

    return NextResponse.json({
      staff,
      classes,
      subjects,
      stats: {
        students: studentCount,
        classes: classes.length,
        subjects: subjects.length,
      },
    });

  } catch (err) {
    console.log("TEACHER DASHBOARD ERROR:", err);

    return NextResponse.json(
      { message: err.message },
      { status: 500 }
    );
  }
}