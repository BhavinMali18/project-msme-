"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");
    // Simulate API call
    setTimeout(() => {
      setFormStatus("success");
      setTimeout(() => setFormStatus("idle"), 3000);
    }, 1500);
  };

  return (
    <section id="contact" className="py-24 bg-white relative border-t border-white/10 overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-heading font-bold mb-4"
          >
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary">Touch</span>
          </motion.h2>
          <p className="text-gray-600">Have questions? We'd love to hear from you.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
          {/* Contact Info & Map */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 space-y-8"
          >
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-black/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-primary">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-lg mb-1">Address</h4>
                  <p className="text-gray-600 text-sm">Gujarat Technological University, <br/>Chandkheda, Ahmedabad, Gujarat 382424</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-black/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-secondary">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-lg mb-1">Email</h4>
                  <p className="text-gray-600 text-sm">contact@codeforgujarat.in</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-black/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-accent">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-lg mb-1">Phone</h4>
                  <p className="text-gray-600 text-sm">+91 98765 43210</p>
                </div>
              </div>
            </div>

            <div className="h-[250px] w-full rounded-2xl overflow-hidden border border-white/10 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m2!1m1!1s0x395c2b0b0bb1a90f%3A0xc4eb783857d4ccf1!2sGujarat%20Technological%20University!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2"
          >
            <div className="bg-black/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
              <h3 className="text-2xl font-heading font-bold mb-6">Send us a message</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">First Name</label>
                    <input type="text" required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary transition-colors" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Last Name</label>
                    <input type="text" required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary transition-colors" placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <input type="email" required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary transition-colors" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Message</label>
                  <textarea required rows={4} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary transition-colors resize-none" placeholder="How can we help you?"></textarea>
                </div>
                
                <button 
                  type="submit" 
                  disabled={formStatus !== "idle"}
                  className="w-full bg-primary hover:bg-primary/90 text-slate-900 font-medium py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {formStatus === "idle" && "Send Message"}
                  {formStatus === "submitting" && "Sending..."}
                  {formStatus === "success" && "Message Sent!"}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
