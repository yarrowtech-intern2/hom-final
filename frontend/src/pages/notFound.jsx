import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000000ff",
        color: "#ff0000ff",
        textAlign: "center",
        padding: 24,
      }}
    >
      <div>
        <h1 style={{ fontSize: 96, fontWeight: 800, marginBottom: 12 }}>
          404
        </h1>

        <p style={{ fontSize: 18, opacity: 0.8, marginBottom: 24 }}>
          The page you are looking for does not exist.
        </p>

        <button
          onClick={() => navigate("/")}
          style={{
            padding: "12px 22px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.25)",
            background: "rgba(0, 0, 0, 1)",
            color: "#ffffffff",
            cursor: "pointer",
            fontSize: 14,
            backdropFilter: "blur(12px)",
          }}
        >
          Go back home
        </button>
      </div>
    </div>
  );
}
