import React, { useEffect, useMemo, useState } from "react";
import "../styles/loader.css";

const DURATION_MS = 2100;
const HOLD_AT_100_MS = 220;
const REVEAL_MS = 1450;
const LOGO_SRC = "/logo/logo-white.png";
const TARGET_DESKTOP = { left: 28, top: 18, width: 170 };
const TARGET_MOBILE = { left: 16, top: 12, width: 132 };
const CURTAIN_COLUMNS = 6;
const CURTAIN_BLOCKS = Array.from({ length: CURTAIN_COLUMNS }, (_, idx) => ({
  left: `${(idx * 100) / CURTAIN_COLUMNS}%`,
  width: `${100 / CURTAIN_COLUMNS}%`,
  top: "0%",
  bottom: "0%",
  delay: idx * 90,
}));

export default function GlobalLoader({ children }) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("loading");
  const [target, setTarget] = useState(TARGET_DESKTOP);
  const [logoAspect, setLogoAspect] = useState(2.9);

  useEffect(() => {
    let rafId = 0;
    let holdTimer = 0;
    let doneTimer = 0;
    const start = performance.now();

    setLoading(true);
    setProgress(0);
    setPhase("loading");

    const tick = (now) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / DURATION_MS);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));

      if (t < 1) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      holdTimer = window.setTimeout(() => {
        setPhase("revealing");
        doneTimer = window.setTimeout(() => {
          setLoading(false);
          setProgress(0);
          setPhase("done");
        }, REVEAL_MS);
      }, HOLD_AT_100_MS);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(holdTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  useEffect(() => {
    const updateTarget = () => {
      const isMobile = window.innerWidth <= 768;
      setTarget(isMobile ? TARGET_MOBILE : TARGET_DESKTOP);
    };

    updateTarget();
    window.addEventListener("resize", updateTarget);
    return () => window.removeEventListener("resize", updateTarget);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = LOGO_SRC;
    img.onload = () => {
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        setLogoAspect(img.naturalWidth / img.naturalHeight);
      }
    };
  }, []);

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    if (loading) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = previousBodyOverflow || "auto";
      document.documentElement.style.overflow = previousHtmlOverflow || "auto";
    }

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [loading]);

  const overlayStyle = useMemo(
    () => {
      const targetHeight = target.width / logoAspect;
      const finalCenterX = target.left + target.width / 2;
      const finalCenterY = target.top + targetHeight / 2;

      return {
        "--loader-logo-left": `${target.left}px`,
        "--loader-logo-top": `${target.top}px`,
        "--loader-logo-width": `${target.width}px`,
        "--loader-logo-final-left": `${Math.round(finalCenterX)}px`,
        "--loader-logo-final-top": `${Math.round(finalCenterY)}px`,
      };
    },
    [target, logoAspect]
  );
  const pinnedLogoStyle = useMemo(
    () => ({
      left: `${target.left}px`,
      top: `${target.top}px`,
      width: `${target.width}px`,
    }),
    [target]
  );
  const showPage = phase !== "loading";
  const showPinnedLogo = phase === "done";

  return (
    <>
      {loading && (
        <div
          className={`global-loader-overlay ${
            phase === "revealing" ? "is-revealing" : ""
          }`}
          style={overlayStyle}
          aria-live="polite"
          aria-label="Page loading"
        >
          <div className="global-loader-curtain-stack" aria-hidden="true">
            {CURTAIN_BLOCKS.map((step, idx) => (
              <div
                key={`${step.left}-${idx}`}
                className="global-loader-curtain-step"
                style={{
                  left: step.left,
                  width: step.width,
                  top: step.top,
                  bottom: step.bottom,
                  "--step-delay": `${step.delay}ms`,
                }}
              />
            ))}
          </div>

          <img
            src={LOGO_SRC}
            alt="House of MUSA"
            className="global-loader-logo"
            draggable="false"
          />

          <div className="global-loader-progress-wrap">
            <p className="global-loader-progress-value">
              {progress}
              <span>%</span>
            </p>
          </div>
        </div>
      )}

      {showPinnedLogo && (
        <img
          src={LOGO_SRC}
          alt="House of MUSA"
          className="global-pinned-logo"
          style={pinnedLogoStyle}
          draggable="false"
        />
      )}

      <div
        className={`page-transition-wrapper ${
          showPage ? "page-transition--visible" : "page-transition--hidden"
        }`}
      >
        {children}
      </div>
    </>
  );
}
