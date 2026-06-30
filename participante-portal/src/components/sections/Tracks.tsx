"use client";

import { motion } from "framer-motion";
import { Brain, Shield, Landmark, HeartPulse, GraduationCap, Sprout, CloudRain, Building2, Blocks, Lightbulb } from "lucide-react";

export default function Tracks() {
  const tracks = [
    { icon: <Brain size={32} />, title: "Artificial Intelligence", color: "from-blue-500 to-indigo-500", delay: 0 },
    { icon: <Shield size={32} />, title: "Cyber Security", color: "from-red-500 to-orange-500", delay: 0.1 },
    { icon: <Landmark size={32} />, title: "FinTech", color: "from-green-500 to-emerald-500", delay: 0.2 },
    { icon: <HeartPulse size={32} />, title: "Healthcare", color: "from-pink-500 to-rose-500", delay: 0.3 },
    { icon: <GraduationCap size={32} />, title: "Education", color: "from-yellow-400 to-orange-500", delay: 0.4 },
    { icon: <Sprout size={32} />, title: "Agriculture", color: "from-green-400 to-lime-500", delay: 0.5 },
    { icon: <CloudRain size={32} />, title: "Climate Tech", color: "from-teal-400 to-cyan-500", delay: 0.6 },
    { icon: <Building2 size={32} />, title: "Smart Cities", color: "from-blue-400 to-sky-500", delay: 0.7 },
    { icon: <Blocks size={32} />, title: "Blockchain", color: "from-purple-500 to-fuchsia-500", delay: 0.8 },
    { icon: <Lightbulb size={32} />, title: "Open Innovation", color: "from-gray-300 to-gray-500", delay: 0.9 },
  ];

  return (
    <section id="tracks" className="py-24 bg-white relative border-t border-white/10 overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-heading font-bold mb-4"
          >
            Hackathon <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">Tracks</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 max-w-2xl mx-auto text-lg"
          >
            Choose a domain that sparks your passion. Solve pressing issues across 10 diverse categories.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {tracks.map((track, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: track.delay * 0.5, duration: 0.5 }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="group relative p-6 rounded-2xl bg-black/5 border border-white/10 hover:border-white/30 flex flex-col items-center justify-center text-center overflow-hidden h-48 cursor-pointer"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${track.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
              <div className={`text-slate-900/50 group-hover:text-slate-900 transition-colors duration-300 mb-4`}>
                {track.icon}
              </div>
              <h3 className="font-heading font-semibold text-lg">{track.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
