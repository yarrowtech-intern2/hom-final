// // components/TransitionProvider.jsx
// import React, { createContext, useContext, useRef, useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom";

// const TransitionCtx = createContext({ start: (to) => {} });
// export const usePageTransition = () => useContext(TransitionCtx);

// export default function TransitionProvider({ children }) {
//   const [active, setActive] = useState(false);
//   const [phase, setPhase] = useState("idle"); // 'idle' | 'out' | 'in'
//   const timerRef = useRef(null);
//   const navigate = useNavigate();

//   const start = useCallback((to) => {
//     if (active) return;
//     setActive(true);
//     setPhase("out");
//     // Fade-out duration must match CSS (.route-fade)
//     timerRef.current = setTimeout(() => {
//       navigate(to);
//       setPhase("in");
//       // Small delay to allow new page mount before fade-in
//       setTimeout(() => {
//         setPhase("idle");
//         setActive(false);
//       }, 450);
//     }, 450);
//   }, [active, navigate]);

//   return (
//     <TransitionCtx.Provider value={{ start }}>
//       {children}
//       {/* Overlay */}
//       <div
//         className={`route-fade ${active ? (phase === "out" ? "show" : "hide") : ""}`}
//         style={{
//           pointerEvents: "none",
//           position: "fixed",
//           inset: 0,
//           background: "#000",
//           opacity: 0,
//           transition: "opacity 450ms ease",
//           zIndex: 9999,
//         }}
//       />
//       <style>{`
//         .route-fade.show { opacity: 1; }
//         .route-fade.hide { opacity: 0; }
//       `}</style>
//     </TransitionCtx.Provider>
//   );
// }




// // components/TransitionProvider.jsx
// import React, { createContext, useContext, useRef, useState, useCallback } from "react";
// import { createPortal } from "react-dom";
// import { useNavigate } from "react-router-dom";
// import gsap from "gsap";

// const TransitionCtx = createContext({ start: (_to, _opts) => {} });
// export const usePageTransition = () => useContext(TransitionCtx);

// export default function TransitionProvider({ children }) {
//   const navigate = useNavigate();
//   const [active, setActive] = useState(false);
//   const circleRef = useRef(null);
//   const rootRef = useRef(null);

//   // Compute a big enough radius to cover the viewport
//   const fullRadius = () => {
//     const w = window.innerWidth;
//     const h = window.innerHeight;
//     // diagonal * 0.6-ish is enough; 120vmax equivalent
//     return Math.hypot(w, h);
//   };

//   const start = useCallback((to, opts = {}) => {
//     const { x, y } = opts; // screen coords (clientX/clientY)
//     const cx = typeof x === "number" ? x : window.innerWidth / 2;
//     const cy = typeof y === "number" ? y : window.innerHeight / 2;
//     const R = fullRadius();

//     setActive(true);

//     // Prep
//     gsap.set(circleRef.current, {
//       clipPath: `circle(0px at ${cx}px ${cy}px)`,
//       opacity: 1,
//       display: "block",
//     });
//     gsap.set(rootRef.current, { pointerEvents: "auto" });

//     // OUT: expand to black, then navigate
//     gsap.to(circleRef.current, {
//       clipPath: `circle(${R}px at ${cx}px ${cy}px)`,
//       duration: 0.6,
//       ease: "power3.inOut",
//       onComplete: () => {
//         navigate(to);

//         // IN: shrink to reveal new page
//         gsap.fromTo(
//           circleRef.current,
//           { clipPath: `circle(${R}px at ${cx}px ${cy}px)` },
//           {
//             clipPath: `circle(0px at ${cx}px ${cy}px)`,
//             duration: 0.6,
//             ease: "power3.inOut",
//             onComplete: () => {
//               gsap.set(circleRef.current, { display: "none" });
//               gsap.set(rootRef.current, { pointerEvents: "none" });
//               setActive(false);
//             },
//           }
//         );
//       },
//     });
//   }, [navigate]);

//   return (
//     <TransitionCtx.Provider value={{ start }}>
//       {children}
//       {createPortal(
//         <div
//           ref={rootRef}
//           style={{
//             position: "fixed",
//             inset: 0,
//             zIndex: 9999,
//             pointerEvents: "none",
//           }}
//         >
//           <div
//             ref={circleRef}
//             style={{
//               position: "absolute",
//               inset: 0,
//               background:
//                 "radial-gradient(closest-side, rgba(0,0,0,1) 98%, rgba(0,0,0,1) 100%)",
//               display: active ? "block" : "none",
//               opacity: 0,
//               // Start with tiny circle; GSAP animates clipPath
//               clipPath: "circle(0px at 50% 50%)",
//             }}
//           />
//         </div>,
//         document.body
//       )}
//     </TransitionCtx.Provider>
//   );
// }






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
