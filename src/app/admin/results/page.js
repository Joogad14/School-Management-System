"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminResultsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");

  const [sessionTerms, setSessionTerms] = useState([]);
  const [selectedSessionTerm, setSelectedSessionTerm] = useState("");

  const [type, setType] = useState("EXAM"); // 🔥 default to EXAM (better for report)

  // ================= FETCH CLASSES =================
  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/admin/classes");
      const data = await res.json();
      setClasses(Array.isArray(data) ? data : []);
    };
    load();
  }, []);

  // ================= FETCH SESSION TERMS =================
  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/admin/session-term");
      const data = await res.json();
      setSessionTerms(data?.sessions || []);
    };
    load();
  }, []);

  // ================= FETCH STUDENTS =================
  const fetchStudents = async (classId) => {
    setSelectedClass(classId);

    try {
      const res = await fetch(`/api/admin/students/class/${classId}`);
      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      setStudents([]);
    }
  };

  // ================= OPEN UPDATE =================
  const openUpdate = (studentId) => {
    if (!selectedSessionTerm) {
      alert("Please select session & term first");
      return;
    }

    const [session, term] = selectedSessionTerm.split("|");

    router.push(
      `/admin/results/update/${studentId}?session=${session}&term=${term}&type=${type}`
    );
  };

  // ================= DOWNLOAD RESULT (FIXED 🔥) =================
  const downloadResult = async (studentId) => {
  if (!selectedSessionTerm) {
    alert("Please select session & term first");
    return;
  }

  const [session, term] = selectedSessionTerm.split("|");

  try {
    const res = await fetch(
      `/api/results?classId=${selectedClass}&session=${session}&term=${term}&type=${type}`
    );

    const results = await res.json();

    const result = results.find((r) => {
      return (
        r.student?._id?.toString() === studentId.toString() &&
        r.session === session &&
        r.term === term &&
        r.type === type
      );
    });

    if (!result) {
      alert("No result found for this student");
      return;
    }

    // ✅ IMPORTANT FIX: use RESULT ID, NOT studentId
    window.open(
      `/admin/results/view/${result._id}?session=${session}&term=${term}&type=${type}`,
      "_blank"
    );

  } catch (err) {
    console.log(err);
    alert("Error loading result");
  }
};

const filteredStudents = students.filter((s) => {
  const name = `${s.firstName} ${s.lastName}`.toLowerCase();
  return (
    name.includes(search.toLowerCase()) ||
    s.studentId?.toLowerCase().includes(search.toLowerCase())
  );
});

  return (
    <div className="p-6 bg-slate-100 min-h-screen">

      {/* HEADER */}
      <div className="text-white p-5 rounded-2xl shadow-lg bg-[#0a1f44]">
        <h1 className="text-2xl font-bold">Result Management Dashboard</h1>
        <p className="text-sm opacity-80">
          Manage, update and download student results
        </p>
      </div>

      {/* CONTROLS */}
      <div className="bg-white p-5 rounded-2xl shadow-md grid md:grid-cols-3 gap-4">

        {/* CLASS */}
        <select
          onChange={(e) => fetchStudents(e.target.value)}
          className="w-full p-3 rounded-xl border border-slate-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 hover:border-blue-300"
        >
          <option value="">Select Class</option>
          {classes.map((c) => (
            <option key={c._id} value={c._id}>
              {c.className}
            </option>
          ))}
        </select>

        {/* SESSION + TERM */}
        <select
          value={selectedSessionTerm}
          onChange={(e) => setSelectedSessionTerm(e.target.value)}
          className="w-full p-3 rounded-xl border border-slate-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 hover:border-blue-300"
        >
          <option value="">Select Session & Term</option>
          {sessionTerms.map((s) => (
            <option key={s._id} value={`${s.session}|${s.term}`}>
              {s.session} - {s.term}
            </option>
          ))}
        </select>

        {/* TYPE */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-3 rounded-xl border border-slate-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 hover:border-blue-300"
        >
          <option value="CA">CA</option>
          <option value="EXAM">EXAM</option>
        </select>

      </div>

      {/* STUDENTS */}
<div className="bg-white p-6 rounded-2xl shadow-md mt-4">

  {/* HEADER + SEARCH */}
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
    <h2 className="font-semibold text-lg text-gray-700">
      Students List
    </h2>

    <input
      type="text"
      placeholder="Search student..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 placeholder:text-slate-500 outline-none hover:border-cyan-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200 transition"
    />
  </div>

  {/* EMPTY STATE */}
  {filteredStudents.length === 0 && (
    <div className="text-center py-10">
      <p className="text-gray-500">No students found</p>
    </div>
  )}

  {/* STUDENT CARDS */}
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
    {filteredStudents.map((s) => (
      <div
        key={s._id}
        className="p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition duration-200 bg-white"
      >
        {/* NAME */}
        <div className="mb-3">
          <p className="font-semibold text-gray-800 text-lg">
            {s.firstName} {s.lastName}
          </p>
          <p className="text-sm text-gray-500">
            {s.studentId}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-between items-center mt-3">

          <button
            onClick={() => openUpdate(s._id)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm transition cursor-pointer"
          >
            Edit
          </button>

          <button
            onClick={() => downloadResult(s._id)}
            className="bg-gray-900 hover:bg-black text-white px-3 py-1.5 rounded-lg text-sm transition cursor-pointer"
          >
            View
          </button>

        </div>
      </div>
    ))}
  </div>

</div>
    </div>
  );
}