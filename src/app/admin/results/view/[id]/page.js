"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import ResultViewHeader from "@/components/results/ResultViewHeader";


export default function ViewResultPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();

  const session = searchParams.get("session") || "";
const term = searchParams.get("term") || "";
const type = searchParams.get("type") || "";

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState({
    teacherComment: "",
    directorComment: "",
  });

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/results/view/${id}?session=${session}&term=${term}&type=${type}`);
        const result = await res.json();

        const record = result?.data;

        console.log("📦 FRONTEND RESULT:", record);

        if (!record) {
          setData(null);
          return;
        }

        setData(record);

        setComments({
          teacherComment: record?.teacherComment || "",
          directorComment: record?.directorComment || "",
        });
      } catch (err) {
        console.log(err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, session, term, type]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!data) return <div className="p-6">No result found</div>;

  

  return (
  <>
    <style jsx global>{`
      @media print {
        body {
          background: white;
        }

         .shadow {
        box-shadow: none !important;
      }

        .no-print {
          display: none !important;
        }

        table {
          font-size: 10px;
        }

        th, td {
          padding: 2px !important;
        }

        .scale-print {
          transform: scale(0.85);
          transform-origin: top left;
          width: 117%;
        }
      }
    `}</style>

    
  <div className="print-container scale-print">

    <div className="flex justify-end mb-4 no-print">
      <button
        onClick={() => window.print()}
        className="bg-[#0a1f44] text-white px-4 py-2 rounded-lg shadow cursor-pointer"
      >
        Download Result
      </button>
  </div>

    <ResultViewHeader 
        student={data?.student}
        className={data?.class?.className}
        session={session} 
        term={term}
        type={type}  
      />


    {/* TABLE */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden print:shadow-none">

        <div className="px-3 py-2 border-b bg-slate-50">
          <h2 className="font-semibold text-center text-gray-700 text-sm">
            Statement of Result
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[11px] leading-tight">
          {/* HEADER */}
          <thead>
            <tr className="bg-slate-100 text-gray-700 text-[10px] uppercase">
              <th className="px-2 py-1 text-left">Code</th>
              <th className="px-2 py-1 text-left">Subject</th>
              <th className="px-2 py-1">CA1</th>
              <th className="px-2 py-1">CA2</th>

              {type === "CA" && <th className="px-2 py-1">Total</th>}

              {type === "EXAM" && term !== "3rd Term" && (
                <>
                  <th className="px-2 py-1">Exam</th>
                  <th className="px-2 py-1">Total</th>
                </>
              )}

              {type === "EXAM" && term === "3rd Term" && (
                <>
                  <th className="px-2 py-1">Exam</th>
                  <th className="px-2 py-1">1st</th>
                  <th className="px-2 py-1">2nd</th>
                  <th className="px-2 py-1">Average</th>
                </>
              )}

              <th className="px-2 py-1">Grade</th>
              <th className="px-2 py-1">Position</th>
              <th className="px-2 py-1">Remark</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {data?.subjects?.map((s, i) => {
              const firstTerm =
                data.firstTermSubjects?.find(
                  (f) => String(f.subject) === String(s.subject._id)
                )?.total || 0;

              const secondTerm =
                data.secondTermSubjects?.find(
                  (f) => String(f.subject) === String(s.subject._id)
                )?.total || 0;

              return ( 
                <tr
                  key={i}
                  className="border-t text-gray-800 hover:bg-slate-50 transition"
                >
                  <td className="px-2 py-1 text-gray-800">{s.subjectCode}</td>
                  <td className="px-2 py-1 font-medium truncate max-w-[120px]">
                    {s.subjectName}
                  </td>

                  <td className="px-2 py-1 text-gray-800 text-center">{s.ca1}</td>
                  <td className="px-2 py-1 text-gray-800 text-center">{s.ca2}</td>

                  {type === "CA" && (
                    <td className="px-2 py-1 text-gray-800 text-center font-semibold text-blue-600">
                      {s.total}
                    </td>
                  )}

                  {type === "EXAM" && term !== "3rd Term" && (
                    <>
                      <td className="px-2 py-1 text-gray-800 text-center">{s.exam}</td>
                      <td className="px-2 py-1 text-gray-800 text-center font-semibold text-blue-600">
                        {s.total}
                      </td>
                    </>
                  )}

                  {type === "EXAM" && term === "3rd Term" && (
                    <>
                      <td className="px-2 py-1 text-gray-800 text-center">{s.exam}</td>
                      <td className="px-2 py-1 text-gray-800 text-center">{firstTerm}</td>
                      <td className="px-2 py-1 text-gray-800 text-center">{secondTerm}</td>
                      <td className="px-2 py-1 text-center font-semibold text-blue-600">
                        {s.average}
                      </td>
                    </>
                  )}

                  <td className="px-2 py-1 text-center font-semibold text-indigo-600">
                  {s.grade || "-"}
                </td>

                <td className="px-2 py-1 text-center text-purple-600">
                  {s.position || "-"}
                </td>

                <td className="px-2 py-1">
                  <span className="px-2 py-1 rounded-lg text-xs text-gray-800">
                    {s.remark}
                  </span>
                </td>
                </tr>
              );
            })}
          </tbody>

        </table>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-2 mt-2 text-[11px]">

  {/* LEFT: GRADE SUMMARY */}
  <div className="bg-slate-50 p-2 rounded-lg">

    <p className="font-bold text-gray-700 mb-1 text-[11px]">
      Grade Interpretation
    </p>

    <table className="w-full text-[10px]">
      <thead>
        <tr className="bg-slate-200 text-gray-800">
          <th className="px-1 py-1 text-left">Score Range</th>
          <th className="px-1 py-1 text-center">Grade</th>
          <th className="px-1 py-1 text-left">Meaning</th>
        </tr>
      </thead>

      <tbody>
        {type === "CA" ? (
          <>
            <tr><td className="text-gray-800">0-11</td><td className="text-center font-bold text-red-500">F</td><td className="text-gray-800">Fail</td></tr>
            <tr><td className="text-gray-800">12-13</td><td className="text-center font-bold text-orange-500">E</td><td className="text-gray-800">Poor</td></tr>
            <tr><td className="text-gray-800">14</td><td className="text-center font-bold text-yellow-500">D</td><td className="text-gray-800">Pass</td></tr>
            <tr><td className="text-gray-800">15-17</td><td className="text-center font-bold text-blue-500">C</td><td className="text-gray-800">Good</td></tr>
            <tr><td className="text-gray-800">18-20</td><td className="text-center font-bold text-indigo-500">B</td><td className="text-gray-800">Very Good</td></tr>
            <tr><td className="text-gray-800">21-30</td><td className="text-center font-bold text-green-600">A</td><td className="text-gray-800">Excellent</td></tr>
          </>
        ) : (
          <>
            <tr><td className="text-gray-800">0-39%</td><td className="text-center font-bold text-red-500">F</td><td className="text-gray-800">Fail</td></tr>
            <tr><td className="text-gray-800">40-45%</td><td className="text-center font-bold text-orange-500">E</td><td className="text-gray-800">Poor</td></tr>
            <tr><td className="text-gray-800">46-49%</td><td className="text-center font-bold text-yellow-500">D</td><td className="text-gray-800">Pass</td></tr>
            <tr><td className="text-gray-800">50-59%</td><td className="text-center font-bold text-blue-500">C</td><td className="text-gray-800">Good</td></tr>
            <tr><td className="text-gray-800">60-69%</td><td className="text-center font-bold text-indigo-500">B</td><td className="text-gray-800">Very Good</td></tr>
            <tr><td className="text-gray-800">70-100%</td><td className="text-center font-bold text-green-600">A</td><td className="text-gray-800">Excellent</td></tr>
          </>
        )}
      </tbody>
    </table>
  </div>

  {/* RIGHT: STUDENT ACTIVITY */}
  <div className="bg-slate-50 p-2 rounded-lg">

    <p className="font-bold text-gray-700 mb-1 text-[11px]">
      Student Activity
    </p>

    <div className="grid grid-cols-2 gap-1">
      {data?.studentActivity?.map((item, i) => (
        <div
          key={i}
          className="flex justify-between items-center px-2 py-1 bg-white rounded-md"
        >
          <span className="text-[10px] text-gray-700 truncate">
            {item.name}
          </span>

          <span className="font-bold text-blue-600 text-[10px]">
            {item.score}/5
          </span>
        </div>
      ))}
    </div>

  </div>

</div>

    {/* SUMMARY */}
    <div className="grid grid-cols-3 gap-2 text-xs">

      <div className="bg-white p-4 rounded-2xl shadow border border-slate-100">
        <p className="text-xs text-gray-500">Total Score</p>
        <p className="font-bold text-lg text-[#0a1f44]">
          {data?.totalObtained} / {data?.totalObtainable}
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow border border-slate-100">
        <p className="text-xs text-gray-500">Average</p>
        <p className="font-bold text-lg text-green-600">
          {data?.percentage || data?.average}%
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow border border-slate-100">
      <p className="text-xs text-gray-500">Total No. of Students in Class</p>
      <p className="font-bold text-lg text-blue-600">
        {data?.totalStudents || 0}
      </p>
    </div>

      <div className="bg-white p-4 rounded-2xl shadow border border-slate-100">
        <p className="text-xs text-gray-500">Position</p>
        <p className="font-bold text-lg text-purple-600">
          {data?.position || "-"}
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow border border-slate-100">
        <p className="text-xs text-gray-500">Attendance</p>
        <p className="font-bold text-lg text-orange-600">
          {data?.daysPresent}/{data?.daysOpen}
        </p>
      </div>

    </div>

    

    <div className="grid grid-cols-2 gap-2 mt-2 text-xs">

  <div className="bg-slate-50 p-3 rounded-lg">
    <p className="text-[10px] font-bold text-gray-600 uppercase mb-1">
      Teacher's Comment
    </p>

    <p className="text-sm font-medium text-gray-800 leading-snug">
      {comments.teacherComment || "No comment provided"}
    </p>
  </div>

  <div className="bg-slate-50 p-3 rounded-lg">
    <p className="text-[10px] font-bold text-gray-600 uppercase mb-1">
      Director's Comment
    </p>

    <p className="text-sm font-medium text-gray-800 leading-snug">
      {comments.directorComment || "No comment provided"}
    </p>
  </div>

</div>
  </div>
  </>
);
}