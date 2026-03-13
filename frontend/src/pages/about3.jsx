import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion as Motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import ytPoster from "../assets/posters/yt.png";
import greenbarPoster from "../assets/posters/greenbar.png";
import betterpassPoster from "../assets/posters/betterpass.png";
import "../styles/about3-hero.css";

const HERO_VIDEO_SRC =
  import.meta.env.VITE_ABOUT_HERO_VIDEO_URL ||
  "https://res.cloudinary.com/dc3qprub3/video/upload/f_auto,q_auto/hom-video_i9npos.mp4";
const MISSION_IMAGE_SRC =
  import.meta.env.VITE_ABOUT_MISSION_IMAGE_URL ||
  "https://images.unsplash.com/photo-1536148935331-408321065b18?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
const VISION_IMAGE_SRC =
  import.meta.env.VITE_ABOUT_VISION_IMAGE_URL ||
  "https://images.unsplash.com/photo-1507206130118-b5907f817163?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
const PURPOSE_IMAGE_SRC =
  import.meta.env.VITE_ABOUT_PURPOSE_IMAGE_URL ||
  "https://images.unsplash.com/photo-1579389083046-e3df9c2b3325?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
const PRINCIPLES_TOTAL = 3;
const METER_RADIUS = 172;
const TITLE_LINES = ["Building", "Digital", "Legacies."];
const DETAIL_ITEMS = [
  "ERP systems",
  "ML products",
  "Web platforms",
  "Motion-led storytelling",
];
const IDENTITY_LINES = [
  { text: "We engineer", accent: false },
  { text: "platforms,", accent: true },
  { text: "products that scale", accent: false },
];
const PROJECT_HEADLINE_LINES = ["See the work that", "moves ambitious brands"];
const PRINCIPLE_ITEMS = [
  {
    id: "01",
    title: "Mission",
    body:
      "To build digital systems that simplify operations, sharpen decision making, and turn ambitious business ideas into reliable products people can trust.",
    cardTitle: "System Thinking",
    cardBody:
      "ERP architecture, workflow automation, and interface systems designed for daily use at scale.",
    imageSrc: MISSION_IMAGE_SRC,
    imageAlt: "House of Musa mission visual",
  },
  {
    id: "02",
    title: "Vision",
    body:
      "To shape House of Musa into a studio where engineering, interface design, and motion-led storytelling work as one coherent product language.",
    cardTitle: "Brand + Product",
    cardBody:
      "A visual and technical standard that makes every launch feel clear, premium, and memorable.",
    imageSrc: VISION_IMAGE_SRC,
    imageAlt: "House of Musa vision visual",
  },
  {
    id: "03",
    title: "Purpose",
    body:
      "To help modern businesses move faster with platforms that remove friction, present the brand with confidence, and create room for long-term growth.",
    cardTitle: "Built To Scale",
    cardBody:
      "Performance-minded delivery across web platforms, AI-enabled tools, and tailored business systems.",
    imageSrc: PURPOSE_IMAGE_SRC,
    imageAlt: "House of Musa purpose visual",
  },
];
const FEATURED_PROJECTS = [
  {
    id: "01",
    title: "Yarrowtech",
    tagline: "ERP and AI ecosystem",
    summary:
      "Enterprise tooling, workflow logic, and product interfaces designed for operational clarity.",
    poster: ytPoster,
  },
  {
    id: "02",
    title: "Green-bar",
    tagline: "Commerce infrastructure",
    summary:
      "Ordering, inventory, and admin flows tailored for fast-moving fresh retail operations.",
    poster: greenbarPoster,
  },
  {
    id: "03",
    title: "Better-Pass",
    tagline: "Social travel marketplace",
    summary:
      "Discovery, bookings, and community-led conversion designed inside one scalable platform.",
    poster: betterpassPoster,
  },
];

const sectionStaggerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.12,
    },
  },
};

const sectionItemVariants = {
  hidden: {
    opacity: 0,
    y: 36,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const titleContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const titleLineVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.024,
    },
  },
};

const titleCharVariants = {
  hidden: {
    opacity: 0,
    y: "0.92em",
    rotateX: -90,
  },
  visible: {
    opacity: 1,
    y: "0em",
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function StaticTitleLines({ className = "", style }) {
  return (
    <Motion.div className={className} style={style}>
      {TITLE_LINES.map((line) => (
        <div key={line} className="about-hero__title-line">
          {line}
        </div>
      ))}
    </Motion.div>
  );
}

function AnimatedTitleLines({ className = "", style, reducedMotion }) {
  return (
    <Motion.div
      className={className}
      style={style}
      variants={reducedMotion ? undefined : titleContainerVariants}
      initial={reducedMotion ? false : "hidden"}
      animate={reducedMotion ? undefined : "visible"}
    >
      {TITLE_LINES.map((line, lineIndex) => {
        const isLastLine = lineIndex === TITLE_LINES.length - 1;

        return (
          <Motion.div
            key={line}
            className={`about-hero__title-line ${
              isLastLine ? "about-hero__title-line--pixel" : ""
            }`}
            data-text={line}
            variants={reducedMotion ? undefined : titleLineVariants}
          >
            {Array.from(line).map((char, charIndex) => (
              <span
                key={`${line}-${charIndex}`}
                className="about-hero__char-shell"
              >
                <Motion.span
                  className={`about-hero__char ${
                    char === " " ? "about-hero__char--space" : ""
                  }`}
                  variants={reducedMotion ? undefined : titleCharVariants}
                >
                  {char === " " ? "\u00A0" : char}
                </Motion.span>
              </span>
            ))}
          </Motion.div>
        );
      })}
    </Motion.div>
  );
}

export default function About3() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const identityRef = useRef(null);
  const principlesRef = useRef(null);
  const projectsRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const [activePrinciple, setActivePrinciple] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [isDesktopPinned, setIsDesktopPinned] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 961px)").matches
      : true
  );

  const { scrollYProgress } = useScroll({
    container: containerRef,
    target: heroRef,
    offset: ["start start", "end end"],
  });
  const { scrollYProgress: principlesProgress } = useScroll({
    container: containerRef,
    target: principlesRef,
    offset: ["start start", "end end"],
  });
  const { scrollYProgress: projectsProgress } = useScroll({
    container: containerRef,
    target: projectsRef,
    offset: ["start start", "end end"],
  });

  const spring = { stiffness: 120, damping: 24, mass: 0.32 };
  const noMotion = prefersReducedMotion ? 0 : 1;

  const videoScale = useSpring(
    useTransform(scrollYProgress, [0, 1], [1, 1 + 0.12 * noMotion]),
    spring
  );
  const videoY = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -48 * noMotion]),
    spring
  );
  const shellY = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -180 * noMotion]),
    spring
  );
  const shellOpacity = useTransform(scrollYProgress, [0, 0.72, 1], [1, 0.84, 0.16]);

  const titleLeadY = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -120 * noMotion]),
    spring
  );
  const titleTrailY = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -240 * noMotion]),
    spring
  );

  const bandTopX = useSpring(
    useTransform(scrollYProgress, [0, 0.16, 0.4, 0.7], [0, 0, -56 * noMotion, 18 * noMotion]),
    spring
  );
  const bandMiddleX = useSpring(
    useTransform(scrollYProgress, [0, 0.2, 0.45, 0.76], [0, 0, 72 * noMotion, -32 * noMotion]),
    spring
  );
  const bandBottomX = useSpring(
    useTransform(scrollYProgress, [0, 0.22, 0.52, 0.84], [0, 0, -94 * noMotion, 34 * noMotion]),
    spring
  );
  const bandTopY = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -36 * noMotion]),
    spring
  );
  const bandMiddleY = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -74 * noMotion]),
    spring
  );
  const bandBottomY = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -118 * noMotion]),
    spring
  );

  const bandOpacity = useTransform(scrollYProgress, [0.08, 0.24, 0.7, 1], [0, 0.85, 0.58, 0]);
  const ghostOpacity = useTransform(scrollYProgress, [0, 0.4, 1], [0.06, 0.14, 0.04]);
  const ghostY = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -120 * noMotion]),
    spring
  );
  const detailY = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -52 * noMotion]),
    spring
  );
  const cueY = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -28 * noMotion]),
    spring
  );
  const identityGlowX = useSpring(cursorX, {
    stiffness: 110,
    damping: 18,
    mass: 0.36,
  });
  const identityGlowY = useSpring(cursorY, {
    stiffness: 110,
    damping: 18,
    mass: 0.36,
  });
  const identityTrailX = useSpring(cursorX, {
    stiffness: 70,
    damping: 16,
    mass: 0.56,
  });
  const identityTrailY = useSpring(cursorY, {
    stiffness: 70,
    damping: 16,
    mass: 0.56,
  });
  const identityCursorX = useSpring(cursorX, {
    stiffness: 260,
    damping: 32,
    mass: 0.18,
  });
  const identityCursorY = useSpring(cursorY, {
    stiffness: 260,
    damping: 32,
    mass: 0.18,
  });
  const principlesMeterProgress = useSpring(principlesProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.32,
  });
  const projectsSweep = useSpring(
    useTransform(
      projectsProgress,
      [0, 0.18, 1],
      isDesktopPinned ? [0.14, 0.26, 1] : [1, 1, 1]
    ),
    { stiffness: 120, damping: 26, mass: 0.34 }
  );
  const projectsBodyOpacity = useTransform(
    projectsProgress,
    [0.06, 0.22, 1],
    [0, 1, 1]
  );
  const projectsBodyY = useSpring(
    useTransform(projectsProgress, [0, 0.28], [28 * noMotion, 0]),
    spring
  );
  const projectsCardsOpacity = useTransform(
    projectsProgress,
    [0.28, 0.54, 1],
    [0, 1, 1]
  );
  const projectsCardsY = useSpring(
    useTransform(projectsProgress, [0.18, 0.56], [44 * noMotion, 0]),
    spring
  );
  const projectsFillStop = useTransform(
    projectsSweep,
    (value) => `${Math.max(0, Math.min(100, value * 100)).toFixed(3)}%`
  );

  useMotionValueEvent(principlesProgress, "change", (value) => {
    setProgressPercent(Math.max(0, Math.min(100, Math.round(value * 100))));

    if (value < 0.34) {
      setActivePrinciple(0);
      return;
    }

    if (value < 0.68) {
      setActivePrinciple(1);
      return;
    }

    setActivePrinciple(2);
  });

  useEffect(() => {
    const section = identityRef.current;
    if (!section) {
      return undefined;
    }

    const resetCursor = () => {
      cursorX.set(section.clientWidth * 0.2);
      cursorY.set(section.clientHeight * 0.14);
    };

    resetCursor();
    window.addEventListener("resize", resetCursor);

    return () => {
      window.removeEventListener("resize", resetCursor);
    };
  }, [cursorX, cursorY]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 961px)");
    const syncPinned = () => setIsDesktopPinned(mediaQuery.matches);

    syncPinned();
    mediaQuery.addEventListener?.("change", syncPinned);

    return () => {
      mediaQuery.removeEventListener?.("change", syncPinned);
    };
  }, []);

  const handleIdentityPointerMove = (event) => {
    if (prefersReducedMotion) {
      return;
    }

    const section = identityRef.current;
    if (!section) {
      return;
    }

    const bounds = section.getBoundingClientRect();
    cursorX.set(event.clientX - bounds.left);
    cursorY.set(event.clientY - bounds.top);
  };

  const handleIdentityPointerLeave = () => {
    const section = identityRef.current;
    if (!section) {
      return;
    }

    cursorX.set(section.clientWidth * 0.2);
    cursorY.set(section.clientHeight * 0.14);
  };

  return (
    <div ref={containerRef} className="about-hero-page">
      <section ref={heroRef} className="about-hero-section">
        <div className="about-hero-sticky">
          <div className="about-hero__video-fallback" />

          <Motion.div
            className="about-hero__media"
            style={{ scale: videoScale, y: videoY }}
          >
            <video
              className="about-hero__video"
              key={HERO_VIDEO_SRC}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              poster="/logo/logo-black.png"
            >
              <source src={HERO_VIDEO_SRC} type="video/mp4" />
            </video>
          </Motion.div>

          <div className="about-hero__vignette" />
          <div className="about-hero__grid" />
          <div className="about-hero__noise" />
          <div className="about-hero__crosshair" />

          <Motion.div
            className="about-hero__ghost-word"
            style={{ opacity: ghostOpacity, y: ghostY }}
          >
            HOUSE OF MUSA
          </Motion.div>

          <Motion.div
            className="about-hero__shell"
            style={{ y: shellY, opacity: shellOpacity }}
          >
            <div className="about-hero__topbar">
              <div className="about-hero__eyebrow">House of Musa // About</div>
              <div className="about-hero__summary">
                Digital systems, branded experiences, and product engineering
                crafted with control.
              </div>
            </div>

            <div className="about-hero__content">
              <div className="about-hero__copy">
                <div className="about-hero__tag">
                  Strategy-led builds for ambitious businesses
                </div>

                <div className="about-hero__title-wrap">
                  <AnimatedTitleLines
                    className="about-hero__title-stack"
                    style={{ y: titleLeadY }}
                    reducedMotion={prefersReducedMotion}
                  />

                  <StaticTitleLines
                    className="about-hero__title-layer about-hero__title-layer--top"
                    style={{
                      x: bandTopX,
                      y: bandTopY,
                      opacity: bandOpacity,
                    }}
                  />

                  <StaticTitleLines
                    className="about-hero__title-layer about-hero__title-layer--middle"
                    style={{
                      x: bandMiddleX,
                      y: bandMiddleY,
                      opacity: bandOpacity,
                    }}
                  />

                  <StaticTitleLines
                    className="about-hero__title-layer about-hero__title-layer--bottom"
                    style={{
                      x: bandBottomX,
                      y: bandBottomY,
                      opacity: bandOpacity,
                    }}
                  />

                  <StaticTitleLines
                    className="about-hero__title-shadow"
                    style={{ y: titleTrailY }}
                  />
                </div>
              </div>

              <Motion.div className="about-hero__aside" style={{ y: detailY }}>
                <p className="about-hero__description">
                  House of Musa builds ERP platforms, AI-backed products, custom
                  websites, and immersive interfaces that turn complex ideas
                  into confident digital presence.
                </p>

                <ul className="about-hero__details" aria-label="Service focus">
                  {DETAIL_ITEMS.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Motion.div>
            </div>

            <Motion.div className="about-hero__footer" style={{ y: cueY }}>
              <div className="about-hero__footer-copy">
                Architecture / Interface systems / Development / Motion
              </div>
              <div className="about-hero__scroll-cue">Scroll</div>
            </Motion.div>
          </Motion.div>
        </div>
      </section>

      <section
        ref={identityRef}
        className="about-identity"
        onPointerMove={handleIdentityPointerMove}
        onPointerLeave={handleIdentityPointerLeave}
      >
        <div className="about-identity__rings" />
        <div className="about-identity__crosshair" />
        <div className="about-identity__corners" />
        <div className="about-identity__noise" />

        <Motion.div
          className="about-identity__glow"
          style={
            prefersReducedMotion
              ? undefined
              : { left: identityGlowX, top: identityGlowY }
          }
        />

        <Motion.div
          className="about-identity__trail"
          style={
            prefersReducedMotion
              ? undefined
              : { left: identityTrailX, top: identityTrailY }
          }
        />

        <Motion.div
          className="about-identity__cursor"
          style={
            prefersReducedMotion
              ? undefined
              : { left: identityCursorX, top: identityCursorY }
          }
        />

        <Motion.div
          className="about-identity__content"
          variants={sectionStaggerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
        >
          <Motion.div
            className="about-identity__eyebrow"
            variants={sectionItemVariants}
          >
            Who are we?
          </Motion.div>

          <div className="about-identity__headline">
            {IDENTITY_LINES.map((line) => (
              <Motion.h2
                key={line.text}
                className={`about-identity__line ${
                  line.accent ? "about-identity__line--accent" : ""
                }`}
                variants={sectionItemVariants}
              >
                {line.text}
              </Motion.h2>
            ))}
          </div>

          <Motion.p
            className="about-identity__body"
            variants={sectionItemVariants}
          >
            House of Musa builds ERP systems, AI-enabled products, and
            conversion-focused web experiences that bring clarity to operations,
            stronger brand presence, and room for businesses to grow with
            confidence.
          </Motion.p>

          <Motion.div
            className="about-identity__meta"
            variants={sectionItemVariants}
          >
            ERP / AI workflows / Web platforms / UI systems / Performance-led
            delivery
          </Motion.div>
        </Motion.div>
      </section>

      <section
        ref={principlesRef}
        className={`about-principles ${
          isDesktopPinned ? "about-principles--pinned" : "about-principles--stacked"
        }`}
      >
        <div className="about-principles__sticky">
          <div className="about-principles__split">
            <div className="about-principles__left">
              <div className="about-principles__left-shell">
                <div className="about-principles__meter-layer">
                  <div className="about-principles__meter" aria-hidden="true">
                    <svg
                      className="about-principles__meter-svg"
                      viewBox="0 0 400 400"
                    >
                      <circle
                        className="about-principles__meter-track"
                        cx="200"
                        cy="200"
                        r={METER_RADIUS}
                      />
                      <Motion.circle
                        className="about-principles__meter-progress"
                        cx="200"
                        cy="200"
                        r={METER_RADIUS}
                        pathLength="1"
                        style={{ pathLength: principlesMeterProgress }}
                      />
                    </svg>

                    <div className="about-principles__meter-ticks" />

                    <div className="about-principles__meter-copy">
                      <div className="about-principles__meter-step">
                        [{String(activePrinciple + 1).padStart(2, "0")}] / [
                        {String(PRINCIPLES_TOTAL).padStart(2, "0")}]
                      </div>
                      <div className="about-principles__meter-value">
                        {progressPercent}%
                      </div>
                      <div className="about-principles__meter-label">
                        reading progress
                      </div>
                    </div>
                  </div>
                </div>

                <div className="about-principles__scan" />

                <Motion.div
                  className="about-principles__visual"
                  animate={{
                    opacity: activePrinciple === 0 ? 1 : 0,
                    scale: activePrinciple === 0 ? 1 : 1.04,
                  }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="about-principles__visual-media">
                    <img
                      className="about-principles__visual-image"
                      src={MISSION_IMAGE_SRC}
                      alt="House of Musa mission visual"
                      loading="lazy"
                    />
                  </div>
                </Motion.div>

                <Motion.div
                  className="about-principles__visual"
                  animate={{
                    opacity: activePrinciple === 1 ? 1 : 0,
                    scale: activePrinciple === 1 ? 1 : 1.04,
                  }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="about-principles__visual-media">
                    <img
                      className="about-principles__visual-image"
                      src={VISION_IMAGE_SRC}
                      alt="House of Musa vision visual"
                      loading="lazy"
                    />
                  </div>
                </Motion.div>

                <Motion.div
                  className="about-principles__visual"
                  animate={{
                    opacity: activePrinciple === 2 ? 1 : 0,
                    scale: activePrinciple === 2 ? 1 : 1.04,
                  }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="about-principles__visual-media">
                    <img
                      className="about-principles__visual-image"
                      src={PURPOSE_IMAGE_SRC}
                      alt="House of Musa purpose visual"
                      loading="lazy"
                    />
                  </div>
                </Motion.div>

                <div className="about-principles__left-copy">
                  <div className="about-principles__kicker">
                    Guiding principles
                  </div>
                  <h2 className="about-principles__display">Our Direction</h2>
                </div>
              </div>
            </div>

            <div className="about-principles__right">
              <div className="about-principles__stack">
                {PRINCIPLE_ITEMS.map((item) => (
                  <article
                    key={item.id}
                    className={[
                      "about-principles__stack-item",
                      activePrinciple === Number(item.id) - 1 ? "is-active" : "",
                      activePrinciple > Number(item.id) - 1 ? "is-complete" : "",
                      activePrinciple < Number(item.id) - 1 ? "is-upcoming" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <div className="about-principles__stack-head">
                      <div className="about-principles__stack-index">
                        [{item.id}]
                      </div>
                      <div className="about-principles__stack-copy">
                        <h3 className="about-principles__stack-title">
                          {item.title}
                        </h3>

                        <div className="about-principles__stack-content">
                          <p className="about-principles__stack-body">
                            {item.body}
                          </p>

                          <div className="about-principles__stack-note">
                            {item.cardTitle} / {item.cardBody}
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={projectsRef}
        className={`about-showcase ${
          isDesktopPinned ? "about-showcase--pinned" : "about-showcase--stacked"
        }`}
      >
        <div className="about-showcase__sticky">
          <Motion.div
            className="about-showcase__frame"
            style={{ "--about-showcase-fill": projectsFillStop }}
          >
            <div className="about-showcase__ticks" aria-hidden="true" />

            <Motion.div
              className="about-showcase__fill"
              style={{ scaleX: projectsSweep }}
            />

            <div className="about-showcase__noise" aria-hidden="true" />

            <div className="about-showcase__content">
              <Motion.div
                className="about-showcase__eyebrow"
                style={
                  prefersReducedMotion
                    ? undefined
                    : { opacity: projectsBodyOpacity, y: projectsBodyY }
                }
              >
                Selected projects
              </Motion.div>

              <div className="about-showcase__headline-stack">
                <div className="about-showcase__headline">
                  {PROJECT_HEADLINE_LINES.map((line) => (
                    <div key={line} className="about-showcase__headline-line">
                      {line}
                    </div>
                  ))}
                </div>
              </div>

              <Motion.div
                className="about-showcase__intro"
                style={
                  prefersReducedMotion
                    ? undefined
                    : { opacity: projectsBodyOpacity, y: projectsBodyY }
                }
              >
                <p className="about-showcase__body">
                  From ERP ecosystems to commerce platforms and travel-led
                  marketplaces, we build products that turn operational
                  complexity into clear, memorable user experiences.
                </p>

                <div className="about-showcase__meta">
                  Product strategy / interface systems / frontend engineering /
                  conversion-led delivery
                </div>
              </Motion.div>

              <Motion.div
                className="about-showcase__projects"
                style={
                  prefersReducedMotion
                    ? undefined
                    : { opacity: projectsCardsOpacity, y: projectsCardsY }
                }
              >
                {FEATURED_PROJECTS.map((project) => (
                  <article
                    key={project.id}
                    className="about-showcase__project-card"
                  >
                    <div className="about-showcase__project-media">
                      <img
                        src={project.poster}
                        alt={`${project.title} project poster`}
                        loading="lazy"
                      />
                    </div>

                    <div className="about-showcase__project-copy">
                      <div className="about-showcase__project-index">
                        [{project.id}]
                      </div>
                      <h3 className="about-showcase__project-title">
                        {project.title}
                      </h3>
                      <div className="about-showcase__project-tagline">
                        {project.tagline}
                      </div>
                      <p className="about-showcase__project-summary">
                        {project.summary}
                      </p>
                    </div>
                  </article>
                ))}
              </Motion.div>

              <Motion.div
                className="about-showcase__footer"
                style={
                  prefersReducedMotion
                    ? undefined
                    : { opacity: projectsCardsOpacity, y: projectsCardsY }
                }
              >
                <div className="about-showcase__footer-copy">
                  Explore the full catalogue of launches, systems, and digital
                  products built by House of Musa.
                </div>
                <Link className="about-showcase__cta" to="/projects">
                  View projects
                </Link>
              </Motion.div>
            </div>
          </Motion.div>
        </div>
      </section>
    </div>
  );
}
