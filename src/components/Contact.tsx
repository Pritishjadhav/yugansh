"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MapPin, Send, CheckCircle, Globe } from "lucide-react";

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

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    service: "",
    otherService: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.service) {
      newErrors.service = "Please select a service";
    } else if (formData.service === "Other" && !formData.otherService.trim()) {
      newErrors.otherService = "Please specify the service";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch("https://formsubmit.co/ajax/yugansh2026@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          Name: formData.fullName,
          Email: formData.email,
          Phone: formData.phone,
          Service: formData.service === "Other" ? `Other: ${formData.otherService}` : formData.service,
          Message: formData.message,
          _subject: "New Inquiry from YugAnsh Website"
        })
      });

      if (response.ok) {
        setIsSuccess(true);
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          service: "",
          otherService: "",
          message: "",
        });
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        alert("Something went wrong. Please try again or email yugansh2026@gmail.com directly.");
      }
    } catch (error) {
      console.error("Error sending form data:", error);
      alert("Failed to connect. Please check your network connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-transparent">
      {/* Background radial spotlight */}
      <div className="absolute top-1/3 left-1/4 w-[450px] h-[450px] bg-primary/10 rounded-full blur-[140px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/3 right-1/4 w-[450px] h-[450px] bg-secondary/10 rounded-full blur-[140px] pointer-events-none animate-pulse-slow" style={{ animationDelay: "3s" }} />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-secondary bg-secondary/5 px-3 py-1.5 rounded-full border border-secondary/15">
            Contact Us
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-black tracking-tight text-white mt-6 mb-4">
            Start Your <span className="text-gradient-blue">Transformation</span>
          </h2>
          <p className="text-slate-400 font-sans">
            Have an idea or a workflow problem to solve? Schedule a free consulting session with our engineering experts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Side: Info & Map Mockup */}
          <div className="lg:col-span-5 space-y-8">
            <h3 className="text-2xl font-display font-bold text-white mb-6">Contact Details</h3>
            
            {/* Contact Details Cards */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-5 rounded-2xl glass-panel hover:border-primary/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wide">Call Us</div>
                  <div className="flex flex-col gap-1">
                    <a href="tel:+917507774878" className="text-sm font-semibold text-white hover:text-primary transition-colors">+91 7507774878</a>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 rounded-2xl glass-panel hover:border-primary/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wide">Email Us</div>
                  <a href="mailto:yugansh2026@gmail.com" className="text-sm font-semibold text-white hover:text-primary transition-colors">yugansh2026@gmail.com</a>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 rounded-2xl glass-panel hover:border-primary/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wide">Location</div>
                  <a
                    href="https://maps.google.com/?q=Ataraxia,+The+Capital,+Pune+-+Solapur+Rd,+near+Mega+Center,+Magarpatta+Annexe,+Pune,+Maharashtra+411013"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-white leading-relaxed hover:text-primary transition-colors block"
                  >
                    Ataraxia, The Capital, Pune - Solapur Rd, near Mega Center, Magarpatta Annexe, Pune, Maharashtra 411013
                  </a>
                </div>
              </div>
            </div>

            {/* Google Map */}
            <div className="relative h-60 rounded-2xl border border-white/5 bg-slate-900/60 overflow-hidden shadow-inner">
              <iframe
                title="YugAnsh Office Location"
                src="https://maps.google.com/maps?q=The+Capital+-+F5+Realtors,+Hadapsar,+Pune&t=&z=14&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Social Icons */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Follow Us</h4>
              <div className="flex gap-3">
                {[
                  { icon: Linkedin, href: "#", name: "LinkedIn" },
                  { icon: Twitter, href: "#", name: "Twitter" },
                  { icon: Github, href: "#", name: "Github" },
                  { icon: Globe, href: "#", name: "Website" },
                ].map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all"
                      aria-label={social.name}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="lg:col-span-7">
            <div className="p-8 md:p-10 rounded-3xl glass-panel border border-white/5 relative">
              <h3 className="text-2xl font-display font-bold text-secondary mb-8">Send Us a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-secondary font-sans" htmlFor="fullName">Full Name *</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-slate-950/80 border rounded-xl text-slate-100 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder-slate-600 transition-all ${
                        errors.fullName ? "border-red-500/50 focus:ring-red-500" : "border-white/10"
                      }`}
                    />
                    {errors.fullName && <p className="text-[10px] text-red-400 font-semibold">{errors.fullName}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-secondary font-sans" htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-slate-950/80 border rounded-xl text-slate-100 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder-slate-600 transition-all ${
                        errors.email ? "border-red-500/50 focus:ring-red-500" : "border-white/10"
                      }`}
                    />
                    {errors.email && <p className="text-[10px] text-red-400 font-semibold">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-secondary font-sans" htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-slate-950/80 border rounded-xl text-slate-100 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder-slate-600 transition-all ${
                        errors.phone ? "border-red-500/50 focus:ring-red-500" : "border-white/10"
                      }`}
                    />
                    {errors.phone && <p className="text-[10px] text-red-400 font-semibold">{errors.phone}</p>}
                  </div>

                  {/* Service Required */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-secondary font-sans" htmlFor="service">Service Required *</label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-slate-950/80 border rounded-xl text-slate-100 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all ${
                        errors.service ? "border-red-500/50 focus:ring-red-500" : "border-white/10"
                      }`}
                    >
                      <option value="" disabled>Select Service</option>
                      <option value="Website Development">Website Development</option>
                      <option value="Custom Software Development">Custom Software Development</option>
                      <option value="Mobile App Development">Mobile App Development</option>
                      <option value="AI Solutions & Automation">AI Solutions & Automation</option>
                      <option value="Cloud Solutions & Analytics">Cloud Solutions & Analytics</option>
                      <option value="IT Consulting">IT Consulting</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.service && <p className="text-[10px] text-red-400 font-semibold">{errors.service}</p>}
                  </div>
                </div>

                {/* Specify Other Service input */}
                <AnimatePresence>
                  {formData.service === "Other" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-2 overflow-hidden"
                    >
                      <label className="text-xs font-semibold text-secondary font-sans" htmlFor="otherService">Specify Service Required *</label>
                      <input
                        type="text"
                        id="otherService"
                        name="otherService"
                        value={formData.otherService}
                        onChange={handleInputChange}
                        placeholder="Please specify what service you need"
                        className={`w-full px-4 py-3 bg-slate-950/80 border rounded-xl text-slate-100 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder-slate-600 transition-all ${
                          errors.otherService ? "border-red-500/50 focus:ring-red-500" : "border-white/10"
                        }`}
                      />
                      {errors.otherService && <p className="text-[10px] text-red-400 font-semibold">{errors.otherService}</p>}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-secondary font-sans" htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us about your project..."
                    className={`w-full px-4 py-3 bg-slate-950/80 border rounded-xl text-slate-100 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder-slate-600 transition-all ${
                      errors.message ? "border-red-500/50 focus:ring-red-500" : "border-white/10"
                    }`}
                  />
                  {errors.message && <p className="text-[10px] text-red-400 font-semibold">{errors.message}</p>}
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-secondary hover:bg-secondary-hover disabled:bg-secondary/50 text-white font-sans font-bold rounded-xl shadow-lg shadow-secondary/20 hover:shadow-secondary/30 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Submit Request</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Success Notification Alert */}
              <AnimatePresence>
                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    className="absolute inset-0 bg-slate-950/95 backdrop-blur rounded-3xl flex flex-col items-center justify-center p-8 text-center z-20"
                  >
                    <CheckCircle className="w-16 h-16 text-emerald-400 mb-4" />
                    <h4 className="text-xl font-display font-bold text-white mb-2">Message Sent Successfully!</h4>
                    <p className="text-sm text-slate-400 font-sans max-w-sm">
                      Thank you for contacting YugAnsh. Our team will review your request and reach out to you within 24 hours.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsSuccess(false)}
                      className="mt-6 px-6 py-2 bg-white/5 border border-white/10 text-slate-200 text-xs font-semibold rounded-lg hover:bg-white/10 transition-all cursor-pointer"
                    >
                      Close
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
