"use client";

import { motion } from "framer-motion";
import { Lightbulb, Users, BookOpen, Network, Briefcase, Rocket } from "lucide-react";

export default function About() {
  const features = [
    {
      icon: <Lightbulb size={24} className="text-primary" />,
      title: "Innovation",
      description: "Push the boundaries of technology and build solutions that matter for the future of India."
    },
    {
      icon: <Users size={24} className="text-secondary" />,
      title: "Collaboration",
      description: "Work with brilliant minds from across the state to tackle complex real-world challenges together."
    },
    {
      icon: <BookOpen size={24} className="text-accent" />,
      title: "Learning",
      description: "Gain hands-on experience with cutting-edge tech through workshops and mentor sessions."
    },
    {
      icon: <Network size={24} className="text-primary" />,
      title: "Networking",
      description: "Connect with industry leaders, expert mentors, and fellow passionate developers."
    },
    {
      icon: <Briefcase size={24} className="text-secondary" />,
      title: "Internships",
      description: "Get spotted by top tech companies and secure exclusive internship opportunities."
    },
    {
      icon: <Rocket size={24} className="text-accent" />,
      title: "Startup Opportunities",
      description: "Turn your hackathon prototype into a real startup with incubation support for winners."
    }
  ];

  return (
    <section id="about" className="py-24 bg-dark relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-heading font-bold mb-4"
          >
            Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Code For Gujarat?</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg"
          >
            More than just a hackathon. It's a platform to showcase your talent, build your network, and launch your career in tech.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mb-6 border border-white/5 relative z-10">
                {feature.icon}
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3 relative z-10">{feature.title}</h3>
              <p className="text-gray-400 relative z-10">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
