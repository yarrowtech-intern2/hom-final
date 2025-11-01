import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { body } from 'express-validator';
import { applyForCareer } from '../controllers/careers.controller.js';

const router = Router();

// Light anti-spam
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false
});

// Validation (keep it simple)
const validate = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('role').trim().notEmpty().withMessage('Role is required'),
  body('phone').optional().trim().isLength({ min: 7 }).withMessage('Phone seems too short'),
  body('message').optional().trim().isLength({ max: 2000 }).withMessage('Message too long'),
  body('source').optional().trim().isLength({ max: 120 }).withMessage('Source too long'),
];

router.post('/apply', limiter, validate, applyForCareer);

export default router;
