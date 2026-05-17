"use client";

import { motion } from "framer-motion";

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 md:py-28 bg-brand-cream relative">
      <div className="absolute inset-0 bg-noise" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* CTA Block */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          viewport={{ once: true }}
          className="bg-brand-orange rounded-2xl p-8 md:p-12 text-center relative overflow-hidden mb-12"
        >
          {/* Pattern overlay */}
          <div className="absolute inset-0 bg-grid opacity-10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase">
              Ready to Hit the{" "}
              <span className="text-black">Road</span>?
            </h2>
            <p className="text-white/80 mt-3 text-sm md:text-base max-w-lg mx-auto">
              Book in under 5 minutes via WhatsApp. Free delivery, zero deposit,
              unlimited mileage.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <a
                href="https://wa.me/60126565477"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-white font-bold px-8 py-4 rounded-xl text-lg shadow-brutal hover:shadow-[8px_8px_0px_0px_#FFD700] transition-all duration-200 inline-flex items-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Book via WhatsApp
              </a>
              <a
                href="tel:+60126565477"
                className="text-black font-bold underline underline-offset-4 decoration-brand-orange decoration-2 hover:text-brand-orange transition-colors text-sm"
              >
                Or call +60 12-656 5477
              </a>
            </div>
          </div>
        </motion.div>

        {/* Branch Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {[
            {
              name: "Seremban HQ",
              address: "51, Jln S2 B18, Seremban 2, 70300 Seremban, Negeri Sembilan",
              hours: "24 hours · 7 days a week",
            },
            {
              name: "KLIA / KLIA2",
              address: "Meet & Greet at arrival hall · By appointment",
              hours: "24/7 · Advance booking required",
            },
          ].map((branch) => (
            <motion.div
              key={branch.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              viewport={{ once: true }}
              className="bg-white border-2 border-black rounded-xl p-6 shadow-brutal"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-orange/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-brand-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg">{branch.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{branch.address}</p>
                  <p className="text-brand-orange text-xs font-bold mt-2 uppercase tracking-wider">
                    {branch.hours}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
