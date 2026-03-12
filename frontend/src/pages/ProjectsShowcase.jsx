import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ytPoster from "../assets/posters/yt.png";
import buildingPoster from "../assets/posters/building.png";
import hiremePoster from "../assets/posters/hireme.png";
import artblockPoster from "../assets/posters/artblock.png";
import greenbarPoster from "../assets/posters/greenbar.png";
import betterpassPoster from "../assets/posters/betterpass.png";
import "./projectsShowcase.css";

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    title: "Yarrowtech",
    tagline: "Software and ERP Ecosystem",
    description:
      "Intelligent software products, ERP systems, AI applications, and full-stack delivery for modern businesses.",
    url: "https://yarrowtech.com",
    cta: "Visit Website",
    tags: ["ERP Systems", "AI Apps", "Full-Stack", "Enterprise"],
    poster: ytPoster,
  },
  {
    title: "Building",
    tagline: "Regulated Crowdfunding Platform",
    description:
      "A trusted digital marketplace for founders and investors, designed with strong compliance and campaign flows.",
    url: "https://sportbit.app",
    cta: "View Platform",
    tags: ["Crowdfunding", "KYC/AML", "Compliance", "Marketplace"],
    poster: buildingPoster,
  },
  {
    title: "Hire-Me",
    tagline: "Subscription HR Infrastructure",
    description:
      "A role-based HR platform for intake, workforce tracking, and compliance operations in one secure system.",
    url: "https://fb.yarrowtech.com",
    cta: "Explore Product",
    tags: ["HR Tech", "SaaS", "Workforce", "Compliance"],
    poster: hiremePoster,
  },
  {
    title: "Art-Block",
    tagline: "Creator Commerce Network",
    description:
      "A creator-first platform for memberships, direct audience monetization, and analytics-powered growth.",
    url: "https://myguide.yarrowtech.com",
    cta: "See Solution",
    tags: ["Creator Platform", "Subscriptions", "Payments", "Analytics"],
    poster: artblockPoster,
  },
  {
    title: "Green-bar",
    tagline: "Fresh Grocery Ordering System",
    description:
      "End-to-end commerce for fresh produce with ordering, inventory workflows, and real-time tracking.",
    url: "https://electroniceducare.com",
    cta: "View Product",
    tags: ["E-Commerce", "Inventory", "Order Tracking", "Admin Panel"],
    poster: greenbarPoster,
  },
  {
    title: "Better-Pass",
    tagline: "Social Travel Marketplace",
    description:
      "A social booking network for tour companies, travelers, and creators with discovery plus conversion.",
    url: "https://electroniceducare.com",
    cta: "View Product",
    tags: ["Travel Social", "Bookings", "Multi-Role", "Community"],
    poster: betterpassPoster,
  },
];

const PROCESS_STEPS = [
  {
    num: "01",
    title: "Discovery",
    body: "Business mapping, user goals, and architecture planning before a single line is written.",
  },
  {
    num: "02",
    title: "Build",
    body: "Fast iterations with strong frontend, backend, and performance engineering baked in.",
  },
  {
    num: "03",
    title: "Scale",
    body: "Optimization, reliability, and long-term improvements that compound after launch.",
  },
];

const MARQUEE_WORDS = [
  "Spotlight Projects",
  "Creative Engineering",
  "Immersive Interfaces",
  "Performance First",
  "House of Musa",
];

export default function ProjectsShowcase() {
  const pageRef = useRef(null);
  const projectsWrapperRef = useRef(null);
  const projectsTrackRef = useRef(null);
  const processRef = useRef(null);
  const footerRef = useRef(null);
  const projectCardsRef = useRef([]);

  projectCardsRef.current = [];
  const addCardRef = (el) => {
    if (el && !projectCardsRef.current.includes(el)) {
      projectCardsRef.current.push(el);
    }
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .from(".ps-kicker, .ps-kicker-count", {
          y: 14,
          opacity: 0,
          duration: 0.65,
          stagger: 0.08,
        })
        .from(
          ".ps-hero-line",
          { scaleX: 0, transformOrigin: "left center", duration: 1.05, ease: "power3.inOut" },
          0.15
        )
        .from(".ps-word-inner", { yPercent: 112, duration: 1.05, stagger: 0.1 }, 0.28)
        .from(".ps-subheadline", { y: 24, opacity: 0, duration: 0.78 }, "-=0.4")
        .from(".ps-hero-chip", { y: 14, opacity: 0, duration: 0.55, stagger: 0.08 }, "-=0.42")
        .from(".ps-scroll-hint", { y: 16, opacity: 0, duration: 0.6 }, "-=0.28");

      gsap.from(".ps-marquee", {
        y: 16,
        opacity: 0,
        duration: 0.78,
        ease: "power3.out",
        scrollTrigger: { trigger: ".ps-marquee", start: "top 90%", once: true },
      });

      const mm = gsap.matchMedia();
      mm.add("(min-width: 769px)", () => {
        const getScrollDistance = () =>
          projectsTrackRef.current
            ? Math.max(0, projectsTrackRef.current.scrollWidth - window.innerWidth)
            : 0;

        const horizontalTween = gsap.to(projectsTrackRef.current, {
          x: () => -getScrollDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: projectsWrapperRef.current,
            start: "top top",
            end: () => `+=${getScrollDistance()}`,
            pin: true,
            scrub: 1.05,
            snap:
              PROJECTS.length > 1
                ? {
                    snapTo: 1 / (PROJECTS.length - 1),
                    duration: { min: 0.28, max: 0.58 },
                    delay: 0.06,
                    ease: "power1.inOut",
                  }
                : false,
            anticipatePin: 0.5,
            fastScrollEnd: true,
            invalidateOnRefresh: true,
          },
        });

        gsap.from(".ps-section-label, .ps-section-subtitle, .ps-section-counter", {
          y: 22,
          opacity: 0,
          duration: 0.72,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: projectsWrapperRef.current, start: "top 72%", once: true },
        });

        projectCardsRef.current.forEach((card) => {
          const frame = card.querySelector(".project-frame");
          const imageSide = card.querySelector(".project-work-image-side");
          const infoSide = card.querySelector(".project-work-info-side");
          const img = card.querySelector(".project-work-image-side img");
          const infoChildren = infoSide ? Array.from(infoSide.querySelectorAll(":scope > *")) : [];

          if (frame) {
            gsap.from(frame, {
              y: 26,
              opacity: 0,
              duration: 0.75,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                containerAnimation: horizontalTween,
                start: "left 86%",
                toggleActions: "play none none none",
              },
            });
          }

          if (imageSide) {
            gsap.from(imageSide, {
              x: -54,
              opacity: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                containerAnimation: horizontalTween,
                start: "left 84%",
                toggleActions: "play none none none",
              },
            });
          }

          if (img) {
            gsap.fromTo(
              img,
              { scale: 1.08 },
              {
                scale: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  containerAnimation: horizontalTween,
                  start: "left right",
                  end: "right left",
                  scrub: true,
                },
              }
            );
          }

          if (infoChildren.length > 0) {
            gsap.from(infoChildren, {
              y: 20,
              opacity: 0,
              stagger: 0.08,
              duration: 0.54,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                containerAnimation: horizontalTween,
                start: "left 76%",
                toggleActions: "play none none none",
              },
            });
          }
        });
      });

      gsap.from(".ps-process-kicker, .ps-process-title", {
        y: 44,
        opacity: 0,
        stagger: 0.12,
        duration: 0.86,
        ease: "power3.out",
        scrollTrigger: { trigger: processRef.current, start: "top 78%", once: true },
      });

      gsap.from(".ps-process-row", {
        y: 34,
        opacity: 0,
        stagger: 0.12,
        duration: 0.78,
        ease: "power3.out",
        scrollTrigger: { trigger: processRef.current, start: "top 74%", once: true },
      });

      gsap.from(".ps-process-divider", {
        scaleX: 0,
        transformOrigin: "left center",
        stagger: 0.12,
        duration: 0.7,
        ease: "power2.inOut",
        scrollTrigger: { trigger: processRef.current, start: "top 72%", once: true },
      });

      gsap.from(".ps-footer-brand, .ps-footer-nav, .ps-footer-tagline, .ps-footer-bottom", {
        y: 24,
        opacity: 0,
        stagger: 0.08,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: footerRef.current, start: "top 88%", once: true },
      });

      const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 400);
      return () => clearTimeout(refreshTimer);
    }, pageRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const root = document.getElementById("root");
    const prev = {
      bodyBg: document.body.style.background,
      htmlBg: document.documentElement.style.background,
      bodyOverflow: document.body.style.overflow,
      htmlOverflow: document.documentElement.style.overflow,
      rootOverflow: root ? root.style.overflow : "",
      rootHeight: root ? root.style.height : "",
    };

    document.body.style.background = "#9d6800";
    document.documentElement.style.background = "#9d6800";
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
    if (root) {
      root.style.overflow = "visible";
      root.style.height = "auto";
    }

    return () => {
      document.body.style.background = prev.bodyBg;
      document.documentElement.style.background = prev.htmlBg;
      document.body.style.overflow = prev.bodyOverflow;
      document.documentElement.style.overflow = prev.htmlOverflow;
      if (root) {
        root.style.overflow = prev.rootOverflow;
        root.style.height = prev.rootHeight;
      }
    };
  }, []);

  return (
    <main className="projects-showcase-page" ref={pageRef}>
      <section className="ps-hero">
        <div className="ps-hero-inner">
          <div className="ps-kicker-row">
            <span className="ps-kicker">House of Musa - Showcase 2025</span>
            <span className="ps-kicker-count">0{PROJECTS.length} Spotlight Works</span>
          </div>

          <div className="ps-hero-line" />

          <h1 className="ps-headline" aria-label="Project Showcase Edition">
            {["PROJECT", "SHOWCASE", "EDITION"].map((word, idx) => (
              <span key={word} className={`ps-headline-line ${idx === 1 ? "is-outline" : ""}`}>
                <span className="ps-word-inner">{word}</span>
              </span>
            ))}
          </h1>

          <div className="ps-hero-bottom">
            <p className="ps-subheadline">
              Same context, new stage.
              <br />
              A cinematic reel of Musa products.
            </p>

            <div className="ps-hero-chips" aria-hidden="true">
              <span className="ps-hero-chip">Creative Tech</span>
              <span className="ps-hero-chip">Built for Scale</span>
              <span className="ps-hero-chip">Performance First</span>
            </div>

            <div className="ps-scroll-hint">
              <span className="ps-scroll-pip" />
              <span className="ps-scroll-text">Scroll to enter spotlight</span>
            </div>
          </div>
        </div>
      </section>

      <section className="ps-marquee" aria-label="Showcase ribbon">
        <div className="ps-marquee-track">
          {[...MARQUEE_WORDS, ...MARQUEE_WORDS, ...MARQUEE_WORDS].map((word, idx) => (
            <span key={`${word}-${idx}`}>{word}</span>
          ))}
        </div>
      </section>

      <section className="projects-wrapper-section" ref={projectsWrapperRef}>
        <div className="projects-section-header">
          <span className="ps-section-label">In the Spotlight</span>
          <p className="ps-section-subtitle">A bold scroll reel with your current projects and context.</p>
          <span className="ps-section-counter" aria-hidden="true">
            01 - {String(PROJECTS.length).padStart(2, "0")}
          </span>
        </div>

        <div className="projects-scroll-track" ref={projectsTrackRef}>
          {PROJECTS.map((project, index) => (
            <article className="project-work-card" key={project.title} ref={addCardRef}>
              <span className="project-bg-num" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="project-frame">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-work-image-side"
                  aria-label={`Open ${project.title}`}
                >
                  <img src={project.poster} alt={`${project.title} screenshot`} loading="lazy" />
                  <div className="project-hover-label">
                    <span>Open Project</span>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                      <path
                        d="M2.5 12.5L12.5 2.5M12.5 2.5H5.5M12.5 2.5V9.5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </a>

                <div className="project-work-info-side">
                  <div className="project-work-meta">
                    <span className="project-work-idx">{String(index + 1).padStart(2, "0")}</span>
                    <span className="project-work-sep">/</span>
                    <span className="project-work-total">{String(PROJECTS.length).padStart(2, "0")}</span>
                  </div>

                  <h3 className="project-work-title">{project.title.toUpperCase()}</h3>
                  <p className="project-work-tagline">{project.tagline}</p>
                  <p className="project-work-description">{project.description}</p>

                  <div className="project-work-tags">
                    {project.tags.map((tag) => (
                      <span key={`${project.title}-${tag}`}>{tag}</span>
                    ))}
                  </div>

                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="project-work-cta">
                    {project.cta}
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                      <path
                        d="M2 11L11 2M11 2H4.5M11 2V8.5"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="ps-process-section" ref={processRef}>
        <div className="ps-process-inner">
          <div className="ps-process-header">
            <span className="ps-process-kicker">How we build</span>
            <h2 className="ps-process-title">Our Approach</h2>
          </div>

          <div className="ps-process-list">
            {PROCESS_STEPS.map((step) => (
              <div key={step.num} className="ps-process-row">
                <div className="ps-process-divider" />
                <div className="ps-process-row-inner">
                  <span className="ps-process-step-num">{step.num}</span>
                  <div className="ps-process-step-body">
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </div>
                  <span className="ps-process-step-arrow" aria-hidden="true">
                    -
                  </span>
                </div>
              </div>
            ))}
            <div className="ps-process-divider" />
          </div>
        </div>
      </section>

      <footer className="ps-footer" ref={footerRef}>
        <div className="ps-footer-inner">
          <div className="ps-footer-top">
            <div className="ps-footer-brand">
              <span className="ps-footer-logo">House of Musa</span>
              <p className="ps-footer-tagline">Digital products built for scale.</p>
            </div>
            <nav className="ps-footer-nav" aria-label="Footer navigation">
              <a href="/">Home</a>
              <a href="/about">About</a>
              <a href="/projects">Projects</a>
              <a href="/gallery">Gallery</a>
              <a href="/carrers">Careers</a>
            </nav>
          </div>

          <div className="ps-footer-bottom">
            <span className="ps-footer-copy">© 2026 House of Musa. All rights reserved.</span>
            <span className="ps-footer-craft">Crafted with intention.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
