"use client";

import { useEffect, useState } from "react";
import { User, GraduationCap, Users } from "lucide-react";

export default function WardsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH STUDENTS =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("/api/parent/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        setStudents(data.students || []);
      } catch (err) {
        console.log("Error fetching wards:", err);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="bg-[#0a1f44] text-white p-5 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold">My Wards</h1>
        <p className="text-sm opacity-80">
          View all your registered children
        </p>
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-gray-500">Loading wards...</p>
      )}

      {/* EMPTY STATE */}
      {!loading && students.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          No wards found
        </div>
      )}

      {/* STUDENT CARDS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

  {students.map((s) => (
    <div
      key={s._id}
      className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 
      rounded-2xl shadow-sm hover:shadow-lg transition duration-300 p-5"
    >

      {/* NAME */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-9 bg-[#0a1f44] text-white flex items-center justify-center rounded-full text-sm font-bold">
          {s.firstName?.charAt(0)}{s.lastName?.charAt(0)}
        </div>

        <h2 className="font-bold text-lg text-[#0a1f44]">
          {s.firstName} {s.lastName}
        </h2>
      </div>

      {/* STUDENT ID */}
      <p className="text-sm text-gray-600 mb-2">
        <span className="font-medium">Student ID:</span> {s.studentId}
      </p>

      {/* CLASS */}
      <div className="flex items-center gap-2 mb-3">
        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
          Class
        </span>

        <p className="text-sm font-medium text-gray-700">
          {s.currentClass?.className || "Not assigned"}
        </p>
      </div>

      {/* TEACHERS */}
      <div className="mt-3">
        <p className="text-xs text-gray-500 mb-1">Teacher(s)</p>

        <div className="flex flex-wrap gap-2">
          {s.currentClass?.teachers?.length > 0 ? (
            s.currentClass.teachers.map((t, i) => (
              <span
                key={i}
                className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs"
              >
                {t.title} {t.firstName} {t.lastName}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-xs">
              No teachers assigned
            </span>
          )}
        </div>
      </div>

    </div>
  ))}
</div>

    </div>
  );
}