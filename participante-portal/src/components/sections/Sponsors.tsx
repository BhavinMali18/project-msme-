"use client";

import { motion } from "framer-motion";

export default function Sponsors() {
  const sponsors = {
    title: ["Google", "Microsoft"],
    gold: ["AWS", "GitHub", "Vercel", "Stripe"],
    silver: ["DigitalOcean", "Polygon", "Solana", "Figma", "Notion", "Postman"]
  };

  return (
    <section id="sponsors" className="py-24 bg-dark relative border-t border-white/10 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-heading font-bold mb-16"
        >
          Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Sponsors</span>
        </motion.h2>

        <div className="space-y-16 max-w-5xl mx-auto">
          {/* Title Sponsors */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-8">Title Sponsors</h3>
            <div className="flex flex-wrap justify-center gap-8">
              {sponsors.title.map((sponsor, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="w-64 h-32 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center grayscale hover:grayscale-0 hover:bg-white/10 transition-all cursor-pointer"
                >
                  <span className="text-3xl font-heading font-bold text-white/80">{sponsor}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Gold Sponsors */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-8">Gold Sponsors</h3>
            <div className="flex flex-wrap justify-center gap-6">
              {sponsors.gold.map((sponsor, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="w-48 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center grayscale hover:grayscale-0 hover:bg-white/10 transition-all cursor-pointer"
                >
                  <span className="text-2xl font-heading font-bold text-white/70">{sponsor}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Silver Sponsors */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-8">Silver Sponsors</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {sponsors.silver.map((sponsor, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="w-40 h-20 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center grayscale hover:grayscale-0 hover:bg-white/10 transition-all cursor-pointer"
                >
                  <span className="text-xl font-heading font-bold text-white/60">{sponsor}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
