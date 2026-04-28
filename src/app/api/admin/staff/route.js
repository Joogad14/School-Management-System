import dbConnect from "@/lib/db";
import Staff from "@/models/Staff";
import Subject from "@/models/Subject";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// ======================
// GET ALL STAFF
// ======================
export async function GET() {
  try {
    await dbConnect();

    const staff = await Staff.find().lean();
    const subjects = await Subject.find()
      .select("subjectName subjectCode teachers")
      .lean();

    const staffWithSubjects = staff.map((s) => {
      const assignedSubjects = subjects
        .filter((sub) =>
          sub.teachers?.some(
            (t) => t.toString() === s._id.toString()
          )
        )
        .map((sub) => sub.subjectName);

      return {
        ...s,
        subject: assignedSubjects,
      };
    });

    return NextResponse.json(staffWithSubjects);
  } catch (err) {
    console.log("GET STAFF ERROR:", err);

    return NextResponse.json(
      { message: "Error fetching staff" },
      { status: 500 }
    );
  }
}


// ======================
// CREATE STAFF
// ======================
export async function POST(req) {
  try {
    await dbConnect();

    const formData = await req.formData();

    const title = formData.get("title");
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const role = formData.get("role");
    const address = formData.get("address");
    const password = formData.get("password");

    const classAssignedRaw = formData.get("classAssigned");
const subjectRaw = formData.get("subject");

const classAssigned = classAssignedRaw
  ? classAssignedRaw.split(",").map((c) => c.trim())
  : [];

const subject = subjectRaw
  ? subjectRaw.split(",").map((s) => s.trim())
  : [];

  
    // 🔥 FIX 1: password safety check
    if (!password) {
      return NextResponse.json(
        { message: "Password is required" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password.toString(), 10);

    // 🔥 FIX 2: faster count
    const count = await Staff.countDocuments({});
    const year = new Date().getFullYear();

    const staffId =
      `DYNAMIC/STAFF/${year}/${String(count + 1).padStart(6, "0")}`;

    const newStaff = await Staff.create({
      staffId,
      title,
      firstName,
      lastName,
      email,
      phone,
      role,
      classAssigned,
      subject,
      address,
      password: hashedPassword,
      imageUrl: "",
    });

    return NextResponse.json({
      message: "Staff created successfully",
      staff: newStaff,
    });

  } catch (err) {
    console.log("CREATE STAFF ERROR:", err);

    return NextResponse.json(
      { message: "Error creating staff" },
      { status: 500 }
    );
  }
}