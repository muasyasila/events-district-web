"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Instagram, Facebook, Youtube, Mail, 
  MessageCircle, Ghost, AtSign, Share2 
} from 'lucide-react'

const platforms = [
  { name: 'Instagram', icon: <Instagram size={20} />, handle: '@events_district', color: '#E1306C', desc: 'The Visual Gallery' },
  { name: 'TikTok', icon: <Share2 size={20} />, handle: '@events_district', color: '#00f2ea', desc: 'Behind The Magic' },
  { name: 'WhatsApp', icon: <MessageCircle size={20} />, handle: 'Start Chat', color: '#25D366', desc: 'Instant Concierge' },
  { name: 'YouTube', icon: <Youtube size={20} />, handle: 'Events District TV', color: '#FF0000', desc: 'Cinematic Stories' },
  { name: 'Snapchat', icon: <Ghost size={20} />, handle: 'events_dist', color: '#FFFC00', desc: 'Daily Snapshots' },
  { name: 'Threads', icon: <AtSign size={20} />, handle: '@events_district', color: '#ffffff', desc: 'The Dialogue' },
]

export function SocialAtelier() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="relative min-h-screen w-full bg-background flex flex-col items-center justify-center py-20 px-6 overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <div className="absolute top-10 left-10 text-[10vw] font-serif italic">Connect</div>
        <div className="absolute bottom-10 right-10 text-[10vw] font-serif italic">Social</div>
      </div>

      <div className="max-w-4xl w-full z-10">
        <header className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-[10px] uppercase tracking-[0.8em] text-foreground/40 font-bold"
          >
            Multi-Channel Presence
          </motion.span>
          <h2 className="text-4xl md:text-6xl font-serif italic mt-4 text-foreground">
            The Digital <span className="text-foreground/30">Footprint</span>
          </h2>
        </header>

        <div className="space-y-2">
          {platforms.map((social, idx) => (
            <motion.a
              key={social.name}
              href="#"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative block w-full border-b border-foreground/5 py-6 md:py-8 overflow-hidden"
            >
              {/* The "Prestige" Hover Reveal */}
              <motion.div 
                className="absolute inset-0 bg-foreground/[0.03] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-out"
              />

              <div className="relative flex items-center justify-between z-10">
                <div className="flex items-center gap-6 md:gap-12">
                  <span className="text-xs font-mono text-foreground/20 italic">0{idx + 1}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-foreground/40 group-hover:text-foreground transition-colors duration-300">
                      {social.icon}
                    </span>
                    <h3 className="text-2xl md:text-5xl font-serif italic text-foreground tracking-tight group-hover:pl-4 transition-all duration-500">
                      {social.name}
                    </h3>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-widest text-foreground/40 group-hover:text-foreground/80 transition-colors">
                    {social.desc}
                  </span>
                  <AnimatePresence>
                    {hoveredIndex === idx && (
                      <motion.span
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-xs font-light text-foreground/60 italic"
                      >
                        {social.handle}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Follower/CTA Prompt */}
              <div className="absolute right-1/2 top-1/2 -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block">
                <span className="text-[8px] uppercase tracking-[1em] font-bold text-foreground/20">Join the Circle</span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}