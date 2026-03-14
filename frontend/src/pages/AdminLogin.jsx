import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API_BASE_URL from "../config";

function EyeIcon({ open }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function Spinner() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25"/>
      <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="1">
        <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.75s" repeatCount="indefinite"/>
      </path>
    </svg>
  );
}

export default function AdminLogin() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const inputRef = useRef(null);
  const nav = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    if (!token.trim()) {
      toast.error("Enter admin token");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/job-applications?limit=1`, {
        headers: { "x-admin-token": token.trim() },
      });

      if (!res.ok) throw new Error("Invalid admin token");

      localStorage.setItem("ADMIN_TOKEN", token.trim());
      toast.success("Access granted");
      nav("/admin1234");
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0b0b0c 0%, #1a0a04 50%, #0b0b0c 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: "absolute",
        top: "20%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "600px",
        height: "400px",
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(253,86,2,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{
        position: "relative",
        width: "100%",
        maxWidth: "440px",
        zIndex: 1,
      }}>
        {/* Card */}
        <div style={{
          background: "rgba(255,241,226,0.04)",
          border: "1px solid rgba(255,241,226,0.1)",
          borderRadius: "28px",
          padding: "2rem",
          backdropFilter: "blur(20px)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,241,226,0.08)",
        }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(253,86,2,0.12)",
            border: "1px solid rgba(253,86,2,0.25)",
            borderRadius: "999px",
            padding: "6px 14px",
            color: "#FD5602",
            fontSize: "10px",
            fontWeight: 800,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#FD5602", flexShrink: 0 }} />
            Admin Access
          </div>

          {/* Heading */}
          <div style={{ marginTop: "1.75rem" }}>
            <p style={{
              fontSize: "10px",
              fontWeight: 800,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "rgba(254,222,190,0.4)",
              marginBottom: "0.75rem",
            }}>
              House of Musa
            </p>
            <h1 style={{
              fontSize: "clamp(2rem, 5vw, 2.75rem)",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "-0.06em",
              lineHeight: 0.92,
              color: "#FEDEBE",
              margin: 0,
            }}>
              Enter<br />Dashboard
            </h1>
            <p style={{
              marginTop: "0.75rem",
              fontSize: "13px",
              color: "rgba(254,222,190,0.45)",
              lineHeight: 1.5,
            }}>
              Authorised personnel only. Enter your access token to continue.
            </p>
          </div>

          {/* Divider */}
          <div style={{
            margin: "1.75rem 0",
            height: "1px",
            background: "rgba(254,222,190,0.08)",
          }} />

          {/* Form */}
          <form onSubmit={submit}>
            <label style={{ display: "block" }}>
              <span style={{
                display: "block",
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(254,222,190,0.45)",
                marginBottom: "0.6rem",
              }}>
                Access Token
              </span>

              <div style={{ position: "relative" }}>
                <input
                  ref={inputRef}
                  type={showToken ? "text" : "password"}
                  autoComplete="current-password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="••••••••••••••••"
                  disabled={loading}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    background: "rgba(254,222,190,0.06)",
                    border: "1px solid rgba(254,222,190,0.14)",
                    borderRadius: "14px",
                    padding: "14px 48px 14px 16px",
                    fontSize: "14px",
                    color: "#FEDEBE",
                    outline: "none",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    fontFamily: "inherit",
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = "rgba(253,86,2,0.7)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(253,86,2,0.1)";
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = "rgba(254,222,190,0.14)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowToken(v => !v)}
                  tabIndex={-1}
                  style={{
                    position: "absolute",
                    right: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "rgba(254,222,190,0.4)",
                    cursor: "pointer",
                    padding: "2px",
                    display: "flex",
                    alignItems: "center",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = "rgba(254,222,190,0.8)"}
                  onMouseLeave={e => e.currentTarget.style.color = "rgba(254,222,190,0.4)"}
                >
                  <EyeIcon open={showToken} />
                </button>
              </div>
            </label>

            <button
              type="submit"
              disabled={loading || !token.trim()}
              style={{
                marginTop: "1rem",
                width: "100%",
                minHeight: "52px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                background: loading || !token.trim() ? "rgba(253,86,2,0.35)" : "#FD5602",
                border: "none",
                borderRadius: "14px",
                color: loading || !token.trim() ? "rgba(255,255,255,0.5)" : "#180802",
                fontSize: "13px",
                fontWeight: 800,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                cursor: loading || !token.trim() ? "not-allowed" : "pointer",
                transition: "background 0.2s, transform 0.15s, box-shadow 0.2s",
                boxShadow: loading || !token.trim() ? "none" : "0 8px 24px rgba(253,86,2,0.3)",
                fontFamily: "inherit",
              }}
              onMouseEnter={e => {
                if (!loading && token.trim()) {
                  e.currentTarget.style.background = "#e84e00";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={e => {
                if (!loading && token.trim()) {
                  e.currentTarget.style.background = "#FD5602";
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              {loading ? <><Spinner /> Verifying…</> : "Enter Dashboard →"}
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p style={{
          textAlign: "center",
          marginTop: "1.25rem",
          fontSize: "11px",
          color: "rgba(254,222,190,0.2)",
          letterSpacing: "0.06em",
        }}>
          House of Musa · Internal Portal
        </p>
      </div>
    </main>
  );
}
