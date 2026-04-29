"use client";

import { useEffect, useState } from "react";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

export default function SubjectPage() {
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: "",
  });

  const [form, setForm] = useState({
    subjectCode: "",
    subjectName: "",
    classId: "",
    teachers: [],
  });

  // ================= TOAST =================
  const showToast = (type, message) => {
    setToast({ show: true, type, message });

    setTimeout(() => {
      setToast({ show: false, type: "", message: "" });
    }, 3000);
  };

  // ================= FETCH =================
  const fetchSubjects = async () => {
    const res = await fetch("/api/admin/subjects");
    const data = await res.json();
    setSubjects(Array.isArray(data) ? data : []);
  };

  const fetchClasses = async () => {
    const res = await fetch("/api/admin/classes");
    const data = await res.json();
    setClasses(Array.isArray(data) ? data : []);
  };

  const fetchStaff = async () => {
    const res = await fetch("/api/admin/staff");
    const data = await res.json();
    setStaffList(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchSubjects();
    fetchClasses();
    fetchStaff();
  }, []);

  // ================= INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ================= CHECKBOX =================
  const toggleStaff = (id) => {
    setForm((prev) => {
      const exists = prev.teachers.includes(id);

      return {
        ...prev,
        teachers: exists
          ? prev.teachers.filter((t) => t !== id)
          : [...prev.teachers, id],
      };
    });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.subjectCode || !form.subjectName || !form.classId) {
      return showToast("error", "Fill all required fields");
    }

    setLoading(true);

    try {
      const url = editId
        ? `/api/admin/subjects/${editId}`
        : "/api/admin/subjects";

      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        return showToast("error", data.message || "Failed");
      }

      showToast("success", data.message);

      setForm({
        subjectCode: "",
        subjectName: "",
        classId: "",
        teachers: [],
      });

      setEditId(null);
      fetchSubjects();

    } catch (err) {
      showToast("error", "Server error");
    }

    setLoading(false);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    const res = await fetch(`/api/admin/subjects/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (res.ok) {
      showToast("success", data.message);
      fetchSubjects();
    } else {
      showToast("error", data.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 space-y-6">

      {/* TOAST */}
      {toast.show && (
        <div
            className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-white transition-all duration-300 ${
                toast.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
            >
          {toast.message}
        </div>
      )}

      {/* HEADER */}
      <div className="bg-[#0a1f44] text-white p-5 rounded-2xl">
        <h1 className="text-xl font-bold">Subject Management</h1>
        <p className="text-sm">Create subjects, assign class and teachers</p>
      </div>

      {/* FORM */}
      <div className="bg-white p-6 rounded-2xl space-y-3">

        <input
          name="subjectCode"
          placeholder="Subject Code (e.g MTH)"
          value={form.subjectCode}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 placeholder:text-slate-500 outline-none hover:border-cyan-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200 transition"
        />

        <input
          name="subjectName"
          placeholder="Subject Name"
          value={form.subjectName}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 placeholder:text-slate-500 outline-none hover:border-cyan-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200 transition"
        />

        {/* CLASS SELECT */}
        <select
          name="classId"
          value={form.classId}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border border-slate-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 hover:border-blue-300"
        >
          <option value="">Select Class</option>
          {classes.map((c) => (
            <option key={c._id} value={c._id}>
              {c.className}
            </option>
          ))}
        </select>

        {/* TEACHERS CHECKBOX */}
        <div className="border border-gray-400 p-3 rounded-lg max-h-48 overflow-y-auto bg-white">
          {staffList.map((s) => (
            <label key={s._id} className="flex items-center gap-2 p-1 cursor-pointer">
              <input
                type="checkbox" 
                className="border cursor-pointer rounded-lg max-h-48 overflow-y-auto border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-blue-300 transition"
                checked={form.teachers.includes(s._id)}
                onChange={() => toggleStaff(s._id)}
              />

              {/* ✅ FORMAT YOU REQUESTED */}
              <span className="text-gray-700">
                {s.staffId} - {s.title} {s.lastName}
              </span>
            </label>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-3 bg-[#0a1f44] text-white rounded-xl cursor-pointer"
        >
          {loading ? "Saving..." : editId ? "Update Subject" : "Create Subject"}
        </button>
      </div>

        <div className="bg-white p-4 rounded-xl shadow mb-4">
          <input
            type="text"
            placeholder="Search subject code, name or class..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 hover:border-blue-300"
          />
        </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-200">
            <tr> 
            <th className="p-3 text-gray-800">S/N</th>
              <th className= "p-3 text-gray-800">Code</th>
              <th className="p-3 text-gray-800">Subject</th>
              <th className="p-3 text-gray-800">Class</th>
              <th className="p-3 text-gray-800">Teachers</th>
              <th className="p-3 text-gray-800">Action</th>
            </tr>
          </thead>

          <tbody>
            {subjects
            .filter((s) => {
              const keyword = search.toLowerCase();

              return (
                s.subjectCode?.toLowerCase().includes(keyword) ||
                s.subjectName?.toLowerCase().includes(keyword) ||
                s.class?.className?.toLowerCase().includes(keyword)
              );
            })
            .map((s, i) => (
              <tr key={s._id} className="border-ttext-gray-800">
                
                <td className="p-3 text-gray-800">{i + 1}</td>
                <td className="p-3 text-blue-600">{s.subjectCode}</td>
                <td className="p-3 text-gray-800">{s.subjectName}</td>

                <td className="p-3 text-gray-800">
                  {s.class?.className || "-"}
                </td>

                <td className="p-3  text-gray-800">
                  {s.teachers?.length > 0
                    ? s.teachers.map((t) => (
                        <div key={t._id}>
                          {t.staffId} - {t.title} {t.lastName}
                        </div>
                      ))
                    : "-"}
                </td>

                <td className="p-3 flex gap-3">
                  <button
                    className="text-blue-600 cursor-pointer"
                    onClick={() => {
                      setEditId(s._id);
                      setForm({
                        subjectCode: s.subjectCode,
                        subjectName: s.subjectName,
                        classId: s.class?._id,
                        teachers: s.teachers.map((t) => t._id),
                      });
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="text-red-600 cursor-pointer"
                    onClick={() => setConfirmDelete(s._id)}
                    >
                    Delete
                    </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

            <ConfirmDeleteModal
                    confirmDelete={confirmDelete}
                    setConfirmDelete={setConfirmDelete}
                    handleDelete={handleDelete}
                  />
    </div>
  );
}