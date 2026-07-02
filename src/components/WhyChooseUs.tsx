"use client";

import { motion } from "framer-motion";
import {
  Users,
  Zap,
  Layers,
  Lock,
  Maximize,
  Coins,
  HeartHandshake,
  Boxes
} from "lucide-react";

const features = [
  {
    title: "Expert Team",
    desc: "A highly-skilled squad of software designers, full-stack engineers, and cloud architects working for your success.",
    icon: Users,
    colSpan: "lg:col-span-2",
    tags: ["Senior Developers", "Cloud Certified Architects", "Agile Product Leads"],
    bgGradient: "from-blue-500/10 to-cyan-500/10",
    borderColor: "border-blue-500/20",
    iconColor: "text-blue-400",
    glowGradient: "from-blue-500/10 via-cyan-500/5 to-transparent",
  },
  {
    title: "Fast Delivery",
    desc: "Agile delivery frameworks and optimized scaffolding methods to launch your product to market 10x faster.",
    icon: Zap,
    colSpan: "lg:col-span-1",
    bgGradient: "from-amber-500/10 to-orange-500/10",
    borderColor: "border-amber-500/20",
    iconColor: "text-amber-400",
    glowGradient: "from-amber-500/10 via-orange-500/5 to-transparent",
  },
  {
    title: "Modern Technologies",
    desc: "Cutting-edge stacks (Next.js, Tailwind v4, React 19) for blazing-fast speed and maximum layout capabilities.",
    icon: Layers,
    colSpan: "lg:col-span-1",
    bgGradient: "from-indigo-500/10 to-violet-500/10",
    borderColor: "border-indigo-500/20",
    iconColor: "text-indigo-400",
    glowGradient: "from-indigo-500/10 via-violet-500/5 to-transparent",
  },
  {
    title: "Secure Development",
    desc: "Strict compliance with top security guidelines, automated tests, and encryption protocols protecting data assets.",
    icon: Lock,
    colSpan: "lg:col-span-1",
    bgGradient: "from-emerald-500/10 to-teal-500/10",
    borderColor: "border-emerald-500/20",
    iconColor: "text-emerald-400",
    glowGradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
  },
  {
    title: "Scalable Solutions",
    desc: "Microservices and cloud architectures engineered to handle sudden spikes in user traffic seamlessly.",
    icon: Maximize,
    colSpan: "lg:col-span-2",
    tags: ["Kubernetes Clustering", "Redis Cache Layers", "AWS Elastic Scaling"],
    bgGradient: "from-rose-500/10 to-pink-500/10",
    borderColor: "border-rose-500/20",
    iconColor: "text-rose-400",
    glowGradient: "from-rose-500/10 via-pink-500/5 to-transparent",
  },
  {
    title: "Affordable Pricing",
    desc: "Transparent and dynamic project budgets built to fit start-up parameters while ensuring enterprise-level output.",
    icon: Coins,
    colSpan: "lg:col-span-1",
    bgGradient: "from-yellow-500/10 to-amber-500/10",
    borderColor: "border-yellow-500/20",
    iconColor: "text-yellow-400",
    glowGradient: "from-yellow-500/10 via-amber-500/5 to-transparent",
  },
  {
    title: "Dedicated Support",
    desc: "Round-the-clock technical support, server status checking, and continuous patches to maintain peak performance.",
    icon: HeartHandshake,
    colSpan: "lg:col-span-2",
    tags: ["24/7 Server Monitoring", "99.9% Uptime SLA", "Direct Engineer Access"],
    bgGradient: "from-sky-500/10 to-blue-500/10",
    borderColor: "border-sky-500/20",
    iconColor: "text-sky-400",
    glowGradient: "from-sky-500/10 via-blue-500/5 to-transparent",
  },
  {
    title: "Future-Ready Architecture",
    desc: "Forward-compatible APIs, modular clean code, and AI hooks that let your software scale with ease.",
    icon: Boxes,
    colSpan: "lg:col-span-2",
    tags: ["REST & gRPC APIs", "Docker Integration", "Modular Codebase"],
    bgGradient: "from-red-500/10 to-rose-500/10",
    borderColor: "border-red-500/20",
    iconColor: "text-red-400",
    glowGradient: "from-red-500/10 via-rose-500/5 to-transparent",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 relative overflow-hidden bg-transparent">
      {/* Background spotlights */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[350px] h-[350px] bg-secondary/5 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-primary/5 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-secondary bg-secondary/5 px-3 py-1.5 rounded-full border border-secondary/15">
            Why Choose YugAnsh
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-black tracking-tight text-white mt-6 mb-4">
            Designed for <span className="text-gradient-blue">High Performance</span>
          </h2>
          <p className="text-slate-400 font-sans">
            We don't just write code. We construct premium, robust architectures that grow with your company.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon;
            const isWide = feature.colSpan === "lg:col-span-2";
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className={`p-8 rounded-3xl border border-white/5 bg-slate-900/10 relative group hover:border-white/10 transition-all duration-500 flex flex-col justify-between overflow-hidden ${feature.colSpan}`}
              >
                {/* Neon Ambient Halo Blur Behind Card on Hover */}
                <div className={`absolute -inset-px rounded-3xl bg-gradient-to-br ${feature.glowGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10`} />

                <div>
                  <div className="flex justify-between items-start mb-6">
                    {/* Themed Icon Capsule */}
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.bgGradient} border ${feature.borderColor} ${feature.iconColor} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 flex items-center justify-center shadow-lg shadow-black/50`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    {/* Outline Index Indicator */}
                    <span className="text-2xl font-black font-mono text-white/5 select-none group-hover:text-white/10 transition-colors duration-300">
                      {idx < 9 ? `0${idx + 1}` : idx + 1}
                    </span>
                  </div>

                  {/* Heading */}
                  <h3 className="text-lg font-display font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-colors duration-300 font-display">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-400 font-sans leading-relaxed mb-6">
                    {feature.desc}
                  </p>

                  {/* Skills/Tags listed on wide featured cards */}
                  {isWide && feature.tags && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {feature.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] font-sans font-semibold tracking-wide text-slate-300 bg-white/5 border border-white/5 px-2.5 py-1 rounded-lg hover:border-primary/20 hover:text-white transition-all duration-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Micro hover edge accent line */}
                <div className={`absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r ${feature.glowGradient} scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
