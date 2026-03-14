


// import React, { useCallback, useMemo, useState, useEffect, useRef } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import AboutBackground from "../components/AboutBg";
// import JobApplyModal from "../components/applyModal";
// import "./career2.css";

// /**
//  * Careers Page (Industry-level, mobile-first, optimized)
//  * - Uses AboutBackground (AboutBg) for cinematic background
//  * - No 3D model inside this page
//  * - Keeps Apply Now button className = "carrers-btn"
//  * - Scroll-safe (no overflow hidden on body/root)
//  */
// export default function CareerPage() {
//   const [modalOpen, setModalOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);

//   const vacantRoles = useMemo(
//     () => [
//       {
//         title: "Frontend Developer (React + Tailwind)",
//         meta: "Full-time • Remote/Hybrid",
//         desc: "Build premium UI systems, component libraries, and performance-focused interfaces.",
//         tags: ["React", "Tailwind", "UX", "Performance"],
//       },
//       {
//         title: "Full Stack Developer (MERN)",
//         meta: "Full-time • Remote/Hybrid",
//         desc: "Ship end-to-end features, secure APIs, scalable data models, and production workflows.",
//         tags: ["Node", "MongoDB", "APIs", "Security"],
//       },
//       {
//         title: "Backend Developer (Node.js + MongoDB)",
//         meta: "Full-time • Remote/Hybrid",
//         desc: "Own backend services, optimize queries, and design robust architecture for scale.",
//         tags: ["Node", "DB Design", "Caching", "Scaling"],
//       },
//       {
//         title: "UI/UX Designer (Figma)",
//         meta: "Contract/Full-time • Remote",
//         desc: "Design modern enterprise UI, flows, and systems that feel premium and intuitive.",
//         tags: ["Figma", "Design System", "Prototyping", "UX"],
//       },
//     ],
//     []
//   );

//   const openApply = useCallback((e) => {
//     e?.preventDefault?.();
//     setModalOpen(true);
//   }, []);

//   const closeApply = useCallback(() => setModalOpen(false), []);

//   // Optional: keep your existing submit behavior (upload progress + toast)
//   const onSubmit = useCallback(
//     async (data) => {
//       if (isSubmitting) return;

//       setIsSubmitting(true);
//       setUploadProgress(0);

//       try {
//         const formData = new FormData();
//         formData.append("role", data.role);
//         formData.append("fullName", data.fullName);
//         formData.append("email", data.email);
//         formData.append("phone", data.phone || "");
//         formData.append("coverNote", data.coverNote || "");
//         if (data.resumeFile) formData.append("resume", data.resumeFile);

//         await new Promise((resolve, reject) => {
//           const xhr = new XMLHttpRequest();
//           xhr.open("POST", `${import.meta.env.VITE_API_URL}/api/job-applications/apply`);

//           xhr.upload.onprogress = (event) => {
//             if (event.lengthComputable) {
//               const percent = Math.round((event.loaded / event.total) * 100);
//               setUploadProgress(percent);
//             }
//           };

//           xhr.onload = () => {
//             const raw = xhr.responseText;
//             if (xhr.status >= 200 && xhr.status < 300) return resolve();

//             try {
//               const err = JSON.parse(raw);
//               reject(new Error(err.error || err.message || "Submission failed"));
//             } catch {
//               reject(new Error(raw || `Submission failed (HTTP ${xhr.status})`));
//             }
//           };

//           xhr.onerror = () => reject(new Error("Network error"));
//           xhr.send(formData);
//         });

//         toast.success("Application submitted successfully 🚀");
//         setModalOpen(false);
//       } catch (err) {
//         console.error(err);
//         toast.error(err?.message || "Failed to submit application");
//       } finally {
//         setIsSubmitting(false);
//         setUploadProgress(0);
//       }
//     },
//     [isSubmitting]
//   );

//   return (
//     <AboutBackground pages={7}>
//       {/* IMPORTANT: This wrapper lives in Scroll html (from AboutBg). Keep it normal-flow */}
//       <div className="carrers-wrap pt-20 p-5">
//         {/* TOP BAR */}
//         {/* <header className="carrers-topbar" role="banner">
//           <div className="carrers-brand">
//             <div className="carrers-mark" aria-hidden="true" />
//             <div className="carrers-brand-stack">
//               <div className="carrers-brand-title">Careers</div>
//               <div className="carrers-brand-sub">
//                 Build high-impact systems with a team that values craft, speed, and ownership.
//               </div>
//             </div>
//           </div>

//           <nav className="carrers-nav" aria-label="Careers navigation">
//             <a className="carrers-link" href="#roles">
//               Open Roles
//             </a>
//             <a className="carrers-link" href="#process">
//               Hiring Process
//             </a>

            
//             <Link to="/jobs" className="carrers-btn carrers-btn--top" onClick={openApply}>
//               Apply Now
//             </Link>
//           </nav>
//         </header> */}

//         {/* HERO */}
//         <section className="carrers-hero" aria-label="Careers hero">
//           <div className="carrers-hero-left">
//             <div className="carrers-kicker">
//               <span className="dot" aria-hidden="true" />
//               JOIN THE TEAM
//             </div>

//             <h1 className="carrers-hero-title">
//               Build products that feel premium — and perform at scale.
//             </h1>

//             <p className="carrers-hero-sub">
//               We design and ship modern enterprise systems: dashboards, workflows, automation, and
//               data-driven experiences. If you care about quality, velocity, and real impact, you’ll
//               love working here.
//             </p>

//             <div className="carrers-hero-actions">
//               {/* Keep Apply Now button SAME className */}
//               <Link to="/jobs" className="carrers-btn" onClick={openApply}>
//                 Apply Now
//               </Link>

//               <a className="carrers-secondary" href="#roles">
//                 View Open Roles
//               </a>
//             </div>

//             <div className="carrers-trust">
//               <div className="chip">High Ownership</div>
//               <div className="chip">Fast Iteration</div>
//               <div className="chip">Clean UI + Strong Backend</div>
//               <div className="chip">Security-first</div>
//             </div>
//           </div>

//           <aside className="carrers-hero-right" aria-label="Team highlights">
//             <div className="carrers-panel">
//               <div className="panel-title">What you can expect</div>

//               <ul className="panel-list">
//                 <li>
//                   <span className="tick" aria-hidden="true" />
//                   Clear ownership and real responsibilities
//                 </li>
//                 <li>
//                   <span className="tick" aria-hidden="true" />
//                   Design systems + engineering best practices
//                 </li>
//                 <li>
//                   <span className="tick" aria-hidden="true" />
//                   Performance-minded development
//                 </li>
//                 <li>
//                   <span className="tick" aria-hidden="true" />
//                   A culture that respects focus and quality
//                 </li>
//               </ul>

//               <div className="panel-divider" />

//               <div className="panel-metrics">
//                 <div className="metric">
//                   <div className="metric-k">Work style</div>
//                   <div className="metric-v">Remote / Hybrid</div>
//                 </div>
//                 <div className="metric">
//                   <div className="metric-k">Growth</div>
//                   <div className="metric-v">Mentorship + Projects</div>
//                 </div>
//                 <div className="metric">
//                   <div className="metric-k">Quality</div>
//                   <div className="metric-v">Review + Standards</div>
//                 </div>
//               </div>

//               <p className="panel-foot">
//                 Prefer email? Send your resume to{" "}
//                 <span className="strong">careers@yourcompany.com</span>
//               </p>
//             </div>
//           </aside>
//         </section>

//         {/* WHY JOIN */}
//         <section className="carrers-section" aria-label="Why join">
//           <div className="sec-head">
//             <h2>Why join us</h2>
//             <p>
//               We hire for clarity, execution, and long-term thinking. You’ll work on meaningful
//               systems used by real teams — with strong engineering standards and product focus.
//             </p>
//           </div>

//           <div className="grid-3">
//             <article className="card">
//               <div className="card-title">Professional engineering</div>
//               <div className="card-sub">
//                 Clean architecture, code reviews, reusable components, and scalable backend patterns.
//               </div>
//             </article>

//             <article className="card">
//               <div className="card-title">Ownership-driven culture</div>
//               <div className="card-sub">
//                 You own outcomes, not just tasks. Ship, measure, improve — with autonomy and trust.
//               </div>
//             </article>

//             <article className="card">
//               <div className="card-title">Learning & growth</div>
//               <div className="card-sub">
//                 Mentorship, documentation, and fast feedback loops — without unnecessary meetings.
//               </div>
//             </article>
//           </div>
//         </section>

//         {/* VALUES */}
//         <section className="carrers-section" aria-label="Values">
//           <div className="sec-head">
//             <h2>Our values</h2>
//             <p>A simple culture that keeps the team aligned while moving fast.</p>
//           </div>

//           <div className="grid-4">
//             <article className="card small">
//               <div className="card-title">Craft</div>
//               <div className="card-sub">Details matter. Quality is non-negotiable.</div>
//             </article>

//             <article className="card small">
//               <div className="card-title">Ownership</div>
//               <div className="card-sub">Solve problems end-to-end. Don’t wait.</div>
//             </article>

//             <article className="card small">
//               <div className="card-title">Speed</div>
//               <div className="card-sub">Move fast with clarity, not chaos.</div>
//             </article>

//             <article className="card small">
//               <div className="card-title">Integrity</div>
//               <div className="card-sub">Trust is built by doing the right thing.</div>
//             </article>
//           </div>
//         </section>

//         {/* ROLES */}
//         <section className="carrers-section" id="roles" aria-label="Open roles">
//           <div className="sec-head">
//             <h2>Open roles</h2>
//             <p>
//               Don’t see your exact role? Apply anyway — strong talent is always welcome.
//             </p>
//           </div>

//           <div className="roles">
//             {vacantRoles.map((r) => (
//               <article className="role" key={r.title}>
//                 <div className="role-left">
//                   <div className="role-title">{r.title}</div>
//                   <div className="role-meta">{r.meta}</div>
//                   <p className="role-desc">{r.desc}</p>
//                   <div className="role-tags">
//                     {r.tags.map((t) => (
//                       <span key={t} className="tag">
//                         {t}
//                       </span>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="role-right">
//                   {/* Keep Apply Now button SAME className */}
//                   <Link to="/jobs" className="carrers-btn" onClick={openApply}>
//                     Apply Now
//                   </Link>
//                 </div>
//               </article>
//             ))}
//           </div>
//         </section>

//         {/* PROCESS */}
//         <section className="carrers-section" id="process" aria-label="Hiring process">
//           <div className="sec-head">
//             <h2>Hiring process</h2>
//             <p>Transparent, fast, and respectful. We keep it practical and role-focused.</p>
//           </div>

//           <div className="process">
//             <div className="step">
//               <div className="num">1</div>
//               <div>
//                 <div className="step-h">Apply</div>
//                 <div className="step-p">Share your resume and a short note about what you want to build.</div>
//               </div>
//             </div>

//             <div className="step">
//               <div className="num">2</div>
//               <div>
//                 <div className="step-h">Quick screen</div>
//                 <div className="step-p">A short call to align on role expectations, timeline, and fit.</div>
//               </div>
//             </div>

//             <div className="step">
//               <div className="num">3</div>
//               <div>
//                 <div className="step-h">Skill round</div>
//                 <div className="step-p">Practical review: task / portfolio / systems discussion based on role.</div>
//               </div>
//             </div>

//             <div className="step">
//               <div className="num">4</div>
//               <div>
//                 <div className="step-h">Offer</div>
//                 <div className="step-p">Final discussion + onboarding plan so you can start strong.</div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* FOOTER CTA */}
//         <section className="carrers-footer-cta" aria-label="Final call to action">
//           <div className="footer-card">
//             <div className="footer-a">Ready to join?</div>
//             <div className="footer-b">
//               Apply today and help us build systems that teams rely on — every day.
//             </div>

//             {/* Keep Apply Now button SAME className */}
//             <Link to="/jobs" className="carrers-btn" onClick={openApply}>
//               Apply Now
//             </Link>
//           </div>
//         </section>

//         {/* Modal */}
//         <JobApplyModal
//           open={modalOpen}
//           onClose={closeApply}
//           vacantRoles={vacantRoles.map((r) => r.title)}
//           onSubmit={onSubmit}
//           isSubmitting={isSubmitting}
//           uploadProgress={uploadProgress}
//         />
//       </div>
//     </AboutBackground>
//   );
// }





























import { useCallback, useMemo, useState, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { toast } from "react-toastify";
import API_BASE_URL from "../config";
import JobApplyModal from "../components/applyModal";
import "./projectsShowcase.css";

gsap.registerPlugin(ScrollTrigger);

const ROLES = [
  {
    title: "Frontend Developer",
    tagline: "React + Tailwind",
    description:
      "Build premium UI systems, component libraries, and performance-focused interfaces for modern enterprise products.",
    meta: "Full-time • Remote/Hybrid",
    tags: ["React", "Tailwind", "UX", "Performance"],
  },
  {
    title: "Full Stack Developer",
    tagline: "MERN Stack",
    description:
      "Ship end-to-end features, secure APIs, scalable data models, and production workflows from backend to frontend.",
    meta: "Full-time • Remote/Hybrid",
    tags: ["Node", "MongoDB", "APIs", "Security"],
  },
  {
    title: "Backend Developer",
    tagline: "Node.js + MongoDB",
    description:
      "Own backend services, optimize queries, and design robust architecture for scale across live products.",
    meta: "Full-time • Remote/Hybrid",
    tags: ["Node", "DB Design", "Caching", "Scaling"],
  },
  {
    title: "UI/UX Designer",
    tagline: "Figma",
    description:
      "Design modern enterprise UI, flows, and systems that feel premium and intuitive across web and mobile.",
    meta: "Contract/Full-time • Remote",
    tags: ["Figma", "Design System", "Prototyping", "UX"],
  },
];

const PROCESS_STEPS = [
  {
    num: "01",
    title: "Apply",
    body: "Share your resume and a short note about what you want to build with us.",
  },
  {
    num: "02",
    title: "Screen",
    body: "A short call to align on role expectations, timeline, and mutual fit.",
  },
  {
    num: "03",
    title: "Skill Round",
    body: "Practical review: task, portfolio, or systems discussion based on your role.",
  },
  {
    num: "04",
    title: "Offer",
    body: "Final discussion and onboarding plan so you can hit the ground running.",
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
  const pageRef = useRef(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const roleNames = useMemo(() => ROLES.map((r) => r.title), []);

  const openApply = useCallback((role, e) => {
    e?.preventDefault?.();
    setSelectedRole(role || null);
    setModalOpen(true);
  }, []);

  const closeApply = useCallback(() => setModalOpen(false), []);

  const onSubmit = useCallback(
    async (data) => {
      if (isSubmitting) return;
      setIsSubmitting(true);
      setUploadProgress(0);

      try {
        const formData = new FormData();
        formData.append("role", data.role);
        formData.append("fullName", data.fullName);
        formData.append("email", data.email);
        formData.append("phone", data.phone || "");
        formData.append("coverNote", data.coverNote || "");
        if (data.resumeFile) formData.append("resume", data.resumeFile);

        await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("POST", `${API_BASE_URL}/api/job-applications/apply`);

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              setUploadProgress(Math.round((event.loaded / event.total) * 100));
            }
          };

          xhr.onload = () => {
            const raw = xhr.responseText;
            if (xhr.status >= 200 && xhr.status < 300) return resolve();
            try {
              const err = JSON.parse(raw);
              reject(new Error(err.error || err.message || "Submission failed"));
            } catch {
              reject(new Error(raw || `Submission failed (HTTP ${xhr.status})`));
            }
          };

          xhr.onerror = () => reject(new Error("Network error"));
          xhr.send(formData);
        });

        toast.success("Application submitted successfully 🚀");
        setModalOpen(false);
      } catch (err) {
        console.error(err);
        toast.error(err?.message || "Failed to submit application");
      } finally {
        setIsSubmitting(false);
        setUploadProgress(0);
      }
    },
    [isSubmitting]
  );


  /* ── GSAP ── */
  useLayoutEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isMobile || prefersReducedMotion) return undefined;

    const ctx = gsap.context(() => {

      gsap.fromTo(".ps2-hero-title-inner",
        { y: "108%", immediateRender: true },
        { y: "0%", duration: 1.1, ease: "power4.out", stagger: 0.13, delay: 0.3 }
      );
      gsap.fromTo(".ps2-hero-caption",
        { y: 18, opacity: 0, immediateRender: true },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.75 }
      );

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
        <div className="ps2-hero-inner">
          <div className="ps2-hero-title-wrap">
            <p className="ps2-hero-eyebrow">House of Musa — Careers 2025</p>
            <h1 className="ps2-hero-title">
              <span className="ps2-hero-title-line">
                <span className="ps2-hero-title-inner">CAREERS.</span>
              </span>
            </h1>
            <p className="ps2-hero-sub">
              Build systems that matter. Join a team of engineers and designers
              shipping premium digital products for modern businesses.
            </p>
          </div>
        </div>
      </section>

      {/* ══ STATEMENT ══ */}
      <section className="ps2-statement">
        <div className="ps2-statement-inner">
          <p className="ps2-statement-body">
            {[
              "We hire builders, designers,",
              "and engineers who care about craft —",
              "people who want to ship work that matters.",
            ].map((line) => (
              <span key={line} className="ps2-statement-line-wrap">
                <span className="ps2-statement-line">{line}</span>
              </span>
            ))}
          </p>

          <div className="ps2-statement-subcols">
            <p className="ps2-statement-subcol">
              WE BUILD MODERN ENTERPRISE SYSTEMS: DASHBOARDS, WORKFLOWS, AUTOMATION, AND
              DATA-DRIVEN EXPERIENCES. IF YOU CARE ABOUT QUALITY AND REAL IMPACT, YOU'LL LOVE IT HERE.
            </p>
            <p className="ps2-statement-subcol">
              HIGH OWNERSHIP, FAST ITERATION, CLEAN CODE, AND STRONG ENGINEERING STANDARDS.
              REMOTE / HYBRID — STRONG TALENT IS ALWAYS WELCOME.
            </p>
          </div>
        </div>
      </section>

      {/* ══ HIRING PROCESS ══ */}
      <section className="ps2-process">
        <div className="ps2-process-topbar">
          <span className="ps2-process-label">HIRING PROCESS</span>
          <span className="ps2-process-counter">[HOM.CAREERS]</span>
        </div>

        <div className="ps2-process-inner">
          <div className="ps2-process-left">
            <h2 className="ps2-process-title">
              {["Transparent", "at every step"].map((line) => (
                <span key={line} className="ps2-word-line">
                  <span className="ps2-word-inner">{line}</span>
                </span>
              ))}
            </h2>
            <p className="ps2-process-desc">
              FAST, RESPECTFUL, AND ROLE-FOCUSED. WE KEEP IT PRACTICAL SO YOU KNOW
              EXACTLY WHERE YOU STAND FROM DAY ONE.
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

      {/* ══ OPEN ROLES ══ */}
      <section className="ps2-projects" id="roles">
        <h2 className="ps2-projects-headline">
          {["Open", "Roles"].map((w) => (
            <span key={w} className="ps2-word-line">
              <span className="ps2-word-inner">{w}</span>
            </span>
          ))}
        </h2>

        <div className="ps2-projects-grid">
          {ROLES.map((r, i) => (
            <div className="ps2-project-col" key={r.title}>
              <div className="ps2-project-meta">
                <span className="ps2-project-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="ps2-project-meta-line" aria-hidden="true" />
                <span className="ps2-project-tag">{r.tags[0]}</span>
              </div>
              <h3 className="ps2-project-title">{r.title}</h3>
              <p className="ps2-project-tagline">{r.tagline}</p>
              <p className="ps2-project-desc">{r.description}</p>
              <p className="ps2-project-role-meta">{r.meta}</p>
              <button
                className="ps2-apply-btn"
                onClick={(e) => openApply(r.title, e)}
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="ps2-footer">
        <div className="ps2-footer-inner">
          <div className="ps2-footer-left">
            <CrosshairIcon size={240} color="#FEDEBE" strokeWidth={0.7} />
          </div>

          <div className="ps2-footer-right">
            <nav className="ps2-footer-nav" aria-label="Footer navigation">
              <a href="/about">ABOUT</a>
              <a href="/projects">CAREERS</a>
              <a href="/gallery">GALLERY</a>
              <a href="/carrers">LEGACY</a>
              <a href="/story">STORY</a>
              <a href="/">HOME</a>
            </nav>

            <div className="ps2-footer-socials">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="ps2-footer-social-link">INSTAGRAM</a>
              <a href="https://linkedin.com"  target="_blank" rel="noopener noreferrer" className="ps2-footer-social-link">LINKEDIN</a>
              <a href="https://twitter.com"   target="_blank" rel="noopener noreferrer" className="ps2-footer-social-link">TWITTER / X</a>
            </div>

            <div className="ps2-footer-cta-row">
              <button
                className="ps2-apply-btn"
                onClick={(e) => openApply(null, e)}
              >
                Apply Now
              </button>
            </div>

            <div className="ps2-footer-bottom-row">
              <span className="ps2-footer-copy">&copy; 2026. HOUSE OF MUSA. ALL RIGHTS RESERVED.</span>
              <span className="ps2-footer-craft">CRAFTED WITH INTENTION.</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ══ MODAL ══ */}
      <JobApplyModal
        open={modalOpen}
        onClose={closeApply}
        vacantRoles={roleNames}
        defaultRole={selectedRole}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        uploadProgress={uploadProgress}
      />
    </div>
  );
}
