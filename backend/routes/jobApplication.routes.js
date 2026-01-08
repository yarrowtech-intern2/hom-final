import { Router } from "express";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { uploadJobResume } from "../middleware/jobUpload.js";
import { jobApplyLimiter } from "../middleware/applyRateLimit.js";

import {
  submitJobApplication,
  adminListApplications,
  adminGetApplication,
  adminUpdateStatus,
  adminDownloadResume,
} from "../controllers/jobApplication.controller.js";

const router = Router();

// Public: apply (multipart/form-data) -> resume field name must be "resume"
router.post("/apply", jobApplyLimiter, uploadJobResume.single("resume"), submitJobApplication);

// Admin protected
router.get("/", requireAdmin, adminListApplications);
router.get("/:id", requireAdmin, adminGetApplication);
router.patch("/:id/status", requireAdmin, adminUpdateStatus);
router.get("/:id/resume", requireAdmin, adminDownloadResume);

export default router;
