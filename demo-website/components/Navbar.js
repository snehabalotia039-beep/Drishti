"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/AuthContext";
import Link from "next/link";

export default function Navbar({ cartCount = 0, onCartClick }) {
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-stone-200"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <span
            className="text-lg font-semibold tracking-tight text-stone-900"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Luxe Tech
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#products"
            className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
          >
            Products
          </a>
          <a
            href="#pricing"
            className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
          >
            Pricing
          </a>
          <a
            href="#"
            className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
          >
            About
          </a>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Cart button */}
          <button
            onClick={onCartClick}
            className="relative text-stone-600 hover:text-stone-900 transition-colors p-2"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "2px",
                  right: "0px",
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background: "#d97706",
                  color: "#fff",
                  fontSize: "10px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>

          {/* Auth area */}
          {!loading && (
            <>
              {user ? (
                /* Logged in -- show user dropdown */
                <div ref={menuRef} style={{ position: "relative" }}>
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      border: "1px solid #e7e5e4",
                      background: "#fff",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: "#1c1917",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: "12px",
                        fontWeight: 700,
                      }}
                    >
                      {(user.name || "U").charAt(0).toUpperCase()}
                    </div>
                    <span
                      className="hidden sm:inline"
                      style={{
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "#1c1917",
                      }}
                    >
                      {user.name || "User"}
                    </span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#a8a29e"
                      strokeWidth="2"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>

                  {/* Dropdown */}
                  {menuOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "calc(100% + 8px)",
                        right: 0,
                        width: "200px",
                        background: "#fff",
                        borderRadius: "12px",
                        border: "1px solid #e7e5e4",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                        padding: "6px",
                        zIndex: 100,
                        animation: "dropIn 0.15s ease",
                      }}
                    >
                      <div
                        style={{
                          padding: "10px 12px",
                          borderBottom: "1px solid #f5f5f4",
                          marginBottom: "4px",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "#1c1917",
                          }}
                        >
                          {user.name}
                        </p>
                        <p
                          style={{
                            fontSize: "11px",
                            color: "#a8a29e",
                            marginTop: "2px",
                          }}
                        >
                          {user.email}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          logout();
                        }}
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          border: "none",
                          background: "transparent",
                          fontSize: "13px",
                          color: "#dc2626",
                          fontWeight: 500,
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.target.style.background = "#fef2f2")
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.background = "transparent")
                        }
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Not logged in -- show Sign In / Get Started */
                <>
                  <Link
                    href="/login"
                    className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors px-3 py-2"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="text-sm font-medium bg-stone-900 text-white px-4 py-2 rounded-lg hover:bg-stone-800 transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes dropIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </nav>
  );
}
