"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function AdminProfilePage() {
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ================= FORM =================
  const [form, setForm] = useState({
    adminId: "",
    title: "",
    firstName: "",
    otherName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // ================= TOAST =================
  const showToast = (type, message) => {
    setToast({ show: true, type, message });

    setTimeout(() => {
      setToast({ show: false, type: "", message: "" });
    }, 3000);
  };

  // ================= FETCH PROFILE =================
  const fetchProfile = async () => {
    try {
      const admin = JSON.parse(localStorage.getItem("admin"));

      if (!admin?.adminId) {
        showToast("error", "Admin not found in storage");
        return;
      }

      const res = await fetch(
        `/api/admin/profile?adminId=${admin.adminId}`
      );

      const data = await res.json();

      if (res.ok) {
        setForm((prev) => ({
          ...prev,
          adminId: admin.adminId, // FIXED (from login storage)
          title: data.title || "",
          firstName: data.firstName || "",
          otherName: data.otherName || "",
          lastName: data.lastName || "",
          email: data.email || "",
        }));
      } else {
        showToast("error", data.message || "Failed to load profile");
      }
    } catch {
      showToast("error", "Network error");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ================= INPUT =================
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password && form.password !== form.confirmPassword) {
      return showToast("error", "Passwords do not match");
    }

    setLoading(true);

    try {
      const payload = {
        adminId: form.adminId,
        title: form.title,
        firstName: form.firstName,
        otherName: form.otherName,
        lastName: form.lastName,
        email: form.email,
      };

      if (form.password?.trim()) {
        payload.password = form.password;
      }

      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        showToast("success", data.message || "Profile updated");

        setForm((prev) => ({
          ...prev,
          password: "",
          confirmPassword: "",
        }));
      } else {
        showToast("error", data.message || "Update failed");
      }
    } catch (err) {
      showToast("error", err.message || "Server error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 space-y-6">

      {/* TOAST */}
      {toast.show && (
        <div className={`fixed top-4 right-4 px-4 py-3 rounded-xl text-white z-50 ${
          toast.type === "success" ? "bg-green-600" : "bg-red-600"
        }`}>
          {toast.message}
        </div>
      )}

      {/* HEADER */}
      <div className="text-white p-5 rounded-2xl bg-[#0a1f44]">
        <h1 className="text-xl font-bold">Admin Profile</h1>
        <p className="text-sm">Update your personal details</p>
      </div>

      {/* FORM */}
      <div className="bg-white p-6 rounded-2xl space-y-3">

        {/* TITLE */}
        <select
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border border-slate-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 hover:border-blue-300"
        >
          <option value="">Select Title</option>
          <option value="Mr">Mr</option>
          <option value="Mrs">Mrs</option>
          <option value="Miss">Miss</option>
          <option value="Dr">Dr</option>
          <option value="Prof">Prof</option>
        </select>

        <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" className="input border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-blue-300 transition" />
        <input name="otherName" value={form.otherName} onChange={handleChange} placeholder="Other Name" className="input border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-blue-300 transition" />
        <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" className="input border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-blue-300 transition" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="input border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-blue-300 transition" />

        {/* PASSWORD */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="New Password (optional)"
            className="input pr-10 border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-blue-300 transition"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 cursor-pointer hover:text-cyan-600"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="input pr-10 border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-blue-300 transition"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 cursor-pointer hover:text-cyan-600"
          >
            {showConfirmPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-3 bg-[#0a1f44] text-white rounded-xl cursor-pointer"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>

      </div>
    </div>
  );
}