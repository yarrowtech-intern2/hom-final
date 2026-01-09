// import React, { useCallback, useMemo, useState, useEffect } from "react";
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


















































import React, { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AboutBackground from "../components/AboutBg";
import JobApplyModal from "../components/applyModal";
import "./career2.css";

/**
 * Careers Page (Industry-level, mobile-first, optimized)
 * - Uses AboutBackground (AboutBg) for cinematic background
 * - No 3D model inside this page
 * - Keeps Apply Now button className = "carrers-btn"
 * - Scroll-safe (no overflow hidden on body/root)
 */
export default function CareerPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const vacantRoles = useMemo(
    () => [
      {
        title: "Frontend Developer (React + Tailwind)",
        meta: "Full-time • Remote/Hybrid",
        desc: "Build premium UI systems, component libraries, and performance-focused interfaces.",
        tags: ["React", "Tailwind", "UX", "Performance"],
      },
      {
        title: "Full Stack Developer (MERN)",
        meta: "Full-time • Remote/Hybrid",
        desc: "Ship end-to-end features, secure APIs, scalable data models, and production workflows.",
        tags: ["Node", "MongoDB", "APIs", "Security"],
      },
      {
        title: "Backend Developer (Node.js + MongoDB)",
        meta: "Full-time • Remote/Hybrid",
        desc: "Own backend services, optimize queries, and design robust architecture for scale.",
        tags: ["Node", "DB Design", "Caching", "Scaling"],
      },
      {
        title: "UI/UX Designer (Figma)",
        meta: "Contract/Full-time • Remote",
        desc: "Design modern enterprise UI, flows, and systems that feel premium and intuitive.",
        tags: ["Figma", "Design System", "Prototyping", "UX"],
      },
    ],
    []
  );

  const openApply = useCallback((e) => {
    e?.preventDefault?.();
    setModalOpen(true);
  }, []);

  const closeApply = useCallback(() => setModalOpen(false), []);

  // Optional: keep your existing submit behavior (upload progress + toast)
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
          xhr.open("POST", `${import.meta.env.VITE_API_URL}/api/job-applications/apply`);

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percent = Math.round((event.loaded / event.total) * 100);
              setUploadProgress(percent);
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

  return (
    <AboutBackground pages={7}>
      {/* IMPORTANT: This wrapper lives in Scroll html (from AboutBg). Keep it normal-flow */}
      <div className="carrers-wrap pt-20 p-5">
        {/* TOP BAR */}
        {/* <header className="carrers-topbar" role="banner">
          <div className="carrers-brand">
            <div className="carrers-mark" aria-hidden="true" />
            <div className="carrers-brand-stack">
              <div className="carrers-brand-title">Careers</div>
              <div className="carrers-brand-sub">
                Build high-impact systems with a team that values craft, speed, and ownership.
              </div>
            </div>
          </div>

          <nav className="carrers-nav" aria-label="Careers navigation">
            <a className="carrers-link" href="#roles">
              Open Roles
            </a>
            <a className="carrers-link" href="#process">
              Hiring Process
            </a>

            
            <Link to="/jobs" className="carrers-btn carrers-btn--top" onClick={openApply}>
              Apply Now
            </Link>
          </nav>
        </header> */}

        {/* HERO */}
        <section className="carrers-hero" aria-label="Careers hero">
          <div className="carrers-hero-left">
            <div className="carrers-kicker">
              <span className="dot" aria-hidden="true" />
              JOIN THE TEAM
            </div>

            <h1 className="carrers-hero-title">
              Build products that feel premium — and perform at scale.
            </h1>

            <p className="carrers-hero-sub">
              We design and ship modern enterprise systems: dashboards, workflows, automation, and
              data-driven experiences. If you care about quality, velocity, and real impact, you’ll
              love working here.
            </p>

            <div className="carrers-hero-actions">
              {/* Keep Apply Now button SAME className */}
              <Link to="/jobs" className="carrers-btn" onClick={openApply}>
                Apply Now
              </Link>

              <a className="carrers-secondary" href="#roles">
                View Open Roles
              </a>
            </div>

            <div className="carrers-trust">
              <div className="chip">High Ownership</div>
              <div className="chip">Fast Iteration</div>
              <div className="chip">Clean UI + Strong Backend</div>
              <div className="chip">Security-first</div>
            </div>
          </div>

          <aside className="carrers-hero-right" aria-label="Team highlights">
            <div className="carrers-panel">
              <div className="panel-title">What you can expect</div>

              <ul className="panel-list">
                <li>
                  <span className="tick" aria-hidden="true" />
                  Clear ownership and real responsibilities
                </li>
                <li>
                  <span className="tick" aria-hidden="true" />
                  Design systems + engineering best practices
                </li>
                <li>
                  <span className="tick" aria-hidden="true" />
                  Performance-minded development
                </li>
                <li>
                  <span className="tick" aria-hidden="true" />
                  A culture that respects focus and quality
                </li>
              </ul>

              <div className="panel-divider" />

              <div className="panel-metrics">
                <div className="metric">
                  <div className="metric-k">Work style</div>
                  <div className="metric-v">Remote / Hybrid</div>
                </div>
                <div className="metric">
                  <div className="metric-k">Growth</div>
                  <div className="metric-v">Mentorship + Projects</div>
                </div>
                <div className="metric">
                  <div className="metric-k">Quality</div>
                  <div className="metric-v">Review + Standards</div>
                </div>
              </div>

              <p className="panel-foot">
                Prefer email? Send your resume to{" "}
                <span className="strong">careers@yourcompany.com</span>
              </p>
            </div>
          </aside>
        </section>

        {/* WHY JOIN */}
        <section className="carrers-section" aria-label="Why join">
          <div className="sec-head">
            <h2>Why join us</h2>
            <p>
              We hire for clarity, execution, and long-term thinking. You’ll work on meaningful
              systems used by real teams — with strong engineering standards and product focus.
            </p>
          </div>

          <div className="grid-3">
            <article className="card">
              <div className="card-title">Professional engineering</div>
              <div className="card-sub">
                Clean architecture, code reviews, reusable components, and scalable backend patterns.
              </div>
            </article>

            <article className="card">
              <div className="card-title">Ownership-driven culture</div>
              <div className="card-sub">
                You own outcomes, not just tasks. Ship, measure, improve — with autonomy and trust.
              </div>
            </article>

            <article className="card">
              <div className="card-title">Learning & growth</div>
              <div className="card-sub">
                Mentorship, documentation, and fast feedback loops — without unnecessary meetings.
              </div>
            </article>
          </div>
        </section>

        {/* VALUES */}
        <section className="carrers-section" aria-label="Values">
          <div className="sec-head">
            <h2>Our values</h2>
            <p>A simple culture that keeps the team aligned while moving fast.</p>
          </div>

          <div className="grid-4">
            <article className="card small">
              <div className="card-title">Craft</div>
              <div className="card-sub">Details matter. Quality is non-negotiable.</div>
            </article>

            <article className="card small">
              <div className="card-title">Ownership</div>
              <div className="card-sub">Solve problems end-to-end. Don’t wait.</div>
            </article>

            <article className="card small">
              <div className="card-title">Speed</div>
              <div className="card-sub">Move fast with clarity, not chaos.</div>
            </article>

            <article className="card small">
              <div className="card-title">Integrity</div>
              <div className="card-sub">Trust is built by doing the right thing.</div>
            </article>
          </div>
        </section>

        {/* ROLES */}
        <section className="carrers-section" id="roles" aria-label="Open roles">
          <div className="sec-head">
            <h2>Open roles</h2>
            <p>
              Don’t see your exact role? Apply anyway — strong talent is always welcome.
            </p>
          </div>

          <div className="roles">
            {vacantRoles.map((r) => (
              <article className="role" key={r.title}>
                <div className="role-left">
                  <div className="role-title">{r.title}</div>
                  <div className="role-meta">{r.meta}</div>
                  <p className="role-desc">{r.desc}</p>
                  <div className="role-tags">
                    {r.tags.map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="role-right">
                  {/* Keep Apply Now button SAME className */}
                  <Link to="/jobs" className="carrers-btn" onClick={openApply}>
                    Apply Now
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* PROCESS */}
        <section className="carrers-section" id="process" aria-label="Hiring process">
          <div className="sec-head">
            <h2>Hiring process</h2>
            <p>Transparent, fast, and respectful. We keep it practical and role-focused.</p>
          </div>

          <div className="process">
            <div className="step">
              <div className="num">1</div>
              <div>
                <div className="step-h">Apply</div>
                <div className="step-p">Share your resume and a short note about what you want to build.</div>
              </div>
            </div>

            <div className="step">
              <div className="num">2</div>
              <div>
                <div className="step-h">Quick screen</div>
                <div className="step-p">A short call to align on role expectations, timeline, and fit.</div>
              </div>
            </div>

            <div className="step">
              <div className="num">3</div>
              <div>
                <div className="step-h">Skill round</div>
                <div className="step-p">Practical review: task / portfolio / systems discussion based on role.</div>
              </div>
            </div>

            <div className="step">
              <div className="num">4</div>
              <div>
                <div className="step-h">Offer</div>
                <div className="step-p">Final discussion + onboarding plan so you can start strong.</div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER CTA */}
        <section className="carrers-footer-cta" aria-label="Final call to action">
          <div className="footer-card">
            <div className="footer-a">Ready to join?</div>
            <div className="footer-b">
              Apply today and help us build systems that teams rely on — every day.
            </div>

            {/* Keep Apply Now button SAME className */}
            <Link to="/jobs" className="carrers-btn" onClick={openApply}>
              Apply Now
            </Link>
          </div>
        </section>

        {/* Modal */}
        <JobApplyModal
          open={modalOpen}
          onClose={closeApply}
          vacantRoles={vacantRoles.map((r) => r.title)}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          uploadProgress={uploadProgress}
        />
      </div>
    </AboutBackground>
  );
}
