"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { useHeroData } from '@/hooks/useHeroData'

// Premium Gold Color Palette
const goldColors = {
  light: '#D4AF37',
  dark: '#FFD700',
  metallic: 'linear-gradient(135deg, #D4AF37 0%, #FFF2A8 50%, #D4AF37 100%)',
  shadow: 'rgba(212, 175, 55, 0.3)'
}

export default function Hero() {
  // Fetch data from database using our hook
  const { slides: dbSlides, testimonials: dbTestimonials, loading } = useHeroData()
  const { theme, resolvedTheme } = useTheme()
  const isDark = theme === 'dark' || resolvedTheme === 'dark'
  
  // Transform database slides to match component structure with safety check
  const slideData = dbSlides && dbSlides.length > 0 ? dbSlides.map(slide => ({
    id: slide.id,
    title: slide.title || '',
    subtitle: slide.subtitle || '',
    description: slide.description || '',
    ctaText: slide.cta_text || 'Explore Collections',
    ctaLink: slide.cta_link || '/portfolio',
    stillImage: slide.image_url || '',
    category: slide.category || 'Featured'
  })) : []

  // Transform database testimonials to match component structure
  const testimonials = dbTestimonials && dbTestimonials.length > 0 ? dbTestimonials.map(t => ({
    name: t.name || '',
    role: t.role || '',
    avatar: t.avatar_url || `https://ui-avatars.com/api/?background=D4AF37&color=fff&name=${encodeURIComponent(t.name || 'Client')}`,
    rating: t.rating || 5
  })) : []

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [particles, setParticles] = useState<Array<{ left: string; top: string; delay: number; duration: number }>>([])
  const autoPlayRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Reset selectedIndex if out of bounds
  useEffect(() => {
    if (slideData.length > 0 && selectedIndex >= slideData.length) {
      setSelectedIndex(0)
    }
  }, [slideData.length, selectedIndex])

  const nextSlide = useCallback(() => {
    if (slideData.length === 0) return
    setSelectedIndex((prev) => (prev + 1) % slideData.length)
  }, [slideData.length])

  const prevSlide = useCallback(() => {
    if (slideData.length === 0) return
    setSelectedIndex((prev) => (prev - 1 + slideData.length) % slideData.length)
  }, [slideData.length])

  // Generate particles only on client side to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
    const newParticles = Array(50).fill(null).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
    }))
    setParticles(newParticles)
  }, [])

  useEffect(() => {
    if (isAutoPlaying && slideData.length > 0) {
      autoPlayRef.current = setInterval(nextSlide, 5000)
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }
  }, [isAutoPlaying, nextSlide, slideData.length])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (slideData.length === 0) return
      if (e.key === 'ArrowLeft') {
        prevSlide()
        setIsAutoPlaying(false)
        setTimeout(() => setIsAutoPlaying(true), 10000)
      } else if (e.key === 'ArrowRight') {
        nextSlide()
        setIsAutoPlaying(false)
        setTimeout(() => setIsAutoPlaying(true), 10000)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [prevSlide, nextSlide, slideData.length])

  const handleMouseEnter = () => setIsAutoPlaying(false)
  const handleMouseLeave = () => setIsAutoPlaying(true)

  // Use dynamic viewport height to fix mobile gap issues
  const heroHeight = 'calc(100dvh - 64px)'

  // ✨ THEME-AWARE PREMIUM LOADING SCREEN
  if (loading) {
    return (
      <section className="relative w-full overflow-hidden" style={{ minHeight: heroHeight, height: heroHeight }}>
        <div className={`absolute inset-0 transition-colors duration-700 ${
          isDark ? 'bg-gradient-to-br from-black via-zinc-900 to-black' : 'bg-gradient-to-br from-white via-zinc-50 to-white'
        }`} />
        
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -left-1/4 w-[40rem] h-[40rem] rounded-full"
          style={{ background: `radial-gradient(circle, ${goldColors.shadow} 0%, transparent 70%)` }}
        />
        <motion.div
          animate={{ scale: [1.3, 1, 1.3], opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 -right-1/4 w-[40rem] h-[40rem] rounded-full"
          style={{ background: `radial-gradient(circle, ${goldColors.shadow} 0%, transparent 70%)` }}
        />
        
        {mounted && Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={`loader-particle-${i}`}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: goldColors.metallic,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ 
              y: [0, -60, 0], 
              opacity: [0, 0.8, 0],
              x: [0, (Math.random() - 0.5) * 40, 0]
            }}
            transition={{ 
              duration: 3 + Math.random() * 4, 
              repeat: Infinity, 
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
          />
        ))}
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          <div className="relative mb-8">
            <div className={`w-20 h-20 rounded-full border-2 ${isDark ? 'border-amber-500/20' : 'border-amber-500/30'}`}></div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 left-0 w-20 h-20 rounded-full border-t-2 border-amber-500"
              style={{ borderImage: goldColors.metallic, borderTopColor: goldColors.light }}
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute top-1 left-1 w-18 h-18 rounded-full border-r-2 border-amber-400/60"
            />
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2"
              style={{ background: goldColors.metallic }}
            />
          </div>
          
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xl tracking-[0.3em] uppercase mb-2"
            style={{ color: goldColors.light }}
          >
            Events District
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 60 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-px my-3"
            style={{ background: goldColors.metallic, width: 60 }}
          />
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={`text-[10px] tracking-[0.2em] uppercase ${isDark ? 'text-white/40' : 'text-black/40'}`}
          >
            Crafting Extraordinary Experiences
          </motion.p>
          
          <div className="flex gap-2 mt-6">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: goldColors.metallic }}
              />
            ))}
          </div>
        </div>
        
        <motion.div
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-amber-500/5 to-transparent pointer-events-none"
        />
      </section>
    )
  }

  // If no slides in database, show elegant empty state
  if (slideData.length === 0) {
    return (
      <section className="relative w-full overflow-hidden flex items-center justify-center" style={{ minHeight: heroHeight, height: heroHeight }}>
        <div className={`absolute inset-0 transition-colors duration-700 ${
          isDark ? 'bg-gradient-to-br from-black via-zinc-900 to-black' : 'bg-gradient-to-br from-white via-zinc-50 to-white'
        }`} />
        <div className="relative z-10 text-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-amber-500/30 flex items-center justify-center"
          >
            <span className="text-3xl">✨</span>
          </motion.div>
          <p className="text-amber-500 mb-4 text-sm tracking-wide">Awaiting Your Vision</p>
          <p className={`text-xs mb-6 max-w-xs mx-auto ${isDark ? 'text-white/50' : 'text-black/50'}`}>No hero slides found. Add your first slide in the admin panel.</p>
          <a 
            href="/admin/media" 
            className="inline-block px-6 py-2.5 text-sm font-medium text-black rounded-full transition-all duration-300 hover:scale-105"
            style={{ background: goldColors.metallic, boxShadow: `0 0 20px ${goldColors.shadow}` }}
          >
            Get Started
          </a>
        </div>
      </section>
    )
  }

  // Safety check - ensure current slide exists
  const currentSlide = slideData[selectedIndex]
  if (!currentSlide) {
    return (
      <section className="relative w-full overflow-hidden flex items-center justify-center" style={{ minHeight: heroHeight, height: heroHeight }}>
        <div className={`absolute inset-0 transition-colors duration-700 ${
          isDark ? 'bg-gradient-to-br from-black via-zinc-900 to-black' : 'bg-gradient-to-br from-white via-zinc-50 to-white'
        }`} />
        <div className="relative z-10 text-center">
          <p className="text-amber-500">Loading slides...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: heroHeight, height: heroHeight }}>

      {/* ─── Background ─── */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute inset-0 transition-colors duration-700 ${
          isDark ? 'bg-gradient-to-br from-black via-zinc-900 to-black' : 'bg-gradient-to-br from-white via-zinc-50 to-white'
        }`} />

        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -left-1/4 w-[50rem] h-[50rem] rounded-full"
          style={{ background: `radial-gradient(circle, ${goldColors.shadow} 0%, transparent 70%)` }}
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 -right-1/4 w-[50rem] h-[50rem] rounded-full"
          style={{ background: `radial-gradient(circle, ${goldColors.shadow} 0%, transparent 70%)` }}
        />

        {/* Particles - only render on client side */}
        {mounted && particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: goldColors.metallic,
              left: particle.left,
              top: particle.top,
            }}
            animate={{ y: [0, -30, 0], opacity: [0, 1, 0] }}
            transition={{ duration: particle.duration, repeat: Infinity, delay: particle.delay }}
          />
        ))}
      </div>

      {/* ─── MOBILE LAYOUT (< md) - Full image visible, content at bottom with WhatsApp safe padding ─── */}
      <div className="md:hidden absolute inset-0 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={`mobile-bg-${selectedIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <img
              src={currentSlide.stillImage}
              alt={currentSlide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />
          </motion.div>
        </AnimatePresence>

        {/* Content at bottom - pb-28 to clear WhatsApp floating button */}
        <div className="absolute bottom-0 left-0 right-0 z-20 px-5 pb-28 pt-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-px" style={{ background: goldColors.metallic }} />
              <span className="text-xs tracking-[0.25em] uppercase" style={{ color: goldColors.light }}>
                {currentSlide.category.split('•')[0].trim()}
              </span>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.h1
                key={`m-title-${selectedIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-light leading-tight text-white"
              >
                {currentSlide.title}{' '}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: goldColors.metallic, WebkitBackgroundClip: 'text' }}
                >
                  {currentSlide.subtitle}
                </span>
              </motion.h1>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.p
                key={`m-desc-${selectedIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-sm text-white/80 leading-relaxed max-w-xs"
              >
                {currentSlide.description}
              </motion.p>
            </AnimatePresence>

            <div className="flex gap-3">
              <motion.a
                href={currentSlide.ctaLink}
                whileTap={{ scale: 0.97 }}
                className="px-5 py-2.5 rounded-full text-sm font-medium text-black"
                style={{ background: goldColors.metallic, boxShadow: `0 0 16px ${goldColors.shadow}` }}
              >
                {currentSlide.ctaText}
              </motion.a>
              <motion.a
                href="/portfolio"
                whileTap={{ scale: 0.97 }}
                className="px-5 py-2.5 rounded-full border text-sm text-white border-white/30 text-center"
              >
                Portfolio
              </motion.a>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex gap-1.5">
                {slideData.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedIndex(idx)
                      setIsAutoPlaying(false)
                      setTimeout(() => setIsAutoPlaying(true), 10000)
                    }}
                    className="focus:outline-none"
                  >
                    <motion.div
                      animate={{
                        width: selectedIndex === idx ? 20 : 5,
                        backgroundColor: selectedIndex === idx ? goldColors.light : 'rgba(255,255,255,0.4)',
                      }}
                      className="h-1 rounded-full transition-all duration-300"
                    />
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <div className="flex -space-x-1.5">
                  {testimonials.slice(0, 3).map((t, i) => (
                    <img key={i} src={t.avatar} alt={t.name} className="w-6 h-6 rounded-full border border-white/60 object-cover" />
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold" style={{ color: goldColors.light }}>4.9</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-2.5 h-2.5 fill-current" style={{ color: goldColors.light }} viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-white/50 ml-1">150+ events</span>
                </div>
              </div>
            </div>

            {/* ─── Discover More for Mobile (ADDED - ONLY CHANGE) ─── */}
            <div className="flex items-center justify-center pt-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col items-center gap-1 cursor-pointer"
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
              >
                <span className="text-[8px] tracking-[0.2em] uppercase" style={{ color: goldColors.light }}>
                  Discover More
                </span>
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-[1px] h-3" style={{ background: goldColors.metallic }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── TABLET + DESKTOP LAYOUT (md+) - Centered content ─── */}
      <div
        className="hidden md:flex relative z-10 h-full flex-col"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex-1 container mx-auto px-6 lg:px-8 grid md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-10 items-center h-full py-6 lg:py-8">

          {/* LEFT: Content */}
          <div className="flex flex-col justify-center space-y-3 lg:space-y-4">

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-4"
            >
              <div className="w-10 h-px flex-shrink-0" style={{ background: goldColors.metallic }} />
              <span className="text-xs tracking-[0.3em] uppercase truncate" style={{ color: goldColors.light }}>
                {currentSlide.category}
              </span>
            </motion.div>

            <div>
              <AnimatePresence mode="wait">
                <motion.h1
                  key={`title-${selectedIndex}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6 }}
                  className="font-light tracking-tight leading-[1.1]"
                  style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}
                >
                  <span className={isDark ? 'text-white' : 'text-black'}>
                    {currentSlide.title}
                  </span>
                  <br />
                  <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: goldColors.metallic, WebkitBackgroundClip: 'text' }}
                  >
                    {currentSlide.subtitle}
                  </span>
                </motion.h1>
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={`desc-${selectedIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={`text-sm lg:text-base max-w-md leading-relaxed ${isDark ? 'text-white/60' : 'text-black/60'}`}
              >
                {currentSlide.description}
              </motion.p>
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap gap-3"
            >
              <motion.a
                href={currentSlide.ctaLink}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="group relative px-5 py-2.5 rounded-full overflow-hidden text-sm font-medium text-black"
                style={{ background: goldColors.metallic, boxShadow: `0 0 20px ${goldColors.shadow}` }}
              >
                <span className="relative z-10">{currentSlide.ctaText}</span>
                <motion.div
                  className="absolute inset-0 bg-white"
                  initial={{ x: "100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
              <motion.a
                href="/portfolio"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className={`px-5 py-2.5 rounded-full border-2 text-center transition-all duration-300 text-sm ${
                  isDark
                    ? 'border-white/20 text-white hover:border-amber-500/50'
                    : 'border-black/20 text-black hover:border-amber-500/50'
                }`}
              >
                View Portfolio
              </motion.a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="pt-2 space-y-3"
            >
              <div className="w-14 h-px" style={{ background: goldColors.metallic }} />

              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex -space-x-2">
                  {testimonials.map((t, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="relative group"
                    >
                      <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ boxShadow: `0 0 0 2px ${goldColors.light}` }}
                      />
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-8 h-8 rounded-full object-cover"
                        style={{
                          boxShadow: `0 0 0 2px ${goldColors.light}`,
                          border: `2px solid ${isDark ? 'black' : 'white'}`
                        }}
                      />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20"
                        style={{ background: goldColors.metallic, color: 'black' }}
                      >
                        {t.name} • {t.role}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-bold" style={{ color: goldColors.light }}>4.9</span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3 h-3 fill-current" style={{ color: goldColors.light }} viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className={`text-xs ${isDark ? 'text-white/40' : 'text-black/40'}`}>From {testimonials.length * 30}+ luxury events</p>
                </div>

                <div className={`hidden lg:flex gap-4 ml-2 pl-4 border-l ${isDark ? 'border-white/10' : 'border-black/10'}`}>
                  {[
                    { value: "10+", label: "Years" },
                    { value: `${testimonials.length * 50}+`, label: "Events" },
                    { value: "100%", label: "Satisfaction" }
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      className="text-center"
                    >
                      <div className="text-base font-bold" style={{ color: goldColors.light }}>{stat.value}</div>
                      <div className={`text-xs ${isDark ? 'text-white/40' : 'text-black/40'}`}>{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className={`flex lg:hidden gap-5 pt-1`}>
                {[
                  { value: "10+", label: "Years" },
                  { value: `${testimonials.length * 50}+`, label: "Events" },
                  { value: "100%", label: "Satisfaction" }
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-sm font-bold" style={{ color: goldColors.light }}>{stat.value}</div>
                    <div className={`text-xs ${isDark ? 'text-white/40' : 'text-black/40'}`}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Carousel */}
          <div className="relative flex flex-col justify-center">
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.7, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -inset-4 lg:-inset-6 rounded-2xl blur-2xl"
                style={{ background: goldColors.shadow }}
              />

              <div
                className="relative rounded-xl overflow-hidden shadow-2xl cursor-pointer group"
                style={{ boxShadow: `0 20px 40px ${goldColors.shadow}` }}
              >
                <div className="aspect-[16/9] md:aspect-[4/3] lg:aspect-[16/9] relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedIndex}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0"
                    >
                      <img
                        src={currentSlide.stillImage}
                        alt={currentSlide.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-amber-500/50 transition-all duration-500" />
                    </motion.div>
                  </AnimatePresence>

                  <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-5 h-px" style={{ background: goldColors.metallic }} />
                        <span className="text-xs tracking-wider uppercase" style={{ color: goldColors.light }}>Featured</span>
                      </div>
                      <h3 className="text-base font-light text-white">
                        {currentSlide.title} {currentSlide.subtitle}
                      </h3>
                    </motion.div>
                  </div>

                  {/* Navigation Dots */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {slideData.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedIndex(idx)
                          setIsAutoPlaying(false)
                          setTimeout(() => setIsAutoPlaying(true), 10000)
                        }}
                        className="focus:outline-none group/dot"
                      >
                        <motion.div
                          animate={{
                            width: selectedIndex === idx ? 24 : 6,
                            height: selectedIndex === idx ? 6 : 6,
                            backgroundColor: selectedIndex === idx ? goldColors.light : 'rgba(255,255,255,0.4)',
                          }}
                          whileHover={{ scale: selectedIndex === idx ? 1 : 1.3 }}
                          className="rounded-full transition-all duration-300 cursor-pointer"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex justify-center gap-2 mt-4">
                {slideData.map((slide, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedIndex(idx)
                      setIsAutoPlaying(false)
                      setTimeout(() => setIsAutoPlaying(true), 10000)
                    }}
                    className="focus:outline-none"
                  >
                    <motion.div
                      animate={{
                        width: selectedIndex === idx ? 44 : 36,
                        height: selectedIndex === idx ? 44 : 36,
                      }}
                      whileHover={{ scale: 1.05 }}
                      className="relative rounded-lg overflow-hidden transition-all duration-300"
                      style={{ 
                        border: selectedIndex === idx ? `2px solid ${goldColors.light}` : '2px solid transparent',
                        boxShadow: selectedIndex === idx ? `0 0 12px ${goldColors.light}` : 'none'
                      }}
                    >
                      <img src={slide.stillImage} alt={slide.title} className="w-full h-full object-cover" />
                      {selectedIndex === idx && (
                        <motion.div
                          layoutId="activeThumb"
                          className="absolute inset-0"
                          style={{ background: `linear-gradient(45deg, ${goldColors.light}15, transparent)` }}
                        />
                      )}
                    </motion.div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Bottom bar: Discover More - LOWER POSITION ─── */}
        <div className="relative z-20 flex items-center justify-center px-6 lg:px-8 pb-6 flex-shrink-0 mt-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col items-center gap-2 cursor-pointer"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          >
            <span className="text-[8px] tracking-[0.2em] uppercase" style={{ color: goldColors.light }}>
              Discover More
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-[1px] h-3" style={{ background: goldColors.metallic }} />
              <div className="w-[1px] h-2" style={{ background: goldColors.metallic }} />
            </motion.div>
          </motion.div>
        </div>
      </div>

    </section>
  )
}