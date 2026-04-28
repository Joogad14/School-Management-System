"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";


export default function TeacherProfilePage() {
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    title: "",
    firstName: "",
    otherName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
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
      const token = localStorage.getItem("token");

      const res = await fetch("/api/staff/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        const s = data.staff;

        setForm((prev) => ({
          ...prev,
          title: s.title || "",
          firstName: s.firstName || "",
          otherName: s.otherName || "",
          lastName: s.lastName || "",
          email: s.email || "",
          phone: s.phone || "",
          address: s.address || "",
        }));
      } else {
        showToast("error", data.message);
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
    const token = localStorage.getItem("token");

    // 🔴 LOG 1: token check
    // console.log("🔑 TOKEN FROM STORAGE:", token);

    const payload = {
      title: form.title,
      firstName: form.firstName,
      otherName: form.otherName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      address: form.address,
    };

    if (form.password?.trim()) {
      payload.password = form.password;
    }

    // 🔴 LOG 2: what you're sending
    // console.log("📤 PAYLOAD SENT:", payload);

    const res = await fetch("/api/teacher/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    // 🔴 LOG 3: API response
    // console.log("📥 RESPONSE FROM API:", data);

    if (res.ok) {
      showToast("success", data.message);

      const teacher = JSON.parse(localStorage.getItem("teacher"));

      // 🔴 LOG 4: before update
    //   console.log("🧠 OLD TEACHER:", teacher);

      if (teacher) {
        localStorage.setItem(
          "teacher",
          JSON.stringify({
            ...teacher,
            ...(data.staff || {}),
          })
        );
      }

      // 🔴 LOG 5: after update
    //   console.log(
    //     "✅ NEW TEACHER:",
    //     localStorage.getItem("teacher")
    //   );

      setForm((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
    } else {
      showToast("error", data.message);
    }
  } catch (err) {
    console.log("❌ HANDLE SUBMIT ERROR:", err);
    showToast("error", "Server error");
  }

  setLoading(false);
};


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
      <div className="text-white p-5 rounded-2xl shadow-lg bg-[#0a1f44]">
        <h1 className="text-2xl font-bold">Teacher's Profile</h1>
        <p className="text-sm opacity-80">Update your personal details</p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl space-y-3">

        <select name="title" value={form.title} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 hover:border-blue-300">
          <option value="">Select Title</option>
          <option>Mr</option>
          <option>Mrs</option>
          <option>Miss</option>
          <option>Dr</option>
          <option>Prof</option>
        </select>

        <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" className="input border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-blue-300 transition" />
        <input name="otherName" value={form.otherName} onChange={handleChange} placeholder="Other Name" className="input border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-blue-300 transition" />
        <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" className="input border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-blue-300 transition" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="input border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-blue-300 transition" />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="input border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-blue-300 transition" />
        <input name="address" value={form.address} onChange={handleChange} placeholder="Address" className="input border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-blue-300 transition" />

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
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
            onClick={() =>
            setShowConfirmPassword(!showConfirmPassword)
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 cursor-pointer hover:text-cyan-600"
        >
            {showConfirmPassword ? (
            <EyeOff size={18} />
            ) : (
            <Eye size={18} />
            )}
        </button>
        </div>

        <button className="px-6 py-3 bg-[#0a1f44] text-white rounded-xl cursor-pointer">
          {loading ? "Updating..." : "Update Profile"}
        </button>

      </form>
    </div>
  );
}