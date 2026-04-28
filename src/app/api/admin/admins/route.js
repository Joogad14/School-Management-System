import dbConnect from "@/lib/db";
import Admin from "@/models/Admin";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// ======================
// GET ADMINS
// ======================
export async function GET() {
  try {
    await dbConnect();

    const admins = await Admin.find().sort({ createdAt: -1 });

    return NextResponse.json(admins, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "Error fetching admins" },
      { status: 500 }
    );
  }
}

// ======================
// CREATE ADMIN
// ======================
export async function POST(req) {
  try {
    await dbConnect();

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

    if (!title || !firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return NextResponse.json(
        { message: "Admin already exists with this email" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password.toString(), 10);

    // ✅ FIX ORDER
    const year = new Date().getFullYear();

    const lastAdmin = await Admin.findOne().sort({ createdAt: -1 });

    let nextNumber = 1;

    if (lastAdmin?.adminId) {
      const lastNumber = parseInt(lastAdmin.adminId.split("/").pop());
      nextNumber = lastNumber + 1;
    }

    const adminId =
      `DYNAMIC/ADMIN/${year}/${String(nextNumber).padStart(6, "0")}`;

    const newAdmin = await Admin.create({
      adminId,
      title,
      firstName,
      otherName,
      lastName,
      email,
      password: hashedPassword,
      role: "admin",
      isActive: isActive ?? true,
    });

    return NextResponse.json(
      {
        message: "Admin created successfully",
        admin: newAdmin,
      },
      { status: 201 }
    );
  } catch (err) {
    console.log("CREATE ADMIN ERROR:", err);

    return NextResponse.json(
      { message: "Error creating admin" },
      { status: 500 }
    );
  }
}