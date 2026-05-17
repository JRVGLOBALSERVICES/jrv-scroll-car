"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function CarModel({ scrollProgress }: { scrollProgress: number }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    // Base rotation: auto-rotate slowly when idle
    const autoRotate = state.clock.getElapsedTime() * 0.3;
    // Scroll-driven rotation: map scroll 0->1 to rotation 0->PI*2
    const scrollRotate = scrollProgress * Math.PI * 2;
    group.current.rotation.y = autoRotate + scrollRotate;

    // Scroll-driven position: car moves up/down/forward based on scroll
    group.current.position.y = Math.sin(scrollProgress * Math.PI) * 0.3;
    group.current.position.z = -scrollProgress * 0.5;
  });

  return (
    <group ref={group} position={[0, -0.5, 0]}>
      {/* Car Body */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[1.8, 0.4, 3.5]} />
        <MeshDistortMaterial
          color="#FF4500"
          metalness={0.8}
          roughness={0.2}
          distort={0.05}
          speed={0.5}
        />
      </mesh>

      {/* Car Cabin */}
      <mesh position={[0, 0.7, -0.2]}>
        <boxGeometry args={[1.4, 0.35, 2]} />
        <meshPhysicalMaterial
          color="#222"
          metalness={0.1}
          roughness={0.3}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Front Windshield */}
      <mesh position={[0, 0.75, 1.1]} rotation={[0.3, 0, 0]}>
        <planeGeometry args={[1.2, 0.6]} />
        <meshPhysicalMaterial
          color="#4488ff"
          metalness={0.1}
          roughness={0.1}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Rear Windshield */}
      <mesh position={[0, 0.75, -1.5]} rotation={[-0.3, 0, 0]}>
        <planeGeometry args={[1.2, 0.6]} />
        <meshPhysicalMaterial
          color="#4488ff"
          metalness={0.1}
          roughness={0.1}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Wheels */}
      {[
        [-0.8, 0, 1.2],
        [0.8, 0, 1.2],
        [-0.8, 0, -1.3],
        [0.8, 0, -1.3],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
          <meshPhysicalMaterial
            color="#111"
            metalness={0.5}
            roughness={0.8}
          />
        </mesh>
      ))}

      {/* Rim highlights */}
      {[
        [-0.8, 0, 1.2],
        [0.8, 0, 1.2],
        [-0.8, 0, -1.3],
        [0.8, 0, -1.3],
      ].map((pos, i) => (
        <mesh key={`rim-${i}`} position={pos as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.15, 0.25, 8]} />
          <meshPhysicalMaterial
            color="#888"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      ))}

      {/* Headlights */}
      <pointLight position={[0.5, 0.3, 1.9]} intensity={0.5} color="#FF4500" />
      <pointLight position={[-0.5, 0.3, 1.9]} intensity={0.5} color="#FF4500" />
      <mesh position={[0.5, 0.2, 1.8]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshPhysicalMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[-0.5, 0.2, 1.8]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshPhysicalMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.3} />
      </mesh>

      {/* Taillights */}
      <mesh position={[0.5, 0.3, -1.8]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshPhysicalMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[-0.5, 0.3, -1.8]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshPhysicalMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.2} />
      </mesh>

      {/* Speed lines */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={`line-${i}`}
          position={[
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 0.5,
            -2 - Math.random() * 4 + scrollProgress * 3,
          ]}
        >
          <boxGeometry args={[0.02, 0.02, 0.5]} />
          <meshBasicMaterial color="#FF4500" transparent opacity={0.3 - scrollProgress * 0.2} />
        </mesh>
      ))}
    </group>
  );
}

function Scene({ scrollProgress }: { scrollProgress: number }) {
  return (
    <>
      {/* Ground grid */}
      <gridHelper args={[20, 20, "#FF4500", "#333"]} position={[0, -0.8, 0]} />
      
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-3, 2, -3]} intensity={0.5} color="#FF4500" />
      <pointLight position={[0, 3, 0]} intensity={0.3} color="#FF4500" />

      {/* Glow floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.78, 0]}>
        <planeGeometry args={[6, 6]} />
        <meshBasicMaterial
          color="#FF4500"
          transparent
          opacity={0.08}
        />
      </mesh>

      <CarModel scrollProgress={scrollProgress} />
    </>
  );
}

export default function ScrollCarHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const carProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <section
      ref={containerRef}
      className="relative h-[200vh] bg-brand-dark"
    >
      {/* Sticky 3D Canvas */}
      <motion.div
        style={{ opacity, scale }}
        className="sticky top-0 h-screen w-full overflow-hidden"
      >
        <Canvas
          camera={{ position: [0, 2, 5], fov: 50 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
        >
          <Scene scrollProgress={carProgress.get()} />
        </Canvas>

        {/* Overlay Content */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Hero text - shown on first viewport */}
          <motion.div
            style={{ y: heroY }}
            className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full px-4"
          >
            {/* Badge */}
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
              className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] text-white text-glow-orange"
            >
              Rent The
              <br />
              <span className="text-brand-orange">Ride.</span>
              <br />
              Own The
              <br />
              <span className="text-brand-orange">Road.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: 0.6 }}
              className="text-gray-400 mt-6 max-w-md mx-auto text-sm md:text-base"
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
              Scroll to explore
            </motion.div>
          </motion.div>
        </div>

        {/* Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-brand-dark/20 pointer-events-none" />
      </motion.div>

      {/* Bottom fade-out section */}
      <div className="relative z-10 -mt-[100vh] h-screen flex items-end pb-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="max-w-7xl mx-auto px-4 w-full"
        >
          <div className="grid grid-cols-3 gap-4 md:gap-8">
            {[
              { value: "50+", label: "Cars" },
              { value: "1K+", label: "Happy Clients" },
              { value: "4.9", label: "Google Rating" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-5xl font-black text-brand-orange">
                  {stat.value}
                </p>
                <p className="text-xs md:text-sm text-gray-400 font-semibold uppercase tracking-wider mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
