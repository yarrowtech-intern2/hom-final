// Header.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logoImg from "/logo/logo.png";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // Close menu on route change or ESC
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="header-overlay">
      <div className="logo">
        <Link to="/" className="logo-link" aria-label="House of MUSA">
          <img src={logoImg} alt="House of MUSA" className="logo-img" />
        </Link>
      </div>

      {/* Desktop nav */}
      <nav className="nav" aria-label="Primary">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/project">Projects</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/carrers">Carrers</Link>
      </nav>

      {/* Mobile hamburger */}
      <button
        className="menu-btn"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((v) => !v)}
      >
        {/* icon */}
        {!open ? (
          <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )}
      </button>

      {/* Mobile dropdown panel */}
      <div id="mobile-nav" className={`mobile-panel ${open ? "open" : ""}`}>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/project">Projects</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/carrers">Carrers</Link>
      </div>
    </header>
  );
}
