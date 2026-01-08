import React, { useEffect, useMemo, useRef, useState } from "react";

const cn = (...a) => a.filter(Boolean).join(" ");

/**
 * JobApplyModal
 * - Tailwind-only modal (no libs)
 * - ESC to close, click outside to close
 * - Locks body scroll while open
 * - Role is a dropdown (vacant roles)
 *
 * Props:
 *  open: boolean
 *  onClose: () => void
 *  vacantRoles: string[]  // e.g. ["Frontend Developer (React + Tailwind)", "Backend Developer (Node.js)"]
 *  onSubmit?: (payload: {
 *    role: string,
 *    fullName: string,
 *    email: string,
 *    phone: string,
 *    resumeFile: File | null,
 *    coverNote: string
 *  }) => void | Promise<void>
 */
export default function JobApplyModal({
  open,
  onClose,
  vacantRoles = [],
  onSubmit,
}) {
  const dialogRef = useRef(null);
  const firstFieldRef = useRef(null);

  const defaultRole = useMemo(() => vacantRoles?.[0] ?? "", [vacantRoles]);

  const [role, setRole] = useState(defaultRole);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [coverNote, setCoverNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  // keep role valid if roles list changes
  useEffect(() => {
    if (!open) return;
    if (!role && defaultRole) setRole(defaultRole);
    if (role && !vacantRoles.includes(role)) setRole(defaultRole);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, vacantRoles, defaultRole]);

  // lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // ESC close + focus first field on open
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
      // basic focus trap (Tab stays inside)
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    const t = setTimeout(() => firstFieldRef.current?.focus(), 50);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      clearTimeout(t);
    };
  }, [open, onClose]);

  const resetForm = () => {
    setRole(defaultRole);
    setFullName("");
    setEmail("");
    setPhone("");
    setResumeFile(null);
    setCoverNote("");
  };

  const handleClose = () => {
    onClose?.();
    // optional: keep data or reset (you can remove this line if you want to keep form filled)
    // resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // minimal validation
    if (!role) return alert("Please select a role.");
    if (!fullName.trim()) return alert("Please enter your full name.");
    if (!email.trim()) return alert("Please enter your email.");
    if (!phone.trim()) return alert("Please enter your phone.");

    try {
      setSubmitting(true);
      const payload = { role, fullName, email, phone, resumeFile, coverNote };
      await onSubmit?.(payload);

      // success UX (customize)
      alert("Application submitted!");
      resetForm();
      onClose?.();
    } catch (err) {
      console.error(err);
      alert("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Apply for a role"
      onMouseDown={(e) => {
        // click outside to close
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* modal */}
      <div
        ref={dialogRef}
        className={cn(
          "relative w-full max-w-xl rounded-3xl border border-white/20",
          "bg-white/70 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl",
          "p-6 sm:p-7"
        )}
      >
        <div className="mb-5">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
            Apply for a Role
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            Full-time • Remote (India) • Engineering
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role dropdown */}
          <div>
            <label className="mb-1 block text-xs font-semibold tracking-wide text-slate-700">
              VACANT ROLE
            </label>
            <select
              ref={firstFieldRef}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={cn(
                "w-full rounded-2xl border border-white/30 bg-white/40",
                "px-4 py-3 text-sm text-slate-900 outline-none",
                "placeholder:text-slate-400",
                "focus:border-slate-400 focus:bg-white/60"
              )}
            >
              {vacantRoles.length ? (
                vacantRoles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))
              ) : (
                <option value="">No roles available</option>
              )}
            </select>
          </div>

          {/* Full name */}
          <div>
            <label className="mb-1 block text-xs font-semibold tracking-wide text-slate-700">
              FULL NAME
            </label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
              className={cn(
                "w-full rounded-2xl border border-white/30 bg-white/40",
                "px-4 py-3 text-sm text-slate-900 outline-none",
                "placeholder:text-slate-400",
                "focus:border-slate-400 focus:bg-white/60"
              )}
            />
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold tracking-wide text-slate-700">
                EMAIL
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                type="email"
                className={cn(
                  "w-full rounded-2xl border border-white/30 bg-white/40",
                  "px-4 py-3 text-sm text-slate-900 outline-none",
                  "placeholder:text-slate-400",
                  "focus:border-slate-400 focus:bg-white/60"
                )}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold tracking-wide text-slate-700">
                PHONE
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile"
                inputMode="numeric"
                className={cn(
                  "w-full rounded-2xl border border-white/30 bg-white/40",
                  "px-4 py-3 text-sm text-slate-900 outline-none",
                  "placeholder:text-slate-400",
                  "focus:border-slate-400 focus:bg-white/60"
                )}
              />
            </div>
          </div>

          {/* Resume */}
          <div>
            <label className="mb-1 block text-xs font-semibold tracking-wide text-slate-700">
              RESUME (OPTIONAL)
            </label>

            <div className="flex items-center gap-3 rounded-2xl border border-white/30 bg-white/40 px-4 py-3">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-slate-700
                           file:mr-3 file:rounded-xl file:border-0
                           file:bg-slate-900 file:px-4 file:py-2
                           file:text-xs file:font-semibold file:text-white
                           hover:file:bg-slate-800"
              />

              {progress > 0 && (
                <div className="mt-3">
                  <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-200"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-600 text-right">
                    Uploading… {progress}%
                  </p>
                </div>
              )}


            </div>

            {resumeFile ? (
              <p className="mt-2 text-xs text-slate-600">
                Selected: <span className="font-medium">{resumeFile.name}</span>
              </p>
            ) : null}
          </div>

          {/* Cover note */}
          <div>
            <label className="mb-1 block text-xs font-semibold tracking-wide text-slate-700">
              COVER NOTE (OPTIONAL)
            </label>
            <textarea
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              placeholder="Why you're a great fit"
              rows={5}
              className={cn(
                "w-full resize-none rounded-2xl border border-white/30 bg-white/40",
                "px-4 py-3 text-sm text-slate-900 outline-none",
                "placeholder:text-slate-400",
                "focus:border-slate-400 focus:bg-white/60"
              )}
            />
          </div>

          {/* actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className={cn(
                "rounded-2xl px-5 py-2.5 text-sm font-semibold",
                "bg-slate-200/70 text-slate-800 hover:bg-slate-200"
              )}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full rounded-xl py-3 font-semibold transition
    ${submitting ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-black/90"}
    text-white flex items-center justify-center gap-2`}
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </button>

          </div>
        </form>

        {/* top-right close button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-xl p-2 text-slate-700 hover:bg-white/40"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}