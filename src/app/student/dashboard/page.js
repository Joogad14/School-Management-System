"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function StudentDashboard() {
  const router = useRouter();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

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

        const res = await fetch("/api/student/me", {
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

        setStudent(data.student);

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
    localStorage.removeItem("student");
    router.push("/");
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <header className="bg-[#0a1f44] text-white p-4 flex justify-between items-center shadow-md rounded-xl">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">
            Welcome to Student Dashboard
          </h1>

          <p className="text-sm mt-1">
            {student?.firstName} {student?.lastName}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 cursor-pointer rounded-lg font-semibold transition"
        >
          Logout ({student?.firstName})
        </button>
      </header>

      {/* BODY */}
      <div className="p-6 space-y-6">

        {/* TOP CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Student</p>
            <p className="text-xl font-bold text-[#0a1f44]">
              {student?.firstName} {student?.otherName} {student?.lastName}
            </p>
            <p className="text-sm text-gray-600">
              Student ID: {student?.studentId}
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Academic Session</p>
            <p className="text-xl font-bold text-[#0a1f44]">
              {currentSession}
            </p>
            <p className="text-sm text-gray-600">
              Term: {currentTerm}
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Status</p>
            <p className="text-green-600 font-bold">● Active</p>
          </div>

        </div>

        {/* DETAILS */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-3">Student Details</h2>

          <div className="grid md:grid-cols-2 gap-3 text-sm">

            <p><b>Email:</b> {student?.email || "N/A"}</p>
            <p><b>Phone:</b> {student?.phone || "N/A"}</p>
            <p><b>Address:</b> {student?.address || "N/A"}</p>
            <p><b>Class:</b> {student?.currentClass || "Not assigned"}</p>

          </div>
        </div>

        {/* BOTTOM CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* CLASS TEACHERS */}
          <div className="bg-white p-5 rounded-lg shadow">
        <p className="text-gray-500 text-sm">Class Teacher(s)</p>

        <div className="mt-2 text-sm text-gray-700">
            {(student?.teacherAssigned || []).length > 0 ? (
            student.teacherAssigned.map((t, i) => (
                <p key={i} className="mb-1">
                    • <span className="font-bold text-[#0a1f44]">{t.name}</span>
                </p>
            ))
            ) : (
            <p>No teacher assigned</p>
            )}
        </div>
        </div>

          {/* PARENT */}
          <div className="bg-white p-5 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Parent</p>
            <p className="text-xl font-bold text-[#0a1f44]">
              {student?.parentName || "Not assigned"}
            </p>
          </div>

        </div>

        {/* NOTE */}
        <p className="text-sm text-center text-gray-500 mt-6">
          For any issue concerning your subjects, results, or profile, contact admin.
        </p>

      </div>
    </div>
  );
}