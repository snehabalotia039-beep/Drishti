"use client";

export default function Hero() {
  return (
    <section
      id="hero"
      data-section="hero"
      className="relative min-h-[90vh] flex items-center justify-center pt-16"
      style={{ background: "#fafaf9" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-16">
        {/* Left — Text Content */}
        <div className="flex-1 text-center lg:text-left">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
            <span className="text-xs font-medium text-stone-600 tracking-wide uppercase">
              New Collection 2026
            </span>
          </div>

          {/* Headline — DYNAMIC (Drishti will update this) */}
          <h1
            id="headline"
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 leading-tight tracking-tight mb-6 drishti-transition"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Sound that moves
            <br />
            with you.
          </h1>

          {/* Subtext */}
          <p className="text-lg text-stone-500 max-w-md mx-auto lg:mx-0 mb-8 leading-relaxed">
            Premium audio and wearables crafted for people who value
            simplicity, quality, and great design.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            {/* Primary CTA — DYNAMIC (Drishti will update this) */}
            <button
              id="cta"
              className="inline-flex items-center justify-center gap-2 bg-stone-900 text-white px-7 py-3.5 rounded-lg text-sm font-semibold hover:bg-stone-800 transition-all duration-200 hover:shadow-lg drishti-transition"
            >
              Shop Collection
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>

            <button className="inline-flex items-center justify-center gap-2 border border-stone-300 text-stone-700 px-7 py-3.5 rounded-lg text-sm font-semibold hover:border-stone-400 hover:bg-stone-50 transition-all duration-200">
              Learn More
            </button>
          </div>

          {/* Social proof */}
          <div className="mt-10 flex items-center gap-4 justify-center lg:justify-start">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white"
                  style={{
                    background: `hsl(${30 + i * 20}, 20%, ${65 + i * 5}%)`,
                  }}
                />
              ))}
            </div>
            <div className="text-sm text-stone-500">
              <span className="font-semibold text-stone-700">2,400+</span>{" "}
              happy customers
            </div>
          </div>
        </div>

        {/* Right — Product Display */}
        <div className="flex-1 relative">
          <div className="relative w-full max-w-md mx-auto">
            {/* Background shape */}
            <div className="absolute inset-0 bg-stone-100 rounded-3xl transform rotate-3 scale-95"></div>
            {/* Product image */}
            <div className="relative bg-white rounded-2xl shadow-lg p-8 overflow-hidden">
              <img
                src="/product-headphones.png"
                alt="Premium wireless headphones"
                className="w-full h-auto object-contain"
              />
              {/* Price tag */}
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md">
                <p className="text-xs text-stone-400 font-medium">Starting at</p>
                <p className="text-xl font-bold text-stone-900">₹12,999</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
