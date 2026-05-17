"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

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
    v.addEventListener("loadeddata", () => { v.currentTime = 0; setTimeout(draw, 150); });
    return () => { v.removeEventListener("loadedmetadata", onMeta); };
  }, [draw]);

  useEffect(() => {
    if (!ready || !vidRef.current) return;
    vidRef.current.currentTime = scroll * durRef.current;
  }, [scroll, ready]);

  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [draw]);

  return (
    <div className="absolute inset-0 bg-black overflow-hidden">
      <video ref={vidRef} preload="auto" muted playsInline className="hidden" onSeeked={draw}>
        <source src={videoSrc} type="video/mp4" />
      </video>
      <canvas ref={canRef} className="w-full h-full" />
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />
      {/* Loading state */}
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-brand-orange/30 border-t-brand-orange rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

// ── Hero Section (like Porsche configurator) ──
function ConfiguratorHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const [s, setS] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", setS);

  const infoOpacity = useTransform(scrollYProgress, [0, 0.4, 0.7], [1, 0.5, 0]);
  const infoY = useTransform(scrollYProgress, [0, 0.7], [0, -60]);

  return (
    <section ref={containerRef} className="relative h-[400vh] bg-black">
      <div className="sticky top-0 h-screen w-full">
        <VideoScrubber videoSrc="/car-scroll.mp4" scroll={s} />

        {/* Overlay content — like Porsche page */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 p-6 md:p-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-brand-orange flex items-center justify-center font-black text-white text-sm">
                JRV
              </div>
              <span className="text-white/80 text-xs font-semibold tracking-wider uppercase">Car Rental</span>
            </div>
          </div>

          {/* Center content */}
          <motion.div
            style={{ opacity: infoOpacity, y: infoY, bottom: "35%" }}
            className="absolute left-0 right-0 px-6 md:px-10"
          >
            <div className="max-w-xl">
              <p className="text-brand-orange text-xs font-bold tracking-[0.2em] uppercase mb-2">
                Seremban &bull; Since 2020
              </p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] mb-3">
                {`SEWA LAMA
LAGI MURAH`}
              </h1>
              <p className="text-white/60 text-sm md:text-base max-w-md leading-relaxed">
                50+ cars &bull; Zero deposit &bull; Free delivery Seremban &bull; 24/7
              </p>
            </div>
          </motion.div>

          {/* Bottom CTA bar */}
          <motion.div
            style={{ opacity: useTransform(scrollYProgress, [0, 0.3], [1, 0]) }}
            className="absolute bottom-0 left-0 right-0 p-6 md:p-10"
          >
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <a
                href="https://wa.me/60126565477"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-orange text-white font-bold px-8 py-3.5 rounded-xl text-sm text-center hover:brightness-110 transition-all"
              >
                Book via WhatsApp
              </a>
              <a
                href="#fleet"
                className="border border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl text-sm text-center hover:bg-white/5 transition-all"
              >
                View Our Fleet
              </a>
            </div>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-1/2 right-6 md:right-10"
          >
            <span className="text-white/20 text-[10px] font-mono tracking-widest [writing-mode:vertical-rl]">
              SCROLL
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Page ──
export default function Home() {
  return (
    <main>
      <ConfiguratorHero />
    </main>
  );
}
