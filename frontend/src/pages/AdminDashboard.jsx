import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API_BASE_URL from "../config";

const STATUS_OPTIONS = ["NEW", "IN_REVIEW", "SHORTLISTED", "REJECTED", "HIRED"];

const STATUS_STYLES = {
  NEW:         { bg: "#FD5602", color: "#180802" },
  IN_REVIEW:   { bg: "#F7E362", color: "#180802" },
  SHORTLISTED: { bg: "#180802", color: "#FEDEBE" },
  REJECTED:    { bg: "#F2C7BC", color: "#6D2312" },
  HIRED:       { bg: "#D8F3DC", color: "#0F5132" },
};

function useAdminToken() {
  return localStorage.getItem("ADMIN_TOKEN") || "";
}

function formatRelative(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString();
}

// ── UI atoms ──────────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || { bg: "rgba(24,8,2,0.12)", color: "#180802" };
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "3px 10px",
      borderRadius: "999px",
      background: s.bg,
      color: s.color,
      fontSize: "10px",
      fontWeight: 800,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      whiteSpace: "nowrap",
    }}>
      {status || "UNKNOWN"}
    </span>
  );
}

function StatCard({ label, value, detail, accent }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.72)",
      border: "1px solid rgba(24,8,2,0.08)",
      borderRadius: "20px",
      padding: "1.1rem 1.25rem",
      borderLeft: accent ? `3px solid ${accent}` : undefined,
    }}>
      <div style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(24,8,2,0.4)" }}>
        {label}
      </div>
      <div style={{ marginTop: "0.5rem", fontSize: "2.25rem", fontWeight: 900, letterSpacing: "-0.06em", lineHeight: 1, color: "#180802" }}>
        {value}
      </div>
      <div style={{ marginTop: "0.4rem", fontSize: "12px", color: "rgba(24,8,2,0.55)" }}>{detail}</div>
    </div>
  );
}

function SkeletonRow({ cols }) {
  return (
    <tr style={{ borderTop: "1px solid rgba(24,8,2,0.08)" }}>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} style={{ padding: "16px 28px" }}>
          <div style={{
            height: "14px",
            borderRadius: "8px",
            background: "rgba(24,8,2,0.07)",
            width: i === 0 ? "70%" : i === 1 ? "50%" : "60%",
            animation: "pulse 1.4s ease-in-out infinite",
          }} />
        </td>
      ))}
    </tr>
  );
}

function SkeletonCard() {
  return (
    <div style={{
      borderRadius: "20px",
      border: "1px solid rgba(24,8,2,0.08)",
      background: "rgba(255,255,255,0.74)",
      padding: "1rem",
    }}>
      {[70, 50, 40].map((w, i) => (
        <div key={i} style={{
          height: "12px",
          borderRadius: "8px",
          background: "rgba(24,8,2,0.07)",
          width: `${w}%`,
          marginBottom: i < 2 ? "10px" : 0,
          animation: "pulse 1.4s ease-in-out infinite",
        }} />
      ))}
    </div>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function RefreshIcon({ spinning }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      style={{ animation: spinning ? "spin 0.8s linear infinite" : "none" }}>
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const nav = useNavigate();
  const token = useAdminToken();

  const [tab, setTab] = useState("applications");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [apps, setApps] = useState([]);
  const [status, setStatus] = useState("");
  const [appsTotal, setAppsTotal] = useState(0);
  const [contacts, setContacts] = useState([]);
  const [contactsTotal, setContactsTotal] = useState(0);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => { if (!token) nav("/admin123"); }, [nav, token]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const headers = useMemo(() => ({ "x-admin-token": token }), [token]);
  const isApplications = tab === "applications";

  const fetchApplications = useCallback(async (silent = false) => {
    silent ? setRefreshing(true) : setLoading(true);
    try {
      const url = new URL(`${API_BASE_URL}/api/job-applications`);
      if (q) url.searchParams.set("q", q);
      if (status) url.searchParams.set("status", status);
      url.searchParams.set("limit", "50");
      const res = await fetch(url.toString(), { headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load applications");
      setApps(data.items || []);
      setAppsTotal(data.total || 0);
    } catch (error) {
      toast.error(error.message);
    } finally {
      silent ? setRefreshing(false) : setLoading(false);
    }
  }, [headers, q, status]);

  const fetchContacts = useCallback(async (silent = false) => {
    silent ? setRefreshing(true) : setLoading(true);
    try {
      const url = new URL(`${API_BASE_URL}/api/admin/contacts`);
      if (q) url.searchParams.set("q", q);
      url.searchParams.set("limit", "50");
      const res = await fetch(url.toString(), { headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load contacts");
      setContacts(data.items || []);
      setContactsTotal(data.total || 0);
    } catch (error) {
      toast.error(error.message);
    } finally {
      silent ? setRefreshing(false) : setLoading(false);
    }
  }, [headers, q]);

  useEffect(() => {
    if (!token) return;
    if (isApplications) fetchApplications();
    else fetchContacts();
  }, [fetchApplications, fetchContacts, isApplications, token]);

  const onSearch = (e) => {
    e.preventDefault();
    if (isApplications) fetchApplications();
    else fetchContacts();
  };

  const logout = () => {
    localStorage.removeItem("ADMIN_TOKEN");
    nav("/admin123");
  };

  const downloadResume = async (appId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/job-applications/${appId}/resume`, { headers });
      if (!res.ok) throw new Error((await res.text()) || "Resume download failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `resume-${appId}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Optimistic status update
  const updateStatus = async (appId, nextStatus) => {
    // Optimistically update UI
    setApps(prev => prev.map(a => a._id === appId ? { ...a, status: nextStatus } : a));
    try {
      const res = await fetch(`${API_BASE_URL}/api/job-applications/${appId}/status`, {
        method: "PATCH",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");
      toast.success("Status updated");
    } catch (error) {
      toast.error(error.message);
      fetchApplications(true); // revert on failure
    }
  };

  const breakdown = useMemo(() =>
    apps.reduce((acc, a) => {
      const k = a.status || "NEW";
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, { NEW: 0, IN_REVIEW: 0, SHORTLISTED: 0, REJECTED: 0, HIRED: 0 }),
  [apps]);

  const heroStats = isApplications
    ? [
        { label: "Total", value: appsTotal, detail: "Applications in view", accent: "#FD5602" },
        { label: "New", value: breakdown.NEW, detail: "Awaiting review", accent: "#FD5602" },
        { label: "Shortlisted", value: breakdown.SHORTLISTED, detail: "Moved forward", accent: "#180802" },
        { label: "Hired", value: breakdown.HIRED, detail: "Offers extended", accent: "#0F5132" },
      ]
    : [
        { label: "Contacts", value: contactsTotal, detail: "Messages in view", accent: "#FD5602" },
        { label: "Filter", value: q ? "Active" : "Off", detail: q ? "Filtered results" : "Showing all", accent: "#180802" },
      ];

  return (
    <>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .dash-row:hover { background: rgba(253,86,2,0.04) !important; }
        .dash-tab { transition: background 0.18s, color 0.18s, border-color 0.18s; }
        .dash-btn:hover:not(:disabled) { opacity: 0.85; transform: translateY(-1px); }
        .dash-btn { transition: opacity 0.15s, transform 0.15s; }
      `}</style>

      <main style={{
        minHeight: "100vh",
        background: "#0f0704",
        paddingTop: "5rem",
        paddingBottom: "3rem",
        color: "#FEDEBE",
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.25rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* ── Header card ─────────────────────────────────────── */}
          <div style={{ borderRadius: "28px", overflow: "hidden", border: "1px solid rgba(254,222,190,0.08)", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
            {/* Orange hero band */}
            <div style={{ background: "#FD5602", padding: "1.75rem 1.75rem 1.5rem" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "flex-end", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(24,8,2,0.5)", marginBottom: "0.5rem" }}>
                    House of Musa · Admin
                  </p>
                  <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.07em", lineHeight: 0.9, color: "#180802", margin: 0 }}>
                    Admin<br />Dashboard
                  </h1>
                </div>

                {/* Controls */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
                  {["applications", "contacts"].map(t => (
                    <button key={t} type="button" onClick={() => setTab(t)} className="dash-tab"
                      style={{
                        padding: "8px 18px",
                        borderRadius: "999px",
                        border: `1px solid ${tab === t ? "#180802" : "rgba(24,8,2,0.2)"}`,
                        background: tab === t ? "#180802" : "rgba(255,255,255,0.28)",
                        color: tab === t ? "#FEDEBE" : "#180802",
                        fontSize: "12px",
                        fontWeight: 800,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}>
                      {t}
                    </button>
                  ))}
                  <button type="button" onClick={logout} className="dash-tab"
                    style={{
                      padding: "8px 18px",
                      borderRadius: "999px",
                      border: "1px solid #180802",
                      background: "transparent",
                      color: "#180802",
                      fontSize: "12px",
                      fontWeight: 800,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}>
                    Logout
                  </button>
                </div>
              </div>
            </div>

            {/* Stat cards */}
            <div style={{
              background: "#FEDEBE",
              padding: "1.25rem 1.5rem",
              display: "grid",
              gridTemplateColumns: `repeat(auto-fit, minmax(160px, 1fr))`,
              gap: "0.75rem",
            }}>
              {heroStats.map(s => <StatCard key={s.label} {...s} />)}
            </div>
          </div>

          {/* ── Search / filter ──────────────────────────────────── */}
          <div style={{
            background: "#FEDEBE",
            border: "1px solid rgba(24,8,2,0.08)",
            borderRadius: "24px",
            padding: "1.5rem",
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <p style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(24,8,2,0.4)", marginBottom: "0.3rem" }}>
                  Search & filter
                </p>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 900, letterSpacing: "-0.05em", textTransform: "uppercase", color: "#180802", margin: 0 }}>
                  {isApplications ? "Candidate queue" : "Contact inbox"}
                </h2>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "12px", color: "rgba(24,8,2,0.45)" }}>
                  {loading ? "Loading…" : `${isApplications ? appsTotal : contactsTotal} results`}
                </span>
                <button type="button" className="dash-btn"
                  onClick={() => isApplications ? fetchApplications(true) : fetchContacts(true)}
                  disabled={refreshing}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    padding: "6px 14px",
                    borderRadius: "999px",
                    border: "1px solid rgba(24,8,2,0.15)",
                    background: "rgba(24,8,2,0.06)",
                    color: "#180802",
                    fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                    cursor: refreshing ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                  }}>
                  <RefreshIcon spinning={refreshing} />
                  Refresh
                </button>
              </div>
            </div>

            <form onSubmit={onSearch} style={{ display: "grid", gap: "0.625rem", gridTemplateColumns: isApplications ? "1fr 200px 160px" : "1fr 160px" }}>
              <input value={q} onChange={e => setQ(e.target.value)}
                placeholder={isApplications ? "Search name, email, or role…" : "Search name, email, or message…"}
                style={{
                  minHeight: "48px",
                  padding: "0 16px",
                  borderRadius: "14px",
                  border: "1px solid rgba(24,8,2,0.12)",
                  background: "rgba(255,255,255,0.8)",
                  fontSize: "13px",
                  color: "#180802",
                  outline: "none",
                  fontFamily: "inherit",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onFocus={e => { e.target.style.borderColor = "#FD5602"; e.target.style.boxShadow = "0 0 0 3px rgba(253,86,2,0.12)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(24,8,2,0.12)"; e.target.style.boxShadow = "none"; }}
              />

              {isApplications && (
                <select value={status} onChange={e => setStatus(e.target.value)}
                  style={{
                    minHeight: "48px",
                    padding: "0 14px",
                    borderRadius: "14px",
                    border: "1px solid rgba(24,8,2,0.12)",
                    background: "rgba(255,255,255,0.8)",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#180802",
                    outline: "none",
                    fontFamily: "inherit",
                    cursor: "pointer",
                  }}>
                  <option value="">All statuses</option>
                  {STATUS_OPTIONS.map(o => <option key={o} value={o}>{o.replaceAll("_", " ")}</option>)}
                </select>
              )}

              <button type="submit" disabled={loading} className="dash-btn"
                style={{
                  minHeight: "48px",
                  borderRadius: "14px",
                  border: "none",
                  background: "#180802",
                  color: "#FEDEBE",
                  fontSize: "12px",
                  fontWeight: 800,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                  fontFamily: "inherit",
                }}>
                {loading ? "Loading…" : "Search"}
              </button>
            </form>
          </div>

          {/* ── Data section ─────────────────────────────────────── */}
          {isApplications ? (
            <ApplicationsSection
              apps={apps}
              loading={loading}
              expandedId={expandedId}
              setExpandedId={setExpandedId}
              updateStatus={updateStatus}
              downloadResume={downloadResume}
            />
          ) : (
            <ContactsSection contacts={contacts} loading={loading} />
          )}
        </div>
      </main>
    </>
  );
}

// ── Applications ───────────────────────────────────────────────────────────────

function ApplicationsSection({ apps, loading, expandedId, setExpandedId, updateStatus, downloadResume }) {
  return (
    <div style={{
      background: "#FEDEBE",
      border: "1px solid rgba(24,8,2,0.08)",
      borderRadius: "24px",
      overflow: "hidden",
      boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
    }}>
      <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid rgba(24,8,2,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(24,8,2,0.4)" }}>
          Applications
        </span>
        {!loading && apps.length > 0 && (
          <span style={{ fontSize: "11px", color: "rgba(24,8,2,0.4)" }}>{apps.length} shown</span>
        )}
      </div>

      {/* Mobile cards */}
      <div style={{ display: "block", padding: "0.75rem" }} className="sm:hidden">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <div key={i} style={{ marginBottom: "0.6rem" }}><SkeletonCard /></div>)
          : apps.length
            ? apps.map(app => (
                <AppCard key={app._id} app={app} expanded={expandedId === app._id}
                  toggle={() => setExpandedId(expandedId === app._id ? null : app._id)}
                  updateStatus={updateStatus} downloadResume={downloadResume} />
              ))
            : <EmptyState message="No applications found for the current filters." />
        }
      </div>

      {/* Desktop table */}
      <div style={{ overflowX: "auto", display: "none" }} className="sm:block">
        <table style={{ minWidth: "100%", borderCollapse: "collapse", fontSize: "13px", color: "#180802" }}>
          <thead>
            <tr style={{ background: "rgba(24,8,2,0.04)" }}>
              {["Candidate", "Role", "Contact", "Status", "Resume", ""].map(h => (
                <th key={h} style={{ padding: "12px 24px", textAlign: "left", fontSize: "10px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(24,8,2,0.45)", whiteSpace: "nowrap" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={6} />)
              : apps.length
                ? apps.map(app => (
                    <React.Fragment key={app._id}>
                      <tr className="dash-row" style={{ borderTop: "1px solid rgba(24,8,2,0.07)", cursor: "pointer", transition: "background 0.15s" }}
                        onClick={() => setExpandedId(expandedId === app._id ? null : app._id)}>
                        <td style={{ padding: "14px 24px", verticalAlign: "middle" }}>
                          <div style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>{app.fullName || "—"}</div>
                          <div style={{ fontSize: "11px", color: "rgba(24,8,2,0.42)", marginTop: "2px" }}>{formatRelative(app.createdAt)}</div>
                        </td>
                        <td style={{ padding: "14px 24px", verticalAlign: "middle" }}>
                          <div style={{ fontWeight: 600 }}>{app.role || "—"}</div>
                        </td>
                        <td style={{ padding: "14px 24px", verticalAlign: "middle" }}>
                          <div>{app.email || "—"}</div>
                          <div style={{ fontSize: "11px", color: "rgba(24,8,2,0.5)", marginTop: "2px" }}>{app.phone || "—"}</div>
                        </td>
                        <td style={{ padding: "14px 24px", verticalAlign: "middle" }} onClick={e => e.stopPropagation()}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <StatusBadge status={app.status} />
                            <select value={app.status || "NEW"} onChange={e => updateStatus(app._id, e.target.value)}
                              style={{
                                padding: "5px 10px",
                                borderRadius: "10px",
                                border: "1px solid rgba(24,8,2,0.12)",
                                background: "white",
                                fontSize: "12px",
                                color: "#180802",
                                fontFamily: "inherit",
                                cursor: "pointer",
                                outline: "none",
                              }}>
                              {STATUS_OPTIONS.map(o => <option key={o} value={o}>{o.replaceAll("_", " ")}</option>)}
                            </select>
                          </div>
                        </td>
                        <td style={{ padding: "14px 24px", verticalAlign: "middle" }} onClick={e => e.stopPropagation()}>
                          {app.resumePath
                            ? <button type="button" onClick={() => downloadResume(app._id)} className="dash-btn"
                                style={{ padding: "6px 14px", borderRadius: "999px", border: "none", background: "#180802", color: "#FEDEBE", fontSize: "11px", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>
                                Download
                              </button>
                            : <span style={{ fontSize: "12px", color: "rgba(24,8,2,0.35)" }}>No resume</span>
                          }
                        </td>
                        <td style={{ padding: "14px 20px", verticalAlign: "middle", color: "rgba(24,8,2,0.4)" }}>
                          <ChevronIcon open={expandedId === app._id} />
                        </td>
                      </tr>
                      {expandedId === app._id && (
                        <tr style={{ borderTop: "none" }}>
                          <td colSpan={6} style={{ padding: "0 24px 16px" }}>
                            <ExpandedDetail app={app} />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                : (
                  <tr>
                    <td colSpan={6} style={{ padding: "3rem", textAlign: "center" }}>
                      <EmptyState message="No applications found for the current filters." />
                    </td>
                  </tr>
                )
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ExpandedDetail({ app }) {
  return (
    <div style={{
      background: "rgba(24,8,2,0.04)",
      border: "1px solid rgba(24,8,2,0.08)",
      borderRadius: "16px",
      padding: "1rem 1.25rem",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "1rem",
    }}>
      {app.coverLetter && (
        <div style={{ gridColumn: "1 / -1" }}>
          <p style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(24,8,2,0.4)", marginBottom: "0.4rem" }}>Cover letter</p>
          <p style={{ fontSize: "13px", lineHeight: 1.65, color: "rgba(24,8,2,0.75)", whiteSpace: "pre-wrap" }}>{app.coverLetter}</p>
        </div>
      )}
      {app.message && (
        <div style={{ gridColumn: "1 / -1" }}>
          <p style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(24,8,2,0.4)", marginBottom: "0.4rem" }}>Message</p>
          <p style={{ fontSize: "13px", lineHeight: 1.65, color: "rgba(24,8,2,0.75)", whiteSpace: "pre-wrap" }}>{app.message}</p>
        </div>
      )}
      <div>
        <p style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(24,8,2,0.4)", marginBottom: "0.3rem" }}>Submitted</p>
        <p style={{ fontSize: "13px", color: "#180802" }}>{formatDate(app.createdAt)}</p>
      </div>
      {app.portfolioUrl && (
        <div>
          <p style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(24,8,2,0.4)", marginBottom: "0.3rem" }}>Portfolio</p>
          <a href={app.portfolioUrl} target="_blank" rel="noreferrer"
            style={{ fontSize: "13px", color: "#FD5602", textDecoration: "none", wordBreak: "break-all" }}>
            {app.portfolioUrl}
          </a>
        </div>
      )}
      {!app.coverLetter && !app.message && !app.portfolioUrl && (
        <p style={{ gridColumn: "1/-1", fontSize: "13px", color: "rgba(24,8,2,0.4)", fontStyle: "italic" }}>No additional details provided.</p>
      )}
    </div>
  );
}

function AppCard({ app, expanded, toggle, updateStatus, downloadResume }) {
  return (
    <div style={{
      marginBottom: "0.6rem",
      borderRadius: "20px",
      border: "1px solid rgba(24,8,2,0.1)",
      background: "rgba(255,255,255,0.74)",
      overflow: "hidden",
    }}>
      <div style={{ padding: "1rem", cursor: "pointer" }} onClick={toggle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontWeight: 900, letterSpacing: "-0.04em", textTransform: "uppercase", color: "#180802", margin: 0, fontSize: "1rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{app.fullName || "—"}</h3>
            <p style={{ fontSize: "12px", color: "rgba(24,8,2,0.55)", marginTop: "2px" }}>{app.email || "—"}</p>
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(24,8,2,0.38)", marginTop: "3px" }}>{app.role || "No role"} · {formatRelative(app.createdAt)}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px", flexShrink: 0 }}>
            <StatusBadge status={app.status} />
            <span style={{ color: "rgba(24,8,2,0.35)" }}><ChevronIcon open={expanded} /></span>
          </div>
        </div>
      </div>

      {expanded && (
        <div style={{ borderTop: "1px solid rgba(24,8,2,0.08)", padding: "0.75rem 1rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {(app.coverLetter || app.message) && (
            <div style={{ background: "rgba(24,8,2,0.04)", borderRadius: "12px", padding: "0.7rem 0.9rem" }}>
              <p style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(24,8,2,0.4)", marginBottom: "0.35rem" }}>
                {app.coverLetter ? "Cover letter" : "Message"}
              </p>
              <p style={{ fontSize: "12px", lineHeight: 1.6, color: "rgba(24,8,2,0.7)", whiteSpace: "pre-wrap" }}>{app.coverLetter || app.message}</p>
            </div>
          )}
          <select value={app.status || "NEW"} onChange={e => updateStatus(app._id, e.target.value)}
            style={{ padding: "10px 14px", borderRadius: "12px", border: "1px solid rgba(24,8,2,0.12)", background: "#FEDEBE", fontSize: "13px", fontFamily: "inherit", cursor: "pointer", color: "#180802", outline: "none" }}>
            {STATUS_OPTIONS.map(o => <option key={o} value={o}>{o.replaceAll("_", " ")}</option>)}
          </select>
          {app.resumePath
            ? <button type="button" onClick={() => downloadResume(app._id)}
                style={{ padding: "10px 14px", borderRadius: "12px", border: "none", background: "#180802", color: "#FEDEBE", fontSize: "12px", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>
                Download CV
              </button>
            : <div style={{ borderRadius: "12px", border: "1px dashed rgba(24,8,2,0.18)", padding: "10px", textAlign: "center", fontSize: "12px", color: "rgba(24,8,2,0.4)" }}>No resume uploaded</div>
          }
        </div>
      )}
    </div>
  );
}

// ── Contacts ───────────────────────────────────────────────────────────────────

function ContactsSection({ contacts, loading }) {
  return (
    <div style={{
      background: "#FEDEBE",
      border: "1px solid rgba(24,8,2,0.08)",
      borderRadius: "24px",
      overflow: "hidden",
      boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
    }}>
      <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid rgba(24,8,2,0.08)" }}>
        <span style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(24,8,2,0.4)" }}>
          Contact inbox
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "0.75rem", padding: "1rem" }}>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : contacts.length
            ? contacts.map(c => <ContactCard key={c._id} contact={c} />)
            : <div style={{ gridColumn: "1/-1" }}><EmptyState message="No contacts found for the current filters." /></div>
        }
      </div>
    </div>
  );
}

function ContactCard({ contact }) {
  return (
    <article style={{
      borderRadius: "20px",
      border: "1px solid rgba(24,8,2,0.1)",
      background: "rgba(255,255,255,0.74)",
      padding: "1rem",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
        <div style={{ minWidth: 0 }}>
          <h3 style={{ fontWeight: 900, letterSpacing: "-0.04em", textTransform: "uppercase", color: "#180802", margin: 0, fontSize: "1rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {contact.name || contact.fullName || "—"}
          </h3>
          <p style={{ fontSize: "12px", color: "rgba(24,8,2,0.6)", marginTop: "2px", wordBreak: "break-all" }}>{contact.email || "—"}</p>
          {contact.phone && <p style={{ fontSize: "11px", color: "rgba(24,8,2,0.4)", marginTop: "2px" }}>{contact.phone}</p>}
        </div>
        <div style={{ shrink: 0, textAlign: "right", fontSize: "11px", fontWeight: 700, color: "rgba(24,8,2,0.38)", whiteSpace: "nowrap" }}>
          {formatRelative(contact.createdAt)}
        </div>
      </div>

      {contact.message && (
        <div style={{ marginTop: "0.75rem", background: "rgba(24,8,2,0.04)", borderRadius: "12px", padding: "0.7rem 0.9rem" }}>
          <p style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(24,8,2,0.38)", marginBottom: "0.35rem" }}>Message</p>
          <p style={{ fontSize: "13px", lineHeight: 1.6, color: "rgba(24,8,2,0.72)" }}>{contact.message}</p>
        </div>
      )}
    </article>
  );
}

// ── Shared ─────────────────────────────────────────────────────────────────────

function EmptyState({ message }) {
  return (
    <div style={{
      padding: "3rem 1.5rem",
      textAlign: "center",
      borderRadius: "16px",
      border: "1px dashed rgba(24,8,2,0.14)",
      background: "rgba(255,255,255,0.5)",
    }}>
      <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem", opacity: 0.3 }}>◻</div>
      <p style={{ fontSize: "13px", color: "rgba(24,8,2,0.5)" }}>{message}</p>
    </div>
  );
}
