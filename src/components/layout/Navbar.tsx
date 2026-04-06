"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sun, Moon, ChevronDown, Calculator, BookOpen, Briefcase, Users, Heart, Coffee, Crown, Sparkles, Calendar, MessageCircle, Clock, PartyPopper, Cake, GraduationCap, Gift, Music, Globe, Building, Church, ArrowRight } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    
    // Lock scroll when menu is open
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    // Handle click outside to close dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)

    // Handle swipe/touch to close
    let touchStartX = 0
    let touchEndX = 0
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX
    }
    
    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX
      if (isOpen && touchStartX - touchEndX > 50) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('touchend', handleTouchEnd)

    // Track active section based on scroll position
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.5 }
    )

    // Observe all section elements
    const sections = ['portfolio', 'services', 'about']
    sections.forEach((section) => {
      const element = document.getElementById(section)
      if (element) observer.observe(element)
    })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      document.body.style.overflow = "unset"
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
      sections.forEach((section) => {
        const element = document.getElementById(section)
        if (element) observer.unobserve(element)
      })
    }
  }, [isOpen])

  // Handle escape key press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        setOpenDropdown(null)
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  if (!mounted) return null

  const isActive = (section: string) => {
    return activeSection === section.toLowerCase() ? 'opacity-100 font-bold' : 'opacity-40'
  }

  const isActiveLink = (href: string) => {
    if (href === '/quote') return pathname === '/quote'
    if (href === '/blog') return pathname === '/blog' || pathname?.startsWith('/blog/')
    if (href === '/portfolio') return pathname === '/portfolio'
    return pathname === href
  }

  const dropdowns = {
    services: {
      title: "Services",
      icon: <Sparkles size={14} />,
      available: [
        { name: "Wedding Decor", href: "/quote", icon: <Heart size={14} />, description: "Ceremony & reception styling", badge: "Quote Available" },
      ],
      comingSoon: [
        { name: "Corporate Events", href: "/contact", icon: <Briefcase size={14} />, description: "Galas, launches & conferences", badge: "Coming Soon" },
        { name: "Social Celebrations", href: "/contact", icon: <Users size={14} />, description: "Birthdays, showers & more", badge: "Coming Soon" },
        { name: "Culinary Experiences", href: "/contact", icon: <Coffee size={14} />, description: "Dining & bar setups", badge: "Coming Soon" },
      ]
    },
    resources: {
      title: "Resources",
      icon: <BookOpen size={14} />,
      items: [
        { name: "Wedding Quote", href: "/quote", icon: <Calculator size={14} />, description: "Instant pricing for weddings" },
        { name: "The Journal", href: "/blog", icon: <BookOpen size={14} />, description: "Stories & insights" },
        { name: "Free Checklist", href: "/#free-guide", icon: <Sparkles size={14} />, description: "Wedding planning guide" },
      ]
    },
    company: {
      title: "Company",
      icon: <Briefcase size={14} />,
      items: [
        { name: "Portfolio", href: "/portfolio", icon: <Heart size={14} />, description: "Our work" },
        { name: "About Us", href: "/#about", icon: <Users size={14} />, description: "Our story & philosophy" },
        { name: "Contact", href: "/contact", icon: <MessageCircle size={14} />, description: "Get in touch" },
      ]
    }
  }

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-700 ${
      scrolled 
        ? "bg-background/80 backdrop-blur-xl border-b border-foreground/10 py-3" 
        : "bg-transparent py-5"
    }`}>
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center text-foreground">
        
        {/* Logo */}
        <Link href="/" className="text-lg md:text-xl font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase text-foreground z-[110] hover:opacity-80 transition-opacity whitespace-nowrap">
          Events<span className="font-extralight opacity-50">District</span>
        </Link>

        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6" ref={dropdownRef}>
            {/* Services Dropdown */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'services' ? null : 'services')}
                onMouseEnter={() => setOpenDropdown('services')}
                className={`flex items-center gap-1 text-[10px] uppercase tracking-[0.3em] font-medium text-foreground hover:opacity-100 transition-all group ${
                  openDropdown === 'services' ? 'opacity-100' : 'opacity-60'
                }`}
              >
                Services
                <ChevronDown size={12} className={`transition-transform duration-300 ${openDropdown === 'services' ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {openDropdown === 'services' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-3 w-80 bg-background border border-foreground/10 rounded-xl shadow-2xl overflow-hidden"
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <div className="p-3 border-b border-foreground/10">
                      <p className="text-[9px] uppercase tracking-[0.3em] text-foreground/40 mb-2 px-2">Available Now</p>
                      {dropdowns.services.available.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-start gap-3 p-3 hover:bg-foreground/5 transition-colors group rounded-lg"
                          onClick={() => setOpenDropdown(null)}
                        >
                          <div className="mt-0.5 text-foreground/40 group-hover:text-foreground transition-colors">
                            {item.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-foreground group-hover:text-foreground/80">
                                {item.name}
                              </p>
                              <span className="text-[8px] px-1.5 py-0.5 bg-foreground/10 text-foreground/60 rounded-full">
                                {item.badge}
                              </span>
                            </div>
                            <p className="text-[10px] text-foreground/40 mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                    
                    <div className="p-3">
                      <p className="text-[9px] uppercase tracking-[0.3em] text-foreground/30 mb-2 px-2">Coming Soon</p>
                      {dropdowns.services.comingSoon.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-start gap-3 p-3 hover:bg-foreground/5 transition-colors group rounded-lg opacity-70"
                          onClick={() => setOpenDropdown(null)}
                        >
                          <div className="mt-0.5 text-foreground/30">
                            {item.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-foreground/60">
                                {item.name}
                              </p>
                              <span className="text-[8px] px-1.5 py-0.5 bg-foreground/10 text-foreground/40 rounded-full">
                                {item.badge}
                              </span>
                            </div>
                            <p className="text-[10px] text-foreground/30 mt-0.5">
                              {item.description}
                            </p>
                          </div>
                          <Clock size={12} className="text-foreground/30" />
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Resources Dropdown */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'resources' ? null : 'resources')}
                onMouseEnter={() => setOpenDropdown('resources')}
                className={`flex items-center gap-1 text-[10px] uppercase tracking-[0.3em] font-medium text-foreground hover:opacity-100 transition-all group ${
                  openDropdown === 'resources' ? 'opacity-100' : 'opacity-60'
                }`}
              >
                Resources
                <ChevronDown size={12} className={`transition-transform duration-300 ${openDropdown === 'resources' ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {openDropdown === 'resources' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-3 w-72 bg-background border border-foreground/10 rounded-xl shadow-2xl overflow-hidden"
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    {dropdowns.resources.items.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-start gap-3 p-4 hover:bg-foreground/5 transition-colors group"
                        onClick={() => setOpenDropdown(null)}
                      >
                        <div className="mt-0.5 text-foreground/40 group-hover:text-foreground transition-colors">
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground group-hover:text-foreground/80">
                            {item.name}
                          </p>
                          <p className="text-[10px] text-foreground/40 mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Company Dropdown */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'company' ? null : 'company')}
                onMouseEnter={() => setOpenDropdown('company')}
                className={`flex items-center gap-1 text-[10px] uppercase tracking-[0.3em] font-medium text-foreground hover:opacity-100 transition-all group ${
                  openDropdown === 'company' ? 'opacity-100' : 'opacity-60'
                }`}
              >
                Company
                <ChevronDown size={12} className={`transition-transform duration-300 ${openDropdown === 'company' ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {openDropdown === 'company' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-3 w-72 bg-background border border-foreground/10 rounded-xl shadow-2xl overflow-hidden"
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    {dropdowns.company.items.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-start gap-3 p-4 hover:bg-foreground/5 transition-colors group"
                        onClick={() => setOpenDropdown(null)}
                      >
                        <div className="mt-0.5 text-foreground/40 group-hover:text-foreground transition-colors">
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground group-hover:text-foreground/80">
                            {item.name}
                          </p>
                          <p className="text-[10px] text-foreground/40 mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Portfolio Link - Direct */}
            <Link 
              href="/portfolio" 
              className={`text-[10px] uppercase tracking-[0.3em] font-medium text-foreground hover:opacity-100 transition-all ${
                isActiveLink('/portfolio') ? 'opacity-100 font-bold' : 'opacity-60'
              }`}
            >
              Portfolio
            </Link>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-3 border-l border-foreground/10 pl-3 md:pl-4">
            {/* Quick Links */}
            <div className="hidden sm:flex items-center space-x-2 md:space-x-3">
              <Link 
                href="/quote"
                className={`flex items-center gap-1 text-[9px] md:text-[10px] uppercase tracking-wider font-medium transition-all ${
                  isActiveLink('/quote') ? 'text-foreground' : 'text-foreground/50 hover:text-foreground'
                }`}
              >
                <Calculator size={11} />
                <span>Wedding Quote</span>
              </Link>
              <Link 
                href="/blog"
                className={`flex items-center gap-1 text-[9px] md:text-[10px] uppercase tracking-wider font-medium transition-all ${
                  isActiveLink('/blog') ? 'text-foreground' : 'text-foreground/50 hover:text-foreground'
                }`}
              >
                <BookOpen size={11} />
                <span>Journal</span>
              </Link>
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
              className="p-1.5 md:p-2 hover:bg-foreground/5 rounded-full transition-all text-foreground"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Desktop CTA */}
            <Link 
              href="/contact" 
              className="hidden lg:block bg-foreground text-background px-5 py-2 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-foreground/90 transition-colors rounded-full"
            >
              Book Consultation
            </Link>

            {/* Custom Animated Hamburger Menu */}
            <button 
              className="lg:hidden relative z-[110] w-8 h-8 flex flex-col justify-center items-center"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Menu"
            >
              {!isOpen ? (
                <div className="space-y-1.5">
                  <span className="block w-5 h-[1.5px] bg-foreground"></span>
                  <span className="block w-5 h-[1.5px] bg-foreground"></span>
                  <span className="block w-5 h-[1.5px] bg-foreground"></span>
                </div>
              ) : (
                <div className="relative w-5 h-5">
                  <span className="absolute top-1/2 left-0 w-5 h-[1.5px] bg-foreground rotate-45"></span>
                  <span className="absolute top-1/2 left-0 w-5 h-[1.5px] bg-foreground -rotate-45"></span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Menu - Enhanced */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm z-[105]"
            />
            
            {/* Menu Drawer */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-screen w-[85%] max-w-[360px] bg-background border-l border-foreground/5 z-[110] p-8 flex flex-col shadow-2xl overflow-y-auto"
            >
              <div className="flex justify-end mb-4">
                <button onClick={() => setIsOpen(false)} className="p-2">
                  <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col space-y-6">
                {/* Wedding Quote - Highlighted */}
                <div className="bg-foreground/5 border border-foreground/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator size={16} className="text-foreground/60" />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/50">Available Now</span>
                  </div>
                  <Link 
                    href="/quote" 
                    onClick={() => setIsOpen(false)}
                    className="block"
                  >
                    <p className="text-lg font-medium text-foreground">Wedding Quote</p>
                    <p className="text-xs text-foreground/50 mt-1">Instant pricing with packages</p>
                  </Link>
                </div>

                {/* Portfolio Link */}
                <div>
                  <Link 
                    href="/portfolio" 
                    onClick={() => setIsOpen(false)}
                    className="block py-2 text-lg font-medium text-foreground hover:opacity-80 transition-opacity"
                  >
                    Portfolio
                  </Link>
                </div>

                {/* Services Section */}
                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-foreground/40 mb-3">Services</p>
                  <div className="space-y-3">
                    {dropdowns.services.available.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 p-2 hover:bg-foreground/5 rounded-lg transition-colors"
                      >
                        <span className="text-foreground/40">{item.icon}</span>
                        <div>
                          <p className="text-sm text-foreground">{item.name}</p>
                          <p className="text-[10px] text-foreground/40">{item.description}</p>
                        </div>
                      </Link>
                    ))}
                    {dropdowns.services.comingSoon.map((item) => (
                      <div key={item.name} className="flex items-center gap-3 p-2 opacity-60">
                        <span className="text-foreground/30">{item.icon}</span>
                        <div>
                          <p className="text-sm text-foreground/60">{item.name}</p>
                          <p className="text-[10px] text-foreground/40">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resources */}
                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-foreground/40 mb-3">Resources</p>
                  {dropdowns.resources.items.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 py-2 group"
                    >
                      <span className="text-foreground/40 group-hover:text-foreground transition-colors">
                        {item.icon}
                      </span>
                      <div>
                        <p className="text-sm text-foreground group-hover:opacity-80">{item.name}</p>
                        <p className="text-[10px] text-foreground/40">{item.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Company */}
                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-foreground/40 mb-3">Company</p>
                  {dropdowns.company.items.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 py-2 group"
                    >
                      <span className="text-foreground/40 group-hover:text-foreground transition-colors">
                        {item.icon}
                      </span>
                      <div>
                        <p className="text-sm text-foreground group-hover:opacity-80">{item.name}</p>
                        <p className="text-[10px] text-foreground/40">{item.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="pt-4 border-t border-foreground/10">
                  <Link 
                    href="/contact" 
                    onClick={() => setIsOpen(false)}
                    className="block w-full bg-foreground text-background py-3 text-center text-[10px] uppercase tracking-widest font-bold hover:bg-foreground/90 transition-colors rounded-full"
                  >
                    Book Consultation
                  </Link>
                  <p className="text-[8px] text-foreground/30 text-center mt-3">
                    Wedding packages available with instant quote. All other services by custom consultation.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}