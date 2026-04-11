"use client";

import { useState, useEffect } from "react";

export default function DrishtiToggle() {
  const [enabled, setEnabled] = useState(false);
  const [webcamOn, setWebcamOn] = useState(false);
  const [emotion, setEmotion] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Listen for emotion from webcam
    const handleEmotion = (e) => {
      setEmotion(e.detail.emotion);
    };
    // Listen for emotion from analyze decision response
    const handleDecision = (e) => {
      if (e.detail.emotion) {
        setEmotion(e.detail.emotion);
      }
    };

    window.addEventListener("drishti-emotion", handleEmotion);
    window.addEventListener("drishti-decision", handleDecision);

    return () => {
      window.removeEventListener("drishti-emotion", handleEmotion);
      window.removeEventListener("drishti-decision", handleDecision);
    };
  }, []);

  function handleToggle() {
    const next = !enabled;
    setEnabled(next);

    if (typeof window !== "undefined" && window.DrishtiConfig) {
      window.DrishtiConfig.enabled = next;
    }

    if (typeof window !== "undefined" && window.Drishti) {
      if (next) {
        window.Drishti.reset();
        window.Drishti.start();
      } else {
        window.Drishti.stop();
        setWebcamOn(false);
        setEmotion(null);
        restoreOriginal();
      }
    }
  }

  async function handleWebcamToggle(e) {
    e.stopPropagation();

    if (!enabled) return;

    if (typeof window !== "undefined" && window.Drishti) {
      if (!webcamOn) {
        const success = await window.Drishti.enableWebcam();
        if (success) {
          setWebcamOn(true);
        }
      } else {
        window.Drishti.disableWebcam();
        setWebcamOn(false);
        setEmotion(null);
      }
    }
  }

  function restoreOriginal() {
    const headline = document.getElementById("headline");
    const cta = document.getElementById("cta");

    if (headline) {
      headline.classList.add("drishti-fade-out");
      setTimeout(() => {
        headline.textContent = "Sound that moves with you.";
        headline.classList.remove("drishti-fade-out");
      }, 350);
    }

    if (cta) {
      cta.classList.add("drishti-fade-out");
      setTimeout(() => {
        // Keep the SVG arrow icon if it exists
        const svg = cta.querySelector("svg");
        const textNodes = Array.from(cta.childNodes).filter(
          (n) => n.nodeType === Node.TEXT_NODE
        );
        textNodes.forEach((n) => n.remove());
        if (svg) {
          cta.insertBefore(
            document.createTextNode("Shop Collection "),
            svg
          );
        } else {
          cta.textContent = "Shop Collection";
        }
        cta.classList.remove("drishti-fade-out");
      }, 350);
    }
  }

  // Emotion label colors
  const emotionColors = {
    love: "#ef4444",
    happy: "#22c55e",
    confused: "#f59e0b",
    bored: "#a8a29e",
    neutral: "#78716c",
  };

  if (!mounted) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        left: "24px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {/* Emotion Badge (shows when Drishti detects an emotion) */}
      {enabled && emotion && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#1c1917",
            border: "1px solid #44403c",
            borderRadius: "9999px",
            padding: "6px 14px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            animation: "slideUp 0.3s ease",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: emotionColors[emotion] || "#78716c",
            }}
          />
          <span
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#a8a29e",
              textTransform: "capitalize",
            }}
          >
            {emotion}
          </span>
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#22c55e",
              animation: "pulse-dot 2s infinite",
            }}
          />
        </div>
      )}

      {/* Main Toggle Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {/* Main Drishti Toggle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: enabled ? "#1c1917" : "#ffffff",
            border: enabled ? "1px solid #44403c" : "1px solid #e7e5e4",
            borderRadius: "9999px",
            padding: "8px 16px 8px 12px",
            boxShadow: enabled
              ? "0 8px 30px rgba(0,0,0,0.3)"
              : "0 4px 12px rgba(0,0,0,0.08)",
            cursor: "pointer",
            transition: "all 0.3s ease",
            userSelect: "none",
          }}
          onClick={handleToggle}
          title={enabled ? "Click to disable Drishti" : "Click to enable Drishti"}
        >
          {/* Toggle switch */}
          <div
            style={{
              position: "relative",
              width: "36px",
              height: "20px",
              borderRadius: "9999px",
              background: enabled ? "#f59e0b" : "#d6d3d1",
              transition: "background 0.3s ease",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "2px",
                left: enabled ? "18px" : "2px",
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                background: "#ffffff",
                transition: "left 0.3s ease",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              }}
            />
          </div>

          {/* Label */}
          <span
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: enabled ? "#fbbf24" : "#78716c",
              letterSpacing: "0.01em",
              transition: "color 0.3s ease",
            }}
          >
            Drishti {enabled ? "ON" : "OFF"}
          </span>

          {/* Status dot */}
          {enabled && (
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#22c55e",
                animation: "pulse-dot 2s infinite",
              }}
            />
          )}
        </div>

        {/* Webcam Toggle Button */}
        {enabled && (
          <div
            onClick={handleWebcamToggle}
            title={webcamOn ? "Disable webcam emotion detection" : "Enable webcam emotion detection"}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: webcamOn ? "#1c1917" : "#ffffff",
              border: webcamOn ? "1px solid #44403c" : "1px solid #e7e5e4",
              boxShadow: webcamOn
                ? "0 4px 12px rgba(0,0,0,0.3)"
                : "0 4px 12px rgba(0,0,0,0.08)",
              cursor: "pointer",
              transition: "all 0.3s ease",
              animation: "fadeIn 0.3s ease",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke={webcamOn ? "#fbbf24" : "#78716c"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {webcamOn ? (
                <>
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                  <circle cx="12" cy="13" r="4" />
                </>
              ) : (
                <>
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                  <circle cx="12" cy="13" r="4" />
                </>
              )}
            </svg>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes slideUp {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
