import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { body } from 'express-validator';
import { createMessage, listMessages } from '../controllers/contact.controller.js';

const router = Router();

// Tight per-IP limit for the create endpoint (anti-spam)
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: 'Too many requests. Please try again later.' }
});

router.post(
  '/',
  contactLimiter,
  // Validation
  body('name').trim().isLength({ min: 1, max: 120 }).withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('subject').trim().isLength({ min: 1, max: 180 }).withMessage('Subject is required'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
  body('phone').optional().isLength({ max: 30 }),
  body('company').optional().isLength({ max: 0 }), // honeypot must stay empty
  createMessage
);

// Optional admin list
router.get('/', listMessages);

export default router;
