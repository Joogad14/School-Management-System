"use client";

import { useEffect, useState } from "react";

export default function StudentResultsPage() {
  const [results, setResults] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [sessionTerms, setSessionTerms] = useState([]);
  const [classes, setClasses] = useState([]);

  const [selectedSessionTerm, setSelectedSessionTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

  // ================= LOAD RESULTS =================
  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/student/results");
      const data = await res.json();

      if (res.ok) {
        setResults(data.results);

        const uniqueSessionTerms = [
          ...new Set(
            data.results.map((r) => `${r.session}|${r.term}`)
          ),
        ];

        setSessionTerms(uniqueSessionTerms);

        const uniqueClasses = [
          ...new Map(
            data.results.map((r) => [
              r.class?._id,
              r.class,
            ])
          ).values(),
        ];

        setClasses(uniqueClasses);
      }
    };

    load();
  }, []);

  // ================= FILTER =================
  useEffect(() => {
    if (!selectedSessionTerm || !selectedClass) return;

    const [session, term] = selectedSessionTerm.split("|");

    const filteredData = results.filter(
      (r) =>
        r.session === session &&
        r.term === term &&
        r.class?._id === selectedClass
    );

    setFiltered(filteredData);
  }, [selectedSessionTerm, selectedClass, results]);

  return (
    <div className="p-6 space-y-6 bg-slate-100 min-h-screen">

      {/* HEADER */}
      <div className="text-white p-5 rounded-2xl shadow-lg bg-[#0a1f44]">
        <h1 className="text-2xl font-bold">My Results</h1>
        <p className="text-sm opacity-80">
          View your academic performance
        </p>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-5 rounded-2xl shadow-md grid md:grid-cols-2 gap-4">

        {/* SESSION */}
        <select
          onChange={(e) => setSelectedSessionTerm(e.target.value)}
          className="w-full p-3 rounded-xl border border-slate-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 hover:border-blue-300"
        >
          <option>Select Session & Term</option>
          {sessionTerms.map((s, i) => {
            const [session, term] = s.split("|");
            return (
              <option key={i} value={s}>
                {session} - {term}
              </option>
            );
          })}
        </select>

        {/* CLASS */}
        <select
          onChange={(e) => setSelectedClass(e.target.value)}
          className="w-full p-3 rounded-xl border border-slate-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 hover:border-blue-300"
        >
          <option>Select Class</option>
          {classes.map((c) => (
            <option key={c._id} value={c._id}>
              {c.className}
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
                    `/student/results/view/${r._id}?session=${r.session}&term=${r.term}&type=${r.type}`,
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