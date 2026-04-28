"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

export default function AdminsPage() {
  const [adminList, setAdminList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [confirmDelete, setConfirmDelete] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    firstName: "",
    otherName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    isActive: true,
  });

  const [toast, setToast] = useState({
  show: false,
  type: "",
  message: "",
});

const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

const showToast = (type, message) => {
  setToast({
    show: true,
    type,
    message,
  });

  setTimeout(() => {
    setToast({
      show: false,
      type: "",
      message: "",
    });
  }, 3000);
};

  
  // =========================
  // INPUT
  // =========================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // =========================
  // RESET
  // =========================
  const resetForm = () => {
    setForm({
      title: "",
      firstName: "",
      otherName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      isActive: true,
    });

    setEditMode(false);
    setEditId(null);
  };

  // =========================
  // EDIT
  // =========================
  const handleEdit = (admin) => {
    setEditMode(true);
    setEditId(admin._id);

    setForm({
      title: admin.title || "",
      firstName: admin.firstName || "",
      otherName: admin.otherName || "",
      lastName: admin.lastName || "",
      email: admin.email || "",
      password: "",
      confirmPassword: "",
      isActive: admin.isActive ?? true,
    });
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id) => {
  try {
    const res = await fetch(`/api/admin/admins/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (res.ok) {
      showToast("success", "Admin deleted successfully");
      setAdminList((prev) => prev.filter((a) => a._id !== id));
    } else {
      showToast("error", data.message || "Delete failed");
    }
  } catch (err) {
    showToast("error", err.message || "Network error");
  }
};


  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.firstName || !form.lastName || !form.email) {
    showToast("error", "Please fill all required fields");
    return;
  }

  if (!editMode && form.password !== form.confirmPassword) {
  showToast("error", "Passwords do not match");
  return;
}

  const url = editMode
    ? `/api/admin/admins/${editId}`
    : "/api/admin/admins";

  const method = editMode ? "PUT" : "POST";

  // 🔥 REMOVE confirmPassword BEFORE sending
  const payload = {
    title: form.title,
    firstName: form.firstName,
    otherName: form.otherName,
    lastName: form.lastName,
    email: form.email,
    password: form.password ? form.password : undefined,
    isActive: form.isActive,
  };

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      showToast("success", data.message || "Success");
      resetForm();
      fetchAdmins();
    } else {
      showToast("error", data.message || "Request failed");
    }
  } catch (err) {
    showToast("error", err.message || "Network error");
  }
};


const fetchAdmins = async () => {
  setLoading(true);

  try {
    const res = await fetch("/api/admin/admins", {
      cache: "no-store",
    });

    const data = await res.json();

    if (res.ok) {
      setAdminList(Array.isArray(data) ? data : []);
    } else {
      showToast("error", data.message || "Failed to fetch admins");
    }
  } catch (err) {
    showToast("error", err.message || "Network error");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchAdmins();
}, []);

if (loading) {
  return (
    <div className="p-6 text-center text-gray-600">
      Loading admins...
    </div>
  );
}
if (!mounted) return null;

return (
    <>
    

    {/* TOAST (GLOBAL OVERLAY) */}
    {toast.show && (
      <div
        className={`fixed top-4 right-4 px-4 py-3 rounded-xl text-white shadow-lg z-50 ${
          toast.type === "success" ? "bg-green-600" : "bg-red-600"
        }`}
      >
        {toast.message}
      </div>
    )}

    <div className="min-h-screen bg-slate-100 p-6 space-y-6">

      {/* HEADER */}
      <div className="text-white p-5 rounded-2xl shadow-lg bg-[#0a1f44]">
        <h1 className="text-xl md:text-2xl font-bold">Admin Management Board</h1>
        <p className="text-sm opacity-90">Create and manage system admins</p>
      </div>

      {/* FORM */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-3">

          <select name="title" value={form.title} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 hover:border-blue-300">
            <option value="">Title</option>
            <option>Mr</option>
            <option>Mrs</option>
            <option>Miss</option>
            <option>Dr</option>
            <option>Prof</option>
          </select>

          <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} className="input border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-blue-300 transition"/>
          <input name="otherName" placeholder="Other Name" value={form.otherName} onChange={handleChange} className="input border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-blue-300 transition"/>
          <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} className="input border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-blue-300 transition"/>
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="input border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-blue-300 transition"/>

          {/* PASSWORD */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="input border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-blue-300 transition"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 cursor-pointer hover:text-cyan-600">
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {/* CONFIRM PASSWORD (FIXED — TOGGLE ADDED) */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              className="input border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-blue-300 transition"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 cursor-pointer hover:text-cyan-600">
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          <button className="w-full md:w-auto px-6 py-3 cursor-pointer rounded-xl bg-[#0a1f44] text-white font-semibold cursor-pointer hover:bg-[#102a5c] transition">
            {editMode ? "Update Admin" : "Create Admin"}
          </button>

          {editMode && (
            <button type="button" onClick={resetForm} className="btn-cancel cursor-pointer">
              Cancel
            </button>
          )}
        </form>
       </div>

       {/* SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl shadow-lg">
        <input
          type="text"
          placeholder="Search admin by name, email or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded-xl border border-slate-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 hover:border-blue-300"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-200">
            <tr>
              <th className="p-3">S/N</th>
              <th className="p-3">Admin ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Active</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {adminList
          .filter((a) => {
            const term = search.toLowerCase();

            return (
              a.firstName?.toLowerCase().includes(term) ||
              a.lastName?.toLowerCase().includes(term) ||
              a.email?.toLowerCase().includes(term) ||
              a.adminId?.toLowerCase().includes(term)
            );
          })
          .map((a, i) => (
              <tr key={a._id} className="border-t">
                <td className="p-3">{i + 1}</td>

                {/*  ADMIN ID FIXED */}
                <td className="p-3 text-blue-600 font-semibold">
                  {a.adminId}
                </td>

                <td className="p-3">
                  {a.title} {a.firstName} {a.lastName}
                </td>

                <td className="p-3">{a.email}</td>

                <td className="p-3">{a.isActive ? "Yes" : "No"}</td>

                <td className="p-3 flex gap-2">
                  <button onClick={() => handleEdit(a)} className="text-blue-600 cursor-pointer">Edit</button>

                  <button onClick={() => setConfirmDelete(a._id)} className="text-red-600 cursor-pointer">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <ConfirmDeleteModal
        confirmDelete={confirmDelete}
        setConfirmDelete={setConfirmDelete}
        handleDelete={handleDelete}
       />
     </div>

  </>
 );
}