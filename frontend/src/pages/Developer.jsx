import React, { useEffect } from "react";

const DEVELOPER_PROFILE = {
  name: "Srijon Karmakar",
  email: "srijonkarmakar.dev@gmail.com",
  role: "Full stack Engineer",
};

function DetailRow({ label, value, href }) {
  const content = href ? (
    <a
      href={href}
      style={{
        color: "#FEDEBE",
        textDecoration: "none",
        wordBreak: "break-word",
      }}
    >
      {value}
    </a>
  ) : (
    <span>{value}</span>
  );

  return (
    <div
      style={{
        padding: "0.45rem 1.1rem",
        borderRadius: "20px",
        // border: "1px solid rgba(254, 222, 190, 0.12)",
        background: "rgba(255, 255, 255, 0)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: "10px",
          fontWeight: 800,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(254, 222, 190, 0.44)",
        }}
      >
        {label}
      </div>
      <div
        style={{
          marginTop: "0.45rem",
          fontSize: "1.1rem",
          fontWeight: 700,
          lineHeight: 1.5,
          color: "#FEDEBE",
        }}
      >
        {content}
      </div>
    </div>
  );
}

export default function Developer() {
  useEffect(() => {
    const previousTitle = document.title;
    const previousBodyBackground = document.body.style.background;
    const previousHtmlBackground = document.documentElement.style.background;

    document.title = "House of Musa | Developer";
    document.body.style.background =
      "radial-gradient(circle at top, rgba(253, 86, 2, 0.16), transparent 40%), #080301";
    document.documentElement.style.background =
      "radial-gradient(circle at top, rgba(253, 86, 2, 0.16), transparent 40%), #080301";

    return () => {
      document.title = previousTitle;
      document.body.style.background = previousBodyBackground;
      document.documentElement.style.background = previousHtmlBackground;
    };
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem 1.25rem",
        color: "#FEDEBE",
        background:
          "linear-gradient(180deg, rgba(8, 3, 1, 0) 0%, rgbrgba(16, 6, 2, 0)0%)",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "520px",
          borderRadius: "32px",
          padding: "1.6rem",
          // border: "1px solid rgba(254, 222, 190, 0.12)",
          background:
            "linear-gradient(145deg, rgba(253, 86, 2, 0), rgba(254, 222, 190, 0))",
          // boxShadow: "0 28px 80px rgba(0, 0, 0, 0.34)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "10px",
            fontWeight: 800,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "#FD5602",
          }}
        >
          Developer
        </div>

        {/* <h1
          style={{
            margin: "0.9rem 0 0",
            fontSize: "clamp(2.2rem, 8vw, 3.5rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.08em",
            textTransform: "uppercase",
            color: "#FEDEBE",
          }}
        >
          Profile
        </h1> */}

        <div
          style={{
            marginTop: "0.8rem",
            display: "grid",
            gap: "0.2rem",
          }}
        >
          <DetailRow label="Name" value={DEVELOPER_PROFILE.name} />
          <DetailRow
            label="Email"
            value={DEVELOPER_PROFILE.email}
            href={`mailto:${DEVELOPER_PROFILE.email}`}
          />
          <DetailRow label="Role" value={DEVELOPER_PROFILE.role} />
        </div>
      </section>
    </main>
  );
}
