"use client";

import { useState, useEffect, useCallback } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/sessions`);
      const json = await res.json();
      setData(json);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
    if (autoRefresh) {
      const interval = setInterval(fetchSessions, 3000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, fetchSessions]);

  function getEngagementLevel(session) {
    const last = session.history?.[session.history.length - 1];
    if (!last) return { level: "Unknown", color: "#a8a29e" };
    const t = last.timeSpent || 0;
    const c = last.clicks || 0;
    if (t > 30 || c >= 3) return { level: "High", color: "#22c55e" };
    if (t > 15 || c >= 1) return { level: "Medium", color: "#f59e0b" };
    return { level: "Low", color: "#ef4444" };
  }

  function getReasonLabel(reason) {
    const map = {
      low_engagement_fast_scroll: "Fast Scroll",
      scanning_user_redirect: "Scanning",
      high_engagement_slow_read: "Deep Reader",
      long_session_offer: "Long Session",
      low_interaction_assist: "Needs Help",
      high_interaction_explore: "Explorer",
      bored_user_engage: "Bored",
      confused_user_guide: "Confused",
      positive_emotion_convert: "Positive",
      default: "— Default",
    };
    return map[reason] || reason || "—";
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fafaf9" }}>
      {/* Header */}
      <header
        style={{
          borderBottom: "1px solid #e7e5e4",
          background: "#ffffff",
          padding: "16px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <a
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
                width: "32px",
                height: "32px",
                background: "#1c1917",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 700,
                fontSize: "14px",
              }}
            >
              D
            </div>
            <span style={{ fontSize: "18px", fontWeight: 600 }}>
              Drishti Dashboard
            </span>
          </a>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: "12px", color: "#a8a29e" }}>
            Last updated: {lastUpdated || "—"}
          </span>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            style={{
              padding: "6px 14px",
              borderRadius: "8px",
              border: "1px solid #e7e5e4",
              background: autoRefresh ? "#1c1917" : "#ffffff",
              color: autoRefresh ? "#ffffff" : "#1c1917",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {autoRefresh ? "● Live" : "○ Paused"}
          </button>
          <button
            onClick={fetchSessions}
            style={{
              padding: "6px 14px",
              borderRadius: "8px",
              border: "1px solid #e7e5e4",
              background: "#ffffff",
              fontSize: "12px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Refresh
          </button>
        </div>
      </header>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px" }}>
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px",
              color: "#a8a29e",
              fontSize: "14px",
            }}
          >
            Loading sessions...
          </div>
        ) : !data || data.activeSessions === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px",
              color: "#a8a29e",
            }}
          >
            <p style={{ fontSize: "48px", marginBottom: "16px" }}>--</p>
            <p style={{ fontSize: "16px", fontWeight: 500, color: "#78716c" }}>
              No active sessions yet
            </p>
            <p style={{ fontSize: "14px", marginTop: "8px" }}>
              Visit the{" "}
              <a href="/" style={{ color: "#f59e0b", fontWeight: 600 }}>
                demo site
              </a>{" "}
              and toggle Drishti ON to see data flow here.
            </p>
          </div>
        ) : (
          <>
            {/* Stats row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "16px",
                marginBottom: "32px",
              }}
            >
              <StatCard
                label="Active Sessions"
                value={data.activeSessions}
                icon="#"
              />
              <StatCard
                label="Total Interactions"
                value={Object.values(data.sessions).reduce(
                  (sum, s) => sum + s.totalInteractions,
                  0
                )}
                icon="~"
              />
              <StatCard
                label="Last Action"
                value={getReasonLabel(
                  Object.values(data.sessions)[0]?.lastAction
                )}
                icon=">"
              />
            </div>

            {/* Sessions table */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #e7e5e4",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "20px 24px",
                  borderBottom: "1px solid #e7e5e4",
                }}
              >
                <h2
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#1c1917",
                  }}
                >
                  Session Activity
                </h2>
              </div>

              {Object.entries(data.sessions).map(([id, session]) => {
                const engagement = getEngagementLevel(session);
                const last =
                  session.history?.[session.history.length - 1] || {};

                return (
                  <div
                    key={id}
                    style={{
                      padding: "16px 24px",
                      borderBottom: "1px solid #f5f5f4",
                      display: "grid",
                      gridTemplateColumns: "1fr 100px 100px 140px 160px",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    {/* Session ID */}
                    <div>
                      <p
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#1c1917",
                          fontFamily: "monospace",
                        }}
                      >
                        {id.length > 30 ? id.substring(0, 30) + "…" : id}
                      </p>
                      <p style={{ fontSize: "11px", color: "#a8a29e" }}>
                        {session.totalInteractions} interactions
                      </p>
                    </div>

                    {/* Engagement */}
                    <div>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: engagement.color,
                        }}
                      >
                        <span
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: engagement.color,
                          }}
                        />
                        {engagement.level}
                      </span>
                    </div>

                    {/* Time */}
                    <div style={{ fontSize: "13px", color: "#57534e" }}>
                      {last.timeSpent || 0}s
                    </div>

                    {/* Last Action */}
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#57534e",
                        background: "#f5f5f4",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        display: "inline-block",
                        width: "fit-content",
                      }}
                    >
                      {getReasonLabel(last.result?.reason)}
                    </div>

                    {/* Headline preview */}
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#a8a29e",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={last.result?.headline}
                    >
                      &quot;{last.result?.headline || "—"}&quot;
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent Activity Log */}
            <div
              style={{
                marginTop: "24px",
                background: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #e7e5e4",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "20px 24px",
                  borderBottom: "1px solid #e7e5e4",
                }}
              >
                <h2
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#1c1917",
                  }}
                >
                  Recent Behavior Log
                </h2>
              </div>

              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                {Object.values(data.sessions)
                  .flatMap((s) => s.history)
                  .sort(
                    (a, b) =>
                      new Date(b.timestamp) - new Date(a.timestamp)
                  )
                  .slice(0, 20)
                  .map((entry, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "12px 24px",
                        borderBottom: "1px solid #fafaf9",
                        display: "grid",
                        gridTemplateColumns: "80px 80px 60px 60px 80px 1fr",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "12px",
                        color: "#57534e",
                      }}
                    >
                      <span style={{ color: "#a8a29e" }}>
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </span>
                      <span
                        style={{ fontFamily: "monospace", fontSize: "11px" }}
                      >
                        {entry.section}
                      </span>
                      <span>clicks: {entry.clicks}</span>
                      <span>t: {entry.timeSpent}s</span>
                      <span>
                        {entry.scrollSpeed === "fast"
                          ? ">> fast"
                          : entry.scrollSpeed === "slow"
                            ? ".. slow"
                            : "-- med"}
                      </span>
                      <span
                        style={{
                          background: "#f5f5f4",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontSize: "11px",
                        }}
                      >
                        {getReasonLabel(entry.result?.reason)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "16px",
        border: "1px solid #e7e5e4",
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          background: "#f5f5f4",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
        }}
      >
        {icon}
      </div>
      <div>
        <p style={{ fontSize: "12px", color: "#a8a29e", marginBottom: "4px" }}>
          {label}
        </p>
        <p style={{ fontSize: "24px", fontWeight: 700, color: "#1c1917" }}>
          {value}
        </p>
      </div>
    </div>
  );
}
