import mongoose from "mongoose";

/* ======================
   STUDENT SCHEMA
====================== */
const StudentSchema = new mongoose.Schema(
  {
    studentId: { 
      type: String, 
      unique: true, 
      required: true, 
      index: true 
    },

    profileImage: { 
      type: String, 
      default: "" 
    },

    firstName: { 
      type: String, 
      required: true 
    },

    otherName: { 
      type: String, 
      default: "" 
    },

    lastName: { 
      type: String, 
      required: true 
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
    },

    address: { 
      type: String, 
      default: "" 
    },

    password: { 
      type: String, 
      required: true 
    },

    currentClass: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true 
    },

    teacherAssigned: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff",
      },
    ],

    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parent",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Student ||
  mongoose.model("Student", StudentSchema);