"use client";

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-stone-900 font-bold text-sm">L</span>
              </div>
              <span
                className="text-lg font-semibold text-white"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Luxe Tech
              </span>
            </div>
            <p className="text-sm text-stone-500 leading-relaxed">
              Premium tech products designed for modern living.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Products</h4>
            <ul className="space-y-2">
              {["Headphones", "Smartwatches", "Speakers", "Accessories"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#products"
                      className="text-sm text-stone-500 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              {["About", "Careers", "Blog", "Press"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-stone-500 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              {["Help Center", "Contact", "Returns", "Warranty"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-stone-500 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-stone-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-600">
            © 2026 Luxe Tech. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-stone-600">
            Powered by
            <span className="font-semibold text-amber-500 ml-1">Drishti</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
