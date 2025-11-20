


// import { useEffect, useState, useRef } from "react";
// import { motion } from "motion/react";

// export default function DecryptedText({
//   text,
//   speed = 50,
//   maxIterations = 10,
//   sequential = false,
//   revealDirection = "start",
//   useOriginalCharsOnly = false,
//   characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+",
//   className = "",
//   parentClassName = "",
//   encryptedClassName = "",
//   animateOn = "hover", // 'hover' | 'view' | 'both'
//   ...props
// }) {
//   const [displayText, setDisplayText] = useState(text);
//   const [isHovering, setIsHovering] = useState(false);
//   const [isScrambling, setIsScrambling] = useState(false);
//   const [revealedIndices, setRevealedIndices] = useState(new Set());
//   const [hasAnimated, setHasAnimated] = useState(false);
//   const containerRef = useRef(null);

//   const isTouchDevice =
//     typeof window !== "undefined" &&
//     ("ontouchstart" in window || navigator.maxTouchPoints > 0);

//   // On touch devices, treat "hover" as "view"
//   const shouldUseViewObserver =
//     animateOn === "view" ||
//     animateOn === "both" ||
//     (isTouchDevice && animateOn === "hover");

//   const hoverEnabled =
//     !isTouchDevice && (animateOn === "hover" || animateOn === "both");

//   useEffect(() => {
//     let interval;
//     let currentIteration = 0;

//     const getNextIndex = (revealedSet) => {
//       const textLength = text.length;
//       switch (revealDirection) {
//         case "start":
//           return revealedSet.size;
//         case "end":
//           return textLength - 1 - revealedSet.size;
//         case "center": {
//           const middle = Math.floor(textLength / 2);
//           const offset = Math.floor(revealedSet.size / 2);
//           const nextIndex =
//             revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1;

//           if (
//             nextIndex >= 0 &&
//             nextIndex < textLength &&
//             !revealedSet.has(nextIndex)
//           ) {
//             return nextIndex;
//           }
//           for (let i = 0; i < textLength; i++) {
//             if (!revealedSet.has(i)) return i;
//           }
//           return 0;
//         }
//         default:
//           return revealedSet.size;
//       }
//     };

//     const availableChars = useOriginalCharsOnly
//       ? Array.from(new Set(text.split(""))).filter((char) => char !== " ")
//       : characters.split("");

//     const shuffleText = (originalText, currentRevealed) => {
//       if (useOriginalCharsOnly) {
//         const positions = originalText.split("").map((char, i) => ({
//           char,
//           isSpace: char === " ",
//           index: i,
//           isRevealed: currentRevealed.has(i),
//         }));

//         const nonSpaceChars = positions
//           .filter((p) => !p.isSpace && !p.isRevealed)
//           .map((p) => p.char);

//         for (let i = nonSpaceChars.length - 1; i > 0; i--) {
//           const j = Math.floor(Math.random() * (i + 1));
//           [nonSpaceChars[i], nonSpaceChars[j]] = [
//             nonSpaceChars[j],
//             nonSpaceChars[i],
//           ];
//         }

//         let charIndex = 0;
//         return positions
//           .map((p) => {
//             if (p.isSpace) return " ";
//             if (p.isRevealed) return originalText[p.index];
//             return nonSpaceChars[charIndex++];
//           })
//           .join("");
//       } else {
//         return originalText
//           .split("")
//           .map((char, i) => {
//             if (char === " ") return " ";
//             if (currentRevealed.has(i)) return originalText[i];
//             return availableChars[Math.floor(Math.random() * availableChars.length)];
//           })
//           .join("");
//       }
//     };

//     if (isHovering) {
//       setIsScrambling(true);
//       interval = setInterval(() => {
//         setRevealedIndices((prevRevealed) => {
//           if (sequential) {
//             if (prevRevealed.size < text.length) {
//               const nextIndex = getNextIndex(prevRevealed);
//               const newRevealed = new Set(prevRevealed);
//               newRevealed.add(nextIndex);
//               setDisplayText(shuffleText(text, newRevealed));
//               return newRevealed;
//             } else {
//               clearInterval(interval);
//               setIsScrambling(false);
//               return prevRevealed;
//             }
//           } else {
//             setDisplayText(shuffleText(text, prevRevealed));
//             currentIteration++;
//             if (currentIteration >= maxIterations) {
//               clearInterval(interval);
//               setIsScrambling(false);
//               setDisplayText(text);
//             }
//             return prevRevealed;
//           }
//         });
//       }, speed);
//     } else {
//       setDisplayText(text);
//       setRevealedIndices(new Set());
//       setIsScrambling(false);
//     }

//     return () => {
//       if (interval) clearInterval(interval);
//     };
//   }, [
//     isHovering,
//     text,
//     speed,
//     maxIterations,
//     sequential,
//     revealDirection,
//     characters,
//     useOriginalCharsOnly,
//   ]);

//   useEffect(() => {
//     if (!shouldUseViewObserver) return;

//     const observerCallback = (entries) => {
//       entries.forEach((entry) => {
//         if (entry.isIntersecting && !hasAnimated) {
//           setIsHovering(true);
//           setHasAnimated(true);
//         }
//       });
//     };

//     const observerOptions = {
//       root: null,
//       rootMargin: "0px",
//       threshold: 0.1,
//     };

//     const observer = new IntersectionObserver(observerCallback, observerOptions);
//     const currentRef = containerRef.current;
//     if (currentRef) {
//       observer.observe(currentRef);
//     }

//     return () => {
//       if (currentRef) observer.unobserve(currentRef);
//     };
//   }, [shouldUseViewObserver, hasAnimated]);

//   const hoverProps = hoverEnabled
//     ? {
//         onMouseEnter: () => setIsHovering(true),
//         onMouseLeave: () => setIsHovering(false),
//       }
//     : {};

//   return (
//     <motion.span
//       ref={containerRef}
//       className={`inline-block max-w-full break-words whitespace-pre-wrap ${parentClassName}`}
//       {...hoverProps}
//       {...props}
//     >
//       {/* For screen readers */}
//       <span className="sr-only">{displayText}</span>

//       {/* Visual text */}
//       <span aria-hidden="true">
//         {displayText.split("").map((char, index) => {
//           const isRevealedOrDone =
//             revealedIndices.has(index) || !isScrambling || !isHovering;

//           return (
//             <span
//               key={index}
//               className={isRevealedOrDone ? className : encryptedClassName}
//             >
//               {char}
//             </span>
//           );
//         })}
//       </span>
//     </motion.span>
//   );
// }





















import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";

export default function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = "start",
  useOriginalCharsOnly = false,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+",
  className = "",
  parentClassName = "",
  encryptedClassName = "",
  animateOn = "hover", // hover | view | both
  ...props
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState(new Set());
  const [hasAnimated, setHasAnimated] = useState(false);

  const containerRef = useRef(null);

  const isTouchDevice =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  // Convert hover → view for touch screens
  const shouldUseViewObserver =
    animateOn === "view" ||
    animateOn === "both" ||
    (isTouchDevice && animateOn === "hover");

  const hoverEnabled =
    !isTouchDevice && (animateOn === "hover" || animateOn === "both");

  /* --------------------------------------------------
     SCRAMBLE EFFECT
  -------------------------------------------------- */
  useEffect(() => {
    let interval;
    let currentIteration = 0;

    const getNextIndex = (set) => {
      const len = text.length;
      switch (revealDirection) {
        case "start":
          return set.size;
        case "end":
          return len - 1 - set.size;
        case "center": {
          const mid = Math.floor(len / 2);
          const offset = Math.floor(set.size / 2);
          const next =
            set.size % 2 === 0 ? mid + offset : mid - offset - 1;

          if (next >= 0 && next < len && !set.has(next)) return next;

          for (let i = 0; i < len; i++) {
            if (!set.has(i)) return i;
          }
          return 0;
        }
        default:
          return set.size;
      }
    };

    const charPool = useOriginalCharsOnly
      ? Array.from(new Set(text.replace(/ /g, "")))
      : characters.split("");

    const shuffle = (original, revealed) =>
      original
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (revealed.has(i)) return original[i];
          return charPool[Math.floor(Math.random() * charPool.length)];
        })
        .join("");

    if (isHovering) {
      setIsScrambling(true);
      interval = setInterval(() => {
        setRevealedIndices((prev) => {
          if (sequential) {
            if (prev.size < text.length) {
              const idx = getNextIndex(prev);
              const updated = new Set(prev);
              updated.add(idx);
              setDisplayText(shuffle(text, updated));
              return updated;
            } else {
              clearInterval(interval);
              setIsScrambling(false);
              return prev;
            }
          } else {
            setDisplayText(shuffle(text, prev));
            currentIteration++;
            if (currentIteration >= maxIterations) {
              clearInterval(interval);
              setIsScrambling(false);
              setDisplayText(text);
            }
            return prev;
          }
        });
      }, speed);
    } else {
      setDisplayText(text);
      setRevealedIndices(new Set());
      setIsScrambling(false);
    }

    return () => interval && clearInterval(interval);
  }, [
    isHovering,
    text,
    speed,
    maxIterations,
    sequential,
    revealDirection,
    characters,
    useOriginalCharsOnly,
  ]);

  /* --------------------------------------------------
     VIEWPORT OBSERVER (mobile)
  -------------------------------------------------- */
  useEffect(() => {
    if (!shouldUseViewObserver) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !hasAnimated) {
            setIsHovering(true);
            setHasAnimated(true);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () =>
      containerRef.current && observer.unobserve(containerRef.current);
  }, [shouldUseViewObserver, hasAnimated]);

  /* Hover support only for desktop */
  const hoverProps = hoverEnabled
    ? {
        onMouseEnter: () => setIsHovering(true),
        onMouseLeave: () => setIsHovering(false),
      }
    : {};

return (
  <motion.span
    ref={containerRef}
    className={`inline-block max-w-full break-words whitespace-pre-wrap ${parentClassName}`}
    aria-label={displayText}
    role="text"
    {...hoverProps}
    {...props}
  >
    {/* Only visual text, no extra sr-only copy */}
    <span aria-hidden="true">
      {displayText.split("").map((char, i) => {
        const show =
          revealedIndices.has(i) || !isScrambling || !isHovering;

        return (
          <span
            key={i}
            className={show ? className : encryptedClassName}
          >
            {char}
          </span>
        );
      })}
    </span>
  </motion.span>
);
}
