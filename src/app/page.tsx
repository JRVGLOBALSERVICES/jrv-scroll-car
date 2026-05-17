"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import NavBar from "@/components/NavBar";
import FleetSection from "@/components/FleetSection";
import WhyUsSection from "@/components/WhyUsSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

// ── Video Frame Scrubber ──────────────────────────────
function CarScrubber({ scroll }: { scroll: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const durationRef = useRef(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const onMeta = () => {
      durationRef.current = vid.duration;
      vid.currentTime = 0;
      setReady(true);
    };
    vid.addEventListener("loadedmetadata", onMeta);
    return () => vid.removeEventListener("loadedmetadata", onMeta);
  }, []);

  // Seek video frame based on scroll (0 → 1 maps to entire duration)
  useEffect(() => {
    if (!ready || !videoRef.current || !canvasRef.current) return;
    const vid = videoRef.current;
    const canvas = canvasRef.current;
    const targetTime = scroll * durationRef.current;
    vid.currentTime = targetTime;
  }, [scroll, ready]);

  // Draw video frame to canvas when seeked
  const onSeeked = useCallback(() => {
    const vid = videoRef.current;
    const canvas = canvasRef.current;
    if (!vid || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = vid.videoWidth || 360;
    canvas.height = vid.videoHeight || 640;
    ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Hidden video element for decoding */}
      <video
        ref={videoRef}
        preload="auto"
        muted
        playsInline
        className="hidden"
        onSeeked={onSeeked}
        poster="/car-poster.jpg"
      >
        {/*
          ──────────────────────────────────────────────
          🚗 REPLACE THIS VIDEO SOURCE
          ──────────────────────────────────────────────
          Drop a short MP4 of a JRV fleet car here.
          Best: 5-10 seconds, 360-720p, car driving or rotating.
          The video should be portrait (9:16) or square.
          ──────────────────────────────────────────────
        */}
        <source src="" type="video/mp4" />
      </video>

      {/* Canvas showing the current frame */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
      />

      {/* Gradient overlay on top of canvas */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/20 to-[#0a0a0a]/30 pointer-events-none" />

      {/* Placeholder when no video loaded */}
      {!ready && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Animated car outline */}
          <motion.div
            animate={{ y: [0, -10, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mb-6"
          >
            <svg className="w-32 h-32 text-brand-orange/20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
            </svg>
          </motion.div>
          <p className="text-gray-600 text-sm font-mono text-center px-4">
            Drop a car video here to enable<br />
            <span className="text-brand-orange text-xs">scroll-driven scrubbing</span>
          </p>
          <div className="mt-6 text-[10px] text-gray-700 font-mono">
            src/app/page.tsx → line 55
          </div>
        </div>
      )}
    </div>
  );
}

// ── Page ──
export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const [scrollVal, setScrollVal] = useState(0);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setScrollVal(v);
  });

  return (
    <main>
      <NavBar />

      {/* ── HERO: Video Frame Scrub ── */}
      <section ref={heroRef} className="relative h-[300vh] bg-[#0a0a0a]">
        {/* Sticky video frame */}
        <motion.div style={{ opacity: heroOpacity }} className="sticky top-0 h-screen w-full overflow-hidden">
          <CarScrubber scroll={scrollVal} />

          {/* Text Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div style={{ y: heroY }} className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
                className="inline-block bg-brand-orange text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 -rotate-2"
              >
                SEREMBAN&apos;S BEST SINCE 2020
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: 0.4 }}
                className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] text-white"
              >
                Rent The<br />
                <span className="text-brand-orange">Ride.</span><br />
                Own The<br />
                <span className="text-brand-orange">Road.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: 0.6 }}
                className="text-gray-400 mt-6 max-w-md text-sm md:text-base"
              >
                50+ cars · Zero deposit · Free delivery Seremban · 24/7 service
              </motion.p>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="text-brand-orange text-xs font-bold uppercase tracking-widest"
              >
                ↓ Scroll
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
        </motion.div>

        {/* Stats */}
        <div className="relative z-10 -mt-[100vh] h-screen flex items-end pb-16 md:pb-20">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              viewport={{ once: true }}
              className="grid grid-cols-3 gap-4 md:gap-8"
            >
              {[
                { value: "50+", label: "Cars" },
                { value: "1K+", label: "Happy Clients" },
                { value: "4.9", label: "Google Rating" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl md:text-5xl font-black text-brand-orange">{stat.value}</p>
                  <p className="text-xs md:text-sm text-gray-400 font-semibold uppercase tracking-wider mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <FleetSection />
      <WhyUsSection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
