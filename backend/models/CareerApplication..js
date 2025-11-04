// models/CareerApplication.js
import mongoose from "mongoose";

const CareerApplicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    role: { type: String, required: true, trim: true },
    coverLetter: { type: String, default: "" },
    source: { type: String, default: "" },

    resumeOriginalName: { type: String, default: null },
    resumePath: { type: String, default: null },
    resumeSize: { type: Number, default: null },

    status: {
      type: String,
      enum: ["NEW", "IN_REVIEW", "SHORTLISTED", "REJECTED", "HIRED"],
      default: "NEW",
    },
  },
  { timestamps: true }
);

export default mongoose.model("CareerApplication", CareerApplicationSchema);
