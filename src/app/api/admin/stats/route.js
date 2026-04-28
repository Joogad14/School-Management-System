import dbConnect from "@/lib/db";
import Admin from "@/models/Admin";
import Student from "@/models/Student";
import Staff from "@/models/Staff"; 
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const admins = await Admin.countDocuments();
    const students = await Student.countDocuments();
    const teachers = await Staff.countDocuments(); 

    return NextResponse.json({
      admins,
      students,
      teachers, 
    });

  } catch (err) {
    console.log("STATS ERROR:", err);

    return NextResponse.json(
      { message: "Error fetching stats" },
      { status: 500 }
    );
  }
}