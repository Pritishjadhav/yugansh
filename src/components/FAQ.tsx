"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "What services does YugAnsh provide?",
    a: "YugAnsh provides a comprehensive suite of IT solutions including high-performance website development (React, Next.js), custom enterprise software development, native/hybrid mobile app engineering, intelligent AI solutions and workflow automation, secure cloud architectures (AWS, Azure), data analytics, and user experience (UI/UX) design.",
  },
  {
    q: "How long does development take?",
    a: "The duration depends on the project scope and complexity. A landing page or a basic web tool can take 2-4 weeks, whereas complex SaaS structures, custom CRM solutions, or full-scale AI automated systems can take 8-16 weeks. We use agile methodologies to ship working code cycles incrementally.",
  },
  {
    q: "Do you provide support?",
    a: "Yes, we offer structured post-release maintenance and support plans. This includes 24/7 server health tracking, database optimization checking, security vulnerability audits, feature modifications, and framework version upgrades.",
  },
  {
    q: "Can you build custom software?",
    a: "Absolutely. We specialize in custom software engineering tailored to your specific business requirements. We build scalable backend layers, microservices architectures, internal company portals, client-facing dashboards, and automated database integrations.",
  },
  {
    q: "Do you offer AI solutions?",
    a: "Yes, AI solutions are one of our core specialties. We integrate Large Language Models (LLMs) like GPT-4, set up vector search databases, design automated email outreach agents, build intelligent customer query classifiers, and construct custom workflow automations using LangChain and Make.",
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggleFAQ = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 relative overflow-hidden bg-transparent">
      {/* Background radial spotlights */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/3 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" style={{ animationDelay: "4s" }} />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left Column: Heading & Summary */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/5 px-3 py-1.5 rounded-full border border-primary/15">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-black tracking-tight text-white leading-tight">
              Frequently Asked <br />
              <span className="text-gradient-blue">Questions</span>
            </h2>
            <p className="text-slate-400 font-sans text-sm md:text-base leading-relaxed">
              Quick answers to standard questions about our custom development, software architecture, deployment, and integration procedures.
            </p>
            
            {/* Quick Contact Prompt Card */}
            <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/20 space-y-4">
              <h3 className="text-sm font-bold text-white">Still have questions?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Can't find the answer you're looking for? Reach out to our engineering consulting team directly.
              </p>
              <a 
                href="#contact"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-secondary-hover transition-colors"
              >
                <span>Contact support team</span>
                <span className="text-sm">→</span>
              </a>
            </div>
          </div>

          {/* Right Column: Accordion List */}
          <div className="lg:col-span-7 space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-300 ${
                    isOpen
                      ? "border-primary/30 bg-slate-900/40 shadow-lg shadow-primary/5"
                      : "border-white/5 bg-slate-900/10 hover:border-white/10 hover:bg-slate-900/20"
                  }`}
                >
                  <button
                    onClick={() => toggleFAQ(idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 text-white cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <span className={`font-mono text-xs font-bold ${isOpen ? "text-primary" : "text-slate-500"}`}>
                        {(idx + 1).toString().padStart(2, '0')}
                      </span>
                      <span className={`font-display font-bold text-sm md:text-base transition-colors duration-300 ${isOpen ? "text-primary" : "group-hover:text-slate-200"}`}>
                        {faq.q}
                      </span>
                    </div>
                    
                    <span className={`flex-shrink-0 p-2 rounded-xl border transition-all duration-300 ${
                      isOpen 
                        ? "bg-primary/10 border-primary/30 text-primary rotate-180" 
                        : "bg-white/5 border-white/5 text-slate-400 group-hover:text-white group-hover:bg-white/10"
                    }`}>
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-6 text-xs md:text-sm text-slate-300 font-sans leading-relaxed border-t border-white/5 pt-4 pl-10">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
