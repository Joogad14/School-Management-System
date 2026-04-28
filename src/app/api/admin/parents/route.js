import dbConnect from "@/lib/db";
import Parent from "@/models/Parent";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();

    const data = await req.json();

    if (!data.parentPassword) {
      return NextResponse.json(
        { message: "Password is required" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(data.parentPassword, 10);

    const year = new Date().getFullYear();
    const count = await Parent.countDocuments();

    const parentId = `DYNAMIC/PARENT/${year}/${String(count + 1).padStart(6, "0")}`;

    const parent = await Parent.create({
      parentId,
      title: data.parentTitle,
      firstName: data.parentFirstName,
      otherName: data.parentOtherName,
      lastName: data.parentLastName,
      email: data.parentEmail,
      phone: data.parentPhone,

      // ✅ ADDRESS FIXED HERE
      address: data.parentAddress,

      password: hashedPassword,
    });

    return NextResponse.json({
      message: "Parent created successfully",
      parent,
    });
  } catch (err) {
    return NextResponse.json(
      { message: err.message || "Error creating parent" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();

    const parents = await Parent.find().sort({ createdAt: -1 });

    return NextResponse.json(parents);
  } catch (err) {
    return NextResponse.json(
      { message: "Error fetching parents" },
      { status: 500 }
    );
  }
}