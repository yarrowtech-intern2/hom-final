import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import ContactUs from "../pages/contact"; // ✅ adjust path if your contact.jsx lives elsewhere

export default function ContactModal({ open, onClose }) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="contact-modal-overlay" role="dialog" aria-modal="true" aria-label="Contact form">
      {/* backdrop click closes */}
      <div className="contact-modal-backdrop" onClick={onClose} />

      <div className="contact-modal-panel">
        <button className="contact-modal-close" onClick={onClose} aria-label="Close contact modal">
          ✕
        </button>

        {/* Reuse your existing Contact page as "content" */}
        <div className="contact-modal">
          <ContactUs />
        </div>
      </div>
    </div>,
    document.body
  );
}
