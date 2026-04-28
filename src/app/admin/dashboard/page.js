"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentSession, setCurrentSession] = useState("Loading...");
  const [currentTerm, setCurrentTerm] = useState("Loading...");

  const [stats, setStats] = useState({
    admins: 0,
    students: 0,
    teachers: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const adminData = localStorage.getItem("admin");

    if (!token) {
      router.push("/");
      return;
    }

    if (adminData) {
      try {
        const parsed = JSON.parse(adminData);
        setAdmin(parsed);
      } catch {
        localStorage.removeItem("admin");
      }
    }

    fetch("/api/admin/session-term/current")
      .then((res) => res.json())
      .then((data) => {
        setCurrentSession(data.session || "Not Active");
        setCurrentTerm(data.term || "Not Active");
      })
      .catch(() => {
        setCurrentSession("Not Active");
        setCurrentTerm("Not Active");
      });

    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats({
          admins: data.admins || 0,
          students: data.students || 0,
          teachers: data.teachers || 0,
        });
      })
      .catch(() => {
        setStats({ admins: 0, students: 0, teachers: 0 });
      });

    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
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

      {/* HEADER */}
      <header className="bg-[#0a1f44] text-white p-4 flex justify-between items-center shadow-md rounded-xl">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">
            Welcome to Admin Dashboard
          </h1>

          {admin && (
            <p className="text-sm mt-1">
              {admin.title} {admin.firstName} {admin.lastName}
            </p>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white cursor-pointer font-semibold transition"
        >
          Logout ({admin?.firstName})
        </button>
      </header>

      <div className="p-6 space-y-6">

  {/* ROW 1: ADMIN + SESSION INFO */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

    {/* Admin Card */}
    <div className="bg-white p-4 rounded-lg shadow border border-gray-300">
      <p className="text-gray-700 text-sm">Logged-in Admin</p>
      <p className="text-xl font-bold text-gray-900">
        {admin?.firstName} {admin?.lastName}
      </p>
      <p className="text-sm text-gray-700">
        Role: {admin?.role || "Admin"}
      </p>
    </div>

    {/* Session Card */}
    <div className="bg-white p-4 rounded-lg shadow border border-gray-300">
      <p className="text-gray-700 text-sm">Academic Session</p>
      <p className="text-xl font-bold text-gray-900">
        {currentSession}
      </p>
      <p className="text-gray-700 text-sm mt-1">
        Current Term: {currentTerm}
      </p>
    </div>

    {/* System Status */}
    <div className="bg-white p-4 rounded-lg shadow border border-gray-300">
      <p className="text-gray-700 text-sm">System Status</p>
      <p className="text-green-600 font-semibold mt-2">
        ● All Systems Operational
      </p>
    </div>

  </div>

  {/* ADMIN DETAILS */}
  <div className="bg-white p-4 rounded-lg shadow border border-gray-300">
    <h2 className="text-lg font-bold mb-2 text-gray-900">
      Admin Details
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">

      <p>
        <span className="font-semibold">Full Name:</span>{" "}
        {admin?.title} {admin?.firstName} {admin?.otherName} {admin?.lastName}
      </p>

      <p>
        <span className="font-semibold">Role:</span>{" "}
        {admin?.role || "admin"}
      </p>

      <p>
        <span className="font-semibold">Admin ID:</span>{" "}
        {admin?.adminId || "Not Available"}
      </p>

    </div>
  </div>

  {/* STATS */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

    <div className="bg-white p-4 rounded-lg shadow border border-gray-300 hover:shadow-md transition">
      <p className="text-gray-700 text-sm">Admins</p>
      <p className="text-2xl font-bold text-gray-900">{stats.admins}</p>
    </div>

    <div className="bg-white p-4 rounded-lg shadow border border-gray-300 hover:shadow-md transition">
      <p className="text-gray-700 text-sm">Students</p>
      <p className="text-2xl font-bold text-gray-900">{stats.students}</p>
    </div>

    <div className="bg-white p-4 rounded-lg shadow border border-gray-300 hover:shadow-md transition">
      <p className="text-gray-700 text-sm">Teachers</p>
      <p className="text-2xl font-bold text-gray-900">{stats.teachers}</p>
    </div>

  </div>

</div>
    </div>
  );
}