import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Receipt from "@/models/Receipt";
import "@/models/Student";
import "@/models/Parent";
import "@/models/Class";

export async function PUT(req, { params }) {
  try {
    await dbConnect();

    const { id } = await params; 

    const body = await req.json();
    const { status } = body;

    const updated = await Receipt.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: "after" } // ✅ FIXED (no more deprecated warning)
    );

    return NextResponse.json(updated);
  } catch (err) {
    console.error("❌ UPDATE ERROR:", err);

    return NextResponse.json(
      { message: "Failed to update receipt" },
      { status: 500 }
    );
  }
}