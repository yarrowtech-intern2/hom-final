import mongoose from "mongoose";

const JobApplicationSchema = new mongoose.Schema(
  {
    role: { type: String, required: true, trim: true, index: true },

    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    phone: { type: String, trim: true, default: "" },

    coverNote: { type: String, default: "" },

    // Upload info
    resumeOriginalName: { type: String, default: null },
    resumePath: { type: String, default: null },
    resumeSize: { type: Number, default: null },
    resumeMime: { type: String, default: null },

    // Metadata
    source: { type: String, default: "" }, // "career2-modal"
    utm: {
      source: { type: String, default: "" },
      medium: { type: String, default: "" },
      campaign: { type: String, default: "" },
      content: { type: String, default: "" },
      term: { type: String, default: "" },
    },
    meta: {
      ip: { type: String, default: "" },
      userAgent: { type: String, default: "" },
      referer: { type: String, default: "" },
    },

    status: {
      type: String,
      enum: ["NEW", "IN_REVIEW", "SHORTLISTED", "REJECTED", "HIRED"],
      default: "NEW",
      index: true,
    },
  },
  { timestamps: true }
);

// helpful index for admin filtering
JobApplicationSchema.index({ createdAt: -1 });

export default mongoose.model("JobApplication", JobApplicationSchema);
