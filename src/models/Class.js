import mongoose from "mongoose";

const ClassSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
      unique: true,
    },

    teachers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Class ||
  mongoose.model("Class", ClassSchema);