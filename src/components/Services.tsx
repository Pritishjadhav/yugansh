"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Code2,
  Smartphone,
  Palette,
  Bot,
  BarChart3,
  Zap,
  Layers,
  Link2
} from "lucide-react";

const servicesList = [
  {
    title: "Power BI & Analytics",
    desc: "Actionable dashboards and enterprise reporting that turn raw data into executive-ready insights.",
    icon: BarChart3,
    color: "from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30",
    bullets: [
      "Dashboard & Report Development",
      "Advanced DAX & Power Query (ETL)",
      "Row-Level Security & Data Governance",
      "ERP, CRM, SQL & API Integration",
      "Performance Optimization & Auto Refresh",
      "Financial, Sales & Operations Analytics"
    ]
  },
  {
    title: "Microsoft Fabric",
    desc: "Modern data platform implementation unifying your analytics, data engineering, and BI on OneLake.",
    icon: Layers,
    color: "from-orange-500/20 to-amber-500/20 text-orange-400 border-orange-500/30",
    bullets: [
      "Fabric Workspace Setup & Admin",
      "OneLake Architecture Design",
      "Lakehouse & Data Warehouse Implementation",
      "Data Pipelines & Dataflows Gen2",
      "Semantic Models & Enterprise Reporting",
      "Real-Time Analytics & Monitoring"
    ]
  },
  {
    title: "Power Apps Development",
    desc: "Custom business applications — canvas, model-driven, mobile and web — built in record time.",
    icon: Smartphone,
    color: "from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30",
    bullets: [
      "Canvas Apps & Model-Driven Apps",
      "Mobile & Web-Based Applications",
      "SharePoint, Dataverse & SQL Integration",
      "Approval, Inspection & Data Entry Apps",
      "Digital Forms & Workflow Applications",
      "Low-Code Business Process Automation"
    ]
  },
  {
    title: "Power Automate",
    desc: "Eliminate repetitive tasks and integrate systems with intelligent, event-driven workflow automation.",
    icon: Zap,
    color: "from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30",
    bullets: [
      "Workflow Automation & Optimization",
      "Approval Workflows & Notifications",
      "Automated Data Synchronization",
      "MS365 & Third-Party Integration",
      "Document Management Automation",
      "Email, Teams & SharePoint Automation"
    ]
  },
  {
    title: "Mendix Development",
    desc: "Enterprise-grade low-code applications for complex business logic and multi-system integrations.",
    icon: Code2,
    color: "from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30",
    bullets: [
      "Mendix App Architecture & Development",
      "Complex Business Logic & Workflows",
      "Legacy System Modernization",
      "Microservices & API Integration",
      "CI/CD & DevOps for Mendix",
      "Cloud Deployment & Scaling"
    ]
  },
  {
    title: "Agentic AI",
    desc: "Intelligent AI agents that automate tasks, augment decisions, and drive business outcomes across your enterprise.",
    icon: Bot,
    color: "from-red-500/20 to-pink-500/20 text-red-400 border-red-500/30",
    bullets: [
      "AI Agent Design & Development",
      "LLM Integration & Prompt Engineering",
      "Workflow Automation with AI Agents",
      "RAG & Knowledge Management",
      "AI-Powered Decision Support",
      "Monitoring, Governance & Ethical AI"
    ]
  },
  {
    title: "Integration & Migration",
    desc: "Connecting your enterprise ecosystem so data and processes flow without friction or silos.",
    icon: Link2,
    color: "from-teal-500/20 to-emerald-500/20 text-teal-400 border-teal-500/30",
    bullets: [
      "SAP, Oracle & Salesforce Connectivity",
      "Dynamics 365 & REST API Integration",
      "Azure Data & Cloud Services",
      "SharePoint & Dataverse Architecture",
      "Data Migration & Modernization",
      "Enterprise Process Automation"
    ]
  },
  {
    title: "UI/UX, Web & Graphic Design",
    desc: "Creating visually stunning digital experiences that combine user-centered design, brand identity, and modern web aesthetics.",
    icon: Palette,
    color: "from-pink-500/20 to-rose-500/20 text-pink-400 border-pink-500/30",
    bullets: [
      "UI/UX Design & Prototyping",
      "Website Design & Development",
      "Responsive Web & Mobile Interfaces",
      "Brand Identity & Visual Design",
      "Graphic Design & Marketing Collateral",
      "Design Systems & User Experience Optimization"
    ]
  }
];

function ServiceCard({ service, index }: { service: typeof servicesList[0]; index: number }) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const IconComponent = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (index % 4) * 0.05 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-3xl border border-white/5 bg-slate-900/10 p-8 transition-all duration-300 flex flex-col justify-between overflow-hidden hover:border-primary/30 min-h-[380px]"
    >
      {/* Dynamic Cursor Spotlight Overlay */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-100 transition duration-300"
          style={{
            background: `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, rgba(10, 77, 255, 0.08), transparent 85%)`,
          }}
        />
      )}

      {/* Accent Edge Flash */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-100 transition duration-300"
          style={{
            background: `radial-gradient(120px circle at ${coords.x}px ${coords.y}px, rgba(255, 122, 0, 0.12), transparent 80%)`,
          }}
        />
      )}

      <div className="flex flex-col h-full justify-between">
        <div>
          <div className="flex justify-between items-start mb-6">
            {/* Service Icon Frame */}
            <div className={`p-3 w-fit rounded-xl bg-gradient-to-br border ${service.color} group-hover:scale-110 transition-transform duration-300 flex items-center justify-center`}>
              <IconComponent className="w-5 h-5" />
            </div>
          </div>

          {/* Content Heading */}
          <h3 className="font-display font-black tracking-tight text-white text-xl mb-3 group-hover:text-primary transition-colors duration-200">
            {service.title}
          </h3>

          {/* Description */}
          <p className="text-slate-400 font-sans text-xs leading-relaxed mb-6">
            {service.desc}
          </p>
        </div>

        {/* Bullet Points */}
        <ul className="space-y-2 mt-auto pt-2">
          {service.bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-2">
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-secondary/80 mt-1.5 group-hover:bg-primary transition-colors duration-300" />
              <span className="text-slate-300 font-sans text-[13px] leading-snug group-hover:text-slate-200 transition-colors duration-300">{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom accent bar */}
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </motion.div>
  );
}

export default function Services() {
  return (
    <section id="services" className="py-24 relative overflow-hidden bg-transparent">
      {/* Ambient spotlights */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/5 px-3 py-1.5 rounded-full border border-primary/15">
            What We Offer
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-black tracking-tight text-white mt-6 mb-4">
            Enterprise-Grade <span className="text-gradient-orange">IT Services</span>
          </h2>
          <p className="text-slate-400 font-sans">
            We deliver state-of-the-art software engineering, intelligence-driven automation, and digital scaling services to keep your business at the forefront of innovation.
          </p>
        </div>

        {/* Services 8-Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {servicesList.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
