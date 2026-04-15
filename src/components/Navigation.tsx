"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sun, Moon, ChevronDown, Calculator, BookOpen, Briefcase, Users, Heart, Coffee, Crown, Sparkles, Calendar, MessageCircle, Clock, PartyPopper, Cake, GraduationCap, Gift, Music, Globe, Building, Church, ArrowRight, Images } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { usePathname } from "next/navigation"

const goldColors = {
  light: '#D4AF37',
  dark: '#FFD700',
  metallic: 'linear-gradient(135deg, #D4AF37 0%, #FFF2A8 50%, #D4AF37 100%)',
  shadow: 'rgba(212, 175, 55, 0.2)',
  glow: 'rgba(212, 175, 55, 0.15)',
}

export default function Navigation() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileSection, setMobileSection] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const isDark = theme === 'dark'

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)

    // FIX: use position:fixed + width:100% for reliable scroll lock on iOS/Android
    if (isOpen) {
      document.body.style.overflow = "hidden"
      document.body.style.position = "fixed"
      document.body.style.width = "100%"
    } else {
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.width = ""
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.width = ""
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setIsOpen(false); setOpenDropdown(null) }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  // Close mobile overlay on route change
  useEffect(() => {
    setIsOpen(false)
    setOpenDropdown(null)
  }, [pathname])

  if (!mounted) return null

  const isActiveLink = (href: string) => {
    if (href === '/quote') return pathname === '/quote'
    if (href === '/blog') return pathname === '/blog' || pathname?.startsWith('/blog/')
    if (href === '/portfolio') return pathname === '/portfolio'
    return pathname === href
  }

  const allServices = {
    romance: [
      { name: "Wedding Decor", href: "/quote", icon: <Heart size={13} />, description: "Ceremony arches, aisle styling, reception centerpieces", available: true },
      { name: "Engagement Parties", href: "/contact", icon: <Sparkles size={13} />, description: "Romantic setups, proposal backdrops" },
      { name: "Bridal Showers", href: "/contact", icon: <Gift size={13} />, description: "Feminine, elegant decor with custom backdrops" },
      { name: "Rehearsal Dinners", href: "/contact", icon: <Coffee size={13} />, description: "Sophisticated table settings, ambient lighting" },
      { name: "Anniversary Celebrations", href: "/contact", icon: <Heart size={13} />, description: "Milestone anniversaries, vow renewals" },
      { name: "Traditional Ceremonies", href: "/contact", icon: <Globe size={13} />, description: "Intimate ceremonies, recommitment celebrations" },
    ],
    social: [
      { name: "Birthday Decor", href: "/contact", icon: <Cake size={13} />, description: "Milestone birthdays, themed parties" },
      { name: "Graduation Parties", href: "/contact", icon: <GraduationCap size={13} />, description: "Personal celebrations, achievement backdrops" },
      { name: "Baby Showers", href: "/contact", icon: <PartyPopper size={13} />, description: "Gender reveal setups, whimsical themes" },
      { name: "Picnic Dates", href: "/contact", icon: <Coffee size={13} />, description: "Luxury picnic setups with cushions, florals" },
      { name: "Surprise Parties", href: "/contact", icon: <Sparkles size={13} />, description: "Full reveal setups, dramatic entrances" },
      { name: "Memorial Services", href: "/contact", icon: <Heart size={13} />, description: "Celebrations of life, tribute events" },
    ],
    corporate: [
      { name: "Corporate Events", href: "/contact", icon: <Briefcase size={13} />, description: "Branded environments, stage design" },
      { name: "Product Launches", href: "/contact", icon: <Sparkles size={13} />, description: "Immersive brand activations" },
      { name: "Gala Dinners", href: "/contact", icon: <Crown size={13} />, description: "Luxurious table settings, red carpet" },
      { name: "Award Ceremonies", href: "/contact", icon: <TrophyIcon size={13} />, description: "Stage grandeur, trophy displays" },
      { name: "Conferences", href: "/contact", icon: <Users size={13} />, description: "Speaker stages, registration branding" },
      { name: "Trade Shows", href: "/contact", icon: <Briefcase size={13} />, description: "Booth design, branded activations" },
    ],
    institutional: [
      { name: "Graduation Ceremonies", href: "/contact", icon: <GraduationCap size={13} />, description: "Full school/university decor" },
      { name: "University Events", href: "/contact", icon: <Building size={13} />, description: "Freshers' balls, alumni galas" },
      { name: "Charity Galas", href: "/contact", icon: <Heart size={13} />, description: "Elegant decor, mission-driven" },
      { name: "Community Festivals", href: "/contact", icon: <Music size={13} />, description: "Large-scale installations" },
      { name: "Political Events", href: "/contact", icon: <Globe size={13} />, description: "Rallies, inaugurations, diplomatic functions" },
      { name: "Religious Ceremonies", href: "/contact", icon: <Church size={13} />, description: "Weddings, baptisms, cultural celebrations" },
    ],
    culinary: [
      { name: "Catering Presentation", href: "/contact", icon: <Coffee size={13} />, description: "Food stations, buffet styling" },
      { name: "Bar & Lounge", href: "/contact", icon: <Coffee size={13} />, description: "Signature drink stations, champagne walls" },
      { name: "Cakes & Confectionery", href: "/contact", icon: <Cake size={13} />, description: "Custom cake displays, dessert tables" },
      { name: "Dining Experiences", href: "/contact", icon: <Coffee size={13} />, description: "Tablescaping, thematic dining rooms" },
      { name: "Food Festivals", href: "/contact", icon: <Music size={13} />, description: "Outdoor culinary events, tasting stations" },
      { name: "Private Chef Experiences", href: "/contact", icon: <Crown size={13} />, description: "Intimate dining, chef table styling" },
    ]
  }

  const resources = [
    { name: "Wedding Quote", href: "/quote", icon: <Calculator size={13} />, description: "Instant pricing for weddings" },
    { name: "The Journal", href: "/blog", icon: <BookOpen size={13} />, description: "Stories & insights" },
    { name: "Free Checklist", href: "/free-guide", icon: <Sparkles size={13} />, description: "Wedding planning guide" },
  ]

  const company = [
    { name: "About Us", href: "/about", icon: <Users size={13} />, description: "Our story & philosophy" },
    { name: "Portfolio", href: "/portfolio", icon: <Images size={13} />, description: "Our work" },
    { name: "Contact", href: "/contact", icon: <MessageCircle size={13} />, description: "Get in touch" },
  ]

  const serviceCategories = [
    { key: 'romance', label: 'Romance & Weddings', services: allServices.romance },
    { key: 'social', label: 'Social & Celebrations', services: allServices.social },
    { key: 'corporate', label: 'Corporate & Professional', services: allServices.corporate },
    { key: 'institutional', label: 'Institutional & Scale', services: allServices.institutional },
    { key: 'culinary', label: 'Culinary & Dining', services: allServices.culinary },
  ]

  return (
    <>
      {/* Nav bar — z-[100] */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-700 ${
        scrolled
          ? isDark
            ? "bg-black/80 backdrop-blur-xl border-b border-white/5 shadow-lg"
            : "bg-white/80 backdrop-blur-xl border-b border-black/5 shadow-lg"
          : "bg-transparent"
      }`}
      style={{ boxShadow: scrolled ? `0 4px 30px -8px ${goldColors.shadow}` : 'none' }}
      >
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center h-16 lg:h-20">

          {/* ── Logo ── */}
          <Link href="/" className="relative z-[110] group">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-baseline gap-0.5 relative"
            >
              <span className={`text-lg md:text-xl lg:text-2xl font-light tracking-[0.15em] uppercase ${isDark ? 'text-white' : 'text-black'}`}>
                Events
              </span>
              <span
                className="text-lg md:text-xl lg:text-2xl font-bold tracking-[0.15em] uppercase bg-clip-text text-transparent"
                style={{ backgroundImage: goldColors.metallic, WebkitBackgroundClip: 'text' }}
              >
                District
              </span>
              <motion.div
                className="absolute -bottom-1 left-0 w-full h-px origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                style={{ background: goldColors.metallic }}
              />
            </motion.div>
          </Link>

          {/* ── Desktop Nav (lg+) ── */}
          <div className="hidden lg:flex items-center gap-8" ref={dropdownRef}>

            {/* Services */}
            <DesktopDropdownTrigger
              label="Services"
              isOpen={openDropdown === 'services'}
              onToggle={() => setOpenDropdown(openDropdown === 'services' ? null : 'services')}
              onHover={() => setOpenDropdown('services')}
              goldColors={goldColors}
            />

            {/* Resources */}
            <DesktopDropdownTrigger
              label="Resources"
              isOpen={openDropdown === 'resources'}
              onToggle={() => setOpenDropdown(openDropdown === 'resources' ? null : 'resources')}
              onHover={() => setOpenDropdown('resources')}
              goldColors={goldColors}
            />

            {/* Company */}
            <DesktopDropdownTrigger
              label="Company"
              isOpen={openDropdown === 'company'}
              onToggle={() => setOpenDropdown(openDropdown === 'company' ? null : 'company')}
              onHover={() => setOpenDropdown('company')}
              goldColors={goldColors}
            />

            {/* Divider */}
            <div className={`w-px h-4 ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />

            {/* Quick links */}
            {[
              { href: '/portfolio', label: 'Portfolio', icon: <Images size={11} /> },
              { href: '/quote', label: 'Quote', icon: <Calculator size={11} /> },
              { href: '/blog', label: 'Journal', icon: <BookOpen size={11} /> },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] font-medium transition-all duration-300 ${
                  isActiveLink(link.href) ? 'opacity-100' : 'opacity-50 hover:opacity-100'
                }`}
                style={{ color: isActiveLink(link.href) ? goldColors.light : undefined }}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}

            {/* Theme toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`p-2 rounded-full transition-all duration-300 ${isDark ? 'text-white hover:bg-white/5' : 'text-black hover:bg-black/5'}`}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </motion.button>

            {/* CTA */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/contact"
                className="px-5 py-2 text-[10px] uppercase tracking-[0.2em] font-bold rounded-full transition-all duration-300 text-black"
                style={{ background: goldColors.metallic, boxShadow: `0 2px 12px ${goldColors.shadow}` }}
              >
                Book Consultation
              </Link>
            </motion.div>
          </div>

          {/* ── Mobile / Tablet right controls (< lg) ── */}
          <div className="flex lg:hidden items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`p-2 rounded-full transition-all duration-300 ${isDark ? 'text-white' : 'text-black'}`}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </motion.button>

            {/* FIX: z-[210] so button sits above the overlay (z-200) */}
            <button
              className="relative z-[210] w-10 h-10 flex flex-col justify-center items-center gap-1.5"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              <motion.span
                animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`block w-5 h-[1.5px] origin-center ${isOpen || isDark ? 'bg-white' : 'bg-black'}`}
              />
              <motion.span
                animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.2 }}
                className={`block w-5 h-[1.5px] ${isOpen || isDark ? 'bg-white' : 'bg-black'}`}
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`block w-5 h-[1.5px] origin-center ${isOpen || isDark ? 'bg-white' : 'bg-black'}`}
              />
            </button>
          </div>
        </div>

        {/* ── Desktop Dropdowns ── */}
        <AnimatePresence>
          {openDropdown === 'services' && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`absolute top-full left-0 w-full border-b ${isDark ? 'bg-black/95 border-white/5' : 'bg-white/95 border-black/5'} backdrop-blur-xl shadow-2xl`}
              style={{ boxShadow: `0 20px 60px -12px ${goldColors.shadow}` }}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <div className="h-px w-full" style={{ background: goldColors.metallic }} />
              <div className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-6 gap-6">
                  {serviceCategories.map((cat) => (
                    <div key={cat.key}>
                      <p className="text-[9px] uppercase tracking-[0.3em] mb-4 pb-2 border-b" style={{ color: goldColors.light, borderColor: goldColors.light + '30' }}>
                        {cat.label}
                      </p>
                      <div className="space-y-1">
                        {cat.services.slice(0, 3).map((service) => (
                          <Link
                            key={service.name}
                            href={service.href}
                            onClick={() => setOpenDropdown(null)}
                            className={`flex items-start gap-2.5 p-2 rounded-lg transition-all duration-200 group ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/4'}`}
                          >
                            <span className={`mt-0.5 shrink-0 transition-colors ${isDark ? 'text-white/30 group-hover:text-white/70' : 'text-black/30 group-hover:text-black/70'}`}>
                              {service.icon}
                            </span>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <p className={`text-xs font-medium transition-colors ${isDark ? 'text-white/80 group-hover:text-white' : 'text-black/80 group-hover:text-black'}`}>
                                  {service.name}
                                </p>
                                {'available' in service && (service as any).available && (
                                  <span className="text-[8px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: goldColors.light + '20', color: goldColors.light }}>
                                    Instant
                                  </span>
                                )}
                              </div>
                              <p className={`text-[10px] mt-0.5 leading-snug ${isDark ? 'text-white/35' : 'text-black/40'}`}>
                                {service.description}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <Link
                        href="/services"
                        onClick={() => setOpenDropdown(null)}
                        className="inline-flex items-center gap-1 mt-3 text-[10px] group transition-all"
                        style={{ color: goldColors.light }}
                      >
                        <span>+3 more</span>
                        <ArrowRight size={9} className="group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  ))}
                  <div className="pl-4 border-l" style={{ borderColor: goldColors.light + '20' }}>
                    <p className="text-[9px] uppercase tracking-[0.3em] mb-4" style={{ color: goldColors.light }}>Featured</p>
                    <div className="rounded-xl p-4 mb-4" style={{ background: goldColors.light + '10', border: `1px solid ${goldColors.light}25` }}>
                      <div className="flex items-center gap-2 mb-3">
                        <Calculator size={14} style={{ color: goldColors.light }} />
                        <span className="text-[9px] uppercase tracking-wider font-medium" style={{ color: goldColors.light }}>Instant Quote</span>
                      </div>
                      <p className={`text-sm font-medium mb-1 ${isDark ? 'text-white' : 'text-black'}`}>Wedding Decor</p>
                      <p className={`text-[10px] leading-relaxed mb-3 ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                        Get a tailored quote in minutes — packages starting from KES 30,000
                      </p>
                      <Link
                        href="/quote"
                        onClick={() => setOpenDropdown(null)}
                        className="block text-center py-2 text-[10px] uppercase tracking-widest font-bold rounded-full text-black"
                        style={{ background: goldColors.metallic }}
                      >
                        Get Quote
                      </Link>
                    </div>
                    <Link
                      href="/portfolio"
                      onClick={() => setOpenDropdown(null)}
                      className={`flex items-center gap-2 text-xs transition-colors group ${isDark ? 'text-white/50 hover:text-white' : 'text-black/50 hover:text-black'}`}
                    >
                      <Images size={12} />
                      <span>View Portfolio</span>
                      <ArrowRight size={10} className="ml-auto group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {openDropdown === 'resources' && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`absolute top-full left-0 w-full border-b ${isDark ? 'bg-black/95 border-white/5' : 'bg-white/95 border-black/5'} backdrop-blur-xl`}
              style={{ boxShadow: `0 20px 60px -12px ${goldColors.shadow}` }}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <div className="h-px w-full" style={{ background: goldColors.metallic }} />
              <div className="container mx-auto px-6 py-6">
                <div className="flex gap-4 max-w-lg">
                  {resources.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setOpenDropdown(null)}
                      className={`flex-1 flex items-start gap-3 p-3 rounded-xl transition-all duration-200 group ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/4'}`}
                    >
                      <span className={`mt-0.5 shrink-0 transition-colors ${isDark ? 'text-white/30 group-hover:text-white/70' : 'text-black/30 group-hover:text-black/70'}`}>
                        {item.icon}
                      </span>
                      <div>
                        <p className={`text-xs font-medium ${isDark ? 'text-white/80' : 'text-black/80'}`}>{item.name}</p>
                        <p className={`text-[10px] mt-0.5 ${isDark ? 'text-white/40' : 'text-black/40'}`}>{item.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {openDropdown === 'company' && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`absolute top-full left-0 w-full border-b ${isDark ? 'bg-black/95 border-white/5' : 'bg-white/95 border-black/5'} backdrop-blur-xl`}
              style={{ boxShadow: `0 20px 60px -12px ${goldColors.shadow}` }}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <div className="h-px w-full" style={{ background: goldColors.metallic }} />
              <div className="container mx-auto px-6 py-6">
                <div className="flex gap-4 max-w-lg">
                  {company.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setOpenDropdown(null)}
                      className={`flex-1 flex items-start gap-3 p-3 rounded-xl transition-all duration-200 group ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/4'}`}
                    >
                      <span className={`mt-0.5 shrink-0 transition-colors ${isDark ? 'text-white/30 group-hover:text-white/70' : 'text-black/30 group-hover:text-black/70'}`}>
                        {item.icon}
                      </span>
                      <div>
                        <p className={`text-xs font-medium ${isDark ? 'text-white/80' : 'text-black/80'}`}>{item.name}</p>
                        <p className={`text-[10px] mt-0.5 ${isDark ? 'text-white/40' : 'text-black/40'}`}>{item.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Mobile / Tablet Full-screen Overlay ──
          FIX: z-[200] so it sits above the nav (z-100) but below the hamburger (z-210).
          Slides in from the right so it feels like a native drawer.
          Uses fixed inset-0 correctly as a sibling of <nav>, not nested inside it.
      ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
            className={`fixed inset-0 z-[200] flex flex-col lg:hidden ${isDark ? 'bg-black' : 'bg-white'}`}
          >
            {/* Gold top line */}
            <div className="h-px w-full flex-shrink-0" style={{ background: goldColors.metallic }} />

            {/* Gold ambient orb */}
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: `radial-gradient(circle, ${goldColors.glow} 0%, transparent 70%)` }}
            />

            {/* Header row */}
            <div className={`flex justify-between items-center px-6 h-16 flex-shrink-0 border-b ${isDark ? 'border-white/5' : 'border-black/5'}`}>
              <Link href="/" onClick={() => setIsOpen(false)} className="flex items-baseline gap-0.5">
                <span className={`text-xl font-light tracking-[0.15em] uppercase ${isDark ? 'text-white' : 'text-black'}`}>Events</span>
                <span
                  className="text-xl font-bold tracking-[0.15em] uppercase bg-clip-text text-transparent"
                  style={{ backgroundImage: goldColors.metallic, WebkitBackgroundClip: 'text' }}
                >District</span>
              </Link>
              {/* Close button inside the overlay */}
              <button
                onClick={() => setIsOpen(false)}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${isDark ? 'hover:bg-white/5 text-white' : 'hover:bg-black/5 text-black'}`}
                aria-label="Close menu"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 pb-8 pt-2">

              {/* Featured CTA card */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8 rounded-2xl p-5 mt-4"
                style={{ background: goldColors.light + '12', border: `1px solid ${goldColors.light}30` }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1 h-1 rounded-full" style={{ background: goldColors.light }} />
                  <span className="text-[9px] uppercase tracking-[0.3em]" style={{ color: goldColors.light }}>Available Now</span>
                </div>
                <Link href="/quote" onClick={() => setIsOpen(false)}>
                  <p className={`text-xl font-light mb-1 ${isDark ? 'text-white' : 'text-black'}`}>Wedding Quote</p>
                  <p className={`text-xs mb-3 ${isDark ? 'text-white/50' : 'text-black/50'}`}>Instant pricing — packages from KES 30,000</p>
                  <span
                    className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold"
                    style={{ color: goldColors.light }}
                  >
                    Get Quote <ArrowRight size={10} />
                  </span>
                </Link>
              </motion.div>

              {/* Service categories as accordion */}
              <div className="mb-6">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="text-[9px] uppercase tracking-[0.3em] mb-4"
                  style={{ color: goldColors.light }}
                >
                  Services
                </motion.p>

                {serviceCategories.map((cat, ci) => (
                  <motion.div
                    key={cat.key}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + ci * 0.05 }}
                    className={`border-b ${isDark ? 'border-white/8' : 'border-black/8'}`}
                  >
                    <button
                      onClick={() => setMobileSection(mobileSection === cat.key ? null : cat.key)}
                      className={`w-full flex items-center justify-between py-4 text-left ${isDark ? 'text-white' : 'text-black'}`}
                    >
                      <span className="text-base font-light tracking-wide">{cat.label}</span>
                      <motion.span
                        animate={{ rotate: mobileSection === cat.key ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown size={14} className={isDark ? 'text-white/40' : 'text-black/40'} />
                      </motion.span>
                    </button>

                    <AnimatePresence>
                      {mobileSection === cat.key && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="pb-4 space-y-1">
                            {cat.services.map((service) => (
                              <Link
                                key={service.name}
                                href={service.href}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-start gap-3 px-2 py-2.5 rounded-lg transition-colors group ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/4'}`}
                              >
                                <span className={`mt-0.5 shrink-0 ${isDark ? 'text-white/30' : 'text-black/30'}`}>{service.icon}</span>
                                <div>
                                  <p className={`text-sm ${isDark ? 'text-white/80' : 'text-black/80'}`}>{service.name}</p>
                                  <p className={`text-[10px] mt-0.5 ${isDark ? 'text-white/35' : 'text-black/40'}`}>{service.description}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>

              {/* Resources + Company in a clean grid */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] mb-3" style={{ color: goldColors.light }}>Resources</p>
                  {resources.map((item, i) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-2 py-2.5 text-sm font-light transition-colors ${isDark ? 'text-white/60 hover:text-white' : 'text-black/60 hover:text-black'}`}
                      >
                        <span className={isDark ? 'text-white/30' : 'text-black/30'}>{item.icon}</span>
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] mb-3" style={{ color: goldColors.light }}>Company</p>
                  {company.map((item, i) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-2 py-2.5 text-sm font-light transition-colors ${isDark ? 'text-white/60 hover:text-white' : 'text-black/60 hover:text-black'}`}
                      >
                        <span className={isDark ? 'text-white/30' : 'text-black/30'}>{item.icon}</span>
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Bottom CTA */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-3"
              >
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-3.5 text-center text-[10px] uppercase tracking-widest font-bold rounded-full text-black"
                  style={{ background: goldColors.metallic, boxShadow: `0 4px 20px ${goldColors.shadow}` }}
                >
                  Book Consultation
                </Link>
                <p className={`text-[9px] text-center ${isDark ? 'text-white/25' : 'text-black/30'}`}>
                  Wedding packages available with instant quote · All other services by consultation
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ── Reusable desktop trigger ──
function DesktopDropdownTrigger({ label, isOpen, onToggle, onHover, goldColors }: {
  label: string
  isOpen: boolean
  onToggle: () => void
  onHover: () => void
  goldColors: { light: string; dark: string; metallic: string; shadow: string; glow: string }
}) {
  return (
    <button
      onClick={onToggle}
      onMouseEnter={onHover}
      className={`flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] font-medium transition-all duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-55 hover:opacity-100'
      }`}
      style={{ color: isOpen ? goldColors.light : undefined }}
    >
      {label}
      <ChevronDown size={11} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
  )
}

function TrophyIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
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
