import nodemailer from 'nodemailer';

let transporter;



// add inside /email.js
export async function sendCareerEmail(appDoc) {
  const t = getTransporter();
  if (!t) return { ok: false, reason: "SMTP not configured" };

  const to = process.env.HR_TO_EMAIL || process.env.NOTIFY_TO || process.env.SMTP_USER;

  const safe = (s = "") =>
    s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const html = `
  <div style="font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif">
    <h2>New Career Application</h2>
    <p><b>Role:</b> ${safe(appDoc.role)}</p>
    <p><b>Name:</b> ${safe(appDoc.name)}</p>
    <p><b>Email:</b> ${safe(appDoc.email)}</p>
    ${appDoc.phone ? `<p><b>Phone:</b> ${safe(appDoc.phone)}</p>` : ""}
    ${appDoc.experienceYears != null ? `<p><b>Experience:</b> ${appDoc.experienceYears} years</p>` : ""}
    ${appDoc.portfolioUrl ? `<p><b>Portfolio:</b> <a href="${safe(appDoc.portfolioUrl)}">${safe(appDoc.portfolioUrl)}</a></p>` : ""}
    ${appDoc.linkedin ? `<p><b>LinkedIn:</b> <a href="${safe(appDoc.linkedin)}">${safe(appDoc.linkedin)}</a></p>` : ""}
    ${appDoc.coverLetter ? `<p><b>Cover Letter:</b><br/>${safe(appDoc.coverLetter).replace(/\n/g, "<br/>")}</p>` : ""}
    <hr/>
    <p style="color:#666;font-size:12px">IP: ${safe(appDoc.meta?.ip || "-")} | UA: ${safe(appDoc.meta?.userAgent || "-")}</p>
  </div>`;

  const attachments = [];
  if (appDoc.resume?.path) {
    attachments.push({
      filename: appDoc.resume.originalName || "resume",
      path: appDoc.resume.path,
      contentType: appDoc.resume.mimeType,
    });
  }

  const info = await t.sendMail({
    from: `"Careers Bot" <${process.env.SMTP_USER}>`,
    to,
    subject: `🧑‍💻 Career Application — ${appDoc.role} — ${appDoc.name}`,
    html,
    attachments,
  });

  return { ok: true, messageId: info.messageId };
}





/** Create or reuse transporter */
export function getTransporter() {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.warn('[SMTP] Missing SMTP_* env vars — email will be skipped.');
    return null;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: String(SMTP_SECURE).toLowerCase() === 'true', // true = 465
    auth: { user: SMTP_USER, pass: SMTP_PASS }
    // If your corp firewall or on-prem SMTP needs it:
    // tls: { rejectUnauthorized: false },
  });

  return transporter;
}

/** Verify SMTP credentials/connection */
export async function verifySMTP() {
  const t = getTransporter();
  if (!t) return { ok: false, reason: 'SMTP not configured' };

  await t.verify(); // throws if not okay
  return { ok: true };
}

/** Minimal generic sender (useful for tests) */
export async function sendGenericEmail({ to, subject, text, html }) {
  const t = getTransporter();
  if (!t) return { ok: false, reason: 'SMTP not configured' };

  const info = await t.sendMail({
    from: `"House of MUSA" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text: text || (html ? html.replace(/<[^>]+>/g, '') : ''),
    html: html || `<pre>${text ?? ''}</pre>`
  });

  return { ok: true, messageId: info.messageId };
}

/** Your contact notification */
export async function sendContactEmail(doc) {
  const t = getTransporter();
  if (!t) return { ok: false, skipped: true, reason: 'SMTP not configured' };

  const toList = (process.env.NOTIFY_TO || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  if (toList.length === 0) return { ok: false, skipped: true, reason: 'NOTIFY_TO empty' };

  const html = `
    <div style="font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif">
      <h2>New Contact Message</h2>
      <p><b>Name:</b> ${escape(doc.name)}</p>
      <p><b>Email:</b> ${escape(doc.email)}</p>
      ${doc.phone ? `<p><b>Phone:</b> ${escape(doc.phone)}</p>` : ''}
      <p><b>Subject:</b> ${escape(doc.subject)}</p>
      <p><b>Message:</b><br/>${escape(doc.message).replace(/\n/g,'<br/>')}</p>
      <hr/>
      <p style="color:#666;font-size:12px">IP: ${doc.ip || '-'} | UA: ${escape(doc.userAgent || '-') }</p>
    </div>
  `;

  const info = await t.sendMail({
    from: `"House Of MUSA" <${process.env.SMTP_USER}>`,
    to: toList,
    subject: `📩 Contact: ${doc.subject} — ${doc.name}`,
    html
  });

  return { ok: true, messageId: info.messageId };
}

function escape(s = '') {
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
