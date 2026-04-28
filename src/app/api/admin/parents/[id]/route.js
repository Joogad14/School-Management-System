import dbConnect from "@/lib/db";
import Parent from "@/models/Parent";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    await dbConnect();

    const { id } = await params;
    const body = await req.json();

    const updateData = {
      title: body.parentTitle,
      firstName: body.parentFirstName,
      otherName: body.parentOtherName,
      lastName: body.parentLastName,
      email: body.parentEmail,
      phone: body.parentPhone,

      // ✅ ADDRESS FIXED HERE
      address: body.parentAddress,
    };

    // 🔐 password only if provided
    if (body.parentPassword) {
      updateData.password = await bcrypt.hash(body.parentPassword, 10);
    }

    const updatedParent = await Parent.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedParent) {
      return NextResponse.json(
        { message: "Parent not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Parent updated successfully",
      parent: updatedParent,
    });
  } catch (err) {
    return NextResponse.json(
      { message: err.message || "Server error" },
      { status: 500 }
    );
  }
}


export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    const deleted = await Parent.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { message: "Parent not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Parent deleted successfully",
    });
  } catch (err) {
    return NextResponse.json(
      { message: err.message || "Server error" },
      { status: 500 }
    );
  }
}