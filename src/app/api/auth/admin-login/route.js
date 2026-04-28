import dbConnect from "@/lib/db";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();

    const { adminId, password } = await req.json();

    // ======================
    // FIND ADMIN
    // ======================
    const admin = await Admin.findOne({ adminId });

    if (!admin) {
      return NextResponse.json(
        { message: "Admin not found" },
        { status: 404 }
      );
    }

    // ======================
    // CHECK PASSWORD
    // ======================
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 400 }
      );
    }

    // ======================
    // SUCCESS RESPONSE
    // ======================
    return NextResponse.json({
      message: "Login successful",

      token: "admin-token", // (later replace with JWT)

      admin: {
        _id: admin._id,           // ⭐ IMPORTANT FIX
        adminId: admin.adminId,
        firstName: admin.firstName,
        lastName: admin.lastName,
        title: admin.title,
        email: admin.email,
      },

      redirect: "/admin/dashboard",
    });

  } catch (error) {
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}