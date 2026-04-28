import dbConnect from "@/lib/db";
import Class from "@/models/Class";
import Staff from "@/models/Staff";
import { NextResponse } from "next/server";

// ======================
// GET CLASSES
// ======================
export async function GET() {
  try {
    await dbConnect();

    const classes = await Class.find()
      .populate("teachers", "staffId title firstName lastName");

    return NextResponse.json(classes);
  } catch {
    return NextResponse.json(
      { message: "Error fetching classes" },
      { status: 500 }
    );
  }
}

// ======================
// CREATE CLASS
// ======================
export async function POST(req) {
  try {
    await dbConnect();

    const formData = await req.formData();

    const className = formData.get("className");
    const teachers = formData.getAll("teachers");

    if (!className) {
      return NextResponse.json(
        { message: "Class name is required" },
        { status: 400 }
      );
    }

    const exists = await Class.findOne({ className });
    if (exists) {
      return NextResponse.json(
        { message: "Class already exists" },
        { status: 400 }
      );
    }

    const newClass = await Class.create({
      className,
      teachers,
    });

    // 🔥 UPDATE STAFF
    await Staff.updateMany(
      { _id: { $in: teachers } },
      { $addToSet: { classAssigned: className } }
    );

    return NextResponse.json({
      message: "Class created successfully",
      class: newClass,
    });
  } catch {
    return NextResponse.json(
      { message: "Error creating class" },
      { status: 500 }
    );
  }
}