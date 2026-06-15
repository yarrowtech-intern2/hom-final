import React, { useEffect, useMemo, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";
import { useLocation } from "react-router-dom";
import "../styles/loader.css";

const MIN_VISIBLE_MS = 650;
const HOLD_AT_100_MS = 220;
const REVEAL_MS = 1450;
const THREE_GRACE_MS = 1500;
const LOGO_WHITE_SRC = "/logo/logo-white.png";
const LOGO_BLACK_SRC = "/logo/logo-black.png";
const TARGET_DESKTOP = { left: 18, top: 4, width: 122 };
const TARGET_MOBILE = { left: 10, top: 3, width: 96 };
const CURTAIN_COLUMNS = 6;
const CURTAIN_BLOCKS = Array.from({ length: CURTAIN_COLUMNS }, (_, idx) => ({
  left: `${(idx * 100) / CURTAIN_COLUMNS}%`,
  width: `${100 / CURTAIN_COLUMNS}%`,
  top: "0%",
  bottom: "0%",
  delay: idx * 90,
}));

function extractRgbTriples(value) {
  const colors = [];
  const normalized = String(value || "");
  const hexMatches = normalized.match(/#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})/g) || [];

  hexMatches.forEach((hex) => {
    const raw = hex.slice(1);
    const expanded =
      raw.length === 3
        ? raw
            .split("")
            .map((part) => part + part)
            .join("")
        : raw;
    const int = Number.parseInt(expanded, 16);
    colors.push([(int >> 16) & 255, (int >> 8) & 255, int & 255]);
  });

  const rgbRegex = /rgba?\(([^)]+)\)/g;
  let match;
  while ((match = rgbRegex.exec(normalized))) {
    const parts = match[1]
      .split(",")
      .map((part) => Number.parseFloat(part.trim()))
      .slice(0, 3);
    if (parts.length === 3 && parts.every((part) => Number.isFinite(part))) {
      colors.push(parts);
    }
  }

  return colors;
}

function getPerceivedBrightness([r, g, b]) {
  return (r * 299 + g * 587 + b * 114) / 1000 / 255;
}

function detectLogoVariant() {
  if (typeof window === "undefined") return LOGO_WHITE_SRC;

  const bodyStyle = window.getComputedStyle(document.body);
  const htmlStyle = window.getComputedStyle(document.documentElement);
  const backgroundTokens = [
    document.body.style.background,
    document.documentElement.style.background,
    bodyStyle.backgroundImage,
    bodyStyle.backgroundColor,
    htmlStyle.backgroundImage,
    htmlStyle.backgroundColor,
  ];

  const colors = backgroundTokens.flatMap(extractRgbTriples);
  if (colors.length === 0) return LOGO_WHITE_SRC;

  const averageBrightness =
    colors.reduce((sum, color) => sum + getPerceivedBrightness(color), 0) / colors.length;

  return averageBrightness >= 0.66 ? LOGO_BLACK_SRC : LOGO_WHITE_SRC;
}

export default function GlobalLoader({ children }) {
  const location = useLocation();
  const { active: threeActive, progress: threeProgressRaw, loaded: threeLoaded, total: threeTotal } =
    useProgress();

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("loading");
  const [target, setTarget] = useState(TARGET_DESKTOP);
  const [logoAspect, setLogoAspect] = useState(2.9);
  const [domReady, setDomReady] = useState(
    typeof document !== "undefined" ? document.readyState === "complete" : false
  );
  const [pinnedLogoSrc, setPinnedLogoSrc] = useState(LOGO_WHITE_SRC);
  const [fontsReady, setFontsReady] = useState(
    typeof document === "undefined" || !document.fonts || document.fonts.status === "loaded"
  );
  const [imageStats, setImageStats] = useState({ loaded: 0, total: 0 });
  const [seenThreeActivity, setSeenThreeActivity] = useState(false);
  const [threeGraceDone, setThreeGraceDone] = useState(false);
  const mountedAtRef = useRef(typeof performance !== "undefined" ? performance.now() : Date.now());
  const timersRef = useRef([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (threeActive || threeLoaded > 0 || threeTotal > 0) {
      setSeenThreeActivity(true);
    }
  }, [threeActive, threeLoaded, threeTotal]);

  useEffect(() => {
    const timerId = window.setTimeout(() => setThreeGraceDone(true), THREE_GRACE_MS);
    timersRef.current.push(timerId);
    return () => window.clearTimeout(timerId);
  }, []);

  useEffect(() => {
    if (domReady) return undefined;

    const onWindowLoad = () => setDomReady(true);
    window.addEventListener("load", onWindowLoad);
    return () => window.removeEventListener("load", onWindowLoad);
  }, [domReady]);

  useEffect(() => {
    if (fontsReady || typeof document === "undefined" || !document.fonts) return undefined;

    let cancelled = false;
    document.fonts.ready
      .then(() => {
        if (!cancelled) setFontsReady(true);
      })
      .catch(() => {
        if (!cancelled) setFontsReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [fontsReady]);

  useEffect(() => {
    if (!loading) return undefined;

    const computeImageStats = () => {
      const trackedImages = Array.from(document.images).filter((img) => {
        if (img.classList.contains("global-loader-logo") || img.classList.contains("global-pinned-logo")) {
          return false;
        }
        return img.loading !== "lazy";
      });

      const total = trackedImages.length;
      const loaded = trackedImages.filter((img) => img.complete).length;
      setImageStats({ loaded, total });
    };

    computeImageStats();
    const intervalId = window.setInterval(computeImageStats, 120);
    return () => window.clearInterval(intervalId);
  }, [loading]);

  const threePercent = useMemo(() => {
    if (seenThreeActivity) {
      return Math.max(0, Math.min(100, threeProgressRaw || 0));
    }
    return threeGraceDone ? 100 : 0;
  }, [seenThreeActivity, threeGraceDone, threeProgressRaw]);

  const imagePercent = useMemo(() => {
    if (imageStats.total === 0) return 100;
    return (imageStats.loaded / imageStats.total) * 100;
  }, [imageStats.loaded, imageStats.total]);

  const shellPercent = useMemo(() => {
    const readyCount = (domReady ? 1 : 0) + (fontsReady ? 1 : 0);
    return (readyCount / 2) * 100;
  }, [domReady, fontsReady]);

  const mergedProgress = useMemo(() => {
    const next = threePercent * 0.78 + imagePercent * 0.14 + shellPercent * 0.08;
    return Math.round(Math.max(0, Math.min(100, next)));
  }, [imagePercent, shellPercent, threePercent]);

  const threeReady = seenThreeActivity ? !threeActive && threePercent >= 99 : threeGraceDone;
  const imagesReady = imageStats.total === 0 || imageStats.loaded >= imageStats.total;
  const allReady = domReady && fontsReady && imagesReady && threeReady;

  useEffect(() => {
    if (!loading) return;
    setProgress((prev) => Math.max(prev, mergedProgress));
  }, [loading, mergedProgress]);

  useEffect(() => {
    if (!loading || phase !== "loading" || !allReady) return undefined;

    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
    setProgress(100);

    const elapsed = (typeof performance !== "undefined" ? performance.now() : Date.now()) - mountedAtRef.current;
    const minVisibleDelay = Math.max(0, MIN_VISIBLE_MS - elapsed);

    const revealTimer = window.setTimeout(() => {
      setPhase("revealing");

      const doneTimer = window.setTimeout(() => {
        setLoading(false);
        setProgress(0);
        setPhase("done");
      }, REVEAL_MS);
      timersRef.current.push(doneTimer);
    }, minVisibleDelay + HOLD_AT_100_MS);

    timersRef.current.push(revealTimer);

    return () => {
      window.clearTimeout(revealTimer);
    };
  }, [allReady, loading, phase]);

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
    img.src = LOGO_WHITE_SRC;
    img.onload = () => {
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        setLogoAspect(img.naturalWidth / img.naturalHeight);
      }
    };
  }, []);

  useEffect(() => {
    let frameId = 0;
    let timeoutId = 0;

    const updateLogo = () => setPinnedLogoSrc(detectLogoVariant());

    updateLogo();
    frameId = window.requestAnimationFrame(updateLogo);
    timeoutId = window.setTimeout(updateLogo, 120);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timeoutId);
    };
  }, [location.pathname, location.hash]);

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
  const suppressPinnedLogo =
    location.pathname === "/admin123" || location.pathname === "/admin1234";
  const showPinnedLogo = phase === "done" && !suppressPinnedLogo;

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
            src={LOGO_WHITE_SRC}
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
          src={pinnedLogoSrc}
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
