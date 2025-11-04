// routes/careers.routes.js
import { Router } from "express";
import { applyForJob, listApplications } from "../controllers/careers.controller.js";
import { uploadResume } from "../middleware/upload.js";

const router = Router();

// Public endpoint: multipart/form-data (field name: "resume")
router.post("/apply", uploadResume.single("resume"), applyForJob);

// Minimal admin: GET /api/careers  (header: x-admin-token: ADMIN_API_TOKEN)
router.get("/", listApplications);

export default router;
