"use client";

import { ArrowUp, Mail, Phone, MapPin, Globe } from "lucide-react";

const Linkedin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Twitter = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function Footer() {
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(href.substring(1));
    if (targetElement) {
      const offset = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative bg-[#030014]/60 backdrop-blur-md border-t border-white/5 pt-16 pb-8">
      {/* Top light glow edge */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          {/* Brand Info (col-span-4) */}
          <div className="lg:col-span-4 space-y-6">
            <a href="#home" onClick={(e) => handleNavClick(e, "#home")} className="flex items-center gap-2">
              <span className="font-display text-2xl font-bold tracking-tight text-white">
                <span className="text-primary">Yug</span><span className="text-secondary font-display">Ansh</span>
              </span>
            </a>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              YugAnsh delivers premium software engineering, high-performance web products, AI-powered business automations, and secure cloud operations designed to scale your operations.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Github, href: "#", label: "Github" },
                { icon: Globe, href: "#", label: "Website" },
              ].map((social, idx) => {
                const Icon = social.icon;
                return (
                  <a
                    key={idx}
                    href={social.href}
                    className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 text-slate-400 hover:text-secondary hover:border-secondary/30 transition-all flex items-center justify-center"
                    aria-label={social.label}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links (col-span-2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-semibold text-white font-sans uppercase tracking-wider font-display">Quick Links</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-sans">
              {[
                { name: "Home", href: "#home" },
                { name: "About", href: "#about" },
                { name: "Services", href: "#services" },
                { name: "Technologies", href: "#technologies" },
                { name: "Portfolio", href: "#portfolio" },
                { name: "Process", href: "#process" },
                { name: "Contact", href: "#contact" },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="hover:text-secondary transition-colors block py-0.5"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services (col-span-3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-semibold text-white font-sans uppercase tracking-wider font-display">Services</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-sans">
              {[
                "Website Development",
                "Custom Software Development",
                "Mobile App Development",
                "AI Solutions & Automation",
                "Cloud Solutions & Analytics",
                "IT Consulting",
              ].map((srv) => (
                <li key={srv}>
                  <a href="#services" onClick={(e) => handleNavClick(e, "#services")} className="hover:text-secondary transition-colors block py-0.5">
                    {srv}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details (col-span-3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-semibold text-white font-sans uppercase tracking-wider font-display">Contact Info</h4>
            <ul className="space-y-3.5 text-xs text-slate-400 font-sans">
              <li className="flex gap-2.5">
                <Phone className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <a href="tel:+919112223502" className="hover:text-secondary transition-colors">+91 9112223502</a>
                  <a href="tel:+919112223601" className="hover:text-secondary transition-colors">+91 9112223601</a>
                </div>
              </li>
              <li className="flex gap-2.5">
                <Mail className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <a href="mailto:contact@creative-i-lab.com" className="hover:text-secondary transition-colors">contact@creative-i-lab.com</a>
              </li>
              <li className="flex gap-2.5">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <a
                  href="https://maps.google.com/?q=Ataraxia,+The+Capital,+Pune+-+Solapur+Rd,+near+Mega+Center,+Magarpatta+Annexe,+Pune,+Maharashtra+411013"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-secondary transition-colors leading-relaxed"
                >
                  Ataraxia, The Capital, Pune - Solapur Rd, near Mega Center, Magarpatta Annexe, Pune, Maharashtra 411013
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright segment */}
        <div className="border-t border-white/5 pt-8 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 font-sans text-center sm:text-left">
            © 2026 YugAnsh. All Rights Reserved.
          </p>

          {/* Scroll to Top Button */}
          <button
            onClick={handleScrollToTop}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/5 text-slate-400 hover:text-secondary hover:border-secondary/30 flex items-center justify-center transition-all cursor-pointer shadow-lg"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
