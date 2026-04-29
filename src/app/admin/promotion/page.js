"use client";

import { useEffect, useState } from "react";

export default function PromotionPage() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState([]);
  const [resultsMap, setResultsMap] = useState({});
  const [targetClass, setTargetClass] = useState({});

  const [loading, setLoading] = useState(false);
  const [promotingId, setPromotingId] = useState(null);

  
  // 🔍 SEARCH
  const [search, setSearch] = useState("");

  // ================= PAGINATION =================
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [toast, setToast] = useState({
  show: false,
  message: "",
  type: "success",
});

  // ================= FETCH CLASSES =================
  const fetchClasses = async () => {
    const res = await fetch("/api/admin/classes");
    const data = await res.json();
    setClasses(data || []);
  };

  // ================= FETCH STUDENTS =================
  const fetchStudents = async (classId) => {
    if (!classId) return;

    setLoading(true);

    const res = await fetch(`/api/admin/students/class/${classId}`);
    const data = await res.json();

    setStudents(data || []);
    setCurrentPage(1);

    await fetchResults(classId);

    setLoading(false);
  };

  // ================= FETCH RESULTS =================
  const fetchResults = async (classId) => {
  const res = await fetch(
    `/api/admin/results/promotion?classId=${classId}`
  );

  const data = await res.json();

  const map = {};

  data?.data?.forEach((r) => {
    map[r.studentId] = {
      first: r.first,
      second: r.second,
      third: r.third,

      // ✅ FIXED: correct fields from backend
      firstPosition: r.firstPosition,
      secondPosition: r.secondPosition,
      thirdPosition: r.thirdPosition,
    };
  });

  setResultsMap(map);
};

  // ================= PROMOTE =================
  const promoteStudent = async (student) => {
  const toClass = targetClass[student._id];

  if (!toClass) {
    alert("Select class first");
    return;
  }

  try {
    setPromotingId(student._id);

    const res = await fetch("/api/admin/promotion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: student._id,
        fromClass: student.currentClass?._id || student.currentClass,
        toClass,
      }),
    });

    const data = await res.json(); // ✅ SAFE

    console.log("PROMOTION RESPONSE:", data);

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Promotion failed");
    }

    setToast({
      show: true,
      message: "Student promoted successfully",
      type: "success",
    });

    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 2500);

    fetchStudents(selectedClass);

  } catch (err) {
    console.log("ERROR:", err);

    setToast({
      show: true,
      message: err.message,
      type: "error",
    });

    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 2500);

  } finally {
    setPromotingId(null);
  }
};

useEffect(() => {
  console.log("MOUNTED");
  fetchClasses();
}, []);

  // ================= FILTER =================
  const filteredStudents = students.filter((s) => {
    const name = `${s.firstName} ${s.lastName}`.toLowerCase();
    const id = s.studentId?.toLowerCase();

    return (
      name.includes(search.toLowerCase()) ||
      id.includes(search.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">

      {toast.show && (
      <div
        className={`fixed top-5 right-5 px-4 py-3 rounded-xl shadow-lg text-white transition-all ${
          toast.type === "success" ? "bg-green-600" : "bg-red-600"
        }`}
      >
        {toast.message}
      </div>
    )}

      {/* HEADER */}
      <div className="text-white p-5 rounded-2xl bg-[#0a1f44]">
        <h1 className="text-xl md:text-2xl font-bold">
          Student Promotion System
        </h1>
        <p className="text-sm opacity-90">
          Promote students based on exam performance
        </p>
      </div>

      {/* CLASS SELECT */}
      <div className="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row gap-4 items-center">

        <select
          className="w-full p-3 rounded-xl border border-slate-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 hover:border-blue-300"
          onChange={(e) => {
            setSelectedClass(e.target.value);
            fetchStudents(e.target.value);
          }}
        >
          <option value="">-- Choose Class --</option>
          {classes.map((c) => (
            <option key={c._id} value={c._id}>
              {c.className}
            </option>
          ))}
        </select>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search student..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full p-3 rounded-xl border border-slate-200 bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 hover:border-blue-300"
        />

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">

        {loading ? (
          <p className="text-center py-6 text-gray-600">Loading students...</p>
        ) : (
          <table className="w-full text-sm">

            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3 text-left">Student</th>
                <th className="p-3">ID</th>
                <th className="p-3">1st Term</th>
                <th className="p-3">2nd Term</th>
                <th className="p-3">3rd Term</th>
                <th className="p-3">Promote</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center p-6 text-gray-500">
                    No students found
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((s) => (
                  <tr
                    key={s._id}
                    className="border-t hover:bg-blue-50 transition"
                  >
                    <td className="p-3 font-medium text-gray-800">
                      {s.firstName} {s.lastName}
                    </td>

                    <td className="p-3 text-gray-600">{s.studentId}</td>

                    <td className="p-3 text-blue-600 font-semibold text-center">
                    {resultsMap[s._id]?.first != null
                      ? `${resultsMap[s._id].first}% - ${resultsMap[s._id].firstPosition || "-"}`
                      : "0% - -"}
                  </td>

                    <td className="p-3 text-blue-600 font-semibold text-center">
                      {resultsMap[s._id]?.second != null
                        ? `${resultsMap[s._id].second}% - ${resultsMap[s._id].secondPosition || "-"}`
                        : "0% - -"}
                    </td>

                    <td className="p-3 text-center font-bold text-green-600">
                      {resultsMap[s._id]?.third != null
                        ? `${resultsMap[s._id].third}% - ${resultsMap[s._id].thirdPosition || "-"}`
                        : "0% - -"}
                    </td>

                    <td className="p-3">
                      <select
                        className="w-full p-3 rounded-xl border border-slate-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 hover:border-blue-300"
                        onChange={(e) =>
                          setTargetClass({
                            ...targetClass,
                            [s._id]: e.target.value,
                          })
                        }
                      >
                        <option value="">Select</option>
                        {classes
                          .filter((c) => c._id !== selectedClass)
                          .map((c) => (
                            <option key={c._id} value={c._id}>
                              {c.className}
                            </option>
                          ))}
                      </select>
                    </td>

                    <td className="p-3 text-center">
                      <button
                        onClick={() => promoteStudent(s)}
                        disabled={promotingId === s._id}
                        className="bg-green-600 cursor-pointer hover:bg-green-700 disabled:opacity-60 text-white px-3 py-1.5 rounded-lg text-sm"
                      >
                        {promotingId === s._id ? "Promoting..." : "Promote"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        )}

        {/* PAGINATION */}
        <div className="flex justify-center items-center gap-3 p-4">

          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50 text-gray-800 cursor-pointer"
          >
            Prev
          </button>

          <span className="text-gray-800">
            Page {currentPage} of {totalPages || 1}
          </span>

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer text-gray-800"
          >
            Next
          </button>

        </div>

      </div>
    </div>
  );
}