import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Receipt from "@/models/Receipt";
import "@/models/Student";
import "@/models/Parent";
import "@/models/Class";

export async function GET() {
  try {
    await dbConnect();

    const receipts = await Receipt.find()
      .populate({
        path: "student",
        populate: {
          path: "currentClass",
        },
      })
      .populate("parent")
      .sort({ createdAt: -1 });

    return NextResponse.json(receipts);
  } catch (err) {
    console.error("❌ RECEIPT FETCH ERROR:", err);
    return NextResponse.json(
      { message: "Failed to fetch receipts" },
      { status: 500 }
    );
  }
}