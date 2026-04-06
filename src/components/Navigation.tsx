"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sun, Moon, ChevronDown, Calculator, BookOpen, Briefcase, Users, Heart, Coffee, Crown, Sparkles, Calendar, MessageCircle, Clock, PartyPopper, Cake, GraduationCap, Gift, Music, Globe, Building, Church, ArrowRight, Images } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navigation() {
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
    
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)

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

    const sections = ['portfolio', 'services', 'about']
    sections.forEach((section) => {
      const element = document.getElementById(section)
      if (element) observer.observe(element)
    })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      document.body.style.overflow = "unset"
      document.removeEventListener('mousedown', handleClickOutside)
      sections.forEach((section) => {
        const element = document.getElementById(section)
        if (element) observer.unobserve(element)
      })
    }
  }, [isOpen])

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

  // All services from your ServicesCodex
  const allServices = {
    romance: [
      { name: "Wedding Decor", href: "/quote", icon: <Heart size={14} />, description: "Ceremony arches, aisle styling, reception centerpieces", available: true },
      { name: "Engagement Parties", href: "/contact", icon: <Sparkles size={14} />, description: "Romantic setups, proposal backdrops", available: false },
      { name: "Bridal Showers", href: "/contact", icon: <Gift size={14} />, description: "Feminine, elegant decor with custom backdrops", available: false },
      { name: "Rehearsal Dinners", href: "/contact", icon: <Coffee size={14} />, description: "Sophisticated table settings, ambient lighting", available: false },
      { name: "Anniversary Celebrations", href: "/contact", icon: <Heart size={14} />, description: "Milestone anniversaries, vow renewals", available: false },
      { name: "Traditional Ceremonies", href: "/contact", icon: <Globe size={14} />, description: "Intimate ceremonies, recommitment celebrations", available: false },
    ],
    social: [
      { name: "Birthday Decor", href: "/contact", icon: <Cake size={14} />, description: "Milestone birthdays, themed parties", available: false },
      { name: "Graduation Parties", href: "/contact", icon: <GraduationCap size={14} />, description: "Personal celebrations, achievement backdrops", available: false },
      { name: "Baby Showers", href: "/contact", icon: <PartyPopper size={14} />, description: "Gender reveal setups, whimsical themes", available: false },
      { name: "Picnic Dates", href: "/contact", icon: <Coffee size={14} />, description: "Luxury picnic setups with cushions, florals", available: false },
      { name: "Surprise Parties", href: "/contact", icon: <Sparkles size={14} />, description: "Full reveal setups, dramatic entrances", available: false },
      { name: "Memorial Services", href: "/contact", icon: <Heart size={14} />, description: "Celebrations of life, tribute events", available: false },
    ],
    corporate: [
      { name: "Corporate Events", href: "/contact", icon: <Briefcase size={14} />, description: "Branded environments, stage design", available: false },
      { name: "Product Launches", href: "/contact", icon: <Sparkles size={14} />, description: "Immersive brand activations", available: false },
      { name: "Gala Dinners", href: "/contact", icon: <Crown size={14} />, description: "Luxurious table settings, red carpet", available: false },
      { name: "Award Ceremonies", href: "/contact", icon: <TrophyIcon size={14} />, description: "Stage grandeur, trophy displays", available: false },
      { name: "Conferences", href: "/contact", icon: <Users size={14} />, description: "Speaker stages, registration branding", available: false },
      { name: "Trade Shows", href: "/contact", icon: <Briefcase size={14} />, description: "Booth design, branded activations", available: false },
    ],
    institutional: [
      { name: "Graduation Ceremonies", href: "/contact", icon: <GraduationCap size={14} />, description: "Full school/university decor", available: false },
      { name: "University Events", href: "/contact", icon: <Building size={14} />, description: "Freshers' balls, alumni galas", available: false },
      { name: "Charity Galas", href: "/contact", icon: <Heart size={14} />, description: "Elegant decor, mission-driven", available: false },
      { name: "Community Festivals", href: "/contact", icon: <Music size={14} />, description: "Large-scale installations", available: false },
      { name: "Political Events", href: "/contact", icon: <Globe size={14} />, description: "Rallies, inaugurations, diplomatic functions", available: false },
      { name: "Religious Ceremonies", href: "/contact", icon: <Church size={14} />, description: "Weddings, baptisms, cultural celebrations", available: false },
    ],
    culinary: [
      { name: "Catering Presentation", href: "/contact", icon: <Coffee size={14} />, description: "Food stations, buffet styling", available: false },
      { name: "Bar & Lounge", href: "/contact", icon: <Coffee size={14} />, description: "Signature drink stations, champagne walls", available: false },
      { name: "Cakes & Confectionery", href: "/contact", icon: <Cake size={14} />, description: "Custom cake displays, dessert tables", available: false },
      { name: "Dining Experiences", href: "/contact", icon: <Coffee size={14} />, description: "Tablescaping, thematic dining rooms", available: false },
      { name: "Food Festivals", href: "/contact", icon: <Music size={14} />, description: "Outdoor culinary events, tasting stations", available: false },
      { name: "Private Chef Experiences", href: "/contact", icon: <Crown size={14} />, description: "Intimate dining, chef table styling", available: false },
    ]
  }

  const resources = {
    items: [
      { name: "Wedding Quote", href: "/quote", icon: <Calculator size={14} />, description: "Instant pricing for weddings" },
      { name: "The Journal", href: "/blog", icon: <BookOpen size={14} />, description: "Stories & insights" },
      { name: "Free Checklist", href: "/#free-guide", icon: <Sparkles size={14} />, description: "Wedding planning guide" },
    ]
  }

  const company = {
    items: [
      { name: "About Us", href: "/#about", icon: <Users size={14} />, description: "Our story & philosophy" },
      { name: "Portfolio", href: "/portfolio", icon: <Images size={14} />, description: "Our work" },
      { name: "Contact", href: "/contact", icon: <MessageCircle size={14} />, description: "Get in touch" },
    ]
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
            {/* Portfolio Link - Added */}
            <Link 
              href="/portfolio" 
              className={`text-[10px] uppercase tracking-[0.3em] font-medium text-foreground hover:opacity-100 transition-all ${
                isActiveLink('/portfolio') ? 'opacity-100' : 'opacity-60'
              }`}
            >
              Portfolio
            </Link>

            {/* Services Dropdown - 3 services per category + "X more" */}
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
                    className="absolute top-full left-0 mt-3 w-[1000px] bg-background border border-foreground/10 rounded-xl shadow-2xl overflow-hidden"
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <div className="grid grid-cols-5 gap-5 p-6">
                      {/* Romance & Weddings */}
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-4">Romance & Weddings</p>
                        {allServices.romance.slice(0, 3).map((service) => (
                          <Link
                            key={service.name}
                            href={service.href}
                            className="flex items-start gap-3 p-2 hover:bg-foreground/5 transition-colors group rounded-lg mb-3"
                            onClick={() => setOpenDropdown(null)}
                          >
                            <div className="mt-0.5 text-foreground/40 group-hover:text-foreground transition-colors shrink-0">
                              {service.icon}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-sm font-medium text-foreground group-hover:text-foreground/80 whitespace-nowrap">
                                  {service.name}
                                </p>
                                {service.available && (
                                  <span className="text-[8px] px-1.5 py-0.5 bg-foreground/10 text-foreground/60 rounded-full whitespace-nowrap">
                                    Quote
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-foreground/40 leading-relaxed mt-0.5">
                                {service.description}
                              </p>
                            </div>
                          </Link>
                        ))}
                        <Link
                          href="/services"
                          className="inline-flex items-center gap-1 mt-1 text-[10px] text-foreground/50 hover:text-foreground transition-colors group"
                          onClick={() => setOpenDropdown(null)}
                        >
                          <span>View all +3 more</span>
                          <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                      
                      {/* Social & Celebrations */}
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-4">Social & Celebrations</p>
                        {allServices.social.slice(0, 3).map((service) => (
                          <Link
                            key={service.name}
                            href={service.href}
                            className="flex items-start gap-3 p-2 hover:bg-foreground/5 transition-colors group rounded-lg mb-3"
                            onClick={() => setOpenDropdown(null)}
                          >
                            <div className="mt-0.5 text-foreground/40 group-hover:text-foreground transition-colors shrink-0">
                              {service.icon}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground group-hover:text-foreground/80 whitespace-nowrap">
                                {service.name}
                              </p>
                              <p className="text-[10px] text-foreground/40 leading-relaxed mt-0.5">
                                {service.description}
                              </p>
                            </div>
                          </Link>
                        ))}
                        <Link
                          href="/services"
                          className="inline-flex items-center gap-1 mt-1 text-[10px] text-foreground/50 hover:text-foreground transition-colors group"
                          onClick={() => setOpenDropdown(null)}
                        >
                          <span>View all +3 more</span>
                          <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                      
                      {/* Corporate & Professional */}
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-4">Corporate & Professional</p>
                        {allServices.corporate.slice(0, 3).map((service) => (
                          <Link
                            key={service.name}
                            href={service.href}
                            className="flex items-start gap-3 p-2 hover:bg-foreground/5 transition-colors group rounded-lg mb-3"
                            onClick={() => setOpenDropdown(null)}
                          >
                            <div className="mt-0.5 text-foreground/40 group-hover:text-foreground transition-colors shrink-0">
                              {service.icon}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground group-hover:text-foreground/80 whitespace-nowrap">
                                {service.name}
                              </p>
                              <p className="text-[10px] text-foreground/40 leading-relaxed mt-0.5">
                                {service.description}
                              </p>
                            </div>
                          </Link>
                        ))}
                        <Link
                          href="/services"
                          className="inline-flex items-center gap-1 mt-1 text-[10px] text-foreground/50 hover:text-foreground transition-colors group"
                          onClick={() => setOpenDropdown(null)}
                        >
                          <span>View all +3 more</span>
                          <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                      
                      {/* Institutional & Scale */}
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-4">Institutional & Scale</p>
                        {allServices.institutional.slice(0, 3).map((service) => (
                          <Link
                            key={service.name}
                            href={service.href}
                            className="flex items-start gap-3 p-2 hover:bg-foreground/5 transition-colors group rounded-lg mb-3"
                            onClick={() => setOpenDropdown(null)}
                          >
                            <div className="mt-0.5 text-foreground/40 group-hover:text-foreground transition-colors shrink-0">
                              {service.icon}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground group-hover:text-foreground/80 whitespace-nowrap">
                                {service.name}
                              </p>
                              <p className="text-[10px] text-foreground/40 leading-relaxed mt-0.5">
                                {service.description}
                              </p>
                            </div>
                          </Link>
                        ))}
                        <Link
                          href="/services"
                          className="inline-flex items-center gap-1 mt-1 text-[10px] text-foreground/50 hover:text-foreground transition-colors group"
                          onClick={() => setOpenDropdown(null)}
                        >
                          <span>View all +3 more</span>
                          <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                      
                      {/* Culinary & Dining */}
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-4">Culinary & Dining</p>
                        {allServices.culinary.slice(0, 3).map((service) => (
                          <Link
                            key={service.name}
                            href={service.href}
                            className="flex items-start gap-3 p-2 hover:bg-foreground/5 transition-colors group rounded-lg mb-3"
                            onClick={() => setOpenDropdown(null)}
                          >
                            <div className="mt-0.5 text-foreground/40 group-hover:text-foreground transition-colors shrink-0">
                              {service.icon}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground group-hover:text-foreground/80 whitespace-nowrap">
                                {service.name}
                              </p>
                              <p className="text-[10px] text-foreground/40 leading-relaxed mt-0.5">
                                {service.description}
                              </p>
                            </div>
                          </Link>
                        ))}
                        <Link
                          href="/services"
                          className="inline-flex items-center gap-1 mt-1 text-[10px] text-foreground/50 hover:text-foreground transition-colors group"
                          onClick={() => setOpenDropdown(null)}
                        >
                          <span>View all +3 more</span>
                          <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                    <div className="border-t border-foreground/10 p-3 bg-foreground/5">
                      <p className="text-[9px] text-foreground/40 text-center">
                        ✨ Wedding packages available with instant quote — all other services by custom consultation
                      </p>
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
                    {resources.items.map((item) => (
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
                          <p className="text-sm font-medium text-foreground group-hover:text-foreground/80 whitespace-nowrap">
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
                    {company.items.map((item) => (
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
                          <p className="text-sm font-medium text-foreground group-hover:text-foreground/80 whitespace-nowrap">
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
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-3 border-l border-foreground/10 pl-3 md:pl-4">
            {/* Quick Links */}
            <div className="hidden sm:flex items-center space-x-2 md:space-x-3">
              <Link 
                href="/portfolio"
                className={`flex items-center gap-1 text-[9px] md:text-[10px] uppercase tracking-wider font-medium transition-all ${
                  isActiveLink('/portfolio') ? 'text-foreground' : 'text-foreground/50 hover:text-foreground'
                }`}
              >
                <Images size={11} />
                <span>Portfolio</span>
              </Link>
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

            {/* Hamburger Menu */}
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

      {/* Mobile Sidebar Menu - Full responsive list */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm z-[105]"
            />
            
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-screen w-[85%] max-w-[360px] bg-background border-l border-foreground/5 z-[110] p-6 flex flex-col shadow-2xl overflow-y-auto"
            >
              <div className="flex justify-end mb-4">
                <button onClick={() => setIsOpen(false)} className="p-2">
                  <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col space-y-6">
                {/* Portfolio - Added to mobile menu */}
                <div className="border-b border-foreground/10 pb-4">
                  <Link 
                    href="/portfolio" 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 py-2 group"
                  >
                    <Images size={18} className="text-foreground/60 group-hover:text-foreground transition-colors" />
                    <span className="text-base font-medium text-foreground group-hover:opacity-80">Portfolio</span>
                  </Link>
                </div>

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

                {/* All Services - Full List */}
                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-foreground/40 mb-3">All Services</p>
                  <div className="space-y-4">
                    {/* Romance & Weddings */}
                    <div>
                      <p className="text-[10px] font-medium text-foreground/60 mb-2">Romance & Weddings</p>
                      {allServices.romance.map((service) => (
                        <Link
                          key={service.name}
                          href={service.href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-start gap-3 py-2 group"
                        >
                          <span className="text-foreground/40 group-hover:text-foreground transition-colors shrink-0 mt-0.5">
                            {service.icon}
                          </span>
                          <div className="flex-1">
                            <p className="text-sm text-foreground group-hover:opacity-80">
                              {service.name}
                            </p>
                            <p className="text-[10px] text-foreground/40 leading-relaxed">{service.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Social & Celebrations */}
                    <div>
                      <p className="text-[10px] font-medium text-foreground/60 mb-2">Social & Celebrations</p>
                      {allServices.social.map((service) => (
                        <Link
                          key={service.name}
                          href={service.href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-start gap-3 py-2 group"
                        >
                          <span className="text-foreground/40 group-hover:text-foreground transition-colors shrink-0 mt-0.5">
                            {service.icon}
                          </span>
                          <div className="flex-1">
                            <p className="text-sm text-foreground group-hover:opacity-80">
                              {service.name}
                            </p>
                            <p className="text-[10px] text-foreground/40 leading-relaxed">{service.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Corporate & Professional */}
                    <div>
                      <p className="text-[10px] font-medium text-foreground/60 mb-2">Corporate & Professional</p>
                      {allServices.corporate.map((service) => (
                        <Link
                          key={service.name}
                          href={service.href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-start gap-3 py-2 group"
                        >
                          <span className="text-foreground/40 group-hover:text-foreground transition-colors shrink-0 mt-0.5">
                            {service.icon}
                          </span>
                          <div className="flex-1">
                            <p className="text-sm text-foreground group-hover:opacity-80">
                              {service.name}
                            </p>
                            <p className="text-[10px] text-foreground/40 leading-relaxed">{service.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Institutional & Scale */}
                    <div>
                      <p className="text-[10px] font-medium text-foreground/60 mb-2">Institutional & Scale</p>
                      {allServices.institutional.map((service) => (
                        <Link
                          key={service.name}
                          href={service.href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-start gap-3 py-2 group"
                        >
                          <span className="text-foreground/40 group-hover:text-foreground transition-colors shrink-0 mt-0.5">
                            {service.icon}
                          </span>
                          <div className="flex-1">
                            <p className="text-sm text-foreground group-hover:opacity-80">
                              {service.name}
                            </p>
                            <p className="text-[10px] text-foreground/40 leading-relaxed">{service.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Culinary & Dining */}
                    <div>
                      <p className="text-[10px] font-medium text-foreground/60 mb-2">Culinary & Dining</p>
                      {allServices.culinary.map((service) => (
                        <Link
                          key={service.name}
                          href={service.href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-start gap-3 py-2 group"
                        >
                          <span className="text-foreground/40 group-hover:text-foreground transition-colors shrink-0 mt-0.5">
                            {service.icon}
                          </span>
                          <div className="flex-1">
                            <p className="text-sm text-foreground group-hover:opacity-80">
                              {service.name}
                            </p>
                            <p className="text-[10px] text-foreground/40 leading-relaxed">{service.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Resources */}
                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-foreground/40 mb-3">Resources</p>
                  {resources.items.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 py-2 group"
                    >
                      <span className="text-foreground/40 group-hover:text-foreground transition-colors shrink-0">
                        {item.icon}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm text-foreground group-hover:opacity-80">{item.name}</p>
                        <p className="text-[10px] text-foreground/40">{item.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Company */}
                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-foreground/40 mb-3">Company</p>
                  {company.items.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 py-2 group"
                    >
                      <span className="text-foreground/40 group-hover:text-foreground transition-colors shrink-0">
                        {item.icon}
                      </span>
                      <div className="flex-1">
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

// Trophy icon component
function TrophyIcon({ size = 14, className = "" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}