import { Router } from 'express';
import { verifySMTP, sendGenericEmail } from '../utils/email.js';

const router = Router();

// Simple header auth
function requireAdmin(req, res, next) {
  const t = req.headers['x-admin-token'];
  if (!t || t !== process.env.ADMIN_API_TOKEN) {
    return res.status(401).json({ ok: false, message: 'Unauthorized' });
  }
  next();
}

// GET /api/email/verify  -> check SMTP connection
router.get('/verify', requireAdmin, async (req, res) => {
  try {
    const out = await verifySMTP();
    res.json(out);
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
});

// POST /api/email/test { to, subject?, text? }
router.post('/test', requireAdmin, async (req, res) => {
  try {
    const { to, subject = 'SMTP test', text = 'Hello from your API 👋' } = req.body || {};
    if (!to) return res.status(400).json({ ok: false, message: '`to` is required' });

    const out = await sendGenericEmail({ to, subject, text });
    res.json(out);
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
});

export default router;
