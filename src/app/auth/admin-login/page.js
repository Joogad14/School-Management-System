"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    adminId: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const year = new Date().getFullYear();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ERROR HANDLER
  const showError = (msg) => {
    setError(msg);

    setTimeout(() => {
      setError("");
    }, 5000);
  };

  const handleLogin = async () => {
    // EMPTY VALIDATION
    if (!form.adminId || !form.password) {
      showError("Please enter Admin ID and Password");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
    console.log("LOGIN DATA:", data);

    // SAVE LOCAL STORAGE (for frontend use)
    localStorage.setItem("token", data.token);
    localStorage.setItem("admin", JSON.stringify(data.admin));

    console.log("TOKEN SAVED:", localStorage.getItem("token"));

    // SAVE COOKIE (for middleware - VERY IMPORTANT)
    document.cookie = `token=${data.token}; path=/; max-age=86400`;

    // redirect
    router.push(data.redirect);
    }else {
        showError(data.message || "Invalid admin credentials");
      }
    } catch (err) {
      showError("Network error. Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* LEFT SIDE */}
      <div
        className="hidden md:block md:w-1/2 relative bg-cover bg-center"
        style={{ backgroundImage: "url('/school1.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-6">

        <div className="w-full max-w-md bg-white rounded-2xl p-8 border border-slate-200">

          {/* HEADER */}
          <div className="flex flex-col items-center mb-6">
            <img src="/logo.png" alt="logo" className="w-20 h-20 mb-3" />

            <h1 className="text-center text-lg font-bold" style={{ color: "#0a1f44" }}>
              DYNAMIC PILLARS INTERNATIONAL SCHOOL
            </h1>

            <p className="text-slate-500 text-sm mt-1">
              School Admin Access Portal
            </p>
          </div>

          {/* INPUTS */}
          <div className="space-y-4">

            <input
              type="text"
              name="adminId"
              placeholder="Admin ID"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-300 text-slate-800 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 cursor-pointer hover:text-red-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

          </div>

          {/* LOGIN BUTTON */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full mt-6 py-3 rounded-xl bg-red-600 text-white cursor-pointer font-semibold hover:bg-red-700 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Admin Login"}
          </button>

          {/* BACK BUTTON */}
          <button
            onClick={() => router.push("/")}
            className="w-full mt-4 py-3 rounded-xl border border-slate-300 cursor-pointer text-slate-600 hover:bg-slate-100 transition"
          >
            Back to Portal
          </button>

          {/* ERROR MESSAGE */}
          {error && (
            <p className="text-center text-red-600 text-sm mt-4">
              {error}
            </p>
          )}

          {/* FOOTER */}
          <p className="text-center text-slate-500 text-xs mt-8">
            © {year} Dynamic Pillars International School
          </p>

        </div>
      </div>
    </div>
  );
}