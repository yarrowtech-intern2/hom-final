import React, { useEffect, useState } from "react";
import { Html } from "@react-three/drei";
import "./viewIndicator.css";

export default function ViewTutorialIndicator() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 2200);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <Html fullscreen>
      <div className="view-tutorial-indicator">
        <div className="ripple" />
        <div className="icon">
          <svg width="48" height="48" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="20" fill="#222" opacity="0.7" />
            <path
              d="M24 16v16M16 24h16"
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="text">
          <strong>Tip:</strong> Use your mouse to <span>zoom</span> and <span>rotate</span> the
          view!
        </div>
      </div>
    </Html>
  );
}
