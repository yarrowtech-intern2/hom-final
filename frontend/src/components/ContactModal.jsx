import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import ContactUs from "../pages/contact";
import "./ContactModal.css";

export default function ContactModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="contact-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      <div
        className="contact-modal-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="contact-modal-panel">
        <button
          type="button"
          className="contact-modal-close"
          onClick={onClose}
          aria-label="Close contact form"
        >
          ×
        </button>
        <div className="contact-modal-content">
          <ContactUs />
        </div>
      </div>
    </div>,
    document.body
  );
}
