import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import Lenis from "@studio-freight/lenis";
import "./jobPage.css"; // <-- import the CSS file


const JOBS = [
  {
    id: "frontend-dev",
    title: "Frontend Developer (React + Tailwind)",
    dept: "Engineering",
    type: "Full-time · Remote (India)",
    tags: ["React", "TailwindCSS", "Vite", "GSAP"],
    salary: "₹10–15 LPA",
    about:
      "Own pixel-perfect UIs, animations, and performance. Collaborate with design to ship delightful experiences.",
  },
  {
    id: "backend-node",
    title: "Backend Engineer (Node.js + MongoDB)",
    dept: "Engineering",
    type: "Full-time · Hybrid (Kolkata)",
    tags: ["Node.js", "Express", "MongoDB", "REST"],
    salary: "₹12–18 LPA",
    about:
      "Design robust APIs, optimize queries, and build scalables services with solid testing and monitoring.",
  },
  {
    id: "ui-ux-designer",
    title: "UI/UX Designer",
    dept: "Design",
    type: "Contract · Remote",
    tags: ["Figma", "Prototyping", "Design Systems"],
    salary: "₹8–12 LPA",
    about:
      "Craft modern, accessible interfaces. Work closely with PM/Engineering to iterate quickly on user feedback.",
  },
  {
    id: "pm-tech",
    title: "Technical Product Manager",
    dept: "Product",
    type: "Full-time · On-site (Kolkata)",
    tags: ["Roadmaps", "Agile", "Stakeholder Mgmt"],
    salary: "₹20–28 LPA",
    about:
      "Own product discovery and delivery. Balance business goals with user needs and technical constraints.",
  },
];

export default function JobsPage() {
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [openJobId, setOpenJobId] = useState(null);
  const cardsRef = useRef([]);
  const containerRef = useRef(null);
  const tlRef = useRef(null);




  // Smooth scrolling
  useEffect(() => {
  // If it's a touch device, don't use Lenis—let native scrolling work.
  const isTouch =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(hover: none)").matches;

  if (isTouch) {
    // make sure any classes Lenis may have set are removed
    document.documentElement.classList.remove("lenis", "lenis-smooth", "lenis-stopped");
    return;
  }

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false, // not needed since we're not enabling on touch
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  return () => lenis.destroy();
}, []);





  // Fake splash loader
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  // Stagger in cards when ready
  useEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      tlRef.current = gsap
        .timeline({ defaults: { ease: "power2.out" } })
        .from(".hero-head", { y: 20, opacity: 0, duration: 0.6 })
        .from(".hero-sub", { y: 20, opacity: 0, duration: 0.6 }, "<0.1")
        .from(".filters", { y: 20, opacity: 0, duration: 0.6 }, "<0.05")
        .from(cardsRef.current, {
          opacity: 0,
          y: 24,
          rotateX: -6,
          transformOrigin: "top center",
          duration: 0.6,
          stagger: 0.08,
        });
    }, containerRef);

    return () => ctx.revert();
  }, [loading]);

  // Filtered jobs
  const jobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return JOBS;
    return JOBS.filter((j) =>
      [j.title, j.dept, j.type, j.tags.join(" ")].join(" ").toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <main ref={containerRef} className="jobs-root">
      {loading ? <Loader /> : null}

      {/* Header / Hero */}
      <section className="hero">
        <div className="hero-head">
          Careers at <br /> <span className="brand">House of Musa</span>
        </div>
        <p className="hero-sub">
          Join a product-first team building performant, beautiful experiences. Smooth scroll, tasty animations, and real impact.
        </p>

        {/* Filters / Search */}
        <div className="filters">
          <div className="search-wrap">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search roles, skills, or location..."
              className="search-input"
            />
            <span className="search-hint">⌘K</span>
          </div>
        </div>
      </section>

      {/* Jobs Grid */}
      <section className="jobs-grid-wrap">
        {jobs.length === 0 ? (
          <div className="empty-box">No roles match your search.</div>
        ) : (
          <div className="jobs-grid">
            {jobs.map((job, i) => (
              <JobCard
                key={job.id}
                innerRef={(el) => (cardsRef.current[i] = el)}
                job={job}
                onApply={() => setOpenJobId(job.id)}
              />
            ))}
          </div>
        )}
      </section>

      {openJobId && (
        <ApplyModal
          job={JOBS.find((j) => j.id === openJobId)}
          onClose={() => setOpenJobId(null)}
          onSubmit={(payload) => {
            console.log("Apply payload", payload);
            setOpenJobId(null);
            alert("Application submitted! We'll get back to you soon.");
          }}
        />
      )}
    </main>
  );
}

function Loader() {
  return (
    <div className="loader">
      <div className="loader-core">
        <div className="loader-ping" />
      </div>
      <p className="loader-text">Loading...</p>
    </div>
  );
}

function JobCard({ job, onApply, innerRef }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xc = x / rect.width - 0.5;
      const yc = y / rect.height - 0.5;
      gsap.to(el, { rotateX: yc * -6, rotateY: xc * 6, transformPerspective: 600, duration: 0.3 });
    };
    const onLeave = () => {
      gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.4, ease: "power2.out" });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <article
      ref={(node) => {
        cardRef.current = node;
        if (innerRef) innerRef(node);
      }}
      className="job-card"
    >
      <div className="job-card-top">
        <h3 className="job-title">{job.title}</h3>
        <span className="chip">{job.dept}</span>
      </div>

      <p className="job-meta">{job.type}</p>
      <p className="job-desc">{job.about}</p>

      <div className="job-tags">
        {job.tags.map((t) => (
          <span key={t} className="tag">{t}</span>
        ))}
      </div>

      <div className="job-cta">
        <span className="salary">{job.salary}</span>
        <button onClick={onApply} className="btn-apply">Apply</button>
      </div>

      {/* Glow on hover */}
      <div className="hover-glow" aria-hidden />
    </article>
  );
}

function ApplyModal({ job, onClose, onSubmit }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", cover: "" });
  const [error, setError] = useState("");
  const modalRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    gsap.fromTo(
      modalRef.current,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
    );
  }, []);

  const validate = () => {
    if (!form.name.trim()) return "Please enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return "Enter a valid email";
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) return "Enter a valid 10-digit phone number";
    return "";
  };

  const submit = (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);
    setError("");
    onSubmit({ jobId: job.id, ...form });
  };

  return createPortal(
    <div className="modal-root">
      <div className="modal-backdrop" onClick={onClose} />
      <div ref={modalRef} className="modal-card">
        <div className="modal-head">
          <h4>Apply for {job.title}</h4>
          <p className="muted">{job.type} · {job.dept}</p>
        </div>

        <form onSubmit={submit} className="form">
          <Field label="Full Name">
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              placeholder="Your name"
            />
          </Field>
          <div className="grid-2">
            <Field label="Email">
              <input
                type="email"
                className="input"
                value={form.email}
                onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                placeholder="you@example.com"
              />
            </Field>
            <Field label="Phone">
              <input
                className="input"
                value={form.phone}
                onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
                placeholder="10-digit mobile"
              />
            </Field>
          </div>
          <Field label="Cover note (optional)">
            <textarea
              rows={4}
              className="textarea"
              value={form.cover}
              onChange={(e) => setForm((s) => ({ ...s, cover: e.target.value }))}
              placeholder="Why you’re a great fit"
            />
          </Field>

          {error ? <p className="error">{error}</p> : null}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn ghost">Cancel</button>
            <button type="submit" className="btn primary">Submit Application</button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

function Field({ label, children }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
    </label>
  );
}
