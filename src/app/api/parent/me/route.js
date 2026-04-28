import dbConnect from "@/lib/db";
import Parent from "@/models/Parent";
import Student from "@/models/Student";
import Class from "@/models/Class";
import Staff from "@/models/Staff";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await dbConnect();

    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { message: "No token" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ================= PARENT =================
    const parent = await Parent.findById(decoded.id).select(
      "parentId title firstName otherName lastName email phone address students"
    );

    if (!parent) {
      return NextResponse.json(
        { message: "Parent not found" },
        { status: 404 }
      );
    }

    // ================= STUDENTS WITH POPULATION =================
    const students = await Student.find({
      parent: parent._id,
    })
      .populate({
        path: "currentClass",
        select: "className teachers",
        populate: {
          path: "teachers",
          select: "title firstName lastName",
        },
      })
      .select("firstName lastName studentId currentClass teacherAssigned");

    return NextResponse.json({
      parent,
      students,
    });

  } catch (err) {
    console.log("Parent ME error:", err);

    return NextResponse.json(
      { message: "Invalid token or server error" },
      { status: 401 }
    );
  }
}