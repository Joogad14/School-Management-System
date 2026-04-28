import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const ParentSchema = new mongoose.Schema(
  {
    parentId: { type: String, unique: true, required: true },

    title: String,
    firstName: String,
    otherName: String,
    lastName: String,

    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: String,
    address: String,

    password: {
    type: String,
    required: function () {
      return this.isNew; // only required when creating
    }
  },

    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
  },
  { timestamps: true }
);


export default mongoose.models.Parent ||
  mongoose.model("Parent", ParentSchema);