import dbConnect from "@/lib/db";
import Staff from "@/models/Staff";
import Student from "@/models/Student";
import Parent from "@/models/Parent";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();

    const { userId, password } = await req.json();

    let user = null;
    let role = "";

    // STAFF
    user = await Staff.findOne({ staffId: userId });
    if (user) role = "staff";

    // STUDENT
    if (!user) {
      user = await Student.findOne({ studentId: userId });
      if (user) role = "student";
    }

    // PARENT
    if (!user) {
      user = await Parent.findOne({ parentId: userId });
      if (user) role = "parent";
    }

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 400 }
      );
    }

    // =============================
    // CREATE TOKEN
    // =============================
    const token = jwt.sign(
      { id: user._id, role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // =============================
    // CREATE RESPONSE
    // =============================
    const response = NextResponse.json({
      message: "Login successful",
      token,
      role,
      user,
      redirect:
        role === "staff"
          ? "/teacher/dashboard"
          : role === "student"
          ? "/student/dashboard"
          : "/parent/dashboard",
    });

    // =============================
    // SET COOKIE (🔥 FIX)
    // =============================
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;

  } catch (err) {
    console.log("LOGIN ERROR:", err);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}