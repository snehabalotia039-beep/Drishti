"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const SECTIONS = [
  { id: "getting-started", label: "Getting Started" },
  { id: "installation", label: "Installation" },
  { id: "configuration", label: "Configuration" },
  { id: "authentication", label: "Authentication" },
  { id: "api-keys", label: "API Keys" },
  { id: "api-reference", label: "API Reference" },
  { id: "sdk-methods", label: "SDK Methods" },
  { id: "webcam", label: "Webcam Integration" },
  { id: "rate-limits", label: "Rate Limits" },
  { id: "examples", label: "Full Example" },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("getting-started");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -60% 0px" }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#fafaf9" }}>
      {/* Header */}
      <header
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
            maxWidth: "1200px",
            width: "100%",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                textDecoration: "none",
                color: "#1c1917",
              }}
            >
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
              <span style={{ fontSize: "15px", fontWeight: 600 }}>
                Drishti
              </span>
            </Link>
            <span
              style={{
                fontSize: "12px",
                color: "#a8a29e",
                borderLeft: "1px solid #e7e5e4",
                paddingLeft: "12px",
                marginLeft: "4px",
              }}
            >
              Documentation
            </span>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <Link
              href="/login"
              style={{
                fontSize: "13px",
                fontWeight: 500,
                color: "#57534e",
                textDecoration: "none",
              }}
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
                padding: "6px 14px",
                borderRadius: "8px",
                textDecoration: "none",
              }}
            >
              Get API Key
            </Link>
          </div>
        </div>
      </header>

      <div
        style={{
          display: "flex",
          maxWidth: "1200px",
          margin: "0 auto",
          paddingTop: "56px",
        }}
      >
        {/* Sidebar */}
        <nav
          style={{
            width: "220px",
            flexShrink: 0,
            position: "sticky",
            top: "56px",
            height: "calc(100vh - 56px)",
            overflowY: "auto",
            padding: "24px 0 24px 24px",
            borderRight: "1px solid #f5f5f4",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#a8a29e",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "12px",
            }}
          >
            Guide
          </p>
          {SECTIONS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: activeSection === id ? 600 : 400,
                color: activeSection === id ? "#1c1917" : "#78716c",
                textDecoration: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                background:
                  activeSection === id ? "#f5f5f4" : "transparent",
                marginBottom: "2px",
                transition: "all 0.15s",
              }}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Content */}
        <main
          style={{
            flex: 1,
            padding: "40px 48px",
            maxWidth: "780px",
          }}
        >
          {/* Getting Started */}
          <section id="getting-started" style={{ marginBottom: "56px" }}>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: 700,
                color: "#1c1917",
                marginBottom: "12px",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Drishti Documentation
            </h1>
            <p style={{ fontSize: "15px", color: "#57534e", lineHeight: 1.7 }}>
              Drishti is a plug-and-play AI marketing optimization SDK. Add a
              single script tag to your website, and Drishti will automatically
              track user behavior, detect emotions via webcam, and adapt your
              content in real-time using LLM-powered decisions.
            </p>
            <div
              style={{
                marginTop: "20px",
                padding: "16px 20px",
                background: "#fefce8",
                border: "1px solid #fde68a",
                borderRadius: "10px",
                fontSize: "13px",
                color: "#92400e",
                lineHeight: 1.6,
              }}
            >
              <strong>Quick start:</strong> Register an account, generate an API
              key, and add the SDK script to your site. That&apos;s it.
            </div>
          </section>

          {/* Installation */}
          <section id="installation" style={{ marginBottom: "56px" }}>
            <SectionTitle>Installation</SectionTitle>
            <p style={styles.text}>
              Add the Drishti config and SDK script to your HTML page, right
              before the closing <Code>&lt;/body&gt;</Code> tag:
            </p>
            <CodeBlock>{`<script>
  window.DrishtiConfig = {
    apiKey: "YOUR_API_KEY",
    apiUrl: "http://localhost:5000/analyze",
    selectors: {
      headline: "#headline",
      cta: "#cta"
    },
    interval: 5000,
    enabled: true,
    debug: false
  };
</script>
<script src="https://your-cdn.com/drishti.js"></script>`}</CodeBlock>
            <p style={{ ...styles.text, marginTop: "16px" }}>
              The SDK will automatically start tracking user behavior and
              sending data to your backend.
            </p>
          </section>

          {/* Configuration */}
          <section id="configuration" style={{ marginBottom: "56px" }}>
            <SectionTitle>Configuration</SectionTitle>
            <p style={styles.text}>
              All config options for <Code>window.DrishtiConfig</Code>:
            </p>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Option</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Default</th>
                  <th style={styles.th}>Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["apiKey", "string", '"demo123"', "Your Drishti API key"],
                  ["apiUrl", "string", '"http://localhost:5000/analyze"', "Backend analyze endpoint"],
                  ["emotionUrl", "string", '"http://localhost:5000/detect-emotion"', "Emotion detection endpoint"],
                  ["selectors.headline", "string", '"#headline"', "CSS selector for the headline element"],
                  ["selectors.cta", "string", '"#cta"', "CSS selector for the CTA button"],
                  ["interval", "number", "5000", "How often to send data (ms)"],
                  ["enabled", "boolean", "true", "Enable/disable tracking"],
                  ["emotionDetection", "boolean", "false", "Enable webcam emotion detection"],
                  ["emotionInterval", "number", "10000", "How often to capture emotion (ms)"],
                  ["debug", "boolean", "false", "Log debug info to console"],
                ].map(([opt, type, def, desc], i) => (
                  <tr key={i}>
                    <td style={styles.td}>
                      <Code>{opt}</Code>
                    </td>
                    <td style={styles.td}>
                      <span style={{ color: "#d97706", fontSize: "12px" }}>
                        {type}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={{ fontSize: "12px", color: "#57534e" }}>
                        {def}
                      </span>
                    </td>
                    <td style={styles.td}>{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Authentication */}
          <section id="authentication" style={{ marginBottom: "56px" }}>
            <SectionTitle>Authentication</SectionTitle>
            <p style={styles.text}>
              Register an account and log in to get a JWT token. Use the token
              to manage your API keys.
            </p>

            <h3 style={styles.h3}>Register</h3>
            <CodeBlock>{`POST /auth/register
Content-Type: application/json

{
  "name": "Your Name",
  "email": "you@example.com",
  "password": "yourpassword"
}`}</CodeBlock>

            <h3 style={styles.h3}>Login</h3>
            <CodeBlock>{`POST /auth/login
Content-Type: application/json

{
  "email": "you@example.com",
  "password": "yourpassword"
}

// Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": 1, "name": "Your Name", "email": "you@example.com" }
}`}</CodeBlock>

            <h3 style={styles.h3}>Get Profile</h3>
            <CodeBlock>{`GET /auth/me
Authorization: Bearer <YOUR_JWT_TOKEN>`}</CodeBlock>
          </section>

          {/* API Keys */}
          <section id="api-keys" style={{ marginBottom: "56px" }}>
            <SectionTitle>API Keys</SectionTitle>
            <p style={styles.text}>
              All key management endpoints require JWT authentication via the{" "}
              <Code>Authorization</Code> header.
            </p>

            <h3 style={styles.h3}>Generate a Key</h3>
            <CodeBlock>{`POST /keys
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "label": "My Production Key"
}

// Response:
{
  "apiKey": {
    "key": "dsk_a1b2c3d4e5f6...",
    "label": "My Production Key",
    "requestsLimit": 1000
  }
}`}</CodeBlock>

            <h3 style={styles.h3}>List Your Keys</h3>
            <CodeBlock>{`GET /keys
Authorization: Bearer <TOKEN>`}</CodeBlock>

            <h3 style={styles.h3}>Revoke a Key</h3>
            <CodeBlock>{`DELETE /keys/:id
Authorization: Bearer <TOKEN>`}</CodeBlock>

            <h3 style={styles.h3}>Usage Details</h3>
            <CodeBlock>{`GET /keys/:id/usage
Authorization: Bearer <TOKEN>`}</CodeBlock>
          </section>

          {/* API Reference */}
          <section id="api-reference" style={{ marginBottom: "56px" }}>
            <SectionTitle>API Reference</SectionTitle>

            <h3 style={styles.h3}>POST /analyze</h3>
            <p style={styles.text}>
              Main endpoint. The SDK calls this automatically. Send user
              behavior data, get back optimized content.
            </p>
            <CodeBlock>{`POST /analyze
Content-Type: application/json

{
  "apiKey": "dsk_your_api_key",
  "sessionId": "session_abc123",
  "page": "home",
  "section": "hero",
  "scrollSpeed": "fast",
  "timeSpent": 12,
  "clicks": 3,
  "emotion": "neutral",
  "frame": "data:image/jpeg;base64,..."  // optional webcam frame
}

// Response:
{
  "change": true,
  "headline": "Grab This Deal Before It's Gone",
  "cta": "Buy Now",
  "emotion": "bored",
  "reason": "low_engagement_fast_scroll",
  "confidence": 0.85,
  "contentType": "offer",
  "priority": "retain",
  "source": "smart_ai"
}`}</CodeBlock>

            <h3 style={styles.h3}>POST /detect-emotion</h3>
            <p style={styles.text}>
              Send a base64 webcam frame for emotion detection.
            </p>
            <CodeBlock>{`POST /detect-emotion
Content-Type: application/json

{
  "frame": "data:image/jpeg;base64,/9j/4AAQ..."
}

// Response:
{
  "emotion": "happy",
  "raw_emotion": "happy",
  "scores": { "happy": 0.91, "neutral": 0.05, ... },
  "source": "webcam_base64"
}`}</CodeBlock>
          </section>

          {/* SDK Methods */}
          <section id="sdk-methods" style={{ marginBottom: "56px" }}>
            <SectionTitle>SDK Methods</SectionTitle>
            <p style={styles.text}>
              The SDK exposes a global <Code>window.Drishti</Code> object:
            </p>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Method</th>
                  <th style={styles.th}>Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Drishti.start()", "Start behavior tracking and analysis loop"],
                  ["Drishti.stop()", "Stop all tracking and webcam"],
                  ["Drishti.reset()", "Reset all tracked state (clicks, time, etc.)"],
                  ["Drishti.getState()", "Get current tracking state object"],
                  ["Drishti.isActive()", "Returns true if tracking is active"],
                  ["Drishti.setEmotion(emotion)", "Manually set emotion (for demo)"],
                  ["Drishti.enableWebcam()", "Start webcam emotion detection (async)"],
                  ["Drishti.disableWebcam()", "Stop webcam and release camera"],
                  ["Drishti.isWebcamActive()", "Returns true if webcam is running"],
                  ["Drishti.getEmotion()", "Get current emotion + source"],
                ].map(([method, desc], i) => (
                  <tr key={i}>
                    <td style={styles.td}>
                      <Code>{method}</Code>
                    </td>
                    <td style={styles.td}>{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Webcam */}
          <section id="webcam" style={{ marginBottom: "56px" }}>
            <SectionTitle>Webcam Integration</SectionTitle>
            <p style={styles.text}>
              Drishti can detect user emotions through the webcam. The browser
              shows a native permission prompt. Frames are processed server-side
              using DeepFace.
            </p>
            <p style={styles.text}>Enable in config:</p>
            <CodeBlock>{`window.DrishtiConfig = {
  ...
  emotionDetection: true,
  emotionInterval: 10000  // detect every 10 seconds
};`}</CodeBlock>
            <p style={{ ...styles.text, marginTop: "16px" }}>
              Or enable programmatically:
            </p>
            <CodeBlock>{`// Start webcam
await Drishti.enableWebcam();

// Check status
console.log(Drishti.isWebcamActive()); // true

// Get emotion
console.log(Drishti.getEmotion());
// { emotion: "happy", source: "webcam" }

// Listen for emotion events
window.addEventListener("drishti-emotion", (e) => {
  console.log("Detected:", e.detail.emotion);
});

// Stop
Drishti.disableWebcam();`}</CodeBlock>
          </section>

          {/* Rate Limits */}
          <section id="rate-limits" style={{ marginBottom: "56px" }}>
            <SectionTitle>Rate Limits</SectionTitle>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Plan</th>
                  <th style={styles.th}>Requests / Key</th>
                  <th style={styles.th}>Max Keys</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={styles.td}>Free</td>
                  <td style={styles.td}>1,000</td>
                  <td style={styles.td}>5</td>
                </tr>
                <tr>
                  <td style={styles.td}>Demo (demo123)</td>
                  <td style={styles.td}>Unlimited</td>
                  <td style={styles.td}>1 (built-in)</td>
                </tr>
              </tbody>
            </table>
            <p style={{ ...styles.text, marginTop: "16px" }}>
              When a key exceeds its limit, the API returns{" "}
              <Code>429 Too Many Requests</Code>. Check your usage in the{" "}
              <Link
                href="/console"
                style={{ color: "#d97706", fontWeight: 600 }}
              >
                Developer Console
              </Link>
              .
            </p>
          </section>

          {/* Full Example */}
          <section id="examples" style={{ marginBottom: "80px" }}>
            <SectionTitle>Full Example</SectionTitle>
            <p style={styles.text}>
              A complete HTML page with Drishti integrated:
            </p>
            <CodeBlock>{`<!DOCTYPE html>
<html>
<head>
  <title>My Site with Drishti</title>
</head>
<body>
  <h1 id="headline">Welcome to our store</h1>
  <button id="cta">Shop Now</button>

  <script>
    window.DrishtiConfig = {
      apiKey: "dsk_your_api_key_here",
      apiUrl: "https://your-backend.com/analyze",
      selectors: {
        headline: "#headline",
        cta: "#cta"
      },
      interval: 5000,
      enabled: true
    };
  </script>
  <script src="https://your-cdn.com/drishti.js"></script>
</body>
</html>`}</CodeBlock>
          </section>
        </main>
      </div>
    </div>
  );
}

// ── Reusable components ──────────────────────────

function SectionTitle({ children }) {
  return (
    <h2
      style={{
        fontSize: "22px",
        fontWeight: 700,
        color: "#1c1917",
        marginBottom: "12px",
        paddingBottom: "8px",
        borderBottom: "1px solid #f5f5f4",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {children}
    </h2>
  );
}

function Code({ children }) {
  return (
    <code
      style={{
        fontSize: "12.5px",
        fontFamily: "monospace",
        background: "#f5f5f4",
        padding: "2px 6px",
        borderRadius: "4px",
        color: "#1c1917",
      }}
    >
      {children}
    </code>
  );
}

function CodeBlock({ children }) {
  return (
    <pre
      style={{
        background: "#1c1917",
        color: "#e7e5e4",
        padding: "16px 20px",
        borderRadius: "10px",
        fontSize: "13px",
        lineHeight: 1.6,
        overflowX: "auto",
        marginTop: "12px",
        fontFamily: "'SF Mono', 'Fira Code', monospace",
      }}
    >
      <code>{children}</code>
    </pre>
  );
}

const styles = {
  text: {
    fontSize: "14px",
    color: "#57534e",
    lineHeight: 1.7,
    marginBottom: "8px",
  },
  h3: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#1c1917",
    marginTop: "28px",
    marginBottom: "8px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "12px",
    fontSize: "13px",
  },
  th: {
    textAlign: "left",
    padding: "10px 12px",
    background: "#f5f5f4",
    color: "#57534e",
    fontWeight: 600,
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  td: {
    padding: "10px 12px",
    borderBottom: "1px solid #f5f5f4",
    color: "#44403c",
    verticalAlign: "top",
  },
};
