"use client";

import { motion } from "framer-motion";
import { Target, Eye, ShieldCheck, Award } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-24 relative overflow-hidden bg-transparent">
      {/* Background glow spots */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Side: Mission & Vision Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6 order-2 lg:order-1">
            {/* Card 1: Mission */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 rounded-2xl glass-panel relative group hover:border-secondary/40 transition-all duration-300 flex flex-col justify-between min-h-[280px]"
            >
              <div>
                <div className="p-3 bg-secondary/10 text-secondary w-fit rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold text-secondary mb-3">Our Mission</h3>
                <p className="text-sm text-slate-300 font-sans leading-relaxed">
                  Deliver innovative, reliable, and high-performance technology solutions that accelerate business growth and create long-term value.
                </p>
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-bl-full group-hover:bg-secondary/10 transition-colors duration-300 pointer-events-none" />
            </motion.div>

            {/* Card 2: Vision */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="p-8 rounded-2xl glass-panel relative group hover:border-primary/40 transition-all duration-300 flex flex-col justify-between min-h-[280px] sm:translate-y-6"
            >
              <div>
                <div className="p-3 bg-primary/10 text-primary w-fit rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold text-primary mb-3">Our Vision</h3>
                <p className="text-sm text-slate-300 font-sans leading-relaxed">
                  Become a trusted global technology partner known for engineering excellence, design innovation, and transforming standard business concepts into digital landmarks.
                </p>
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full group-hover:bg-primary/10 transition-colors duration-300 pointer-events-none" />
            </motion.div>
          </div>

          {/* Right Side: narrative & company description */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/5 px-3 py-1.5 rounded-full border border-primary/15">
                Who We Are
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-black tracking-tight text-white mt-6 mb-8 leading-tight">
                <span className="text-gradient-orange">Empowering Businesses Through</span> <span className="text-gradient-blue">Digital Evolution</span>
              </h2>
              <p className="text-base text-slate-300 font-sans leading-relaxed mb-6">
                YugAnsh is a modern IT solutions company helping startups, businesses, and enterprises transform their ideas into powerful digital realities. We combine strategic thinking with engineering craftsmanship to build products that perform and scale.
              </p>
              <p className="text-base text-slate-300 font-sans leading-relaxed mb-8">
                Based in Pune, India, we specialize in high-end web development, custom enterprise software engineering, AI-powered automation solutions, secure cloud deployments, and premium user experience (UI/UX) design.
              </p>

              {/* Mini Features Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/5 pt-8">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 text-emerald-400 p-1 bg-emerald-500/10 rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-slate-200 font-sans">Enterprise-Grade Security</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 text-emerald-400 p-1 bg-emerald-500/10 rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-slate-200 font-sans">Engineering Excellence</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
