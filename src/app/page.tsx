"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

// ── Video Frame Scrubber ──
function VideoScrubber({ src, scroll }: { src: string; scroll: number }) {
  const v = useRef<HTMLVideoElement>(null);
  const c = useRef<HTMLCanvasElement>(null);
  const dur = useRef(0);
  const [ok, setOk] = useState(false);

  const draw = useCallback(() => {
    const vid = v.current, can = c.current;
    if (!vid || !can || !vid.videoWidth) return;
    const ctx = can.getContext("2d");
    if (!ctx) return;
    can.width = can.clientWidth || window.innerWidth;
    can.height = can.clientHeight || window.innerHeight;
    const s = Math.max(can.width / vid.videoWidth, can.height / vid.videoHeight);
    const sw = vid.videoWidth * s, sh = vid.videoHeight * s;
    ctx.clearRect(0, 0, can.width, can.height);
    ctx.drawImage(vid, (can.width - sw) / 2, (can.height - sh) / 2, sw, sh);
  }, []);

  useEffect(() => {
    const el = v.current; if (!el) return;
    el.addEventListener("loadedmetadata", () => { dur.current = el.duration; el.currentTime = 0; setOk(true); });
    el.addEventListener("loadeddata", () => { el.currentTime = 0; setTimeout(draw, 200); });
  }, [draw]);

  useEffect(() => { if (ok && v.current) v.current.currentTime = scroll * dur.current; }, [scroll, ok]);
  useEffect(() => { window.addEventListener("resize", draw); return () => window.removeEventListener("resize", draw); }, [draw]);

  return (
    <div className="absolute inset-0 bg-[#111118]">
      <video ref={v} preload="auto" muted playsInline className="hidden" onSeeked={draw}>
        <source src={src} type="video/mp4" />
      </video>
      <canvas ref={c} className="w-full h-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#111118]/80 via-transparent to-[#111118]/20" />
      {!ok && <div className="absolute inset-0 flex items-center justify-center"><div className="w-8 h-8 border-2 border-white/20 border-t-[#FF4500] rounded-full animate-spin" /></div>}
    </div>
  );
}

// ── Hero ──
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const [s, setS] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", setS);
  const iO = useTransform(scrollYProgress, [0, 0.3, 0.55], [1, 0.5, 0]);
  const iY = useTransform(scrollYProgress, [0, 0.55], [0, -30]);

  return (
    <section ref={ref} className="relative h-[400vh] bg-[#111118]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <VideoScrubber src="/car-scroll.mp4" scroll={s} />

        <div className="absolute top-0 left-0 right-0 p-5 md:p-8 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#FF4500] flex items-center justify-center font-black text-white text-xs">JRV</div>
            <span className="text-white/50 text-[10px] font-semibold tracking-widest uppercase">Car Rental</span>
          </div>
        </div>

        <motion.div style={{ opacity: iO, y: iY, bottom: "33%" }} className="absolute left-0 right-0 px-5 md:px-8 z-10">
          <div className="max-w-lg">
            <p className="text-[#FF4500]/80 text-[10px] font-bold tracking-[0.25em] uppercase mb-2">Seremban · Since 2020</p>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-[0.92] mb-2 whitespace-pre-line">
              {`SEWA LAMA
LAGI MURAH`}
            </h1>
            <p className="text-white/40 text-xs max-w-xs leading-relaxed">50+ cars · Zero deposit · Free delivery Seremban · 24/7</p>
          </div>
        </motion.div>

        <motion.div style={{ opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]) }} className="absolute bottom-0 left-0 right-0 p-5 md:p-8 z-10">
          <div className="flex flex-col sm:flex-row gap-2.5 max-w-sm">
            <a href="https://wa.me/60126565477" target="_blank" rel="noopener noreferrer" className="bg-[#FF4500] text-white text-center font-bold px-7 py-3 rounded-xl text-sm hover:brightness-110 transition-all">Book via WhatsApp</a>
            <a href="#fleet" className="border border-white/15 text-white/70 text-center font-semibold px-7 py-3 rounded-xl text-sm hover:bg-white/5 transition-all">View Fleet</a>
          </div>
        </motion.div>

        <motion.div animate={{ opacity: [0.15, 0.5, 0.15] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute bottom-1/2 right-5 md:right-8 z-10 pointer-events-none">
          <span className="text-white/10 text-[9px] font-mono tracking-[0.3em]" style={{ writingMode: "vertical-rl" }}>SCROLL</span>
        </motion.div>
      </div>
    </section>
  );
}

// ── Stats ──
function Stats() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="bg-white border-b border-gray-100 py-6 md:py-8">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-3 gap-4">
        {[
          { v: "50+", l: "Cars in Fleet" },
          { v: "1K+", l: "Happy Clients" },
          { v: "4.9", l: "Google Rating" },
        ].map((x) => (
          <div key={x.l} className="text-center">
            <p className="text-2xl md:text-4xl font-black text-black">{x.v}</p>
            <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mt-0.5">{x.l}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Fleet ──
function Fleet() {
  const cars = [
    { n: "Perodua Axia G1", p: "RM 110", s: "5 seats · Hatchback" },
    { n: "Perodua Axia G2", p: "RM 120", s: "5 seats · Hatchback" },
    { n: "Proton Exora", p: "RM 170", s: "7 seats · MPV" },
    { n: "Proton X50", p: "RM 250", s: "5 seats · SUV" },
    { n: "Toyota Vios", p: "RM 170", s: "5 seats · Sedan" },
    { n: "Toyota Yaris", p: "RM 161", s: "5 seats · Hatchback" },
    { n: "Honda City RS", p: "RM 170", s: "5 seats · Hybrid" },
    { n: "Mitsubishi Xpander", p: "RM 350", s: "7 seats · MPV" },
    { n: "Toyota Alphard", p: "RM 700", s: "7 seats · Luxury" },
  ];

  return (
    <section id="fleet" className="py-16 md:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-[#FF4500] text-xs font-bold tracking-widest uppercase mb-2">OUR FLEET</p>
          <h2 className="text-3xl md:text-5xl font-black text-black uppercase">Choose Your Ride</h2>
          <p className="text-gray-400 text-sm mt-2 uppercase tracking-wider">Sewa Lama Lagi Murah</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 md:gap-4">
          {cars.map((car) => (
            <motion.div key={car.n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} viewport={{ once: true }}
              className="bg-white border border-gray-200 rounded-xl p-4 md:p-5 hover:border-[#FF4500]/30 hover:shadow-lg transition-all">
              <div className="w-full h-20 md:h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-3 flex items-center justify-center border border-gray-100">
                <svg className="w-8 h-8 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M19 17h2a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.5l-1.5-2H8L6.5 7H3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
                  <circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" />
                </svg>
              </div>
              <h3 className="font-bold text-black text-sm md:text-base">{car.n}</h3>
              <p className="text-gray-400 text-[10px] md:text-xs mt-0.5">{car.s}</p>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                <span className="text-black font-black text-base md:text-lg">{car.p}<span className="text-gray-300 text-[9px] font-medium">/day</span></span>
                <a href="https://wa.me/60126565477" target="_blank" rel="noopener noreferrer" className="text-[#FF4500] hover:text-black text-[10px] font-bold uppercase tracking-wider transition-colors">Book</a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Features ──
function Features() {
  const items = [
    { t: "Zero Deposit", d: "No security deposit needed for most bookings — rare in the industry." },
    { t: "Free Delivery", d: "Complimentary delivery & pickup within Seremban service area." },
    { t: "Unlimited KM", d: "No distance limits. Drive as far as you want." },
    { t: "24/7 Service", d: "Round-the-clock support and roadside assistance." },
    { t: "Latest Models", d: "2024-2026 facelift fleet, well-maintained and clean." },
    { t: "KLIA Service", d: "Meet & greet at KLIA/KLIA2 terminals by appointment." },
    { t: "Best Rates", d: "From RM 110/day with transparent pricing — no hidden fees." },
    { t: "Replacement", d: "Breakdown? We'll swap your vehicle. No questions asked." },
  ];

  return (
    <section className="py-16 md:py-20 bg-[#FFF8F0] border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-[#FF4500] text-xs font-bold tracking-widest uppercase mb-2">WHY US</p>
          <h2 className="text-3xl md:text-5xl font-black text-black uppercase">Why Choose JRV?</h2>
          <p className="text-gray-400 text-sm mt-2">We started with 3 cars. Today we run 50+.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-4">
          {items.map((f) => (
            <motion.div key={f.t} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} viewport={{ once: true }}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#FF4500]/20 hover:shadow-md transition-all">
              <h3 className="font-bold text-black text-sm">{f.t}</h3>
              <p className="text-gray-500 text-[11px] mt-1 leading-relaxed">{f.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FAQ ──
function FAQ() {
  return (
    <section className="py-16 md:py-20 bg-white border-t border-gray-100">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-[#FF4500] text-xs font-bold tracking-widest uppercase mb-2">FAQ</p>
          <h2 className="text-3xl md:text-5xl font-black text-black uppercase">Got Questions?</h2>
        </div>
        <div className="space-y-2">
          {[
            { q: "What documents do I need?", a: "Valid driver's license, IC (Malaysians) or Passport (foreigners), and recent utility bill for address verification." },
            { q: "How much deposit do I pay?", a: "Zero deposit for most bookings. This is rarely offered in the industry — we trust our customers." },
            { q: "Is there a mileage limit?", a: "No. All rentals come with unlimited mileage at no extra charge." },
            { q: "What if the car breaks down?", a: "We provide 24/7 roadside assistance and will arrange a replacement vehicle if needed." },
          ].map((f, i) => (
            <details key={i} className="group border border-gray-200 rounded-xl overflow-hidden bg-white">
              <summary className="px-4 md:px-5 py-3.5 cursor-pointer text-black font-semibold text-sm flex items-center justify-between list-none">
                {f.q}
                <span className="text-[#FF4500] group-open:rotate-180 transition-transform text-xs">▾</span>
              </summary>
              <div className="px-4 md:px-5 pb-3.5 text-gray-500 text-xs leading-relaxed border-t border-gray-100 pt-2.5">{f.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA ──
function CTA() {
  return (
    <section className="bg-[#FF4500] py-14 md:py-16">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-black text-white uppercase">Ready to Drive?</h2>
        <p className="text-white/70 text-sm mt-2 max-w-md mx-auto">Book in under 5 minutes via WhatsApp. Free delivery, zero deposit, unlimited mileage.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-7">
          <a href="https://wa.me/60126565477" target="_blank" rel="noopener noreferrer"
            className="bg-black text-white font-bold px-8 py-3.5 rounded-xl text-sm inline-flex items-center gap-2 hover:shadow-lg transition-all">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.051 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.82 11.82 0 0 0 12.051 0"/></svg>
            Book via WhatsApp
          </a>
          <a href="tel:+60126565477" className="text-white font-semibold text-sm underline underline-offset-4 decoration-white/30 hover:decoration-white transition-all">Or call +60 12-656 5477</a>
        </div>
        <div className="mt-6 text-white/60 text-[11px]">51, Jln S2 B18, Seremban 2 · 24 hours · 7 days</div>
      </div>
    </section>
  );
}

// ── Footer ──
function Footer() {
  return (
    <footer className="bg-[#111118] text-white/40 py-8 text-center text-[11px]">
      <p>© 2026 JRV Rental Services. All rights reserved.</p>
      <p className="mt-1">Powered by <a href="https://jrvsystems.app" className="text-[#FF4500] hover:underline">JRV Systems</a></p>
    </footer>
  );
}

// ── Nav ──
function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#FF4500] flex items-center justify-center font-black text-white text-xs">JRV</div>
          <span className="font-bold text-sm hidden sm:block">JRV Car Rental</span>
        </a>
        <div className="flex items-center gap-4 md:gap-6 text-xs font-semibold uppercase tracking-wider">
          <a href="#fleet" className="text-gray-600 hover:text-black transition-colors">Fleet</a>
          <a href="#why-us" className="text-gray-600 hover:text-black transition-colors hidden md:block">Why Us</a>
          <a href="#faq" className="text-gray-600 hover:text-black transition-colors hidden md:block">FAQ</a>
          <a href="https://wa.me/60126565477" target="_blank" rel="noopener noreferrer" className="bg-[#FF4500] text-white px-4 py-2 rounded-lg font-bold hover:brightness-110 transition-all">Book Now</a>
        </div>
      </div>
    </nav>
  );
}

export default function Home() {
  return (
    <main>
      <Nav />
      <div className="h-14 md:h-16" /> {/* nav spacer */}
      <Hero />
      <Stats />
      <Fleet />
      <Features />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
