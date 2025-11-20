import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import "./jobPage.css";

/* =========================================
   Backend base URL (same-origin by default)
========================================= */
const API_BASE = import.meta?.env?.VITE_API_BASE || "";

/* =========================================
   Careers API helper (multipart-capable)
========================================= */
async function submitCareerApplication({
  name,
  email,
  phone,
  role,
  message, // UI field
  source,
  resumeFile, // optional File
}) {
  const fd = new FormData();
  fd.set("name", name);
  fd.set("email", email);
  fd.set("phone", phone);
  fd.set("role", role);
  fd.set("coverLetter", message || ""); // backend expects coverLetter
  if (source) fd.set("source", source);
  if (resumeFile) fd.set("resume", resumeFile);

  const resp = await fetch(`${API_BASE}/api/careers/apply`, {
    method: "POST",
    body: fd,
  });

  let data = {};
  try {
    data = await resp.json();
  } catch {
    // ignore JSON parse issues
  }

  if (!resp.ok) {
    const msg =
      data?.error ||
      data?.message ||
      (resp.status === 413
        ? "File too large (limit ~10MB)"
        : `Submission failed (HTTP ${resp.status})`);
    throw new Error(msg);
  }
  return data;
}

/* =========================================
   Static jobs list
========================================= */
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
      "Design robust APIs, optimize queries, and build scalable services with solid testing and monitoring.",
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

  /* =========================================
     Isolate from global CSS / Lenis
     - add .jobs-page to <html>
     - unlock html/body scroll
  ========================================== */
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const prevHtmlClass = html.className;
    const prevHtmlStyle = html.getAttribute("style") || "";
    const prevBodyStyle = body.getAttribute("style") || "";

    // Add flag class and reset scroll props
    html.className = `${prevHtmlClass} jobs-page`.trim();
    html.style.overflowY = "auto";
    html.style.height = "auto";

    body.style.overflowY = "auto";
    body.style.height = "auto";

    return () => {
      // Restore everything on unmount
      html.className = prevHtmlClass;
      html.setAttribute("style", prevHtmlStyle);
      body.setAttribute("style", prevBodyStyle);
    };
  }, []);

  /* =========================================
     Fake splash loader
  ========================================== */
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  /* =========================================
     Stagger hero + cards
  ========================================== */
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

  /* =========================================
     Filter jobs
  ========================================== */
  const jobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return JOBS;
    return JOBS.filter((j) =>
      [j.title, j.dept, j.type, j.tags.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [query]);

  return (
    <main ref={containerRef} className="jobs-root">
      {loading && <Loader />}

      {/* Hero */}
      <section className="hero">
        <div className="hero-head">
          Careers at <br /> <span className="brand">House of Musa</span>
        </div>
        <p className="hero-sub">
          Join a product-first team building performant, beautiful experiences.
          Smooth scroll, tasty animations, and real impact.
        </p>

        {/* Search */}
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

      {/* Jobs grid */}
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
        />
      )}
    </main>
  );
}

/* =========================================
   Loader
========================================= */
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

/* =========================================
   Job card
========================================= */
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
      gsap.to(el, {
        rotateX: yc * -6,
        rotateY: xc * 6,
        transformPerspective: 600,
        duration: 0.3,
      });
    };

    const onLeave = () => {
      gsap.to(el, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.4,
        ease: "power2.out",
      });
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
          <span key={t} className="tag">
            {t}
          </span>
        ))}
      </div>

      <div className="job-cta">
        <span className="salary">{job.salary}</span>
        <button onClick={onApply} className="btn-apply">
          Apply
        </button>
      </div>

      <div className="hover-glow" aria-hidden />
    </article>
  );
}

/* =========================================
   Apply modal
========================================= */
function ApplyModal({ job, onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    cover: "",
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [serverMsg, setServerMsg] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && !submitting && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, submitting]);

  useEffect(() => {
    gsap.fromTo(
      modalRef.current,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
    );
  }, []);

  const validate = () => {
    if (!form.name.trim()) return "Please enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      return "Enter a valid email";
    if (!/^[6-9]\d{9}$/.test(form.phone.trim()))
      return "Enter a valid 10-digit phone number";
    if (resumeFile && resumeFile.size > 10 * 1024 * 1024)
      return "Résumé must be ≤ 10MB";
    return "";
  };

  const submit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);
    setError("");
    setSubmitting(true);
    setServerMsg(null);

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        role: job.title,
        message: form.cover || "",
        source: `Jobs Page: ${job.id}`,
        resumeFile,
      };
      const resp = await submitCareerApplication(payload);
      setServerMsg({
        type: "ok",
        text: resp?.message || "Application submitted",
      });
      setTimeout(() => onClose(), 900);
    } catch (er) {
      setServerMsg({
        type: "err",
        text: er.message || "Failed to submit",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div className="modal-root">
      <div
        className="modal-backdrop"
        onClick={() => !submitting && onClose()}
      />
      <div ref={modalRef} className="modal-card">
        <div className="modal-head">
          <h4>Apply for {job.title}</h4>
          <p className="muted">
            {job.type} · {job.dept}
          </p>
        </div>

        <form onSubmit={submit} className="form">
          <Field label="Full Name">
            <input
              className="input"
              value={form.name}
              onChange={(e) =>
                setForm((s) => ({ ...s, name: e.target.value }))
              }
              placeholder="Your name"
              disabled={submitting}
            />
          </Field>

          <div className="grid-2">
            <Field label="Email">
              <input
                type="email"
                className="input"
                value={form.email}
                onChange={(e) =>
                  setForm((s) => ({ ...s, email: e.target.value }))
                }
                placeholder="you@example.com"
                disabled={submitting}
              />
            </Field>
            <Field label="Phone">
              <input
                className="input"
                value={form.phone}
                onChange={(e) =>
                  setForm((s) => ({ ...s, phone: e.target.value }))
                }
                placeholder="10-digit mobile"
                disabled={submitting}
              />
            </Field>
          </div>

          <Field label="Résumé (optional)">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="input"
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              disabled={submitting}
            />
          </Field>

          <Field label="Cover note (optional)">
            <textarea
              rows={4}
              className="textarea"
              value={form.cover}
              onChange={(e) =>
                setForm((s) => ({ ...s, cover: e.target.value }))
              }
              placeholder="Why you’re a great fit"
              disabled={submitting}
            />
          </Field>

          {error && <p className="error">{error}</p>}

          {serverMsg && (
            <p
              className={`server-note ${
                serverMsg.type === "ok" ? "ok" : "err"
              }`}
            >
              {serverMsg.text}
            </p>
          )}

          <div className="modal-actions">
            <button
              type="button"
              onClick={() => !submitting && onClose()}
              className="btn ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn primary ${submitting ? "loading" : ""}`}
              disabled={submitting}
            >
              {submitting ? "Submitting…" : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

/* =========================================
   Small field wrapper
========================================= */
function Field({ label, children }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
    </label>
  );
}
