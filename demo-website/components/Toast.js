"use client";

import { useEffect } from "react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColors = {
    success: "#1c1917",
    offer: "#92400e",
    error: "#dc2626",
  };

  const borderColors = {
    success: "#44403c",
    offer: "#d97706",
    error: "#fecaca",
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "80px",
        right: "24px",
        zIndex: 10000,
        background: bgColors[type] || bgColors.success,
        border: `1px solid ${borderColors[type] || borderColors.success}`,
        color: "#fff",
        padding: "12px 20px",
        borderRadius: "10px",
        fontSize: "13px",
        fontWeight: 500,
        boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
        animation: "toastSlideIn 0.3s ease, toastFadeOut 0.3s ease 2.7s",
        maxWidth: "320px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      {type === "success" && (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#22c55e"
          strokeWidth="2.5"
        >
          <path
            d="M5 13l4 4L19 7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {type === "offer" && (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="2"
        >
          <path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          color: "#a8a29e",
          cursor: "pointer",
          fontSize: "14px",
          marginLeft: "4px",
          padding: "0",
        }}
      >
        x
      </button>

      <style jsx>{`
        @keyframes toastSlideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes toastFadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
