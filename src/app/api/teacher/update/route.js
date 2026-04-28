import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Staff from "@/models/Staff";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function PUT(req) {
  try {
    await dbConnect();

    // =============================
    // 🔐 GET TOKEN FROM COOKIE
    // =============================
    const token = req.cookies.get("token")?.value;

    // 🔴 LOG 1
    console.log("🔥 COOKIE TOKEN:", token);

    if (!token) {
      return NextResponse.json(
        { message: "No token" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔴 LOG 2
    console.log("🔐 DECODED TOKEN:", decoded);

    const body = await req.json();

    // 🔴 LOG 3
    console.log("📦 REQUEST BODY:", body);

    const {
      title,
      firstName,
      otherName,
      lastName,
      email,
      phone,
      address,
      password,
    } = body;

    // =============================
    // FIND STAFF
    // =============================
    const staff = await Staff.findById(decoded.id);

    // 🔴 LOG 4
    console.log("👤 STAFF FOUND:", staff);

    if (!staff) {
      return NextResponse.json(
        { message: "Staff not found" },
        { status: 404 }
      );
    }

    // =============================
    // UPDATE FIELDS
    // =============================
    staff.title = title ?? staff.title;
    staff.firstName = firstName ?? staff.firstName;
    staff.otherName = otherName ?? staff.otherName;
    staff.lastName = lastName ?? staff.lastName;
    staff.email = email ?? staff.email;
    staff.phone = phone ?? staff.phone;
    staff.address = address ?? staff.address;

    // =============================
    // PASSWORD UPDATE (OPTIONAL)
    // =============================
    if (password && password.trim() !== "") {
      const hashed = await bcrypt.hash(password, 10);
      staff.password = hashed;
    }

    await staff.save();

    // 🔴 LOG 5
    console.log("💾 UPDATED STAFF SAVED:", staff);

    return NextResponse.json({
      message: "Profile updated successfully",
      staff: {
        _id: staff._id,
        title: staff.title,
        firstName: staff.firstName,
        otherName: staff.otherName,
        lastName: staff.lastName,
        email: staff.email,
        phone: staff.phone,
        address: staff.address,
      },
    });

  } catch (err) {
    console.log("❌ UPDATE STAFF ERROR:", err);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}