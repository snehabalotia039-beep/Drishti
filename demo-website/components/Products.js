"use client";

const products = [
  {
    name: "AuraX Pro Headphones",
    price: "₹12,999",
    originalPrice: "₹16,999",
    image: "/product-headphones.png",
    tag: "Best Seller",
    rating: 4.8,
    reviews: 342,
  },
  {
    name: "Pulse Watch Series 5",
    price: "₹9,499",
    originalPrice: "₹12,999",
    image: "/product-smartwatch.png",
    tag: "New",
    rating: 4.6,
    reviews: 189,
  },
  {
    name: "SoundCore Mini Speaker",
    price: "₹4,999",
    originalPrice: "₹6,499",
    image: "/product-speaker.png",
    tag: "Popular",
    rating: 4.7,
    reviews: 521,
  },
];

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= Math.floor(rating)
              ? "text-amber-400"
              : "text-stone-200"
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

export default function Products() {
  return (
    <section
      id="products"
      data-section="products"
      className="py-24 bg-white"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-amber-600 tracking-wide uppercase mb-3">
            Our Products
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight mb-4"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Crafted for everyday excellence
          </h2>
          <p className="text-stone-500 max-w-lg mx-auto">
            Each product is designed with care — premium materials, thoughtful
            details, and performance that speaks for itself.
          </p>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, i) => (
            <div
              key={i}
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
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="text-base font-semibold text-stone-900 mb-2">
                  {product.name}
                </h3>

                <div className="flex items-center gap-2 mb-3">
                  <StarRating rating={product.rating} />
                  <span className="text-xs text-stone-400">
                    ({product.reviews})
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-stone-900">
                      {product.price}
                    </span>
                    <span className="text-sm text-stone-400 line-through">
                      {product.originalPrice}
                    </span>
                  </div>
                  <button className="text-sm font-medium text-stone-600 bg-stone-100 px-3 py-1.5 rounded-lg hover:bg-stone-900 hover:text-white transition-all duration-200">
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
