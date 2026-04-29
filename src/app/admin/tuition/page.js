"use client";

import { useEffect, useState } from "react";

export default function TuitionApprovalPage() {
  const [receipts, setReceipts] = useState([]);
  const [search, setSearch] = useState("");
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

  // ================= FETCH =================
  const fetchReceipts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/receipts", {
        cache: "no-store",
      });

      const data = await res.json();
      setReceipts(Array.isArray(data) ? data : []);
    } catch {
      showToast("error", "Failed to fetch receipts");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReceipts();
  }, []);

  // ================= SEARCH =================
  const filteredReceipts = receipts.filter((r) => {
    const text = search.toLowerCase();

    return (
      r.student?.firstName?.toLowerCase().includes(text) ||
      r.student?.studentId?.toLowerCase().includes(text) ||
      r.parent?.lastName?.toLowerCase().includes(text) ||
      r.student?.currentClass?.className?.toLowerCase().includes(text) ||
      r.session?.toLowerCase().includes(text) ||
      r.term?.toLowerCase().includes(text)
    );
  });

  // ================= DOWNLOAD =================
  const downloadReceipt = (base64, studentId, session, term) => {
    const link = document.createElement("a");
    link.href = base64;
    link.download = `Receipt-${studentId}-${session}-${term}.png`;
    link.click();
  };

  // ================= UPDATE STATUS =================
  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/admin/receipts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast("success", "Updated successfully");
        fetchReceipts();
      } else {
        showToast("error", data.message);
      }
    } catch {
      showToast("error", "Server error");
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-100 min-h-screen">

      {/* TOAST */}
      {toast.show && (
        <div className={`fixed top-4 right-4 px-4 py-3 rounded-xl text-white ${
          toast.type === "success" ? "bg-green-600" : "bg-red-600"
        }`}>
          {toast.message}
        </div>
      )}

      {/* HEADER */}
      <div className="bg-[#0a1f44] text-white p-5 rounded-2xl">
        <h1 className="text-xl font-bold">Tuition Approval Board</h1>
        <p className="text-sm opacity-80">Approve or decline receipts</p>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search student, class, parent, session..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 rounded-xl border border-slate-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 hover:border-blue-300"
      />

      {/* TABLE */}
      <div className="bg-white rounded-2xl overflow-x-auto shadow">
        <table className="w-full text-sm">

          <thead className="bg-slate-200"> 
            <tr>
              <th className="p-3 text-gray-800">S/N</th>
              <th className="p-3 text-gray-800 text-gray-800">Student</th>
              <th className="p-3 text-gray-800">Class</th>
              <th className="p-3 text-gray-800">Parent</th>
              <th className="p-3 text-gray-800">Session</th>
              <th className="p-3 text-gray-800">Term</th>
              <th className="p-3 text-gray-800">Amount</th>
              <th className="p-3 text-gray-800">Receipt</th>
              <th className="p-3 text-gray-800">Status</th>
              <th className="p-3 text-gray-800">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredReceipts.map((r, i) => (
              <tr key={r._id} className="border-t hover:bg-blue-50 text-gray-800">

                <td className="p-3 text-gray-800">{i + 1}</td>

                <td className="p-3 text-gray-800">
                  {r.student?.studentId} - {r.student?.firstName}
                </td>

                <td className="p-3 text-gray-800">
                  {r.student?.currentClass?.className || "-"}
                </td>

                <td className="p-3 text-gray-800">
                  {r.parent?.title} {r.parent?.lastName}
                </td>

                <td className="p-3 text-gray-800">{r.session}</td>

                <td className="p-3 text-gray-800">{r.term}</td>

                <td className="p-3 text-blue-600 font-semibold">
                  ₦{r.amount}
                </td>

                {/* DOWNLOAD */}
                <td className="p-3">
                  <button
                    onClick={() =>
                      downloadReceipt(
                        r.image,
                        r.student?.studentId,
                        r.session,
                        r.term
                      )
                    }
                    className="px-3 py-1 text-sm font-semibold text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 hover:text-blue-800 transition cursor-pointer"
                  >
                    Download
                  </button>
                </td>

                {/* STATUS */}
                <td className={`p-3 font-bold ${
                  r.status === "Approved"
                    ? "text-green-600"
                    : r.status === "Declined"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}>
                  {r.status}
                </td>

                {/* ACTION */}
                <td className="p-3 flex gap-2">

                  <button
                    disabled={r.status === "Approved"}
                    onClick={() => updateStatus(r._id, "Approved")}
                    className="px-3 py-1 text-sm font-semibold cursor-pointer bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    Approve
                  </button>

                  <button
                    disabled={r.status === "Declined"}
                    onClick={() => updateStatus(r._id, "Declined")}
                    className="px-3 py-1 text-sm font-semibold bg-red-600 cursor-pointer text-white rounded-lg hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    Decline
                  </button>

                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}