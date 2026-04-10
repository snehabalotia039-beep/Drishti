"use client";

import Script from "next/script";

export default function DrishtiScript() {
  return (
    <>
      {/* Drishti SDK Config — loaded BEFORE the script */}
      <Script id="drishti-config" strategy="beforeInteractive">
        {`
          window.DrishtiConfig = {
            apiKey: "demo123",
            apiUrl: "http://localhost:5000/analyze",
            selectors: {
              headline: "#headline",
              cta: "#cta"
            },
            interval: 5000,
            enabled: false,
            debug: true
          };
        `}
      </Script>

      {/* Drishti SDK Script */}
      <Script
        src="/drishti.js"
        strategy="afterInteractive"
      />
    </>
  );
}
