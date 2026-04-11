"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load token from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("luxe_token");
    if (saved) {
      setToken(saved);
      fetchProfile(saved);
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch user profile with token
  async function fetchProfile(jwt) {
    try {
      const res = await fetch(`${BACKEND_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setToken(jwt);
      } else {
        // Token expired or invalid
        localStorage.removeItem("luxe_token");
        setToken(null);
        setUser(null);
      }
    } catch (err) {
      console.error("[auth] Profile fetch failed:", err.message);
    } finally {
      setLoading(false);
    }
  }

  // Register
  const register = useCallback(async (name, email, password) => {
    const res = await fetch(`${BACKEND_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed");

    localStorage.setItem("luxe_token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  // Login
  const login = useCallback(async (email, password) => {
    const res = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");

    localStorage.setItem("luxe_token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem("luxe_token");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
