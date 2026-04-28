import dbConnect from "@/lib/db";
import Class from "@/models/Class";
import Staff from "@/models/Staff";
import { NextResponse } from "next/server";

// ======================
// UPDATE CLASS
// ======================
export async function PUT(req, context) {
  try {
    await dbConnect();

    const { id } = await context.params;

    const formData = await req.formData();
    const className = formData.get("className");
    const teachers = formData.getAll("teachers");

    const updatedClass = await Class.findByIdAndUpdate(
      id,
      { className, teachers },
      { new: true }
    );

    await Staff.updateMany(
      { _id: { $in: teachers } },
      { $addToSet: { classAssigned: className } }
    );

    return NextResponse.json({
      message: "Class updated successfully",
      class: updatedClass,
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Error updating class" },
      { status: 500 }
    );
  }
}

// ======================
// DELETE CLASS
// ======================
export async function DELETE(req, context) {
  try {
    await dbConnect();

    const { params } = context;
    const { id } = await params;

    const deletedClass = await Class.findByIdAndDelete(id);

    // 🔥 cleanup staff references (NOW INSIDE FUNCTION)
    await Staff.updateMany(
      {},
      { $pull: { classAssigned: deletedClass.className } }
    );

    return NextResponse.json({
      message: "Class deleted successfully",
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Error deleting class" },
      { status: 500 }
    );
  }
}