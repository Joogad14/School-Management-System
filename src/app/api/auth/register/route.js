import dbConnect from "@/lib/db";
import Student from "@/models/Student";
import bcrypt from "bcryptjs";
import { generateStudentId } from "@/lib/generateId";

export async function POST(req) {
  await dbConnect();

  const {
    firstName,
    otherName,
    lastName,
    currentClass,
    password,
  } = await req.json();

  // generate safe unique ID
  const studentId = await generateStudentId();

  const hashedPassword = await bcrypt.hash(password, 10);

  const student = await Student.create({
    studentId,
    firstName,
    otherName,
    lastName,
    currentClass,
    password: hashedPassword,
  });

  return Response.json({
    message: "Student registered successfully",
    student,
  });
}