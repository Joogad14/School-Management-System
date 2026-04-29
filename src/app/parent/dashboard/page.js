"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ParentDashboard() {
  const router = useRouter();

  const [parent, setParent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [students, setStudents] = useState([]);

  const [currentSession, setCurrentSession] = useState("Loading...");
  const [currentTerm, setCurrentTerm] = useState("Loading...");

  // ================= INIT =================
  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/");
          return;
        }

        const res = await fetch("/api/parent/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          localStorage.removeItem("token");
          router.push("/");
          return;
        }

        setParent(data.parent);
        setStudents(data.students || []);

        const sessionRes = await fetch("/api/admin/session-term/current");
        const sessionData = await sessionRes.json();

        setCurrentSession(sessionData.session || "Not Active");
        setCurrentTerm(sessionData.term || "Not Active");

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER (same as student) */}
      <header className="bg-[#0a1f44] text-white p-4 flex justify-between items-center shadow-md rounded-xl">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">
            Welcome to Parent Dashboard
          </h1>

          <p className="text-sm mt-1">
            {parent?.title} {parent?.firstName} {parent?.lastName}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 cursor-pointer rounded-lg font-semibold transition"
        >
          Logout ({parent?.title} {parent?.lastName})
        </button>
      </header>

      <div className="p-6 space-y-6">

        {/* TOP CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* PARENT INFO */}
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Parent</p> 
            <p className="text-xl font-bold text-[#0a1f44]">
              {parent?.firstName} {parent?.lastName}
            </p>
            <p className="text-sm text-gray-600">
              Parent ID: {parent?.parentId}
            </p>
          </div>

          {/* WARDS COUNT */}
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Total Wards</p>
            <p className="text-3xl font-bold text-[#0a1f44]">
              {students.length}
            </p>
            <p className="text-sm text-gray-600">
              Registered children
            </p>
          </div>

          {/* SESSION */}
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Academic Session</p>
            <p className="text-xl font-bold text-[#0a1f44]">
              {currentSession}
            </p>
            <p className="text-sm text-gray-600">
              Term: {currentTerm}
            </p>
          </div>

        </div>

        {/* DETAILS (same as student style) */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-3 text-gray-700">Parent Details</h2>

          <div className="grid md:grid-cols-2 gap-3 text-sm">

            <p className="text-[#0a1f44]"><b>Email:</b> {parent?.email || "N/A"}</p>
            <p className="text-[#0a1f44]"><b>Phone:</b> {parent?.phone || "N/A"}</p>
            <p className="text-[#0a1f44]"><b>Address:</b> {parent?.address || "N/A"}</p>
            <p className="text-[#0a1f44]"><b>Parent ID:</b> {parent?.parentId}</p>

          </div>
        </div>

        {/* BOTTOM CARDS (WARDS) */}
        <div className="bg-white p-5 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Wards</p>

          <div className="mt-2 text-sm text-gray-700">

            {students.length > 0 ? (
            students.map((s, i) => (
                <p key={i} className="mb-1">
                • <span className="font-bold text-[#0a1f44]">
                    {s.firstName} {s.lastName}
                </span>
                <span className="text-gray-500 ml-2">
                    ({s.studentId})
                </span>
                </p>
            ))
            ) : (
            <p>No wards assigned</p>
            )}

          </div>
        </div>

        {/* NOTE */}
        <p className="text-sm text-center text-gray-500 mt-6">
          For any issue concerning your wards, results, or fees, contact admin.
        </p>

      </div>
    </div>
  );
}