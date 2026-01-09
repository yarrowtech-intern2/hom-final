// // src/components/GlobalLoader.jsx
// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import Lottie from "lottie-react";
// import loaderAnimation from "../assets/loader/run-lol.json";
// import "../styles/loader.css";

// const DURATION = 1200; // ms

// export default function GlobalLoader({ children }) {
//   const location = useLocation();
//   const [loading, setLoading] = useState(true);
//   const [progress, setProgress] = useState(0);

//   useEffect(() => {
//     setLoading(true);
//     setProgress(0);

//     const start = performance.now();
//     let frameId;

//     const step = (now) => {
//       const elapsed = now - start;
//       const t = Math.min(1, elapsed / DURATION);
//       const eased = 1 - Math.pow(1 - t, 3);
//       setProgress(Math.round(eased * 100));

//       if (t < 1) {
//         frameId = requestAnimationFrame(step);
//       } else {
//         setTimeout(() => {
//           setLoading(false);
//           setProgress(0);
//         }, 250);
//       }
//     };

//     frameId = requestAnimationFrame(step);
//     return () => cancelAnimationFrame(frameId);
//   }, [location.pathname]);

//   return (
//     <>
//       {loading && (
//         <div className="global-loader-overlay">
//           {/* 🔁 LOTTIE LOADER */}
//           <div style={{ width: 220, height: 220 }}>
//             <Lottie
//               animationData={loaderAnimation}
//               loop
//               autoplay
//             />
//           </div>

//           <div className="loader-text-wrapper">
//             <p className="loader-text-label">Loading, please wait...</p>
//             <p className="loader-text-percentage">
//               {progress}
//               <span className="loader-text-percent-symbol">%</span>
//             </p>
//           </div>
//         </div>
//       )}

//       <div
//         className={`page-transition-wrapper ${
//           loading
//             ? "page-transition--hidden"
//             : "page-transition--visible"
//         }`}
//       >
//         {children}
//       </div>
//     </>
//   );
// }
































// src/components/GlobalLoader.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Lottie from "lottie-react";

// ✅ Import your 3 lottie JSON files (update filenames/paths as per your project)
import loader1 from "../assets/loader/run-lol.json";
import loader2 from "../assets/loader/Counter.json";
import loader3 from "../assets/loader/Emoji.json";

import "../styles/loader.css";

const DURATION = 1200; // ms

const LOTTIES = [loader1, loader2, loader3];

export default function GlobalLoader({ children }) {
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // ✅ Randomized animation (changes on every route change)
  const [animation, setAnimation] = useState(LOTTIES[0]);

  // Keep token/headers etc. not needed here—only loader state
  useEffect(() => {
    setLoading(true);
    setProgress(0);

    // 🔀 pick random lottie per route change
    setAnimation(LOTTIES[Math.floor(Math.random() * LOTTIES.length)]);

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

  // (Optional) ensure scrolling is allowed (same behavior you had in your dashboard)
  useEffect(() => {
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;

    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";

    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, []);

  // Memo helps keep the lottie props stable
  const lottieProps = useMemo(
    () => ({
      animationData: animation,
      loop: true,
      autoplay: true,
    }),
    [animation]
  );

  return (
    <>
      {loading && (
        <div className="global-loader-overlay">
          {/* 🔁 RANDOM LOTTIE LOADER */}
          <div style={{ width: 320, height: 320 }}>
            <Lottie {...lottieProps} />
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
          loading ? "page-transition--hidden" : "page-transition--visible"
        }`}
      >
        {children}
      </div>
    </>
  );
}
