"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import ReportHeader from "../../update/[studentId]/ReportHeader";
import ResultTable from "../../update/[studentId]/ResultTable";
import ResultSummary from "../../update/[studentId]/ResultSummary";
import CommentBox from "../../update/[studentId]/CommentBox";

export default function ResultViewPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();

  const session = searchParams.get("session");
  const term = searchParams.get("term");
  const type = searchParams.get("type");

  const [result, setResult] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/results/report-card/${id}`);
      const data = await res.json();
      setResult(data?.data);
    };

    load();
  }, [id]);

  if (!result) return <div>Loading...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen print:bg-white">

      {/* PRINT BUTTON */}
      <div className="flex justify-end mb-4 print:hidden">
        <button
          onClick={() => window.print()}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Print / Download
        </button>
      </div>

      <ReportHeader
        student={result.student}
        session={session}
        term={term}
      />

      <ResultTable
        subjects={result.subjects}
        handleChange={() => {}}
        type={type}
        term={term}
      />

      <ResultSummary
        totalScore={result.totalObtained}
        average={result.percentage}
        attendance={result.attendance || {}}
        setAttendance={() => {}}
        position={result.position}
      />

      <CommentBox
        comments={{
          teacherComment: result.teacherComment,
          directorComment: result.directorComment,
        }}
        setComments={() => {}}
      />
    </div>
  );
}