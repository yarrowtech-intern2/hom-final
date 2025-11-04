// /validators/careers.validate.js
import { z } from "zod";

export const ApplySchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  phone: z.string().optional(),
  role: z.string().min(2).max(120),
  experienceYears: z.coerce.number().min(0).max(60).optional(),
  portfolioUrl: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  coverLetter: z.string().max(5000).optional(),
});
