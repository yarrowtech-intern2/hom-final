import rateLimit from "express-rate-limit";

export const jobApplyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10, // per IP per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many applications from this device. Try again later." },
});
