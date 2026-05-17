"use client";

import { useRef, useState, useCallback, useEffect } from "react";

const TOTAL_FRAMES = 61;
const frameUrl = (i: number) => `/frames/frame_${String(i + 1).padStart(4, "0")}.jpg`;

function FrameScrubber({ onEnd }: { onEnd: () => void }) {
  const cRef = useRef<HTMLCanvasElement>(null);
  const imgs = useRef<HTMLImageElement[]>([]);
  const [ready, setReady] = useState(false);
  const cur = useRef(-1);
  const fired = useRef(false);

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
        if (p >= 1 && !fired.current && window.scrollY > 0) { fired.current = true; onEnd(); }
      };
      lenis.on("scroll", onScroll); onScroll();
      cleanup = () => lenis.off("scroll", onScroll);
    };
    attach();
    return () => { clearTimeout(retry); if (cleanup) cleanup(); };
  }, [ready, draw, onEnd]);

  return (
    <div className="absolute inset-0 bg-[#111118]">
      <canvas ref={cRef} className="block" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#111118]/80 via-transparent to-[#111118]/20" />
      {!ready && <div className="absolute inset-0 flex items-center justify-center"><div className="w-8 h-8 border-2 border-white/20 border-t-[#FF4500] rounded-full animate-spin" /></div>}
    </div>
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
  const [ended, setEnded] = useState(false);

  const cars = [
    { n: "Perodua Axia G1", p: "RM 110", s: "5s · Hatchback" },
    { n: "Perodua Axia G2", p: "RM 120", s: "5s · Hatchback" },
    { n: "Proton Exora", p: "RM 170", s: "7s · MPV" },
    { n: "Proton X50", p: "RM 250", s: "5s · SUV" },
    { n: "Toyota Vios", p: "RM 170", s: "5s · Sedan" },
    { n: "Toyota Yaris", p: "RM 161", s: "5s · Hatchback" },
    { n: "Honda City RS", p: "RM 170", s: "5s · Hybrid" },
    { n: "Mitsubishi Xpander", p: "RM 350", s: "7s · MPV" },
    { n: "Toyota Alphard", p: "RM 700", s: "7s · Luxury" },
  ];

  const features = [
    { t: "Zero Deposit", d: "No security deposit needed." },
    { t: "Free Delivery", d: "Complimentary within Seremban area." },
    { t: "Unlimited KM", d: "No distance limits." },
    { t: "24/7 Service", d: "Round-the-clock assistance." },
    { t: "Latest Models", d: "2024-2026 fleet." },
    { t: "KLIA Service", d: "Meet & greet at airport." },
    { t: "Best Rates", d: "From RM 110/day." },
    { t: "Replacement", d: "Guaranteed if breakdown." },
  ];

  const faqs = [
    { q: "What documents do I need?", a: "Valid license, IC/passport, utility bill." },
    { q: "How much deposit?", a: "Zero deposit. Rare in the industry." },
    { q: "Is there a mileage limit?", a: "No. Unlimited on all rentals." },
    { q: "What if the car breaks down?", a: "24/7 assistance + replacement." },
  ];

  return (
    <main>
      <Nav />
      <div style={{ height: 56 }} />

      {/* Spacer — pushes content to viewport position when video ends */}
      <div style={{ height: "calc(100vh - 56px)" }} />

      {/* Video — fixed during scroll, hidden after */}
      <div style={{ display: ended ? "none" : "block", position: "fixed", top: 0, left: 0, right: 0, height: "100vh", zIndex: 10 }}>
        <FrameScrubber onEnd={() => setEnded(true)} />

        <div className="absolute top-0 left-0 right-0 p-5 md:p-8 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#FF4500] flex items-center justify-center font-black text-white text-xs">JRV</div>
            <span className="text-white/50 text-[10px] font-semibold tracking-widest uppercase hidden sm:block">Car Rental</span>
          </div>
        </div>
        <div className="absolute left-0 right-0 px-5 md:px-8 z-10" style={{ bottom: "33%" }}>
          <div className="max-w-lg">
            <p className="text-[#FF4500]/80 text-[10px] font-bold tracking-[0.25em] uppercase mb-2">Seremban · Since 2020</p>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-[0.92] mb-2 whitespace-pre-line">{`SEWA LAMA\nLAGI MURAH`}</h1>
            <p className="text-white/40 text-xs max-w-xs">50+ cars · Zero deposit · Free delivery · 24/7</p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8 z-10">
          <div className="flex flex-col sm:flex-row gap-2.5 max-w-sm">
            <a href="https://wa.me/60126565477" target="_blank" rel="noopener noreferrer" className="bg-[#FF4500] text-white text-center font-bold px-7 py-3 rounded-xl text-sm hover:brightness-110 transition-all">Book via WhatsApp</a>
          </div>
        </div>
      </div>

      {/* Content — in normal flow, creates scroll height */}
      {/* Hidden until video ends, then visible */}
      {/* Content — hidden until video ends */}
      <div style={{ opacity: ended ? 1 : 0 }}>
          <div className="py-6 md:py-8 border-b border-gray-100">
            <div className="max-w-5xl mx-auto px-4 grid grid-cols-3 gap-4">
              {[{ v: "50+", l: "Cars" },{ v: "1K+", l: "Clients" },{ v: "4.9", l: "Rating" }].map(x => (
                <div key={x.l} className="text-center"><p className="text-2xl md:text-4xl font-black text-black">{x.v}</p><p className="text-[10px] text-gray-500 font-semibold uppercase mt-0.5">{x.l}</p></div>
              ))}
            </div>
          </div>

          <section id="fleet" className="py-16 md:py-20">
            <div className="max-w-5xl mx-auto px-4">
              <div className="text-center mb-10"><p className="text-[#FF4500] text-xs font-bold tracking-widest uppercase mb-2">FLEET</p><h2 className="text-3xl md:text-5xl font-black text-black uppercase">Choose Your Ride</h2></div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 md:gap-4">
                {cars.map(car => (
                  <div key={car.n} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#FF4500]/30 hover:shadow-md transition-all">
                    <h3 className="font-bold text-black text-sm">{car.n}</h3>
                    <p className="text-gray-400 text-[10px] mt-0.5">{car.s}</p>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                      <span className="text-black font-black text-base">{car.p}<span className="text-gray-300 text-[9px]">/day</span></span>
                      <a href="https://wa.me/60126565477" className="text-[#FF4500] text-[10px] font-bold uppercase">Book</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 md:py-20 bg-[#FFF8F0] border-t border-gray-100">
            <div className="max-w-5xl mx-auto px-4">
              <div className="text-center mb-10"><p className="text-[#FF4500] text-xs font-bold tracking-widest uppercase mb-2">WHY US</p><h2 className="text-3xl md:text-5xl font-black text-black uppercase">Why JRV?</h2></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-4">
                {features.map(f => (
                  <div key={f.t} className="bg-white border border-gray-200 rounded-xl p-4">
                    <h3 className="font-bold text-black text-sm">{f.t}</h3>
                    <p className="text-gray-500 text-[11px] mt-1">{f.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="faq" className="py-16 md:py-20 bg-white">
            <div className="max-w-3xl mx-auto px-4">
              <div className="text-center mb-10"><p className="text-[#FF4500] text-xs font-bold tracking-widest uppercase mb-2">FAQ</p><h2 className="text-3xl md:text-5xl font-black text-black uppercase">Questions?</h2></div>
              <div className="space-y-2">
                {faqs.map((f, i) => (
                  <details key={i} className="group border border-gray-200 rounded-xl overflow-hidden">
                    <summary className="px-4 py-3.5 cursor-pointer text-black font-semibold text-sm flex items-center justify-between">{f.q}<span className="text-[#FF4500] group-open:rotate-180 transition-transform text-xs">▾</span></summary>
                    <div className="px-4 pb-3.5 text-gray-500 text-xs border-t border-gray-100 pt-2.5">{f.a}</div>
                  </details>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-[#FF4500] py-14">
            <div className="max-w-3xl mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase">Ready to Drive?</h2>
              <p className="text-white/70 text-sm mt-2">Book via WhatsApp.</p>
              <div className="flex justify-center gap-3 mt-7">
                <a href="https://wa.me/60126565477" className="bg-black text-white font-bold px-8 py-3.5 rounded-xl text-sm hover:shadow-lg transition-all">Book via WhatsApp</a>
              </div>
            </div>
          </section>

          <footer className="bg-[#111118] text-white/40 py-8 text-center text-[11px]">
            <p>© 2026 JRV Rental Services.</p>
            <p className="mt-1">Powered by <a href="https://jrvsystems.app" className="text-[#FF4500] hover:underline">JRV Systems</a></p>
          </footer>
        </div>
    </main>
  );
}
