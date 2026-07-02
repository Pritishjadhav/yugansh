"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Compass, Paintbrush, Code, ShieldCheck, Rocket, HelpCircle } from "lucide-react";

const steps = [
  {
    num: "01",
    title: "Discovery",
    desc: "We analyze your project parameters, user personas, and target outcomes to align on goals and build a clear scope document.",
    icon: Search,
    color: "text-blue-400 border-blue-500/20 bg-blue-500/5",
  },
  {
    num: "02",
    title: "Planning",
    desc: "Selecting the architecture stack, structuring database schemas, designing flow wireframes, and setting milestone deliverables.",
    icon: Compass,
    color: "text-purple-400 border-purple-500/20 bg-purple-500/5",
  },
  {
    num: "03",
    title: "Design",
    desc: "Drafting state-of-the-art visual assets, hi-fi UI mockups, premium layouts, and fluid transitions that capture attention.",
    icon: Paintbrush,
    color: "text-pink-400 border-pink-500/20 bg-pink-500/5",
  },
  {
    num: "04",
    title: "Development",
    desc: "Writing production-ready React / Next.js code, setting up server logic APIs, and integrating robust database operations.",
    icon: Code,
    color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
  },
  {
    num: "05",
    title: "Testing",
    desc: "Rigorous QA testing, cross-browser compatibility analysis, responsiveness checks, and strict cybersecurity audits.",
    icon: ShieldCheck,
    color: "text-yellow-400 border-yellow-500/20 bg-yellow-500/5",
  },
  {
    num: "06",
    title: "Deployment",
    desc: "Configuring AWS/Azure clouds, setting up auto-scaling scripts, managing DNS paths, and launching to production.",
    icon: Rocket,
    color: "text-orange-400 border-orange-500/20 bg-orange-500/5",
  },
  {
    num: "07",
    title: "Maintenance & Support",
    desc: "24/7 server health logs monitoring, version patching, database optimization audits, and regular system enhancements.",
    icon: HelpCircle,
    color: "text-sky-400 border-sky-500/20 bg-sky-500/5",
  },
];

export default function Process() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="process" className="py-24 relative overflow-hidden bg-transparent">
      {/* Background spotlights */}
      <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] bg-secondary/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[450px] h-[450px] bg-primary/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/5 px-3 py-1.5 rounded-full border border-primary/15">
            How We Work
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-black tracking-tight text-white mt-6 mb-4">
            Our Development <span className="text-gradient-blue">Workflow</span>
          </h2>
          <p className="text-slate-400 font-sans">
            A systematic, transparent, and collaborative process designed to ensure your software is delivered on schedule and with absolute quality.
          </p>
        </div>

        {/* Desktop Interactive Split-Screen Layout (Visible on Desktop only) */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
          {/* Left Column: Interactive Steps List */}
          <div className="lg:col-span-5 space-y-3">
            {steps.map((step, idx) => {
              const IconComponent = step.icon;
              const isActive = activeStep === idx;
              return (
                <button
                  key={step.num}
                  onClick={() => setActiveStep(idx)}
                  onMouseEnter={() => setActiveStep(idx)}
                  className={`w-full text-left p-4.5 rounded-2xl transition-all duration-300 flex items-center justify-between border cursor-pointer group ${
                    isActive
                      ? "bg-white/5 border-secondary/30 text-white shadow-xl shadow-secondary/5 translate-x-2"
                      : "bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:translate-x-1"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-sm font-sans font-bold transition-colors ${isActive ? "text-secondary" : "text-slate-500 group-hover:text-slate-400"}`}>
                      {step.num}
                    </span>
                    <span className="font-display font-bold text-base lg:text-lg">
                      {step.title}
                    </span>
                  </div>
                  <IconComponent className={`w-5 h-5 transition-all duration-300 ${isActive ? "text-secondary scale-110 rotate-6" : "text-slate-500 group-hover:text-slate-300"}`} />
                </button>
              );
            })}
          </div>

          {/* Right Column: Active Card Showcase (Desktop Only) */}
          <div className="lg:col-span-7 h-full min-h-[380px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="h-full rounded-3xl glass-panel border border-white/10 p-10 flex flex-col justify-between relative overflow-hidden min-h-[380px] shadow-2xl bg-gradient-to-br from-slate-900/40 to-slate-950/40"
              >
                {/* Radial Glow matching the step */}
                <div className="absolute -top-1/4 -right-1/4 w-[350px] h-[350px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute -bottom-1/4 -left-1/4 w-[350px] h-[350px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

                {/* Big decorative number watermark */}
                <span className="absolute -bottom-10 right-4 text-[180px] font-display font-black text-white/[0.02] select-none pointer-events-none leading-none">
                  {steps[activeStep].num}
                </span>

                <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-widest text-secondary bg-secondary/15 border border-secondary/20 px-3.5 py-1 rounded-full">
                      Phase {activeStep + 1}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center border border-secondary/20 shadow-lg shadow-secondary/5">
                      {(() => {
                        const Icon = steps[activeStep].icon;
                        return <Icon className="w-6 h-6" />;
                      })()}
                    </div>
                  </div>

                  <h3 className="text-3xl font-display font-black text-white tracking-tight">
                    {steps[activeStep].title}
                  </h3>

                  <p className="text-base text-slate-300 font-sans leading-relaxed max-w-xl">
                    {steps[activeStep].desc}
                  </p>
                </div>

                <div className="relative z-10 pt-8 mt-8 border-t border-white/5 flex items-center gap-6 text-xs text-slate-400 font-sans">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span>Active Workflow Step</span>
                  </div>
                  <span>•</span>
                  <span>YugAnsh Standard</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Accordion (Visible on Mobile/Tablet only) */}
        <div className="lg:hidden space-y-4 max-w-2xl mx-auto">
          {steps.map((step, idx) => {
            const IconComponent = step.icon;
            const isOpen = activeStep === idx;
            return (
              <div
                key={step.num}
                className={`rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? "glass-panel border-secondary/30 bg-white/5"
                    : "border-white/5 bg-transparent"
                }`}
              >
                {/* Accordion Header */}
                <button
                  onClick={() => setActiveStep(isOpen ? -1 : idx)}
                  className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-sm font-sans font-bold ${isOpen ? "text-secondary" : "text-slate-500"}`}>
                      {step.num}
                    </span>
                    <span className="font-display font-bold text-base text-white">
                      {step.title}
                    </span>
                  </div>
                  <div className={`p-2 rounded-lg transition-all duration-300 ${isOpen ? "bg-secondary/15 text-secondary" : "bg-white/5 text-slate-400"}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                </button>

                {/* Accordion Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-4">
                        <p className="text-sm text-slate-300 font-sans leading-relaxed">
                          {step.desc}
                        </p>
                        <div className="flex justify-between items-center text-[10px] text-slate-500 font-sans pt-2">
                          <span className="font-bold uppercase tracking-wider">
                            Phase {idx + 1}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="w-1 h-1 bg-secondary rounded-full" />
                            Standard
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
