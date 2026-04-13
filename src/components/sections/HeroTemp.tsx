"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'

// Premium Gold Color Palette
const goldColors = {
  light: '#D4AF37',
  dark: '#FFD700',
  metallic: 'linear-gradient(135deg, #D4AF37 0%, #FFF2A8 50%, #D4AF37 100%)',
  shadow: 'rgba(212, 175, 55, 0.3)'
}

const slideData = [
  {
    id: 1,
    title: "MODERN",
    subtitle: "Aesthetics",
    description: "Clean lines. Bold statements. Unforgettable atmospheres that redefine contemporary elegance.",
    ctaText: "Explore Collections",
    ctaLink: "/portfolio/modern",
    stillImage: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80",
    category: "Wedding • Corporate • Private"
  },
  {
    id: 2,
    title: "BESPOKE",
    subtitle: "Curation",
    description: "Tailored designs that tell YOUR unique story. Every detail, meticulously crafted for you.",
    ctaText: "Begin Your Journey",
    ctaLink: "/consultation",
    stillImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80",
    category: "Custom • Personalized • Exclusive"
  },
  {
    id: 3,
    title: "LUXURY",
    subtitle: "Events",
    description: "Where elegance meets unforgettable experiences. Creating moments that last a lifetime.",
    ctaText: "View Signature Events",
    ctaLink: "/portfolio/luxury",
    stillImage: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80",
    category: "Premium • High-End • Signature"
  }
]

const testimonials = [
  { name: "Victoria Hamilton", role: "Luxury Wedding", avatar: "https://randomuser.me/api/portraits/women/90.jpg", rating: 5 },
  { name: "Jonathan Sterling", role: "Corporate Gala", avatar: "https://randomuser.me/api/portraits/men/86.jpg", rating: 5 },
  { name: "Isabella Rossi", role: "Birthday Extravaganza", avatar: "https://randomuser.me/api/portraits/women/75.jpg", rating: 5 }
]

export default function Hero() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const autoPlayRef = useRef<NodeJS.Timeout>()

  const nextSlide = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % slideData.length)
  }, [])

  const prevSlide = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + slideData.length) % slideData.length)
  }, [])

  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(nextSlide, 5000)
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }
  }, [isAutoPlaying, nextSlide])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
  }, [prevSlide, nextSlide])

  const handleMouseEnter = () => setIsAutoPlaying(false)
  const handleMouseLeave = () => setIsAutoPlaying(true)

  return (
    <section className="relative h-screen max-h-screen w-full overflow-hidden">

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

        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: goldColors.metallic,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ y: [0, -30, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5 }}
          />
        ))}
      </div>

      {/* ─── MOBILE LAYOUT (< md) ─── */}
      {/* Full-bleed image background with content overlaid */}
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
              src={slideData[selectedIndex].stillImage}
              alt={slideData[selectedIndex].title}
              className="w-full h-full object-cover"
            />
            {/* Strong gradient overlay so text is readable */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
          </motion.div>
        </AnimatePresence>

        {/* Mobile Content */}
        <div className="absolute inset-0 flex flex-col justify-between px-5 py-8">
          {/* Top: Category badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-px" style={{ background: goldColors.metallic }} />
            <span className="text-xs tracking-[0.25em] uppercase" style={{ color: goldColors.light }}>
              {slideData[selectedIndex].category.split('•')[0].trim()}
            </span>
          </motion.div>

          {/* Bottom: Main content */}
          <div className="space-y-4">
            {/* Title */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={`m-title-${selectedIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-light leading-tight text-white"
              >
                {slideData[selectedIndex].title}{' '}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: goldColors.metallic, WebkitBackgroundClip: 'text' }}
                >
                  {slideData[selectedIndex].subtitle}
                </span>
              </motion.h1>
            </AnimatePresence>

            {/* Description */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`m-desc-${selectedIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-sm text-white/70 leading-relaxed max-w-xs"
              >
                {slideData[selectedIndex].description}
              </motion.p>
            </AnimatePresence>

            {/* CTAs */}
            <div className="flex gap-3">
              <motion.a
                href={slideData[selectedIndex].ctaLink}
                whileTap={{ scale: 0.97 }}
                className="px-5 py-2.5 rounded-full text-sm font-medium text-black"
                style={{ background: goldColors.metallic, boxShadow: `0 0 16px ${goldColors.shadow}` }}
              >
                {slideData[selectedIndex].ctaText}
              </motion.a>
              <motion.a
                href="/portfolio"
                whileTap={{ scale: 0.97 }}
                className="px-5 py-2.5 rounded-full border text-sm text-white border-white/30 text-center"
              >
                Portfolio
              </motion.a>
            </div>

            {/* Slide dots + trust */}
            <div className="flex items-center justify-between pt-1">
              {/* Dots */}
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

              {/* Trust badge */}
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
          </div>
        </div>
      </div>

      {/* ─── TABLET + DESKTOP LAYOUT (md+) ─── */}
      <div
        className="hidden md:flex relative z-10 h-full flex-col"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Main grid — fills available height */}
        <div className="flex-1 container mx-auto px-6 lg:px-8 grid md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-10 items-center min-h-0 py-6 lg:py-8">

          {/* LEFT: Content */}
          <div className="flex flex-col justify-center space-y-3 lg:space-y-4 min-h-0">

            {/* Category line */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-4"
            >
              <div className="w-10 h-px flex-shrink-0" style={{ background: goldColors.metallic }} />
              <span className="text-xs tracking-[0.3em] uppercase truncate" style={{ color: goldColors.light }}>
                {slideData[selectedIndex].category}
              </span>
            </motion.div>

            {/* Headline */}
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
                    {slideData[selectedIndex].title}
                  </span>
                  <br />
                  <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: goldColors.metallic, WebkitBackgroundClip: 'text' }}
                  >
                    {slideData[selectedIndex].subtitle}
                  </span>
                </motion.h1>
              </AnimatePresence>
            </div>

            {/* Description */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`desc-${selectedIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={`text-sm lg:text-base max-w-md leading-relaxed ${isDark ? 'text-white/60' : 'text-black/60'}`}
              >
                {slideData[selectedIndex].description}
              </motion.p>
            </AnimatePresence>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap gap-3"
            >
              <motion.a
                href={slideData[selectedIndex].ctaLink}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="group relative px-5 py-2.5 rounded-full overflow-hidden text-sm font-medium text-black"
                style={{ background: goldColors.metallic, boxShadow: `0 0 20px ${goldColors.shadow}` }}
              >
                <span className="relative z-10">{slideData[selectedIndex].ctaText}</span>
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

            {/* Social Proof */}
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
                  <p className={`text-xs ${isDark ? 'text-white/40' : 'text-black/40'}`}>From 150+ luxury events</p>
                </div>

                <div className={`hidden lg:flex gap-4 ml-2 pl-4 border-l ${isDark ? 'border-white/10' : 'border-black/10'}`}>
                  {[
                    { value: "10+", label: "Years" },
                    { value: "500+", label: "Events" },
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

              {/* Stats row for md (tablet) — shown separately since we hide in the row above on non-lg */}
              <div className={`flex lg:hidden gap-5 pt-1`}>
                {[
                  { value: "10+", label: "Years" },
                  { value: "500+", label: "Events" },
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
          <div className="relative flex flex-col justify-center min-h-0">
            <div className="relative">
              {/* Gold Glow */}
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.7, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -inset-4 lg:-inset-6 rounded-2xl blur-2xl"
                style={{ background: goldColors.shadow }}
              />

              {/* Image Container */}
              <div
                className="relative rounded-xl overflow-hidden shadow-2xl cursor-pointer group"
                style={{ boxShadow: `0 20px 40px ${goldColors.shadow}` }}
              >
                {/* Aspect ratio: tighter on md to avoid overflow */}
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
                        src={slideData[selectedIndex].stillImage}
                        alt={slideData[selectedIndex].title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-amber-500/50 transition-all duration-500" />
                    </motion.div>
                  </AnimatePresence>

                  {/* Overlay content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-5 h-px" style={{ background: goldColors.metallic }} />
                        <span className="text-xs tracking-wider uppercase" style={{ color: goldColors.light }}>Featured</span>
                      </div>
                      <h3 className="text-base font-light text-white">
                        {slideData[selectedIndex].title} {slideData[selectedIndex].subtitle}
                      </h3>
                    </motion.div>
                  </div>

                  {/* Nav arrows */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full backdrop-blur-md bg-black/50 flex items-center justify-center hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full backdrop-blur-md bg-black/50 flex items-center justify-center hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex justify-center gap-2 mt-3">
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
                        width: selectedIndex === idx ? 40 : 32,
                        height: selectedIndex === idx ? 40 : 32,
                      }}
                      whileHover={{ scale: 1.05 }}
                      className="relative rounded-lg overflow-hidden border transition-all duration-300"
                      style={{ borderColor: selectedIndex === idx ? goldColors.light : 'rgba(255,255,255,0.2)' }}
                    >
                      <img src={slide.stillImage} alt={slide.title} className="w-full h-full object-cover" />
                      {selectedIndex === idx && (
                        <motion.div
                          layoutId="activeThumb"
                          className="absolute inset-0"
                          style={{ background: `linear-gradient(45deg, ${goldColors.light}20, transparent)` }}
                        />
                      )}
                    </motion.div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Bottom bar: Keyboard hint + Scroll indicator ─── */}
        <div className="relative z-20 flex items-end justify-between px-6 lg:px-8 pb-4 flex-shrink-0">
          {/* Keyboard hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="flex gap-2 bg-black/40 backdrop-blur-md rounded-full px-2.5 py-1"
          >
            <svg className="w-3 h-3 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-white/50 text-[10px]">← → to navigate</span>
          </motion.div>

          {/* Scroll indicator — centred */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-4 flex flex-col items-center gap-1"
          >
            <span className="text-[10px] tracking-wider uppercase" style={{ color: goldColors.light }}>
              Discover More
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-[1.5px] h-5"
              style={{ background: goldColors.metallic }}
            />
          </motion.div>

          {/* Right spacer to balance the keyboard hint */}
          <div className="w-24" />
        </div>
      </div>

    </section>
  )
}
