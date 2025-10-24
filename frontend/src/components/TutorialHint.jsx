import React, { useEffect, useState } from "react";
import "./TutorialHint.css";

export default function TutorialHint() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show after 2.5s
    const timer = setTimeout(() => setShow(true), 5500);

    // Hide on first user interaction
    const handleUserInteraction = () => setShow(false);

    window.addEventListener("mousedown", handleUserInteraction);
    window.addEventListener("wheel", handleUserInteraction);
    window.addEventListener("touchstart", handleUserInteraction);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousedown", handleUserInteraction);
      window.removeEventListener("wheel", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
    };
  }, []);

  if (!show) return null;

  return (
    <div className="tutorial-hint">
      <div className="hint-box">
        <span className="hint-title">💡 Tip:</span>
        <p>Rotate and zoom using your <b>mouse</b></p>
      </div>
    </div>
  );
}
