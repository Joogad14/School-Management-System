import dbConnect from "@/lib/db";
import Student from "@/models/Student";

export async function POST(req) {
  await dbConnect();

  const { parentId } = await req.json();

  const students = await Student.find({ parentId });

  return Response.json({ students });
}