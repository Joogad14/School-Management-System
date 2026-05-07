"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import ReportHeader from "./ReportHeader";
import ResultTable from "./ResultTable";
import ResultSummary from "./ResultSummary";
import CommentBox from "./CommentBox";
import StudentActivity from "./StudentActivity";

export default function ResultEditor({ studentId }) {
  const searchParams = useSearchParams();

  const [student, setStudent] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [studentActivity, setStudentActivity] = useState([]);

  const [type, setType] = useState("CA");
  const [classId, setClassId] = useState("");

  const [attendance, setAttendance] = useState({
    daysOpen: 0,
    daysPresent: 0,
  });

  const [comments, setComments] = useState({
    teacherComment: "",
    directorComment: "",
  });

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const [position, setPosition] = useState("");

  const session = searchParams.get("session") || "";
  const term = searchParams.get("term") || "";

  // ================= FETCH =================
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        setSubjects([]);
        setStudentActivity([]);
        setAttendance({ daysOpen: 0, daysPresent: 0 });
        setComments({ teacherComment: "", directorComment: "" });
        setPosition("");

        // STUDENT
        const res = await fetch(`/api/admin/students/${studentId}`);
        const data = await res.json();
        setStudent(data);

        const id = data?.currentClass?._id || data?.currentClass;
        setClassId(id);

        // SUBJECTS
        const subRes = await fetch(`/api/admin/subjects/class/${id}`);
        const subData = await subRes.json();

        // RESULT
        const resResult = await fetch(
          `/api/admin/results/get?studentId=${studentId}&session=${session}&term=${term}&type=${type}`
        );

        const resData = await resResult.json();
        const savedResult = resData?.data || null;

        setAttendance({
        daysOpen: savedResult?.daysOpen ?? 0,
        daysPresent: savedResult?.daysPresent ?? 0,
      });

        // ✅ POSITION (IMPORTANT FIX)
        setPosition(savedResult?.position || "");

        setStudentActivity(savedResult?.studentActivity || []);

        // COMMENTS
        setComments({
          teacherComment: savedResult?.teacherComment ?? "",
          directorComment: savedResult?.directorComment ?? "",
        });

        // PREVIOUS TERMS
        const firstTermMap = Object.fromEntries(
          (savedResult?.firstTermSubjects || []).map((s) => [
            String(s.subject),
            s.total,
          ])
        );

        const secondTermMap = Object.fromEntries(
          (savedResult?.secondTermSubjects || []).map((s) => [
            String(s.subject),
            s.total,
          ])
        );

        // SUBJECTS
        setSubjects(
          Array.isArray(subData)
            ? subData.map((s) => {
                const existing = savedResult?.subjects?.find(
                  (sub) =>
                    String(sub.subject?._id || sub.subject) === String(s._id)
                );

                return {
                  subject: s._id,
                  subjectCode: s.subjectCode,
                  subjectName: s.subjectName,

                  ca1: existing?.ca1 ?? 0,
                  ca2: existing?.ca2 ?? 0,
                  exam: type === "EXAM" ? existing?.exam ?? 0 : 0,

                  total: existing?.total ?? 0,
                  grandTotal: existing?.grandTotal ?? 0,
                  average: existing?.average ?? 0,
                  remark: existing?.remark ?? "",
                  grade: existing?.grade ?? "",         
                  position: existing?.position ?? "",    

                  firstTermTotal: firstTermMap[String(s._id)] || 0,
                  secondTermTotal: secondTermMap[String(s._id)] || 0,
                };
              })
            : []
        );

        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    if (studentId) load();
  }, [studentId, session, term, type]);

  // ================= HANDLE =================
  const handleChange = (i, field, value) => {
    const updated = [...subjects];

    const val = Number(value) || 0;
    updated[i][field] = val;

    const s = updated[i];

    if (type === "CA") {
          delete s.exam;
      s.total = s.ca1 + s.ca2;
      s.grandTotal = s.total;
      s.average = Number(((s.total / 30) * 100).toFixed(2));
    } else {
      const examTotal =
        Number(s.ca1 || 0) +
        Number(s.ca2 || 0) +
        Number(s.exam || 0);

      s.grandTotal = examTotal;
      s.total = examTotal;

      if (term === "3rd Term") {
        const first = Number(s.firstTermTotal || 0);
        const second = Number(s.secondTermTotal || 0);

        s.average = Number(
          ((first + second + examTotal) / 3).toFixed(2)
        );
      } else {
        s.average = examTotal;
      }
    }

    const getGrade = (score) => {
      if (score >= 70) return "A";
      if (score >= 60) return "B";
      if (score >= 50) return "C";
      if (score >= 45) return "D";
      if (score >= 40) return "E";
      return "F";
    };

    // ✅ ADD THIS
     if (type === "CA") {
          const percent = ((s.total || 0) / 30) * 100;
          s.grade = getGrade(percent);

        } else if (term === "3rd Term") {
          // 🔥 USE AVERAGE FOR 3RD TERM
          s.grade = getGrade(s.average || 0);

        } else {
          // 1st & 2nd term exam
          s.grade = getGrade(s.total || 0);
        }
    // EXISTING
    if (s.grade === "A") {
      s.remark = "Excellent";

    } else if (s.grade === "B") {
      s.remark = "Very Good";

    } else if (s.grade === "C") {
      s.remark = "Good";

    } else if (s.grade === "D") {
      s.remark = "Pass";

    } else if (s.grade === "E") {
      s.remark = "Poor";

    } else {
      s.remark = "Fail";
    }

    setSubjects(updated);
  };

  const totalScore = subjects.reduce((sum, s) => {
  if (term === "3rd Term" && type === "EXAM") {
    return sum + Number(s.average || 0); // only exam uses average
  }
  return sum + Number(s.total || 0); // CA uses total always
}, 0);

  const average =
    subjects.length > 0
      ? Number(
          (
            subjects.reduce((a, b) => a + (b.average || 0), 0) /
            subjects.length
          ).toFixed(2)
        )
      : 0;

  const totalPossible = type === "CA" ? 30 : 100;

  const percentage =
    subjects.length > 0
      ? Number(
          (
            (totalScore / (subjects.length * totalPossible)) *
            100
          ).toFixed(2)
        )
      : 0;

  if (loading) return <div>Loading...</div>;
  if (!student) return <div>Student not found</div>;

  const firstTermTotal = subjects.reduce(
  (sum, s) => sum + Number(s.firstTermTotal || 0),
  0
);

const secondTermTotal = subjects.reduce(
  (sum, s) => sum + Number(s.secondTermTotal || 0),
  0
);

const firstTermSubjects = subjects.map((s) => ({
  subject: s.subject,
  subjectCode: s.subjectCode,
  subjectName: s.subjectName,
  total: Number(s.firstTermTotal || 0),
}));

const secondTermSubjects = subjects.map((s) => ({
  subject: s.subject,
  subjectCode: s.subjectCode,
  subjectName: s.subjectName,
  total: Number(s.secondTermTotal || 0),
}));


  const handleSave = async () => {
  try {
    setSaving(true);

    const cleanSubjects = subjects.map((s) => ({
      subject: s.subject,
      subjectCode: s.subjectCode,
      subjectName: s.subjectName,
      ca1: Number(s.ca1 || 0),
      ca2: Number(s.ca2 || 0),
      ...(type === "EXAM" && { exam: Number(s.exam || 0) }),
      total: Number(s.total || 0),
      grandTotal: Number(s.grandTotal || 0),
      average: Number(s.average || 0),
      remark: s.remark || "",
    }));

    

    const res = await fetch("/api/admin/results/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
      studentId,
      session,
      term,
      type,
      subjects: cleanSubjects,
      attendance,
      classId,

      firstTermTotal,
      secondTermTotal,
      firstTermSubjects,
      secondTermSubjects,

      totalObtained: totalScore,
      percentage,
      average,
      comments,
      studentActivity,
    })
    });

    // ✅ VERY IMPORTANT
    const data = await res.json();
    console.log("API RESPONSE:", data);

    if (!res.ok) {
      throw new Error(data?.message || "Failed to save result");
    }

    // ✅ SHOW TOAST
    setToast({
      show: true,
      message: "Result saved successfully",
      type: "success",
    });

    // ✅ AUTO HIDE
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);

  } catch (err) {
    console.log("SAVE ERROR:", err);

    setToast({
      show: true,
      message: err.message || "Something went wrong",
      type: "error",
    });

    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  } finally {
    setSaving(false);
  }
};


  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* TOAST */}
      {toast.show && (
        <div className={`fixed top-4 right-4 px-4 py-3 rounded-xl text-white ${
          toast.type === "success" ? "bg-green-600" : "bg-red-600"
        }`}>
          {toast.message}
        </div>
      )}

      <ReportHeader student={student} session={session} term={term} />

      <div className="flex gap-3 mt-4">
        <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 hover:border-blue-300">
          <option value="CA">CA</option>
          <option value="EXAM">EXAM</option>
        </select>
      </div>

      <ResultTable
        subjects={subjects}
        handleChange={handleChange}
        type={type}
        term={term}
      />

      <ResultSummary
        totalScore={totalScore}
        average={average}
        attendance={attendance}
        setAttendance={setAttendance}
        position={position}
      />

      <StudentActivity
        activity={studentActivity}
        setActivity={setStudentActivity}
      />

      <CommentBox comments={comments} setComments={setComments} />

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
      >
        {saving ? "Saving..." : "Save Result"}
      </button>
    </div>
  );
}