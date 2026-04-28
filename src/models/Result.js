import mongoose from "mongoose";

/* ======================
   SUBJECT RESULT SCHEMA
====================== */
const subjectResultSchema = new mongoose.Schema({
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },

  subjectCode: { type: String, default: "" },
  subjectName: { type: String, default: "" },

  ca1: { type: Number, default: 0 },
  ca2: { type: Number, default: 0 },
  exam: { type: Number, default: 0 },

  total: { type: Number, default: 0 },

  average: { type: Number, default: 0 }, // ✅ ADD THIS

  remark: { type: String, default: "" },

  teachers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
    },
  ],
});

/* ======================
   RESULT SCHEMA
====================== */
const ResultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    studentId: {
      type: String,
      required: true,
    },

    isLocked: {
        type: Boolean,
        default: false,
        },

        status: {
        type: String,
        enum: ["draft", "submitted", "approved", "published"],
        default: "draft",
        },

    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    session: {
      type: String,
      required: true,
    },

    term: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["CA", "EXAM"],
      required: true,
    },

    subjects: [subjectResultSchema],

    /* ===== SUMMARY ===== */
    daysOpen: { type: Number, default: 0 },
    daysPresent: { type: Number, default: 0 },

    totalObtainable: { type: Number, default: 0 },
    totalObtained: { type: Number, default: 0 },

    percentage: { type: Number, default: 0 },

    //  ( STRING)
    position: { type: String, default: "" },

    /* ===== COMMENTS ===== */
    teacherComment: {
      type: String,
      default: "",
    },

    directorComment: {
      type: String,
      default: "",
    },

    /* ===== TERM HISTORY ===== */
firstTermSubjects: [
  {
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
    subjectCode: String,
    subjectName: String,
    total: Number,
  },
],

secondTermSubjects: [
  {
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
    subjectCode: String,
    subjectName: String,
    total: Number,
  },
],
average: { type: Number, default: 0 },

    /* ===== CONTROL ===== */
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/* ======================
   PREVENT DUPLICATES
====================== */
ResultSchema.index(
  { student: 1, session: 1, term: 1, type: 1 },
  { unique: true }
);

export default mongoose.models.Result ||
  mongoose.model("Result", ResultSchema);