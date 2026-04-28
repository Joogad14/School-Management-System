import mongoose from "mongoose";

const StaffSchema = new mongoose.Schema(
  {
    staffId: {
      type: String,
      unique: true,
    },

    title: String,
    firstName: String,
    otherName: String,
    lastName: String,

    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },

    phone: {
      type: String,
      default: ""
    },

    role: String,

    subject: {
      type: [String], // ✅ multiple subjects
      default: [],
    },

    classAssigned: {
      type: [String], // ✅ multiple classes
      default: [],
    },

    address: String,
    password: String,
    imageUrl: String,
  },
  { timestamps: true }
);

export default mongoose.models.Staff ||
  mongoose.model("Staff", StaffSchema);