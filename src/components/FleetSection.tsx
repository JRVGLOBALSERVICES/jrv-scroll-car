"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const fleet = [
  {
    name: "Perodua Axia G1",
    price: { day: 110, "3days": 300, week: 580 },
    specs: ["5 Seats", "Auto", "Hatchback"],
    seats: 5,
  },
  {
    name: "Perodua Axia G2",
    price: { day: 120, "3days": 320, week: 600 },
    specs: ["5 Seats", "Auto", "Hatchback"],
    seats: 5,
  },
  {
    name: "Proton Exora",
    price: { day: 170, "3days": 500, week: 1000 },
    specs: ["7 Seats", "Auto", "MPV"],
    seats: 7,
  },
  {
    name: "Proton X50",
    price: { day: 250, "3days": 700, week: 1300 },
    specs: ["5 Seats", "Auto", "SUV"],
    seats: 5,
  },
  {
    name: "Toyota Vios",
    price: { day: 170, "3days": 450, week: 949 },
    specs: ["5 Seats", "Auto", "Sedan"],
    seats: 5,
  },
  {
    name: "Toyota Yaris",
    price: { day: 161, "3days": 481, week: 761 },
    specs: ["5 Seats", "Auto", "Hatchback"],
    seats: 5,
  },
  {
    name: "Honda City RS",
    price: { day: 170, "3days": 450, week: 950 },
    specs: ["5 Seats", "Auto", "Sedan"],
    seats: 5,
  },
  {
    name: "Mitsubishi Xpander",
    price: { day: 350, "3days": 950, week: 1600 },
    specs: ["7 Seats", "Auto", "MPV"],
    seats: 7,
  },
  {
    name: "Toyota Alphard",
    price: { day: 700, "3days": 2000, week: 4000 },
    specs: ["7 Seats", "Auto", "Luxury MPV"],
    seats: 7,
  },
];

const periods = [
  { key: "day" as const, label: "Per Day" },
  { key: "3days" as const, label: "3 Days" },
  { key: "week" as const, label: "Per Week" },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const easeOut = [0.23, 1, 0.32, 1] as const;
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

export default function FleetSection() {
  const [period, setPeriod] = useState<"day" | "3days" | "week">("day");

  const getLabel = (key: string) => {
    switch (key) {
      case "day": return "/day";
      case "3days": return "/3 days";
      case "week": return "/week";
      default: return "";
    }
  };

  return (
    <section id="fleet" className="bg-brand-dark py-20 md:py-28 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 bg-noise" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block bg-brand-orange text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 rotate-1">
            OUR FLEET
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase">
            Choose Your <span className="text-brand-orange">Ride</span>
          </h2>
          <p className="text-gray-400 mt-3 text-sm md:text-base font-semibold tracking-wider uppercase">
            Sewa Lama Lagi Murah
          </p>

          {/* Period Toggle */}
          <div className="inline-flex mt-8 bg-black/50 rounded-full p-1 border border-white/10">
            {periods.map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={`px-5 py-2 text-sm font-bold rounded-full transition-all duration-300 ${
                  period === p.key
                    ? "bg-brand-orange text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Fleet Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {fleet.map((car) => (
            <motion.div
              key={car.name}
              variants={cardVariants}
              className="bg-white rounded-xl border-2 border-black shadow-brutal overflow-hidden group hover:shadow-[8px_8px_0px_0px_#FF4500] transition-all duration-300"
            >
              {/* Car image placeholder */}
              <div className="h-40 md:h-48 bg-gradient-to-br from-brand-dark via-gray-800 to-brand-orange/30 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full border-2 border-brand-orange/30 bg-brand-dark/50 flex items-center justify-center">
                    <svg className="w-12 h-12 text-brand-orange/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M19 17h2a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.5l-1.5-2H8L6.5 7H3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
                      <circle cx="7" cy="17" r="2" />
                      <circle cx="17" cy="17" r="2" />
                    </svg>
                  </div>
                </div>
                {/* Orange accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-orange" />
              </div>

              {/* Card Info */}
              <div className="p-4 md:p-5">
                <h3 className="font-bold text-lg md:text-xl leading-tight">
                  {car.name}
                </h3>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {car.specs.map((spec) => (
                    <span
                      key={spec}
                      className="text-[10px] md:text-xs bg-gray-100 text-gray-700 font-semibold px-2 py-0.5 rounded-md border border-gray-200"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                <div className="flex items-end justify-between mt-4 pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-2xl md:text-3xl font-black">
                      RM {car.price[period]}
                    </span>
                    <span className="text-xs text-gray-500 ml-1 font-medium">
                      {getLabel(period)}
                    </span>
                  </div>
                  <a
                    href="https://wa.me/60126565477"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-brand-orange text-white text-xs font-bold px-4 py-2 rounded-lg hover:brightness-110 transition-all duration-200"
                  >
                    Book Now
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
