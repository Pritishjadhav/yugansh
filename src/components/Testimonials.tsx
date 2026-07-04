"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote, Mail, Phone } from "lucide-react";

const reviews = [
  {
    name: "Pritish Jadhav",
    company: "TechStart India",
    email: "pritishjadhav2006@gmail.com",
    phone: "+91 8605720415",
    review: "YugAnsh transformed our legacy CRM into an automated machine. Their custom AI agents cut our user processing times in half while increasing accuracy. Absolute game changer!",
    rating: 5,
    initials: "PJ",
    gradient: "from-blue-600 to-cyan-600",
  },
  {
    name: "Vrushali Sawant",
    company: "RetailNexus",
    email: "vrushali.s@retailnexus.com",
    phone: "+91 9146987088",
    review: "The team delivered our e-commerce application three weeks ahead of schedule. The site speed is incredibly fast, and our conversion rates are up by 25% since launch.",
    rating: 5,
    initials: "VS",
    gradient: "from-purple-600 to-pink-600",
  },
  {
    name: "Amar Jadhav",
    company: "FinFlow Solutions",
    email: "amar.j@finflow.io",
    phone: "+91 9370031500",
    review: "Exceptional engineering caliber. They designed our multi-tenant cloud setup on AWS with maximum security compliance. Their developers are professional, proactive, and fast.",
    rating: 5,
    initials: "AJ",
    gradient: "from-emerald-600 to-teal-600",
  },
  {
    name: "Priyanka Jadhav",
    company: "Apex Labs",
    email: "priyanka.jadhav2369@gmail.com",
    phone: "+91 9075386153",
    review: "Their UI/UX design and frontend development team is world-class. They redesigned our entire customer portal, resulting in a 40% increase in user engagement and seamless scaling.",
    rating: 5,
    initials: "PJ",
    gradient: "from-orange-600 to-amber-600",
  },
];

export default function Testimonials() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  const handleNext = () => {
    setDirection(1);
    setActiveIdx((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIdx((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  // Auto scroll testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const activeReview = reviews[activeIdx];

  return (
    <section className="py-24 relative overflow-hidden bg-transparent">
      {/* Background blurs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-primary/10 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-secondary bg-secondary/5 px-3 py-1.5 rounded-full border border-secondary/15">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-black tracking-tight text-white mt-6 mb-4">
            Trusted by <span className="text-gradient-orange">Industry Leaders</span>
          </h2>
          <p className="text-slate-400 font-sans">
            Hear from founders, directors of technology, and enterprise leaders who trust YugAnsh for engineering excellence.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-3xl mx-auto min-h-[380px] flex flex-col justify-between">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={activeIdx}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="p-8 md:p-12 rounded-3xl glass-panel relative border border-white/5 shadow-2xl flex flex-col justify-between"
            >
              {/* Quote icon overlay */}
              <Quote className="absolute top-6 right-8 w-16 h-16 text-white/[0.03] pointer-events-none" />

              <div>
                {/* Star Rating */}
                <div className="flex items-center gap-1 mb-6 text-amber-400">
                  {[...Array(activeReview.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-base md:text-lg text-slate-200 font-sans italic leading-relaxed mb-8">
                  "{activeReview.review}"
                </p>
              </div>

              {/* Client Info Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/5 pt-6">
                <div className="flex items-center gap-4">
                  {/* Initials avatar wrapper */}
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${activeReview.gradient} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                    {activeReview.initials}
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-bold text-white font-sans font-display">
                      {activeReview.name}
                    </h4>
                  </div>
                </div>

                {/* Contact details */}
                <div className="flex flex-col gap-1.5 text-[11px] text-slate-400 font-sans sm:text-right">
                  <a
                    href={`mailto:${activeReview.email}`}
                    className="flex items-center gap-1.5 sm:justify-end hover:text-secondary transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-secondary/80" />
                    <span>{activeReview.email}</span>
                  </a>
                  <a
                    href={`tel:${activeReview.phone.replace(/\s+/g, "")}`}
                    className="flex items-center gap-1.5 sm:justify-end hover:text-primary transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-primary/80" />
                    <span>{activeReview.phone}</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Controls */}
          <div className="flex items-center justify-between mt-8">
            {/* Dots */}
            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > activeIdx ? 1 : -1);
                    setActiveIdx(i);
                  }}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    activeIdx === i ? "w-8 bg-secondary" : "w-2 bg-white/10 hover:bg-white/20"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-3">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 flex items-center justify-center border border-white/5 transition-all cursor-pointer"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 flex items-center justify-center border border-white/5 transition-all cursor-pointer"
                aria-label="Next review"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
