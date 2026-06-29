"use client";

import { motion } from "framer-motion";

export default function Timeline() {
  const events = [
    { date: "Oct 1, 2026", title: "Registration Opens", desc: "Start registering your teams on the portal." },
    { date: "Oct 10, 2026", title: "Idea Submission", desc: "Last date to submit your abstract and project idea." },
    { date: "Oct 12, 2026", title: "Shortlisting", desc: "Top 500 teams will be shortlisted for the main event." },
    { date: "Oct 14, 2026", title: "Mentor Session", desc: "Pre-hackathon mentoring and briefing." },
    { date: "Oct 15, 2026", title: "Hackathon Day", desc: "The 48-hour coding marathon begins." },
    { date: "Oct 17, 2026", title: "Final Presentation", desc: "Pitch your prototypes to the grand jury." },
    { date: "Oct 17, 2026", title: "Winner Announcement", desc: "Awards ceremony and closing notes." },
  ];

  return (
    <section id="timeline" className="py-24 bg-dark relative border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-heading font-bold mb-4"
          >
            Event <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary">Timeline</span>
          </motion.h2>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-accent md:-translate-x-1/2 opacity-30" />
          
          <div className="space-y-12">
            {events.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`flex flex-col md:flex-row gap-8 items-start md:items-center relative ${
                  i % 2 === 0 ? "md:flex-row-reverse text-left md:text-right" : "text-left"
                }`}
              >
                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 top-0 md:top-1/2 w-4 h-4 rounded-full bg-white border-4 border-primary -translate-x-[7px] md:-translate-x-1/2 md:-translate-y-1/2 z-10 shadow-[0_0_10px_rgba(0,87,255,0.8)]" />
                
                <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-8">
                  <div className={`p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors ${
                    i % 2 === 0 ? "md:ml-auto" : ""
                  }`}>
                    <span className="text-sm font-bold text-primary mb-2 block tracking-wider uppercase">{event.date}</span>
                    <h3 className="text-xl font-heading font-semibold text-white mb-2">{event.title}</h3>
                    <p className="text-gray-400">{event.desc}</p>
                  </div>
                </div>
                <div className="hidden md:block w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
