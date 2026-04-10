"use client";

import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
        <a href="#" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <span className="text-lg font-semibold tracking-tight text-stone-900"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Luxe Tech
          </span>
        </a>

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

        {/* CTA */}
        <div className="flex items-center gap-3">
          <button className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors px-3 py-2">
            Sign In
          </button>
          <button className="text-sm font-medium bg-stone-900 text-white px-4 py-2 rounded-lg hover:bg-stone-800 transition-colors">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}
