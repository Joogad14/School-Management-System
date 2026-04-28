import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Student from "@/models/Student";
import Staff from "@/models/Staff";
import Class from "@/models/Class";
import Parent from "@/models/Parent";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await dbConnect();

    // ================= TOKEN =================
    const token = req.cookies.get("token")?.value;

    

    if (!token) {
      return NextResponse.json({ message: "No token" }, { status: 401 });
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

    

    // ================= STUDENT =================
    const student = await Student.findById(decoded.id).lean();

    console.log("👨‍🎓 STUDENT FOUND:", student?._id);

    if (!student) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    // ================= CLASS =================
    let className = "";
    let teacherAssigned = [];

    if (student.currentClass) {
      

      const classDoc = await Class.findById(student.currentClass)
        .populate({
          path: "teachers",
          select: "title firstName lastName",
        })
        .lean();

      

      className = classDoc?.className || "";

      teacherAssigned =
        classDoc?.teachers?.map((t) => ({
          name: `${t.title || ""} ${t.firstName} ${t.lastName}`.trim(),
        })) || [];

      
    }

    // ================= PARENT =================
    let parentName = "";

    if (student.parent) {
      const parent = await Parent.findById(student.parent).lean();

      if (parent) {
        parentName = `${parent.title || ""} ${parent.lastName || ""}`.trim();
      }
    }

    // ================= RESPONSE =================
    return NextResponse.json({
      student: {
        ...student,
        currentClass: className,
        parentName,
        teacherAssigned,
      },
    });

  } catch (err) {
    console.log("❌ STUDENT ME ERROR:", err);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}