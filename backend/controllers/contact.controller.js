import ContactMessage from '../models/Contact.js';
import { validationResult } from 'express-validator';
import { sendContactEmail } from '../utils/email.js';

export async function createMessage(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      return next(new Error(errors.array().map(e => e.msg).join(', ')));
    }

    // Honeypot — bots often fill every field
    if (req.body.company) {
      return res.status(200).json({ ok: true, skipped: true });
    }

    const payload = {
      name: req.body.name.trim(),
      email: req.body.email.trim(),
      phone: req.body.phone?.trim(),
      subject: req.body.subject.trim(),
      message: req.body.message.trim(),
      company: req.body.company || '',
      ip: req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
      referer: req.headers['referer'] || req.headers['origin']
    };

    const doc = await ContactMessage.create(payload);

    // Fire-and-forget email (don’t block UX if SMTP has hiccups)
    sendContactEmail(doc).catch((e) => console.warn('Email error:', e.message));

    return res.status(201).json({ ok: true, id: doc._id });
  } catch (e) {
    return next(e);
  }
}

export async function listMessages(req, res, next) {
  try {
    const token = req.headers['x-admin-token'];
    if (!token || token !== process.env.ADMIN_API_TOKEN) {
      res.status(401);
      return next(new Error('Unauthorized'));
    }

    const page = Math.max(parseInt(req.query.page || '1'), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '20'), 1), 100);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      ContactMessage.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      ContactMessage.countDocuments()
    ]);

    res.json({ ok: true, page, limit, total, items });
  } catch (e) {
    next(e);
  }
}
