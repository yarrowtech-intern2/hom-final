import Contact from "../models/Contact.js"; // adjust path/name if different

export async function adminListContacts(req, res) {
  const { q = "", page = "1", limit = "20" } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

  const filter = q
    ? {
        $or: [
          { name: { $regex: q, $options: "i" } },
          { email: { $regex: q, $options: "i" } },
          { phone: { $regex: q, $options: "i" } },
          { message: { $regex: q, $options: "i" } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean(),
    Contact.countDocuments(filter),
  ]);

  res.json({ total, page: pageNum, limit: limitNum, items });
}

export async function adminGetContact(req, res) {
  const item = await Contact.findById(req.params.id).lean();
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json({ item });
}

export async function adminDeleteContact(req, res) {
  const deleted = await Contact.findByIdAndDelete(req.params.id).lean();
  if (!deleted) return res.status(404).json({ error: "Not found" });
  res.json({ message: "Deleted" });
}
