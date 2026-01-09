// src/components/GlobalLoader.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Lottie from "lottie-react";
import loaderAnimation from "../assets/loader/run-lol.json";
import "../styles/loader.css";

const DURATION = 1200; // ms

export default function GlobalLoader({ children }) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setLoading(true);
    setProgress(0);

    const start = performance.now();
    let frameId;

    const step = (now) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / DURATION);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));

      if (t < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setTimeout(() => {
          setLoading(false);
          setProgress(0);
        }, 250);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [location.pathname]);

  return (
    <>
      {loading && (
        <div className="global-loader-overlay">
          {/* 🔁 LOTTIE LOADER */}
          <div style={{ width: 220, height: 220 }}>
            <Lottie
              animationData={loaderAnimation}
              loop
              autoplay
            />
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

      <div
        className={`page-transition-wrapper ${
          loading
            ? "page-transition--hidden"
            : "page-transition--visible"
        }`}
      >
        {children}
      </div>
    </>
  );
}
