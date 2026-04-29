"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

export default function StudentPage() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [parents, setParents] = useState([]); // ✅ NEW
  const [selectedTeachers, setSelectedTeachers] = useState([]); // ✅ NEW

  const [classSearch, setClassSearch] = useState("");
  const [parentSearch, setParentSearch] = useState("");
  const [search, setSearch] = useState("");

  const [editId, setEditId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [formKey, setFormKey] = useState(0);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: "",
  });

  const [form, setForm] = useState({
    firstName: "",
    otherName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    currentClass: "",
    parent: "", // ✅ NEW
    profileImage: null,
  });

  // ================= TOAST =================
  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
  };

  // ================= FETCH =================
  const fetchStudents = async () => {
    const res = await fetch("/api/admin/students", { cache: "no-store" });
    const data = await res.json();
    setStudents(Array.isArray(data) ? data : []);
  };

  const fetchClasses = async () => {
    const res = await fetch("/api/admin/classes");
    const data = await res.json();
    setClasses(data || []);
  };

  const fetchParents = async () => {
    try {
      const res = await fetch("/api/admin/parents");
      const data = await res.json();
      setParents(Array.isArray(data) ? data : []);
    } catch {
      showToast("error", "Failed to fetch parents");
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchClasses();
    fetchParents(); // ✅ NEW
  }, []);

  // ================= INPUT =================
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profileImage") {
      const file = files[0];

      if (file && file.size > 2 * 1024 * 1024) {
        showToast("error", "Image must be under 2MB");
        return;
      }

      setForm((prev) => ({ ...prev, profileImage: file }));
      setPreview(URL.createObjectURL(file));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value ?? "",
    }));
  };

  // ================= CLASS =================
  const handleClassChange = (e) => {
    const classId = e.target.value;

    setForm((prev) => ({ ...prev, currentClass: classId }));

    const selected = classes.find((c) => c._id === classId);

    if (selected) {
      setTeachers(selected.teachers || []);
      setSelectedTeachers(selected.teachers || []);
    } else {
      setSelectedTeachers([]);
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.firstName || !form.lastName || !form.currentClass) {
      return showToast("error", "Missing required fields");
    }

    if (!editId && !form.password) {
      return showToast("error", "Password is required");
    }

    if (form.password !== form.confirmPassword) {
      return showToast("error", "Passwords do not match");
    }

    setLoading(true);

    try {
      const { confirmPassword, password, ...rest } = form;

      let cleanForm = { ...rest, parentId: form.parent };

      if (password?.trim()) {
        cleanForm.password = password;
      }

      if (!(cleanForm.profileImage instanceof File)) {
        delete cleanForm.profileImage;
      }

      const res = await fetch(
        editId ? `/api/admin/students/${editId}` : "/api/admin/students",
        {
          method: editId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cleanForm),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        return showToast("error", data?.message || "Request failed");
      }

      showToast("success", editId ? "Student updated" : "Student created");

      await fetchStudents();
      setEditId(null);

      setForm({
        firstName: "",
        otherName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        currentClass: "",
        parent: "",
        profileImage: null,
        });

      setPreview(null);
      setTeachers([]);
      setSelectedTeachers([]);
      setFormKey((prev) => prev + 1);

    } catch (err) {
      showToast("error", "Server error");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (studentId) => {
  if (!studentId) return showToast("error", "Invalid ID");

  const res = await fetch(`/api/admin/students/${studentId}`, {
    method: "DELETE",
  });

  if (res.ok) {
    setStudents((prev) => prev.filter((s) => s._id !== studentId));
    showToast("success", "Deleted");
  } else {
    showToast("error", "Delete failed");
  }
};

const filteredStudents = students.filter((s) => {
  const fullName =
    `${s.firstName} ${s.lastName}`.toLowerCase();

  const parentName =
    `${s.parent?.title || ""} ${s.parent?.lastName || ""}`.toLowerCase();

  return (
    fullName.includes(search.toLowerCase()) ||
    s.studentId?.toLowerCase().includes(search.toLowerCase()) ||
    s.currentClass?.className?.toLowerCase().includes(search.toLowerCase()) ||
    parentName.includes(search.toLowerCase())
  );
});

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
        <h1 className="text-xl md:text-2xl font-bold">Student Management</h1>
        <p className="text-sm opacity-90">Create and manage students</p>
      </div>

      {/* FORM */}
      <div className="bg-white p-6 rounded-2xl shadow space-y-4">

        <h2 className="font-semibold text-lg text-[#0a1f44]">Student Details</h2>

        <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 placeholder:text-slate-500 outline-none hover:border-cyan-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200 transition" />
        <input name="otherName" value={form.otherName} onChange={handleChange} placeholder="Other Name" className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 placeholder:text-slate-500 outline-none hover:border-cyan-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200 transition" />
        <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 placeholder:text-slate-500 outline-none hover:border-cyan-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200 transition" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 placeholder:text-slate-500 outline-none hover:border-cyan-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200 transition" />

        <input type="file" name="profileImage" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 placeholder:text-slate-500 outline-none hover:border-cyan-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200 transition" />

        {preview && <img src={preview} className="w-24 h-24 rounded-full mx-auto" />}

        {/* CLASS SEARCH */}
      <input
        type="text"
        placeholder="Search class..."
        value={classSearch}
        onChange={(e) => setClassSearch(e.target.value)}
        className="w-full p-3 rounded-xl border border-slate-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 hover:border-blue-300"
      />

        {/* CLASS */}
        <select
          onChange={handleClassChange}
          value={form.currentClass}
          className="w-full p-3 rounded-xl border border-slate-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 hover:border-blue-300"
        >
          <option value="">Select Class</option>

          {classes
            .filter((c) =>
              c.className
                .toLowerCase()
                .includes(classSearch.toLowerCase())
            )
            .map((c) => (
              <option key={c._id} value={c._id}>
                {c.className}
              </option>
            ))}
        </select>

        {/* TEACHERS */}
        {selectedTeachers.length > 0 && (
          <div className="bg-slate-100 p-3 rounded-lg">
            <p className="text-sm font-semibold text-gray-800">Assigned Teacher(s):</p>
            {selectedTeachers.map((t, i) => (
              <p key={i} className="text-[#0a1f44] font-semibold">
                {t.title} {t.lastName}
              </p>
            ))}
          </div>
        )}

        {/* PARENT SEARCH */}
          <input
            type="text"
            placeholder="Search parent..."
            value={parentSearch}
            onChange={(e) => setParentSearch(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 hover:border-blue-300"
          />

          {/* PARENT */}
          <select
            name="parent"
            value={form.parent}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-slate-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 hover:border-blue-300"
          >
            <option value="">Select Parent</option>

            {parents
              .filter((p) =>
                `${p.parentId} ${p.title} ${p.lastName}`
                  .toLowerCase()
                  .includes(parentSearch.toLowerCase())
              )
              .map((p) => (
                <option key={p._id} value={p._id}>
                  {p.parentId} - {p.title} {p.lastName}
                </option>
              ))}
          </select>

        {/* PASSWORD */}
        <div className="relative">
          <input type={showPassword ? "text" : "password"} name="password" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 placeholder:text-slate-500 outline-none hover:border-cyan-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200 transition" />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 cursor-pointer hover:text-cyan-600">
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>

        {/* CONFIRM */}
        <div className="relative">
          <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 placeholder:text-slate-500 outline-none hover:border-cyan-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200 transition" />
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 cursor-pointer hover:text-cyan-600">
            {showConfirmPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>

        <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-3 bg-[#0a1f44] text-white rounded-xl cursor-pointer"
            >
            {loading ? "Saving..." : editId ? "Update Student" : "Create Student"}
            </button>
      </div>


          <input
            type="text"
            placeholder="Search by name, ID, class or parent..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 hover:border-blue-300"
          />
              
      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="min-w-[700px] w-full text-sm text-gray-800">

          <thead className="bg-slate-200 text-gray-800">
            <tr>
              <th className="p-3 text-gray-800">S/N</th>
              <th className="p-3 text-gray-800">Student</th>
              <th className="p-3 text-gray-800">Student ID</th>
              <th className="p-3 text-gray-800">Class</th>

              {/* ✅ PARENT INFO (FROM POPULATED DATA) */}
              <th className="p-3 text-gray-800">Parent Name</th>
              <th className="p-3 text-gray-800">Parent ID</th>
              <th className="p-3 text-gray-800">Parent Email</th>
              <th className="p-3 text-gray-800">Parent Phone</th>
              <th className="p-3 text-gray-800">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((s, i) => (
              <tr key={s._id} className="border-t text-gray-800">

                <td className="p-3 text-gray-800">{i + 1}</td>
                <td className="p-3 text-gray-800">{s.firstName} {s.lastName}</td>
                <td className="p-3 text-blue-600">{s.studentId}</td>
                <td className="p-3 text-gray-800">
                    {s.currentClass?.className || s.currentClass || "-"}
                    </td>

                {/* ✅ PARENT DATA (ONLY WORKS IF POPULATED) */}
                <td className="p-3 text-gray-800">
                    {s.parent
                        ? `${s.parent.title || ""} ${s.parent.lastName || ""}`
                        : "-"}
                    </td>
                <td className="p-3 text-blue-600">
                  {s.parent?.parentId || "-"}
                </td>

                <td className="p-3 text-gray-800">
                  {s.parent?.email || "-"}
                </td>

                <td className="p-3 text-gray-800">
                  {s.parent?.phone || "-"}
                </td>

                <td className="p-3 flex gap-3">
                  <button
                    className="text-blue-600 cursor-pointer"
                    onClick={() => {
                    setEditId(s._id);

                    setForm({
                        firstName: s.firstName || "",
                        otherName: s.otherName || "",
                        lastName: s.lastName || "",
                        email: s.email || "",
                        password: "",
                        confirmPassword: "",
                        currentClass: s.currentClass?._id || "",
                        parent: s.parent?._id || "",
                        profileImage: null,
                    });

                    // FIX CLASS DISPLAY + TEACHERS
                    const selected = classes.find(
                        (c) => c._id === (s.currentClass?._id || s.currentClass)
                    );

                    if (selected) {
                        setSelectedTeachers(selected.teachers || []);
                    }
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="text-red-600 cursor-pointer"
                    onClick={() => setConfirmDelete(s._id)}
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