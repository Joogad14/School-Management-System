import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Result from "@/models/Result";
import SessionTerm from "@/models/SessionTerm";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const classId = searchParams.get("classId");

    if (!classId) {
      return NextResponse.json(
        { message: "Missing classId" },
        { status: 400 }
      );
    }

    // ================= GET ACTIVE SESSION =================
    const allTerms = await SessionTerm.find({});

    const activeTerm = allTerms.find((t) => {
      const now = new Date();
      return now >= new Date(t.from) && now <= new Date(t.to);
    });

    const session = activeTerm?.session;

    // ================= FETCH RESULTS =================
    const results = await Result.find({
      class: classId,
      session,
    }).lean();

    // ================= GROUP BY STUDENT =================
    const map = {};

    results.forEach((r) => {
      const id = String(r.studentId);

      if (!map[id]) {
        map[id] = {
          studentId: id,
          first: 0,
          second: 0,
          third: 0,
        };
      }

      if (r.term === "1st Term") map[id].first = r.percentage || 0;
      if (r.term === "2nd Term") map[id].second = r.percentage || 0;
      if (r.term === "3rd Term") map[id].third = r.percentage || 0;
    });

    const list = Object.values(map);

    // ================= RANKING FUNCTION =================
    const getRanks = (arr, key) => {
      const sorted = [...arr].sort((a, b) => b[key] - a[key]);

      const rankMap = {};
      sorted.forEach((item, index) => {
        rankMap[item.studentId] = index + 1;
      });

      return rankMap;
    };

    const firstRank = getRanks(list, "first");
    const secondRank = getRanks(list, "second");
    const thirdRank = getRanks(list, "third");

    const formatPosition = (n) => {
      if (!n) return "-";
      if (n === 1) return "1st";
      if (n === 2) return "2nd";
      if (n === 3) return "3rd";
      return `${n}th`;
    };

    // ================= FINAL RESPONSE =================
    const final = list.map((s) => ({
      ...s,

      firstPosition: formatPosition(firstRank[s.studentId]),
      secondPosition: formatPosition(secondRank[s.studentId]),
      thirdPosition: formatPosition(thirdRank[s.studentId]),
    }));

    return NextResponse.json({
      success: true,
      data: final,
      activeTerm: activeTerm?.term || "",
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}