"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Quote, Star } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: "Margaret Ashford",
    role: "Bride",
    event: "Wedding Reception",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200",
    quote: "Stunningly beautiful and added an elegant charm to our evening. Feels enchanted and magical!",
    highlight: "Enchanted",
    rating: 5
  },
  {
    id: 2,
    name: "James Chen",
    role: "Corporate Director",
    event: "Product Launch",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200",
    quote: "Every detail was thoughtfully curated. Our guests couldn't stop complimenting the atmosphere.",
    highlight: "Thoughtfully curated",
    rating: 5
  },
  {
    id: 3,
    name: "Victoria Sterling",
    role: "Private Client",
    event: "Anniversary Gala",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200",
    quote: "Professional, creative, and incredibly attentive. The decor perfectly captured our vision.",
    highlight: "Perfectly captured",
    rating: 5
  },
  {
    id: 4,
    name: "The Harringtons",
    role: "Family",
    event: "Milestone Birthday",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200",
    quote: "From consultation to final reveal, everything was seamless. Truly special.",
    highlight: "Seamless",
    rating: 5
  }
]

const eventTypes = [
  "Wedding Receptions",
  "Corporate Events", 
  "Private Celebrations",
  "Galas & Fundraisers",
  "Milestone Birthdays",
  "Anniversary Parties",
  "Engagement Parties",
  "Baby Showers",
  "Graduation Celebrations",
  "Holiday Parties"
]

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const containerRef = useRef(null)

  // Auto-rotate testimonials
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [isPaused, activeIndex])

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const handleDotClick = (index: number) => {
    setActiveIndex(index)
  }

  return (
    <section 
      ref={containerRef} 
      className="relative py-24 md:py-32 bg-background overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,transparent_calc(100%-1px),rgba(255,255,255,0.03)_calc(100%-1px),rgba(255,255,255,0.03)_100%)] bg-[length:25%_100%]" />
      </div>

      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 md:mb-24"
        >
          <div>
            <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-foreground/40 block mb-4">
              Testimonials
            </span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif italic text-foreground leading-none">
              Client<br />
              <span className="text-foreground/30">Reflections</span>
            </h2>
          </div>
          
          <div className="mt-6 md:mt-0 flex items-center gap-4">
            <span className="text-sm text-foreground/40 font-serif italic">
              0{activeIndex + 1} / 0{testimonials.length}
            </span>
            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full border border-foreground/20 hover:border-foreground/60 hover:bg-foreground hover:text-background transition-all duration-500 flex items-center justify-center group"
            >
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Large Quote */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:col-span-7 relative"
          >
            <Quote className="absolute -top-4 -left-2 w-16 h-16 text-foreground/5" />
            
            <div className="relative min-h-[200px] md:min-h-[250px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <p className="text-2xl md:text-4xl lg:text-5xl font-serif italic text-foreground leading-tight">
                    "{testimonials[activeIndex].quote}"
                  </p>
                </motion.div>
              </AnimatePresence>
              
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="h-px bg-foreground/20 mt-8 origin-left max-w-xs"
              />
            </div>
          </motion.div>

          {/* Client Info Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:col-span-5"
          >
            <div className="bg-foreground/[0.02] border border-foreground/10 p-6 md:p-8 rounded-sm backdrop-blur-sm relative overflow-hidden">
              {/* Animated background accent */}
              <motion.div
                className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-foreground/5 to-transparent rounded-full blur-2xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Avatar and Name */}
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-14 h-14 rounded-full overflow-hidden ring-1 ring-foreground/20"
                  >
                    <img
                      src={testimonials[activeIndex].image}
                      alt={testimonials[activeIndex].name}
                      className="w-full h-full object-cover grayscale"
                    />
                  </motion.div>
                </AnimatePresence>
                <div className="overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`info-${activeIndex}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <h4 className="text-lg font-medium text-foreground">
                        {testimonials[activeIndex].name}
                      </h4>
                      <p className="text-sm text-foreground/50">
                        {testimonials[activeIndex].role}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Star Rating - ANIMATED with key */}
              <div key={`stars-${activeIndex}`} className="flex gap-1 mb-4 relative z-10">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0, rotate: -180 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ 
                      delay: i * 0.08,
                      duration: 0.4,
                      type: "spring",
                      stiffness: 200
                    }}
                  >
                    <Star 
                      className={`w-4 h-4 ${i < testimonials[activeIndex].rating ? 'fill-amber-400 text-amber-400' : 'text-foreground/20'}`}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Event Tag */}
              <div className="relative z-10 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`event-${activeIndex}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-2 text-xs text-foreground/40 uppercase tracking-wider mb-6"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {testimonials[activeIndex].event}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Highlight Word */}
              <div className="relative z-10 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`tag-${activeIndex}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="inline-block px-4 py-2 bg-foreground/5 border border-foreground/10 rounded-full text-xs text-foreground/60"
                  >
                    {testimonials[activeIndex].highlight}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6 h-0.5 bg-foreground/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-foreground/40"
                initial={{ width: "0%" }}
                animate={{ width: isPaused ? "0%" : "100%" }}
                transition={{ duration: 5, ease: "linear" }}
                key={activeIndex}
              />
            </div>

            {/* Navigation Dots - SIMPLE, SAME SIZE */}
            <div className="flex gap-3 mt-6 justify-center lg:justify-start">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === activeIndex 
                      ? 'bg-foreground scale-110' 
                      : 'bg-foreground/20 hover:bg-foreground/40 scale-100'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* News Ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-20 md:mt-32 pt-8 border-t border-foreground/10 overflow-hidden"
        >
          <div className="relative">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />
            
            {/* Ticker */}
            <div className="flex overflow-hidden">
              <motion.div
                className="flex whitespace-nowrap"
                animate={{ x: [0, -50 * eventTypes.length * 2] }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 40,
                    ease: "linear",
                  },
                }}
                style={{ willChange: "transform" }}
              >
                {[...eventTypes, ...eventTypes, ...eventTypes, ...eventTypes].map((event, i) => (
                  <div key={i} className="flex items-center mx-6">
                    <span className="text-xs text-foreground/30 uppercase tracking-[0.2em]">
                      {event}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground/20 mx-6" />
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}