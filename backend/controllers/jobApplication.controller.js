import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import JobApplication from "../models/JobApplication.js";
import { sendMail } from "../utils/mailer.js";
import { applyJobSchema, normalizeJobPayload } from "../validators/jobApplication.validator.js";
import { escapeHtml, isPathInside } from "../utils/security.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const resumesDir = path.resolve(__dirname, "../uploads/job-resumes");

/* ----------------------- Helpers ----------------------- */

// Fire-and-forget email with a hard timeout (prevents hanging on SMTP)
function sendMailSafe(options, { timeoutMs = 15000, label = "mail" } = {}) {
  return Promise.race([
    Promise.resolve().then(() => sendMail(options)),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timeout after ${timeoutMs}ms`)), timeoutMs)
    ),
  ]).catch((err) => {
    console.warn(`[${label}] failed:`, err?.message || err);
  });
}

function buildHrEmail(doc) {
  const subject = `New Job Application: ${doc.role} — ${doc.fullName}`;

  const html = `
    <div style="font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;font-size:14px;color:#222">
      <h2 style="margin:0 0 10px">New Job Application</h2>
      <p><strong>Role:</strong> ${escapeHtml(doc.role)}</p>
      <p><strong>Name:</strong> ${escapeHtml(doc.fullName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(doc.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(doc.phone || "—")}</p>
      ${
        doc.coverNote
          ? `<p style="margin-top:10px"><strong>Cover Note:</strong><br/>${escapeHtml(doc.coverNote).replace(
              /\n/g,
              "<br/>"
            )}</p>`
          : ""
      }
      <p style="margin-top:12px;color:#666">Application ID: ${doc._id}</p>
      <p style="margin:2px 0;color:#666">Submitted: ${new Date(doc.createdAt).toLocaleString()}</p>
    </div>
  `;

  const attachments = [];
  if (doc.resumePath) {
    try {
      // attachments are optional; never block response if file missing
      if (fs.existsSync(doc.resumePath)) {
        attachments.push({
          filename: doc.resumeOriginalName || "resume",
          path: doc.resumePath,
        });
      }
    } catch (e) {
      console.warn("[hr-attachment] check failed:", e?.message);
    }
  }

  return { subject, html, attachments };
}

function buildApplicantEmail(doc) {
  return {
    subject: `We received your application — ${doc.role}`,
    html: `
      <div style="font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;font-size:14px;color:#222">
        <p>Hi ${escapeHtml(doc.fullName)},</p>
        <p>Thanks for applying for <strong>${escapeHtml(doc.role)}</strong>. Our team will review your application and reach out if it’s a match.</p>
        <p style="color:#666">Reference ID: ${doc._id}</p>
        <p>Best,<br/>Careers Team</p>
      </div>
    `,
  };
}

/* ----------------------- PUBLIC: submit application ----------------------- */
/**
 * Key fix:
 * - save to DB
 * - respond immediately (201)
 * - send emails asynchronously (no await), with timeout protection
 */
export async function submitJobApplication(req, res, next) {
  try {
    // Normalize + validate
    const normalized = normalizeJobPayload(req.body);
    const parsed = applyJobSchema.parse(normalized);

    // Basic spam control (very light)
    const cover = (parsed.coverNote || "").toLowerCase();
    if (cover.includes("http://") || cover.includes("https://")) {
      return res.status(400).json({ error: "Links are not allowed in cover note." });
    }

    const file = req.file || null;

    const doc = await JobApplication.create({
      role: parsed.role,
      fullName: parsed.fullName,
      email: parsed.email,
      phone: parsed.phone || "",
      coverNote: parsed.coverNote || "",
      source: parsed.source || "career2-modal",

      utm: {
        source: parsed.utm_source || "",
        medium: parsed.utm_medium || "",
        campaign: parsed.utm_campaign || "",
        content: parsed.utm_content || "",
        term: parsed.utm_term || "",
      },

      resumeOriginalName: file?.originalname || null,
      resumePath: file?.path || null,
      resumeSize: file?.size || null,
      resumeMime: file?.mimetype || null,

      meta: {
        ip: req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() || req.ip || "",
        userAgent: req.get("user-agent") || "",
        referer: req.get("referer") || "",
      },
    });

    // ✅ IMPORTANT: Respond immediately (do NOT wait for emails)
    res.status(201).json({ message: "Application submitted", id: doc._id });

    // ---------- Background tasks (non-blocking) ----------
    const recipients = [process.env.HR_TO_EMAIL, process.env.NOTIFY_TO].filter(Boolean);

    // HR/Admin notification
    if (recipients.length) {
      const { subject, html, attachments } = buildHrEmail(doc);

      // Do not block request lifecycle; safe timeout
      sendMailSafe(
        { to: recipients.join(","), subject, html, attachments },
        { timeoutMs: 20000, label: "hr-mail" }
      );
    }

    // Applicant acknowledgement (optional, non-fatal)
    if (process.env.SEND_APPLICANT_ACK === "true") {
      const { subject, html } = buildApplicantEmail(doc);

      sendMailSafe(
        { to: doc.email, subject, html },
        { timeoutMs: 15000, label: "applicant-ack" }
      );
    }

    // NOTE: We intentionally do not return anything after sending response.
    return;
  } catch (err) {
    if (err?.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ error: "File too large (max 10MB)" });
    }
    if (err?.issues) {
      return res.status(400).json({ error: err.issues[0]?.message || "Invalid data" });
    }
    return next(err);
  }
}

/* ----------------------- ADMIN handlers unchanged ----------------------- */

export async function adminListApplications(req, res) {
  const { q = "", status = "", role = "", page = "1", limit = "20" } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

  const filter = {};
  if (status) filter.status = status;
  if (role) filter.role = role;

  if (q) {
    filter.$or = [
      { fullName: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
      { phone: { $regex: q, $options: "i" } },
      { role: { $regex: q, $options: "i" } },
    ];
  }

  const [items, total] = await Promise.all([
    JobApplication.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean(),
    JobApplication.countDocuments(filter),
  ]);

  res.json({ total, page: pageNum, limit: limitNum, items });
}

export async function adminGetApplication(req, res) {
  const doc = await JobApplication.findById(req.params.id).lean();
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json({ item: doc });
}

export async function adminUpdateStatus(req, res) {
  const { status } = req.body || {};
  const allowed = new Set(["NEW", "IN_REVIEW", "SHORTLISTED", "REJECTED", "HIRED"]);
  if (!allowed.has(status)) return res.status(400).json({ error: "Invalid status" });

  const doc = await JobApplication.findByIdAndUpdate(
    req.params.id,
    { $set: { status } },
    { new: true }
  ).lean();

  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json({ message: "Updated", item: doc });
}

export async function adminDownloadResume(req, res) {
  const doc = await JobApplication.findById(req.params.id).lean();
  if (!doc || !doc.resumePath) return res.status(404).json({ error: "Resume not found" });

  const abs = path.resolve(doc.resumePath);
  if (!isPathInside(resumesDir, abs)) return res.status(400).json({ error: "Invalid file path" });
  if (!fs.existsSync(abs)) return res.status(404).json({ error: "File missing on server" });

  return res.download(abs, doc.resumeOriginalName || "resume");
}
