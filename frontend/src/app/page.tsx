import Link from "next/link";

export default function Home() {
  return (
    <div style={{ minHeight: "calc(100vh - 56px)", display: "flex", flexDirection: "column" }}>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="rail" style={{ paddingTop: "6rem", paddingBottom: "6rem" }}>
          <p
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--fg-dim)",
              marginBottom: "1.5rem",
              fontFamily: "var(--font-mono), monospace",
            }}
          >
            Music catalog platform
          </p>

          <h1
            className="wordmark"
            style={{
              fontSize: "clamp(3rem, 10vw, 7rem)",
              fontWeight: 600,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              color: "var(--fg)",
              marginBottom: "2rem",
            }}
          >
            Your music,
            <br />
            organized.
          </h1>

          <p
            style={{
              fontSize: "1.125rem",
              color: "var(--fg-dim)",
              maxWidth: "480px",
              lineHeight: 1.7,
              marginBottom: "3rem",
            }}
          >
            Catalog albums, track personal ratings and notes, and get AI-powered
            insights on your listening identity-all in one place.
          </p>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link href="/register" className="btn-brick">
              Create account
            </Link>
            <Link href="/login" className="btn-ghost">
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────── */}
      <section>
        <div
          className="rail"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          }}
        >
          {[
            {
              label: "01",
              title: "Build your library",
              body: "Search the iTunes catalog and save albums with personal ratings and notes.",
            },
            {
              label: "02",
              title: "Understand your taste",
              body: "Visualize genre breakdowns, release timelines, and top artists from your collection.",
            },
            {
              label: "03",
              title: "AI-powered insights",
              body: "Get a written analysis of your music identity and discover what to listen to next.",
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                padding: "2.5rem 0",
                borderRight: i < 2 ? "1px solid var(--border)" : "none",
                borderBottom: "1px solid var(--border)",
                paddingRight: i < 2 ? "2rem" : undefined,
                paddingLeft: i > 0 ? "2rem" : undefined,
              }}
            >
              <span
                className="wordmark"
                style={{
                  fontSize: "0.75rem",
                  color: "var(--brick)",
                  letterSpacing: "0.08em",
                  display: "block",
                  marginBottom: "0.75rem",
                }}
              >
                {item.label}
              </span>
              <h2
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  color: "var(--fg)",
                  marginBottom: "0.5rem",
                }}
              >
                {item.title}
              </h2>
              <p style={{ fontSize: "0.9rem", color: "var(--fg-dim)", lineHeight: 1.7 }}>
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid var(--border)" }}>
        <div
          className="rail"
          style={{
            height: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            className="wordmark"
            style={{ fontSize: "0.8125rem", color: "var(--fg-dim)", letterSpacing: "0.06em" }}
          >
            ECHOSHELF
          </span>
          <span style={{ fontSize: "0.75rem", color: "var(--fg-dim)" }}>
            © {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </div>
  );
}
