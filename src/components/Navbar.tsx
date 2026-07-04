"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, ArrowUpRight, Sun, Moon, User, LogOut, Settings, Clock, LayoutDashboard, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Technologies", href: "#technologies" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "Process", href: "#process" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [theme, setTheme] = useState("light");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user, userData, profileData, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isDark = theme === "dark";

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    if (savedTheme === "light") {
      document.body.classList.add("light");
    } else {
      document.body.classList.remove("light");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "light") {
      document.body.classList.add("light");
    } else {
      document.body.classList.remove("light");
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  // Track scroll position for header style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track active section for navigation highlighting
  useEffect(() => {
    if (pathname !== "/") return;

    const handleScrollActive = () => {
      const scrollPosition = window.scrollY + 180; // offset for navbar height + threshold
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60;

      if (isAtBottom) {
        setActiveSection("contact");
        return;
      }

      // Get sections with nav links
      const sections = navLinks
        .map((link) => {
          const el = document.getElementById(link.href.substring(1));
          if (el) {
            return {
              id: link.href.substring(1),
              offsetTop: el.offsetTop,
            };
          }
          return null;
        })
        .filter((s): s is { id: string; offsetTop: number } => s !== null);

      let currentSection = "home";
      for (const section of sections) {
        if (scrollPosition >= section.offsetTop) {
          currentSection = section.id;
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScrollActive);
    // Run once on load
    handleScrollActive();

    return () => window.removeEventListener("scroll", handleScrollActive);
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (pathname !== "/") {
      router.push("/" + href);
      setIsOpen(false);
      return;
    }
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      setIsOpen(false);
      const offset = 80; // height of navbar
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const getInitials = () => {
    if (profileData?.name) {
      return profileData.name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    setIsOpen(false);
    await logout();
    router.push("/");
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          isScrolled || pathname !== "/"
            ? isDark
              ? "bg-[#030014]/85 backdrop-blur-md py-4 shadow-2xl shadow-black/20 border-white/5"
              : "bg-white/85 backdrop-blur-md py-4 shadow-lg shadow-black/5 border-slate-200"
            : "bg-transparent py-5 border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 xl:px-12 flex justify-between items-center">
          {/* Logo */}
          <Link href="/#home" className="flex flex-col items-start leading-none group">
            <span className="font-display text-2xl font-bold tracking-tight text-white flex items-center leading-none">
              <span className="text-primary">Yug</span><span className="text-secondary">Ansh</span>
            </span>
            <span className={`text-[8px] font-sans font-extrabold uppercase tracking-[0.25em] bg-gradient-to-r bg-clip-text text-transparent mt-1 transition-all duration-300 ${
              isDark 
                ? "from-primary via-slate-200 to-secondary" 
                : "from-primary via-slate-500 to-secondary"
            }`}>
              Technology Services
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`relative font-sans text-xs xl:text-sm font-medium tracking-wide transition-colors duration-200 whitespace-nowrap ${
                  pathname === "/" && activeSection === link.href.substring(1)
                    ? "text-primary font-semibold"
                    : isDark
                      ? "text-slate-300 hover:text-white"
                      : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {link.name}
                {pathname === "/" && activeSection === link.href.substring(1) && (
                  <motion.span
                    layoutId="activeIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </nav>

          {/* CTA Button, Auth, & Theme Toggle */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-4">
            <button
              onClick={toggleTheme}
              className={`p-2 xl:p-2.5 ml-4 xl:ml-8 mr-1 xl:mr-2 rounded-full border transition-all cursor-pointer flex items-center justify-center shadow-md hover:scale-105 active:scale-95 duration-200 ${
                isDark
                  ? "bg-white/5 border-white/10 text-slate-300 hover:text-white hover:border-white/20"
                  : "bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200 hover:border-slate-300"
              }`}
              aria-label="Toggle Theme"
              title={isDark ? "Switch to light theme" : "Switch to dark theme"}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {user ? (
              /* Authenticated Dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`flex items-center gap-1.5 xl:gap-2 p-1 xl:p-1.5 pr-2 xl:pr-3 rounded-full border transition-all cursor-pointer shadow-md duration-200 ${
                    isDark
                      ? "bg-white/5 border-white/10 text-slate-300 hover:text-white hover:border-white/20"
                      : "bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-200"
                  }`}
                >
                  {profileData?.profilePhotoUrl ? (
                    <img
                      src={profileData.profilePhotoUrl}
                      alt="Profile"
                      className="w-7 h-7 xl:w-8 xl:h-8 rounded-full object-cover border border-white/20"
                    />
                  ) : (
                    <div className="w-7 h-7 xl:w-8 xl:h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs xl:text-sm font-bold border border-white/20">
                      {getInitials()}
                    </div>
                  )}
                  <span className={`text-[10px] xl:text-xs font-semibold max-w-[80px] xl:max-w-[100px] truncate ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}>
                    {profileData?.name || user.email}
                  </span>
                  <ChevronDown className={`w-3 h-3 xl:w-3.5 xl:h-3.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''} ${
                    isDark ? "text-slate-300" : "text-slate-500"
                  }`} />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2.5 w-56 rounded-2xl glass-panel p-2 shadow-2xl z-50 border border-white/10 profile-dropdown-menu"
                    >
                      <div className="px-3 py-2 border-b border-white/5 mb-1.5">
                        <p className="text-xs text-slate-400 font-medium">Logged in as</p>
                        <p className="text-sm font-semibold truncate text-white">{profileData?.name || "User"}</p>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{user.email}</p>
                        <span className="inline-block px-1.5 py-0.5 bg-primary/20 text-primary text-[9px] font-bold rounded mt-1.5 uppercase tracking-wide">
                          {userData?.role || "Employee"}
                        </span>
                      </div>

                      <Link
                        href="/dashboard"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                      >
                        <LayoutDashboard className="w-4 h-4 text-primary" />
                        Dashboard
                      </Link>

                      <Link
                        href="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                      >
                        <User className="w-4 h-4 text-secondary" />
                        Profile
                      </Link>

                      <Link
                        href="/settings"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        Settings
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer mt-1.5 border-t border-white/5 pt-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Unauthenticated Login/Signup Buttons */
              <div className="flex items-center gap-2 xl:gap-3">
                <Link
                  href="/login"
                  className={`font-sans text-xs xl:text-sm font-semibold transition-colors duration-200 px-3 xl:px-4 py-2 whitespace-nowrap ${
                    isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className={`px-4 xl:px-5 py-2 xl:py-2.5 border rounded-full shadow-lg transition-all duration-200 whitespace-nowrap font-sans text-xs xl:text-sm font-semibold ${
                    isDark
                      ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white"
                      : "bg-slate-100 border-slate-200 hover:bg-slate-200 hover:border-slate-300 text-slate-800"
                  }`}
                >
                  Sign Up
                </Link>
              </div>
            )}

            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className="relative inline-flex items-center gap-1.5 px-4 xl:px-5 py-2 xl:py-2.5 bg-primary text-white font-sans text-xs xl:text-sm font-semibold rounded-full hover:bg-primary-hover shadow-lg hover:shadow-primary/30 transition-all duration-200 whitespace-nowrap"
            >
              <span className="hidden xl:inline">Get Free Consultation</span>
              <span className="xl:hidden">Consultation</span>
              <ArrowUpRight className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
            </a>
          </div>

          {/* Mobile Controls */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                isDark
                  ? "bg-white/5 border-white/10 text-slate-300 hover:text-white"
                  : "bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900"
              }`}
              aria-label="Toggle Theme"
              title={isDark ? "Switch to light theme" : "Switch to dark theme"}
            >
              {isDark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 transition-colors duration-200 focus:outline-none ${
                isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`}
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Sidebar Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />

            {/* Left Sidebar Drawer Container */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`fixed left-0 top-0 bottom-0 z-50 w-[75%] max-w-[300px] backdrop-blur-xl border-r p-6 flex flex-col justify-between shadow-2xl lg:hidden ${
                isDark
                  ? "bg-[#030014]/95 border-white/5"
                  : "bg-white/95 border-slate-200"
              }`}
            >
              <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
                {/* Header Section inside Drawer */}
                <div className={`flex items-center justify-between border-b pb-6 mb-6 ${
                  isDark ? "border-white/5" : "border-slate-100"
                }`}>
                  <Link href="/#home" onClick={() => setIsOpen(false)} className={`font-display text-xl font-bold tracking-tight leading-none ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}>
                    <span className="text-primary">Yug</span><span className="text-secondary">Ansh</span>
                  </Link>
                  <button onClick={() => setIsOpen(false)} className={`cursor-pointer ${
                    isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-800"
                  }`} aria-label="Close menu">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* User Info Card inside Mobile Drawer */}
                {user && (
                  <div className={`flex items-center gap-3 p-3 rounded-2xl border mb-6 ${
                    isDark
                      ? "bg-white/5 border-white/10"
                      : "bg-slate-50 border-slate-100"
                  }`}>
                    {profileData?.profilePhotoUrl ? (
                      <img
                        src={profileData.profilePhotoUrl}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover border border-white/20"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-base font-bold border border-white/20">
                        {getInitials()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${isDark ? "text-white" : "text-slate-900"}`}>{profileData?.name || "User"}</p>
                      <p className={`text-[10px] truncate ${isDark ? "text-slate-400" : "text-slate-500"}`}>{user.email}</p>
                      <span className="inline-block px-1.5 py-0.5 bg-primary/20 text-primary text-[8px] font-bold rounded uppercase mt-1">
                        {userData?.role || "Employee"}
                      </span>
                    </div>
                  </div>
                )}

                {/* Navigation Links List */}
                <div className="flex flex-col gap-4">
                  <p className={`text-[10px] font-extrabold uppercase tracking-widest mb-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}>Navigation</p>
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className={`font-sans text-sm font-semibold transition-colors py-1 ${
                        pathname === "/" && activeSection === link.href.substring(1)
                          ? "text-primary pl-2 border-l-2 border-l-primary"
                          : isDark
                            ? "text-slate-300 hover:text-white"
                            : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {link.name}
                    </a>
                  ))}

                  {/* Internal Routes for Authenticated Users inside drawer */}
                  {user && (
                    <>
                      <p className={`text-[10px] font-extrabold uppercase tracking-widest mt-4 mb-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}>Workspace</p>
                      
                      <Link
                        href="/dashboard"
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-2.5 font-sans text-sm font-semibold py-1.5 ${
                          isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <LayoutDashboard className="w-4.5 h-4.5 text-primary" />
                        Dashboard
                      </Link>

                      <Link
                        href="/profile"
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-2.5 font-sans text-sm font-semibold py-1.5 ${
                          isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <User className="w-4.5 h-4.5 text-secondary" />
                        Profile
                      </Link>

                      <Link
                        href="/settings"
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-2.5 font-sans text-sm font-semibold py-1.5 ${
                          isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <Settings className={`w-4.5 h-4.5 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
                        Settings
                      </Link>

                      <button
                        onClick={handleLogout}
                        className={`flex items-center gap-2.5 font-sans text-sm font-semibold text-rose-400 hover:text-rose-300 py-2.5 mt-4 border-t ${
                          isDark ? "border-white/5" : "border-slate-100"
                        }`}
                      >
                        <LogOut className="w-4.5 h-4.5" />
                        Logout
                      </button>
                    </>
                  )}

                  {/* Auth actions for unauthenticated inside drawer */}
                  {!user && (
                    <>
                      <p className={`text-[10px] font-extrabold uppercase tracking-widest mt-4 mb-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}>Account</p>
                      <div className="flex flex-col gap-2 mt-1">
                        <Link
                          href="/login"
                          onClick={() => setIsOpen(false)}
                          className={`flex justify-center items-center py-2.5 border font-sans text-sm font-bold rounded-xl transition-all ${
                            isDark
                              ? "border-white/10 text-slate-300 hover:bg-white/5"
                              : "border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          Login
                        </Link>
                        <Link
                          href="/signup"
                          onClick={() => setIsOpen(false)}
                          className="flex justify-center items-center py-2.5 bg-primary text-white font-sans text-sm font-bold rounded-xl hover:bg-primary-hover shadow-lg transition-all"
                        >
                          Sign Up
                        </Link>
                      </div>
                    </>
                  )}
                  
                  {/* Consultation Button */}
                  <a
                    href="#contact"
                    onClick={(e) => handleNavClick(e, "#contact")}
                    className="inline-flex justify-center items-center gap-2 w-full py-3 mt-6 bg-primary text-white font-sans text-sm font-bold rounded-xl hover:bg-primary-hover shadow-lg transition-all"
                  >
                    Consultation
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
