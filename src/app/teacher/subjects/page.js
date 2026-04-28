"use client";

import { useEffect, useState } from "react";

export default function AssignedSubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubjects = async () => {
    try {
      const res = await fetch("/api/staff/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setSubjects(data.staff.subject || []);
      }
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSubjects();
  }, []); 

  return (
  <div className="p-6 bg-slate-100 min-h-screen space-y-6">

    {/* HEADER */}
    <div className="text-white p-5 rounded-2xl shadow-lg bg-[#0a1f44]">
      <h1 className="text-2xl font-bold">Assigned Subjects</h1>
      <p className="text-sm opacity-80">
        Subjects and classes you are handling
      </p>
    </div>

    {/* NOTICE */}
    <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-xl text-sm shadow-sm">
      <span className="text-lg">⚠️</span>
      <p>
        For any issue concerning your subject or class, contact the{" "}
        <span className="font-semibold">School Admin</span>.
      </p>
    </div>

    {/* SUBJECTS */}
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">

      {/* TITLE */}
      <div className="px-5 py-4 border-b bg-slate-50">
        <h2 className="font-semibold text-gray-700">
          Assigned Subjects
        </h2>
      </div>

      {loading ? (
        <p className="p-6 text-gray-500">Loading subjects...</p>
      ) : subjects.length === 0 ? (
        <p className="p-6 text-gray-500">No subjects assigned</p>
      ) : (
        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            {/* HEADER */}
            <thead>
              <tr className="bg-slate-100 text-gray-600 text-xs uppercase tracking-wide">
                <th className="p-3 text-left">S/N</th>
                <th className="p-3 text-left">Subject</th>
                <th className="p-3 text-left">Class</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {subjects.map((item, index) => {
                const [subject, className] = item.split(" - ");

                return (
                  <tr
                    key={index}
                    className="border-t hover:bg-slate-50 transition"
                  >
                    {/* NUMBER */}
                    <td className="p-3 text-gray-500">
                      {index + 1}
                    </td>

                    {/* SUBJECT */}
                    <td className="p-3 font-medium text-gray-800">
                      {subject}
                    </td>

                    {/* CLASS */}
                    <td className="p-3">
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                        {className || "-"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>

        </div>
      )}
    </div>
  </div>
);
}