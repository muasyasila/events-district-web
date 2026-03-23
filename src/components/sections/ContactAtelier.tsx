"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, MapPin, Mail, Calendar, ChevronDown, Phone } from 'lucide-react'

export function ContactAtelier() {
  const [eventType, setEventType] = useState("")

  const eventOptions = [
    "Wedding Ceremony",
    "Luxury Gala",
    "Corporate Launch",
    "Private Soirée",
    "Traditional Ceremony",
    "Anniversary Celebration",
    "Other"
  ]

  return (
    <section className="relative min-h-screen w-full bg-background py-24 md:py-32 overflow-hidden border-t border-foreground/10 text-foreground">
      
      {/* Background Decorative Text */}
      <div className="absolute top-10 left-10 opacity-[0.04] dark:opacity-[0.02] pointer-events-none hidden lg:block">
        <h2 className="text-[15vw] font-serif italic leading-none">Inquiry</h2>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        
        {/* LEFT: Info Column */}
        <div className="lg:col-span-5 flex flex-col justify-between relative">
          <div>
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-[10px] uppercase tracking-[0.8em] text-foreground/60 dark:text-foreground/40 font-bold block mb-4"
            >
              The Final Step
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-serif italic mb-8 tracking-tighter"
            >
              Start Your <br /> <span className="opacity-30">Legacy.</span>
            </motion.h2>
            <p className="text-foreground/80 dark:text-foreground/60 font-light leading-relaxed max-w-sm mb-12 text-sm md:text-base">
              From the heart of Nairobi to the most exclusive destinations, we translate your emotions into a visual masterpiece.
            </p>

            <div className="space-y-10">
              <div className="flex items-start gap-4 group">
                <div className="p-3 border border-foreground/30 dark:border-foreground/10 rounded-full group-hover:bg-foreground group-hover:text-background transition-all duration-500">
                  <MapPin size={18} strokeWidth={1} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-foreground/50 mb-1 font-bold">Our Studio</p>
                  <p className="text-sm font-medium tracking-tight">Nairobi, Kenya</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="p-3 border border-foreground/30 dark:border-foreground/10 rounded-full group-hover:bg-foreground group-hover:text-background transition-all duration-500">
                  <Mail size={18} strokeWidth={1} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-foreground/50 mb-1 font-bold">Direct Liaison</p>
                  <p className="text-sm font-medium tracking-tight">hello@eventsdistrict.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="p-3 border border-foreground/30 dark:border-foreground/10 rounded-full group-hover:bg-foreground group-hover:text-background transition-all duration-500">
                  <Phone size={18} strokeWidth={1} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-foreground/50 mb-1 font-bold">Let's have a call</p>
                  <p className="text-sm font-medium tracking-tight">+254 700 000 000, +254 711 000 000, +254 722 000 000</p>
                </div>
              </div>
            </div>
          </div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="mt-16 p-8 border border-foreground/20 dark:border-foreground/10 bg-foreground/[0.04] dark:bg-foreground/[0.02] backdrop-blur-sm rounded-sm"
          >
            <Calendar className="mb-4 opacity-50 dark:opacity-30" size={24} strokeWidth={1} />
            <h4 className="font-serif italic text-xl mb-2">Book a Consultation</h4>
            <p className="text-[11px] text-foreground/70 dark:text-foreground/60 mb-6 tracking-wide leading-relaxed">
              Schedule a private session with our lead decorators to begin the curation of your event.
            </p>
            <button className="w-full py-4 bg-foreground text-background text-[10px] uppercase tracking-[0.3em] font-bold hover:opacity-90 transition-all duration-300">
              Reserve a Slot
            </button>
          </motion.div>

          {/* THE OR DIVIDER: Desktop (Hidden on small screens) */}
          <div className="hidden lg:flex absolute -right-10 top-0 bottom-0 items-center justify-center">
             <div className="h-full w-[1px] bg-foreground/10 relative">
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background py-4 px-2 text-[10px] font-bold uppercase tracking-[0.4em] text-foreground/30">
                  OR
                </span>
             </div>
          </div>
        </div>

        {/* THE OR DIVIDER: Mobile (Visible only on small screens) */}
        <div className="lg:hidden flex items-center w-full py-4">
           <div className="h-[1px] flex-grow bg-foreground/10" />
           <span className="px-4 text-[10px] font-bold uppercase tracking-[0.4em] text-foreground/30">OR</span>
           <div className="h-[1px] flex-grow bg-foreground/10" />
        </div>

        {/* RIGHT: The Form */}
        <div className="lg:col-span-7">
          <form className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="w-full bg-transparent border-b border-foreground/30 dark:border-foreground/10 py-4 focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/40 text-sm tracking-tight"
                />
                <div className="absolute bottom-0 left-0 h-[1px] bg-foreground w-0 group-focus-within:w-full transition-all duration-700" />
              </div>
              <div className="relative group">
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full bg-transparent border-b border-foreground/30 dark:border-foreground/10 py-4 focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/40 text-sm tracking-tight"
                />
                <div className="absolute bottom-0 left-0 h-[1px] bg-foreground w-0 group-focus-within:w-full transition-all duration-700" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="relative group">
                <input 
                  type="tel" 
                  placeholder="Phone Number" 
                  className="w-full bg-transparent border-b border-foreground/30 dark:border-foreground/10 py-4 focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/40 text-sm tracking-tight"
                />
                <div className="absolute bottom-0 left-0 h-[1px] bg-foreground w-0 group-focus-within:w-full transition-all duration-700" />
              </div>
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Subject (e.g. Wedding Inquiry)" 
                  className="w-full bg-transparent border-b border-foreground/30 dark:border-foreground/10 py-4 focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/40 text-sm tracking-tight"
                />
                <div className="absolute bottom-0 left-0 h-[1px] bg-foreground w-0 group-focus-within:w-full transition-all duration-700" />
              </div>
            </div>

            <div className="relative group">
              <div className="relative">
                <select 
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className={`w-full bg-transparent border-b border-foreground/30 dark:border-foreground/10 py-4 focus:outline-none focus:border-foreground transition-colors text-sm tracking-tight appearance-none cursor-pointer ${eventType ? 'text-foreground' : 'text-foreground/40'}`}
                >
                  <option value="" disabled>Select Type of Event</option>
                  {eventOptions.map((option) => (
                    <option key={option} value={option} className="bg-background text-foreground uppercase text-[10px] tracking-widest">{option}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" />
              </div>
              <div className="absolute bottom-0 left-0 h-[1px] bg-foreground w-0 group-focus-within:w-full transition-all duration-700" />
            </div>

            <AnimatePresence>
              {eventType === "Other" && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative group overflow-hidden"
                >
                  <input 
                    type="text" 
                    placeholder="Tell us more about your event concept..." 
                    className="w-full bg-transparent border-b border-foreground/30 dark:border-foreground/10 py-4 focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/40 text-sm tracking-tight"
                  />
                  <div className="absolute bottom-0 left-0 h-[1px] bg-foreground w-0 group-focus-within:w-full transition-all duration-700" />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative group">
              <textarea 
                rows={4}
                placeholder="Share your vision or specific requirements..." 
                className="w-full bg-transparent border-b border-foreground/30 dark:border-foreground/10 py-4 focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/40 text-sm tracking-tight resize-none"
              />
              <div className="absolute bottom-0 left-0 h-[1px] bg-foreground w-0 group-focus-within:w-full transition-all duration-700" />
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between pt-8 gap-8">
              <div className="order-2 md:order-1">
                <p className="text-[8px] uppercase tracking-[0.4em] text-foreground/50 leading-relaxed text-center md:text-left">
                  By submitting, you agree to our <br /> standards of digital exclusivity.
                </p>
              </div>
              <button className="order-1 md:order-2 group flex items-center gap-8 px-10 py-5 border border-foreground/40 dark:border-foreground/20 hover:bg-foreground hover:text-background transition-all duration-500 rounded-full w-full md:w-auto justify-center">
                <span className="text-[10px] uppercase tracking-[0.5em] font-bold">Send Inquiry</span>
                <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-500" />
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden xl:block opacity-20 dark:opacity-5 vertical-text">
        <span className="text-[10px] uppercase tracking-[1.5em] font-bold">CURATED IN NAIROBI</span>
      </div>
    </section>
  )
}