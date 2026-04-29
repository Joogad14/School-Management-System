"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

export default function SessionTermPage() {
  const [form, setForm] = useState({
    session: "",
    term: "",
    from: "",
    to: "",
  });

  const [search, setSearch] = useState("");
  const [sessions, setSessions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editId, setEditId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ FETCH DATA
  const fetchSessions = async (pageNumber = 1) => {
    try {
      const res = await fetch(
        `/api/admin/session-term?page=${pageNumber}&limit=10`
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load sessions");
      }

      setSessions(data.sessions || []);
      setPage(data.currentPage || 1);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      toast.error(err.message || "Failed to load sessions");
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);


  const handleDelete = async (id) => {
  try {
    const res = await fetch("/api/admin/session-term", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Delete failed");
    }

    toast.success(data.message || "Deleted successfully");

    fetchSessions(page);
  } catch (err) {
    toast.error(err.message || "Delete failed");
  }
};


  // ✅ CREATE / UPDATE
  const handleSubmit = async () => {
    try {
      // 🔴 VALIDATION
      if (!form.session || !form.term || !form.from || !form.to) {
        return toast.error("All fields are required");
      }

      const method = editId ? "PUT" : "POST";

      const res = await fetch("/api/admin/session-term", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editId,
          session: form.session,
          term: form.term,
          from: form.from,
          to: form.to,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Request failed");
      }

      // 🟢 SUCCESS (ONE UNIFIED TOAST FOR CREATE + UPDATE)
      toast.success(data.message || "Success");

      setForm({ session: "", term: "", from: "", to: "" });
      setEditId(null);

      fetchSessions(page);
    } catch (err) {
      // 🔴 ERROR
      toast.error(err.message || "Something went wrong");
    }
  };

  // ✅ EDIT
  const handleEdit = (item) => {
    setForm({
      session: item.session || "",
      term: item.term || "",
      from: item.from?.split("T")[0] || "",
      to: item.to?.split("T")[0] || "",
    });

    setEditId(item._id);

    toast.success("Editing mode enabled");
  };



  return (
    <div className="p-4 md:p-6 space-y-6 bg-slate-50 min-h-screen overflow-x-hidden">

      {/* HEADER */}
      <div className="text-white p-5 md:p-6 rounded-2xl shadow-lg bg-[#0a1f44]">
        <h1 className="text-xl md:text-2xl font-bold"> 
          Session & Term Management
        </h1>
        <p className="text-sm opacity-90">
          Create, edit and manage academic sessions
        </p>
      </div>

      {/* FORM */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md space-y-4">

        <input
          type="text"
          name="session"
          placeholder="e.g 2025/2026"
          value={form.session}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 placeholder:text-slate-500 outline-none hover:border-cyan-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200 transition"
        />

        <select
          name="term"
          value={form.term}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border border-slate-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 hover:border-blue-300"
        >
          <option value="">Select Term</option>
          <option value="1st Term">1st Term</option>
          <option value="2nd Term">2nd Term</option>
          <option value="3rd Term">3rd Term</option>
          <option value="Summer Term">Summer Term</option>
        </select>

        <input
          type="date"
          name="from" 
          placeholder="From e.g 04/14/2026"
          value={form.from}
          onChange={handleChange}
         className="w-full px-4 py-3 rounded-xl 
        border border-slate-300 
        bg-slate-50 text-slate-800
        outline-none transition

        hover:border-slate-400
        focus:bg-slate-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200

        appearance-none"
        />

        <input
          type="date"
          name="to"
          placeholder="To e.g 04/30/2026"
          value={form.to}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl 
          border border-slate-300 
          bg-slate-50 text-slate-800
          outline-none transition

          hover:border-slate-400
          focus:bg-slate-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200

          appearance-none"
        />

        <button
          onClick={handleSubmit}
          className="w-full md:w-auto px-6 py-3 rounded-xl bg-[#0a1f44] text-white font-semibold cursor-pointer hover:bg-[#102a5c] transition"
        >
          {editId ? "Update Session" : "Save Session"}
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search session or term..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded-xl border border-slate-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 hover:border-blue-300"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md overflow-x-auto w-full">
        <ConfirmDeleteModal
      confirmDelete={confirmDelete}
      setConfirmDelete={setConfirmDelete}
      handleDelete={handleDelete}
    />

        <table className="min-w-[700px] w-full text-sm text-gray-800">

          <thead>
            <tr className="text-left bg-slate-100">
              <th className="p-3 text-gray-800">S/N</th>
              <th className="p-3 text-gray-800">Session</th>
              <th className="p-3 text-gray-800">Term</th>
              <th className="p-3 text-gray-800">From</th>
              <th className="p-3 text-gray-800">To</th>
              <th className="p-3 text-gray-800">Actions</th>
            </tr>
          </thead>

          <tbody>
            {sessions
                .filter((item) => {
                  const keyword = search.toLowerCase();

                  return (
                    item.session?.toLowerCase().includes(keyword) ||
                    item.term?.toLowerCase().includes(keyword)
                  );
                })
                .map((item, index) => (
              <tr key={item._id} className="border-t hover:bg-slate-50 transition">

                <td className="p-3 text-gray-800">{(page - 1) * 10 + index + 1}</td>
                <td className="p-3 text-gray-800 font-medium">{item.session}</td>
                <td className="p-3 text-gray-800">{item.term}</td>
                <td className="p-3 text-gray-800">
                  {new Date(item.from).toLocaleDateString()}
                </td>
                <td className="p-3 text-gray-800">
                  {new Date(item.to).toLocaleDateString()}
                </td>

                <td className="p-3 flex gap-2 flex-wrap">

                  <button
                    onClick={() => handleEdit(item)}
                    className="px-3 py-2 rounded-lg bg-blue-100 text-blue-700 cursor-pointer hover:bg-blue-200 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => setConfirmDelete(item._id)}
                    className="px-3 py-2 rounded-lg bg-red-100 text-red-700 cursor-pointer hover:bg-red-200 transition"
                  >
                    Delete
                  </button>

                </td>
              </tr>
            ))}
          </tbody>

        </table>

        {/* PAGINATION */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-0 justify-between items-center mt-4">

          <button
            disabled={page === 1}
            onClick={() => fetchSessions(page - 1)}
            className="px-4 py-2 rounded-lg bg-slate-200 text-gray-800 cursor-pointer hover:bg-slate-300 transition disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
          >
            Prev
          </button>

          <p className="text-sm text-gray-800">
            Page {page} of {totalPages}
          </p>

          <button
            disabled={page === totalPages}
            onClick={() => fetchSessions(page + 1)}
            className="px-4 py-2 rounded-lg bg-slate-200 text-gray-800 cursor-pointer hover:bg-slate-300 transition disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
          >
            Next
          </button>

        </div>
      </div>
    </div>
    
  );
  
}

