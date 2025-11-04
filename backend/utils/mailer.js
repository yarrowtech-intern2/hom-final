// utils/mailer.js
import nodemailer from "nodemailer";

let transporter;

function buildTransporter() {
  if (transporter) return transporter;

  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS,
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP env is not fully configured");
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: String(SMTP_SECURE || "false") === "true",
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  return transporter;
}

/** sendMail({ to, subject, html, text, attachments }) */
export async function sendMail({ to, subject, html, text, attachments = [] }) {
  const t = buildTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  return t.sendMail({ from, to, subject, html, text, attachments });
}
