import mongoose from "mongoose";

const PromotionHistorySchema = new mongoose.Schema(
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

    fromClass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    toClass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.PromotionHistory ||
  mongoose.model("PromotionHistory", PromotionHistorySchema);