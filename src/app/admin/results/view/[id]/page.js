"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import ReportHeader from "@/components/results/ReportHeader";

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

        const res = await fetch(`/api/results/view/${id}`);
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
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!data) return <div className="p-6">No result found</div>;

  

  return (
  <div className="p-6 bg-slate-100 min-h-screen text-sm space-y-6">

    {/* HEADER */}
    <ReportHeader
      student={data?.student}
      className={data?.class?.className}
      session={session}
      term={term}
    />

    {/* TABLE */}
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">

      <div className="px-5 py-4 border-b bg-slate-50">
        <h2 className="font-semibold text-centre text-gray-700">Statement of Result </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          {/* HEADER */}
          <thead>
            <tr className="bg-slate-100 text-gray-700 text-xs uppercase tracking-wide">
              <th className="p-3 text-left">Code</th>
              <th className="p-3 text-left">Subject</th>
              <th className="p-3">CA1</th>
              <th className="p-3">CA2</th>

              {type === "CA" && <th className="p-3">Total</th>}

              {type === "EXAM" && term !== "3rd Term" && (
                <>
                  <th className="p-3">Exam</th>
                  <th className="p-3">Total</th>
                </>
              )}

              {type === "EXAM" && term === "3rd Term" && (
                <>
                  <th className="p-3">Exam</th>
                  <th className="p-3">1st</th>
                  <th className="p-3">2nd</th>
                  <th className="p-3">Avg</th>
                </>
              )}

              <th className="p-3">Remark</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {data?.subjects?.map((s, i) => {
              const firstTerm =
                data.firstTermSubjects?.find(
                  (f) => f.subjectName === s.subjectName
                )?.total || 0;

              const secondTerm =
                data.secondTermSubjects?.find(
                  (f) => f.subjectName === s.subjectName
                )?.total || 0;

              return ( 
                <tr
                  key={i}
                  className="border-t text-gray-800 hover:bg-slate-50 transition"
                >
                  <td className="p-3 text-gray-800">{s.subjectCode}</td>
                  <td className="p-3 text-gray-800 font-medium">{s.subjectName}</td>

                  <td className="p-3 text-gray-800 text-center">{s.ca1}</td>
                  <td className="p-3 text-gray-800text-center">{s.ca2}</td>

                  {type === "CA" && (
                    <td className="p-3 text-gray-800 text-center font-semibold text-blue-600">
                      {s.total}
                    </td>
                  )}

                  {type === "EXAM" && term !== "3rd Term" && (
                    <>
                      <td className="p-3 text-gray-800 text-center">{s.exam}</td>
                      <td className="p-3 text-gray-800 text-center font-semibold text-blue-600">
                        {s.total}
                      </td>
                    </>
                  )}

                  {type === "EXAM" && term === "3rd Term" && (
                    <>
                      <td className="p-3 text-gray-800 text-center">{s.exam}</td>
                      <td className="p-3 text-gray-800 text-center">{firstTerm}</td>
                      <td className="p-3 text-gray-800 text-center">{secondTerm}</td>
                      <td className="p-3 text-center font-semibold text-blue-600">
                        {s.average}
                      </td>
                    </>
                  )}

                  <td className="p-3">
                    <span className="px-2 py-1 rounded-lg text-xs bg-slate-100 text-gray-700">
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

    {/* SUMMARY */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

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

    {/* COMMENTS */}
    <div className="grid md:grid-cols-2 gap-4">

      <div className="bg-white p-5 rounded-2xl shadow border border-slate-100">
        <p className="text-xs text-gray-800 mb-2 uppercase">
          Teacher's Comment
        </p>

        <p className="text-sm text-gray-800 leading-relaxed">
          {comments.teacherComment || "No comment provided"}
        </p>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow border border-slate-100">
        <p className="text-xs text-gray-800 mb-2 uppercase">
          Director's Comment
        </p>

        <p className="text-sm text-gray-800 leading-relaxed">
          {comments.directorComment || "No comment provided"}
        </p>
      </div>

    </div>

  </div>
);
}