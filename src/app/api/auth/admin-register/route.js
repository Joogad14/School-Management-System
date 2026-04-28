import dbConnect from "@/lib/db";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";
import { generateAdminId } from "@/lib/generateId";

export async function POST(req) {
  await dbConnect();

  const {
    title,   // ✅ ADD THIS
    firstName,
    otherName,
    lastName,
    email,
    password,
  } = await req.json();

  const adminId = await generateAdminId();

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await Admin.create({
    adminId,
    title, // ✅ ADD THIS
    firstName,
    otherName,
    lastName,
    email,
    password: hashedPassword,
    role: "admin",
  });

  return Response.json({
    message: "Admin created successfully",
    admin,
  });
}