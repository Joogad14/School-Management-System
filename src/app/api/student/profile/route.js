import dbConnect from "@/lib/db";
import Student from "@/models/Student";
import jwt from "jsonwebtoken";

export async function GET(req) {
  await dbConnect();

  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return Response.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);

    const student = await Student.findById(user.id).select("-password");

    if (!student) {
      return Response.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    return Response.json({
      message: "Student profile fetched",
      student,
    });
  } catch (err) {
    return Response.json(
      { message: "Invalid token" },
      { status: 401 }
    );
  }
}