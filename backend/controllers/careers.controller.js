// controllers/careers.controller.js
import fs from "fs";
import { z } from "zod";
import CareerApplication from "../models/CareerApplication..js";
import { sendMail } from "../utils/mailer.js";

const applySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional().or(z.literal("")),
  role: z.string().min(1, "Role is required"),
  coverLetter: z.string().optional().or(z.literal("")),
  source: z.string().optional().or(z.literal("")),
});

export async function applyForJob(req, res, next) {
  try {
    // Multer parsed fields come from req.body (multipart/form-data)
    const parsed = applySchema.parse({
      name: req.body?.name,
      email: req.body?.email,
      phone: req.body?.phone,
      role: req.body?.role,
      coverLetter: req.body?.coverLetter ?? req.body?.message ?? "",
      source: req.body?.source ?? "",
    });

    const file = req.file || null;

    const doc = await CareerApplication.create({
      ...parsed,
      resumeOriginalName: file?.originalname || null,
      resumePath: file?.path || null,
      resumeSize: file?.size || null,
    });

    // Build HR/Admin email
    const recipients = [process.env.NOTIFY_TO, process.env.HR_TO_EMAIL].filter(Boolean);
    const subject = `New Job Application: ${doc.role} — ${doc.name}`;

    const html = `
      <div style="font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;font-size:14px;color:#222">
        <h2 style="margin:0 0 8px">New Job Application</h2>
        <p><strong>Name:</strong> ${escapeHtml(doc.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(doc.email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(doc.phone || "—")}</p>
        <p><strong>Role:</strong> ${escapeHtml(doc.role)}</p>
        ${doc.source ? `<p><strong>Source:</strong> ${escapeHtml(doc.source)}</p>` : ""}
        ${doc.coverLetter ? `<p style="margin-top:8px"><strong>Cover Note:</strong><br>${escapeHtml(doc.coverLetter).replace(/\n/g,"<br>")}</p>` : ""}
        <p style="margin-top:12px;color:#666">Application ID: ${doc._id}</p>
        <p style="margin:2px 0;color:#666">Submitted: ${new Date(doc.createdAt).toLocaleString()}</p>
      </div>
    `;

    const attachments = [];
    if (doc.resumePath && fs.existsSync(doc.resumePath)) {
      attachments.push({
        filename: doc.resumeOriginalName || "resume",
        path: doc.resumePath,
      });
    }

    if (recipients.length) {
      await sendMail({
        to: recipients.join(","),
        subject,
        html,
        attachments,
      });
    }

    // Optional: acknowledgement to applicant
    try {
      await sendMail({
        to: doc.email,
        subject: `We received your application for ${doc.role}`,
        html: `
          <div style="font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;font-size:14px;color:#222">
            <p>Hi ${escapeHtml(doc.name)},</p>
            <p>Thanks for applying to <strong>House of Musa</strong> for <strong>${escapeHtml(doc.role)}</strong>.
            Our team will review your application and get back to you if it's a match.</p>
            <p>Best,<br/>House of Musa — Careers</p>
          </div>
        `,
      });
    } catch (e) {
      console.warn("Ack email failed (non-fatal):", e?.message);
    }

    res.status(201).json({ message: "Application submitted", id: doc._id });
  } catch (err) {
    if (err?.code === "LIMIT_FILE_SIZE") {
      err.status = 413;
      err.message = "File too large (max 10MB)";
    }
    // zod validation
    if (err?.issues) {
      return res.status(400).json({ error: err.issues[0]?.message || "Invalid data" });
    }
    next(err);
  }
}

export async function listApplications(req, res) {
  const token = req.headers["x-admin-token"];
  if (!token || token !== (process.env.ADMIN_API_TOKEN || "")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const items = await CareerApplication.find().sort({ createdAt: -1 }).lean();
  res.json({ count: items.length, items });
}

// --- helpers ---
function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
