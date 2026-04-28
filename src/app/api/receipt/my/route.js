import dbConnect from "@/lib/db";
import Receipt from "@/models/Receipt";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await dbConnect();

    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ message: "No token" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const receipts = await Receipt.find({
      parent: decoded.id,
    })
      .populate("student", "firstName lastName studentId")
      .sort({ createdAt: -1 });

    return NextResponse.json({ receipts });

  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}