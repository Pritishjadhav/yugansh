"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, Server, Database, Cloud, Cpu, ArrowUpRight } from "lucide-react";

// Inline SVGs for tech logos
const ReactLogo = () => (
  <svg className="w-6 h-6 text-[#61DAFB] fill-none stroke-current" viewBox="-11.5 -10.23 23 20.46" strokeWidth="1.2">
    <circle cx="0" cy="0" r="2.05" fill="currentColor"/>
    <ellipse rx="11" ry="4.2"/>
    <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
    <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
  </svg>
);

const NextjsLogo = () => (
  <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 128 128">
    <path d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64 64-28.7 64-64S99.3 0 64 0zm37.9 98.7L67.5 54.4V96H56V40h10.9l29.4 39.8V40H108v58.7h-6.1z"/>
  </svg>
);

const JavaScriptLogo = () => (
  <svg className="w-6 h-6 text-[#F7DF1E] fill-current" viewBox="0 0 24 24">
    <path d="M3 3h18v18H3V3zm11.5 11.8c-.3 1.1-.9 1.9-1.9 2.5-1-.5-2.2-.8-3.7-.8-1.4 0-2.5-.3-3.4-.9-.9-.6-1.5-1.5-1.7-2.6H6.1c.2.6.5 1.1 1 1.4.5.3 1.1.5 1.9.5.9 0 1.5-.2 2-.7.4-.4.6-1 .6-1.8V9.1h2.2v5.7zm6.7 1.8c-.3 1-.9 1.7-1.7 2.2-.8.5-1.9.7-3.1.7-1.5 0-2.6-.4-3.5-1.1-.8-.7-1.3-1.7-1.4-2.9h2.2c.1.6.4 1.1.9 1.4.5.3 1.1.5 1.9.5.8 0 1.4-.2 1.8-.6.4-.3.6-.8.6-1.4 0-.5-.2-.9-.5-1.2-.3-.3-.9-.6-1.7-.9l-1.5-.5c-1.1-.4-1.9-1-2.4-1.6-.5-.7-.8-1.5-.8-2.6 0-1 .3-1.9 1-2.5.7-.7 1.7-1 3-1 1.3 0 2.3.3 3 .9.7.6 1.1 1.4 1.3 2.4h-2.1c-.1-.5-.4-.9-.8-1.1-.4-.2-.9-.3-1.5-.3-.7 0-1.2.2-1.6.5-.3.3-.5.7-.5 1.2 0 .4.2.8.5 1 .3.3.8.5 1.5.8l1.6.5c1.2.4 2 .9 2.5 1.6.6.6.8 1.5.8 2.6z"/>
  </svg>
);

const TypeScriptLogo = () => (
  <svg className="w-6 h-6 text-[#3178C6] fill-current" viewBox="0 0 24 24">
    <path d="M0 0h24v24H0V0zm22.4 17.6c-.2-1-.7-1.8-1.4-2.4-.7-.6-1.6-1-2.6-1.2l-1.2-.3c-.8-.2-1.3-.4-1.7-.7-.3-.3-.5-.7-.5-1.1 0-.5.2-.9.6-1.2.4-.3.9-.4 1.6-.4.7 0 1.2.2 1.6.5.4.3.7.8.8 1.4h2.1c-.1-1.4-.7-2.5-1.7-3.2-1-.7-2.3-1-3.9-1-1.6 0-3 .4-4 1.2-1 .8-1.5 1.9-1.5 3.3 0 1.1.3 2 1 2.7.7.7 1.6 1.2 2.7 1.4l1.3.3c.9.2 1.6.5 2 .8.4.3.6.8.6 1.3 0 .6-.2 1.1-.7 1.4-.5.4-1.1.5-1.9.5-1 0-1.7-.3-2.2-.8-.5-.5-.8-1.3-.9-2.2H8.3c.1 1.8.7 3.2 1.9 4.1 1.2.9 2.8 1.3 4.9 1.3 2 0 3.6-.4 4.7-1.3 1.1-.9 1.6-2.1 1.6-3.6v-.2zm-12.7.9V5.6H7.5V18.5H9.7z"/>
  </svg>
);

const NodejsLogo = () => (
  <svg className="w-6 h-6 text-[#339933] fill-current" viewBox="0 0 24 24">
    <path d="M12 2L3 7v10l9 5 9-5V7L12 2zm7.5 13.9l-7.5 4.2-7.5-4.2V8.1l7.5-4.2 7.5 4.2v7.8zm-9-4.8v3.4l2.5 1.4 2.5-1.4v-3.4l-2.5-1.4-2.5 1.4z"/>
  </svg>
);

const PythonLogo = () => (
  <svg className="w-6 h-6 text-[#3776AB] fill-current" viewBox="0 0 24 24">
    <path d="M11.9 2C6.9 2 7.1 4.1 7.1 4.1l.1 2.1h4.8v.7H5.1S2 7.2 2 12.1c0 4.9 2.7 4.8 2.7 4.8l1.6-.1v-2.3c0-2.6 2.1-4.7 4.7-4.7h4.8v-.9s.2-4.9-3.9-4.9H11.9zm3.2 4.9c-.4 0-.7.3-.7.7s.3.7.7.7.7-.3.7-.7-.3-.7-.7-.7zm-3.2 10.2c5 0 4.8-2.1 4.8-2.1l-.1-2.1H11.8v-.7h6.9S22 12.8 22 7.9c0-4.9-2.7-4.8-2.7-4.8l-1.6.1v2.3c0 2.6-2.1 4.7-4.7 4.7H8.2v.9s-.2 4.9 3.9 4.9h2.1-.2zm-3.2-.8c.4 0 .7-.3.7-.7s-.3-.7-.7-.7-.7.3-.7.7.3.7.7.7z"/>
  </svg>
);

const MySQLLogo = () => (
  <svg className="w-6 h-6 text-[#4479A1] fill-current" viewBox="0 0 24 24">
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.7 13.6c-.3.4-.6.8-1 1.1-.4.3-1 .6-1.6.8-.6.2-1.3.3-2 .3s-1.4-.1-2-.3c-.6-.2-1.2-.5-1.6-.8-.4-.3-.7-.7-1-1.1-.3-.4-.4-.9-.4-1.4 0-.4.1-.7.2-1s.3-.6.6-.8c.3-.2.6-.4 1-.5.4-.1.9-.2 1.4-.2.8 0 1.5.1 2.2.3v-2c0-.4-.1-.7-.3-1-.2-.3-.5-.5-.9-.6-.4-.1-.9-.2-1.4-.2-.8 0-1.5.1-2.2.4l-.5-1.8c.8-.4 1.8-.6 2.8-.6 1 0 1.8.2 2.5.5.7.3 1.2.8 1.6 1.4.4.6.6 1.4.6 2.3v5.6c0 .4.1.7.3.9.2.2.5.3.9.3.2 0 .4 0 .6-.1l.3 1.8c-.4.2-.9.3-1.4.3-.6 0-1-.1-1.3-.3-.3-.2-.5-.5-.6-1zm-1.8-3.1c-.4-.1-.8-.2-1.3-.2-.4 0-.8.1-1.1.2-.3.1-.5.3-.7.5-.2.2-.3.5-.3.8 0 .3.1.6.3.8.2.2.4.3.7.4.3.1.7.1 1.1.1.4 0 .8-.1 1.2-.2.4-.1.6-.3.8-.5.2-.2.3-.5.3-.8v-1.1z"/>
  </svg>
);

const MongoDBLogo = () => (
  <svg className="w-6 h-6 text-[#47A248] fill-current" viewBox="0 0 24 24">
    <path d="M12 1.5C11.5 1.5 5 8.5 5 13.5c0 3.6 2.9 6.5 6.5 6.5s6.5-2.9 6.5-6.5C18 8.5 11.5 1.5 12 1.5zm.7 17.5c-2.6 0-4.7-2.1-4.7-4.7 0-.7.2-1.4.5-2 .1-.2.3-.3.5-.3s.4.1.5.3c.3.6.5 1.3.5 2 0 1.5 1.2 2.7 2.7 2.7.2 0 .3.1.3.3s-.1.3-.3.3z"/>
  </svg>
);

const AWSLogo = () => (
  <svg className="w-6 h-6 text-[#FF9900] fill-current" viewBox="0 0 24 24">
    <path d="M14.5 17.3c-2.3 1.2-5.3 1.8-8.2 1.8-4.2 0-7.8-1.2-10.4-3.1-.3-.2-.3-.6 0-.8l1.1-1c.2-.2.5-.2.8 0 2.1 1.5 5.1 2.3 8.3 2.3 2.4 0 5-.5 7.1-1.5.4-.2.8.2.5.6l-.8 1.3c-.2.2-.2.3-.5.4zm1.4-2.8c-.3-.4-1.8-.2-2.5-.1-.3 0-.4-.3-.1-.5 1-.7 2.6-.5 2.9-.2.3.3.1 1.9-.6 2.7-.2.2-.5.1-.4-.2.2-.8.5-2.2.2-2.7zM12.3 6c-2.6 0-4.2 1.7-4.2 4.1 0 2.1 1.3 3.3 3.3 3.3.6 0 1.2-.1 1.7-.4V10.2c-.6.3-1.1.4-1.5.4-.8 0-1.2-.4-1.2-1.1 0-.9.7-1.3 2.1-1.3.4 0 .6 0 .7.1v-.8c0-.9-.5-1.4-1.6-1.4c-.6 0-1.3.2-1.9.5l-.6-1.1c.9-.5 2.1-.7 3.1-.7 2.1 0 3.3.9 3.3 2.9v4.9h-1.8V12.7c-.5.5-1.3.8-2.1.8-2 0-3.3-1.2-3.3-3 0-2.3 1.8-3.7 4.5-3.7 1 0 1.7.2 2.2.4v-.3c0-1.2-.7-1.8-2-1.8zm6.5.2L16.2 13h1.8l1.6-4.9 1.6 4.9H23l-2.6-6.8h-1.6zm-11.7.7v5.6c0 .8.5 1.1 1.2 1.1.4 0 .7-.1.9-.2l.3 1.3c-.4.2-.9.3-1.6.3-1.6 0-2.5-.8-2.5-2.4V6.9H5.4V5.7h1.4V3.8l1.7-.5v2.4H10v1.2H7.1z"/>
  </svg>
);

const AzureLogo = () => (
  <svg className="w-6 h-6 text-[#0078D4] fill-current" viewBox="0 0 24 24">
    <path d="M12.983 2.317a.64.64 0 00-.776-.11L1.24 7.625c-.407.2-.64.602-.64 1.053v6.645c0 .45.233.853.64 1.053l10.967 5.418c.24.119.536.119.776 0l10.967-5.418c.407-.2.64-.602.64-1.053V8.678c0-.45-.233-.853-.64-1.053L12.983 2.317zm.006 1.821l9.42 4.653-9.42 4.653V4.138zm-1.012.001v9.306l-9.42-4.653 9.42-4.653zm-.001 10.999l9.42 4.653-9.42 4.653v-9.306zm-1.011 0v9.306l-9.42-4.653 9.42-4.653z"/>
  </svg>
);

const FirebaseLogo = () => (
  <svg className="w-6 h-6 text-[#FFCA28] fill-current" viewBox="0 0 24 24">
    <path d="M3.89 15.67L5.26 5.58a.48.48 0 01.89-.18l2.9 5.42 4.2-7.96a.48.48 0 01.88.08l6 12.73a.48.48 0 01-.52.66H4.26a.48.48 0 01-.37-.66z"/>
  </svg>
);

const OpenAILogo = () => (
  <svg className="w-6 h-6 text-[#00A244] fill-current" viewBox="0 0 24 24">
    <path d="M21.3,10.1c-0.2-0.8-0.6-1.5-1.2-2c0.2-0.7,0.1-1.5-0.2-2.2c-0.4-0.7-1-1.2-1.8-1.5C18,3.7,17.7,3,17.1,2.5 C16.5,2,15.7,1.8,15,1.9C14.2,1.2,13.2,0.8,12,0.8S9.8,1.2,9,1.9C8.3,1.8,7.5,2,6.9,2.5C6.3,3,6,3.7,5.8,4.4C5,4.7,4.4,5.2,4,5.9 C3.7,6.6,3.6,7.4,3.8,8.1C3.2,8.6,2.8,9.3,2.6,10.1C2.4,10.9,2.5,11.7,2.9,12.4C2.7,13.1,2.8,13.9,3.2,14.6c0.4,0.7,1,1.2,1.8,1.5 c0.1,0.7,0.4,1.4,1,1.9s1.3,0.7,2,0.6c0.8,0.7,1.8,1.1,3,1.1s2.2-0.4,3-1.1c0.7,0.1,1.5-0.1,2-0.6s1-1.2,1.2-1.9 c0.8-0.3,1.4-0.8,1.8-1.5c0.4-0.7,0.5-1.5,0.3-2.2C21.5,11.7,21.6,10.9,21.3,10.1z M12.8,3.3l1.8,1v2.1l-1.8-1V3.3z M6.9,5.7 l1.8-1v2.1l-1.8,1V5.7z M6,12v-2.1l1.8,1V13L6,12z M8.8,15.7l-1.8-1V12.6l1.8,1V15.7z M11.2,18.3l-1.8-1v-2.1l1.8,1V18.3z M12,14.2 l-1.8-1v-2.1l1.8,1V14.2z M12,9.8L10.2,8.8l1.8-1l1.8,1L12,9.8z M14.8,15.7l-1.8-1v-2.1l1.8,1V15.7z M18,12l-1.8-1v-2.1l1.8,1V12z M17.1,8.3l-1.8-1v-2.1l1.8,1V8.3z"/>
  </svg>
);

const MachineLearningLogo = () => (
  <svg className="w-6 h-6 text-[#A855F7] fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 9h6v6H9z" />
    <path d="M9 12h6M12 9v6M9 3v6M15 3v6M9 15v6M15 15v6M3 9h6M3 15h6M15 9h6M15 15h6" />
  </svg>
);

const AutomationToolsLogo = () => (
  <svg className="w-6 h-6 text-[#FF5A00] fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="16" y="3" width="6" height="6" rx="1" />
    <rect x="2" y="15" width="6" height="6" rx="1" />
    <rect x="16" y="15" width="6" height="6" rx="1" />
    <path d="M16 6H10a2 2 0 0 0-2 2v7M16 18H10a2 2 0 0 1-2-2" />
  </svg>
);

const getLogo = (name: string) => {
  switch (name.toLowerCase()) {
    case "react":
      return <ReactLogo />;
    case "next.js":
      return <NextjsLogo />;
    case "javascript":
      return <JavaScriptLogo />;
    case "typescript":
      return <TypeScriptLogo />;
    case "node.js":
      return <NodejsLogo />;
    case "python":
      return <PythonLogo />;
    case "mysql":
      return <MySQLLogo />;
    case "mongodb":
      return <MongoDBLogo />;
    case "aws":
      return <AWSLogo />;
    case "azure":
      return <AzureLogo />;
    case "firebase":
      return <FirebaseLogo />;
    case "openai":
      return <OpenAILogo />;
    case "machine learning":
      return <MachineLearningLogo />;
    case "automation tools":
      return <AutomationToolsLogo />;
    default:
      return null;
  }
};

const categories = [
  { id: "frontend", name: "Frontend", icon: Code },
  { id: "backend", name: "Backend", icon: Server },
  { id: "database", name: "Database", icon: Database },
  { id: "cloud", name: "Cloud", icon: Cloud },
  { id: "ai", name: "AI & Automation", icon: Cpu },
];

const techData: Record<string, Array<{ name: string; desc: string; label: string }>> = {
  frontend: [
    { name: "React", desc: "A JavaScript library for building component-based high-performance user interfaces.", label: "Library" },
    { name: "Next.js", desc: "The enterprise-ready React framework with pre-rendering, routing, and server components.", label: "Framework" },
    { name: "JavaScript", desc: "The core programming language powering web interactivity and client-side logic.", label: "Language" },
    { name: "TypeScript", desc: "Strongly typed programming language that builds on JavaScript for robust application code.", label: "Language" },
  ],
  backend: [
    { name: "Node.js", desc: "Chrome's V8 JavaScript engine runtime for lightweight, event-driven web backend applications.", label: "Runtime" },
    { name: "Python", desc: "Versatile programming language for creating secure web APIs, system logic, and microservices.", label: "Language" },
  ],
  database: [
    { name: "MySQL", desc: "Relational database system managing structured data with complex query schemas safely.", label: "SQL Database" },
    { name: "MongoDB", desc: "Document-oriented NoSQL database system built for modern, scale-out web applications.", label: "NoSQL Database" },
  ],
  cloud: [
    { name: "AWS", desc: "Secure cloud hosting, storage buckets, database instances, and global edge CDNs.", label: "Cloud Provider" },
    { name: "Azure", desc: "Microsoft's cloud infrastructure optimized for large-scale enterprise integration.", label: "Cloud Provider" },
    { name: "Firebase", desc: "Real-time databases, authentication structures, and serverless hosting modules.", label: "BaaS Platform" },
  ],
  ai: [
    { name: "OpenAI", desc: "Integration of GPT-4, embeddings, and generative agents into standard SaaS applications.", label: "API Integrations" },
    { name: "Machine Learning", desc: "Custom neural networks, statistical data models, and predictive algorithm deployment.", label: "Core AI" },
    { name: "Automation Tools", desc: "Workflows built using LangChain, Zapier, and Make to connect AI services.", label: "Workflows" },
  ],
};

export default function Technologies() {
  const [activeTab, setActiveTab] = useState("frontend");

  return (
    <section id="technologies" className="py-24 relative overflow-hidden bg-transparent">
      {/* Glow spots */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/5 px-3 py-1.5 rounded-full border border-primary/15">
            Our Stack
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-black tracking-tight text-white mt-6 mb-4">
            <span className="text-gradient-orange">Powering Modern</span> <span className="text-gradient-blue">Architectures</span>
          </h2>
          <p className="text-slate-400 font-sans">
            We select specific, future-ready languages and cloud tools to build fast, robust, and clean applications.
          </p>
        </div>

        {/* Categories Tab Bar */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 p-2 rounded-2xl glass-panel w-fit mx-auto">
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`relative px-5 py-3 rounded-xl font-sans text-sm font-semibold tracking-wide flex items-center gap-2 transition-colors duration-300 cursor-pointer ${
                  isActive ? "text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="techTabPill"
                    className="absolute inset-0 bg-primary rounded-xl -z-10 shadow-lg shadow-primary/25"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
                <IconComponent className="w-4 h-4" />
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Tech Grid Content */}
        <div className="min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {techData[activeTab].map((tech) => (
                <div
                  key={tech.name}
                  className="p-6 rounded-2xl glass-panel border border-white/5 relative group hover:border-primary/30 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row with Badge and Logo */}
                    <div className="flex justify-between items-start mb-6">
                      <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5 inline-block">
                        {tech.label}
                      </span>
                      {/* Logo Wrapper */}
                      <div className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        {getLogo(tech.name)}
                      </div>
                    </div>

                    {/* Name */}
                    <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-primary transition-colors font-display">
                      {tech.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-400 font-sans leading-relaxed">
                      {tech.desc}
                    </p>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <div className="w-8 h-8 rounded-full bg-white/5 text-slate-300 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
