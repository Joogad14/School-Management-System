"use client";

import { useEffect, useMemo, useState } from "react";

export default function AdminResultsPage() {

  const [results, setResults] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [classes, setClasses] = useState([]);

  const [form, setForm] = useState({
    classId: "",
    session: "",
    term: "",
    type: "",
    search: "",
  });

  const [loading, setLoading] = useState(true);

  // ================= FETCH =================
  useEffect(() => {

    const load = async () => {

      try {

        setLoading(true);

        // RESULTS
        const resultRes = await fetch("/api/admin/results");
        const resultData = await resultRes.json();

        setResults(resultData.results || []);

        // CLASSES
        const classRes = await fetch("/api/admin/classes");
        const classData = await classRes.json();

        setClasses(classData || []);

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    load();

  }, []);

  // ================= OPTIONS =================
  const sessionOptions = useMemo(() => {
    return [...new Set(results.map((r) => r.session))];
  }, [results]);

  const termOptions = useMemo(() => {
    return [...new Set(results.map((r) => r.term))];
  }, [results]);

  // ================= FILTER =================
  useEffect(() => {

    let data = [...results];

    // CLASS
    if (form.classId) {
      data = data.filter(
        (r) => r.class?._id === form.classId
      );
    }

    // SESSION
    if (form.session) {
      data = data.filter(
        (r) => r.session === form.session
      );
    }

    // TERM
    if (form.term) {
      data = data.filter(
        (r) => r.term === form.term
      );
    }

    // TYPE
    if (form.type) {
      data = data.filter(
        (r) => r.type === form.type
      );
    }

    // SEARCH
    if (form.search.trim()) {

      const keyword = form.search.toLowerCase();

      data = data.filter((r) => {

        const fullName =
          `${r.student?.firstName || ""} ${r.student?.lastName || ""}`.toLowerCase();

        const studentId =
          r.student?.studentId?.toLowerCase() || "";

        return (
          fullName.includes(keyword) ||
          studentId.includes(keyword)
        );
      });
    }

    setFiltered(data);

  }, [form, results]);

  return (

    <div className="p-6 bg-slate-100 min-h-screen space-y-6">

      {/* HEADER */}
      <div className="bg-[#0a1f44] text-white p-5 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold">
          View Student Results
        </h1>

        <p className="text-sm opacity-80">
          Search and manage all saved student results
        </p>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-5 rounded-2xl shadow-md grid md:grid-cols-5 gap-4">

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search student name or ID"
          value={form.search}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              search: e.target.value,
            }))
          }
          className="w-full p-3 rounded-xl border border-slate-300 bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* CLASS */}
        <select
          value={form.classId}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              classId: e.target.value,
            }))
          }
          className="w-full p-3 rounded-xl border border-slate-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 hover:border-blue-300"
        >
          <option value="">All Classes</option>

          {classes.map((c) => (
            <option key={c._id} value={c._id}>
              {c.className}
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
          <option value="">All Sessions</option>

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
          <option value="">All Terms</option>

          {termOptions.map((t, i) => (
            <option key={i} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* TYPE */}
        <select
          value={form.type}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              type: e.target.value,
            }))
          }
          className="w-full p-3 rounded-xl border border-slate-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 hover:border-blue-300"
        >
          <option value="">Select Type</option>

          <option value="CA">CA</option>
          <option value="EXAM">EXAM</option>
        </select>

      </div>

      {/* RESULTS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

        {loading ? (

          <div className="col-span-full bg-white p-10 rounded-2xl shadow text-center text-gray-800">
            Loading results...
          </div>

        ) : filtered.length === 0 ? (

          <div className="col-span-full bg-white p-10 rounded-2xl shadow text-center text-gray-500">
            No results found
          </div>

        ) : (

          filtered.map((r) => (

            <div
              key={r._id}
              className="bg-white p-5 rounded-2xl shadow-md border border-slate-100 hover:shadow-lg transition"
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

              {/* SESSION + TERM */}
              <div className="flex justify-between items-center text-sm mb-3">

                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg">
                  {r.session}
                </span>

                <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-lg">
                  {r.term}
                </span>

              </div>

              {/* CLASS */}
              <p className="text-sm text-gray-500 mb-2">
                Class:
                <span className="font-medium">
                  {" "}
                  {r.class?.className}
                </span>
              </p>

              {/* TYPE */}
              <p className="text-sm text-gray-500 mb-3">
                Type:
                <span className="font-semibold text-blue-600">
                  {" "}
                  {r.type}
                </span>
              </p>

              {/* SCORE */}
              <div className="bg-slate-50 p-3 rounded-xl text-center mb-3">

                <p className="text-xs text-gray-500">
                  Total Score
                </p>

                <p className="text-2xl font-bold text-[#0a1f44]">
                  {r.totalObtained} / {r.totalObtainable}
                </p>

              </div>

              {/* POSITION */}
              <div className="flex justify-between items-center mb-4">

                <div>
                  <p className="text-xs text-gray-500">
                    Position
                  </p>

                  <p className="font-bold text-purple-600">
                    {r.position || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Percentage
                  </p>

                  <p className="font-bold text-green-600">
                    {r.percentage}%
                  </p>
                </div>

              </div>

              {/* BUTTON */}
              <button
                onClick={() =>
                  window.open(
                    `/admin/results/view/${r._id}?session=${r.session}&term=${r.term}&type=${r.type}`,
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