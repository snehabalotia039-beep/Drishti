"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const BACKEND_URL = "http://localhost:5000";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      // Store token and user info
      localStorage.setItem("drishti_token", data.token);
      localStorage.setItem("drishti_user", JSON.stringify(data.user));

      router.push("/console");
    } catch (err) {
      setError("Could not connect to server");
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fafaf9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "400px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              textDecoration: "none",
              color: "#1c1917",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                background: "#1c1917",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 700,
                fontSize: "16px",
              }}
            >
              D
            </div>
            <span
              style={{
                fontSize: "20px",
                fontWeight: 700,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Drishti
            </span>
          </Link>
        </div>

        {/* Card */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #e7e5e4",
            padding: "32px",
          }}
        >
          <h1
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#1c1917",
              marginBottom: "4px",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Create account
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "#a8a29e",
              marginBottom: "24px",
            }}
          >
            Get your Drishti API key in seconds
          </p>

          {error && (
            <div
              style={{
                padding: "10px 14px",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "8px",
                color: "#dc2626",
                fontSize: "13px",
                marginBottom: "16px",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your name"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Min. 6 characters"
                style={inputStyle}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "10px",
                background: "#1c1917",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: "16px",
            fontSize: "13px",
            color: "#a8a29e",
          }}
        >
          Already have an account?{" "}
          <Link
            href="/login"
            style={{ color: "#d97706", fontWeight: 600, textDecoration: "none" }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  fontSize: "12px",
  fontWeight: 600,
  color: "#57534e",
  marginBottom: "6px",
};

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "8px",
  border: "1px solid #e7e5e4",
  fontSize: "14px",
  outline: "none",
  background: "#fafaf9",
};
