"use client";

import { useState, useEffect } from "react";

const ALL_PRODUCTS = [
  {
    id: 1,
    name: "AuraX Pro Headphones",
    price: 12999,
    originalPrice: 16999,
    image: "/product-headphones.png",
    tag: "Best Seller",
    rating: 4.8,
    reviews: 342,
    category: "audio",
    mood: "happy",
    description: "Premium wireless ANC headphones with 40-hour battery life",
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
    category: "wearable",
    mood: "neutral",
    description: "Advanced health tracking with AMOLED display",
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
    category: "audio",
    mood: "happy",
    description: "360-degree sound in a pocket-sized design",
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
    category: "audio",
    mood: "love",
    description: "Reference-grade sound for creators and audiophiles",
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
    category: "wearable",
    mood: "bored",
    description: "Essential fitness tracking at an unbeatable price",
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
    category: "audio",
    mood: "neutral",
    description: "Room-filling sound with built-in smart assistant",
  },
];

// Section headlines based on behavioral state
const SECTION_HEADLINES = {
  default: "Crafted for everyday excellence",
  bored: "Wait -- check out these hot picks",
  confused: "Not sure where to start? Try these",
  happy: "Great taste! You will love these",
  love: "Premium picks, just for you",
  low_engagement_fast_scroll: "Trending right now -- don't miss out",
  scanning_user_redirect: "Quick picks -- customers love these",
  long_session_offer: "Special deals -- just for you",
  high_engagement_slow_read: "Our finest selection, hand-picked",
  low_interaction_assist: "Popular choices to get you started",
  high_interaction_explore: "You have great taste -- explore more",
};

const SECTION_SUBTEXTS = {
  default:
    "Each product is designed with care -- premium materials, thoughtful details, and performance that speaks for itself.",
  bored: "These are flying off the shelves. Grab one before they are gone.",
  confused:
    "Our best-rated products, loved by thousands. You can not go wrong with any of these.",
  happy:
    "Matching your vibe with our top-rated products. Each one is a crowd favorite.",
  love: "The absolute best we offer. Crafted for those who demand excellence.",
  long_session_offer:
    "You have been browsing for a while -- here are some exclusive deals.",
};

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${star <= Math.floor(rating) ? "text-amber-400" : "text-stone-200"
            }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Products({ products: externalProducts, onAddToCart }) {
  const [sectionTitle, setSectionTitle] = useState(
    SECTION_HEADLINES.default
  );
  const [sectionSubtext, setSectionSubtext] = useState(
    SECTION_SUBTEXTS.default
  );
  const [displayProducts, setDisplayProducts] = useState(
    externalProducts || ALL_PRODUCTS.slice(0, 3)
  );
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Listen for Drishti decisions and reorder/swap products
  useEffect(() => {
    function handleDecision(e) {
      const { emotion, reason, priority } = e.detail;

      // Update section headline
      const newTitle =
        SECTION_HEADLINES[emotion] ||
        SECTION_HEADLINES[reason] ||
        SECTION_HEADLINES.default;
      const newSubtext =
        SECTION_SUBTEXTS[emotion] ||
        SECTION_SUBTEXTS[reason] ||
        SECTION_SUBTEXTS.default;

      // Animate transition
      setIsTransitioning(true);

      setTimeout(() => {
        setSectionTitle(newTitle);
        setSectionSubtext(newSubtext);

        // Reorder products based on behavior
        let sorted = [...ALL_PRODUCTS];

        if (emotion === "bored" || priority === "retain") {
          // Show deals and value picks first
          sorted.sort((a, b) => {
            const discountA =
              (a.originalPrice - a.price) / a.originalPrice;
            const discountB =
              (b.originalPrice - b.price) / b.originalPrice;
            return discountB - discountA;
          });
        } else if (emotion === "love" || emotion === "happy") {
          // Show premium + highest rated first
          sorted.sort((a, b) => b.rating - a.rating || b.price - a.price);
        } else if (emotion === "confused") {
          // Show most reviewed (social proof) first
          sorted.sort((a, b) => b.reviews - a.reviews);
        } else if (reason === "high_interaction_explore") {
          // Show all products, lesser-known first
          sorted.sort((a, b) => a.reviews - b.reviews);
        } else if (
          reason === "long_session_offer" ||
          reason === "low_engagement_fast_scroll"
        ) {
          // Show cheapest first (easy purchase)
          sorted.sort((a, b) => a.price - b.price);
        }

        // Show 3 or 6 products depending on engagement
        const count =
          reason === "high_interaction_explore" || emotion === "love"
            ? 6
            : 3;
        setDisplayProducts(sorted.slice(0, count));

        setTimeout(() => setIsTransitioning(false), 50);
      }, 300);
    }

    window.addEventListener("drishti-decision", handleDecision);
    return () =>
      window.removeEventListener("drishti-decision", handleDecision);
  }, []);

  return (
    <section
      id="products"
      data-section="products"
      className="py-24 bg-white"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header -- dynamic */}
        <div
          className="text-center mb-16"
          style={{
            transition: "opacity 0.3s ease",
            opacity: isTransitioning ? 0 : 1,
          }}
        >
          <p className="text-sm font-medium text-amber-600 tracking-wide uppercase mb-3">
            Our Products
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight mb-4"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {sectionTitle}
          </h2>
          <p className="text-stone-500 max-w-lg mx-auto">{sectionSubtext}</p>
        </div>

        {/* Product grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          style={{
            transition: "opacity 0.3s ease",
            opacity: isTransitioning ? 0 : 1,
          }}
        >
          {displayProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white border border-stone-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative bg-stone-50 p-6 flex items-center justify-center h-64">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-3/4 h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                />
                {/* Tag */}
                <span className="absolute top-4 left-4 text-xs font-semibold px-2.5 py-1 rounded-md bg-stone-900 text-white">
                  {product.tag}
                </span>
                {/* Discount % */}
                {product.originalPrice > product.price && (
                  <span
                    className="absolute top-4 right-4 text-xs font-semibold px-2 py-1 rounded-md"
                    style={{
                      background: "#fef3c7",
                      color: "#92400e",
                    }}
                  >
                    {Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                      100
                    )}
                    % OFF
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="text-base font-semibold text-stone-900 mb-1">
                  {product.name}
                </h3>
                {product.description && (
                  <p className="text-xs text-stone-400 mb-2">
                    {product.description}
                  </p>
                )}

                <div className="flex items-center gap-2 mb-3">
                  <StarRating rating={product.rating} />
                  <span className="text-xs text-stone-400">
                    ({product.reviews})
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-stone-900">
                      Rs. {product.price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-sm text-stone-400 line-through">
                      Rs. {product.originalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <button
                    onClick={() => onAddToCart(product.id)}
                    className="text-sm font-medium text-stone-600 bg-stone-100 px-3 py-1.5 rounded-lg hover:bg-stone-900 hover:text-white transition-all duration-200"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
