"use client";

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "Perfect for trying things out",
    features: [
      "1 product tracking",
      "Basic analytics",
      "Community support",
      "7-day data retention",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "₹999",
    period: "/mo",
    description: "For growing businesses",
    features: [
      "Unlimited products",
      "AI-powered insights",
      "Priority support",
      "90-day data retention",
      "Custom SDK config",
      "A/B testing",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large-scale operations",
    features: [
      "Everything in Pro",
      "Dedicated account manager",
      "Custom integrations",
      "Unlimited data retention",
      "SLA guarantee",
      "On-premise option",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      data-section="pricing"
      className="py-24 bg-stone-50"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-amber-600 tracking-wide uppercase mb-3">
            Pricing
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight mb-4"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Simple, transparent pricing
          </h2>
          <p className="text-stone-500 max-w-lg mx-auto">
            Start free, upgrade when you need to. No hidden fees, no surprises.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative rounded-2xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                plan.highlighted
                  ? "bg-stone-900 text-white shadow-xl ring-2 ring-stone-900"
                  : "bg-white border border-stone-200 hover:shadow-lg"
              }`}
            >
              {/* Popular badge */}
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-400 text-stone-900">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3
                  className={`text-lg font-semibold mb-1 ${
                    plan.highlighted ? "text-white" : "text-stone-900"
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm ${
                    plan.highlighted ? "text-stone-400" : "text-stone-500"
                  }`}
                >
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span
                  className={`text-4xl font-bold ${
                    plan.highlighted ? "text-white" : "text-stone-900"
                  }`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {plan.price}
                </span>
                {plan.period && (
                  <span
                    className={`text-sm ${
                      plan.highlighted ? "text-stone-400" : "text-stone-500"
                    }`}
                  >
                    {plan.period}
                  </span>
                )}
              </div>

              {/* Features */}
              <ul className="flex-1 space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-2.5 text-sm">
                    <svg
                      className={`w-4 h-4 shrink-0 ${
                        plan.highlighted ? "text-amber-400" : "text-stone-400"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span
                      className={
                        plan.highlighted ? "text-stone-300" : "text-stone-600"
                      }
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                className={`w-full py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  plan.highlighted
                    ? "bg-white text-stone-900 hover:bg-stone-100"
                    : "bg-stone-100 text-stone-900 hover:bg-stone-900 hover:text-white"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
