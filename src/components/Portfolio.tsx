"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Globe, Cpu, Smartphone, CloudLightning } from "lucide-react";

const categories = ["All", "Web", "Mobile", "AI Solutions", "Cloud"];

const projects = [
  {
    name: "E-Commerce Nexus",
    category: "Web",
    tech: ["Next.js", "Tailwind CSS", "MongoDB", "Stripe"],
    desc: "A premium, lightning-fast digital storefront with custom checkout lanes, live stock queries, and dynamic SEO endpoints.",
    demoUrl: "#",
    icon: Globe,
    gradient: "from-blue-600/20 via-cyan-600/10 to-transparent",
  },
  {
    name: "Pulse Health App",
    category: "Mobile",
    tech: ["React Native", "Firebase", "TypeScript", "Expo"],
    desc: "Cross-platform Android & iOS clinical application featuring Bluetooth sensor hooks, patient logs, and doctors' alerts.",
    demoUrl: "#",
    icon: Smartphone,
    gradient: "from-emerald-600/20 via-teal-600/10 to-transparent",
  },
  {
    name: "Cognitive CRM Engine",
    category: "AI Solutions",
    tech: ["OpenAI API", "Node.js", "Python", "Pinecone"],
    desc: "AI-driven customer relationship manager that automatically classifies incoming client tickets, draft answers, and aggregates logs.",
    demoUrl: "#",
    icon: Cpu,
    gradient: "from-purple-600/20 via-pink-600/10 to-transparent",
  },
  {
    name: "FinCloud Analytics",
    category: "Cloud",
    tech: ["AWS S3", "Docker", "Kubernetes", "MySQL"],
    desc: "Distributed cloud infrastructure parsing massive transaction histories, deploying secure micro-billing nodes with auto-scaling.",
    demoUrl: "#",
    icon: CloudLightning,
    gradient: "from-orange-600/20 via-red-600/10 to-transparent",
  },
  {
    name: "AI Sales Automator",
    category: "AI Solutions",
    tech: ["GPT-4", "LangChain", "Node.js", "Zapier"],
    desc: "Autonomous sales pipeline agent searching leads databases, drafting personalized email cycles, and scheduling call bookings.",
    demoUrl: "#",
    icon: Cpu,
    gradient: "from-red-600/20 via-amber-600/10 to-transparent",
  },
  {
    name: "Agile Workspace Platform",
    category: "Web",
    tech: ["React.js", "TypeScript", "PostgreSQL", "Tailwind CSS"],
    desc: "Modern Kanban board workspace enabling live team collaboration, interactive charts, and third-party API webhooks.",
    demoUrl: "#",
    icon: Globe,
    gradient: "from-fuchsia-600/20 via-purple-600/10 to-transparent",
  },
];

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredProjects = activeFilter === "All"
    ? projects
    : projects.filter(p => p.category === activeFilter);

  return (
    <section id="portfolio" className="py-24 relative overflow-hidden bg-transparent">
      {/* Background radial spotlight */}
      <div className="absolute bottom-1/4 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-secondary bg-secondary/5 px-3 py-1.5 rounded-full border border-secondary/15">
              Our Portfolio
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-black tracking-tight text-white mt-6 mb-4">
              Featured <span className="text-gradient-orange">Case Studies</span>
            </h2>
            <p className="text-slate-400 font-sans max-w-2xl">
              Explore the digital platforms, software architectures, and automated agent pipelines we have engineered for clients globally.
            </p>
          </div>

          {/* Filtering Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-lg font-sans text-xs font-bold tracking-wide transition-all cursor-pointer ${
                  activeFilter === cat
                    ? "bg-secondary text-white shadow-md shadow-secondary/20"
                    : "text-slate-400 hover:text-white bg-white/5 hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="min-h-[400px]">
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => {
                const ProjectIcon = project.icon;
                return (
                  <motion.div
                    layout
                    key={project.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="group rounded-2xl glass-panel overflow-hidden border border-white/5 flex flex-col justify-between hover:border-secondary/40 transition-all duration-300"
                  >
                    {/* Simulated App Screenshot / Gradient Area */}
                    <div className={`relative h-48 bg-gradient-to-br ${project.gradient} border-b border-white/5 flex items-center justify-center p-6 overflow-hidden`}>
                      {/* Abstract grid */}
                      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:12px_12px] opacity-75" />
                      
                      {/* Floating graphic */}
                      <div className="w-16 h-16 rounded-2xl bg-slate-950/80 border border-white/10 flex items-center justify-center text-slate-300 shadow-xl group-hover:scale-115 group-hover:border-secondary/50 group-hover:text-secondary transition-all duration-300">
                        <ProjectIcon className="w-8 h-8" />
                      </div>

                      {/* Floating tech pill tags */}
                      <div className="absolute bottom-4 left-4 flex flex-wrap gap-1">
                        {project.tech.slice(0, 2).map((t) => (
                          <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-slate-900/95 text-slate-300 border border-white/5">
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Top category indicator */}
                      <div className="absolute top-4 right-4 text-[9px] font-bold uppercase tracking-wider text-slate-400 bg-white/5 border border-white/5 px-2 py-0.5 rounded">
                        {project.category}
                      </div>
                    </div>

                    {/* Meta info & Description */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-display font-bold text-white mb-2 group-hover:text-secondary transition-colors font-display">
                          {project.name}
                        </h3>
                        <p className="text-xs text-slate-400 font-sans leading-relaxed font-sans">
                          {project.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
