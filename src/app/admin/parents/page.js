"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

export default function ParentPage() {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editId, setEditId] = useState(null);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: "",
  });

  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    parentTitle: "",
    parentFirstName: "",
    parentLastName: "",
    parentEmail: "",
    parentPhone: "",
    parentAddress: "",
    parentPassword: "",
    parentConfirmPassword: "",
  });

  // ================= TOAST =================
  const showToast = (type, message) => {
    setToast({ show: true, type, message });

    setTimeout(() => {
      setToast({ show: false, type: "", message: "" });
    }, 3000);
  };

  // ================= FETCH =================
  const fetchParents = async () => {
    try {
      const res = await fetch("/api/admin/parents", { cache: "no-store" });
      const data = await res.json();
      setParents(Array.isArray(data) ? data : []);
    } catch {
      showToast("error", "Failed to fetch parents");
    }
  };

  useEffect(() => {
    fetchParents();
  }, []);

  // ================= INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value ?? "",
    }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDATION
    if (!form.parentFirstName || !form.parentLastName || !form.parentEmail) {
      return showToast("error", "First name, last name and email are required");
    }

    if (!editId && !form.parentPassword) {
      return showToast("error", "Password is required");
    }

    if (form.parentPassword !== form.parentConfirmPassword) {
      return showToast("error", "Passwords do not match");
    }

    setLoading(true);

    try {
      const payload = {
        parentTitle: form.parentTitle,
        parentFirstName: form.parentFirstName,
        parentLastName: form.parentLastName,
        parentEmail: form.parentEmail,
        parentPhone: form.parentPhone,
        parentAddress: form.parentAddress,
      };

      if (form.parentPassword?.trim()) {
        payload.parentPassword = form.parentPassword;
      }

      const res = await fetch(
        editId ? `/api/admin/parents/${editId}` : "/api/admin/parents",
        {
          method: editId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        return showToast("error", data?.message || "Request failed");
      }

      showToast(
        "success",
        editId ? "Parent updated successfully" : "Parent created successfully"
      );

      // RESET
      setEditId(null);

      setForm({
        parentTitle: "",
        parentFirstName: "",
        parentLastName: "",
        parentEmail: "",
        parentPhone: "",
        parentAddress: "",
        parentPassword: "",
        parentConfirmPassword: "",
      });

      fetchParents();
    } catch (err) {
      showToast("error", "Server error");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/admin/parents/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        return showToast("error", "Delete failed");
      }

      setParents((prev) => prev.filter((p) => p._id !== id));
      showToast("success", "Deleted successfully");
    } catch {
      showToast("error", "Server error");
    }
  };

  const filteredParents = parents.filter((p) => {
  const fullName =
    `${p.title || ""} ${p.firstName || ""} ${p.lastName || ""}`.toLowerCase();

  return (
    fullName.includes(search.toLowerCase()) ||
    p.parentId?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase()) ||
    p.phone?.toLowerCase().includes(search.toLowerCase())
  );
});
 
  return (
    <div className="min-h-screen bg-slate-100 p-6 space-y-6">

      {/* TOAST */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 px-4 py-3 rounded-xl text-white ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* HEADER */}
      <div className="text-white p-5 rounded-2xl shadow-lg bg-[#0a1f44]">
        <h1 className="text-xl md:text-2xl font-bold">
          Parent Management Board
        </h1>
        <p className="text-sm opacity-90">
          Create and manage parent records
        </p>
      </div>

      {/* FORM */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-300">
        <form onSubmit={handleSubmit} className="space-y-3">

          <select
            name="parentTitle"
            value={form.parentTitle}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-slate-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 hover:border-blue-300"
          >
            <option value="">Select Title</option>
            <option>Mr</option>
            <option>Mrs</option>
            <option>Miss</option>
            <option>Dr</option>
            <option>Prof</option>
          </select>

          <input
            name="parentFirstName"
            value={form.parentFirstName}
            onChange={handleChange}
            placeholder="First Name"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 placeholder:text-slate-500 outline-none hover:border-cyan-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200 transition"
          />

          <input
            name="parentLastName"
            value={form.parentLastName}
            onChange={handleChange}
            required
            placeholder="Last Name"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 placeholder:text-slate-500 outline-none hover:border-cyan-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200 transition"
          />

          <input
            name="parentEmail"
            value={form.parentEmail}
            required
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 placeholder:text-slate-500 outline-none hover:border-cyan-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200 transition"
          />

          <input
            name="parentPhone"
            value={form.parentPhone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 placeholder:text-slate-500 outline-none hover:border-cyan-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200 transition"
          />

          <input
            name="parentAddress"
            value={form.parentAddress}
            onChange={handleChange}
            placeholder="Address"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 placeholder:text-slate-500 outline-none hover:border-cyan-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200 transition"
          />

           <div className="relative">
                    <input
                        name="parentPassword"
                        value={form.parentPassword}
                        onChange={handleChange}
                        type={showPassword ? "text" : "password"}   // ✅ FIXED
                        placeholder="Password"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 placeholder:text-slate-500 outline-none hover:border-cyan-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200 transition"
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 cursor-pointer hover:text-cyan-600"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    </div>

                    <div className="relative">
                    <input
                        name="parentConfirmPassword"
                        value={form.parentConfirmPassword}
                        onChange={handleChange}
                        type={showConfirmPassword ? "text" : "password"} // ✅ FIXED
                        placeholder="Confirm Password"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 placeholder:text-slate-500 outline-none hover:border-cyan-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200 transition"
                    />

                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 cursor-pointer hover:text-cyan-600"
                    >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    </div>

          

          <button
            disabled={loading}
            className="w-full md:w-auto px-6 py-3 rounded-xl bg-[#0a1f44] text-white font-semibold hover:bg-[#102a5c] cursor-pointer"
            >
            {loading
                ? "Saving..."
                : editId
                ? "Update Parent"
                : "Create Parent"}
            </button>
        </form>
      </div>

       {/* SEARCH */}
      <input
        type="text"
        placeholder="Search parent by name, ID, email, phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 rounded-xl border border-slate-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 hover:border-blue-300"
      />


      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
        <table className="w-full text-sm text-gray-800">
          <thead className="bg-slate-200 text-gray-800">
            <tr>
              <th className="p-3">S/N</th>
              <th className="p-3">Parent ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredParents.map((p, i) => (
              <tr key={p._id} className="border-t border-gray-800">
                <td className="p-3 text-gray-800">{i + 1}</td>
                <td className="p-3 text-blue-600 font-semibold">{p.parentId}</td>
                <td className="p-3 text-gray-800">
                  {p.title} {p.firstName} {p.lastName}
                </td>
                <td className="p-3 text-gray-800">{p.email}</td>
                <td className="p-3 text-gray-800">{p.phone}</td>

                <td className="p-3 flex gap-3">
                  <button
                    onClick={() => {
                      setEditId(p._id);
                      setForm({
                        parentTitle: p.title || "",
                        parentFirstName: p.firstName || "",
                        parentLastName: p.lastName || "",
                        parentEmail: p.email || "",
                        parentPhone: p.phone || "",
                        parentAddress: p.address || "",
                        parentPassword: "",
                        parentConfirmPassword: "",
                      });
                    }}
                    className="text-blue-600 cursor-pointer"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => setConfirmDelete(p._id)}
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