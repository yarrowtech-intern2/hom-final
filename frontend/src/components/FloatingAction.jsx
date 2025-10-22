import React from "react";
import { useNavigate } from "react-router-dom";
import "./FloatingAction.css";

export default function FloatingAction({ to = "/contact", ariaLabel = "Open contact" }) {
  const navigate = useNavigate();
  return (
    <button
      className="fab"
      aria-label={ariaLabel}
      onClick={() => navigate(to)}
    >
      {/* <span className="fab-icon">↗</span> */}
      <span className="fab-icon">H</span>
      <span className="fab-ripple" />
    </button>
  );
}
