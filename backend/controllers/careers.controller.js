import { validationResult } from 'express-validator';
import { getTransporter } from '../utils/email.js';

function escapeHtml(s = '') {
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function renderHrHtml({ name, email, phone, role, message, source }) {
  return `
  <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;line-height:1.6">
    <h2>New Career Application</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(phone || '-')}</p>
    <p><strong>Role:</strong> ${escapeHtml(role)}</p>
    <p><strong>Source:</strong> ${escapeHtml(source || '-')}</p>
    <p><strong>Message:</strong><br/>${escapeHtml(message || '-').replace(/\n/g, '<br/>')}</p>
  </div>`;
}

function renderAckHtml({ name, role }) {
  return `
  <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;line-height:1.6">
    <h2>Thanks for applying, ${escapeHtml(name)}!</h2>
    <p>We’ve received your application for <strong>${escapeHtml(role)}</strong>. Our team will review and get back to you soon.</p>
    <p>Best regards,<br/>HR Team</p>
  </div>`;
}

export async function applyForCareer(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ ok: false, errors: errors.array() });
    }

    const { name, email, phone, role, message = '', source = '' } = req.body || {};
    const hrTo = process.env.HR_TO_EMAIL || process.env.SMTP_USER; // fallback to SMTP_USER
    if (!hrTo) return res.status(500).json({ ok: false, message: 'HR_TO_EMAIL not configured' });

    const t = getTransporter();
    if (!t) return res.status(500).json({ ok: false, message: 'Email transport not configured' });

    // 1) Send to HR
    const hrHtml = renderHrHtml({ name, email, phone, role, message, source });
    await t.sendMail({
      from: `"Careers Bot" <${process.env.SMTP_USER}>`,
      to: hrTo,
      subject: `New Application: ${role} — ${name}`,
      html: hrHtml
    });

    // 2) Send acknowledgement (best-effort)
    try {
      const ackHtml = renderAckHtml({ name, role });
      await t.sendMail({
        from: `"HR Team" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "We received your application",
        html: ackHtml
      });
    } catch (e) {
      // non-fatal
      console.warn('Ack email failed:', e.message);
    }

    return res.json({ ok: true, message: 'Application submitted' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, message: e.message || 'Server error' });
  }
}
