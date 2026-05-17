"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import NavBar from "@/components/NavBar";
import FleetSection from "@/components/FleetSection";
import WhyUsSection from "@/components/WhyUsSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

// ── Premium Car Scene ──
function PremiumCar({ scroll }: { scroll: number }) {
  const carRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!carRef.current) return;
    const t = clock.getElapsedTime();
    const scrollRot = scroll * Math.PI * 2;
    const idleRot = t * 0.15;

    carRef.current.rotation.y = idleRot + scrollRot;
    carRef.current.position.y = Math.sin(scroll * Math.PI) * 0.2 + Math.sin(t * 0.5) * 0.02;
    carRef.current.position.z = -scroll * 0.25;

    // Spin wheel groups
    carRef.current.children.forEach((child) => {
      if (child.userData.isWheel) child.rotation.x = t * 3 + scroll * 10;
    });
  });

  const bodyColor = "#FF4500";
  const cabinColor = "#1a1a1a";
  const glassColor = "#2a4a6a";
  const chromeColor = "#c0c0c0";

  const BodyBox = ({ args, radius, smoothness, material }: any) => (
    <RoundedBox args={args} radius={radius} smoothness={smoothness}>
      <meshPhysicalMaterial {...material} />
    </RoundedBox>
  );

  return (
    <group ref={carRef} position={[0, -0.15, 0]}>
      {/* ── Main Body (lower) ── */}
      <mesh position={[0, 0.25, 0]}>
        <RoundedBox args={[1.58, 0.28, 3.18]} radius={0.08} smoothness={6}>
          <meshPhysicalMaterial color={bodyColor} metalness={0.6} roughness={0.25} clearcoat={0.3} />
        </RoundedBox>
      </mesh>

      {/* ── Body upper (fenders + hood) ── */}
      <mesh position={[0, 0.45, 0.3]}>
        <RoundedBox args={[1.53, 0.16, 2.58]} radius={0.06} smoothness={4}>
          <meshPhysicalMaterial color={bodyColor} metalness={0.6} roughness={0.25} clearcoat={0.3} />
        </RoundedBox>
      </mesh>

      {/* ── Hood bulge ── */}
      <mesh position={[0, 0.53, 0.95]}>
        <RoundedBox args={[0.9, 0.06, 0.6]} radius={0.04} smoothness={4}>
          <meshPhysicalMaterial color={bodyColor} metalness={0.5} roughness={0.3} clearcoat={0.2} />
        </RoundedBox>
      </mesh>

      {/* ── Cabin ── */}
      <mesh position={[0, 0.6, -0.1]}>
        <RoundedBox args={[1.18, 0.2, 1.78]} radius={0.06} smoothness={4}>
          <meshPhysicalMaterial color={cabinColor} metalness={0.1} roughness={0.6} />
        </RoundedBox>
      </mesh>

      {/* ── Windshield (front) ── */}
      <mesh position={[0, 0.62, 0.95]} rotation={[0.45, 0, 0]}>
        <planeGeometry args={[1.05, 0.5]} />
        <meshPhysicalMaterial color={glassColor} metalness={0.1} roughness={0.05} transparent opacity={0.4} envMapIntensity={1} />
      </mesh>

      {/* ── Rear window ── */}
      <mesh position={[0, 0.62, -1.1]} rotation={[-0.45, 0, 0]}>
        <planeGeometry args={[1.05, 0.5]} />
        <meshPhysicalMaterial color={glassColor} metalness={0.1} roughness={0.05} transparent opacity={0.35} envMapIntensity={1} />
      </mesh>

      {/* ── Side windows ── */}
      {[[0.72, 0.6, 0.1], [-0.72, 0.6, 0.1]].map((pos, idx) => (
        <mesh key={`sw-${idx}`} position={pos as [number, number, number]} rotation={[0, idx === 0 ? -0.1 : 0.1, 0]}>
          <planeGeometry args={[0.6, 0.3]} />
          <meshPhysicalMaterial color={glassColor} metalness={0.1} roughness={0.05} transparent opacity={0.3} envMapIntensity={1} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* ── Chrome trim (side) ── */}
      {[[0.82, 0.28, 0], [-0.82, 0.28, 0]].map((pos, idx) => (
        <mesh key={`trim-${idx}`} position={pos as [number, number, number]}>
          <boxGeometry args={[0.03, 0.08, 2.4]} />
          <meshPhysicalMaterial color={chromeColor} metalness={0.9} roughness={0.1} />
        </mesh>
      ))}

      {/* ── Bumper (front) ── */}
      <mesh position={[0, 0.12, 1.65]}>
        <RoundedBox args={[1.25, 0.15, 0.08]} radius={0.04} smoothness={4}>
          <meshPhysicalMaterial color="#222" metalness={0.3} roughness={0.7} />
        </RoundedBox>
      </mesh>

      {/* ── Bumper (rear) ── */}
      <mesh position={[0, 0.12, -1.65]}>
        <RoundedBox args={[1.25, 0.15, 0.08]} radius={0.04} smoothness={4}>
          <meshPhysicalMaterial color="#222" metalness={0.3} roughness={0.7} />
        </RoundedBox>
      </mesh>

      {/* ── Grille ── */}
      <mesh position={[0, 0.12, 1.68]}>
        <planeGeometry args={[0.5, 0.12]} />
        <meshBasicMaterial color="#111" />
      </mesh>

      {/* ── Headlights ── */}
      {[[0.35, 0.2, 1.68], [-0.35, 0.2, 1.68]].map((pos, idx) => (
        <group key={`hl-${idx}`} position={pos as [number, number, number]}>
          <mesh>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshPhysicalMaterial color="#fff" emissive="#fff" emissiveIntensity={0.3} metalness={0.1} roughness={0.05} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.1, 12, 12]} />
            <meshPhysicalMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.15} transparent opacity={0.4} />
          </mesh>
        </group>
      ))}

      {/* ── Taillights ── */}
      {[[0.3, 0.2, -1.68], [-0.3, 0.2, -1.68]].map((pos, idx) => (
        <mesh key={`tl-${idx}`} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshPhysicalMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.2} metalness={0.3} roughness={0.3} />
        </mesh>
      ))}

      {/* ── Front lip spoiler ── */}
      <mesh position={[0, 0.03, 1.64]}>
        <boxGeometry args={[0.8, 0.04, 0.06]} />
        <meshPhysicalMaterial color="#111" metalness={0.2} roughness={0.8} />
      </mesh>

      {/* ── Rear diffuser ── */}
      <mesh position={[0, 0.03, -1.64]}>
        <boxGeometry args={[0.6, 0.04, 0.06]} />
        <meshPhysicalMaterial color="#111" metalness={0.2} roughness={0.8} />
      </mesh>

      {/* ── Exhaust tips ── */}
      {[[0.12, 0.03, -1.7], [-0.12, 0.03, -1.7]].map((pos, idx) => (
        <mesh key={`ex-${idx}`} position={pos as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.04, 0.015, 8, 12]} />
          <meshPhysicalMaterial color={chromeColor} metalness={0.9} roughness={0.1} />
        </mesh>
      ))}

      {/* ── Wheels ── */}
      {[
        [-0.7, 0.1, 1.15],
        [0.7, 0.1, 1.15],
        [-0.7, 0.1, -1.2],
        [0.7, 0.1, -1.2],
      ].map((pos, i) => (
        <group key={`wheel-${i}`} position={pos as [number, number, number]}>
          {/* Tire */}
          <mesh rotation={[0, 0, Math.PI / 2]} userData={{ isWheel: true }}>
            <cylinderGeometry args={[0.22, 0.22, 0.18, 20]} />
            <meshPhysicalMaterial color="#1a1a1a" metalness={0.1} roughness={0.9} />
          </mesh>
          {/* Rim */}
          <mesh position={[0.07, 0, 0]} rotation={[0, 0, Math.PI / 2]} userData={{ isWheel: true }}>
            <cylinderGeometry args={[0.14, 0.14, 0.05, 12]} />
            <meshPhysicalMaterial color="#ccc" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Rim spokes */}
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <mesh key={`spoke-${i}-${deg}`} rotation={[0, 0, (deg * Math.PI) / 180]} position={[0.06, 0, 0]} userData={{ isWheel: true }}>
              <boxGeometry args={[0.015, 0.1, 0.04]} />
              <meshPhysicalMaterial color="#aaa" metalness={0.8} roughness={0.2} />
            </mesh>
          ))}
          {/* Hub cap */}
          <mesh position={[0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]} userData={{ isWheel: true }}>
            <cylinderGeometry args={[0.04, 0.04, 0.02, 8]} />
            <meshPhysicalMaterial color={bodyColor} metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* ── Wheel arches ── */}
      {[
        [-0.75, 0.12, 1.15], [0.75, 0.12, 1.15],
        [-0.75, 0.12, -1.2], [0.75, 0.12, -1.2],
      ].map((pos, i) => (
        <mesh key={`arch-${i}`} position={pos as [number, number, number]}>
          <torusGeometry args={[0.25, 0.04, 8, 16, Math.PI]} />
          <meshPhysicalMaterial color={bodyColor} metalness={0.6} roughness={0.25} />
        </mesh>
      ))}
    </group>
  );
}

function HeroScene({ scroll }: { scroll: number }) {
  return (
    <>
      <color attach="background" args={["#0a0a0a"]} />
      <fog attach="fog" args={["#0a0a0a", 6, 12]} />

      {/* Lighting */}
      <ambientLight intensity={0.3} color="#404060" />
      <directionalLight position={[0, 5, 3]} intensity={0.8} color="#fff" />
      <directionalLight position={[-3, 2, -2]} intensity={0.3} color="#FF4500" />
      <directionalLight position={[3, 1, 4]} intensity={0.2} color="#4488ff" />
      <pointLight position={[0, 1.5, 2]} intensity={0.5} color="#FF4500" distance={8} />
      <pointLight position={[0, 0.5, -2]} intensity={0.3} color="#FF4500" distance={8} />

      {/* Ground reflection */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshBasicMaterial color="#050505" />
      </mesh>

      {/* Glow floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]}>
        <circleGeometry args={[2.5, 32]} />
        <meshBasicMaterial color="#FF4500" transparent opacity={0.06} />
      </mesh>

      {/* Inner glow ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]}>
        <ringGeometry args={[1.2, 2.0, 32]} />
        <meshBasicMaterial color="#FF4500" transparent opacity={0.04} side={THREE.DoubleSide} />
      </mesh>

      {/* Bottom light line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <ringGeometry args={[1.8, 1.85, 32]} />
        <meshBasicMaterial color="#FF4500" transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>

      <PremiumCar scroll={scroll} />
    </>
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
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setScrollVal(v);
  });

  return (
    <main>
      <NavBar />

      <section ref={heroRef} className="relative h-[250vh] bg-[#0a0a0a]">
        <motion.div style={{ opacity }} className="sticky top-0 h-screen w-full overflow-hidden">
          <Canvas
            camera={{ position: [0, 1.5, 4.5], fov: 45 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
          >
            <HeroScene scroll={scrollVal} />
          </Canvas>

          {/* Overlay */}
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
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/20 pointer-events-none" />
        </motion.div>

        {/* Stats */}
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

      <FleetSection />
      <WhyUsSection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
