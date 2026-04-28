import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    parentId: String,
    studentId: String,

    amount: Number,

    receiptUrl: String,

    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Payment ||
  mongoose.model("Payment", paymentSchema);