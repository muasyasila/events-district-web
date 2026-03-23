"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

const slideData = [
  {
    title: "MODERN",
    subtitle: "Aesthetics",
    img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80"
  },
  {
    title: "BESPOKE",
    subtitle: "Curation",
    img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80"
  },
  {
    title: "LUXURY",
    subtitle: "Events",
    img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80"
  }
]

export default function Hero() {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 30 }, 
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  )

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)
  }, [emblaApi, onSelect])

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-background">
      
      <div className="container mx-auto px-6 grid grid-cols-12 gap-4 md:gap-8 items-center relative z-10">
        
        {/* Left Floating Image - Faster Crossfade */}
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="hidden lg:block col-span-3 h-[380px] relative overflow-hidden shadow-2xl"
        >
          <AnimatePresence initial={false}>
            <motion.img 
              key={selectedIndex}
              src={slideData[(selectedIndex + 1) % 3].img} 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 w-full h-full object-cover" 
            />
          </AnimatePresence>
        </motion.div>

        {/* Center Main Content */}
        <div className="col-span-12 lg:col-span-6 flex flex-col items-center">
          {/* Fixed Wording Visibility */}
          <div className="min-h-[180px] md:min-h-[260px] flex flex-col justify-center items-center relative z-20 mb-4 px-4">
  <AnimatePresence mode="wait">
    <motion.div
      key={selectedIndex}
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -30, opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      className="text-center flex flex-col items-center"
    >
      <h1 className="text-6xl md:text-[9rem] font-light tracking-[0.1em] text-foreground uppercase leading-none">
        {slideData[selectedIndex].title}
      </h1>
      <p className="italic font-serif text-4xl md:text-7xl text-foreground/70 mt-4 leading-tight">
        {slideData[selectedIndex].subtitle}
      </p>
    </motion.div>
  </AnimatePresence>
</div>

          {/* Main Slider */}
          <div 
            className="w-full h-[350px] md:h-[480px] bg-neutral-900 overflow-hidden cursor-grab border border-foreground/5 shadow-2xl"
            ref={emblaRef}
          >
            <div className="flex h-full">
              {slideData.map((slide, i) => (
                <div key={i} className="flex-[0_0_100%] min-w-0 h-full">
                   <img src={slide.img} alt="Portfolio" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="mt-10 flex gap-4">
            {slideData.map((_, i) => (
              <motion.div 
                key={i} 
                animate={{ 
                  width: selectedIndex === i ? 60 : 15,
                  backgroundColor: selectedIndex === i ? "var(--foreground)" : "rgba(128,128,128,0.3)"
                }}
                className="h-[1px]" 
              />
            ))}
          </div>
        </div>

        {/* Right Floating Image */}
        <motion.div 
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="hidden lg:block col-span-3 h-[380px] mt-24 relative overflow-hidden shadow-2xl"
        >
          <AnimatePresence initial={false}>
            <motion.img 
              key={selectedIndex}
              src={slideData[(selectedIndex + 2) % 3].img} 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 w-full h-full object-cover" 
            />
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="absolute inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(128,128,128,0.05)_0%,transparent_80%)]" />
    </section>
  )
}