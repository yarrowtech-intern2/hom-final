import { z } from "zod";

export const applyJobSchema = z.object({
  role: z.string().min(1, "Role is required").max(120),
  fullName: z.string().min(2, "Full name is required").max(120),
  email: z.string().email("Valid email required").max(180),
  phone: z.string().max(40).optional().or(z.literal("")),
  coverNote: z.string().max(4000).optional().or(z.literal("")),
  source: z.string().max(100).optional().or(z.literal("")),
  utm_source: z.string().max(200).optional().or(z.literal("")),
  utm_medium: z.string().max(200).optional().or(z.literal("")),
  utm_campaign: z.string().max(200).optional().or(z.literal("")),
  utm_content: z.string().max(200).optional().or(z.literal("")),
  utm_term: z.string().max(200).optional().or(z.literal("")),
});

/**
 * Backward compatibility mapper:
 * - accepts older keys like name/coverLetter too, but normalizes to modal format
 */
export function normalizeJobPayload(body = {}) {
  return {
    role: body.role,
    fullName: body.fullName ?? body.name,
    email: body.email,
    phone: body.phone ?? "",
    coverNote: body.coverNote ?? body.coverLetter ?? body.message ?? "",
    source: body.source ?? "career2-modal",

    utm_source: body.utm_source ?? "",
    utm_medium: body.utm_medium ?? "",
    utm_campaign: body.utm_campaign ?? "",
    utm_content: body.utm_content ?? "",
    utm_term: body.utm_term ?? "",
  };
}
