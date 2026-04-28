import dbConnect from "@/lib/db";
import Receipt from "@/models/Receipt";
import Student from "@/models/Student";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await dbConnect();

    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ message: "No token" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const formData = await req.formData();

    const studentId = formData.get("studentId");
    const session = formData.get("session");
    const term = formData.get("term");
    const amount = formData.get("amount");
    const file = formData.get("file");

    // ✅ VALIDATION
    if (!studentId || !file || !session || !term || !amount) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // ✅ ENSURE AMOUNT IS NUMBER
    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount)) {
      return NextResponse.json(
        { message: "Invalid amount" },
        { status: 400 }
      );
    }

    // ✅ VALIDATE STUDENT OWNERSHIP
    const student = await Student.findById(studentId);

    if (!student || student.parent.toString() !== decoded.id) {
      return NextResponse.json(
        { message: "Invalid student" },
        { status: 403 }
      );
    }

    // ✅ FILE CONVERSION
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const imageBase64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // ✅ CREATE RECEIPT
    let receipt = await Receipt.create({
      parent: decoded.id,
      student: studentId,
      session,
      term,
      amount: parsedAmount,
      image: imageBase64,
    });

    // ✅ POPULATE BEFORE RETURN (VERY IMPORTANT)
    receipt = await receipt.populate("student", "firstName studentId");

    return NextResponse.json({
      message: "Uploaded successfully",
      receipt,
    });

  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}