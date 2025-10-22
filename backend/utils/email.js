import nodemailer from 'nodemailer';

let transporter;

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
