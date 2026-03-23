"use client"

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

export function PartnershipAtelier() {
  return (
    <section className="relative w-full bg-background py-24 md:py-32 overflow-hidden border-t border-foreground/10 text-foreground">
      
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-20 text-center lg:text-left">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[10px] uppercase tracking-[0.8em] text-foreground/50 dark:text-foreground/40 font-bold block mb-4"
          >
            Curated Alliances
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif italic tracking-tighter"
          >
            A Shared <span className="opacity-30">Artistry.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* THE PRESTIGE AWARD CARD */}
          <div className="lg:col-span-5 relative group mx-auto w-full max-w-[450px] lg:max-w-none">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-auto md:aspect-square w-full rounded-sm overflow-hidden border-8 md:border-[12px] border-[#1a1a1a] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] bg-[#0a0a0a]"
            >
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_50%,_#333_0%,_#000_100%)]" />
              
              <motion.div 
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 z-10"
              />

              {/* Internal layout - pt-8 for mobile, pt-12 for your original large layout */}
              <div className="relative z-20 h-full w-full flex flex-col items-center justify-start pt-8 md:pt-12 pb-20 md:pb-24 p-6 md:p-8 border border-white/10">
                
                {/* PARTNER LOGO PNG - Scaled for mobile */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="relative w-32 h-32 md:w-40 md:h-40 mb-4 md:mb-6"
                >
                  <Image 
                    src="/logos/shakeys-logo2.png" 
                    alt="Shakey's Logo"
                    fill
                    className="object-contain opacity-100 group-hover:scale-110 transition-transform duration-700" 
                  />
                </motion.div>

                {/* 5 Stars in Etched Gold */}
                <div className="flex gap-2 mb-6 md:mb-10">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      className="text-[#D4AF37] fill-[#D4AF37]" 
                      style={{ filter: "drop-shadow(0px 0px 8px rgba(212, 175, 55, 0.5))" }}
                    />
                  ))}
                </div>

                {/* Main Gold Typography - Maintained original large screen styles */}
                <div className="text-center w-full space-y-4 md:space-y-5 mb-12 md:mb-0">
                  <div className="h-[1px] w-20 md:w-24 mx-auto bg-[#D4AF37]/30" />
                  
                  <div className="space-y-3 md:space-y-4">
                    <h3 className="text-2xl md:text-4xl font-serif tracking-[0.2em] uppercase font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#F9E29C] via-[#D4AF37] to-[#8A6E2F]">
                      Shakey's
                    </h3>
                    <p className="text-[9px] md:text-[10px] uppercase tracking-[0.8em] text-[#D4AF37] font-bold">
                      Cakes & Events
                    </p>
                  </div>
                </div>

                {/* Inscription - Absolute for Large, Auto for Mobile to prevent overlaps */}
                <div className="mt-auto md:absolute md:bottom-10 w-full text-center px-10">
                  <p className="text-[7px] md:text-[8px] uppercase tracking-[0.4em] text-white/30 border-t border-white/10 pt-3">
                    Presented for <br /> Exceptional Creative Synergy
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Description & CTA Side */}
          <div className="lg:col-span-7 lg:pl-12 space-y-10">
            <div className="relative">
              <Quote className="absolute -left-8 -top-4 opacity-10 text-foreground" size={40} strokeWidth={1} />
              <p className="text-xl md:text-2xl font-light leading-relaxed text-foreground/80 italic font-serif">
                "True luxury is found in the harmony of visual splendor and sensory delight. Together with Shakey's, we ensure your celebration is as exquisite to the palate as it is to the eye."
              </p>
            </div>

            <div className="p-8 border border-foreground/10 bg-foreground/[0.02] rounded-sm">
                <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold mb-4 opacity-60">Join the Circle</h4>
                <p className="text-sm font-light text-foreground/70 leading-relaxed mb-6">
                    We are always looking to collaborate with artisans who redefine excellence. If your brand shares our obsession with luxury and detail, we invite you to reach out.
                </p>
                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="text-[10px] uppercase tracking-[0.3em] font-bold py-3 px-6 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-500"
                >
                    Inquire for Partnership
                </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}