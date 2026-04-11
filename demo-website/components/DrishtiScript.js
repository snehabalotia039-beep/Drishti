"use client";

import { useEffect } from "react";
import Script from "next/script";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function DrishtiScript() {
  // Set DrishtiConfig before SDK loads
  useEffect(() => {
    window.DrishtiConfig = {
      apiKey: "demo123",
      apiUrl: `${BACKEND_URL}/analyze`,
      emotionUrl: `${BACKEND_URL}/detect-emotion`,
      selectors: {
        headline: "#headline",
        cta: "#cta",
      },
      interval: 5000,
      enabled: false,
      emotionDetection: false,
      emotionInterval: 10000,
      debug: true,
    };
  }, []);

  return (
    <Script
      src="/drishti.js"
      strategy="afterInteractive"
    />
  );
}
