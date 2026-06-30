"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

export default function FAQ() {
  const faqs = [
    {
      question: "Who can participate in Code for Gujarat?",
      answer: "Any student currently enrolled in a college or university in India can participate. You can form a team of 3-5 members."
    },
    {
      question: "Is there any registration fee?",
      answer: "No, participation in Code for Gujarat is completely free of cost. Meals and accommodation will be provided for the shortlisted teams during the offline hackathon."
    },
    {
      question: "Can we form cross-college teams?",
      answer: "Yes, you can form teams with students from different colleges and universities."
    },
    {
      question: "What is the shortlisting process?",
      answer: "Teams will submit their project abstracts. Our panel of judges will review the ideas based on innovation, feasibility, and impact. The top 500 teams will be invited for the main 48-hour offline hackathon."
    },
    {
      question: "Will there be internet access during the offline hackathon?",
      answer: "Yes, high-speed Wi-Fi will be provided at the venue. However, we recommend bringing your own mobile hotspots as a backup."
    }
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-white relative border-t border-white/10">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-heading font-bold mb-4"
          >
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">Questions</span>
          </motion.h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="border border-white/10 rounded-2xl bg-black/5 overflow-hidden"
            >
              <button
                className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                onClick={() => toggleAccordion(index)}
              >
                <span className="font-heading font-semibold text-lg">{faq.question}</span>
                {activeIndex === index ? (
                  <Minus className="text-primary flex-shrink-0" size={20} />
                ) : (
                  <Plus className="text-gray-600 flex-shrink-0" size={20} />
                )}
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-5 text-gray-600">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
