"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Award, Gift, Star, Zap } from "lucide-react";

export default function Prizes() {
  const topPrizes = [
    { title: "Champion", amount: "₹5,00,000", icon: <Trophy size={48} className="text-yellow-400" />, color: "from-yellow-400/20 to-yellow-600/5", border: "border-yellow-400/50" },
    { title: "Runner Up", amount: "₹3,00,000", icon: <Medal size={40} className="text-gray-300" />, color: "from-gray-300/20 to-gray-500/5", border: "border-gray-300/50" },
    { title: "Second Runner Up", amount: "₹1,00,000", icon: <Medal size={40} className="text-amber-600" />, color: "from-amber-600/20 to-amber-800/5", border: "border-amber-600/50" },
  ];

  const specialPrizes = [
    { title: "Best AI Hack", amount: "₹25,000", icon: <Zap size={24} className="text-primary" /> },
    { title: "Best UI Design", amount: "₹25,000", icon: <Star size={24} className="text-secondary" /> },
    { title: "Best Social Impact", amount: "₹25,000", icon: <Heart size={24} className="text-pink-500" /> },
    { title: "Best Female Team", amount: "₹25,000", icon: <Award size={24} className="text-purple-400" /> },
    { title: "Best Beginner Team", amount: "₹25,000", icon: <Gift size={24} className="text-green-400" /> },
  ];

  return (
    <section id="prizes" className="py-24 bg-dark relative border-t border-white/10 overflow-hidden">
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-yellow-500/5 rounded-full blur-[150px] -translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-heading font-bold mb-4"
          >
            Prize <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">Pool</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg"
          >
            ₹10 Lakhs+ in cash prizes, exciting swags, certificates, and internship opportunities for everyone.
          </motion.p>
        </div>

        {/* Top 3 Prizes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 items-end">
          {/* Runner Up */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className={`p-8 rounded-2xl bg-gradient-to-b ${topPrizes[1].color} border ${topPrizes[1].border} flex flex-col items-center text-center order-2 lg:order-1 lg:h-[320px]`}
          >
            <div className="mb-4">{topPrizes[1].icon}</div>
            <h3 className="text-2xl font-heading font-bold mb-2">{topPrizes[1].title}</h3>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">{topPrizes[1].amount}</p>
          </motion.div>

          {/* Champion */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={`p-8 rounded-2xl bg-gradient-to-b ${topPrizes[0].color} border ${topPrizes[0].border} flex flex-col items-center text-center order-1 lg:order-2 lg:h-[380px] shadow-[0_0_50px_rgba(250,204,21,0.15)] relative transform lg:-translate-y-4`}
          >
            <div className="absolute -top-6 bg-yellow-400 text-dark px-4 py-1 rounded-full text-sm font-bold tracking-widest uppercase">1st Place</div>
            <div className="mb-6 mt-4">{topPrizes[0].icon}</div>
            <h3 className="text-3xl font-heading font-bold mb-2 text-yellow-400">{topPrizes[0].title}</h3>
            <p className="text-5xl font-bold text-white mb-4">{topPrizes[0].amount}</p>
            <p className="text-yellow-200/60 text-sm">Plus Incubation Support</p>
          </motion.div>

          {/* Second Runner Up */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className={`p-8 rounded-2xl bg-gradient-to-b ${topPrizes[2].color} border ${topPrizes[2].border} flex flex-col items-center text-center order-3 lg:order-3 lg:h-[300px]`}
          >
            <div className="mb-4">{topPrizes[2].icon}</div>
            <h3 className="text-xl font-heading font-bold mb-2">{topPrizes[2].title}</h3>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">{topPrizes[2].amount}</p>
          </motion.div>
        </div>

        {/* Special Prizes */}
        <h3 className="text-2xl font-heading font-bold text-center mb-8">Special Category Prizes</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {specialPrizes.map((prize, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-xl bg-white/5 border border-white/10 text-center flex flex-col items-center hover:bg-white/10 transition-colors"
            >
              <div className="mb-3 p-3 bg-white/5 rounded-full">{prize.icon}</div>
              <h4 className="font-heading font-semibold text-sm mb-2">{prize.title}</h4>
              <p className="text-xl font-bold text-primary">{prize.amount}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Need to import Heart at the top
import { Heart } from "lucide-react";
