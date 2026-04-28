import dbConnect from "@/lib/db";
import Staff from "@/models/Staff";
import { NextResponse } from "next/server";

// =====================
// GET SINGLE STAFF
// =====================
export async function GET(req, context) {
  try {
    await dbConnect();

    const { id } = await context.params; // ✅ FIXED

    const staff = await Staff.findById(id);

    return NextResponse.json(staff);
  } catch (err) {
    return NextResponse.json(
      { message: "Error fetching staff" },
      { status: 500 }
    );
  }
}

// =====================
// UPDATE STAFF
// =====================
export async function PUT(req, context) {
  try {
    await dbConnect();

    const { id } = await context.params;

    const formData = await req.formData();

    const classAssignedRaw = formData.get("classAssigned");
    const subjectRaw = formData.get("subject");

    const updateData = {
      title: formData.get("title"),
      firstName: formData.get("firstName"),
      otherName: formData.get("otherName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      role: formData.get("role"),
      address: formData.get("address"),

      // ✅ FIXED ARRAY HANDLING
      classAssigned: classAssignedRaw
        ? classAssignedRaw.split(",").map((c) => c.trim())
        : [],

      subject: subjectRaw
        ? subjectRaw.split(",").map((s) => s.trim())
        : [],
    };

    const updated = await Staff.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return NextResponse.json({
      message: "Staff updated successfully",
      staff: updated,
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Error updating staff" },
      { status: 500 }
    );
  }
}

// =====================
// DELETE STAFF
// =====================
export async function DELETE(req, context) {
  try {
    await dbConnect();

    const { id } = await context.params; // ✅ FIXED

    await Staff.findByIdAndDelete(id);

    return NextResponse.json({
      message: "Staff deleted successfully",
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Error deleting staff" },
      { status: 500 }
    );
  }
}