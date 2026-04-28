import dbConnect from "@/lib/db";
import Result from "@/models/Result";

export async function POST(req) {
  await dbConnect();

  const { classId, session, term, type } = await req.json();

  const results = await Result.find({
    class: classId,
    session,
    term,
    type
  }).sort({ totalObtained: -1 });

  for (let i = 0; i < results.length; i++) {
    results[i].position = i + 1;
    await results[i].save();
  }

  return Response.json({ message: "Ranking updated" });
}