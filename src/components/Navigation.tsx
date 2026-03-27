"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navigation() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("")
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

    // Handle swipe/touch to close
    let touchStartX = 0
    let touchEndX = 0
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX
    }
    
    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX
      if (isOpen && touchStartX - touchEndX > 50) { // Swipe left to close
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
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  if (!mounted) return null

  const isActive = (section: string) => {
    return activeSection === section.toLowerCase() ? 'opacity-100 font-bold' : 'opacity-40'
  }

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-700 ${
      scrolled 
        ? "bg-background/80 backdrop-blur-xl border-b border-foreground/10 py-4" 
        : "bg-transparent py-8"
    }`}>
      <div className="container mx-auto px-6 flex justify-between items-center text-foreground">
        
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-[0.3em] uppercase text-foreground z-[110]">
          Events<span className="font-extralight opacity-50">District</span>
        </Link>

        <div className="flex items-center space-x-4 lg:space-x-12">
          {/* Desktop Nav Items - Now hidden on md devices */}
          <div className="hidden lg:flex items-center space-x-12">
            {['Portfolio', 'Services', 'About'].map((item) => (
              <Link 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className={`text-[10px] uppercase tracking-[0.4em] font-medium text-foreground hover:opacity-100 transition-all ${isActive(item)}`}
                onClick={() => setIsOpen(false)}
              >
                {item}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center space-x-4 border-l border-foreground/10 pl-4 lg:pl-6">
            {/* Theme Toggle - Always outside hamburger */}
            <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
              className="p-2 hover:bg-foreground/5 rounded-full transition-all text-foreground"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Desktop CTA - Now hidden on md devices */}
            <button className="hidden lg:block bg-foreground text-background px-6 py-3 text-[10px] uppercase tracking-[0.2em] font-bold">
              Book a Consultation
            </button>

            {/* Custom Animated Hamburger Menu - Now visible on md devices */}
            <button 
              className="lg:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5 z-[110]"
              onClick={() => setIsOpen(!isOpen)}
            >
              <motion.span 
                animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                className="w-6 h-[1.5px] bg-foreground block origin-center"
              />
              <motion.span 
                animate={isOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                className="w-6 h-[1.5px] bg-foreground block"
              />
              <motion.span 
                animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                className="w-6 h-[1.5px] bg-foreground block origin-center"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark Overlay - Clicking this closes the menu */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm z-[101]"
            />
            
            {/* The Menu Drawer */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-screen w-[75%] max-w-[300px] bg-background border-l border-foreground/5 z-[105] p-12 flex flex-col justify-center shadow-2xl"
            >
              <div className="flex flex-col space-y-8">
                {['Portfolio', 'Services', 'About'].map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 + 0.3 }}
                  >
                    <Link 
                      href={`#${item.toLowerCase()}`} 
                      onClick={() => setIsOpen(false)}
                      className={`text-2xl font-light uppercase tracking-widest text-foreground block hover:italic transition-all ${
                        activeSection === item.toLowerCase() ? 'font-bold italic' : ''
                      }`}
                    >
                      {item}
                      {activeSection === item.toLowerCase() && (
                        <span className="ml-2 text-xs opacity-50">•</span>
                      )}
                    </Link>
                  </motion.div>
                ))}
                <motion.button 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-8 bg-foreground text-background py-4 text-[10px] uppercase tracking-widest font-bold"
                >
                  Book Consultation
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}