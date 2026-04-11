"use client";

export default function Cart({
  items,
  isOpen,
  onClose,
  onRemove,
  onUpdateQuantity,
  total,
  finalTotal,
  discount,
  discountAmount,
}) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(4px)",
            zIndex: 9998,
            animation: "fadeIn 0.2s ease",
          }}
        />
      )}

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: isOpen ? 0 : "-420px",
          width: "400px",
          maxWidth: "100vw",
          height: "100vh",
          background: "#ffffff",
          boxShadow: isOpen ? "-8px 0 30px rgba(0,0,0,0.12)" : "none",
          zIndex: 9999,
          transition: "right 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #e7e5e4",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#1c1917",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Your Cart
            </h2>
            <p style={{ fontSize: "12px", color: "#a8a29e", marginTop: "2px" }}>
              {items.length === 0
                ? "Your cart is empty"
                : `${items.reduce((s, i) => s + i.quantity, 0)} items`}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              border: "1px solid #e7e5e4",
              background: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              color: "#78716c",
            }}
          >
            x
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          {items.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 0",
                color: "#a8a29e",
              }}
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#d6d3d1"
                strokeWidth="1.5"
                style={{ margin: "0 auto 12px" }}
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <p style={{ fontSize: "14px" }}>No items in your cart</p>
              <p style={{ fontSize: "12px", marginTop: "4px" }}>
                Browse our products and add some
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  gap: "12px",
                  padding: "14px 0",
                  borderBottom: "1px solid #f5f5f4",
                }}
              >
                {/* Product image */}
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "10px",
                    background: "#f5f5f4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "contain",
                    }}
                  />
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#1c1917",
                      marginBottom: "4px",
                    }}
                  >
                    {item.name}
                  </p>
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#1c1917",
                    }}
                  >
                    Rs. {item.price.toLocaleString("en-IN")}
                  </p>

                  {/* Quantity controls */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginTop: "8px",
                    }}
                  >
                    <button
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      style={{
                        width: "26px",
                        height: "26px",
                        borderRadius: "6px",
                        border: "1px solid #e7e5e4",
                        background: "#fff",
                        cursor: "pointer",
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#57534e",
                      }}
                    >
                      -
                    </button>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#1c1917",
                        minWidth: "20px",
                        textAlign: "center",
                      }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      style={{
                        width: "26px",
                        height: "26px",
                        borderRadius: "6px",
                        border: "1px solid #e7e5e4",
                        background: "#fff",
                        cursor: "pointer",
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#57534e",
                      }}
                    >
                      +
                    </button>

                    <button
                      onClick={() => onRemove(item.id)}
                      style={{
                        marginLeft: "auto",
                        fontSize: "11px",
                        color: "#a8a29e",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            style={{
              padding: "20px 24px",
              borderTop: "1px solid #e7e5e4",
              background: "#fafaf9",
            }}
          >
            {/* Subtotal */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "6px",
                fontSize: "13px",
                color: "#57534e",
              }}
            >
              <span>Subtotal</span>
              <span>Rs. {total.toLocaleString("en-IN")}</span>
            </div>

            {/* Discount */}
            {discount?.applied && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "6px",
                  fontSize: "13px",
                  color: "#16a34a",
                  fontWeight: 600,
                }}
              >
                <span>
                  Discount ({discount.percent}% - {discount.code})
                </span>
                <span>- Rs. {discountAmount.toLocaleString("en-IN")}</span>
              </div>
            )}

            {/* Total */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "16px",
                fontWeight: 700,
                color: "#1c1917",
                paddingTop: "10px",
                borderTop: "1px solid #e7e5e4",
                marginTop: "10px",
              }}
            >
              <span>Total</span>
              <span>Rs. {finalTotal.toLocaleString("en-IN")}</span>
            </div>

            {/* Checkout */}
            <button
              style={{
                width: "100%",
                marginTop: "16px",
                padding: "12px",
                background: "#1c1917",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.target.style.background = "#292524")
              }
              onMouseLeave={(e) =>
                (e.target.style.background = "#1c1917")
              }
            >
              Checkout -- Rs. {finalTotal.toLocaleString("en-IN")}
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
