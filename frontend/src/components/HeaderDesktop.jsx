

import React from "react";
import { Link } from "react-router-dom";
import logoImg from "/logo/logo.png";

const Header = () => (
  <header className="header-overlay">
    <div className="logo">
      <img src={logoImg} alt="House of MUSA" className="logo-img" />
    </div>

    <nav className="nav">
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/project">Projects</Link>
      <Link to="/contact">Contact</Link>
      <Link to="/carrers">Carrers</Link>
    </nav>
  </header>
);

export default Header;

