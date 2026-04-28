import dbConnect from "@/lib/db";
import Parent from "@/models/Parent";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function PUT(req) {
  try {
    await dbConnect();

    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ message: "No token" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const body = await req.json();

    const updateData = {
      title: body.title,
      firstName: body.firstName,
      otherName: body.otherName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      address: body.address,
    };

    // 🔥 ONLY UPDATE PASSWORD IF PROVIDED
    if (body.password) {
      const hashed = await bcrypt.hash(body.password, 10);
      updateData.password = hashed;
    }

    const parent = await Parent.findByIdAndUpdate(
      decoded.id,
      updateData,
      { new: true }
    );

    return NextResponse.json({
      message: "Profile updated successfully",
      parent,
    });

  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}