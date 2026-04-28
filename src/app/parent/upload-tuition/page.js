"use client";

import { useEffect, useState } from "react";
import { Info } from "lucide-react";

export default function UploadReceiptPage() {
  const [students, setStudents] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [sessionTerms, setSessionTerms] = useState([]);

  const [form, setForm] = useState({
    studentId: "",
    session: "",
    term: "",
    amount: "",
    file: null,
  });

  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: "",
  });

  // ================= TOAST =================
  const showToast = (type, message) => {
    setToast({ show: true, type, message });

    setTimeout(() => {
      setToast({ show: false, type: "", message: "" });
    }, 3000);
  };

  
  // ================= FETCH DATA =================
useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

    //   console.log("🔥 TOKEN:", token);

      // ================= STUDENTS =================
      const res = await fetch("/api/parent/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
    //   console.log("🔥 STUDENTS RESPONSE:", data);

      setStudents(data.students || []);

      // ================= SESSION TERMS =================
      const sessionRes = await fetch("/api/admin/session-term");

      const sessionData = await sessionRes.json();

    //   console.log("🔥 SESSION API RESPONSE:", sessionData);

      // ✅ FIXED LINE
      const sessions = sessionData.sessions || [];

    //   console.log("🔥 EXTRACTED SESSIONS:", sessions);

      setSessionTerms(sessions);

      // ================= HISTORY =================
      const historyRes = await fetch("/api/receipt/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const historyData = await historyRes.json();
    //   console.log("🔥 RECEIPT HISTORY:", historyData);

      setReceipts(historyData.receipts || []);
    } catch (err) {
      console.log("❌ FETCH ERROR:", err);
      showToast("error", "Failed to load data");
    }
  };

  fetchData();
}, []);


  // ================= INPUT =================
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ================= FILE =================
  const handleFile = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return showToast("error", "Only image files allowed");
    }

    if (file.size > 2 * 1024 * 1024) {
      return showToast("error", "File must be less than 2MB");
    }

    setForm((prev) => ({
      ...prev,
      file,
    }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.studentId) return showToast("error", "Select a ward");
    if (!form.session || !form.term) return showToast("error", "Select session & term");
    if (!form.amount) return showToast("error", "Enter amount");
    if (!form.file) return showToast("error", "Upload receipt");

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const body = new FormData();
      body.append("studentId", form.studentId);
      body.append("session", form.session);
      body.append("term", form.term);
      body.append("amount", form.amount);
      body.append("file", form.file);

      const res = await fetch("/api/receipt/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      const data = await res.json();

      if (!res.ok) {
        showToast("error", data.message);
      } else {
        showToast("success", "Receipt uploaded");

        // prepend new receipt
        setReceipts((prev) => [data.receipt, ...prev]);

        // reset form
        setForm({
          studentId: "",
          session: "",
          term: "",
          amount: "",
          file: null,
        });
      }
    } catch (err) {
      console.log(err);
      showToast("error", "Upload failed");
    }

    setLoading(false);
  };

  const isActiveTerm = (st) => {
  if (!st?.from || !st?.to) return false;

  const now = Date.now();
  const from = new Date(st.from).getTime();
  const to = new Date(st.to).getTime();

  return now >= from && now <= to;
};


  return (
    <div className="p-6 space-y-6">

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
        <h1 className="text-2xl font-bold">Upload Tuition Receipt</h1>
        <p className="text-sm opacity-80">Tuition Receipt Management</p>
      </div>

      {/* INFO */}
      <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl text-sm flex gap-2">
        <Info size={18} className="mt-1" />
        <div>
          <p className="font-semibold mb-1">Important Notice</p>
          <p>
            If you make a mistake while uploading your receipt, don't worry.
            Kindly contact the school admin and re-upload the correct receipt.
          </p>
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl space-y-3">

        {/* WARD */}
        <select
          name="studentId"
          value={form.studentId}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border border-slate-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 hover:border-blue-300"
        >
          <option value="">Select Ward</option>
          {students.map((s) => (
            <option key={s._id} value={s._id}>
              {s.studentId} - {s.firstName}
            </option>
          ))}
        </select>

        {/* ACTIVE TERM BADGE */}
        {sessionTerms.some(isActiveTerm) && (
          <div className="mb-3 inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
            🟢 Active Term:
            {sessionTerms
              .filter(isActiveTerm)
              .map((st) => (
                <span key={st._id}>
                  {st.session} - {st.term}
                </span>
              ))}
          </div>
        )}

        {/* SESSION + TERM DROPDOWN */}
        <select
        name="sessionTerm"
        value={form.session && form.term ? `${form.session}|${form.term}` : ""}
        onChange={(e) => {
          const value = e.target.value;
          if (!value) return;

          const [session, term] = value.split("|");

          setForm((prev) => ({
            ...prev,
            session,
            term,
          }));
        }}
        className="w-full p-3 rounded-xl border border-slate-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 hover:border-blue-300"
      >
        <option value="">Select Session & Term</option>

        {sessionTerms.map((st) => (
          <option key={st._id} value={`${st.session}|${st.term}`}>
            {st.session} - {st.term}
          </option>
        ))}
      </select>

        {/* AMOUNT */}
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="Amount Paid"
          className="input border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-blue-300 transition"
        />

        {/* FILE */}
        <input type="file" accept="image/*" onChange={handleFile} />

        <button className="bg-[#0a1f44] text-white px-4 py-2 rounded cursor-pointer">
          {loading ? "Uploading..." : "Submit"}
        </button>

      </form>

      {/* HISTORY */}
      <div className="bg-white p-5 rounded-xl">
        <h2 className="font-bold mb-3">Upload History</h2>

        {receipts.length === 0 ? (
          <p>No uploads yet</p>
        ) : (
          receipts.map((r, i) => (
            <div key={i} className="border-b py-2 text-sm flex justify-between">

              <div>
                {r.student?.studentId} - {r.student?.firstName} <br />
                {r.session} - {r.term} <br />
                ₦{r.amount}
              </div>

              <div
                className={`font-bold ${
                  r.status === "Approved"
                    ? "text-green-600"
                    : r.status === "Declined"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {r.status}
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}