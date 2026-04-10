import Link from "next/link";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#fafaf9" }}>
      {/* Navbar */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #e7e5e4",
          height: "56px",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            width: "100%",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                background: "#1c1917",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 700,
                fontSize: "12px",
              }}
            >
              D
            </div>
            <span
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#1c1917",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Drishti
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <Link
              href="/docs"
              style={{ fontSize: "13px", fontWeight: 500, color: "#57534e" }}
            >
              Docs
            </Link>
            <Link
              href="/dashboard"
              style={{ fontSize: "13px", fontWeight: 500, color: "#57534e" }}
            >
              Dashboard
            </Link>
            <Link
              href="/login"
              style={{ fontSize: "13px", fontWeight: 500, color: "#57534e" }}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#fff",
                background: "#1c1917",
                padding: "6px 16px",
                borderRadius: "8px",
              }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          paddingTop: "140px",
          paddingBottom: "80px",
          textAlign: "center",
          maxWidth: "700px",
          margin: "0 auto",
          padding: "140px 24px 80px",
        }}
      >
        <div
          style={{
            display: "inline-block",
            fontSize: "11px",
            fontWeight: 600,
            color: "#d97706",
            background: "#fefce8",
            border: "1px solid #fde68a",
            padding: "4px 14px",
            borderRadius: "20px",
            marginBottom: "20px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          AI-Powered Marketing
        </div>
        <h1
          style={{
            fontSize: "48px",
            fontWeight: 700,
            color: "#1c1917",
            lineHeight: 1.15,
            marginBottom: "16px",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Your website, optimized
          <br />
          <span style={{ color: "#d97706" }}>in real-time</span>
        </h1>
        <p
          style={{
            fontSize: "17px",
            color: "#78716c",
            lineHeight: 1.7,
            maxWidth: "520px",
            margin: "0 auto 32px",
          }}
        >
          Drishti is a plug-and-play SDK that tracks user behavior, detects
          emotions via webcam, and adapts your content using AI — all with a
          single script tag.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <Link
            href="/register"
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#fff",
              background: "#1c1917",
              padding: "12px 28px",
              borderRadius: "10px",
            }}
          >
            Get Your API Key
          </Link>
          <Link
            href="/docs"
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#1c1917",
              background: "#fff",
              border: "1px solid #e7e5e4",
              padding: "12px 28px",
              borderRadius: "10px",
            }}
          >
            Read the Docs
          </Link>
        </div>
      </section>

      {/* Code snippet */}
      <section
        style={{
          maxWidth: "600px",
          margin: "0 auto 80px",
          padding: "0 24px",
        }}
      >
        <pre
          style={{
            background: "#1c1917",
            color: "#e7e5e4",
            padding: "24px 28px",
            borderRadius: "14px",
            fontSize: "13px",
            lineHeight: 1.7,
            overflowX: "auto",
            fontFamily: "'SF Mono', 'Fira Code', monospace",
            border: "1px solid #292524",
          }}
        >
{`<script>
  window.DrishtiConfig = {
    apiKey: "dsk_your_api_key",
    apiUrl: "https://api.drishti.dev/analyze",
    selectors: { headline: "#headline", cta: "#cta" }
  };
</script>
<script src="drishti.js"></script>`}
        </pre>
      </section>

      {/* Features */}
      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto 100px",
          padding: "0 24px",
        }}
      >
        <h2
          style={{
            fontSize: "28px",
            fontWeight: 700,
            color: "#1c1917",
            textAlign: "center",
            marginBottom: "40px",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          How it works
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
          }}
        >
          {[
            {
              step: "01",
              title: "Add the SDK",
              desc: "One script tag on your site. No build step, no dependencies.",
            },
            {
              step: "02",
              title: "Track behavior",
              desc: "Scroll speed, time on page, clicks, and optional webcam emotion detection.",
            },
            {
              step: "03",
              title: "AI adapts content",
              desc: "Headlines and CTAs update in real-time based on user engagement and emotion.",
            },
          ].map((f) => (
            <div
              key={f.step}
              style={{
                background: "#fff",
                border: "1px solid #e7e5e4",
                borderRadius: "14px",
                padding: "28px 24px",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#d97706",
                  marginBottom: "12px",
                  fontFamily: "monospace",
                }}
              >
                {f.step}
              </div>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#1c1917",
                  marginBottom: "8px",
                }}
              >
                {f.title}
              </h3>
              <p style={{ fontSize: "13px", color: "#78716c", lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid #e7e5e4",
          padding: "32px 24px",
          textAlign: "center",
          fontSize: "12px",
          color: "#a8a29e",
        }}
      >
        Drishti -- AI Marketing Optimization
      </footer>
    </div>
  );
}
