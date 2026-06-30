import Link from "next/link";
import { Mail, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black/50 border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center font-heading font-bold text-lg">
                C
              </div>
              <span className="font-heading font-bold text-xl tracking-tight">Code for Gujarat 2026</span>
            </Link>
            <p className="text-gray-600 text-sm max-w-sm mb-6">
              India's Biggest Student Innovation Hackathon where students solve real-world problems using AI, Web, Mobile, IoT and Cloud.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center hover:bg-primary transition-colors">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center hover:bg-primary transition-colors">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center hover:bg-primary transition-colors">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center hover:bg-primary transition-colors">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.24c3-.34 6-1.54 6-6.36 0-1.4-.5-2.6-1.3-3.5.1-.3.6-1.7-.1-3.5 0 0-1-.3-3.3 1.2a11.5 11.5 0 0 0-6 0c-2.3-1.5-3.3-1.2-3.3-1.2-.7 1.8-.2 3.2-.1 3.5-0.8.9-1.3 2.1-1.3 3.5 0 4.8 3 6 6 6.36a4.8 4.8 0 0 0-1 3.24v4"></path></svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="flex flex-col gap-3 text-sm text-gray-600">
              <li><Link href="#about" className="hover:text-slate-900 transition-colors">About Us</Link></li>
              <li><Link href="#tracks" className="hover:text-slate-900 transition-colors">Hackathon Tracks</Link></li>
              <li><Link href="#timeline" className="hover:text-slate-900 transition-colors">Event Timeline</Link></li>
              <li><Link href="#prizes" className="hover:text-slate-900 transition-colors">Prizes & Awards</Link></li>
              <li><Link href="#sponsors" className="hover:text-slate-900 transition-colors">Our Sponsors</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Legal & Contact</h4>
            <ul className="flex flex-col gap-3 text-sm text-gray-600">
              <li><Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-slate-900 transition-colors">Terms of Service</Link></li>
              <li><Link href="/code-of-conduct" className="hover:text-slate-900 transition-colors">Code of Conduct</Link></li>
              <li className="flex items-center gap-2 mt-2">
                <Mail size={14} /> contact@codeforgujarat.in
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Code for Gujarat. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">
            Built with ❤️ for the future of India.
          </p>
        </div>
      </div>
    </footer>
  );
}
