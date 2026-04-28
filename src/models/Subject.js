import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema(
  {
    subjectCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    subjectName: {
      type: String,
      required: true,
      trim: true,
    },

    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    teachers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Subject ||
  mongoose.model("Subject", SubjectSchema);