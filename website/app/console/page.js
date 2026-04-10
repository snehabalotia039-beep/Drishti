"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const BACKEND_URL = "http://localhost:5000";

export default function ConsolePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newLabel, setNewLabel] = useState("");
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [expandedKey, setExpandedKey] = useState(null);
  const [usageData, setUsageData] = useState({});

  function getToken() {
    return typeof window !== "undefined"
      ? localStorage.getItem("drishti_token")
      : null;
  }

  function authHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    };
  }

  const fetchKeys = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/keys`, {
        headers: authHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setKeys(data.keys || []);
      }
    } catch (err) {
      console.error("Failed to fetch keys:", err);
    }
  }, []);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    // Get user profile
    async function init() {
      try {
        const res = await fetch(`${BACKEND_URL}/auth/me`, {
          headers: authHeaders(),
        });
        if (!res.ok) {
          localStorage.removeItem("drishti_token");
          localStorage.removeItem("drishti_user");
          router.push("/login");
          return;
        }
        const userData = await res.json();
        setUser(userData);
        await fetchKeys();
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [router, fetchKeys]);

  async function createKey() {
    setCreating(true);
    try {
      const res = await fetch(`${BACKEND_URL}/keys`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ label: newLabel || "Default" }),
      });
      const data = await res.json();
      if (res.ok) {
        setNewLabel("");
        await fetchKeys();
        // Show the full key briefly
        if (data.apiKey) {
          setCopiedId(`new_${data.apiKey.id}`);
          setTimeout(() => setCopiedId(null), 5000);
        }
      } else {
        alert(data.error || "Failed to create key");
      }
    } catch {
      alert("Could not connect to server");
    } finally {
      setCreating(false);
    }
  }

  async function revokeKey(id) {
    if (!confirm("Are you sure you want to revoke this API key? This cannot be undone.")) return;

    try {
      const res = await fetch(`${BACKEND_URL}/keys/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.ok) {
        await fetchKeys();
      }
    } catch {
      alert("Failed to revoke key");
    }
  }

  async function fetchUsage(keyId) {
    if (expandedKey === keyId) {
      setExpandedKey(null);
      return;
    }
    try {
      const res = await fetch(`${BACKEND_URL}/keys/${keyId}/usage`, {
        headers: authHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setUsageData((prev) => ({ ...prev, [keyId]: data }));
        setExpandedKey(keyId);
      }
    } catch {
      console.error("Failed to fetch usage");
    }
  }

  function copyToClipboard(text, id) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function logout() {
    localStorage.removeItem("drishti_token");
    localStorage.removeItem("drishti_user");
    router.push("/login");
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#fafaf9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#a8a29e",
          fontSize: "14px",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fafaf9" }}>
      {/* Header */}
      <header
        style={{
          borderBottom: "1px solid #e7e5e4",
          background: "#ffffff",
          padding: "0 24px",
          height: "56px",
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
            <span style={{ fontSize: "15px", fontWeight: 600 }}>Drishti</span>
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
            Developer Console
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link
            href="/docs"
            style={{
              fontSize: "13px",
              color: "#57534e",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Docs
          </Link>
          <Link
            href="/dashboard"
            style={{
              fontSize: "13px",
              color: "#57534e",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Dashboard
          </Link>
          <span style={{ fontSize: "13px", fontWeight: 500, color: "#1c1917" }}>
            {user?.name}
          </span>
          <button
            onClick={logout}
            style={{
              fontSize: "12px",
              color: "#a8a29e",
              background: "none",
              border: "1px solid #e7e5e4",
              padding: "4px 12px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Welcome */}
        <div style={{ marginBottom: "32px" }}>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#1c1917",
              marginBottom: "4px",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Welcome, {user?.name}
          </h1>
          <p style={{ fontSize: "14px", color: "#a8a29e" }}>
            Manage your API keys and monitor usage.
          </p>
        </div>

        {/* Create Key */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e7e5e4",
            padding: "20px 24px",
            marginBottom: "24px",
          }}
        >
          <h2
            style={{
              fontSize: "15px",
              fontWeight: 600,
              color: "#1c1917",
              marginBottom: "12px",
            }}
          >
            Generate API Key
          </h2>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Key label (e.g., Production)"
              style={{
                flex: 1,
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid #e7e5e4",
                fontSize: "13px",
                outline: "none",
                background: "#fafaf9",
              }}
            />
            <button
              onClick={createKey}
              disabled={creating}
              style={{
                padding: "8px 20px",
                background: "#1c1917",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: creating ? "not-allowed" : "pointer",
                opacity: creating ? 0.7 : 1,
                whiteSpace: "nowrap",
              }}
            >
              {creating ? "Creating..." : "Generate Key"}
            </button>
          </div>
        </div>

        {/* Keys List */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e7e5e4",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "16px 24px",
              borderBottom: "1px solid #e7e5e4",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2
              style={{ fontSize: "15px", fontWeight: 600, color: "#1c1917" }}
            >
              Your API Keys
            </h2>
            <span style={{ fontSize: "12px", color: "#a8a29e" }}>
              {keys.length} / 5 keys
            </span>
          </div>

          {keys.length === 0 ? (
            <div
              style={{
                padding: "40px",
                textAlign: "center",
                color: "#a8a29e",
                fontSize: "14px",
              }}
            >
              No API keys yet. Generate one above.
            </div>
          ) : (
            keys.map((k) => (
              <div key={k.id}>
                <div
                  style={{
                    padding: "16px 24px",
                    borderBottom: "1px solid #f5f5f4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "4px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#1c1917",
                        }}
                      >
                        {k.label}
                      </span>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 600,
                          padding: "2px 8px",
                          borderRadius: "4px",
                          background: k.isActive ? "#dcfce7" : "#fee2e2",
                          color: k.isActive ? "#16a34a" : "#dc2626",
                        }}
                      >
                        {k.isActive ? "Active" : "Revoked"}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <code
                        style={{
                          fontSize: "12px",
                          color: "#57534e",
                          fontFamily: "monospace",
                          background: "#f5f5f4",
                          padding: "2px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        {k.key}
                      </code>
                      <button
                        onClick={() => copyToClipboard(k.key, k.id)}
                        style={{
                          fontSize: "11px",
                          color: copiedId === k.id ? "#16a34a" : "#a8a29e",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontWeight: 500,
                        }}
                      >
                        {copiedId === k.id ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <div
                      style={{
                        marginTop: "6px",
                        fontSize: "11px",
                        color: "#a8a29e",
                      }}
                    >
                      {k.requestsCount} / {k.requestsLimit} requests used
                      <span
                        style={{
                          display: "inline-block",
                          width: "80px",
                          height: "4px",
                          background: "#f5f5f4",
                          borderRadius: "2px",
                          marginLeft: "8px",
                          verticalAlign: "middle",
                          overflow: "hidden",
                        }}
                      >
                        <span
                          style={{
                            display: "block",
                            width: `${Math.min(100, (k.requestsCount / k.requestsLimit) * 100)}%`,
                            height: "100%",
                            background:
                              k.requestsCount / k.requestsLimit > 0.8
                                ? "#ef4444"
                                : k.requestsCount / k.requestsLimit > 0.5
                                  ? "#f59e0b"
                                  : "#22c55e",
                            borderRadius: "2px",
                          }}
                        />
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => fetchUsage(k.id)}
                      style={{
                        fontSize: "11px",
                        padding: "4px 12px",
                        borderRadius: "6px",
                        border: "1px solid #e7e5e4",
                        background: expandedKey === k.id ? "#f5f5f4" : "#fff",
                        color: "#57534e",
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      {expandedKey === k.id ? "Hide" : "Usage"}
                    </button>
                    {k.isActive && (
                      <button
                        onClick={() => revokeKey(k.id)}
                        style={{
                          fontSize: "11px",
                          padding: "4px 12px",
                          borderRadius: "6px",
                          border: "1px solid #fecaca",
                          background: "#fff",
                          color: "#dc2626",
                          cursor: "pointer",
                          fontWeight: 500,
                        }}
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                </div>

                {/* Usage details expand */}
                {expandedKey === k.id && usageData[k.id] && (
                  <div
                    style={{
                      padding: "16px 24px",
                      background: "#fafaf9",
                      borderBottom: "1px solid #f5f5f4",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#57534e",
                        marginBottom: "8px",
                      }}
                    >
                      Usage Breakdown
                    </p>
                    {usageData[k.id].breakdown?.length > 0 ? (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 80px",
                          gap: "4px",
                          fontSize: "12px",
                        }}
                      >
                        {usageData[k.id].breakdown.map((b, i) => (
                          <div
                            key={i}
                            style={{
                              display: "contents",
                            }}
                          >
                            <span
                              style={{
                                fontFamily: "monospace",
                                color: "#44403c",
                              }}
                            >
                              {b.endpoint}
                            </span>
                            <span
                              style={{
                                textAlign: "right",
                                fontWeight: 600,
                                color: "#1c1917",
                              }}
                            >
                              {b.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ fontSize: "12px", color: "#a8a29e" }}>
                        No requests yet
                      </p>
                    )}
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#a8a29e",
                        marginTop: "8px",
                      }}
                    >
                      Remaining: {usageData[k.id].remaining} requests
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* SDK Snippet */}
        {keys.filter((k) => k.isActive).length > 0 && (
          <div
            style={{
              marginTop: "24px",
              background: "#ffffff",
              borderRadius: "12px",
              border: "1px solid #e7e5e4",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "16px 24px",
                borderBottom: "1px solid #e7e5e4",
              }}
            >
              <h2
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#1c1917",
                }}
              >
                Quick Integration
              </h2>
            </div>
            <div style={{ padding: "16px 24px" }}>
              <p
                style={{
                  fontSize: "13px",
                  color: "#57534e",
                  marginBottom: "12px",
                }}
              >
                Add this snippet to your HTML page:
              </p>
              <pre
                style={{
                  background: "#1c1917",
                  color: "#e7e5e4",
                  padding: "16px 20px",
                  borderRadius: "10px",
                  fontSize: "12px",
                  lineHeight: 1.6,
                  overflowX: "auto",
                  fontFamily: "'SF Mono', 'Fira Code', monospace",
                }}
              >
{`<script>
  window.DrishtiConfig = {
    apiKey: "${keys.find((k) => k.isActive)?.key || "YOUR_KEY"}",
    apiUrl: "${BACKEND_URL}/analyze",
    selectors: {
      headline: "#headline",
      cta: "#cta"
    },
    interval: 5000,
    enabled: true
  };
</script>
<script src="drishti.js"></script>`}
              </pre>
              <p
                style={{
                  fontSize: "12px",
                  color: "#a8a29e",
                  marginTop: "8px",
                }}
              >
                See the{" "}
                <Link
                  href="/docs"
                  style={{ color: "#d97706", fontWeight: 600 }}
                >
                  full documentation
                </Link>{" "}
                for advanced setup.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
