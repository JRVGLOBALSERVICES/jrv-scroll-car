#!/usr/bin/env node
// Build the complete jrv-scroll-car site matching jrvservices.co design
const fs = require('fs');
const path = require('path');

const page = `"use client";

import { useRef, useState, useCallback, useEffect } from "react";

const TOTAL_FRAMES = 61;
const frameUrl = (i: number) => \`/frames/frame_\${String(i + 1).padStart(4, "0")}.jpg\`;

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
        const p = Math.min(1, window.scrollY / window.innerHeight);
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
    <div className="absolute inset-0 bg-black">
      <canvas ref={cRef} className="block" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
      {!ready && <div className="absolute inset-0 flex items-center justify-center"><div className="w-8 h-8 border-2 border-white/20 border-t-[#FF4500] rounded-full animate-spin" /></div>}
    </div>
  );
}

function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#FF4500] flex items-center justify-center font-black text-white text-xs rounded">JRV</div>
          <span className="text-white text-xs font-semibold tracking-wider uppercase hidden sm:block">Car Rental · Sewa Lama Lagi Murah</span>
        </a>
        <div className="flex items-center gap-6 text-xs font-semibold uppercase tracking-wider">
          <a href="#fleet" className="text-white/60 hover:text-white transition-colors">Cars</a>
          <a href="#why-us" className="text-white/60 hover:text-white transition-colors hidden md:block">Why Us</a>
          <a href="https://wa.me/60126565477" target="_blank" className="bg-[#FF4500] text-white px-4 py-2 rounded-lg font-bold text-xs hover:brightness-110 transition-all">Book Now</a>
        </div>
      </div>
    </nav>
  );
}

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [vp, setVp] = useState(0);
  useEffect(() => { setVp(window.innerHeight); }, []);

  const isEnded = vp > 0 && scrollY >= vp;
  const handleScrub = useCallback((p: number) => {
    setScrollY(p * (typeof window !== "undefined" ? window.innerHeight : 720));
  }, []);

  const cars = [
    { n: "Perodua Axia G1", p: "RM 110", c: "Hatchback", s: "5 seats", tag: "Economy" },
    { n: "Perodua Axia G2", p: "RM 120", c: "Hatchback", s: "5 seats", tag: "Economy" },
    { n: "Proton Exora", p: "RM 170", c: "MPV", s: "7 seats", tag: "Family" },
    { n: "Proton X50", p: "RM 250", c: "SUV", s: "5 seats", tag: "SUV" },
    { n: "Toyota Vios", p: "RM 170", c: "Sedan", s: "5 seats", tag: "Sedan" },
    { n: "Toyota Yaris", p: "RM 161", c: "Hatchback", s: "5 seats", tag: "Premium" },
    { n: "Honda City RS", p: "RM 170", c: "Sedan", s: "5 seats · Hybrid", tag: "Hybrid" },
    { n: "Mitsubishi Xpander", p: "RM 350", c: "MPV", s: "7 seats", tag: "MPV" },
    { n: "Toyota Alphard", p: "RM 700", c: "Luxury", s: "7 seats", tag: "VIP" },
  ];

  return (
    <main>
      <Nav />
      <div style={{ height: 56 }} />
      <div style={{ height: "calc(100vh - 56px)" }} />

      {/* VIDEO */}
      <div style={{
        position: isEnded ? "relative" : "fixed",
        top: 0, left: 0, right: 0,
        height: "100vh",
        zIndex: isEnded ? 0 : 10,
        background: "#000",
      }}>
        <FrameScrubber onScrub={handleScrub} />
        <div className="absolute top-0 left-0 right-0 p-5 md:p-8 z-10">
          <p className="text-[#FF4500] text-xs font-bold tracking-[0.25em] uppercase">━━ Chapter 01 / The Drive</p>
        </div>
        <div className="absolute left-0 right-0 px-5 md:px-8 z-10 text-center" style={{ bottom: "35%" }}>
          <p className="text-white/40 text-xs font-semibold tracking-wider uppercase mb-3">Scroll to orbit ↓</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[0.92] mb-3">Rent The Ride.<br /><span className="text-[#FF4500]">Own The Road.</span></h1>
          <p className="text-white/60 text-xs md:text-sm max-w-md mx-auto">Premium cars · Honest prices · Free delivery Seremban</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8 z-10">
          <a href="https://wa.me/60126565477" target="_blank" className="bg-[#FF4500] text-white font-bold px-6 py-3 rounded-lg text-sm inline-block hover:brightness-110 transition-all">Book on WhatsApp</a>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ opacity: isEnded ? 1 : 0 }}>
        {/* Stats */}
        <div className="bg-white py-8 md:py-10 border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-4 gap-4">
            {[{ v: "50+", l: "Cars" },{ v: "1K+", l: "Clients" },{ v: "4.9", l: "Rating" },{ v: "24/7", l: "Service" }].map(x => (
              <div key={x.l} className="text-center"><p className="text-2xl md:text-4xl font-black text-black">{x.v}</p><p className="text-[10px] text-gray-500 font-semibold uppercase mt-1">{x.l}</p></div>
            ))}
          </div>
        </div>

        {/* Marquee */}
        <div className="bg-white py-3 border-b border-gray-100 overflow-hidden">
          <div className="flex gap-8 whitespace-nowrap animate-marquee" style={{ animation: "marquee 20s linear infinite" }}>
            {Array.from({ length: 6 }).flatMap((_, i) => ["SEWA LAMA LAGI MURAH", "FREE DELIVERY", "ZERO DEPOSIT", "UNLIMITED MILEAGE", "24/7 SERVICE", "KLIA PICKUP"]).map((t, i) => (
              <span key={i} className="text-xs font-bold text-gray-700 uppercase tracking-widest">{t} <span className="text-[#FF4500]">★</span></span>
            ))}
          </div>
        </div>
        <style>{".animate-marquee { display: flex; } @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }"}</style>

        {/* Fleet */}
        <section id="fleet" className="py-16 md:py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[#FF4500] text-xs font-bold tracking-[0.25em] uppercase">━━ Chapter 02 / The Lineup</p>
                <h2 className="text-2xl md:text-4xl font-black text-black mt-1">Choose Your Ride</h2>
              </div>
              <a href="https://jrvservices.co/cars" target="_blank" className="text-[#FF4500] text-xs font-bold uppercase hover:underline">See All →</a>
            </div>
            <p className="text-gray-500 text-xs md:text-sm mb-6">━━ 9 picks from our fleet</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {cars.map(car => (
                <div key={car.n} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all group">
                  <div className="h-24 md:h-28 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center relative">
                    <div className="w-14 h-14 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center shadow-sm">
                      <svg className="w-7 h-7 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 17h2a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.5l-1.5-2H8L6.5 7H3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
                    </div>
                    <span className="absolute top-2 right-2 text-[9px] bg-[#FF4500]/10 text-[#FF4500] font-bold px-2 py-0.5 rounded-full">{car.tag}</span>
                  </div>
                  <div className="p-3 md:p-4">
                    <h3 className="font-bold text-black text-sm">{car.n}</h3>
                    <p className="text-gray-400 text-[10px] mt-0.5">{car.c} · {car.s}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                      <span className="text-black font-black text-base">{car.p}<span className="text-gray-300 text-[9px] font-medium">/day</span></span>
                      <a href="https://wa.me/60126565477" target="_blank" className="text-[#FF4500] text-[10px] font-bold uppercase tracking-wider group-hover:underline">Book</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Category */}
        <section className="py-16 md:py-20 bg-[#FAFAFA] border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[#FF4500] text-xs font-bold tracking-[0.25em] uppercase">━━ Browse / By Category</p>
                <h2 className="text-2xl md:text-4xl font-black text-black mt-1">Five Shapes. One Vibe.</h2>
              </div>
              <a href="https://jrvservices.co/cars" target="_blank" className="text-[#FF4500] text-xs font-bold uppercase hover:underline">All Cars →</a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { n: "Hatchback", i: "🚗", d: "City runabouts", c: "3" },
                { n: "Sedan", i: "🚘", d: "Highway cruisers", c: "4" },
                { n: "SUV", i: "🚙", d: "Road-trip armour", c: "1" },
                { n: "MPV", i: "🚐", d: "Holiday workhorse", c: "3" },
                { n: "Luxury", i: "👑", d: "VIP treatment", c: "2" },
              ].map(cat => (
                <a key={cat.n} href="https://jrvservices.co/cars" target="_blank" className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#FF4500]/30 transition-all text-center group">
                  <p className="text-xl mb-1">{cat.i}</p>
                  <p className="font-bold text-black text-sm">{cat.n}</p>
                  <p className="text-gray-400 text-[10px] mt-0.5">{cat.d}</p>
                  <p className="text-[#FF4500] text-[10px] font-bold mt-2">{cat.c} cars</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="why-us" className="py-16 md:py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <p className="text-[#FF4500] text-xs font-bold tracking-[0.25em] uppercase mb-1">━━ Chapter 03 / The Difference</p>
            <h2 className="text-2xl md:text-4xl font-black text-black mt-1 mb-2">Eight Reasons We're Built Different.</h2>
            <p className="text-gray-500 text-xs md:text-sm mb-8 max-w-xl">JRV isn't a giant aggregator — we're a local team in Seremban running a tight, well-maintained fleet with honest pricing and 24/7 service.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {[
                { n: "01", t: "Best Local Rates", i: "💰", d: "Competitive pricing for all vehicles." },
                { n: "02", t: "Well-Maintained Fleet", i: "🔧", d: "Regularly serviced for your safety." },
                { n: "03", t: "Easy Booking", i: "⚡", d: "Rent in minutes via WhatsApp." },
                { n: "04", t: "Free Delivery", i: "🚚", d: "Doorstep delivery in Seremban." },
                { n: "05", t: "Unlimited Mileage", i: "🛣️", d: "No extra charges on distance." },
                { n: "06", t: "24-Hour Service", i: "🕐", d: "Round-the-clock support." },
                { n: "07", t: "KLIA Pickup", i: "✈️", d: "Available at both terminals." },
                { n: "08", t: "Transparent Pricing", i: "🔒", d: "No hidden fees, ever." },
              ].map(f => (
                <div key={f.n} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="text-lg mb-1">{f.i}</p>
                  <p className="text-[10px] text-gray-400 font-bold mb-0.5">{f.n} / 08</p>
                  <h3 className="font-bold text-black text-sm">{f.t}</h3>
                  <p className="text-gray-500 text-[11px] mt-1 leading-relaxed">{f.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-16 md:py-20 bg-[#FAFAFA] border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-4">
            <div className="text-center mb-8">
              <p className="text-[#FF4500] text-xs font-bold tracking-[0.25em] uppercase mb-1">━━ Chapter 04 / Answers</p>
              <h2 className="text-2xl md:text-4xl font-black text-black">Got Questions?</h2>
            </div>
            <div className="space-y-2">
              {[
                { q: "What documents do I need?", a: "Valid driver's license, IC/passport, and recent utility bill for address verification." },
                { q: "How much deposit do I pay?", a: "Zero deposit for most bookings. Rare in the industry — we trust our customers." },
                { q: "Is there a mileage limit?", a: "No. All rentals come with unlimited mileage at no extra charge." },
                { q: "What's the fuel policy?", a: "Same-to-same. Return the car at the same fuel level you received it." },
                { q: "What if the car breaks down?", a: "24/7 roadside assistance. Replacement vehicle guaranteed if needed." },
                { q: "Do you offer long-term rentals?", a: "Yes. Flexible long-term options available. Contact us for a custom quote." },
              ].map((f, i) => (
                <details key={i} className="group border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <summary className="px-4 md:px-5 py-3.5 cursor-pointer text-black font-semibold text-sm flex items-center justify-between list-none hover:bg-gray-50 transition-colors">
                    <span>{String(i + 1).padStart(2, "0")} {f.q}</span>
                    <span className="text-[#FF4500] group-open:rotate-180 transition-transform text-xs">▾</span>
                  </summary>
                  <div className="px-4 md:px-5 pb-3.5 text-gray-500 text-xs leading-relaxed border-t border-gray-100 pt-2.5">{f.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-black py-14 md:py-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <p className="text-white/40 text-xs font-bold tracking-[0.25em] uppercase mb-2">Last Step</p>
            <h2 className="text-3xl md:text-5xl font-black text-white">Ready To Hit<br /><span className="text-[#FF4500]">The Road?</span></h2>
            <p className="text-white/50 text-sm mt-3 max-w-md mx-auto">Reply in minutes. Zero paperwork. Be on the road within the hour.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
              <a href="https://wa.me/60126565477" target="_blank" className="bg-[#FF4500] text-white font-bold px-8 py-3.5 rounded-xl text-sm inline-flex items-center gap-2 hover:brightness-110 transition-all">
                Book via WhatsApp
              </a>
              <a href="tel:+60126565477" className="text-white/70 font-semibold text-sm underline underline-offset-4 decoration-white/20 hover:decoration-white transition-all">Call +60 12-656 5477</a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black border-t border-white/5 text-white/40 py-10 text-center text-[11px]">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-8 h-8 bg-[#FF4500] flex items-center justify-center font-black text-white text-xs rounded">JRV</div>
              <span className="text-white font-bold text-sm">JRV Car Rental</span>
            </div>
            <p className="text-white/30 text-xs mb-1">51, Jln S2 B18, Seremban 2, 70300 Seremban, Negeri Sembilan</p>
            <p className="text-white/30 text-xs mb-4">24 hours · 7 days a week</p>
            <div className="flex justify-center gap-4 mb-6">
              <a href="https://wa.me/60126565477" target="_blank" className="text-white/50 hover:text-[#FF4500] text-xs transition-colors">WhatsApp</a>
              <a href="tel:+60126565477" className="text-white/50 hover:text-[#FF4500] text-xs transition-colors">Call</a>
              <a href="https://jrvservices.co" target="_blank" className="text-white/50 hover:text-[#FF4500] text-xs transition-colors">Website</a>
              <a href="mailto:jrvservices.main@gmail.com" className="text-white/50 hover:text-[#FF4500] text-xs transition-colors">Email</a>
            </div>
            <p>© 2026 JRV Rental Services. All rights reserved.</p>
            <p className="mt-1">Powered by <a href="https://jrvsystems.app" target="_blank" className="text-[#FF4500] hover:underline">JRV Systems</a></p>
          </div>
        </footer>
      </div>
    </main>
  );
}
`;

const dir = '/home/jrvse/.openclaw/workspace/jrv-scroll-car/src/app';
fs.writeFileSync(path.join(dir, 'page.tsx'), page);
console.log('Written page.tsx');
`;

// Write text directly since the script method is complex
const content = `"use client";

import { useRef, useState, useCallback, useEffect } from "react";

const TOTAL_FRAMES = 61;
const frameUrl = (i: number) => \`/frames/frame_\${String(i + 1).padStart(4, "0")}.jpg\`;

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
        const p = Math.min(1, window.scrollY / window.innerHeight);
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
    <div className="absolute inset-0 bg-black">
      <canvas ref={cRef} className="block" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
      {!ready && <div className="absolute inset-0 flex items-center justify-center"><div className="w-8 h-8 border-2 border-white/20 border-t-orange-500 rounded-full animate-spin" /></div>}
    </div>
  );
}

function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-orange-500 flex items-center justify-center font-black text-white text-xs rounded">JRV</div>
          <span className="text-white/70 text-[10px] font-semibold tracking-widest uppercase hidden sm:block">Car Rental</span>
        </a>
        <div className="flex items-center gap-5 text-xs font-semibold uppercase tracking-wider">
          <a href="#fleet" className="text-white/50 hover:text-white transition-colors">Fleet</a>
          <a href="#why-us" className="text-white/50 hover:text-white transition-colors hidden md:block">Why Us</a>
          <a href="https://wa.me/60126565477" target="_blank" className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold hover:brightness-110 transition-all">Book Now</a>
        </div>
      </div>
    </nav>
  );
}

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [vp, setVp] = useState(0);
  useEffect(() => { setVp(window.innerHeight); }, []);

  const isEnded = vp > 0 && scrollY >= vp;
  const handleScrub = useCallback((p: number) => {
    setScrollY(p * (typeof window !== "undefined" ? window.innerHeight : 720));
  }, []);

  const cars = [
    { n: "Perodua Axia G1", p: "RM 110", c: "Hatchback", t: "Economy" },
    { n: "Perodua Axia G2", p: "RM 120", c: "Hatchback", t: "Economy" },
    { n: "Proton Exora", p: "RM 170", c: "MPV", t: "Family" },
    { n: "Proton X50", p: "RM 250", c: "SUV", t: "SUV" },
    { n: "Toyota Vios", p: "RM 170", c: "Sedan", t: "Sedan" },
    { n: "Toyota Yaris", p: "RM 161", c: "Hatchback", t: "Premium" },
    { n: "Honda City RS", p: "RM 170", c: "Sedan Hybrid", t: "Hybrid" },
    { n: "Mitsubishi Xpander", p: "RM 350", c: "MPV", t: "MPV" },
    { n: "Toyota Alphard", p: "RM 700", c: "Luxury MPV", t: "VIP" },
  ];

  const cats = [
    { n: "Hatchback", i: "🚗", d: "City runabouts", c: "3" },
    { n: "Sedan", i: "🚘", d: "Highway cruisers", c: "4" },
    { n: "SUV", i: "🚙", d: "Road-trip armour", c: "1" },
    { n: "MPV", i: "🚐", d: "Holiday workhorse", c: "3" },
    { n: "Luxury", i: "👑", d: "VIP treatment", c: "2" },
  ];

  const features = [
    { n: "01", t: "Best Local Rates", i: "💰", d: "Competitive pricing on all vehicles." },
    { n: "02", t: "Well-Maintained Fleet", i: "🔧", d: "Regularly serviced for safety." },
    { n: "03", t: "Easy Booking", i: "⚡", d: "Rent in minutes via WhatsApp." },
    { n: "04", t: "Free Delivery", i: "🚚", d: "Doorstep delivery in Seremban." },
    { n: "05", t: "Unlimited Mileage", i: "🛣️", d: "No extra charges on distance." },
    { n: "06", t: "24-Hour Service", i: "🕐", d: "Round-the-clock support." },
    { n: "07", t: "KLIA Pickup", i: "✈️", d: "Available at both terminals." },
    { n: "08", t: "Transparent Pricing", i: "🔒", d: "No hidden fees, ever." },
  ];

  const faqs = [
    { q: "What documents do I need?", a: "Valid license, IC/passport, and recent utility bill." },
    { q: "How much deposit?", a: "Zero deposit for most bookings. Rare in the industry." },
    { q: "Is there a mileage limit?", a: "No. Unlimited mileage on all rentals." },
    { q: "What's the fuel policy?", a: "Same-to-same. Return at the same level." },
    { q: "Breakdown assistance?", a: "24/7 roadside. Replacement guaranteed." },
    { q: "Long-term rentals?", a: "Yes. Flexible options. Contact for custom quote." },
  ];

  return (
    <main>
      <Nav />
      <div style={{ height: 56 }} />
      <div style={{ height: "calc(100vh - 56px)" }} />

      <div style={{
        position: isEnded ? "relative" : "fixed",
        top: 0, left: 0, right: 0,
        height: "100vh", zIndex: isEnded ? 0 : 10,
        background: "#000",
      }}>
        <FrameScrubber onScrub={handleScrub} />
        <div className="absolute top-0 left-0 right-0 p-5 md:p-8 z-10 pointer-events-none">
          <p className="text-orange-500 text-xs font-bold tracking-[0.25em] uppercase opacity-70">Chapter 01 / The Drive</p>
        </div>
        <div className="absolute left-0 right-0 px-5 md:px-8 z-10 text-center pointer-events-none" style={{ bottom: "33%" }}>
          <p className="text-white/30 text-[10px] font-semibold tracking-widest uppercase mb-3">Scroll to Explore ↓</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[0.92] mb-3">
            Rent The Ride.<br />
            <span className="text-orange-500">Own The Road.</span>
          </h1>
          <p className="text-white/50 text-xs md:text-sm max-w-md mx-auto">Premium cars · Honest prices · Free delivery Seremban</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8 z-10">
          <a href="https://wa.me/60126565477" target="_blank" className="bg-orange-500 text-white font-bold px-6 py-3 rounded-lg text-sm inline-block hover:brightness-110 transition-all">Book on WhatsApp</a>
        </div>
      </div>

      <div className="bg-white" style={{ opacity: isEnded ? 1 : 0 }}>
        <div className="py-8 border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-4 gap-4">
            {[{ v: "50+", l: "Cars" },{ v: "1K+", l: "Clients" },{ v: "4.9", l: "Rating" },{ v: "24/7", l: "Service" }].map(x => (
              <div key={x.l} className="text-center"><p className="text-2xl md:text-4xl font-black text-black">{x.v}</p><p className="text-[10px] text-gray-500 font-semibold uppercase mt-1">{x.l}</p></div>
            ))}
          </div>
        </div>

        <div className="bg-white py-3 border-b border-gray-100 overflow-hidden">
          <div className="marquee-track" style={{ display: "flex", whiteSpace: "nowrap", animation: "m 30s linear infinite" }}>
            {Array.from({ length: 8 }).flatMap(() => ["SEWA LAMA LAGI MURAH", "FREE DELIVERY", "ZERO DEPOSIT", "UNLIMITED MILEAGE", "24/7 SERVICE", "KLIA PICKUP"]).map((t, i) => (
              <span key={i} className="text-[10px] md:text-xs font-bold text-gray-600 uppercase tracking-[0.2em] mx-4">{t} <span className="text-orange-500">★</span></span>
            ))}
          </div>
        </div>

        <section id="fleet" className="py-14 md:py-20">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-orange-500 text-[10px] font-bold tracking-[0.25em] uppercase">Chapter 02 / The Lineup</p>
                <h2 className="text-2xl md:text-4xl font-black text-black mt-1">Choose Your Ride</h2>
              </div>
              <a href="https://jrvservices.co/cars" target="_blank" className="text-orange-500 text-[10px] font-bold uppercase hover:underline">All Cars →</a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {cars.map(car => (
                <div key={car.n} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-orange-500/20 transition-all group">
                  <div className="h-24 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center relative border-b border-gray-100">
                    <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center shadow-sm">
                      <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 17h2a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.5l-1.5-2H8L6.5 7H3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
                    </div>
                    <span className="absolute top-2 right-2 text-[9px] bg-orange-500/10 text-orange-600 font-bold px-2 py-0.5 rounded-full">{car.t}</span>
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-black text-sm">{car.n}</h3>
                    <p className="text-gray-400 text-[10px] mt-0.5">{car.c}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                      <span className="text-black font-black text-base">{car.p}<span className="text-gray-300 text-[9px] font-medium">/day</span></span>
                      <a href="https://wa.me/60126565477" target="_blank" className="text-orange-500 text-[10px] font-bold uppercase tracking-wider group-hover:underline">Book</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20 bg-gray-50 border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-orange-500 text-[10px] font-bold tracking-[0.25em] uppercase">Browse / By Category</p>
                <h2 className="text-2xl md:text-4xl font-black text-black mt-1">Five Shapes. One Vibe.</h2>
              </div>
              <a href="https://jrvservices.co/cars" target="_blank" className="text-orange-500 text-[10px] font-bold uppercase hover:underline">All →</a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
              {cats.map(c => (
                <div key={c.n} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-orange-500/20 transition-all text-center cursor-default">
                  <p className="text-xl mb-1">{c.i}</p>
                  <p className="font-bold text-black text-sm">{c.n}</p>
                  <p className="text-gray-400 text-[10px] mt-0.5">{c.d}</p>
                  <p className="text-orange-500 text-[10px] font-bold mt-2">{c.c} cars</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="why-us" className="py-14 md:py-20">
          <div className="max-w-5xl mx-auto px-4">
            <p className="text-orange-500 text-[10px] font-bold tracking-[0.25em] uppercase mb-1">Chapter 03 / The Difference</p>
            <h2 className="text-2xl md:text-4xl font-black text-black mt-1 mb-2">Why JRV?</h2>
            <p className="text-gray-500 text-xs md:text-sm mb-8 max-w-xl">We started with 3 cars. Today we run 50+ — because our customers trust us.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {features.map(f => (
                <div key={f.n} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="text-lg mb-1">{f.i}</p>
                  <p className="text-[9px] text-gray-400 font-bold mb-0.5">{f.n}</p>
                  <h3 className="font-bold text-black text-sm">{f.t}</h3>
                  <p className="text-gray-500 text-[11px] mt-1 leading-relaxed">{f.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20 bg-gray-50 border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-4">
            <div className="text-center mb-8">
              <p className="text-orange-500 text-[10px] font-bold tracking-[0.25em] uppercase mb-1">Chapter 04 / Answers</p>
              <h2 className="text-2xl md:text-4xl font-black text-black">Got Questions?</h2>
            </div>
            <div className="space-y-2">
              {faqs.map((f, i) => (
                <details key={i} className="group border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <summary className="px-4 md:px-5 py-3.5 cursor-pointer text-black font-semibold text-sm flex items-center justify-between list-none hover:bg-gray-50">
                    <span className="pr-4">{String(i + 1).padStart(2, "0")} {f.q}</span>
                    <span className="text-orange-500 group-open:rotate-180 transition-transform text-xs shrink-0">▾</span>
                  </summary>
                  <div className="px-4 md:px-5 pb-3.5 text-gray-500 text-xs leading-relaxed border-t border-gray-100 pt-2.5">{f.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-black py-14">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <p className="text-white/30 text-[10px] font-bold tracking-[0.25em] uppercase mb-2">Last Step</p>
            <h2 className="text-3xl md:text-5xl font-black text-white">Ready To Hit<br /><span className="text-orange-500">The Road?</span></h2>
            <p className="text-white/50 text-sm mt-3 max-w-md mx-auto">Reply in minutes. Zero paperwork. Be on the road within the hour.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
              <a href="https://wa.me/60126565477" target="_blank" className="bg-orange-500 text-white font-bold px-8 py-3.5 rounded-xl text-sm hover:brightness-110 transition-all">Book via WhatsApp</a>
              <a href="tel:+60126565477" className="text-white/60 font-semibold text-sm underline underline-offset-4 decoration-white/20 hover:decoration-white transition-all">Call +60 12-656 5477</a>
            </div>
          </div>
        </section>

        <footer className="bg-black border-t border-white/5 text-white/40 py-10 text-center text-[11px]">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-8 h-8 bg-orange-500 flex items-center justify-center font-black text-white text-xs rounded">JRV</div>
              <span className="text-white font-bold text-sm">JRV Car Rental</span>
            </div>
            <p className="text-white/30 text-xs mb-1">51, Jln S2 B18, Seremban 2, 70300 Seremban</p>
            <p className="text-white/30 text-xs mb-4">24 hours · 7 days a week</p>
            <div className="flex justify-center gap-4 mb-6">
              <a href="https://wa.me/60126565477" className="text-white/50 hover:text-orange-500 text-xs transition-colors">WhatsApp</a>
              <a href="tel:+60126565477" className="text-white/50 hover:text-orange-500 text-xs transition-colors">Call</a>
              <a href="https://jrvservices.co" className="text-white/50 hover:text-orange-500 text-xs transition-colors">Website</a>
            </div>
            <p>© 2026 JRV Rental Services. All rights reserved.</p>
            <p className="mt-1">Powered by <a href="https://jrvsystems.app" className="text-orange-500 hover:underline">JRV Systems</a></p>
          </div>
        </footer>
      </div>

      <style dangerouslySetInnerHTML={{ __html: \`@keyframes m { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }\`}} />
    </main>
  );
}
`;

fs.writeFileSync('/home/jrvse/.openclaw/workspace/jrv-scroll-car/src/app/page.tsx', content);
console.log('Written!');