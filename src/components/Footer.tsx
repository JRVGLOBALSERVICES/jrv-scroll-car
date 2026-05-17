"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 border-t-4 border-brand-orange">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-brand-orange flex items-center justify-center font-black text-white text-lg">
                JRV
              </div>
              <p className="font-bold">JRV Car Rental</p>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Family-owned since 2020. 50+ cars, zero deposit, free delivery.
              <br />
              <span className="text-brand-orange font-bold">
                Sewa Lama Lagi Murah
              </span>
            </p>
            <div className="flex gap-3 mt-4">
              {[
                { label: "FB", href: "https://facebook.com/JrvServices" },
                { label: "IG", href: "https://instagram.com/jrvservices.main" },
                { label: "TT", href: "https://tiktok.com/@jrvservices.co" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-xs font-bold hover:bg-brand-orange transition-colors duration-200"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-brand-orange">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Our Fleet", href: "#fleet" },
                { label: "Why Us", href: "#why-us" },
                { label: "FAQ", href: "#faq" },
                { label: "Contact", href: "#contact" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-brand-orange">
              Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <span className="text-gray-500 block text-xs">WhatsApp</span>
                <a
                  href="https://wa.me/60126565477"
                  className="text-white hover:text-brand-orange transition-colors font-semibold"
                >
                  +60 12-656 5477
                </a>
              </li>
              <li>
                <span className="text-gray-500 block text-xs">Email</span>
                <a
                  href="mailto:jrvservices.ai@gmail.com"
                  className="text-white hover:text-brand-orange transition-colors"
                >
                  jrvservices.ai@gmail.com
                </a>
              </li>
              <li>
                <span className="text-gray-500 block text-xs">Location</span>
                <p className="text-white">
                  Seremban 2, Negeri Sembilan
                </p>
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center text-gray-500 text-xs">
          <p>
            &copy; {new Date().getFullYear()} JRV Rental Services. All rights
            reserved.
          </p>
          <p className="mt-1">
            Powered by{" "}
            <a
              href="https://jrvsystems.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-orange hover:underline"
            >
              JRV Systems
            </a>
          </p>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/60126565477"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 w-14 h-14 bg-brand-whatsapp rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] transition-all duration-200 animate-pulse-glow"
      >
        <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </footer>
  );
}
