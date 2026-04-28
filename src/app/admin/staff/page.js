"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

export default function StaffPage() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: "",
  });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
    const [confirmDelete, setConfirmDelete] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    title: "",
    firstName: "",
    otherName: "",
    lastName: "",
    email: "",
    phone: "", 
    role: "",
    subject: [],
    classAssigned: [],
    address: "",
    password: "",
    confirmPassword: "",
    image: null,
    });

  // =========================
  // TOAST
  // =========================
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
  // FETCH STAFF
  // =========================
  const fetchStaff = async () => {
    try {
      const res = await fetch("/api/admin/staff");
      const data = await res.json();

      if (res.ok) {
        setStaffList(data || []);
      } else {
        showToast("error", data.message || "Failed to load staff");
      }
    } catch {
      showToast("error", "Server error");
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // =========================
  // INPUT HANDLER
  // =========================
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];

      if (file && file.size > 2 * 1024 * 1024) {
        showToast("error", "Image must be under 2MB");
        return;
      }

      setForm((prev) => ({ ...prev, image: file }));
      setPreview(file ? URL.createObjectURL(file) : null);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // =========================
  // EDIT
  // =========================
  const handleEdit = (staff) => {
    setEditMode(true);
    setEditId(staff._id);

    setForm({
    title: staff.title || "",
    firstName: staff.firstName || "",
    otherName: staff.otherName || "",
    lastName: staff.lastName || "",
    email: staff.email || "",
    phone: staff.phone || "", 
    role: staff.role || "",
    subject: staff.subject || [],
    classAssigned: staff.classAssigned || [],
    address: staff.address || "",
    password: "",
    confirmPassword: "",
    image: null,
    });
    
    setPreview(staff.imageUrl || null);
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
    phone: "",
    role: "",
    subject: [],
    classAssigned: [],
    address: "",
    password: "",
    confirmPassword: "",
    image: null,
  });

  setEditMode(false);
  setEditId(null);
  setPreview(null);
};

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id) => {
  try {
    const res = await fetch(`/api/admin/staff/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setStaffList((prev) => prev.filter((s) => s._id !== id));
      showToast("success", "Staff deleted successfully");
    } else {
      const err = await res.json().catch(() => ({}));
      showToast("error", err?.message || "Delete failed");
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

    if (
      !form.title ||
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.role
    ) {
      showToast("error", "Please fill all required fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      showToast("error", "Passwords do not match");
      return;
    }

    setLoading(true);

    const data = new FormData();

    Object.keys(form).forEach((key) => {
      const value = form[key];

      if (value === "" || value === null || value === undefined) return;
      if (Array.isArray(value) && value.length === 0) return;

      data.append(key, value);
    });

    try {
      const url = editMode
        ? `/api/admin/staff/${editId}`
        : "/api/admin/staff";

      const method = editMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: data,
      });

      const result = await res.json();

      if (res.ok) {
        showToast("success", result?.message || "Staff saved successfully");
        resetForm();
        fetchStaff();
      } else {
        showToast("error", result?.message || "Failed to save staff");
      }
    } catch {
      showToast("error", "Server error");
    }

    setLoading(false);
  };

  const filteredStaff = staffList.filter((s) => {
  const fullName =
    `${s.title || ""} ${s.firstName} ${s.lastName}`.toLowerCase();

  return (
    fullName.includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase()) ||
    s.staffId?.toLowerCase().includes(search.toLowerCase())
  );
});


  // =========================
  return (
    <div className="min-h-screen bg-slate-100 p-6 space-y-6">

      {/* TOAST */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 px-4 py-3 rounded-xl text-white shadow-lg z-50 ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* HEADER */}  
      <div className="text-white p-5 rounded-2xl shadow-lg bg-[#0a1f44]">
        <h1 className="text-xl md:text-2xl font-bold">Staff Management Board</h1>
        <p className="text-sm opacity-90">Create and manage staff records</p>
      </div>

      {/* FORM */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-3">

          <select name="title" value={form.title} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 hover:border-blue-300">
            <option value="">Title</option>
            <option>Mr</option>
            <option>Miss</option>
            <option>Mrs</option>
            <option>Dr</option>
            <option>Prof</option>
          </select>

          <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} className="input border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-blue-300 transition" />
          <input name="otherName" placeholder="Other Name" value={form.otherName} onChange={handleChange} className="input border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-blue-300 transition" />
          <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} className="input border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-blue-300 transition" />

          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="input border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-blue-300 transition" />

            <input
                name="phone"
                placeholder="Phone / Contact"
                value={form.phone}
                onChange={handleChange}
                className="input border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-blue-300 transition"
                />

          <select name="role" value={form.role} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 hover:border-blue-300">
            <option value="">Role</option>
            <option>Class Teacher</option>
            <option>Subject Teacher</option>
            <option>Class & Subject Teacher</option>
          </select>

          <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="input border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-blue-300 transition" />

          <input type="file" name="image" onChange={handleChange} className="input border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-blue-300 transition" />

          {preview && (
            <img src={preview} className="w-24 h-24 rounded-full mx-auto" />
          )}


          <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    className="input pr-10 border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-blue-300 transition"
                />

                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 cursor-pointer hover:text-cyan-600"
                >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            </div>
          
          <div className="relative">
            <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={handleChange}
                className="input pr-10 border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-blue-300 transition"
            />

            <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 cursor-pointer hover:text-cyan-600"
            >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            </div>

          <button disabled={loading} className="w-full md:w-auto px-6 py-3 cursor-pointer rounded-xl bg-[#0a1f44] text-white font-semibold cursor-pointer hover:bg-[#102a5c] transition">
            {loading ? "Processing..." : editMode ? "Update Staff" : "Create Staff"}
          </button>

          {editMode && (
            <button type="button" onClick={resetForm} className="btn-cancel cursor-pointer">
              Cancel
            </button>
          )}
        </form>
      </div>

      <input
        type="text"
        placeholder="Search staff by name, email or ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 rounded-xl border border-slate-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 hover:border-blue-300"
      />

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-200 text-left">
        <tr>
            <th className="p-3">S/N</th>
            <th className="p-3">Staff ID</th>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Contact</th>
            <th className="p-3">Class</th>
            <th className="p-3">Subject</th>
            <th className="p-3">Role</th>
            <th className="p-3">Action</th>
        </tr>
        </thead>

          <tbody>
            {filteredStaff.map((s, i) => (
              <tr key={s._id} className="border-t hover:bg-blue-50">

                <td className="p-3">{i + 1}</td>

                <td className="p-3 text-blue-600 font-semibold">
                  {s.staffId}
                </td>

                {/* FIXED TITLE DISPLAY */}
                <td className="p-3">
                  {s.title ? `${s.title} ${s.firstName} ${s.lastName}` : `${s.firstName} ${s.lastName}`}
                </td>

                <td className="p-3">{s.email || "-"}</td>

                <td className="p-3">{s.phone || "-"}</td>
                <td className="p-3">
                  {s.classAssigned?.length ? s.classAssigned.join(", ") : "-"}
                </td>

                <td className="p-3">
                  {s.subject?.length ? s.subject.join(", ") : "-"}
                </td>

                <td className="p-3">{s.role}</td>

                <td className="p-3 flex gap-2">
                  <button onClick={() => handleEdit(s)} className="text-blue-600 cursor-pointer">
                    Edit
                  </button>

                  <button
                    onClick={() => setConfirmDelete(s._id)}
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
                <ConfirmDeleteModal
        confirmDelete={confirmDelete}
        setConfirmDelete={setConfirmDelete}
        handleDelete={handleDelete}
        />
    </div>
  );
}