"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Cpu, Sparkles, Volume2, VolumeX } from "lucide-react";

const stats = [
  { value: "10x", label: "Faster Development", desc: "Using advanced boilerplate & AI" },
  { value: "99%", label: "Client Satisfaction", desc: "Highly rated by worldwide partners" },
  { value: "50+", label: "Projects Delivered", desc: "Successfully deployed in cloud" },
  { value: "24/7", label: "Dedicated Support", desc: "Always online for updates" },
];



export default function Hero() {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen pt-28 pb-20 flex flex-col justify-center overflow-hidden bg-transparent"
    >
      {/* Dynamic Background Spotlights */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary rounded-full blur-[160px] opacity-15 pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-secondary rounded-full blur-[160px] opacity-15 pointer-events-none animate-pulse-slow" style={{ animationDelay: "4s" }} />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(30,41,59,0.3)_1px,transparent_1px)] [background-size:20px_20px] opacity-70 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Text Content */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left">
          {/* Animated Tech Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 w-fit mb-6"
          >
            <Sparkles className="w-4 h-4 text-secondary animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Future-Ready IT Partner
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-black tracking-tight text-white leading-[1.15]"
          >
            Build <span className="text-gradient-blue text-glow-blue">Faster</span>.<br />
            Innovate <span className="text-gradient-orange text-glow-orange">Smarter</span>.<br />
            Transform with <span className="text-gradient-blue-orange">YugAnsh</span>.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-base md:text-lg text-slate-300 max-w-xl leading-relaxed font-sans"
          >
            YugAnsh delivers cutting-edge web development, software solutions, AI automation, cloud integration, and digital transformation services that help businesses grow faster and smarter.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <button
              onClick={() => handleScrollTo("contact")}
              className="px-8 py-4 bg-primary hover:bg-primary-hover text-white font-sans font-semibold rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/45 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              Get Free Consultation
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScrollTo("services")}
              className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 font-sans font-semibold rounded-full shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              Explore Services
            </button>
          </motion.div>


        </div>

        {/* Dynamic Graphic Container */}
        <div className="flex lg:col-span-5 relative justify-center lg:justify-end items-center w-full mt-10 lg:mt-0">
          {/* Floating Video Card - Premium Dark Glass (16:9 Aspect Ratio) */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: [0, -10, 0], // vertical float loop
              x: [0, 6, 0],   // horizontal sway loop
              scale: 1 
            }}
            transition={{
              y: {
                repeat: Infinity,
                duration: 5,
                ease: "easeInOut"
              },
              x: {
                repeat: Infinity,
                duration: 3.5,
                ease: "easeInOut"
              },
              opacity: { duration: 0.6 },
              scale: { duration: 0.6 }
            }}
            whileHover={{ 
              scale: 1.03,
              boxShadow: "0 25px 50px -12px rgba(10, 77, 255, 0.25)"
            }}
            className="relative w-full max-w-[500px] aspect-video rounded-3xl overflow-hidden bg-slate-950/40 border border-white/10 shadow-2xl backdrop-blur-md"
          >
            {/* Background Glow inside Card */}
            <div className="absolute -inset-10 bg-gradient-to-tr from-primary/10 via-transparent to-secondary/10 opacity-30 pointer-events-none" />

            {/* Video Player */}
            <div className="relative z-10 w-full h-full overflow-hidden rounded-3xl flex items-center justify-center">
              <video
                ref={videoRef}
                src="/logo video.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover scale-[1.3]"
              />

              {/* Mute/Unmute toggle button */}
              <button
                onClick={toggleMute}
                className="absolute bottom-4 right-4 z-20 p-2.5 rounded-full bg-slate-950/60 hover:bg-slate-900/80 border border-white/10 text-white shadow-lg backdrop-blur-md transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center"
                aria-label={isMuted ? "Unmute video" : "Mute video"}
                title={isMuted ? "Click to unmute sound" : "Click to mute sound"}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-slate-300" />
                ) : (
                  <Volume2 className="w-5 h-5 text-emerald-400" />
                )}
              </button>
            </div>

            {/* Border glow shine line */}
            <div className="absolute inset-0 border border-white/5 rounded-3xl pointer-events-none" />
          </motion.div>

          {/* Background circle badge decoration */}
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-secondary/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
        </div>
      </div>

      {/* Statistics Row */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full mt-24 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
              className="p-6 rounded-2xl glass-panel relative group hover:border-primary/45 transition-all duration-300"
            >
              <div className="text-3xl md:text-4xl font-display font-black text-slate-100 group-hover:text-glow-blue transition-all duration-300 flex items-center gap-1 hero-stat-value">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-slate-200 mt-2 font-sans">
                {stat.label}
              </div>
              <div className="text-xs text-slate-400 mt-1 font-sans">
                {stat.desc}
              </div>
              
              {/* Highlight bar hover */}
              <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-primary to-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
