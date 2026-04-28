"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    userId: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const year = new Date().getFullYear();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ERROR HANDLER (AUTO DISAPPEAR)
  const showError = (msg) => {
    setError(msg);

    setTimeout(() => {
      setError("");
    }, 5000);
  };

  const handleLogin = async () => {
    // EMPTY VALIDATION
    if (!form.userId || !form.password) {
      showError("Please enter your User ID and Password");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("staff", JSON.stringify(data.user)); // ✅ ADD THIS

        router.push(data.redirect);
      } else {
        showError(data.message || "Invalid login details");
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
        className="hidden md:block md:w-1/2 relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/school.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-6">

        <div className="w-full max-w-md bg-white rounded-2xl p-8 border border-slate-200">

          {/* LOGO */}
          <div className="flex flex-col items-center mb-6">
            <img src="/logo.png" alt="logo" className="w-20 h-20 mb-3" />

            <h1
              className="text-center text-2xl font-bold"
              style={{ color: "#0a1f44" }}
            >
              DYNAMIC PILLARS INTERNATIONAL SCHOOL
            </h1>

            <p className="text-slate-500 text-sm mt-1">
              School Portal
            </p>
          </div>

          {/* INPUTS */}
          <div className="space-y-4">

            <input
              type="text"
              name="userId"
              placeholder="Staff / Parent / Student ID"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-300 text-slate-800 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 cursor-pointer hover:text-cyan-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* LOGIN BUTTON */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full mt-6 py-3 rounded-xl bg-cyan-600 text-white cursor-pointer font-semibold hover:bg-cyan-700 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* ADMIN BUTTON */}
          <button
            onClick={() => router.push("/auth/admin-login")}
            className="w-full mt-4 py-3 rounded-xl border cursor-pointer border-red-500 text-red-500 font-medium hover:bg-red-500 hover:text-white transition"
          >
            School Admin Access
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