"use client"

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const blogPosts = [
  {
    id: 1,
    category: "Design Philosophy",
    title: "The Architecture of Silence",
    excerpt: "Exploring how negative space becomes the loudest statement in luxury interiors.",
    content: "In the world of haute design, what you don't see is just as important as what you do...",
    image: "https://images.unsplash.com/photo-1618221195710-dd0b2e9b23e9?auto=format&fit=crop&q=80&w=1200&h=1600",
    author: "Eleanor Vance",
    date: "Mar 15, 2024",
    readTime: "8 min read",
    views: "2.4k",
    gradient: "from-amber-900/20 via-transparent to-transparent"
  },
  {
    id: 2,
    category: "Craftsmanship",
    title: "Hands That Speak",
    excerpt: "A journey through the ateliers where master artisans breathe life into raw materials.",
    content: "Every stroke, every carve tells a story...",
    image: "https://images.unsplash.com/photo-1581587357988-15c6757b347e?auto=format&fit=crop&q=80&w=1200&h=1600",
    author: "James Croft",
    date: "Mar 10, 2024",
    readTime: "12 min read",
    views: "1.8k",
    gradient: "from-indigo-900/20 via-transparent to-transparent"
  },
  {
    id: 3,
    category: "Material Stories",
    title: "The Alchemy of Stone",
    excerpt: "How rare marbles and onyx are transformed into poetic statements of permanence.",
    content: "Stone whispers ancient secrets...",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200&h=1600",
    author: "Isabella Chen",
    date: "Mar 5, 2024",
    readTime: "10 min read",
    views: "3.1k",
    gradient: "from-emerald-900/20 via-transparent to-transparent"
  },
  {
    id: 4,
    category: "Light & Space",
    title: "Painting With Shadows",
    excerpt: "The forgotten art of manipulating light to sculpt emotion within walls.",
    content: "Light is the ultimate luxury material...",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200&h=1600",
    author: "Marcus Webb",
    date: "Feb 28, 2024",
    readTime: "6 min read",
    views: "2.9k",
    gradient: "from-rose-900/20 via-transparent to-transparent"
  },
  {
    id: 5,
    category: "Sustainable Luxury",
    title: "The Future of Elegance",
    excerpt: "How eco-conscious design is redefining what it means to live beautifully.",
    content: "Luxury and sustainability are no longer mutually exclusive...",
    image: "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&q=80&w=1200&h=1600",
    author: "Nina Patel",
    date: "Feb 20, 2024",
    readTime: "9 min read",
    views: "1.5k",
    gradient: "from-teal-900/20 via-transparent to-transparent"
  }
]

const authors: Record<string, { bio: string; avatar: string; role: string }> = {
  "Eleanor Vance": {
    bio: "Design critic and curator with 15 years exploring the intersection of space and emotion.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    role: "Editor at Large"
  },
  "James Croft": {
    bio: "Documentary photographer specializing in artisanal crafts.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    role: "Visual Storyteller"
  },
  "Isabella Chen": {
    bio: "Materials specialist and geologist turned design consultant.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
    role: "Material Curator"
  },
  "Marcus Webb": {
    bio: "Lighting designer with a background in theater.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
    role: "Light Architect"
  },
  "Nina Patel": {
    bio: "Sustainability advocate and luxury brand consultant.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
    role: "Sustainability Director"
  }
}

const categories = ["All", "Design Philosophy", "Craftsmanship", "Material Stories", "Light & Space", "Sustainable Luxury"]

export default function BlogCarousel() {
  const [selectedPost, setSelectedPost] = useState<typeof blogPosts[0] | null>(null)
  const [activeIndex, setActiveIndex] = useState(2)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [savedPosts, setSavedPosts] = useState<number[]>([])
  const [claps, setClaps] = useState<Record<number, number>>({})
  const [readingProgress, setReadingProgress] = useState(0)
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const journalRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const totalSlides = blogPosts.length
  const AUTO_PLAY_DURATION = 5000

  // Touch handling
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null)
  const [isSwiping, setIsSwiping] = useState(false)

  const minSwipeDistance = 50
  const maxVerticalDistance = 100

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem('savedPosts')
    if (saved) setSavedPosts(JSON.parse(saved))
    const savedClaps = localStorage.getItem('claps')
    if (savedClaps) setClaps(JSON.parse(savedClaps))
  }, [])

  useEffect(() => {
    localStorage.setItem('savedPosts', JSON.stringify(savedPosts))
  }, [savedPosts])

  useEffect(() => {
    localStorage.setItem('claps', JSON.stringify(claps))
  }, [claps])

  // Text-to-Speech
  const speak = useCallback(() => {
    if ('speechSynthesis' in window && selectedPost) {
      if (isSpeaking) {
        window.speechSynthesis.cancel()
        setIsSpeaking(false)
      } else {
        const textToRead = `${selectedPost.title}. ${selectedPost.excerpt}. ${selectedPost.content}`
        const utterance = new SpeechSynthesisUtterance(textToRead)
        utterance.rate = 0.9
        utterance.pitch = 1
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = () => setIsSpeaking(false)
        window.speechSynthesis.speak(utterance)
        setIsSpeaking(true)
      }
    }
  }, [isSpeaking, selectedPost])

  useEffect(() => {
    if (!selectedPost && isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [selectedPost, isSpeaking])

  // CRITICAL: Mobile-first config that defaults to mobile sizes
  const getCarouselConfig = () => {
    // Default to mobile dimensions to prevent flash of desktop layout
    const width = typeof window !== 'undefined' ? window.innerWidth : 375 // iPhone width as default
    const height = typeof window !== 'undefined' ? window.innerHeight : 667
    const isMobile = width < 768
    const isTablet = width < 1024

    // FORCE mobile card dimensions
    const cardWidth = isMobile ? Math.min(width * 0.75, 280) : 320
    const cardHeight = isMobile ? Math.min(height * 0.45, 380) : 440

    // FORCE smaller radius on mobile
    const maxRadiusX = Math.min(width * 0.3, 400)
    const radiusX = isMobile ? width * 0.25 : isTablet ? 280 : maxRadiusX
    const radiusY = isMobile ? 15 : 40

    return {
      radiusX,
      radiusY,
      cardWidth,
      cardHeight,
      viewportHeight: height,
      isMobile,
      isTablet
    }
  }

  const [config, setConfig] = useState(getCarouselConfig())

  useEffect(() => {
    const handleResize = () => setConfig(getCarouselConfig())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Filter posts
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory
    const matchesSearch = searchQuery === "" || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.targetTouches[0]
    setTouchStart({ x: touch.clientX, y: touch.clientY })
    setTouchEnd(null)
    setIsSwiping(false)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return
    const touch = e.targetTouches[0]
    setTouchEnd({ x: touch.clientX, y: touch.clientY })

    const deltaX = Math.abs(touch.clientX - touchStart.x)
    const deltaY = Math.abs(touch.clientY - touchStart.y)

    if (deltaX > deltaY && deltaX > 10) {
      setIsSwiping(true)
    }
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || !isSwiping) {
      setTouchStart(null)
      setTouchEnd(null)
      setIsSwiping(false)
      return
    }

    const deltaX = touchStart.x - touchEnd.x
    const deltaY = Math.abs(touchStart.y - touchEnd.y)

    if (Math.abs(deltaX) > minSwipeDistance && deltaY < maxVerticalDistance) {
      if (deltaX > 0 && filteredPosts.length > 2) {
        handleNext()
      } else if (deltaX < 0 && filteredPosts.length > 2) {
        handlePrev()
      }
    }

    setTouchStart(null)
    setTouchEnd(null)
    setIsSwiping(false)
  }

  const getFilteredCardStyle = (index: number, totalFiltered: number) => {
    const { radiusX, radiusY, cardWidth, isMobile } = config

    if (totalFiltered === 1) {
      return { x: 0, z: 0, scale: 1, rotateY: 0, opacity: 1, zIndex: 10, isActive: true }
    }

    if (totalFiltered === 2) {
      const offset = index === 0 ? -1 : 1
      const x = offset * (cardWidth * 0.6)
      return { x, z: 0, scale: 0.9, rotateY: offset * -5, opacity: 1, zIndex: 10, isActive: true }
    }

    const activeFilteredIndex = filteredPosts.findIndex(p => blogPosts.indexOf(p) === activeIndex)
    let offset = index - activeFilteredIndex

    if (offset > totalFiltered / 2) offset -= totalFiltered
    if (offset < -totalFiltered / 2) offset += totalFiltered

    const angle = offset * (Math.PI / 5)
    const x = Math.sin(angle) * radiusX
    const z = Math.cos(angle) * radiusY - radiusY
    const scale = 0.75 + (0.25 * ((z + radiusY) / radiusY))
    const rotateY = -offset * 12
    const opacity = offset === 0 ? 1 : Math.max(0.3, 0.7 * ((z + radiusY) / radiusY))
    const zIndex = Math.round((z + radiusY) * 10)

    return { x, z, scale, rotateY, opacity, zIndex, isActive: offset === 0 }
  }

  const handleNext = useCallback(() => {
    if (filteredPosts.length <= 2) return
    setActiveIndex((prev) => (prev + 1) % totalSlides)
  }, [totalSlides, filteredPosts.length])

  const handlePrev = useCallback(() => {
    if (filteredPosts.length <= 2) return
    setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides)
  }, [totalSlides, filteredPosts.length])

  useEffect(() => {
    if (!isAutoPlaying || searchQuery || selectedCategory !== "All" || filteredPosts.length <= 2) return
    const timer = setInterval(handleNext, AUTO_PLAY_DURATION)
    return () => clearInterval(timer)
  }, [isAutoPlaying, handleNext, searchQuery, selectedCategory, filteredPosts.length])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPost) {
        if (e.key === 'Escape') setSelectedPost(null)
        return
      }
      if (filteredPosts.length > 2) {
        if (e.key === 'ArrowLeft') handlePrev()
        if (e.key === 'ArrowRight') handleNext()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, handlePrev, selectedPost, filteredPosts.length])

  useEffect(() => {
    if (!selectedPost) {
      setReadingProgress(0)
      return
    }

    const handleScroll = () => {
      if (!contentRef.current) return
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setReadingProgress(Math.min(100, Math.max(0, progress)))
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [selectedPost])

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleSave = (postId: number, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setSavedPosts(prev => prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId])
  }

  const handleClap = (postId: number, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setClaps(prev => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }))
  }

  const sharePost = async (post: typeof blogPosts[0], e?: React.MouseEvent) => {
    e?.stopPropagation()
    const shareData = { title: post.title, text: post.excerpt, url: window.location.href }
    if (navigator.share) {
      try { await navigator.share(shareData) } catch (err) { console.log('Share cancelled') }
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const getRelatedPosts = (currentPost: typeof blogPosts[0]) => {
    return blogPosts.filter(p => p.category === currentPost.category && p.id !== currentPost.id).slice(0, 2)
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail("")
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  const handleCardClick = (post: typeof blogPosts[0], isActive: boolean) => {
    if (isActive) {
      setSelectedPost(post)
      window.scrollTo(0, 0)
    } else {
      const postIndex = blogPosts.indexOf(post)
      setActiveIndex(postIndex)
      setTimeout(() => { setSelectedPost(post); window.scrollTo(0, 0) }, 400)
    }
  }

  const scrollToJournal = () => {
    if (journalRef.current) {
      const offset = 80
      const elementPosition = journalRef.current.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {/* Reading Progress Bar */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-amber-500 to-orange-600 z-[60]"
            style={{ width: `${readingProgress}%` }}
          />
        )}
      </AnimatePresence>

      {/* 
        ============================================
        MOBILE-FIRST STYLES - THESE APPLY TO ALL SCREENS
        Then md: prefixes override for larger screens
        ============================================
      */}
      <section 
        id="journal" 
        ref={journalRef}
        className="relative w-full bg-background overflow-hidden"
        style={{ minHeight: '100svh' }} // FORCE svh for mobile
      >
        {/* Background Accents */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-foreground/[0.02] rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[5%] w-80 h-80 bg-foreground/[0.02] rounded-full blur-[120px]" />
        </div>

        {/* 
          MAIN CONTAINER
          Mobile: px-4 (16px side padding - CRITICAL for not touching edges)
          md: px-6, lg: px-8
        */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex flex-col items-center">

          {/* 
            HEADER SECTION
            Mobile: pt-20 (80px top padding - FIXES CUT OFF), text-3xl
            md: pt-4, text-6xl
          */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            className="text-center mb-8 pt-20 md:pt-4 md:mb-12"
          >
            <h2 className="text-3xl md:text-6xl lg:text-7xl font-serif italic text-foreground tracking-tight">
              The <span className="text-foreground/40 font-light">Journal</span>
            </h2>
            <div className="h-px w-16 bg-foreground/20 mx-auto mt-4 md:mt-6" />
          </motion.div>

          {/* 
            SEARCH BAR
            Mobile: px-0 (inside already has padding), py-3
          */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 w-full max-w-md"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-b border-foreground/20 py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/40 text-foreground"
              />
              <svg className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </motion.div>

          {/* 
            CATEGORY FILTER
            Mobile: text-[10px], px-3, py-2, gap-2
            md: text-xs, px-4
          */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 md:mb-12 flex flex-wrap justify-center gap-2 max-w-4xl"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setActiveIndex(0) }}
                className={`text-[10px] md:text-xs uppercase tracking-widest px-3 md:px-4 py-2 border transition-all duration-300 ${
                  selectedCategory === cat 
                    ? 'border-foreground bg-foreground text-background' 
                    : 'border-foreground/20 text-foreground/60 hover:border-foreground/40 hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* 
            3D CAROUSEL
            Mobile: touch-pan-y (enables swipe), select-none
            Height set via inline style based on config
          */}
          <div 
            ref={containerRef}
            className="relative w-full flex items-center justify-center touch-pan-y select-none"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{ 
              perspective: '1400px',
              height: config.isMobile ? config.cardHeight + 80 : config.cardHeight + 140,
              minHeight: config.isMobile ? 450 : 600,
            }}
          >
            {filteredPosts.length > 0 ? filteredPosts.map((post, index) => {
              const style = getFilteredCardStyle(index, filteredPosts.length)
              const postClaps = claps[post.id] || 0
              const isPostSaved = savedPosts.includes(post.id)

              return (
                <motion.article
                  key={post.id}
                  onClick={() => handleCardClick(post, style.isActive)}
                  className="absolute cursor-pointer group"
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
                    duration: 0.8,
                    ease: [0.19, 1, 0.22, 1],
                  }}
                >
                  {/* 
                    CARD
                    Mobile: rounded-lg (softer), p-5
                    md: rounded-sm, p-6
                  */}
                  <div className="relative w-full h-full bg-neutral-900 rounded-lg md:rounded-sm overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] ring-1 ring-white/10">
                    <motion.div 
                      className="absolute inset-0"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6 }}
                    >
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                        draggable={false}
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${post.gradient} from-black/80 via-black/30 to-transparent`} />
                    </motion.div>

                    {/* Save Button - Mobile: top-3 right-3, p-2.5 */}
                    {style.isActive && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={(e) => toggleSave(post.id, e)}
                        className="absolute top-3 right-3 z-20 p-2.5 bg-black/40 backdrop-blur-md rounded-full hover:bg-black/60 transition-all active:scale-95"
                      >
                        <svg 
                          className={`w-4 h-4 transition-colors ${isPostSaved ? 'text-red-400 fill-current' : 'text-white/80'}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </motion.button>
                    )}

                    {/* Card Content - Mobile: p-5 */}
                    <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end text-white">
                      <motion.div
                        animate={{ y: style.isActive ? 0 : 10 }}
                        transition={{ duration: 0.6 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] tracking-[0.2em] uppercase text-white/60 font-medium">
                            {post.category}
                          </span>
                          {style.isActive && (
                            <span className="text-[10px] text-white/50 flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              {post.views}
                            </span>
                          )}
                        </div>

                        {/* Title - Mobile: text-lg */}
                        <h3 className="text-lg md:text-xl lg:text-2xl font-serif italic mb-2 leading-tight [text-wrap:balance]">
                          {post.title}
                        </h3>

                        {/* Excerpt - Mobile: text-xs */}
                        <p className="text-xs md:text-sm text-white/70 line-clamp-2 font-light leading-relaxed mb-4">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-white/10">
                          <span className="text-[10px] tracking-widest uppercase text-white/40">{post.readTime}</span>
                          <div className="flex items-center gap-3">
                            {style.isActive && postClaps > 0 && (
                              <span className="text-[10px] text-white/60 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {postClaps}
                              </span>
                            )}
                            <span className="text-[10px] tracking-widest uppercase text-white/50 group-hover:text-white transition-colors flex items-center gap-1.5">
                              {style.isActive ? 'Read' : 'View'} <span className="text-sm">→</span>
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Author Info - Mobile: -bottom-14, text-sm */}
                  {style.isActive && filteredPosts.length > 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -bottom-14 md:-bottom-16 left-0 right-0 text-center"
                    >
                      <p className="text-foreground font-serif italic text-sm md:text-base">{post.author}</p>
                      <p className="text-foreground/40 text-[10px] uppercase tracking-widest mt-1">{post.date}</p>
                    </motion.div>
                  )}
                </motion.article>
              )
            }) : (
              <div className="text-center text-foreground/40 text-sm font-light py-20">
                No stories found matching your criteria
              </div>
            )}
          </div>

          {/* 
            NAVIGATION FOOTER
            Mobile: mt-16, gap-8
            md: mt-24, gap-12
          */}
          <div className="mt-16 md:mt-24 flex flex-col items-center gap-8 md:gap-12">
            <div className="flex items-center gap-8 md:gap-12">
              <button 
                onClick={handlePrev} 
                disabled={filteredPosts.length <= 2}
                className={`group p-3 rounded-full border border-foreground/20 hover:border-foreground/40 transition-all ${filteredPosts.length <= 2 ? 'opacity-30 cursor-not-allowed' : 'active:scale-95'}`}
              >
                <svg className="w-5 h-5 text-foreground/50 group-hover:text-foreground transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Progress Indicators */}
              <div className="flex gap-2 md:gap-3 items-center">
                {blogPosts.map((_, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <button
                      key={index}
                      onClick={() => filteredPosts.length > 2 && setActiveIndex(index)}
                      disabled={filteredPosts.length <= 2}
                      className={`relative h-1.5 rounded-full overflow-hidden transition-all duration-500 ${filteredPosts.length > 2 ? 'cursor-pointer hover:bg-foreground/20' : ''}`}
                      style={{ width: isActive ? '48px' : '6px' }}
                    >
                      <div className="absolute inset-0 bg-foreground/20" />
                      {isActive && filteredPosts.length > 2 && (
                        <motion.div 
                          initial={{ width: "0%" }}
                          animate={{ width: isAutoPlaying ? "100%" : "0%" }}
                          transition={{ duration: isAutoPlaying ? AUTO_PLAY_DURATION / 1000 : 0, ease: "linear" }}
                          key={activeIndex}
                          className="absolute inset-0 bg-foreground"
                        />
                      )}
                      {isActive && filteredPosts.length <= 2 && (
                        <div className="absolute inset-0 bg-foreground" />
                      )}
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={handleNext} 
                disabled={filteredPosts.length <= 2}
                className={`group p-3 rounded-full border border-foreground/20 hover:border-foreground/40 transition-all ${filteredPosts.length <= 2 ? 'opacity-30 cursor-not-allowed' : 'active:scale-95'}`}
              >
                <svg className="w-5 h-5 text-foreground/50 group-hover:text-foreground transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* 
              VIEW ALL STORIES BUTTON
              Mobile: text-[11px], px-6, pb-8 (padding bottom for visibility)
            */}
            <motion.button 
              onClick={scrollToJournal}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group flex flex-col items-center gap-3 px-6 pb-8 md:pb-0"
            >
              <span className="text-[11px] md:text-xs uppercase tracking-[0.4em] text-foreground/40 group-hover:text-foreground transition-all font-medium">
                View All Stories
              </span>
              <motion.div className="h-px bg-foreground/30 w-20 group-hover:w-32 group-hover:bg-foreground/50 transition-all duration-500" />
            </motion.button>
          </div>
        </div>

        {/* 
          BACK TO TOP BUTTON
          Mobile: bottom-6 right-6, p-4
        */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              onClick={scrollToTop}
              className="fixed bottom-6 right-6 z-40 p-4 bg-foreground text-background rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Article Modal */}
        <AnimatePresence>
          {selectedPost && (
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 overflow-y-auto bg-background"
            >
              {/* Floating Action Buttons */}
              <div className="fixed top-4 left-4 right-4 z-[100] flex justify-between items-start pointer-events-none">
                {/* Back Button */}
                <motion.button 
                  onClick={() => setSelectedPost(null)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="pointer-events-auto flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 text-foreground hover:bg-white/20 transition-all group shadow-lg active:scale-95"
                >
                  <div className="w-5 h-5 rounded-full bg-foreground/10 flex items-center justify-center group-hover:bg-foreground/20 transition-colors">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium hidden sm:inline">Back</span>
                </motion.button>

                {/* Audio Button with Animated Equalizer */}
                <motion.button
                  onClick={speak}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-full backdrop-blur-xl border transition-all group shadow-lg active:scale-95 ${
                    isSpeaking ? 'bg-foreground text-background border-foreground' : 'bg-white/10 text-foreground border-white/20 hover:bg-white/20'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${isSpeaking ? 'bg-background/20' : 'bg-foreground/10 group-hover:bg-foreground/20'}`}>
                    {isSpeaking ? (
                      <div className="flex gap-0.5 items-end h-3">
                        <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-0.5 bg-current rounded-full" />
                        <motion.div animate={{ height: [8, 4, 8] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }} className="w-0.5 bg-current rounded-full" />
                        <motion.div animate={{ height: [6, 10, 6] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }} className="w-0.5 bg-current rounded-full" />
                      </div>
                    ) : (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    )}
                  </div>
                  <span className="text-xs font-medium hidden sm:inline">{isSpeaking ? 'Listening...' : 'Listen'}</span>
                </motion.button>
              </div>

              {/* Hero Section */}
              <div className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] w-full">
                <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-transparent to-background" />

                <div className="absolute top-24 right-4 md:right-6 flex items-center gap-2">
                  <button onClick={() => toggleSave(selectedPost.id)} className="p-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 text-foreground hover:bg-white/20 transition-all active:scale-95">
                    <svg className={`w-4 h-4 ${savedPosts.includes(selectedPost.id) ? 'text-red-400 fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <button onClick={() => sharePost(selectedPost)} className="p-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 text-foreground hover:bg-white/20 transition-all active:scale-95">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-16">
                  <div className="max-w-4xl mx-auto">
                    <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-foreground/60 mb-3 block">{selectedPost.category}</span>
                    <h1 className="text-3xl md:text-6xl lg:text-7xl font-serif italic text-foreground mb-4 leading-tight">{selectedPost.title}</h1>
                    <div className="flex flex-wrap items-center gap-4 md:gap-6 text-[10px] md:text-xs uppercase tracking-widest text-foreground/50">
                      <span>{selectedPost.readTime}</span>
                      <span className="w-1 h-1 rounded-full bg-foreground/30" />
                      <span>{selectedPost.views} reads</span>
                      <span className="w-1 h-1 rounded-full bg-foreground/30" />
                      <span>{selectedPost.date}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <div ref={contentRef} className="w-full max-w-3xl mx-auto px-6 md:px-8 py-12 md:py-20">
                <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="space-y-12 md:space-y-16">
                  <div className="border-l-2 border-foreground/20 pl-6 md:pl-8 py-4">
                    <p className="text-xl md:text-2xl lg:text-3xl font-serif italic text-foreground/80 leading-relaxed">"{selectedPost.excerpt}"</p>
                  </div>

                  <div className="text-base md:text-lg text-foreground/70 leading-relaxed font-light space-y-6">
                    {selectedPost.content.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="first-letter:text-4xl md:first-letter:text-5xl first-letter:font-serif first-letter:italic first-letter:float-left first-letter:mr-3 first-letter:mt-[-4px]">{paragraph}</p>
                    ))}
                  </div>

                  <div className="bg-foreground/[0.02] border border-foreground/10 p-6 md:p-8 rounded-lg md:rounded-sm">
                    <h4 className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-foreground/40 mb-6">Key Insights</h4>
                    <ul className="space-y-4">
                      {[`Understanding ${selectedPost.category.toLowerCase()}`, "Practical applications", "Expert perspectives"].map((insight, idx) => (
                        <li key={idx} className="flex items-start gap-4 text-foreground/70 font-light text-sm md:text-base">
                          <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full mt-2 shrink-0" />
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-center py-12 border-y border-foreground/10">
                    <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-foreground/40 mb-8">Did this resonate?</p>
                    <motion.button onClick={() => handleClap(selectedPost.id)} whileTap={{ scale: 1.1 }} className="group inline-flex flex-col items-center gap-4">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-foreground/20 flex items-center justify-center group-hover:border-foreground/40 group-hover:bg-foreground/5 transition-all active:scale-95">
                        <svg className="w-8 h-8 md:w-10 md:h-10 text-foreground/60 group-hover:text-foreground transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-2xl md:text-3xl font-serif italic text-foreground">{claps[selectedPost.id] || 0}</span>
                      <span className="text-[10px] uppercase tracking-widest text-foreground/40">Appreciations</span>
                    </motion.button>
                  </div>

                  <div className="flex items-start gap-4 md:gap-6 py-8">
                    <img src={authors[selectedPost.author]?.avatar} alt={selectedPost.author} className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover grayscale" />
                    <div className="flex-1">
                      <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-foreground/40 mb-1">Written by</p>
                      <h4 className="text-lg md:text-xl font-serif italic text-foreground mb-1">{selectedPost.author}</h4>
                      <p className="text-sm text-foreground/60 mb-3">{authors[selectedPost.author]?.role}</p>
                      <p className="text-sm text-foreground/50 font-light leading-relaxed">{authors[selectedPost.author]?.bio}</p>
                    </div>
                  </div>

                  {getRelatedPosts(selectedPost).length > 0 && (
                    <div className="pt-8">
                      <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-foreground/40 mb-8">Continue Reading</p>
                      <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
                        {getRelatedPosts(selectedPost).map(related => (
                          <button key={related.id} onClick={() => { setSelectedPost(related); window.scrollTo(0, 0) }} className="group text-left">
                            <div className="aspect-[4/3] overflow-hidden rounded-lg md:rounded-sm mb-4">
                              <img src={related.image} alt={related.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" />
                            </div>
                            <span className="text-[10px] uppercase tracking-widest text-foreground/40">{related.category}</span>
                            <h4 className="font-serif italic text-lg md:text-xl mt-2 group-hover:text-foreground/70 transition-colors">{related.title}</h4>
                            <p className="text-sm text-foreground/50 mt-2 line-clamp-2 font-light">{related.excerpt}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>

                <div className="mt-16 md:mt-20 mb-12 p-8 md:p-12 bg-foreground/[0.02] border border-foreground/10 text-center rounded-lg md:rounded-sm">
                  <h3 className="text-2xl md:text-3xl font-serif italic mb-4 text-foreground">Join The Inner Circle</h3>
                  <p className="text-foreground/60 mb-8 font-light max-w-md mx-auto text-sm md:text-base">Weekly insights on luxury design. No spam, only inspiration.</p>
                  {subscribed ? (
                    <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-foreground font-serif italic text-lg">Welcome to the circle. Check your inbox.</motion.p>
                  ) : (
                    <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                      <input type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} required className="flex-1 bg-transparent border-b border-foreground/20 py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/40 text-foreground text-center sm:text-left" />
                      <button type="submit" className="px-8 py-3 border border-foreground text-[10px] uppercase tracking-widest font-bold hover:bg-foreground hover:text-background transition-all active:scale-95">Subscribe</button>
                    </form>
                  )}
                </div>

                <div className="text-center pb-12">
                  <motion.button onClick={() => { setSelectedPost(null); setTimeout(() => scrollToJournal(), 100) }} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="inline-flex items-center gap-3 text-foreground/40 hover:text-foreground transition-all group px-6 py-3">
                    <svg className="w-4 h-4 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    <span className="text-[10px] md:text-xs uppercase tracking-widest font-bold">Back to Journal</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  )
}