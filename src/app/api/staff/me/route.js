import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Staff from "@/models/Staff";
import Class from "@/models/Class";
import Subject from "@/models/Subject";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await dbConnect();

    // ======================
    // GET TOKEN FROM COOKIE
    // ======================
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "No token found" },
        { status: 401 }
      );
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }

    // ======================
    // GET STAFF
    // ======================
    const staff = await Staff.findById(decoded.id).lean();

    if (!staff) {
      return NextResponse.json(
        { message: "Staff not found" },
        { status: 404 }
      );
    }

    // ======================
    // CLASS HANDLING
    // ======================
    let classNames = [];

    const classIdsFromStaff = (staff.classAssigned || []).filter(
      (id) => typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id)
    );

    const plainClassNames = (staff.classAssigned || []).filter(
      (id) => typeof id === "string" && !/^[0-9a-fA-F]{24}$/.test(id)
    );

    if (classIdsFromStaff.length > 0) {
      const classDocs = await Class.find({
        _id: { $in: classIdsFromStaff },
      })
        .select("className")
        .lean();

      classNames = classDocs.map((c) => c.className);
    }

    classNames = [...classNames, ...plainClassNames];

    // ======================
    // SUBJECT FORMAT
    // ======================
    const subjects = await Subject.find({
      teachers: staff._id,
    })
      .select("subjectName class")
      .lean();

    const subjectClassIds = subjects.map((s) => s.class);

    const subjectClassDocs = await Class.find({
      _id: { $in: subjectClassIds },
    })
      .select("className")
      .lean();

    const classMap = {};
    subjectClassDocs.forEach((c) => {
      classMap[c._id.toString()] = c.className;
    });

    const subjectNames = subjects.map((s) => {
      const className = classMap[s.class?.toString()];
      return className
        ? `${s.subjectName} - ${className}`
        : s.subjectName;
    });

    // ======================
    // RESPONSE
    // ======================
    return NextResponse.json({
      staff: {
        ...staff,
        classAssigned: classNames,
        subject: subjectNames,
      },
    });

  } catch (err) {
    console.log("STAFF ME ERROR:", err);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}