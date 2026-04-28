import dbConnect from "@/lib/db";
import Subject from "@/models/Subject";
import { NextResponse } from "next/server";

// ======================
// PUT (UPDATE SUBJECT)
// ======================
export async function PUT(req, { params }) {
  try {
    await dbConnect();

    const { id } = await params; // ✅ FIX for Next.js 15

    const body = await req.json();

    const subject = await Subject.findById(id);

    if (!subject) {
      return NextResponse.json(
        { message: "Subject not found" },
        { status: 404 }
      );
    }

    // ❌ Prevent accidental overwrite of subjectCode to duplicate
    if (body.subjectCode) {
      const existingCode = await Subject.findOne({
        subjectCode: body.subjectCode,
        _id: { $ne: id },
      });

      if (existingCode) {
        return NextResponse.json(
          { message: "Subject code already exists" },
          { status: 409 }
        );
      }
    }

    const updated = await Subject.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    )
      .populate("class", "className")
      .populate("teachers", "staffId title firstName lastName");

    return NextResponse.json({
      message: "Subject updated successfully",
      subject: updated,
    });

  } catch (err) {
    return NextResponse.json(
      { message: err.message || "Server error" },
      { status: 500 }
    );
  }
}

// ======================
// DELETE SUBJECT
// ======================
export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    const { id } = await params; // ✅ FIXED

    const deleted = await Subject.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { message: "Subject not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Subject deleted successfully",
    });

  } catch (err) {
    return NextResponse.json(
      { message: err.message || "Server error" },
      { status: 500 }
    );
  }
}