import mongoose from "mongoose";

const ReceiptSchema = new mongoose.Schema(
  {
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parent",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    session: String,
    term: String,
    
    amount: {
  type: Number,
  required: true,
},

    image: {
      type: String, // store URL or path
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Declined"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Receipt ||
  mongoose.model("Receipt", ReceiptSchema);