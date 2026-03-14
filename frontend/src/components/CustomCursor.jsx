import { useEffect, useRef } from "react";

// Pure DOM + rAF cursor — zero React re-renders
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    // Skip on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Hide native cursor globally
    document.documentElement.style.cursor = "none";

    let mx = -100, my = -100; // mouse target
    let rx = -100, ry = -100; // ring lerped position
    let isDown = false;
    let isHover = false;

    const LERP = 0.13; // ring lag factor (lower = more lag)

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const onDown = () => {
      isDown = true;
      dot.style.transform = "translate(-50%,-50%) scale(0.55)";
      ring.style.transform = "translate(-50%,-50%) scale(0.7)";
    };

    const onUp = () => {
      isDown = false;
      const s = isHover ? "scale(2.4)" : "scale(1)";
      dot.style.transform = `translate(-50%,-50%) ${s}`;
      ring.style.transform = `translate(-50%,-50%) ${isHover ? "scale(1.6)" : "scale(1)"}`;
    };

    const setHover = (state) => {
      isHover = state;
      if (isDown) return;
      if (state) {
        dot.style.transform = "translate(-50%,-50%) scale(2.4)";
        dot.style.opacity = "0.15";
        ring.style.transform = "translate(-50%,-50%) scale(1.6)";
        ring.style.borderColor = "rgba(255,255,255,0.9)";
      } else {
        dot.style.transform = "translate(-50%,-50%) scale(1)";
        dot.style.opacity = "1";
        ring.style.transform = "translate(-50%,-50%) scale(1)";
        ring.style.borderColor = "rgba(255,255,255,0.6)";
      }
    };

    const onEnter = (e) => {
      const el = e.target.closest("a,button,[data-cursor-hover],input,textarea,select,label,[role='button']");
      if (el) setHover(true);
    };
    const onLeave = (e) => {
      const el = e.target.closest("a,button,[data-cursor-hover],input,textarea,select,label,[role='button']");
      if (el) setHover(false);
    };

    // RAF loop — lerp ring towards mouse
    const tick = () => {
      rx += (mx - rx) * LERP;
      ry += (my - ry) * LERP;

      // dot snaps instantly
      dot.style.left = mx + "px";
      dot.style.top = my + "px";

      // ring lerps
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseover", onEnter);
    document.addEventListener("mouseout", onLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.documentElement.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseover", onEnter);
      document.removeEventListener("mouseout", onLeave);
    };
  }, []);

  return (
    <>
      {/* Dot — snaps to cursor */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: -100,
          left: -100,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#ffffff",
          transform: "translate(-50%,-50%) scale(1)",
          pointerEvents: "none",
          zIndex: 99999,
          mixBlendMode: "difference",
          transition: "transform 0.18s cubic-bezier(.23,1,.32,1), opacity 0.18s ease",
          willChange: "left, top, transform",
        }}
      />
      {/* Ring — lerps behind */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: -100,
          left: -100,
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "1.5px solid rgba(255,255,255,0.6)",
          transform: "translate(-50%,-50%) scale(1)",
          pointerEvents: "none",
          zIndex: 99998,
          mixBlendMode: "difference",
          transition: "transform 0.28s cubic-bezier(.23,1,.32,1), border-color 0.22s ease",
          willChange: "left, top, transform",
        }}
      />
    </>
  );
}
