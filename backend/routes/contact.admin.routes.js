import { Router } from "express";
import { requireAdmin } from "../middleware/requireAdmin.js";
import {
  adminListContacts,
  adminGetContact,
  adminDeleteContact,
} from "../controllers/contact.admin.controller.js";

const router = Router();

router.get("/", requireAdmin, adminListContacts);
router.get("/:id", requireAdmin, adminGetContact);
router.delete("/:id", requireAdmin, adminDeleteContact);

export default router;
