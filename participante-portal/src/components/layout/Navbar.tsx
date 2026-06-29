"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Tracks", href: "#tracks" },
    { name: "Timeline", href: "#timeline" },
    { name: "Prizes", href: "#prizes" },
    { name: "Sponsors", href: "#sponsors" },
    { name: "FAQ", href: "#faq" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-dark/80 backdrop-blur-md border-b border-white/10 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center font-heading font-bold text-lg">
            C
          </div>
          <span className="font-heading font-bold text-xl tracking-tight">Code for Gujarat</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-secondary transition-colors">
              Login
            </Link>
            <Link
              href="/register"
              className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-full text-sm font-medium transition-all hover:shadow-[0_0_15px_rgba(0,87,255,0.5)]"
            >
              Apply Now
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden absolute top-full left-0 w-full bg-dark/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-4"
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg text-gray-300 hover:text-white"
            >
              {link.name}
            </Link>
          ))}
          <hr className="border-white/10 my-2" />
          <Link
            href="/login"
            onClick={() => setMobileMenuOpen(false)}
            className="text-lg font-medium"
          >
            Login
          </Link>
          <Link
            href="/register"
            onClick={() => setMobileMenuOpen(false)}
            className="bg-primary text-white text-center py-3 rounded-xl font-medium mt-2"
          >
            Apply Now
          </Link>
        </motion.div>
      )}
    </motion.nav>
  );
}
