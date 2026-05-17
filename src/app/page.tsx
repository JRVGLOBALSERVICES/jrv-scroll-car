"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";

const TOTAL_FRAMES = 121;

function frameUrl(i: number): string {
  return `/frames/frame_${String(i + 1).padStart(4, "0")}.jpg`;
}

// ── Frame Scrubber ──
function FrameScrubber({ onProgress }: { onProgress: (p: number) => void }) {
  const cRef = useRef<HTMLCanvasElement>(null);
  const imgs = useRef<HTMLImageElement[]>([]);
  const [ready, setReady] = useState(false);
  const cur = useRef(-1);

  useEffect(() => {
    const arr: HTMLImageElement[] = [];
    let loaded = 0;
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.onload = img.onerror = () => { loaded++; if (loaded === TOTAL_FRAMES) { imgs.current = arr; setReady(true); } };
      img.src = frameUrl(i);
      arr.push(img);
    }
    return () => arr.forEach(i => { i.src = ""; });
  }, []);

  const draw = useCallback((fi: number) => {
    const can = cRef.current, img = imgs.current[fi];
    if (!can || !img || !img.complete || !img.naturalWidth) return;
    const ctx = can.getContext("2d"); if (!ctx) return;
    const cw = window.innerWidth, ch = window.innerHeight;
    can.style.width = cw + "px"; can.style.height = ch + "px";
    can.width = cw; can.height = ch;
    const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const sw = img.naturalWidth * s, sh = img.naturalHeight * s;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - sw) / 2, ch - sh, sw, sh);
  }, []);

  useEffect(() => {
    if (!ready) return;
    let cleanup: (() => void) | undefined, retry: any;

    const attach = () => {
      const lenis = (window as any).__lenis;
      if (!lenis) { retry = setTimeout(attach, 300); return; }

      const onScroll = () => {
        const scrolled = window.scrollY;
        const maxScroll = window.innerHeight;
        const p = Math.max(0, Math.min(1, scrolled / maxScroll));
        const fi = Math.min(TOTAL_FRAMES - 1, Math.floor(p * TOTAL_FRAMES));
        if (fi !== cur.current) { cur.current = fi; draw(fi); }
        onProgress(p);
      };

      lenis.on("scroll", onScroll);
      onScroll();
      cleanup = () => lenis.off("scroll", onScroll);
    };

    attach();
    return () => { clearTimeout(retry); if (cleanup) cleanup(); };
  }, [ready, draw, onProgress]);

  useEffect(() => {
    if (!ready) return;
    const fn = () => { if (cur.current >= 0) draw(cur.current); };
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, [ready, draw]);

  return (
    <div className="absolute inset-0 bg-[#111118]">
      <canvas ref={cRef} className="block" style={{ width: "100vw", height: "100vh" }} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#111118]/80 via-transparent to-[#111118]/20" />
      {!ready && <div className="absolute inset-0 flex items-center justify-center"><div className="w-8 h-8 border-2 border-white/20 border-t-[#FF4500] rounded-full animate-spin" /></div>}
    </div>
  );
}

// ── Fixed Video Hero ──
function VideoHero() {
  const [progress, setProgress] = useState(0);

  return (
    <>
      {/* Fixed video — always fills viewport during scroll */}
      <div className="fixed top-0 left-0 right-0 h-screen z-10" style={{ opacity: Math.min(1, (1 - progress) * 5) }}>
        <FrameScrubber onProgress={setProgress} />

        <div className="absolute top-0 left-0 right-0 p-5 md:p-8 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#FF4500] flex items-center justify-center font-black text-white text-xs">JRV</div>
            <span className="text-white/50 text-[10px] font-semibold tracking-widest uppercase">Car Rental</span>
          </div>
        </div>

        <motion.div animate={{ opacity: Math.max(0, 1 - progress * 3), y: -progress * 40 }}
          className="absolute left-0 right-0 px-5 md:px-8 z-10" style={{ bottom: "33%" }}>
          <div className="max-w-lg">
            <p className="text-[#FF4500]/80 text-[10px] font-bold tracking-[0.25em] uppercase mb-2">Seremban · Since 2020</p>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-[0.92] mb-2 whitespace-pre-line">{`SEWA LAMA\nLAGI MURAH`}</h1>
            <p className="text-white/40 text-xs max-w-xs leading-relaxed">50+ cars · Zero deposit · Free delivery Seremban · 24/7</p>
          </div>
        </motion.div>

        <motion.div animate={{ opacity: Math.max(0, 1 - progress * 8) }}
          className="absolute bottom-0 left-0 right-0 p-5 md:p-8 z-10">
          <div className="flex flex-col sm:flex-row gap-2.5 max-w-sm">
            <a href="https://wa.me/60126565477" target="_blank" rel="noopener noreferrer" className="bg-[#FF4500] text-white text-center font-bold px-7 py-3 rounded-xl text-sm hover:brightness-110 transition-all">Book via WhatsApp</a>
            <a href="#content" className="border border-white/15 text-white/70 text-center font-semibold px-7 py-3 rounded-xl text-sm hover:bg-white/5 transition-all">Explore</a>
          </div>
        </motion.div>
      </div>

      {/* Spacer to prevent content overlap */}
      <div className="h-screen" />
    </>
  );
}

// ── Sections (below hero) ──
function Stats() {
  return (
    <motion.div id="content" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }} viewport={{ once: true }} className="bg-white border-b border-gray-100 py-6 md:py-8">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-3 gap-4">
        {[{ v: "50+", l: "Cars in Fleet" },{ v: "1K+", l: "Happy Clients" },{ v: "4.9", l: "Google Rating" }].map(x => (
          <div key={x.l} className="text-center"><p className="text-2xl md:text-4xl font-black text-black">{x.v}</p><p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mt-0.5">{x.l}</p></div>
        ))}
      </div>
    </motion.div>
  );
}

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
        <div className="text-center mb-10"><p className="text-[#FF4500] text-xs font-bold tracking-widest uppercase mb-2">OUR FLEET</p><h2 className="text-3xl md:text-5xl font-black text-black uppercase">Choose Your Ride</h2><p className="text-gray-400 text-sm mt-2 uppercase tracking-wider">Sewa Lama Lagi Murah</p></div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 md:gap-4">
          {cars.map(car => (
            <motion.div key={car.n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }} viewport={{ once: true }}
              className="bg-white border border-gray-200 rounded-xl p-4 md:p-5 hover:border-[#FF4500]/30 hover:shadow-lg transition-all">
              <div className="w-full h-20 md:h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-3 flex items-center justify-center border border-gray-100">
                <svg className="w-8 h-8 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 17h2a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.5l-1.5-2H8L6.5 7H3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /></svg>
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

function Features() {
  const items = [
    { t: "Zero Deposit", d: "No security deposit needed." },
    { t: "Free Delivery", d: "Complimentary within Seremban area." },
    { t: "Unlimited KM", d: "No distance limits on any rental." },
    { t: "24/7 Service", d: "Round-the-clock roadside assistance." },
    { t: "Latest Models", d: "2024-2026 well-maintained fleet." },
    { t: "KLIA Service", d: "Meet & greet at airport terminals." },
    { t: "Best Rates", d: "From RM 110/day, transparent pricing." },
    { t: "Replacement", d: "Guaranteed if breakdown occurs." },
  ];
  return (
    <section id="why-us" className="py-16 md:py-20 bg-[#FFF8F0] border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10"><p className="text-[#FF4500] text-xs font-bold tracking-widest uppercase mb-2">WHY US</p><h2 className="text-3xl md:text-5xl font-black text-black uppercase">Why Choose JRV?</h2></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-4">
          {items.map(f => (
            <motion.div key={f.t} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }} viewport={{ once: true }}
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

function FAQ() {
  return (
    <section id="faq" className="py-16 md:py-20 bg-white border-t border-gray-100">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10"><p className="text-[#FF4500] text-xs font-bold tracking-widest uppercase mb-2">FAQ</p><h2 className="text-3xl md:text-5xl font-black text-black uppercase">Got Questions?</h2></div>
        <div className="space-y-2">
          {[
            { q: "What documents do I need?", a: "Valid driver's license, IC/passport, recent utility bill." },
            { q: "How much deposit?", a: "Zero deposit for most bookings. Rare in the industry." },
            { q: "Is there a mileage limit?", a: "No. Unlimited mileage on all rentals." },
            { q: "What if the car breaks down?", a: "24/7 assistance and replacement if needed." },
          ].map((f, i) => (
            <details key={i} className="group border border-gray-200 rounded-xl overflow-hidden bg-white">
              <summary className="px-4 md:px-5 py-3.5 cursor-pointer text-black font-semibold text-sm flex items-center justify-between list-none">{f.q}<span className="text-[#FF4500] group-open:rotate-180 transition-transform text-xs">▾</span></summary>
              <div className="px-4 md:px-5 pb-3.5 text-gray-500 text-xs leading-relaxed border-t border-gray-100 pt-2.5">{f.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="bg-[#FF4500] py-14 md:py-16">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-black text-white uppercase">Ready to Drive?</h2>
        <p className="text-white/70 text-sm mt-2 max-w-md mx-auto">Book in under 5 minutes via WhatsApp.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-7">
          <a href="https://wa.me/60126565477" target="_blank" rel="noopener noreferrer" className="bg-black text-white font-bold px-8 py-3.5 rounded-xl text-sm hover:shadow-lg transition-all">Book via WhatsApp</a>
          <a href="tel:+60126565477" className="text-white font-semibold text-sm underline underline-offset-4 decoration-white/30 hover:decoration-white transition-all">Or call +60 12-656 5477</a>
        </div>
        <div className="mt-6 text-white/60 text-[11px]">51, Jln S2 B18, Seremban 2 · 24 hours · 7 days</div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#111118] text-white/40 py-8 text-center text-[11px]">
      <p>© 2026 JRV Rental Services. All rights reserved.</p>
      <p className="mt-1">Powered by <a href="https://jrvsystems.app" className="text-[#FF4500] hover:underline">JRV Systems</a></p>
    </footer>
  );
}

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
      <div className="h-14 md:h-16" />
      <VideoHero />
      <Stats />
      <Fleet />
      <Features />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
