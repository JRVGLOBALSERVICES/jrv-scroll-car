"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What documents do I need to rent a car?",
    a: "Valid driver's license (Malaysian or International), Identity Card (IC) for Malaysians, or Passport for foreign customers, and a recent utility bill for address verification.",
  },
  {
    q: "How much deposit do I need to pay?",
    a: "Zero deposit for most bookings! This is rarely offered in the industry — we trust our customers. Some T&C apply.",
  },
  {
    q: "Is there a mileage limit?",
    a: "No. All rentals come with unlimited mileage at no extra charge. Drive as far as you need.",
  },
  {
    q: "What is the fuel policy?",
    a: "Same-to-same fuel policy. You receive the car at a certain fuel level — return it at the same level. Simple and fair.",
  },
  {
    q: "What areas do you deliver to?",
    a: "Free delivery within Seremban, Seremban 2, Seremban 3, Senawang, Sendayan, Nilai, Port Dickson, KLIA/KLIA2, Mantin, Ampangan, Bandar Ainsdale, Bandar Enstek, and Labu.",
  },
  {
    q: "What if the car breaks down?",
    a: "We provide 24/7 roadside assistance. Contact us immediately and we'll arrange a replacement vehicle if needed — no questions asked.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 md:py-28 bg-brand-dark relative">
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="relative z-10 max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block bg-brand-orange text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 rotate-1">
            FAQ
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase">
            Got <span className="text-brand-orange">Questions</span>?
          </h2>
          <p className="text-gray-400 mt-3 text-sm">
            Everything you need to know before renting.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                ease: [0.23, 1, 0.32, 1],
                delay: i * 0.08,
              }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-5 md:px-6 py-4 text-left"
              >
                <span className="font-bold text-sm md:text-base text-white pr-4">
                  {faq.q}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-4 h-4 text-brand-orange" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 md:px-6 pb-4 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-3">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
