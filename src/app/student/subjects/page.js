"use client";

import { useEffect, useState } from "react";

export default function StudentSubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem("token");

        if (!token) {
        console.log("❌ No token found");
        setLoading(false);
        return;
        }

        const res = await fetch("/api/student/subjects", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });
      const data = await res.json();

      if (res.ok) {
        setSubjects(data.subjects || []);
        setStudent(data.student);
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
      <h1 className="text-2xl font-bold">My Subjects</h1>
      <p className="text-sm opacity-80">
        Subjects assigned to your class
      </p>
    </div>

    {/* STUDENT INFO */}
    <div className="bg-white p-5 rounded-2xl shadow border border-slate-100">

      <div className="grid md:grid-cols-3 gap-4 text-sm">

        <div className="bg-slate-50 p-4 rounded-xl">
          <p className="text-xs text-gray-500">Student Name</p>
          <p className="font-semibold text-gray-800">
            {student
              ? `${student.firstName} ${student.lastName}`
              : "Loading..."}
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl">
          <p className="text-xs text-gray-500">Student ID</p>
          <p className="font-semibold text-gray-800">
            {student?.studentId || "-"}
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl">
          <p className="text-xs text-gray-500">Class</p>
          <p className="font-semibold text-gray-800">
            {student?.currentClass?.className || "-"}
          </p>
        </div>

      </div>
    </div>

    {/* SUBJECTS */}
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">

      {/* TITLE */}
      <div className="px-5 py-4 border-b bg-slate-50">
        <h2 className="font-semibold text-gray-700">
          Class Subject List
        </h2>
      </div>

      {loading ? (
        <p className="p-6 text-gray-500">Loading subjects...</p>
      ) : subjects.length === 0 ? (
        <p className="p-6 text-gray-500">No subjects found</p>
      ) : (
        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            {/* HEADER */}
            <thead>
              <tr className="bg-slate-100 text-gray-600 text-xs uppercase tracking-wide">
                <th className="p-3 text-left">S/N</th>
                <th className="p-3 text-left">Code</th>
                <th className="p-3 text-left">Subject</th>
                <th className="p-3 text-left">Class</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {subjects.map((s, index) => (
                <tr
                  key={s._id}
                  className="border-t hover:bg-slate-50 transition"
                >
                  <td className="p-3 text-gray-500">
                    {index + 1}
                  </td>

                  <td className="p-3">
                    <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium">
                      {s.subjectCode}
                    </span>
                  </td>

                  <td className="p-3 font-medium text-gray-800">
                    {s.subjectName}
                  </td>

                  <td className="p-3">
                    <span className="px-2 py-1 rounded-lg bg-slate-100 text-gray-600 text-xs">
                      {s.class?.className}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>
      )}
    </div>
  </div>
);
}