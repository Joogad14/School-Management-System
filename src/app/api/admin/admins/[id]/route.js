import dbConnect from "@/lib/db";
import Admin from "@/models/Admin";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// ======================
// GET SINGLE ADMIN
// ======================
export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { id } = await params; // ✅ FIX

    const admin = await Admin.findById(id);

    if (!admin) {
      return NextResponse.json(
        { message: "Admin not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(admin, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "Error fetching admin" },
      { status: 500 }
    );
  }
}

// ======================
// UPDATE ADMIN
// ======================
export async function PUT(req, { params }) {
  try {
    await dbConnect();

    const { id } = await params; // ✅ FIX

    const body = await req.json();

    const {
      title,
      firstName,
      otherName,
      lastName,
      email,
      password,
      isActive,
    } = body;

    const updateData = {
      title,
      firstName,
      otherName,
      lastName,
      email,
      isActive,
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        returnDocument: "after", // ✅ fixes mongoose warning
      }
    );

    if (!updatedAdmin) {
      return NextResponse.json(
        { message: "Admin not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Admin updated successfully",
      admin: updatedAdmin,
    }, { status: 200 });

  } catch (err) {
    return NextResponse.json(
      { message: "Error updating admin" },
      { status: 500 }
    );
  }
}

// ======================
// DELETE ADMIN
// ======================
export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    const { id } = await params; // ✅ FIX

    const deleted = await Admin.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { message: "Admin not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Admin deleted successfully",
    }, { status: 200 });

  } catch (err) {
    return NextResponse.json(
      { message: "Error deleting admin" },
      { status: 500 }
    );
  }
}