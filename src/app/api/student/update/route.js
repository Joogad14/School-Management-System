import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Student from "@/models/Student";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function PUT(req) {
  try {
    await dbConnect();

    // ================= TOKEN FROM COOKIE =================
    const token = req.cookies.get("token")?.value;

    console.log("🍪 COOKIE TOKEN:", token);

    if (!token) {
      return NextResponse.json(
        { message: "No token" },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.log("❌ JWT ERROR:", err.message);

      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // ================= BODY =================
    const body = await req.json();

    const {
      firstName,
      otherName,
      lastName,
      email,
      phone,
      address,
      password,
    } = body;

    // ================= FIND STUDENT =================
    const student = await Student.findById(decoded.id);

    if (!student) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    // ================= UPDATE =================
    if (firstName) student.firstName = firstName;
    if (otherName !== undefined) student.otherName = otherName;
    if (lastName) student.lastName = lastName;
    if (email) student.email = email;
    if (phone !== undefined) student.phone = phone;
    if (address !== undefined) student.address = address;

    // ================= PASSWORD =================
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      student.password = hashed;
    }

    await student.save();

    return NextResponse.json({
      message: "Profile updated successfully",
      student,
    });

  } catch (err) {
    console.log("❌ STUDENT UPDATE ERROR:", err);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}