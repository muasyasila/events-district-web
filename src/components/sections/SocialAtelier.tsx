"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Instagram, Facebook, Youtube, Mail, 
  MessageCircle, Ghost, AtSign, Share2 
} from 'lucide-react'

// Official TikTok Icon
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-1.13-.31-2.34-.25-3.41.33-.71.38-1.27 1.03-1.57 1.77-.34.82-.33 1.76.02 2.57.34.78.98 1.43 1.75 1.81.7.35 1.48.45 2.25.34 1.59-.21 2.96-1.35 3.4-2.89.06-.23.08-.47.08-.71V.02z"/>
  </svg>
)

const socialPlatforms = [
  { id: 'ig', name: 'Instagram', icon: <Instagram size={20} />, handle: '@events_district', brandColor: '#E1306C', label: 'The Visual Gallery', img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1600' },
  { id: 'tk', name: 'TikTok', icon: <TikTokIcon />, handle: '@events_district', brandColor: '#00f2ea', label: 'The Behind Scenes', img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1600' },
  { id: 'wa', name: 'WhatsApp', icon: <MessageCircle size={20} />, handle: 'Start Conversation', brandColor: '#25D366', label: 'Instant Concierge', img: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=1600' },
  { id: 'yt', name: 'YouTube', icon: <Youtube size={20} />, handle: 'Events District TV', brandColor: '#FF0000', label: 'The Cinematic Story', img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1600' },
  { id: 'sc', name: 'Snapchat', icon: <Ghost size={20} />, handle: 'events_dist', brandColor: '#FFFC00', label: 'Live Snapshots', img: 'https://images.unsplash.com/photo-1522673607200-164883eecd4c?q=80&w=1600' },
  { id: 'th', name: 'Threads', icon: <AtSign size={20} />, handle: '@events_district', brandColor: '#808080', label: 'The Dialogue', img: 'https://images.unsplash.com/photo-1618221195710-dd0b2e9b23e9?q=80&w=1600' },
]

export function SocialAtelier() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null)
  
  const activeTab = socialPlatforms[activeIndex]
  const AUTO_PLAY_INTERVAL = 4000 

  const startAutoPlay = useCallback(() => {
    if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    autoPlayTimer.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % socialPlatforms.length);
    }, AUTO_PLAY_INTERVAL);
  }, []);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
  }, []);

  useEffect(() => {
    if (isAutoPlaying) startAutoPlay();
    else stopAutoPlay();
    return () => stopAutoPlay();
  }, [isAutoPlaying, startAutoPlay, stopAutoPlay]);

  return (
    <section className="relative min-h-screen w-full bg-background flex items-center justify-center py-20 md:py-24 overflow-hidden border-t border-foreground/5">
      
      {/* --- DESKTOP VIEW (Visible from md up) --- */}
      <div className="hidden md:grid relative z-10 w-full max-w-7xl px-6 grid-cols-1 md:grid-cols-12 gap-12 items-center">
        
        {/* LEFT: The Switchboard */}
        <div className="md:col-span-4 flex md:flex-col flex-wrap gap-3 order-2 md:order-1 justify-center md:justify-start">
          <div className="mb-8 hidden md:block">
            <span className="text-[10px] uppercase tracking-[0.8em] text-foreground/30 font-bold block mb-2">Digital Presence</span>
            <h2 className="text-3xl font-serif italic text-foreground">Social <span className="opacity-30 text-foreground">Channels</span></h2>
          </div>

          {socialPlatforms.map((platform, index) => (
            <button
              key={platform.id}
              onMouseEnter={() => { setIsAutoPlaying(false); setActiveIndex(index); }}
              onMouseLeave={() => setIsAutoPlaying(true)}
              className={`flex items-center gap-6 p-5 transition-all duration-700 border-l-[1px] w-full lg:w-[320px] group ${
                activeTab.id === platform.id 
                ? 'border-foreground bg-foreground/[0.03] translate-x-2' 
                : 'border-foreground/10 text-foreground/20 hover:text-foreground/50'
              }`}
            >
              <span 
                className="shrink-0 transition-all duration-500 transform group-hover:scale-110"
                style={{ color: activeTab.id === platform.id ? platform.brandColor : 'inherit' }}
              >
                {platform.icon}
              </span>
              
              <div className="flex flex-col items-start text-left">
                <span 
                  className="text-lg md:text-xl font-serif italic tracking-tight transition-colors duration-500"
                  style={{ color: activeTab.id === platform.id ? platform.brandColor : 'inherit' }}
                >
                  {platform.name}
                </span>
                <span className={`text-[8px] uppercase tracking-widest transition-opacity duration-500 ${activeTab.id === platform.id ? 'opacity-40' : 'opacity-0'}`}>
                  {platform.label}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* RIGHT: The Prism */}
        <div className="md:col-span-8 order-1 md:order-2">
          <div className="relative aspect-[16/10] h-[60vh] w-full bg-neutral-900 overflow-hidden rounded-sm group shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] dark:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab.id}
                initial={{ opacity: 0, scale: 1.05, filter: 'blur(4px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
                transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                className="absolute inset-0"
              >
                <img 
                  src={activeTab.img} 
                  className="w-full h-full object-cover grayscale-[80%] group-hover:grayscale-0 transition-all duration-1000"
                  alt={activeTab.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-12 left-12 text-white z-20 overflow-hidden">
              <motion.div
                key={activeTab.name}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="flex items-center gap-3 mb-3">
                    <div className="h-[1px] w-6 bg-white/30" />
                    <span className="text-[9px] uppercase tracking-[0.6em] text-white/50">{activeTab.label}</span>
                </div>
                
                <h3 
                  className="text-6xl md:text-8xl font-serif italic mb-6 tracking-tighter"
                  style={{ color: activeTab.brandColor }}
                >
                  {activeTab.name}
                </h3>

                <div className="flex items-center gap-4">
                    <div className="p-2 border border-white/10 backdrop-blur-sm rounded-full">
                        {activeTab.icon}
                    </div>
                    <p className="text-xs font-light tracking-[0.4em] text-white/70 uppercase italic">
                      {activeTab.handle}
                    </p>
                </div>
              </motion.div>
            </div>

            <div className="absolute top-12 right-12 text-white/20 text-[10px] tracking-[0.5em] uppercase font-bold vertical-text hidden md:block">
              Events District 
            </div>
          </div>
        </div>
      </div>

      {/* --- MOBILE VIEW (Kinetic Stack) --- */}
      <div className="md:hidden flex flex-col px-6 w-full h-full space-y-4">
        <div className="mb-6">
            <span className="text-[8px] uppercase tracking-[0.5em] text-foreground/40 font-bold block mb-1">Our Channels</span>
            <h2 className="text-3xl font-serif italic text-foreground leading-none tracking-tight">The Social Hub</h2>
        </div>

        {socialPlatforms.map((platform, index) => {
          const isActive = activeIndex === index;
          return (
            <div 
              key={platform.id}
              onClick={() => { setActiveIndex(index); setIsAutoPlaying(false); }}
              className="relative w-full overflow-hidden transition-all duration-700 ease-in-out border-b border-foreground/5 pb-4"
              style={{ height: isActive ? '340px' : '64px' }}
            >
              <div className="flex items-center justify-between h-[64px]">
                 <div className="flex items-center gap-4">
                    <span className="transition-colors duration-500" style={{ color: isActive ? platform.brandColor : 'inherit' }}>
                      {platform.icon}
                    </span>
                    <h3 className="text-xl font-serif italic tracking-tight" style={{ color: isActive ? platform.brandColor : 'inherit' }}>
                      {platform.name}
                    </h3>
                 </div>
                 <span className={`text-[8px] uppercase tracking-widest italic transition-opacity duration-500 ${isActive ? 'opacity-40' : 'opacity-20'}`}>
                    {platform.label}
                 </span>
              </div>

              <AnimatePresence>
                {isActive && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative w-full h-[260px] rounded-sm overflow-hidden shadow-xl"
                  >
                    <img src={platform.img} className="w-full h-full object-cover grayscale-[50%]" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-end p-6">
                       <p className="text-white text-[9px] tracking-[0.3em] uppercase mb-1">{platform.handle}</p>
                       <div className="h-px w-8 bg-white/40 mb-3" />
                       <button className="text-white text-[8px] uppercase tracking-[0.4em] font-bold">Follow Atelier</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      <div className="absolute right-10 top-1/2 -translate-y-1/2 vertical-text hidden xl:block opacity-5">
        <span className="text-xs uppercase tracking-[1.5em] text-foreground font-bold" style={{ writingMode: 'vertical-rl' }}>
          SOCIAL ATELIER • 2026
        </span>
      </div>
    </section>
  )
}