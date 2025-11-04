// /middleware/requireAdmin.js
export function requireAdmin(req, res, next) {
  const header = req.get("x-admin-token");
  if (!header || header !== process.env.ADMIN_API_TOKEN) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }
  next();
}
