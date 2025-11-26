

// components/TransitionProvider.jsx
import React, { createContext, useContext, useRef, useState, useCallback, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

const TransitionCtx = createContext({ start: (_to, _opts) => {} });
export const usePageTransition = () => useContext(TransitionCtx);

export default function TransitionProvider({ children }) {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);

  const rootRef = useRef(null);      // overlay root (captures pointer during anim)
  const bubbleRef = useRef(null);    // the circle we scale
  const tlRef = useRef(null);        // reuse timeline for smoother perf

  // Ensure GSAP doesn't fight StrictMode double-invoke
  useLayoutEffect(() => {
    tlRef.current = gsap.timeline({ paused: true });
    return () => {
      tlRef.current?.kill();
      tlRef.current = null;
    };
  }, []);

  const start = useCallback((to, opts = {}) => {
    const { x, y, duration = 0.65, ease = "power4.inOut" } = opts;
    const cx = Number.isFinite(x) ? x : window.innerWidth / 2;
    const cy = Number.isFinite(y) ? y : window.innerHeight / 2;

    // Maximum radius needed to cover the viewport from (cx, cy)
    const dx = Math.max(cx, window.innerWidth - cx);
    const dy = Math.max(cy, window.innerHeight - cy);
    const R = Math.hypot(dx, dy); // px

    setActive(true);

    // Size + position the bubble in px so scale(1) fully covers view
    const bubble = bubbleRef.current;
    const root = rootRef.current;
    const size = R * 2;

    // Reset styles before anim
    gsap.set(root, { pointerEvents: "auto" });
    gsap.set(bubble, {
      width: size,
      height: size,
      x: cx - R,
      y: cy - R,
      scale: 0,
      opacity: 1,
      willChange: "transform, opacity",
      force3D: true,
    });

    // Build a clean timeline each run (reuse ref to avoid allocations)
    const tl = gsap.timeline({
      defaults: { ease, duration },
      onComplete: () => {
        // after IN → navigate → OUT
        navigate(to);

        // OUT (reveal new page)
        gsap.fromTo(
          bubble,
          { scale: 1, opacity: 1 },
          {
            scale: 0,
            opacity: 0.98,       // tiny opacity helps banding on some panels
            duration,
            ease,
            onComplete: () => {
              gsap.set(root, { pointerEvents: "none" });
              setActive(false);
            },
          }
        );
      },
    });

    // IN (cover old page)
    tl.to(bubble, { scale: 1, opacity: 1 });
  }, [navigate]);

  return (
    <TransitionCtx.Provider value={{ start }}>
      {children}
      {createPortal(
        <div
          ref={rootRef}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            pointerEvents: "none",
            contain: "strict",          // isolate for perf
          }}
        >
          {/* The scaling circle */}
          <div
            ref={bubbleRef}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              borderRadius: "50%",
              background: "radial-gradient(circle, #000 60%, #000 100%)",
              opacity: 0,
              transform: "scale(0)",
              // GPU-friendly props:
              willChange: "transform, opacity",
              backfaceVisibility: "hidden",
              filter: "none",
            }}
          />
        </div>,
        document.body
      )}
    </TransitionCtx.Provider>
  );
}
