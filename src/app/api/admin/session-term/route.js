import dbConnect from "@/lib/db";
import SessionTerm from "@/models/SessionTerm";
import { NextResponse } from "next/server";

// ✅ CREATE
export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();

    const newSession = await SessionTerm.create(body);

    return NextResponse.json({
      message: "Session created successfully",
      data: newSession,
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Error saving session" },
      { status: 500 }
    );
  }
}

// ✅ GET (PAGINATED)
export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    const skip = (page - 1) * limit;

    const sessions = await SessionTerm.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await SessionTerm.countDocuments();

    return NextResponse.json({
      sessions,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });

  } catch (err) {
    return NextResponse.json(
      { message: "Error fetching sessions" },
      { status: 500 }
    );
  }
}

// ✅ UPDATE (THIS FIXES YOUR EDIT BUTTON)
export async function PUT(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { message: "ID is required" },
        { status: 400 }
      );
    }

    const updatedSession = await SessionTerm.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedSession) {
      return NextResponse.json(
        { message: "Session not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Session updated successfully",
      data: updatedSession,
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Error updating session" },
      { status: 500 }
    );
  }
}

// (Optional but recommended) DELETE
export async function DELETE(req) {
  try {
    await dbConnect();

    const { id } = await req.json();

    await SessionTerm.findByIdAndDelete(id);

    return NextResponse.json({
      message: "Deleted successfully",
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Error deleting session" },
      { status: 500 }
    );
  }
}