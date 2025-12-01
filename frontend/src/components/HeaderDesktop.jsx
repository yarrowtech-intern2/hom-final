

// import React from "react";
// import { Link } from "react-router-dom";
// import logoImg from "/logo/logo-black.png";

// const Header = () => (
//   <header className="header-overlay">
//     <div className="logo">
//       <img src={logoImg} alt="House of MUSA" className="logo-img" />
//     </div>

//     <nav className="nav">
//       <Link to="/">Home</Link>
//       <Link to="/about">About</Link>
//       <Link to="/project">Projects</Link>
//       <Link to="/contact">Contact</Link>
//       <Link to="/carrers">Carrers</Link>
//     </nav>
//   </header>
// );

// export default Header;
















// src/components/HeaderDesktop.jsx
import React from "react";
import { Link } from "react-router-dom";
import logoImg from "/logo/logo-black.png";
import { usePageTransition } from "./transition";

export default function HeaderDesktop() {
  const { start } = usePageTransition();

  const handleNavClick = (e, to) => {
    e.preventDefault();

    // Center of the clicked nav item (for circular ripple origin)
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

      <nav className="nav">
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
      </nav>
    </header>
  );
}

