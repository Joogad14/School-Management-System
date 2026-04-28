"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TeacherDashboard() {
  const router = useRouter();

  const [staff, setStaff] = useState(null);
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

        // ================= STAFF FETCH (FIXED + SAFE) =================
        const staffRes = await fetch("/api/staff/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const staffData = await staffRes.json();

        if (!staffRes.ok) {
          console.log("Staff fetch failed:", staffData.message);
          localStorage.removeItem("token");
          router.push("/");
          return;
        }

        setStaff(staffData.staff);

        // ================= SESSION / TERM =================
        const res = await fetch("/api/admin/session-term/current");
        const data = await res.json();

        setCurrentSession(data.session || "Not Active");
        setCurrentTerm(data.term || "Not Active");

      } catch (error) {
        console.log("Dashboard error:", error);
        setStaff(null);
        setCurrentSession("Not Active");
        setCurrentTerm("Not Active");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("staff");
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
            Welcome to Teacher Dashboard
          </h1>

          <p className="text-sm mt-1">
            {staff?.title} {staff?.firstName} {staff?.lastName}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 cursor-pointer py-2 rounded-lg text-white font-semibold transition"
        >
          Logout ({staff?.firstName})
        </button>
      </header>

      {/* BODY */}
      <div className="p-6 space-y-6">

        {/* ROW 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Logged-in Teacher</p>
            <p className="text-xl font-bold">
              {staff?.firstName} {staff?.lastName}
            </p>
            <p className="text-sm text-gray-600">
              Role: {staff?.role || "Teacher"}
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Academic Session</p>
            <p className="text-xl font-bold">{currentSession}</p>
            <p className="text-gray-600 text-sm mt-1">
              Current Term: {currentTerm}
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">System Status</p>
            <p className="text-green-600 font-semibold mt-2">
              ● Active
            </p>
          </div>

        </div>

        {/* TEACHER DETAILS */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-2">Teacher Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">

            <p>
              <b>Full Name:</b>{" "}
              {staff?.title} {staff?.firstName} {staff?.otherName} {staff?.lastName}
            </p>

            <p><b>Role:</b> {staff?.role}</p>
            <p><b>Email:</b> {staff?.email}</p>
            <p><b>Phone:</b> {staff?.phone}</p>

          </div>
        </div>

        {/* ASSIGNMENTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* CLASSES */}
          <div className="bg-white p-5 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Assigned Classes</p>

            <p className="text-3xl font-bold text-[#0a1f44]">
              {staff?.classAssigned?.length || 0}
            </p>

            <div className="mt-2 text-sm text-gray-600">
              {(staff?.classAssigned || []).map((c, i) => (
                <span key={i} className="block">• {c}</span>
              ))}
            </div>
          </div>

          {/* SUBJECTS */}
          <div className="bg-white p-5 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Assigned Subjects</p>

            <p className="text-3xl font-bold text-[#0a1f44]">
              {staff?.subject?.length || 0}
            </p>

            <div className="mt-2 text-sm text-gray-600">
              {(staff?.subject || []).map((s, i) => (
                <span key={i} className="block">• {s}</span>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}