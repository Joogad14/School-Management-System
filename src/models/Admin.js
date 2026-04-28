import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    adminId: {
      type: String,
      unique: true,
    },

    title: {
        type: String,
        enum: ["Mr", "Mrs", "Miss", "Dr", "Prof"],
        required: true,
        },

    firstName: String,
    otherName: String,
    lastName: String,

    email: {
      type: String,
      unique: true,
    },

    password: String,

    role: {
      type: String,
      default: "admin",
    },

    // editable profile section
    phone: String,
    address: String,
    profileImage: String,

    // admin control metadata
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Admin ||
  mongoose.model("Admin", adminSchema);