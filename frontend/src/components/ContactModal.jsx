// import React, { useEffect } from "react";
// import { createPortal } from "react-dom";
// import ContactUs from "../pages/contact"; // ✅ adjust path if your contact.jsx lives elsewhere

// export default function ContactModal({ open, onClose }) {
//   // Lock body scroll when modal is open
//   useEffect(() => {
//     if (!open) return;

//     const prevOverflow = document.body.style.overflow;
//     document.body.style.overflow = "hidden";

//     const onKeyDown = (e) => {
//       if (e.key === "Escape") onClose?.();
//     };
//     window.addEventListener("keydown", onKeyDown);

//     return () => {
//       document.body.style.overflow = prevOverflow;
//       window.removeEventListener("keydown", onKeyDown);
//     };
//   }, [open, onClose]);

//   if (!open) return null;

//   return createPortal(
//     <div className="contact-modal-overlay" role="dialog" aria-modal="true" aria-label="Contact form">
//       {/* backdrop click closes */}
//       <div className="contact-modal-backdrop" onClick={onClose} />

//       <div className="contact-modal-panel">
//         <button className="contact-modal-close" onClick={onClose} aria-label="Close contact modal">
//           ✕
//         </button>

//         {/* Reuse your existing Contact page as "content" */}
//         <div className="contact-modal">
//           <ContactUs />
//         </div>
//       </div>
//     </div>,
//     document.body
//   );
// }
















































import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import ContactUs from "../pages/contact";
import "./ContactModal.css";

export default function ContactModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    
    // Prevent scroll jump by accounting for scrollbar width
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
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
          className="contact-modal-close" 
          onClick={onClose} 
          aria-label="Close contact form"
          type="button"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="contact-modal-content">
          <ContactUs />
        </div>
      </div>
    </div>,
    document.body
  );
}