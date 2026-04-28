"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TeacherResultsPage() {
  const router = useRouter();

  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");

  const [sessionTerms, setSessionTerms] = useState([]);
  const [selectedSessionTerm, setSelectedSessionTerm] = useState("");

  const [type, setType] = useState("EXAM");
  const [search, setSearch] = useState("");
  const [loadingStudents, setLoadingStudents] = useState(false);

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
    setLoadingStudents(true);

    try {
      const res = await fetch(`/api/admin/students/class/${classId}`);
      const data = await res.json();

      const list = Array.isArray(data) ? data : [];

      setStudents(list);
      setFilteredStudents(list);
    } catch (err) {
      console.log(err);
      setStudents([]);
      setFilteredStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  // ================= SEARCH FILTER =================
  useEffect(() => {
    const filtered = students.filter((s) =>
      `${s.firstName} ${s.lastName} ${s.studentId}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    setFilteredStudents(filtered);
  }, [search, students]);

  // ================= OPEN UPDATE =================
  const openUpdate = (studentId) => {
    if (!selectedSessionTerm) {
      alert("Please select session & term first");
      return;
    }

    const [session, term] = selectedSessionTerm.split("|");

    router.push(
      `/teacher/results/update/${studentId}?session=${session}&term=${term}&type=${type}`
    );
  };

  return (
    <div className="p-6 bg-slate-100 min-h-screen">

      {/* HEADER */}
      <div className="text-white p-5 rounded-2xl shadow-lg bg-[#0a1f44]">
        <h1 className="text-2xl font-bold">Teacher Result Dashboard</h1>
        <p className="text-sm opacity-80">
          Upload and manage student results easily
        </p>
      </div>

      {/* CONTROLS */}
      <div className="bg-white p-5 rounded-2xl shadow-md grid md:grid-cols-3 gap-4 mt-4">

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

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-3 rounded-xl border border-slate-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 hover:border-blue-300"
        >
          <option value="CA">CA</option>
          <option value="EXAM">EXAM</option>
        </select>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl shadow-md mt-4">
        <input
          type="text"
          placeholder="🔍 Search student by name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded-xl border border-slate-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 hover:border-blue-300"
        />
      </div>

      {/* STUDENTS */}
      <div className="mt-4">

        {loadingStudents && (
          <p className="text-center text-gray-500 mt-6">Loading students...</p>
        )}

        {!loadingStudents && filteredStudents.length === 0 && (
          <p className="text-center text-gray-500 mt-6">
            No students found
          </p>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((s) => (
            <div
              key={s._id}
              className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition"
            >
              {/* STUDENT INFO */}
              <div className="flex items-center gap-3 mb-3">

                {/* AVATAR */}
                <div className="w-10 h-10 rounded-full bg-[#0a1f44] text-white flex items-center justify-center font-bold">
                  {s.firstName?.[0]}
                </div>

                <div>
                  <p className="font-semibold text-gray-800">
                    {s.firstName} {s.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {s.studentId}
                  </p>
                </div>
              </div>

              {/* BUTTON */}
              <button
                onClick={() => openUpdate(s._id)}
                className="w-full bg-[#0a1f44] hover:bg-blue-700 text-white py-2 rounded-xl text-sm cursor-pointer"
              >
                Upload Result
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}