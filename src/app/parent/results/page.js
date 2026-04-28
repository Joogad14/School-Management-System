"use client";

import { useEffect, useState } from "react";

export default function ParentResultsPage() {
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);

  const [form, setForm] = useState({
    studentId: "",
    session: "",
    term: "",
  });

  const [filtered, setFiltered] = useState([]);

  // ================= FETCH WARDS + RESULTS =================
  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");

        // 🔥 PARENT + WARDS
        const res = await fetch("/api/parent/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setStudents(data.students || []);

        // 🔥 ALL RESULTS (for wards)
        const resultRes = await fetch("/api/parent/results", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const resultData = await resultRes.json();
        setResults(resultData.results || []);
      } catch (err) {
        console.log(err);
      }
    };

    load();
  }, []);

  // ================= FILTER =================
  useEffect(() => {
    if (!form.studentId || !form.session || !form.term) return;

    const filteredData = results.filter((r) => {
      return (
        r.student?._id === form.studentId &&
        r.session === form.session &&
        r.term === form.term
      );
    });

    setFiltered(filteredData);
  }, [form, results]);

  // ================= SESSION OPTIONS =================
  const sessionOptions = [
    ...new Set(results.map((r) => r.session)),
  ];

  const termOptions = [
    ...new Set(results.map((r) => r.term)),
  ];

  return (
   
    <div className="p-6 space-y-6 bg-slate-100 min-h-screen">

  {/* HEADER */}
  <div className="text-white p-5 rounded-2xl shadow-lg bg-[#0a1f44]">
    <h1 className="text-2xl font-bold">My Children's Results</h1>
    <p className="text-sm opacity-80">
      View academic performance per child
    </p>
  </div>

  {/* FILTERS */}
  <div className="bg-white p-5 rounded-2xl shadow-md grid md:grid-cols-3 gap-4">

    {/* WARD */}
    <select
      value={form.studentId}
      onChange={(e) =>
        setForm((prev) => ({
          ...prev,
          studentId: e.target.value,
        }))
      }
      className="w-full p-3 rounded-xl border border-slate-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 hover:border-blue-300"
    >
      <option value="">Select Ward</option>
      {students.map((s) => (
        <option key={s._id} value={s._id}>
          {s.firstName} {s.lastName}
        </option>
      ))}
    </select>

    {/* SESSION */}
    <select
      value={form.session}
      onChange={(e) =>
        setForm((prev) => ({
          ...prev,
          session: e.target.value,
        }))
      }
      className="w-full p-3 rounded-xl border border-slate-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 hover:border-blue-300"
    >
      <option value="">Select Session</option>
      {sessionOptions.map((s, i) => (
        <option key={i} value={s}>
          {s}
        </option>
      ))}
    </select>

    {/* TERM */}
    <select
      value={form.term}
      onChange={(e) =>
        setForm((prev) => ({
          ...prev,
          term: e.target.value,
        }))
      }
      className="w-full p-3 rounded-xl border border-slate-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 hover:border-blue-300"
    >
      <option value="">Select Term</option>
      {termOptions.map((t, i) => (
        <option key={i} value={t}>
          {t}
        </option>
      ))}
    </select>

  </div>

  {/* RESULTS */}
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

    {filtered.length === 0 ? (
      <div className="col-span-full text-center text-gray-500 bg-white p-10 rounded-2xl shadow">
        No results found for selected filters
      </div>
    ) : (
      filtered.map((r) => (
        <div
          key={r._id}
          className="bg-white p-5 rounded-2xl shadow-md border border-slate-100 hover:shadow-lg transition duration-200"
        >

          {/* STUDENT */}
          <div className="mb-3">
            <p className="font-bold text-lg text-[#0a1f44]">
              {r.student?.firstName} {r.student?.lastName}
            </p>
            <p className="text-xs text-gray-400">
              {r.student?.studentId}
            </p>
          </div>

          {/* SESSION */}
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg">
              {r.session}
            </span>
            <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-lg">
              {r.term}
            </span>
          </div>

          {/* CLASS */}
          <p className="text-sm text-gray-500 mb-2">
            Class: <span className="font-medium">{r.class?.className}</span>
          </p>

          {/* SCORE */}
          <div className="bg-slate-50 p-3 rounded-xl text-center mb-3">
            <p className="text-xs text-gray-500">Total Score</p>
            <p className="text-2xl font-bold text-[#0a1f44]">
              {r.totalObtained} / {r.totalObtainable}
            </p>
          </div>

          {/* BUTTON */}
          <button
            onClick={() =>
              window.open(
                `/parent/results/view/${r._id}?session=${r.session}&term=${r.term}&type=${r.type}`,
                "_blank"
              )
            }
            className="w-full bg-[#0a1f44] hover:bg-blue-700 text-white py-2 rounded-xl transition cursor-pointer"
          >
            View Result
          </button>

        </div>
      ))
    )}

  </div>

</div>
  );
}