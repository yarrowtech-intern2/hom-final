import { useEffect, useLayoutEffect, useRef } from "react";
import * as THREE from "three";
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

function CrosshairIcon({ size = 40, color = "currentColor", strokeWidth = 1.4 }) {
  const r = size / 2;
  const innerR = r * 0.28;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" aria-hidden="true">
      <circle cx={r} cy={r} r={r - 1} stroke={color} strokeWidth={strokeWidth} />
      <circle cx={r} cy={r} r={innerR} stroke={color} strokeWidth={strokeWidth} />
      <line x1={r} y1={1} x2={r} y2={r - innerR - 2} stroke={color} strokeWidth={strokeWidth} />
      <line x1={r} y1={r + innerR + 2} x2={r} y2={size - 1} stroke={color} strokeWidth={strokeWidth} />
      <line x1={1} y1={r} x2={r - innerR - 2} y2={r} stroke={color} strokeWidth={strokeWidth} />
      <line x1={r + innerR + 2} y1={r} x2={size - 1} y2={r} stroke={color} strokeWidth={strokeWidth} />
    </svg>
  );
}

export default function ProjectsShowcase() {
  const pageRef  = useRef(null);
  const canvasRef = useRef(null);

  /* ── Page bg ── */
  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = "#EFE8D5";
    return () => { document.body.style.background = prev; };
  }, []);

  /* ── Three.js gold wire mesh ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.innerWidth < 768;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x0b0b0b, 1);

    const scene = new THREE.Scene();
    /* Wider FOV + closer camera fills the full viewport with the mesh */
    const camera = new THREE.PerspectiveCamera(68, 1, 0.1, 300);
    camera.position.set(0, 5, 18);
    camera.lookAt(0, 0, -1);

    /* Fewer segments on mobile for performance */
    const segW = isMobile ? 48 : 70;
    const segH = isMobile ? 32 : 46;
    const geometry = new THREE.PlaneGeometry(150, 100, segW, segH);
    geometry.rotateX(-Math.PI * 0.4);

    const material = new THREE.MeshBasicMaterial({
      color: 0xb07828,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const posAttr = geometry.attributes.position;
    const count   = posAttr.count;
    const orig    = new Float32Array(posAttr.array);

    function resize() {
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      if (!cw || !ch) return;
      renderer.setSize(cw, ch, false);
      camera.aspect = cw / ch;
      camera.updateProjectionMatrix();
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement || canvas);

    let animId;
    const t0 = performance.now();
    let frame = 0;

    function animate() {
      animId = requestAnimationFrame(animate);
      frame++;
      /* Skip every other frame on mobile for smooth 30 fps */
      if (isMobile && frame % 2 !== 0) return;

      const t = (performance.now() - t0) * 0.001;
      const arr = posAttr.array;

      for (let i = 0; i < count; i++) {
        const ix = i * 3;
        const ox = orig[ix];
        const oy = orig[ix + 1];
        arr[ix + 1] = oy + Math.sin(ox * 0.2 + t) * 1.8 + Math.sin(oy * 0.15 + t * 0.6) * 1.2;
      }
      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
    }

    animate();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  /* ── GSAP — every text element ── */
  useLayoutEffect(() => {
    /* Normalise touch scroll on mobile so ScrollTrigger fires correctly */
    ScrollTrigger.normalizeScroll(true);

    const ctx = gsap.context(() => {

      /* ── HERO (no scrollTrigger — play on load) ── */
      gsap.fromTo(".ps2-hero-title-inner",
        { y: "108%", immediateRender: true },
        { y: "0%", duration: 1.1, ease: "power4.out", stagger: 0.13, delay: 0.3 }
      );
      gsap.fromTo(".ps2-hero-caption",
        { y: 18, opacity: 0, immediateRender: true },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.75 }
      );

      /* ── STATEMENT ── */
      gsap.fromTo(".ps2-statement-line",
        { y: "105%", immediateRender: false },
        { y: "0%", duration: 1, ease: "power3.out", stagger: 0.1,
          scrollTrigger: { trigger: ".ps2-statement", start: "top 88%", once: true } }
      );
      gsap.fromTo(".ps2-statement-subcol",
        { y: 30, opacity: 0, immediateRender: false },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", stagger: 0.15,
          scrollTrigger: { trigger: ".ps2-statement-subcols", start: "top 92%", once: true } }
      );

      /* ── PROCESS ── */
      gsap.fromTo(".ps2-process-label",
        { x: -24, opacity: 0, immediateRender: false },
        { x: 0, opacity: 1, duration: 0.65, ease: "power2.out",
          scrollTrigger: { trigger: ".ps2-process-topbar", start: "top 95%", once: true } }
      );
      gsap.fromTo(".ps2-process-counter",
        { x: 24, opacity: 0, immediateRender: false },
        { x: 0, opacity: 1, duration: 0.65, ease: "power2.out",
          scrollTrigger: { trigger: ".ps2-process-topbar", start: "top 95%", once: true } }
      );
      gsap.fromTo(".ps2-process-title .ps2-word-inner",
        { y: "108%", immediateRender: false },
        { y: "0%", duration: 1, ease: "power4.out", stagger: 0.1,
          scrollTrigger: { trigger: ".ps2-process-left", start: "top 90%", once: true } }
      );
      gsap.fromTo(".ps2-process-desc",
        { y: 22, opacity: 0, immediateRender: false },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: ".ps2-process-left", start: "top 88%", once: true } }
      );
      gsap.fromTo(".ps2-process-card",
        { x: 60, opacity: 0, immediateRender: false },
        { x: 0, opacity: 1, duration: 0.85, ease: "power3.out", stagger: 0.14,
          scrollTrigger: { trigger: ".ps2-process-right", start: "top 92%", once: true } }
      );
      gsap.fromTo(".ps2-process-card-body",
        { opacity: 0, y: 10, immediateRender: false },
        { opacity: 1, y: 0, duration: 0.65, ease: "power2.out", stagger: 0.12,
          scrollTrigger: { trigger: ".ps2-process-right", start: "top 88%", once: true } }
      );

      /* ── PROJECTS ── */
      gsap.fromTo(".ps2-projects-headline .ps2-word-inner",
        { y: "108%", immediateRender: false },
        { y: "0%", duration: 1, ease: "power4.out", stagger: 0.13,
          scrollTrigger: { trigger: ".ps2-projects", start: "top 92%", once: true } }
      );
      gsap.fromTo(".ps2-project-col",
        { y: 50, opacity: 0, immediateRender: false },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.1,
          scrollTrigger: { trigger: ".ps2-projects-grid", start: "top 92%", once: true } }
      );
      gsap.fromTo(".ps2-project-meta",
        { x: -16, opacity: 0, immediateRender: false },
        { x: 0, opacity: 1, duration: 0.65, ease: "power2.out", stagger: 0.08,
          scrollTrigger: { trigger: ".ps2-projects-grid", start: "top 88%", once: true } }
      );
      gsap.fromTo(".ps2-project-img",
        { scale: 1.08, opacity: 0, immediateRender: false },
        { scale: 1, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.09,
          scrollTrigger: { trigger: ".ps2-projects-grid", start: "top 88%", once: true } }
      );
      gsap.fromTo(".ps2-project-title",
        { y: 20, opacity: 0, immediateRender: false },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.09,
          scrollTrigger: { trigger: ".ps2-projects-grid", start: "top 85%", once: true } }
      );
      gsap.fromTo(".ps2-project-tagline",
        { opacity: 0, immediateRender: false },
        { opacity: 1, duration: 0.6, ease: "power2.out", stagger: 0.08,
          scrollTrigger: { trigger: ".ps2-projects-grid", start: "top 82%", once: true } }
      );

      /* ── FOOTER ── */
      gsap.fromTo(".ps2-footer-left svg",
        { scale: 0.82, opacity: 0, rotation: -10, immediateRender: false },
        { scale: 1, opacity: 1, rotation: 0, duration: 1.1, ease: "power3.out",
          scrollTrigger: { trigger: ".ps2-footer", start: "top 92%", once: true } }
      );
      gsap.fromTo(".ps2-footer-nav a",
        { y: 16, opacity: 0, immediateRender: false },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", stagger: 0.06,
          scrollTrigger: { trigger: ".ps2-footer-right", start: "top 95%", once: true } }
      );
      gsap.fromTo(".ps2-footer-social-link",
        { x: -16, opacity: 0, immediateRender: false },
        { x: 0, opacity: 1, duration: 0.65, ease: "power2.out", stagger: 0.1,
          scrollTrigger: { trigger: ".ps2-footer-socials", start: "top 95%", once: true } }
      );
      gsap.fromTo(".ps2-footer-bottom-row",
        { opacity: 0, immediateRender: false },
        { opacity: 1, duration: 0.65, ease: "power2.out",
          scrollTrigger: { trigger: ".ps2-footer-bottom-row", start: "top 98%", once: true } }
      );

    }, pageRef);

    /* Force ScrollTrigger to recalculate after fonts + images load */
    const tid = setTimeout(() => ScrollTrigger.refresh(), 300);

    return () => {
      clearTimeout(tid);
      ctx.revert();
    };
  }, []);

  return (
    <div className="ps2-page" ref={pageRef}>

      {/* ══ HERO ══ */}
      <section className="ps2-hero">
        <canvas ref={canvasRef} className="ps2-hero-canvas" />

        <div className="ps2-hero-inner">
          <div className="ps2-hero-title-wrap">
            <h1 className="ps2-hero-title">
              <span className="ps2-hero-title-line">
                <span className="ps2-hero-title-inner">HOUSE</span>
              </span>
              <span className="ps2-hero-title-line">
                <span className="ps2-hero-title-inner">OF MUSA.</span>
              </span>
            </h1>
            <p className="ps2-hero-caption">Spotlight Projects 2025</p>
          </div>
        </div>
      </section>

      {/* ══ STATEMENT ══ */}
      <section className="ps2-statement">
        <div className="ps2-statement-inner">
          <p className="ps2-statement-body">
            {[
              "Our team of builders, designers,",
              "and engineers crafts intelligent digital products —",
              "built for modern businesses that demand performance.",
            ].map((line) => (
              <span key={line} className="ps2-statement-line-wrap">
                <span className="ps2-statement-line">{line}</span>
              </span>
            ))}
          </p>

          <div className="ps2-statement-subcols">
            <p className="ps2-statement-subcol">
              FROM THE FIRST IDEA TO LAUNCH, HOUSE OF MUSA IS BY YOUR SIDE — HELPING YOU NAVIGATE
              PRODUCT STRATEGY, DESIGN, ENGINEERING, AND WHATEVER YOUR PROJECT NEEDS.
            </p>
            <p className="ps2-statement-subcol">
              PARTNERING WITH HOUSE OF MUSA MEANS A STREAMLINED, END-TO-END APPROACH — FROM CONCEPT
              AND ARCHITECTURE TO DEVELOPMENT AND DELIVERY.
            </p>
          </div>
        </div>
      </section>

      {/* ══ PROCESS ══ */}
      <section className="ps2-process">
        <div className="ps2-process-topbar">
          <span className="ps2-process-label">PROCESS</span>
          <span className="ps2-process-counter">[HOM.03]</span>
        </div>

        <div className="ps2-process-inner">
          <div className="ps2-process-left">
            <h2 className="ps2-process-title">
              {["Here at", "every step"].map((line) => (
                <span key={line} className="ps2-word-line">
                  <span className="ps2-word-inner">{line}</span>
                </span>
              ))}
            </h2>
            <p className="ps2-process-desc">
              FROM DISCOVERY TO DELIVERY, WE MOVE WITH INTENTION — MAPPING YOUR GOALS,
              ENGINEERING ROBUST SYSTEMS, AND SCALING WHAT WORKS.
            </p>
          </div>

          <div className="ps2-process-right">
            {PROCESS_STEPS.map((step, i) => (
              <div key={step.num} className={`ps2-process-card${i === 1 ? " is-tilted" : ""}`}>
                <div className="ps2-process-card-top">
                  <span className="ps2-process-card-title">{step.title}</span>
                  <span className="ps2-process-card-num">{step.num}</span>
                </div>
                <div className="ps2-process-card-divider" />
                <p className="ps2-process-card-body">{step.body}</p>
                <div className="ps2-process-card-divider" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PROJECTS ══ */}
      <section className="ps2-projects">
        <h2 className="ps2-projects-headline">
          {["Spotlight", "Projects"].map((w) => (
            <span key={w} className="ps2-word-line">
              <span className="ps2-word-inner">{w}</span>
            </span>
          ))}
        </h2>

        <div className="ps2-projects-grid">
          {PROJECTS.map((p, i) => (
            <div className="ps2-project-col" key={p.title}>
              <div className="ps2-project-meta">
                <span className="ps2-project-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="ps2-project-meta-line" aria-hidden="true" />
                <span className="ps2-project-tag">{p.tags[0]}</span>
              </div>
              <div className="ps2-project-img-wrap">
                <a href={p.url} target="_blank" rel="noopener noreferrer" tabIndex={-1}>
                  <img src={p.poster} alt={p.title} className="ps2-project-img" loading="lazy" />
                </a>
              </div>
              <h3 className="ps2-project-title">{p.title}</h3>
              <p className="ps2-project-tagline">{p.tagline}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="ps2-footer">
        <div className="ps2-footer-inner">
          <div className="ps2-footer-left">
            <CrosshairIcon size={240} color="#EFE8D5" strokeWidth={0.7} />
          </div>

          <div className="ps2-footer-right">
            <nav className="ps2-footer-nav" aria-label="Footer navigation">
              <a href="/about">ABOUT</a>
              <a href="/projects">PROJECTS</a>
              <a href="/gallery">GALLERY</a>
              <a href="/carrers">CAREERS</a>
              <a href="/story">STORY</a>
              <a href="/">HOME</a>
            </nav>

            <div className="ps2-footer-socials">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="ps2-footer-social-link">INSTAGRAM</a>
              <a href="https://linkedin.com"  target="_blank" rel="noopener noreferrer" className="ps2-footer-social-link">LINKEDIN</a>
              <a href="https://twitter.com"   target="_blank" rel="noopener noreferrer" className="ps2-footer-social-link">TWITTER / X</a>
            </div>

            <div className="ps2-footer-bottom-row">
              <span className="ps2-footer-copy">&copy; 2026. HOUSE OF MUSA. ALL RIGHTS RESERVED.</span>
              <span className="ps2-footer-craft">CRAFTED WITH INTENTION.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
