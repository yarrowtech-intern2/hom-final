// // Header.jsx
// import React, { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import logoImg from "/logo/logo-black.png";

// export default function Header() {
//   const [open, setOpen] = useState(false);
//   const { pathname } = useLocation();

//   // Close menu on route change or ESC
//   useEffect(() => setOpen(false), [pathname]);
//   useEffect(() => {
//     const onKey = (e) => e.key === "Escape" && setOpen(false);
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, []);

//   return (
//     <header className="header-overlay">
//       <div className="logo">
//         <Link to="/" className="logo-link" aria-label="House of MUSA">
//           <img src={logoImg} alt="House of MUSA" className="logo-img" />
//         </Link>
//       </div>

//       {/* Desktop nav */}
//       <nav className="nav" aria-label="Primary">
//         <Link to="/">Home</Link>
//         <Link to="/about">About</Link>
//         <Link to="/project">Projects</Link>
//         <Link to="/contact">Contact</Link>
//         <Link to="/carrers">Carrers</Link>
//       </nav>

//       {/* Mobile hamburger */}
//       <button
//         className="menu-btn"
//         aria-label={open ? "Close menu" : "Open menu"}
//         aria-expanded={open}
//         aria-controls="mobile-nav"
//         onClick={() => setOpen((v) => !v)}
//       >
//         {/* icon */}
//         {!open ? (
//           <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
//             <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//           </svg>
//         ) : (
//           <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
//             <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//           </svg>
//         )}
//       </button>

//       {/* Mobile dropdown panel */}
//       <div id="mobile-nav" className={`mobile-panel ${open ? "open" : ""}`}>
//         <Link to="/">Home</Link>
//         <Link to="/about">About</Link>
//         <Link to="/project">Projects</Link>
//         <Link to="/contact">Contact</Link>
//         <Link to="/carrers">Carrers</Link>
//       </div>
//     </header>
//   );
// }























// src/components/HeaderMobile.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logoImg from "/logo/logo-black.png";
import { usePageTransition } from "./transition";

export default function HeaderMobile() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { start } = usePageTransition();

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleNavClick = (e, to) => {
    e.preventDefault();
    setOpen(false);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    start(to, {
      x,
      y,
      duration: 0.65,
      ease: "power4.inOut",
    });
  };

  return (
    <header className="header-overlay">
      <div className="logo">
        <Link
          to="/"
          className="logo-link"
          aria-label="House of MUSA"
          onClick={(e) => handleNavClick(e, "/")}
        >
          <img src={logoImg} alt="House of MUSA" className="logo-img" />
        </Link>
      </div>

      {/* Mobile hamburger */}
      <button
        className="menu-btn"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((v) => !v)}
      >
        {!open ? (
          <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M3 6h18M3 12h18M3 18h18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M6 6l12 12M18 6l-12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>

      {/* Mobile dropdown panel */}
      <div
        id="mobile-nav"
        className={`mobile-panel ${open ? "open" : ""}`}
      >
        <Link to="/" onClick={(e) => handleNavClick(e, "/")}>
          Home
        </Link>
        <Link to="/about" onClick={(e) => handleNavClick(e, "/about")}>
          About
        </Link>
        <Link to="/project" onClick={(e) => handleNavClick(e, "/project")}>
          Projects
        </Link>
        <Link to="/contact" onClick={(e) => handleNavClick(e, "/contact")}>
          Contact
        </Link>
        <Link to="/carrers" onClick={(e) => handleNavClick(e, "/carrers")}>
          Carrers
        </Link>
      </div>
    </header>
  );
}
