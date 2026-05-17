"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import NavBar from "@/components/NavBar";

// ── Video Frame Scrubber ──
function VideoScrubber({ videoSrc, scroll }: { videoSrc: string; scroll: number }) {
  const vidRef = useRef<HTMLVideoElement>(null);
  const canRef = useRef<HTMLCanvasElement>(null);
  const durRef = useRef(0);
  const [ready, setReady] = useState(false);

  const draw = useCallback(() => {
    const vid = vidRef.current, can = canRef.current;
    if (!vid || !can || !vid.videoWidth) return;
    const ctx = can.getContext("2d");
    if (!ctx) return;
    const cw = can.clientWidth || window.innerWidth;
    const ch = can.clientHeight || window.innerHeight;
    can.width = cw; can.height = ch;
    const vw = vid.videoWidth, vh = vid.videoHeight;
    const s = Math.max(cw / vw, ch / vh);
    const sw = vw * s, sh = vh * s;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(vid, (cw - sw) / 2, (ch - sh) / 2, sw, sh);
  }, []);

  useEffect(() => {
    const v = vidRef.current;
    if (!v) return;
    const onMeta = () => { durRef.current = v.duration; v.currentTime = 0; setReady(true); };
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("loadeddata", () => { v.currentTime = 0; setTimeout(draw, 200); });
    return () => { v.removeEventListener("loadedmetadata", onMeta); };
  }, [draw]);

  useEffect(() => {
    if (!ready || !vidRef.current) return;
    vidRef.current.currentTime = scroll * durRef.current;
  }, [scroll, ready]);

  useEffect(() => {
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, [draw]);

  return (
    <div className="absolute inset-0 bg-black">
      <video ref={vidRef} preload="auto" muted playsInline className="hidden" onSeeked={draw}>
        <source src={videoSrc} type="video/mp4" />
      </video>
      <canvas ref={canRef} className="w-full h-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="w-10 h-10 border-2 border-brand-orange/30 border-t-brand-orange rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

// ── Hero Section (Porsche-style configurator) ──
function ConfiguratorHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const [s, setS] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", setS);

  const infoOpacity = useTransform(scrollYProgress, [0, 0.35, 0.6], [1, 0.5, 0]);
  const infoY = useTransform(scrollYProgress, [0, 0.6], [0, -40]);

  return (
    <section ref={containerRef} className="relative h-[400vh] bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <VideoScrubber videoSrc="/car-scroll.mp4" scroll={s} />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-5 md:p-8 z-10 pointer-events-none">
          <div className="flex items-center gap-2.5 pointer-events-auto">
            <div className="w-9 h-9 bg-brand-orange flex items-center justify-center font-black text-white text-sm rounded">JRV</div>
            <span className="text-white/70 text-xs font-semibold tracking-wider uppercase hidden sm:block">Car Rental</span>
          </div>
        </div>

        {/* Center content */}
        <motion.div
          style={{ opacity: infoOpacity, y: infoY, bottom: "35%" }}
          className="absolute left-0 right-0 px-5 md:px-8 z-10"
        >
          <div className="max-w-lg">
            <p className="text-brand-orange/90 text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase mb-2 md:mb-3">
              Seremban &bull; Since 2020
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[0.92] mb-2 md:mb-3 whitespace-pre-line">
              {`SEWA LAMA
LAGI MURAH`}
            </h1>
            <p className="text-white/50 text-xs md:text-sm max-w-xs leading-relaxed">
              50+ cars &bull; Zero deposit &bull; Free delivery Seremban &bull; 24/7
            </p>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]) }}
          className="absolute bottom-0 left-0 right-0 p-5 md:p-8 z-10"
        >
          <div className="flex flex-col sm:flex-row gap-2.5 max-w-sm">
            <a href="https://wa.me/60126565477" target="_blank" rel="noopener noreferrer"
              className="bg-brand-orange text-white text-center font-bold px-7 py-3 rounded-xl text-sm hover:brightness-110 transition-all duration-200">
              Book via WhatsApp
            </a>
            <a href="#fleet"
              className="border border-white/20 text-white/80 text-center font-semibold px-7 py-3 rounded-xl text-sm hover:bg-white/5 transition-all duration-200">
              View Fleet
            </a>
          </div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute bottom-1/2 right-5 md:right-8 z-10 pointer-events-none"
        >
          <span className="text-white/15 text-[10px] font-mono tracking-[0.3em] vertical-rl" style={{ writingMode: "vertical-rl" }}>
            SCROLL
          </span>
        </motion.div>
      </div>
    </section>
  );
}

// ── Stats Bar ──
function StatsBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      viewport={{ once: true }}
      className="bg-[#0a0a0a] border-y border-white/5 py-6 md:py-8"
    >
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-3 gap-4">
        {[
          { v: "50+", l: "Cars" },
          { v: "1K+", l: "Happy Clients" },
          { v: "4.9", l: "Google Rating" },
        ].map((s) => (
          <div key={s.l} className="text-center">
            <p className="text-2xl md:text-4xl font-black text-brand-orange">{s.v}</p>
            <p className="text-[10px] md:text-xs text-white/40 font-semibold uppercase tracking-wider mt-0.5">{s.l}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Page ──
export default function Home() {
  return (
    <main>
      <NavBar />
      <ConfiguratorHero />

      <StatsBar />

      {/* Fleet Section */}
      <section id="fleet" className="bg-[#0a0a0a] py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-brand-orange text-xs font-bold tracking-widest uppercase mb-2">OUR FLEET</p>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase">Choose Your Ride</h2>
            <p className="text-white/30 text-sm mt-2 uppercase tracking-wider">Sewa Lama Lagi Murah</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 md:gap-4">
            {[
              { n: "Perodua Axia G1", p: "RM 110", s: "5 seats · Hatchback" },
              { n: "Perodua Axia G2", p: "RM 120", s: "5 seats · Hatchback" },
              { n: "Proton Exora", p: "RM 170", s: "7 seats · MPV" },
              { n: "Proton X50", p: "RM 250", s: "5 seats · SUV" },
              { n: "Toyota Vios", p: "RM 170", s: "5 seats · Sedan" },
              { n: "Toyota Yaris", p: "RM 161", s: "5 seats · Hatchback" },
              { n: "Honda City RS", p: "RM 170", s: "5 seats · Hybrid" },
              { n: "Mitsubishi Xpander", p: "RM 350", s: "7 seats · MPV" },
              { n: "Toyota Alphard", p: "RM 700", s: "7 seats · Luxury" },
            ].map((car) => (
              <motion.div
                key={car.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm border border-white/5 rounded-xl p-4 md:p-5 hover:border-brand-orange/30 transition-all"
              >
                <div className="w-full h-20 md:h-24 bg-gradient-to-br from-black via-brand-dark to-brand-orange/10 rounded-lg mb-3 flex items-center justify-center">
                  <svg className="w-8 h-8 text-brand-orange/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M19 17h2a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.5l-1.5-2H8L6.5 7H3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
                    <circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" />
                  </svg>
                </div>
                <h3 className="font-bold text-white text-sm md:text-base">{car.n}</h3>
                <p className="text-white/40 text-[10px] md:text-xs mt-0.5">{car.s}</p>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                  <span className="text-brand-orange font-black text-base md:text-lg">{car.p}<span className="text-white/30 text-[9px] font-medium">/day</span></span>
                  <a href="https://wa.me/60126565477" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-brand-orange text-[10px] font-bold uppercase tracking-wider transition-colors">Book</a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-brand-dark py-16 md:py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-brand-orange text-xs font-bold tracking-widest uppercase mb-2">WHY US</p>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase">Why Choose JRV?</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-4">
            {[
              { t: "Zero Deposit", d: "No security deposit needed for most bookings" },
              { t: "Free Delivery", d: "Complimentary within Seremban area" },
              { t: "Unlimited KM", d: "No distance limits on any rental" },
              { t: "24/7 Service", d: "Round-the-clock roadside assistance" },
              { t: "Latest Models", d: "2024-2026 well-maintained fleet" },
              { t: "KLIA Service", d: "Meet & greet at airport terminals" },
              { t: "Best Rates", d: "From RM 110/day, transparent pricing" },
              { t: "Replacement", d: "Guaranteed if breakdown occurs" },
            ].map((f) => (
              <motion.div
                key={f.t}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                viewport={{ once: true }}
                className="bg-white/5 border border-white/5 rounded-xl p-4 hover:border-brand-orange/20 transition-all"
              >
                <h3 className="font-bold text-white text-sm">{f.t}</h3>
                <p className="text-white/40 text-[11px] mt-1 leading-relaxed">{f.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#0a0a0a] py-16 md:py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-brand-orange text-xs font-bold tracking-widest uppercase mb-2">FAQ</p>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase">Got Questions?</h2>
          </div>
          <div className="space-y-2">
            {[
              { q: "What documents do I need?", a: "Valid license, IC/passport, recent utility bill." },
              { q: "How much deposit?", a: "Zero deposit for most bookings. Rare in the industry." },
              { q: "Is there a mileage limit?", a: "No. Unlimited mileage on all rentals." },
              { q: "What if the car breaks down?", a: "24/7 roadside assistance. Replacement guaranteed." },
            ].map((faq, i) => (
              <details key={i} className="group bg-white/5 border border-white/5 rounded-xl overflow-hidden">
                <summary className="px-4 md:px-5 py-3.5 cursor-pointer text-white font-semibold text-sm flex items-center justify-between list-none">
                  {faq.q}
                  <span className="text-brand-orange group-open:rotate-180 transition-transform text-xs">▾</span>
                </summary>
                <div className="px-4 md:px-5 pb-3.5 text-white/50 text-xs leading-relaxed border-t border-white/5 pt-2.5">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / CTA */}
      <section className="bg-brand-orange py-14 md:py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase">Ready to Drive?</h2>
          <p className="text-white/70 text-sm mt-2 max-w-md mx-auto">Book in under 5 minutes via WhatsApp. Free delivery, zero deposit, unlimited mileage.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-7">
            <a href="https://wa.me/60126565477" target="_blank" rel="noopener noreferrer"
              className="bg-black text-white font-bold px-8 py-3.5 rounded-xl text-sm inline-flex items-center gap-2 hover:shadow-lg transition-all">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.051 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.82 11.82 0 0 0 12.051 0"/></svg>
              Book via WhatsApp
            </a>
            <a href="tel:+60126565477" className="text-black font-semibold text-sm underline underline-offset-4 decoration-white/30 hover:decoration-white transition-all">
              Or call +60 12-656 5477
            </a>
          </div>
          <div className="mt-6 text-white/50 text-[11px]">
            51, Jln S2 B18, Seremban 2 · 24 hours · 7 days a week
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white/40 py-8 text-center text-[11px] border-t border-white/5">
        <p>© 2026 JRV Rental Services. All rights reserved.</p>
        <p className="mt-1">Powered by <a href="https://jrvsystems.app" className="text-brand-orange hover:underline">JRV Systems</a></p>
      </footer>
    </main>
  );
}
