import mongoose from "mongoose";

const SessionTermSchema = new mongoose.Schema({
  session: {
    type: String,
    required: true,
  },
  term: {
    type: String,
    required: true,
  },
  from: {
    type: Date,
    required: true,
  },
  to: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

export default mongoose.models.SessionTerm ||
  mongoose.model("SessionTerm", SessionTermSchema);