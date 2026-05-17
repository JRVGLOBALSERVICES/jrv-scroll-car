"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import NavBar from "@/components/NavBar";
import FleetSection from "@/components/FleetSection";
import WhyUsSection from "@/components/WhyUsSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

// ── 3D Scene ──────────────────────────────────────────
function CarScene({ scroll }: { scroll: number }) {
  const group = useRef<THREE.Group>(null);
  const { clock } = useThree();

  useFrame(() => {
    if (!group.current) return;
    // Idle auto-rotation
    const autoRotate = clock.getElapsedTime() * 0.2;
    // Scroll-driven rotation: full rotation over scroll
    const scrollRotate = scroll * Math.PI * 2;
    group.current.rotation.y = autoRotate + scrollRotate;

    // Subtle vertical bounce from scroll
    group.current.position.y = Math.sin(scroll * Math.PI) * 0.25;
    group.current.position.z = -scroll * 0.3;
  });

  return (
    <group ref={group} position={[0, -0.3, 0]}>
      {/* Car Body */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[1.8, 0.35, 3.5]} />
        <MeshDistortMaterial
          color="#FF4500"
          metalness={0.8}
          roughness={0.2}
          distort={0.04}
          speed={0.3}
        />
      </mesh>

      {/* Cabin */}
      <mesh position={[0, 0.65, -0.15]}>
        <boxGeometry args={[1.35, 0.3, 2]} />
        <meshPhysicalMaterial
          color="#222"
          metalness={0.1}
          roughness={0.3}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Windshield */}
      <mesh position={[0, 0.7, 1.05]} rotation={[0.25, 0, 0]}>
        <planeGeometry args={[1.15, 0.5]} />
        <meshPhysicalMaterial color="#4488ff" metalness={0.1} roughness={0.1} transparent opacity={0.35} />
      </mesh>

      <mesh position={[0, 0.7, -1.4]} rotation={[-0.25, 0, 0]}>
        <planeGeometry args={[1.15, 0.5]} />
        <meshPhysicalMaterial color="#4488ff" metalness={0.1} roughness={0.1} transparent opacity={0.35} />
      </mesh>

      {/* Wheels */}
      {[
        [-0.8, 0, 1.2], [0.8, 0, 1.2],
        [-0.8, 0, -1.3], [0.8, 0, -1.3],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.25, 0.25, 0.15, 12]} />
          <meshPhysicalMaterial color="#111" metalness={0.5} roughness={0.8} />
        </mesh>
      ))}

      {/* Headlights */}
      <pointLight position={[0.5, 0.3, 1.85]} intensity={0.4} color="#FF4500" />
      <pointLight position={[-0.5, 0.3, 1.85]} intensity={0.4} color="#FF4500" />
      {[[0.5, 1.8], [-0.5, 1.8]].map(([x, z], i) => (
        <mesh key={`hl-${i}`} position={[x, 0.2, z]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshPhysicalMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.4} />
        </mesh>
      ))}

      {/* Taillights */}
      {[[0.5, -1.75], [-0.5, -1.75]].map(([x, z], i) => (
        <mesh key={`tl-${i}`} position={[x, 0.3, z]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshPhysicalMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.3} />
        </mesh>
      ))}

      {/* Speed lines */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh
          key={`sl-${i}`}
          position={[
            (Math.random() - 0.5) * 2.5,
            (Math.random() - 0.5) * 0.4,
            -2 - Math.random() * 4 + scroll * 3,
          ]}
        >
          <boxGeometry args={[0.015, 0.015, 0.5]} />
          <meshBasicMaterial color="#FF4500" transparent opacity={0.25} />
        </mesh>
      ))}
    </group>
  );
}

function Scene3D({ scroll }: { scroll: number }) {
  return (
    <>
      <gridHelper args={[16, 16, "#FF4500", "#333"]} position={[0, -0.7, 0]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-3, 2, -3]} intensity={0.4} color="#FF4500" />
      <pointLight position={[0, 2, 0]} intensity={0.3} color="#FF4500" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.68, 0]}>
        <planeGeometry args={[5, 5]} />
        <meshBasicMaterial color="#FF4500" transparent opacity={0.06} />
      </mesh>
      <CarScene scroll={scroll} />
    </>
  );
}

// ── Main Page ──────────────────────────────────────────
export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const [scrollVal, setScrollVal] = useState(0);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 0.9]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setScrollVal(v);
  });

  return (
    <main>
      <NavBar />

      {/* ── HERO: Scroll-driven 3D Car ── */}
      <section ref={heroRef} className="relative h-[250vh] bg-brand-dark">
        {/* Sticky 3D Canvas */}
        <motion.div style={{ opacity, scale }} className="sticky top-0 h-screen w-full overflow-hidden">
          <Canvas
            camera={{ position: [0, 1.8, 5], fov: 50 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true }}
          >
            <Scene3D scroll={scrollVal} />
          </Canvas>

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
                <span className="text-brand-orange text-glow-orange">Ride.</span><br />
                Own The<br />
                <span className="text-brand-orange text-glow-orange">Road.</span>
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

            {/* Scroll Indicator */}
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
                ↓ Scroll to explore
              </motion.div>
            </motion.div>
          </div>

          {/* Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-brand-dark/30 pointer-events-none" />
        </motion.div>

        {/* Stats Section */}
        <div className="relative z-10 -mt-[100vh] h-screen flex items-end pb-16 md:pb-24">
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

      {/* ── SECTIONS ── */}
      <FleetSection />
      <WhyUsSection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
