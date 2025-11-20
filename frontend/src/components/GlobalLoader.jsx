// src/components/GlobalLoader.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/loader.css"; // or "../index.css" if you prefer

const DURATION = 1200; // ms – how long the loader should take per route

export default function GlobalLoader({ children }) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 🔁 run on every route change
    setLoading(true);
    setProgress(0);

    const start = performance.now();
    let frameId;

    const step = (now) => {
      const elapsed = now - start;
      // smooth ease-out progress
      const t = Math.min(1, elapsed / DURATION);
      const eased = 1 - Math.pow(1 - t, 3); // cubic easeOut
      const pct = Math.round(eased * 100);

      setProgress(pct);

      if (t < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        // small delay so 100% is visible, then hide loader
        setTimeout(() => {
          setLoading(false);
          setProgress(0);
        }, 250);
      }
    };

    frameId = requestAnimationFrame(step);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [location.pathname]);

  return (
    <>
      {loading && (
        <div className="global-loader-overlay">
          <div className="loader">
            <span></span>
          </div>

          <div className="loader-text-wrapper">
            <p className="loader-text-label">Loading, please wait...</p>
            <p className="loader-text-percentage">
              {progress}
              <span className="loader-text-percent-symbol">%</span>
            </p>
          </div>
        </div>
      )}

      {/* Page content with entry animation when loader finishes */}
      <div
        className={`page-transition-wrapper ${
          loading ? "page-transition--hidden" : "page-transition--visible"
        }`}
      >
        {children}
      </div>
    </>
  );
}
