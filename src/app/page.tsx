"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

// ── Constants ──
const TOTAL = 61;
const fUrl = (i: number) => `/frames/frame_${String(i + 1).padStart(4, "0")}.jpg`;
const ease = [0.23, 1, 0.32, 1] as const;

// ── Video Frame Scrubber ──
function Scrubber({ onProg }: { onProg: (p: number) => void }) {
  const c = useRef<HTMLCanvasElement>(null);
  const imgs = useRef<HTMLImageElement[]>([]);
  const [ok, setOk] = useState(false);
  const cur = useRef(-1);

  useEffect(() => {
    const a: HTMLImageElement[] = [];
    let n = 0;
    for (let i = 0; i < TOTAL; i++) {
      const img = new Image();
      img.onload = img.onerror = () => { n++; if (n === TOTAL) { imgs.current = a; setOk(true); } };
      img.src = fUrl(i); a.push(img);
    }
    return () => a.forEach(i => { i.src = ""; });
  }, []);

  const draw = useCallback((fi: number) => {
    const ca = c.current, im = imgs.current[fi];
    if (!ca || !im || !im.complete || !im.naturalWidth) return;
    const ctx = ca.getContext("2d", { willReadFrequently: true }); if (!ctx) return;
    const w = window.innerWidth, h = window.innerHeight;
    ca.width = w; ca.height = h; ca.style.width = w + "px"; ca.style.height = h + "px";
    const s = Math.max(w / im.naturalWidth, h / im.naturalHeight);
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(im, (w - im.naturalWidth * s) / 2, h - im.naturalHeight * s, im.naturalWidth * s, im.naturalHeight * s);
  }, []);

  useEffect(() => {
    if (!ok) return;
    let cl: (() => void) | undefined, rt: any;
    const at = () => {
      const l = (window as any).__lenis;
      if (!l) { rt = setTimeout(at, 300); return; }
      const os = () => {
        const p = Math.min(1, window.scrollY / window.innerHeight);
        const fi = Math.min(TOTAL - 1, Math.floor(p * TOTAL));
        if (fi !== cur.current) { cur.current = fi; draw(fi); }
        onProg(p);
      };
      l.on("scroll", os); os();
      cl = () => l.off("scroll", os);
    };
    at();
    return () => { clearTimeout(rt); if (cl) cl(); };
  }, [ok, draw, onProg]);

  return (
    <div className="absolute inset-0 bg-black">
      <canvas ref={c} className="block" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
      {!ok && <div className="absolute inset-0 flex items-center justify-center bg-black"><div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>}
    </div>
  );
}

// ── Stagger variants ──
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

// ── Data ──
const cars = [
  { n: "Perodua Axia G1", p: "RM 110", s: "Hatchback · 5 seats" },
  { n: "Perodua Axia G2", p: "RM 120", s: "Hatchback · 5 seats" },
  { n: "Proton Exora", p: "RM 170", s: "MPV · 7 seats" },
  { n: "Proton X50", p: "RM 250", s: "SUV · 5 seats" },
  { n: "Toyota Vios", p: "RM 170", s: "Sedan · 5 seats" },
  { n: "Toyota Yaris", p: "RM 161", s: "Hatchback · 5 seats" },
  { n: "Honda City RS", p: "RM 170", s: "Hybrid · 5 seats" },
  { n: "Mitsubishi Xpander", p: "RM 350", s: "MPV · 7 seats" },
  { n: "Toyota Alphard", p: "RM 700", s: "Luxury · 7 seats" },
];

const feats = [
  { t: "Zero Deposit", d: "No security deposit needed for most bookings." },
  { t: "Free Delivery", d: "Complimentary within Seremban area." },
  { t: "Unlimited KM", d: "No distance limits on any rental." },
  { t: "24/7 Service", d: "Round-the-clock roadside assistance." },
  { t: "Latest Models", d: "2024-2026 well-maintained fleet." },
  { t: "KLIA Pickup", d: "Meet & greet at both terminals." },
  { t: "Best Rates", d: "From RM 110/day, transparent pricing." },
  { t: "Replacement", d: "Guaranteed if breakdown occurs." },
];

const faqs = [
  { q: "What documents do I need?", a: "Valid license, IC/passport, and recent utility bill." },
  { q: "How much deposit do I pay?", a: "Zero deposit for most bookings. Rare in the industry." },
  { q: "Is there a mileage limit?", a: "No. Unlimited on all rentals." },
  { q: "What if the car breaks down?", a: "24/7 roadside assistance. Replacement guaranteed." },
];

// ── Section wrapper with fade-up on view ──
function Section({ id, label, title, subtitle, children, bg = "bg-white", className = "" }: {
  id?: string; label?: string; title: string; subtitle?: string; children: React.ReactNode; bg?: string; className?: string;
}) {
  return (
    <section id={id} className={`py-16 md:py-22 ${bg} ${className}`}>
      <div className="max-w-5xl mx-auto px-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease }}
          className="mb-10 text-center"
        >
          {label && <p className="text-[#FF4500] text-[10px] font-bold tracking-[0.25em] uppercase mb-2">{label}</p>}
          <h2 className="text-3xl md:text-5xl font-black text-black leading-[0.95]">{title}</h2>
          {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
        </motion.div>
        {children}
      </div>
    </section>
  );
}

export default function Home() {
  const [sy, setSy] = useState(0);
  const [vp, setVp] = useState(0);
  useEffect(() => { setVp(window.innerHeight); }, []);

  const ended = vp > 0 && sy >= vp;
  const p = vp > 0 ? Math.min(1, sy / vp) : 0;
  const hp = useCallback((n: number) => setSy(n * (window.innerHeight || 720)), []);

  return (
    <main>
      {/* NAV — fades with scroll */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: Math.max(0, 1 - p * 3) }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#FF4500] flex items-center justify-center font-black text-white text-xs">JRV</div>
            <span className="text-white/50 text-[10px] tracking-widest uppercase hidden sm:block">Car Rental</span>
          </div>
          <a href="https://wa.me/60126565477" target="_blank" className="bg-white/10 backdrop-blur text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition-all">
            Book Now
          </a>
        </div>
      </motion.nav>

      <div style={{ height: 56 }} />
      <div style={{ height: "calc(100vh - 56px)" }} />

      {/* HERO — video + intro text */}
      <div style={{
        position: ended ? "relative" : "fixed",
        top: 0, left: 0, right: 0, height: "100vh",
        zIndex: ended ? 0 : 10,
        background: "#000",
      }}>
        <Scrubber onProg={hp} />

        {/* Animated intro overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5" style={{ zIndex: 5 }}>
          <motion.p
            style={{ opacity: Math.min(1, Math.max(0, (p - 0.1) * 10)) }}
            className="text-[#FF4500] text-xs font-bold tracking-[0.3em] uppercase mb-4"
          >
            Sewa Lama Lagi Murah
          </motion.p>

          <motion.h1
            style={{ opacity: Math.min(1, Math.max(0, (p - 0.2) * 6)) }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.88] mb-4"
          >
            Rent The<br />
            <span className="text-[#FF4500]">Ride.</span><br />
            Own The<br />
            <span className="text-[#FF4500]">Road.</span>
          </motion.h1>

          <motion.p
            style={{ opacity: Math.min(1, Math.max(0, (p - 0.35) * 7)) }}
            className="text-white/40 text-sm max-w-sm"
          >
            Premium cars · Honest prices · Free delivery Seremban
          </motion.p>

          <motion.div
            style={{ opacity: Math.min(1, Math.max(0, (p - 0.5) * 6)) }}
            className="flex gap-8 mt-8"
          >
            {[{ v: "50+", l: "Cars" }, { v: "1K+", l: "Clients" }, { v: "4.9", l: "Rating" }].map(x => (
              <div key={x.l} className="text-center">
                <p className="text-2xl font-black text-white">{x.v}</p>
                <p className="text-[9px] text-white/40 font-semibold uppercase tracking-wider mt-0.5">{x.l}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          style={{ opacity: Math.max(0, 1 - p * 4) }}
          className="absolute bottom-0 left-0 right-0 p-5 md:p-8"
        >
          <a href="https://wa.me/60126565477" target="_blank" className="inline-block bg-[#FF4500] text-white font-bold px-6 py-3 rounded-lg text-sm hover:brightness-110 transition-all">
            Book on WhatsApp
          </a>
        </motion.div>
      </div>

      {/* ── CONTENT ── */}
      <AnimatePresence>
        {ended && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* Marquee */}
            <div className="py-2.5 border-b border-gray-100 overflow-hidden bg-white">
              <div className="marquee-track">
                {Array.from({ length: 6 }).flatMap(() => [
                  "SEWA LAMA LAGI MURAH", "FREE DELIVERY", "ZERO DEPOSIT", "UNLIMITED MILEAGE"
                ]).map((t, i) => (
                  <span key={i} className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mx-5">
                    {t} <span className="text-[#FF4500]">✦</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Fleet */}
            <Section id="fleet" title="Choose Your Ride" subtitle="50+ cars · 12 models · From RM 110/day">
              <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}
                className="grid grid-cols-2 md:grid-cols-3 gap-3"
              >
                {cars.map(car => (
                  <motion.div key={car.n} variants={item}>
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
                      <div className="h-24 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center border-b border-gray-100">
                        <svg className="w-8 h-8 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M19 17h2a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.5l-1.5-2H8L6.5 7H3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
                        </svg>
                      </div>
                      <div className="p-3.5">
                        <h3 className="font-bold text-black text-sm">{car.n}</h3>
                        <p className="text-gray-400 text-[10px] mt-0.5">{car.s}</p>
                        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-100">
                          <span className="text-black font-black text-base">{car.p}<span className="text-gray-300 text-[9px]">/day</span></span>
                          <a href="https://wa.me/60126565477" target="_blank" className="text-[#FF4500] text-[10px] font-bold uppercase tracking-wider group-hover:underline">Book</a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </Section>

            {/* Features */}
            <Section id="why-us" bg="bg-[#FFF8F0]" label="Why JRV" title="Built Different" subtitle="Local since 2020 · 50+ cars · Family-owned">
              <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}
                className="grid grid-cols-2 md:grid-cols-4 gap-3"
              >
                {feats.map(f => (
                  <motion.div key={f.t} variants={item}>
                    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#FF4500]/20 hover:shadow-sm transition-all h-full">
                      <h3 className="font-bold text-black text-sm">{f.t}</h3>
                      <p className="text-gray-500 text-[11px] mt-1.5 leading-relaxed">{f.d}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </Section>

            {/* FAQ */}
            <Section title="Got Questions?" bg="bg-white">
              <div className="max-w-3xl mx-auto">
                <div className="space-y-2">
                  {faqs.map((f, i) => (
                    <details key={i} className="group border border-gray-200 rounded-xl overflow-hidden">
                      <summary className="px-5 py-3.5 cursor-pointer text-black font-semibold text-sm flex items-center justify-between list-none hover:bg-gray-50 transition-colors">
                        <span>{f.q}</span>
                        <span className="text-[#FF4500] group-open:rotate-180 transition-transform text-xs shrink-0">▾</span>
                      </summary>
                      <div className="px-5 pb-3.5 text-gray-500 text-xs leading-relaxed border-t border-gray-100 pt-2.5">{f.a}</div>
                    </details>
                  ))}
                </div>
              </div>
            </Section>

            {/* CTA */}
            <section className="bg-black py-16">
              <div className="max-w-3xl mx-auto px-5 text-center">
                <motion.h2
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease }}
                  className="text-3xl md:text-5xl font-black text-white"
                >
                  Ready To Hit<br /><span className="text-[#FF4500]">The Road?</span>
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease, delay: 0.15 }}
                  className="text-white/50 text-sm mt-3 max-w-md mx-auto"
                >
                  Reply in minutes. Zero paperwork. Be on the road within the hour.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease, delay: 0.3 }}
                  className="flex flex-col sm:flex-row justify-center gap-3 mt-8"
                >
                  <a href="https://wa.me/60126565477" target="_blank" className="bg-[#FF4500] text-white font-bold px-8 py-3.5 rounded-xl text-sm hover:brightness-110 transition-all">Book via WhatsApp</a>
                  <a href="tel:+60126565477" className="text-white/50 font-semibold text-sm underline underline-offset-4 decoration-white/20 hover:decoration-white transition-all">Call +60 12-656 5477</a>
                </motion.div>
              </div>
            </section>

            {/* Footer */}
            <footer className="bg-black text-white/40 py-10 text-center text-[11px] border-t border-white/5">
              <div className="max-w-5xl mx-auto px-5">
                <p>51, Jln S2 B18, Seremban 2 · 24 hours · 7 days</p>
                <div className="flex justify-center gap-5 my-4">
                  {[
                    { l: "WhatsApp", h: "https://wa.me/60126565477" },
                    { l: "Call", h: "tel:+60126565477" },
                    { l: "Website", h: "https://jrvservices.co" },
                  ].map(s => (
                    <a key={s.l} href={s.h} className="text-white/40 hover:text-[#FF4500] text-xs transition-colors">{s.l}</a>
                  ))}
                </div>
                <p>© 2026 JRV Rental Services. Powered by <a href="https://jrvsystems.app" className="text-[#FF4500] hover:underline">JRV Systems</a></p>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
