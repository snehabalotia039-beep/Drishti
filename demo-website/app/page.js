"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import DrishtiToggle from "@/components/DrishtiToggle";
import DrishtiScript from "@/components/DrishtiScript";
import Cart from "@/components/Cart";
import Toast from "@/components/Toast";
import OfferModal from "@/components/OfferModal";

const PRODUCTS = [
  {
    id: 1,
    name: "AuraX Pro Headphones",
    price: 12999,
    originalPrice: 16999,
    image: "/product-headphones.png",
    tag: "Best Seller",
    rating: 4.8,
    reviews: 342,
  },
  {
    id: 2,
    name: "Pulse Watch Series 5",
    price: 9499,
    originalPrice: 12999,
    image: "/product-smartwatch.png",
    tag: "New",
    rating: 4.6,
    reviews: 189,
  },
  {
    id: 3,
    name: "SoundCore Mini Speaker",
    price: 4999,
    originalPrice: 6499,
    image: "/product-speaker.png",
    tag: "Popular",
    rating: 4.7,
    reviews: 521,
  },
  {
    id: 4,
    name: "AuraX Studio Monitors",
    price: 18999,
    originalPrice: 24999,
    image: "/product-monitor.png",
    tag: "Premium",
    rating: 4.9,
    reviews: 97,
  },
  {
    id: 5,
    name: "Pulse Band Lite",
    price: 3499,
    originalPrice: 4999,
    image: "/product-smartwatch.png",
    tag: "Value Pick",
    rating: 4.4,
    reviews: 834,
  },
  {
    id: 6,
    name: "SoundCore Home Max",
    price: 8999,
    originalPrice: 11999,
    image: "/product-dualspeaker.png",
    tag: "Staff Pick",
    rating: 4.8,
    reviews: 256,
  },
];

export default function Home() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [offerModal, setOfferModal] = useState(null);
  const [discount, setDiscount] = useState(null); // { percent, code, applied }

  // -- Add to cart --
  const addToCart = useCallback(
    (productId) => {
      const product = PRODUCTS.find((p) => p.id === productId);
      if (!product) return;

      setCart((prev) => {
        const existing = prev.find((item) => item.id === productId);
        if (existing) {
          return prev.map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { ...product, quantity: 1 }];
      });

      setToast({ message: `${product.name} added to cart`, type: "success" });
    },
    []
  );

  // -- Remove from cart --
  const removeFromCart = useCallback((productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  // -- Update quantity --
  const updateQuantity = useCallback((productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  // -- Apply discount --
  const applyDiscount = useCallback(
    (percent) => {
      if (discount?.applied) return;
      const code = "DRISHTI" + percent;
      setDiscount({ percent, code, applied: true });
      setToast({
        message: `${percent}% discount applied! Code: ${code}`,
        type: "offer",
      });
    },
    [discount]
  );

  // -- Cart totals --
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const discountAmount = discount?.applied
    ? Math.round(cartTotal * (discount.percent / 100))
    : 0;
  const finalTotal = cartTotal - discountAmount;

  // -- Listen for Drishti CTA clicks --
  // When Drishti changes the CTA text, we intercept the click to do
  // something real based on what the CTA says
  useEffect(() => {
    function handleCtaClick(e) {
      const ctaButton = document.getElementById("cta");
      if (!ctaButton) return;
      if (!ctaButton.contains(e.target) && e.target !== ctaButton) return;

      const text = ctaButton.textContent.trim().toLowerCase();

      // Map CTA text to real actions
      if (text.includes("buy now") || text.includes("grab it")) {
        // Add the best seller to cart + open cart
        addToCart(1);
        setTimeout(() => setCartOpen(true), 300);
      } else if (text.includes("claim offer") || text.includes("deal")) {
        // Show offer modal with discount
        setOfferModal({
          title: "Exclusive Deal Just For You",
          message:
            "You have been browsing for a while. Here is a special 15% discount on your entire cart.",
          discount: 15,
        });
      } else if (text.includes("show me") || text.includes("see top") || text.includes("explore")) {
        // Scroll to products section
        const productsEl = document.getElementById("products");
        if (productsEl) {
          productsEl.scrollIntoView({ behavior: "smooth" });
        }
      } else if (text.includes("start here") || text.includes("learn more") || text.includes("get help")) {
        // Scroll to pricing/info section
        const pricingEl = document.getElementById("pricing");
        if (pricingEl) {
          pricingEl.scrollIntoView({ behavior: "smooth" });
        }
      } else if (text.includes("shop collection")) {
        // Default CTA -- scroll to products
        const productsEl = document.getElementById("products");
        if (productsEl) {
          productsEl.scrollIntoView({ behavior: "smooth" });
        }
      }
    }

    document.addEventListener("click", handleCtaClick);
    return () => document.removeEventListener("click", handleCtaClick);
  }, [addToCart]);

  // -- Listen for Drishti decision events to trigger offers --
  useEffect(() => {
    function handleDrishtiUpdate() {
      // Check if the CTA now says something about a deal/offer
      const ctaButton = document.getElementById("cta");
      if (!ctaButton) return;
      const text = ctaButton.textContent.trim().toLowerCase();

      // Auto-show offer popup when Drishti suggests a deal for long sessions
      if (
        (text.includes("claim offer") || text.includes("deal")) &&
        !discount?.applied
      ) {
        setTimeout(() => {
          setOfferModal({
            title: "We Made You a Deal",
            message:
              "Since you are taking your time, enjoy a flat 15% off everything in your cart. This offer expires soon.",
            discount: 15,
          });
        }, 1000);
      }
    }

    // MutationObserver on the CTA to detect SDK changes
    const ctaButton = document.getElementById("cta");
    if (ctaButton) {
      const observer = new MutationObserver(handleDrishtiUpdate);
      observer.observe(ctaButton, {
        childList: true,
        characterData: true,
        subtree: true,
      });
      return () => observer.disconnect();
    }
  }, [discount]);

  return (
    <>
      <Navbar cartCount={cartCount} onCartClick={() => setCartOpen(true)} />
      <main>
        <Hero />
        <Products products={PRODUCTS} onAddToCart={addToCart} />
        <Pricing />
      </main>
      <Footer />

      {/* Cart Drawer */}
      <Cart
        items={cart}
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
        total={cartTotal}
        finalTotal={finalTotal}
        discount={discount}
        discountAmount={discountAmount}
      />

      {/* Offer Modal */}
      {offerModal && (
        <OfferModal
          title={offerModal.title}
          message={offerModal.message}
          discountPercent={offerModal.discount}
          onClaim={() => {
            applyDiscount(offerModal.discount);
            setOfferModal(null);
          }}
          onClose={() => setOfferModal(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Drishti SDK */}
      <DrishtiScript />
      <DrishtiToggle />
    </>
  );
}
