"use client";

import { useEffect, useState } from "react";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

export default function ClassPage() {
  const [classList, setClassList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: "",
  });

  const [editId, setEditId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // ✅ added

  const [form, setForm] = useState({
    className: "",
    teachers: [],
  });

  // =========================
  // TOAST
  // =========================
  const showToast = (type, message) => {
    setToast({ show: true, type, message });

    setTimeout(() => {
      setToast({ show: false, type: "", message: "" });
    }, 3000);
  };

  // =========================
  // FETCH DATA
  // =========================
const fetchClasses = async () => {
  try {
    const res = await fetch("/api/admin/classes");
    const data = await res.json();

    console.log("API RESPONSE:", data);

    if (res.ok) {
      setClassList(data); 
    } else {
      setClassList([]);
      showToast("error", data.message);
    }
  } catch (err) {
    setClassList([]);
    showToast("error", "Failed to load classes");
  }
};

  const fetchStaff = async () => {
    const res = await fetch("/api/admin/staff");
    const data = await res.json();

    if (res.ok) setStaffList(data);
  };

  useEffect(() => {
    fetchClasses();
    fetchStaff();
  }, []);

  // =========================
  // INPUT
  // =========================
  const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "teachers") {
    const selected = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );

    setForm((prev) => ({
      ...prev,
      teachers: selected,
    }));
  } else {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};

  // =========================
  // EDIT  FIXED 
  // =========================
  const handleEdit = (c) => {
    setForm({
        className: c.className,
        teachers: c.teachers.map((t) => t._id),
    });

    setEditId(c._id); // ✅ THIS WAS MISSING

    window.scrollTo({ top: 0, behavior: "smooth" });
    };

  // =========================
  // DELETE ✅ FIXED (was missing)
  // =========================
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/admin/classes/${id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (res.ok) {
        showToast("success", "Class deleted");
        fetchClasses();
      } else {
        showToast("error", result.message);
      }
    } catch {
      showToast("error", "Server error");
    }
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.className) {
    showToast("error", "Class name is required");
    return;
  }

  setLoading(true);

  const data = new FormData();
  data.append("className", form.className);

  form.teachers.forEach((t) => {
    data.append("teachers", t);
  });

  try {
    // ✅ THIS IS WHERE IT GOES
    const url = editId
      ? `/api/admin/classes/${editId}`
      : "/api/admin/classes";

    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      body: data,
    });

    const result = await res.json();

    // ✅ SUCCESS BLOCK (PUT YOUR SECOND CODE HERE)
    if (res.ok) {
      showToast("success", result.message);

      setForm({ className: "", teachers: [] });
      setEditId(null); // ✅ VERY IMPORTANT

      fetchClasses();
    } else {
      showToast("error", result.message);
    }
  } catch {
    showToast("error", "Server error");
  }

  setLoading(false);
};

  const filteredClasses = classList.filter((c) => {
  const searchText = search.toLowerCase();

  return (
    c.className?.toLowerCase().includes(searchText) ||

    c.teachers?.some((t) =>
      `${t.title} ${t.lastName}`.toLowerCase().includes(searchText)
    ) ||

    c.teachers?.some((t) =>
      t.staffId?.toLowerCase().includes(searchText)
    )
  );
});

  return (
    <div className="min-h-screen bg-slate-100 p-6 space-y-6">

      {/* TOAST */}
      {toast.show && (
        <div className={`fixed top-4 right-4 px-4 py-3 rounded-xl text-white ${
          toast.type === "success" ? "bg-green-600" : "bg-red-600"
        }`}>
          {toast.message}
        </div>
      )}

      {/* HEADER */}
      <div className="text-white p-5 rounded-2xl bg-[#0a1f44]">
        <h1 className="text-xl font-bold">Class Management Board</h1>
        <p className="text-sm">Create and assign teachers to classes</p>
      </div>

      {/* FORM */}
      <div className="bg-white p-6 rounded-2xl">
        <form onSubmit={handleSubmit} className="space-y-3">

          <input
            name="className"
            placeholder="Class Name"
            value={form.className}
            onChange={handleChange}
            className="input border border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-blue-300 transition"
          />

          <div className="border p-3 cursor-pointer rounded-lg max-h-48 overflow-y-auto border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-blue-300 transition">
            {staffList.map((s) => (
                <label key={s._id} className="flex items-center gap-2 p-1 cursor-pointer">
                <input
                    type="checkbox"
                    className="border cursor-pointer rounded-lg max-h-48 overflow-y-auto border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-blue-300 transition"
                    checked={form.teachers.includes(s._id)}
                    onChange={() => {
                    setForm((prev) => {
                        const exists = prev.teachers.includes(s._id);

                        return {
                        ...prev,
                        teachers: exists
                            ? prev.teachers.filter((id) => id !== s._id)
                            : [...prev.teachers, s._id],
                        };
                    });
                    }}
                />

                {s.staffId} - {s.title} {s.lastName}
                </label>
            ))}
            </div>

          {/*  SELECTED TEACHERS (SMALL UI BOOST) */}
          <div className="flex flex-wrap gap-2 cursor-pointer">
            {form.teachers.map((id) => {
              const staff = staffList.find((s) => s._id === id);
              return (
                <span key={id} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                  {staff?.title} {staff?.firstName}
                </span>
              );
            })}
          </div>

          <button className="w-full md:w-auto px-6 py-3 cursor-pointer rounded-xl bg-[#0a1f44] text-white font-semibold cursor-pointer hover:bg-[#102a5c] transition">
            {loading
            ? "Processing..."
            : editId
            ? "Update Class"
            : "Create Class"}
          </button>
        </form>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <input
          type="text"
          placeholder="Search by class, teacher, or staff ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded-xl border border-slate-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 hover:border-blue-300"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-200">
            <tr>
              <th className="p-3">S/N</th>
              <th className="p-3">Class</th>
              <th className="p-3">Teacher(s)</th>
              <th className="p-3">Staff ID(s)</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredClasses.map((c, i) => (
              <tr key={c._id} className="border-t hover:bg-blue-50">

                <td className="p-3">{i + 1}</td>

                <td className="p-3">{c.className}</td>

                <td className="p-3">
                  {c.teachers.length > 0
                    ? c.teachers.map((t) => `${t.title} ${t.lastName}`).join(", ")
                    : "-"}
                </td>

                <td className="p-3 text-blue-600 font-semibold">
                  {c.teachers.length > 0
                    ? c.teachers.map((t) => t.staffId).join(", ")
                    : "-"}
                </td>

                <td className="p-3 flex gap-2 ">
                  <button
                    onClick={() => handleEdit(c)}
                    className="text-blue-600 cursor-pointer"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => setConfirmDelete(c._id)}
                    className="text-red-600 cursor-pointer"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DELETE CONFIRMATION */}
      <ConfirmDeleteModal
        confirmDelete={confirmDelete}
        setConfirmDelete={setConfirmDelete}
        handleDelete={handleDelete}
        />
    </div>
  );
}