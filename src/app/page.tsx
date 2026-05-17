"use client";

import { useRef, useState, useCallback, useEffect } from "react";

const TOTAL_FRAMES = 61;
const frameUrl = (i: number) => `/frames/frame_${String(i + 1).padStart(4, "0")}.jpg`;

function FrameScrubber({ onScrub }: { onScrub: (p: number) => void }) {
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
      img.src = frameUrl(i); arr.push(img);
    }
    return () => arr.forEach(i => { i.src = ""; });
  }, []);

  const draw = useCallback((fi: number) => {
    const can = cRef.current, img = imgs.current[fi];
    if (!can || !img || !img.complete || !img.naturalWidth) return;
    const ctx = can.getContext("2d", { willReadFrequently: true }); if (!ctx) return;
    const cw = window.innerWidth, ch = window.innerHeight;
    can.width = cw; can.height = ch; can.style.width = cw + "px"; can.style.height = ch + "px";
    const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - img.naturalWidth * s) / 2, ch - img.naturalHeight * s, img.naturalWidth * s, img.naturalHeight * s);
  }, []);

  useEffect(() => {
    if (!ready) return;
    let cleanup: (() => void) | undefined, retry: any;
    const attach = () => {
      const lenis = (window as any).__lenis;
      if (!lenis) { retry = setTimeout(attach, 300); return; }
      const onScroll = () => {
        const scrolled = window.scrollY;
        const p = Math.min(1, scrolled / window.innerHeight);
        const fi = Math.min(TOTAL_FRAMES - 1, Math.floor(p * TOTAL_FRAMES));
        if (fi !== cur.current) { cur.current = fi; draw(fi); }
        onScrub(p);
      };
      lenis.on("scroll", onScroll); onScroll();
      cleanup = () => lenis.off("scroll", onScroll);
    };
    attach();
    return () => { clearTimeout(retry); if (cleanup) cleanup(); };
  }, [ready, draw, onScrub]);

  return (
    <div className="absolute inset-0 bg-[#02071B]">
      <canvas ref={cRef} className="block" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#02071B]">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md border-b border-gray-200" : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#F15828] rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-xs">JRV</span>
          </div>
          <span className={`text-xs font-semibold tracking-wider uppercase transition-colors ${scrolled ? "text-gray-700" : "text-white/70"}`}>Car Rental</span>
        </a>
        <div className="flex items-center gap-6">
          <a href="#fleet" className={`text-xs font-semibold uppercase tracking-wider transition-colors ${scrolled ? "text-gray-600 hover:text-black" : "text-white/60 hover:text-white"}`}>Fleet</a>
          <a href="#why-us" className={`text-xs font-semibold uppercase tracking-wider transition-colors hidden md:block ${scrolled ? "text-gray-600 hover:text-black" : "text-white/60 hover:text-white"}`}>Why Us</a>
          <a href="https://wa.me/60126565477" target="_blank" className="bg-[#F15828] text-white text-xs font-bold px-4 py-2 rounded-lg hover:brightness-110 transition-all">Book Now</a>
        </div>
      </div>
    </nav>
  );
}

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [vp, setVp] = useState(0);
  useEffect(() => { setVp(window.innerHeight); }, []);

  const ended = vp > 0 && scrollY >= vp;
  const handleScrub = useCallback((p: number) => {
    setScrollY(p * (typeof window !== "undefined" ? window.innerHeight : 720));
  }, []);

  const cars = [
    { n: "Perodua Axia G1", p: "RM 110", c: "Hatchback" },
    { n: "Perodua Axia G2", p: "RM 120", c: "Hatchback" },
    { n: "Proton Exora", p: "RM 170", c: "MPV" },
    { n: "Proton X50", p: "RM 250", c: "SUV" },
    { n: "Toyota Vios", p: "RM 170", c: "Sedan" },
    { n: "Toyota Yaris", p: "RM 161", c: "Hatchback" },
    { n: "Honda City RS", p: "RM 170", c: "Hybrid" },
    { n: "Mitsubishi Xpander", p: "RM 350", c: "MPV" },
    { n: "Toyota Alphard", p: "RM 700", c: "Luxury" },
  ];

  const features = [
    { t: "Best Local Rates", d: "Competitive pricing for all vehicles." },
    { t: "Well-Maintained Fleet", d: "Regularly serviced for your safety." },
    { t: "Easy Booking", d: "Rent in minutes via WhatsApp." },
    { t: "Free Delivery", d: "Doorstep delivery in Seremban." },
    { t: "Unlimited Mileage", d: "No extra charges on distance." },
    { t: "24-Hour Service", d: "Round-the-clock support." },
    { t: "KLIA Pickup", d: "Available at both terminals." },
    { t: "Transparent Pricing", d: "No hidden fees, ever." },
  ];

  const faqs = [
    { q: "What documents do I need?", a: "Valid license, IC/passport, and recent utility bill." },
    { q: "How much deposit?", a: "Zero deposit for most bookings." },
    { q: "Is there a mileage limit?", a: "No. Unlimited mileage on all rentals." },
    { q: "What if the car breaks down?", a: "24/7 roadside assistance + replacement." },
  ];

  return (
    <main>
      <Nav />
      <div style={{ height: 56 }} />
      <div style={{ height: "calc(100vh - 56px)" }} />

      {/* HERO */}
      <div style={{
        position: ended ? "relative" : "fixed",
        top: 0, left: 0, right: 0,
        height: "100vh",
        zIndex: ended ? 0 : 10,
        background: "#02071B",
      }}>
        <FrameScrubber onScrub={handleScrub} />

        <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-10 pointer-events-none" style={{ zIndex: 5 }}>
          <div>
            <p className="text-[#F15828] text-[10px] font-bold tracking-[0.3em] uppercase">Chapter 01</p>
            <p className="text-white/30 text-[10px] font-medium tracking-wider uppercase mt-1">The Drive</p>
          </div>

          <div className="text-center">
            <p className="text-white/20 text-[10px] font-mono tracking-widest mb-4">↓ SCROLL</p>
            <h1 className="text-4xl md:text-7xl font-black text-white leading-[0.9] mb-4">
              Rent The Ride.<br />
              <span className="text-[#F15828]">Own The Road.</span>
            </h1>
            <p className="text-white/40 text-sm max-w-sm mx-auto">Premium cars · Honest prices · Free delivery Seremban</p>
          </div>

          <div className="pointer-events-auto">
            <a href="https://wa.me/60126565477" target="_blank" className="inline-block bg-[#F15828] text-white font-bold px-6 py-3 rounded-lg text-sm hover:brightness-110 transition-all">
              Book on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ opacity: ended ? 1 : 0, transition: "opacity 0.3s" }}>
        {/* Stats */}
        <div className="py-8 md:py-10 border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-5 grid grid-cols-4 gap-4">
            {[{ v: "50+", l: "Cars" },{ v: "1K+", l: "Clients" },{ v: "4.9", l: "Rating" },{ v: "24/7", l: "Service" }].map(x => (
              <div key={x.l} className="text-center">
                <p className="text-2xl md:text-4xl font-black text-black">{x.v}</p>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-1">{x.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Marquee */}
        <div className="py-3 border-b border-gray-100 overflow-hidden bg-white">
          <div className="marquee-track">
            {Array.from({ length: 6 }).flatMap(() => [
              "SEWA LAMA LAGI MURAH", "FREE DELIVERY", "ZERO DEPOSIT", "UNLIMITED MILEAGE"
            ]).map((t, i) => (
              <span key={i} className="text-[10px] md:text-xs font-bold text-gray-600 uppercase tracking-[0.2em] mx-5">
                {t} <span className="text-[#F15828]">★</span>
              </span>
            ))}
          </div>
        </div>

        {/* Fleet */}
        <section id="fleet" className="py-14 md:py-20 bg-white">
          <div className="max-w-5xl mx-auto px-5">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-[#F15828] text-[10px] font-bold tracking-[0.3em] uppercase">Chapter 02</p>
                <h2 className="text-2xl md:text-4xl font-black text-black mt-1">Choose Your Ride</h2>
                <p className="text-gray-400 text-xs mt-1">━━ 9 picks from our fleet</p>
              </div>
              <a href="https://jrvservices.co/cars" className="text-[#F15828] text-[10px] font-bold uppercase tracking-wider hover:underline hidden sm:block">See All →</a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {cars.map(car => (
                <div key={car.n} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
                  <div className="h-24 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border-b border-gray-100 relative">
                    <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                      <svg className="w-6 h-6 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M19 17h2a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.5l-1.5-2H8L6.5 7H3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
                      </svg>
                    </div>
                  </div>
                  <div className="p-3.5">
                    <h3 className="font-bold text-black text-sm">{car.n}</h3>
                    <p className="text-gray-400 text-[10px] mt-0.5">{car.c}</p>
                    <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-gray-100">
                      <span className="text-black font-black text-base">{car.p}<span className="text-gray-300 text-[9px] font-medium">/day</span></span>
                      <a href="https://wa.me/60126565477" target="_blank" className="text-[#F15828] text-[10px] font-bold uppercase tracking-wider group-hover:underline">Book</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="why-us" className="py-14 md:py-20 bg-gray-50">
          <div className="max-w-5xl mx-auto px-5">
            <p className="text-[#F15828] text-[10px] font-bold tracking-[0.3em] uppercase">Chapter 03</p>
            <h2 className="text-2xl md:text-4xl font-black text-black mt-1 mb-2">Why Choose JRV?</h2>
            <p className="text-gray-400 text-xs mb-8">Local since 2020 · 50+ cars · Family-owned</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {features.map(f => (
                <div key={f.t} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#F15828]/20 hover:shadow-sm transition-all">
                  <h3 className="font-bold text-black text-sm">{f.t}</h3>
                  <p className="text-gray-500 text-[11px] mt-1 leading-relaxed">{f.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-14 md:py-20 bg-white">
          <div className="max-w-3xl mx-auto px-5">
            <div className="text-center mb-8">
              <p className="text-[#F15828] text-[10px] font-bold tracking-[0.3em] uppercase">Chapter 04</p>
              <h2 className="text-2xl md:text-4xl font-black text-black mt-1">Got Questions?</h2>
            </div>
            <div className="space-y-2">
              {faqs.map((f, i) => (
                <details key={i} className="group border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <summary className="px-5 py-3.5 cursor-pointer text-black font-semibold text-sm flex items-center justify-between list-none hover:bg-gray-50 transition-colors">
                    <span>{f.q}</span>
                    <span className="text-[#F15828] group-open:rotate-180 transition-transform text-xs shrink-0">▾</span>
                  </summary>
                  <div className="px-5 pb-3.5 text-gray-500 text-xs leading-relaxed border-t border-gray-100 pt-2.5">{f.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#02071B] py-16">
          <div className="max-w-3xl mx-auto px-5 text-center">
            <p className="text-white/30 text-[10px] font-bold tracking-[0.3em] uppercase mb-2">Last Step</p>
            <h2 className="text-3xl md:text-5xl font-black text-white">Ready To Hit<br /><span className="text-[#F15828]">The Road?</span></h2>
            <p className="text-white/50 text-sm mt-3 max-w-md mx-auto">Reply in minutes. Zero paperwork. Be on the road within the hour.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
              <a href="https://wa.me/60126565477" target="_blank" className="bg-[#F15828] text-white font-bold px-8 py-3.5 rounded-xl text-sm hover:brightness-110 transition-all">Book via WhatsApp</a>
              <a href="tel:+60126565477" className="text-white/50 font-semibold text-sm underline underline-offset-4 decoration-white/20 hover:decoration-white transition-all">Call +60 12-656 5477</a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#02071B] border-t border-white/5 text-white/40 py-10 text-center text-[11px]">
          <div className="max-w-5xl mx-auto px-5">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#F15828] rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-xs">JRV</span>
              </div>
              <span className="text-white font-bold text-sm">JRV Car Rental</span>
            </div>
            <p className="text-white/30 text-xs mb-1">51, Jln S2 B18, Seremban 2, 70300 Seremban</p>
            <p className="text-white/20 text-xs mb-4">24 hours · 7 days · Free delivery</p>
            <div className="flex justify-center gap-5 mb-6">
              <a href="https://wa.me/60126565477" className="text-white/40 hover:text-[#F15828] text-xs transition-colors">WhatsApp</a>
              <a href="tel:+60126565477" className="text-white/40 hover:text-[#F15828] text-xs transition-colors">Call</a>
              <a href="https://jrvservices.co" className="text-white/40 hover:text-[#F15828] text-xs transition-colors">Website</a>
            </div>
            <p>© 2026 JRV Rental Services.<br className="sm:hidden" /> All rights reserved.</p>
            <p className="mt-1">Powered by <a href="https://jrvsystems.app" className="text-[#F15828] hover:underline">JRV Systems</a></p>
          </div>
        </footer>
      </div>
    </main>
  );
}
