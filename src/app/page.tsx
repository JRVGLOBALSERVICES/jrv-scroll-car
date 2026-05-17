"use client";

import { useRef, useState, useCallback, useEffect } from "react";

const TOTAL = 61;
const fUrl = (i: number) => `/frames/frame_${String(i + 1).padStart(4, "0")}.jpg`;

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
    <div className="absolute inset-0 bg-[black]">
      <canvas ref={c} className="block" />
      <div className="absolute inset-0 bg-gradient-to-t from-[black]/70 via-transparent to-[black]/20" />
      {!ok && <div className="absolute inset-0 flex items-center justify-center bg-[black]"><div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>}
    </div>
  );
}

export default function Home() {
  const [sy, setSy] = useState(0);
  const [vp, setVp] = useState(0);
  useEffect(() => { setVp(window.innerHeight); }, []);

  const ended = vp > 0 && sy >= vp;
  const p = vp > 0 ? Math.min(1, sy / vp) : 0;

  const hp = useCallback((n: number) => setSy(n * (window.innerHeight || 720)), []);

  // Stagger delay helper
  const stagger = (i: number, base = 0.3) => ended ? `${base + i * 0.08}s` : "0s";

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

  const feats = [
    "Zero Deposit", "Free Delivery", "Unlimited KM", "24/7 Service",
    "Latest Models", "KLIA Pickup", "Best Rates", "Replacement Guaranteed",
  ];

  const faqs = [
    { q: "Documents needed?", a: "Valid license, IC/passport, utility bill." },
    { q: "Deposit?", a: "Zero. Rare in the industry." },
    { q: "Mileage limit?", a: "No. Unlimited." },
    { q: "Breakdown?", a: "24/7 assistance + replacement." },
  ];

  return (
    <main>
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent" style={{ opacity: Math.max(0, 1 - p * 3) }}>
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#FF4500] rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xs">JRV</span>
            </div>
            <span className="text-white/60 text-[10px] font-semibold tracking-widest uppercase">Car Rental</span>
          </div>
        </div>
      </nav>
      <div style={{ height: 56 }} />
      <div style={{ height: "calc(100vh - 56px)" }} />

      {/* HERO - VIDEO */}
      <div style={{
        position: ended ? "relative" : "fixed",
        top: 0, left: 0, right: 0, height: "100vh",
        zIndex: ended ? 0 : 10,
        background: "black",
      }}>
        <Scrubber onProg={hp} />

        {/* INTRO TEXT — animates in during the scroll */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-5" style={{ zIndex: 5 }}>
          {/* Tagline — fades in at 20-40% scroll */}
          <div style={{
            opacity: Math.min(1, Math.max(0, (p - 0.15) * 8)),
            transform: `translateY(${(1 - Math.min(1, Math.max(0, (p - 0.15) * 8))) * 20}px)`,
          }}>
            <p className="text-[#FF4500] text-xs font-bold tracking-[0.3em] uppercase mb-3">Sewa Lama Lagi Murah</p>
          </div>

          {/* Headline — fades in at 30-60% scroll */}
          <div style={{
            opacity: Math.min(1, Math.max(0, (p - 0.25) * 5)),
            transform: `translateY(${(1 - Math.min(1, Math.max(0, (p - 0.25) * 5))) * 30}px)`,
          }}>
            <h1 className="text-4xl md:text-7xl font-black text-white leading-[0.92] mb-3">
              Rent The Ride.<br />
              <span className="text-[#FF4500]">Own The Road.</span>
            </h1>
          </div>

          {/* Subtitle — fades in at 40-65% scroll */}
          <div style={{
            opacity: Math.min(1, Math.max(0, (p - 0.35) * 6)),
            transform: `translateY(${(1 - Math.min(1, Math.max(0, (p - 0.35) * 6))) * 20}px)`,
          }}>
            <p className="text-white/50 text-sm max-w-md mx-auto">Premium cars · Honest prices · Free delivery Seremban</p>
          </div>

          {/* Stats — fades in at 55-80% scroll */}
          <div className="flex gap-8 mt-8" style={{
            opacity: Math.min(1, Math.max(0, (p - 0.5) * 6)),
            transform: `translateY(${(1 - Math.min(1, Math.max(0, (p - 0.5) * 6))) * 20}px)`,
          }}>
            {[{ v: "50+", l: "Cars" }, { v: "1K+", l: "Clients" }, { v: "4.9", l: "Rating" }].map(x => (
              <div key={x.l} className="text-center">
                <p className="text-xl md:text-2xl font-black text-white">{x.v}</p>
                <p className="text-[9px] text-white/40 font-semibold uppercase tracking-wider mt-0.5">{x.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA — fades out as scroll progresses */}
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8" style={{ zIndex: 5, opacity: Math.max(0, 1 - p * 4) }}>
          <a href="https://wa.me/60126565477" target="_blank" className="inline-block bg-[#FF4500] text-white font-bold px-6 py-3 rounded-lg text-sm hover:brightness-110 transition-all">
            Book on WhatsApp
          </a>
        </div>
      </div>

      {/* CONTENT — appears frame by frame after video ends */}
      <div style={{ opacity: ended ? 1 : 0 }}>
        {/* Marquee strip */}
        <div className="py-2.5 border-b border-gray-200 overflow-hidden bg-white">
          <div className="marquee-track">
            {Array.from({ length: 6 }).flatMap(() => [
              "SEWA LAMA LAGI MURAH", "FREE DELIVERY", "ZERO DEPOSIT", "UNLIMITED MILEAGE"
            ]).map((t, i) => (
              <span key={i} className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mx-5">
                {t} <span className="text-[#FF4500]">★</span>
              </span>
            ))}
          </div>
        </div>

        {/* CAR SELECTION — primary focus after video */}
        <section id="fleet" className="py-14 md:py-20 bg-[#FFF8F0]">
          <div className="max-w-5xl mx-auto px-5">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-4xl font-black text-[black]">Choose Your Ride</h2>
              <p className="text-gray-400 text-xs mt-1">50+ cars · 12 models · From RM 110/day</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {cars.map((car, i) => (
                <div key={car.n} style={{
                  animation: ended ? `fadeUp 0.5s cubic-bezier(0.23,1,0.32,1) ${stagger(i)} both` : "none",
                }}>
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
                    <div className="h-24 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border-b border-gray-100">
                      <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                        <svg className="w-6 h-6 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M19 17h2a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.5l-1.5-2H8L6.5 7H3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
                        </svg>
                      </div>
                    </div>
                    <div className="p-3.5">
                      <h3 className="font-bold text-[black] text-sm">{car.n}</h3>
                      <p className="text-gray-400 text-[10px] mt-0.5">{car.s}</p>
                      <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-gray-100">
                        <span className="text-black font-black text-base">{car.p}<span className="text-gray-300 text-[9px]">/day</span></span>
                        <a href="https://wa.me/60126565477" className="text-[#FF4500] text-[10px] font-bold uppercase tracking-wider group-hover:underline">Book</a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features - staggered */}
        <section className="py-14 md:py-20 bg-white">
          <div className="max-w-5xl mx-auto px-5">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-4xl font-black text-[black]">Why JRV?</h2>
              <p className="text-gray-400 text-xs mt-1">Local since 2020 · Family-owned · 4.9★</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {feats.map((f, i) => (
                <div key={f} style={{
                  animation: ended ? `fadeUp 0.5s cubic-bezier(0.23,1,0.32,1) ${stagger(i, 0.6)} both` : "none",
                }}>
                  <div className="bg-[#FFF8F0] border border-gray-200 rounded-xl p-4 hover:border-[#FF4500]/20 transition-all">
                    <h3 className="font-bold text-[black] text-sm">{f}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-14 md:py-20 bg-[#FFF8F0] border-t border-gray-200">
          <div className="max-w-3xl mx-auto px-5">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-4xl font-black text-[black]">Got Questions?</h2>
            </div>
            <div className="space-y-2">
              {faqs.map((f, i) => (
                <details key={i} className="group border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <summary className="px-5 py-3.5 cursor-pointer text-[black] font-semibold text-sm flex items-center justify-between list-none hover:bg-gray-50 transition-colors">
                    <span>{f.q}</span>
                    <span className="text-[#FF4500] group-open:rotate-180 transition-transform text-xs shrink-0">▾</span>
                  </summary>
                  <div className="px-5 pb-3.5 text-gray-500 text-xs leading-relaxed border-t border-gray-100 pt-2.5">{f.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[black] py-16">
          <div className="max-w-3xl mx-auto px-5 text-center">
            <h2 className="text-3xl md:text-5xl font-black text-white">Ready To Hit<br /><span className="text-[#FF4500]">The Road?</span></h2>
            <p className="text-white/50 text-sm mt-3 max-w-md mx-auto">Reply in minutes. Zero paperwork. Be on the road within the hour.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
              <a href="https://wa.me/60126565477" className="bg-[#FF4500] text-white font-bold px-8 py-3.5 rounded-xl text-sm hover:brightness-110 transition-all">Book via WhatsApp</a>
              <a href="tel:+60126565477" className="text-white/50 font-semibold text-sm underline underline-offset-4 decoration-white/20 hover:decoration-white transition-all">Call +60 12-656 5477</a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[black] border-t border-white/5 text-white/40 py-10 text-center text-[11px]">
          <div className="max-w-5xl mx-auto px-5">
            <p>51, Jln S2 B18, Seremban 2, 70300 Seremban · 24 hours · 7 days</p>
            <div className="flex justify-center gap-5 my-4">
              <a href="https://wa.me/60126565477" className="text-white/40 hover:text-[#FF4500] text-xs transition-colors">WhatsApp</a>
              <a href="tel:+60126565477" className="text-white/40 hover:text-[#FF4500] text-xs transition-colors">Call</a>
              <a href="https://jrvservices.co" className="text-white/40 hover:text-[#FF4500] text-xs transition-colors">Website</a>
            </div>
            <p>© 2026 JRV Rental Services. Powered by <a href="https://jrvsystems.app" className="text-[#FF4500] hover:underline">JRV Systems</a></p>
          </div>
        </footer>
      </div>
    </main>
  );
}
