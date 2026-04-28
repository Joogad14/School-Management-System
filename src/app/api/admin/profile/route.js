import dbConnect from "@/lib/db";
import Admin from "@/models/Admin";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// ======================
// GET ADMIN PROFILE
// ======================

   export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const adminId = searchParams.get("adminId");

    if (!adminId) {
      return NextResponse.json(
        { message: "adminId is required" },
        { status: 400 }
      );
    }

    const admin = await Admin.findOne({ adminId });

    if (!admin) {
      return NextResponse.json(
        { message: "Admin not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(admin);
  } catch (err) {
    return NextResponse.json(
      { message: err.message || "Error fetching profile" },
      { status: 500 }
    );
  }
}

// ======================
// UPDATE ADMIN PROFILE
// ======================
export async function PUT(req) {
  try {
    await dbConnect();

    const data = await req.json();

    const admin = await Admin.findOne({ adminId: data.adminId });

    if (!admin) {
      return NextResponse.json(
        { message: "Admin not found" },
        { status: 404 }
      );
    }

    admin.title = data.title || admin.title;
    admin.firstName = data.firstName || admin.firstName;
    admin.otherName = data.otherName || admin.otherName;
    admin.lastName = data.lastName || admin.lastName;
    admin.email = data.email || admin.email;

    if (data.password?.trim()) {
      const bcrypt = require("bcryptjs");
      admin.password = await bcrypt.hash(data.password, 10);
    }

    await admin.save();

    return NextResponse.json({
      message: "Profile updated successfully",
      admin,
    });
  } catch (err) {
    return NextResponse.json(
      { message: err.message || "Server error" },
      { status: 500 }
    );
  }
}