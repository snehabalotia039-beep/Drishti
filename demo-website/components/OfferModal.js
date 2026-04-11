"use client";

export default function OfferModal({
  title,
  message,
  discountPercent,
  onClaim,
  onClose,
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10001,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(6px)",
          animation: "offerFadeIn 0.2s ease",
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "relative",
          background: "#ffffff",
          borderRadius: "20px",
          padding: "36px",
          maxWidth: "400px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          animation: "offerPopIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            width: "28px",
            height: "28px",
            borderRadius: "6px",
            border: "1px solid #e7e5e4",
            background: "#fff",
            cursor: "pointer",
            fontSize: "14px",
            color: "#a8a29e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          x
        </button>

        {/* Discount badge */}
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, #f59e0b, #d97706)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            boxShadow: "0 4px 20px rgba(245, 158, 11, 0.3)",
          }}
        >
          <span
            style={{
              color: "#fff",
              fontWeight: 800,
              fontSize: "22px",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {discountPercent}%
          </span>
        </div>

        <h3
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#1c1917",
            marginBottom: "8px",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {title}
        </h3>

        <p
          style={{
            fontSize: "14px",
            color: "#78716c",
            lineHeight: 1.6,
            marginBottom: "24px",
          }}
        >
          {message}
        </p>

        {/* Code preview */}
        <div
          style={{
            background: "#f5f5f4",
            borderRadius: "8px",
            padding: "10px 16px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              fontSize: "12px",
              color: "#a8a29e",
              fontWeight: 500,
            }}
          >
            Code:
          </span>
          <span
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#1c1917",
              fontFamily: "monospace",
              letterSpacing: "0.05em",
            }}
          >
            DRISHTI{discountPercent}
          </span>
        </div>

        {/* CTA */}
        <button
          onClick={onClaim}
          style={{
            width: "100%",
            padding: "14px",
            background: "#1c1917",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            fontSize: "15px",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#292524")}
          onMouseLeave={(e) => (e.target.style.background = "#1c1917")}
        >
          Claim {discountPercent}% Off
        </button>

        <p
          style={{
            fontSize: "11px",
            color: "#a8a29e",
            marginTop: "12px",
          }}
        >
          Discount applies automatically at checkout
        </p>
      </div>

      <style jsx>{`
        @keyframes offerFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes offerPopIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
