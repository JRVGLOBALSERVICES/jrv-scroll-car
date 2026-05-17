"use client";

import { motion } from "framer-motion";

const features = [
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    title: "Best Local Rates",
    desc: "Transparent pricing from RM 110/day — no hidden fees, no surprises.",
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
    title: "Zero Deposit",
    desc: "No security deposit required for most bookings. Rare in the industry.",
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    ),
    title: "Free Delivery",
    desc: "Complimentary delivery & pickup within Seremban service area.",
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    title: "KLIA Service",
    desc: "Meet & greet pickup at KLIA/KLIA2 terminals, 24/7 by appointment.",
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m6 9 6 6 6-6" />
      </svg>
    ),
    title: "Unlimited Mileage",
    desc: "No distance limits. Drive as far as you want, no extra charges.",
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "24-Hour Service",
    desc: "Round-the-clock support and 24-hour roadside assistance.",
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    title: "Latest Models",
    desc: "2024-2026 facelift fleet. Well-maintained, clean, and reliable.",
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Replacement Guaranteed",
    desc: "Breakdown? We'll swap your vehicle. No questions asked.",
  },
];

export default function WhyUsSection() {
  return (
    <section id="why-us" className="py-20 md:py-28 bg-brand-cream relative">
      <div className="absolute inset-0 bg-noise" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block bg-black text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 -rotate-1">
            WHY US
          </span>
          <h2 className="text-4xl md:text-6xl font-black uppercase">
            Why Choose <span className="text-brand-orange">JRV</span>?
          </h2>
          <p className="text-gray-600 mt-3 max-w-xl mx-auto text-sm md:text-base">
            We started with 3 cars. Today we run 50+ — because our customers
            trust us.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: [0.23, 1, 0.32, 1],
                delay: i * 0.08,
              }}
              viewport={{ once: true }}
              className="bg-white border-2 border-black rounded-xl p-5 md:p-6 shadow-brutal hover:shadow-[6px_6px_0px_0px_#FF4500] transition-all duration-300 group"
            >
              <div className="w-10 h-10 bg-brand-orange/10 rounded-xl flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all duration-300 mb-4">
                {feature.icon}
              </div>
              <h3 className="font-bold text-base md:text-lg mb-1">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
