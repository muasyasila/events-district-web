"use client"

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const blogPosts = [
  {
    id: 1,
    category: "Design Philosophy",
    title: "The Architecture of Silence",
    excerpt: "Exploring how negative space becomes the loudest statement in luxury interiors.",
    content: "In the world of haute design, what you don't see is just as important as what you do. We delve into the paradox of emptiness and how it creates the most profound experiences.",
    image: "https://images.unsplash.com/photo-1618221195710-dd0b2e9b23e9?auto=format&fit=crop&q=80&w=1200&h=1600",
    author: "Eleanor Vance",
    date: "Mar 15, 2024",
    readTime: "8 min read",
    gradient: "from-amber-900/20 via-transparent to-transparent"
  },
  {
    id: 2,
    category: "Craftsmanship",
    title: "Hands That Speak",
    excerpt: "A journey through the ateliers where master artisans breathe life into raw materials.",
    content: "Every stroke, every carve tells a story. We spent time with the masters who refuse to let technology diminish the human touch in luxury creation.",
    image: "https://images.unsplash.com/photo-1581587357988-15c6757b347e?auto=format&fit=crop&q=80&w=1200&h=1600",
    author: "James Croft",
    date: "Mar 10, 2024",
    readTime: "12 min read",
    gradient: "from-indigo-900/20 via-transparent to-transparent"
  },
  {
    id: 3,
    category: "Material Stories",
    title: "The Alchemy of Stone",
    excerpt: "How rare marbles and onyx are transformed into poetic statements of permanence.",
    content: "Stone whispers ancient secrets. We uncover how modern techniques reveal the soul hidden within millennia-old geological formations.",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200&h=1600",
    author: "Isabella Chen",
    date: "Mar 5, 2024",
    readTime: "10 min read",
    gradient: "from-emerald-900/20 via-transparent to-transparent"
  },
  {
    id: 4,
    category: "Light & Space",
    title: "Painting With Shadows",
    excerpt: "The forgotten art of manipulating light to sculpt emotion within walls.",
    content: "Light is the ultimate luxury material. We explore how masterful illumination transforms spaces into living, breathing entities.",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200&h=1600",
    author: "Marcus Webb",
    date: "Feb 28, 2024",
    readTime: "6 min read",
    gradient: "from-rose-900/20 via-transparent to-transparent"
  },
  {
    id: 5,
    category: "Sustainable Luxury",
    title: "The Future of Elegance",
    excerpt: "How eco-conscious design is redefining what it means to live beautifully.",
    content: "Luxury and sustainability are no longer mutually exclusive. Discover how the industry's finest are embracing responsible craftsmanship.",
    image: "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&q=80&w=1200&h=1600",
    author: "Nina Patel",
    date: "Feb 20, 2024",
    readTime: "9 min read",
    gradient: "from-teal-900/20 via-transparent to-transparent"
  }
]

export default function BlogCarousel() {
  const [selectedPost, setSelectedPost] = useState<typeof blogPosts[0] | null>(null)
  const [activeIndex, setActiveIndex] = useState(2)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const totalSlides = blogPosts.length
  const AUTO_PLAY_DURATION = 5000 // 5 seconds per slide
  
  const getCarouselConfig = () => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1200
    const height = typeof window !== 'undefined' ? window.innerHeight : 800
    const isMobile = width < 768
    const isTablet = width < 1024
    
    const cardWidth = isMobile ? 240 : 300
    const cardHeight = isMobile ? 320 : 400
    
    const maxRadiusX = Math.min(width * 0.35, 450)
    const radiusX = isMobile ? width * 0.35 : isTablet ? 300 : maxRadiusX
    const radiusY = isMobile ? 15 : 30
    
    return {
      radiusX,
      radiusY,
      cardWidth,
      cardHeight,
      viewportHeight: height,
    }
  }

  const [config, setConfig] = useState(getCarouselConfig())

  useEffect(() => {
    const handleResize = () => setConfig(getCarouselConfig())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const getCardStyle = (index: number) => {
    const { radiusX, radiusY } = config
    let offset = index - activeIndex
    
    if (offset > totalSlides / 2) offset -= totalSlides
    if (offset < -totalSlides / 2) offset += totalSlides
    
    const angle = offset * (Math.PI / 6) 
    const x = Math.sin(angle) * radiusX
    const z = Math.cos(angle) * radiusY - radiusY
    const scale = 0.75 + (0.25 * ((z + radiusY) / radiusY))
    const rotateY = -offset * 15
    const opacity = 0.3 + (0.7 * ((z + radiusY) / radiusY))
    const zIndex = Math.round((z + radiusY) * 10)
    
    return { x, z, scale, rotateY, opacity, zIndex, isActive: index === activeIndex }
  }

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalSlides)
  }, [totalSlides])

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides)
  }, [totalSlides])

  useEffect(() => {
    if (!isAutoPlaying) return
    const timer = setInterval(handleNext, AUTO_PLAY_DURATION)
    return () => clearInterval(timer)
  }, [isAutoPlaying, handleNext])

  const handleMouseEnter = () => setIsAutoPlaying(false)
  const handleMouseLeave = () => setIsAutoPlaying(true)

  return (
    <>
      <section className="relative h-screen w-full bg-background overflow-hidden flex items-center justify-center">
        {/* Cinematic Background Accents */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[15%] left-[10%] w-64 h-64 bg-foreground/[0.02] rounded-full blur-[120px]" />
          <div className="absolute bottom-[15%] right-[10%] w-80 h-80 bg-foreground/[0.02] rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 w-full max-w-7xl flex flex-col items-center">
          
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-4xl md:text-7xl font-serif italic text-foreground tracking-tight">
              The <span className="text-foreground/40 font-light">Journal</span>
            </h2>
            <div className="h-px w-12 bg-foreground/20 mx-auto mt-4" />
          </motion.div>

          {/* 3D Carousel Viewport */}
          <div 
            ref={containerRef}
            className="relative w-full flex items-center justify-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ 
              perspective: '1400px',
              height: config.cardHeight + 120, 
            }}
          >
            {blogPosts.map((post, index) => {
              const style = getCardStyle(index)
              return (
                <motion.article
                  key={post.id}
                  onClick={() => style.isActive && setSelectedPost(post)}
                  className="absolute cursor-pointer"
                  style={{
                    width: config.cardWidth,
                    height: config.cardHeight,
                    zIndex: style.zIndex,
                    transformStyle: 'preserve-3d',
                  }}
                  animate={{
                    x: style.x,
                    z: style.z,
                    scale: style.scale,
                    rotateY: style.rotateY,
                    opacity: style.opacity,
                  }}
                  transition={{
                    duration: 1.2,
                    ease: [0.19, 1, 0.22, 1],
                  }}
                >
                  <div className="relative w-full h-full bg-neutral-900 rounded-sm overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
                    <div className="absolute inset-0">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${post.gradient} from-black/80 via-black/20 to-transparent`} />
                    </div>

                    <div className="absolute inset-0 p-6 flex flex-col justify-end text-white pb-10">
                      <motion.div
                        animate={{ y: style.isActive ? 0 : 20 }}
                        transition={{ duration: 0.8 }}
                      >
                        <span className="text-[9px] tracking-[0.3em] uppercase mb-2 block text-white/50 font-medium">
                          {post.category}
                        </span>
                        
                        <h3 className="text-lg md:text-2xl font-serif italic mb-3 leading-tight [text-wrap:balance]">
                          {post.title}
                        </h3>
                        
                        <p className="text-[11px] text-white/70 line-clamp-2 font-light leading-relaxed mb-4">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-white/10 text-[9px] tracking-widest uppercase text-white/40">
                          <span>{post.readTime}</span>
                          <span className="flex items-center gap-2 group-hover:text-white transition-colors">
                            View Story <span className="text-sm">→</span>
                          </span>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {style.isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -bottom-16 left-0 right-0 text-center"
                    >
                      <p className="text-foreground font-serif italic text-sm">{post.author}</p>
                      <p className="text-foreground/40 text-[10px] uppercase tracking-widest mt-1">{post.date}</p>
                    </motion.div>
                  )}
                </motion.article>
              )
            })}
          </div>

          {/* Integrated Navigation Footer */}
          <div className="mt-20 flex flex-col items-center gap-10">
            <div className="flex items-center gap-12">
              <button onClick={handlePrev} className="group p-2">
                <svg className="w-5 h-5 text-foreground/30 group-hover:text-foreground transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* PROGRESS BAR NAVIGATION */}
              <div className="flex gap-4 items-center">
                {blogPosts.map((_, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <div 
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      className="relative h-[2px] cursor-pointer overflow-hidden bg-foreground/10 transition-all duration-500"
                      style={{ width: isActive ? '60px' : '6px' }}
                    >
                      {isActive && (
                        <motion.div 
                          initial={{ width: "0%" }}
                          animate={{ width: isAutoPlaying ? "100%" : "0%" }}
                          transition={{ 
                            duration: isAutoPlaying ? AUTO_PLAY_DURATION / 1000 : 0, 
                            ease: "linear" 
                          }}
                          key={activeIndex} // Resets animation when index changes
                          className="absolute inset-0 bg-foreground"
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <button onClick={handleNext} className="group p-2">
                <svg className="w-5 h-5 text-foreground/30 group-hover:text-foreground transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <Link href="/blog" className="group flex flex-col items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.5em] text-foreground/40 group-hover:text-foreground transition-all font-bold">
                View All Stories
              </span>
              <motion.div className="h-px bg-foreground/20 w-16 group-hover:w-24 transition-all duration-500" />
            </Link>
          </div>

        </div>

        {/* Modal Overlay */}
        <AnimatePresence>
          {selectedPost && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 overflow-y-auto bg-background/98 backdrop-blur-2xl flex justify-center"
            >
              <div className="w-full max-w-4xl px-6 py-20">
                <button onClick={() => setSelectedPost(null)} className="mb-12 group flex items-center gap-3 text-foreground/40 hover:text-foreground transition-all">
                  <span className="text-xl">←</span>
                  <span className="text-[10px] uppercase tracking-widest font-bold">Close Perspective</span>
                </button>
                
                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="space-y-12"
                >
                  <img src={selectedPost.image} className="w-full h-[60vh] object-cover rounded-sm shadow-2xl" alt={selectedPost.title} />
                  <div className="max-w-2xl">
                    <span className="text-xs tracking-[0.4em] uppercase text-foreground/40">{selectedPost.category}</span>
                    <h1 className="text-4xl md:text-6xl font-serif italic mt-4 mb-8">{selectedPost.title}</h1>
                    <p className="text-xl font-light leading-relaxed text-foreground/80 mb-8 italic border-l-2 border-foreground/10 pl-8">
                      {selectedPost.excerpt}
                    </p>
                    <div className="text-lg text-foreground/70 leading-relaxed font-light space-y-6">
                      {selectedPost.content}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  )
}