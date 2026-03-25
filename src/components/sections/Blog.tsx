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
    content: "In the world of haute design, what you don't see is just as important as what you do. We delve into the paradox of emptiness and how it creates the most profound experiences. The silence between objects speaks volumes. When we strip away the unnecessary, we reveal the essential truth of a space.\n\nThis is the philosophy that guides our most celebrated work—creating moments of pause in a world of constant noise. Every corner, every shadow, every breath of space is intentional. We design not just for the eye, but for the soul.\n\nThe masters of minimalism understood this truth centuries ago. From Japanese wabi-sabi to Scandinavian hygge, the wisdom of less has always been the foundation of true luxury. In our practice, we honor this tradition while pushing it into contemporary relevance.\n\nConsider the lobby of a grand hotel. The temptation is to fill every inch with statement pieces, with art, with evidence of expense. But the spaces that truly take your breath away are those that dare to be quiet. A single sculpture. A shaft of light. The sound of water.\n\nThis is the architecture of silence. It requires confidence. It requires restraint. Most of all, it requires understanding that luxury is not about accumulation—it's about curation.",
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
    content: "Every stroke, every carve tells a story. We spent time with the masters who refuse to let technology diminish the human touch in luxury creation. These artisans have spent decades perfecting their craft, passing knowledge from generation to generation.\n\nTheir hands bear the marks of their dedication—calluses and scars that map their journey. In their workshops, time moves differently. There are no shortcuts to excellence. A single piece of furniture might take six months to complete. A textile might require a year of preparation.\n\nWe visited a workshop in Tuscany where they have been making paper using the same methods since the 13th century. The master, now in his eighties, still wakes at dawn to check the humidity levels. 'The paper tells you when it's ready,' he said. 'You don't tell the paper.'\n\nThis patience, this willingness to submit to the material rather than dominate it, is what separates craft from manufacturing. It's what makes an object not just functional, but meaningful.\n\nIn an age of instant everything, these artisans remind us that some things cannot be rushed. That true luxury is, by definition, scarce. That the human hand, with all its imperfections, creates what machines never can: soul.",
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
    content: "Stone whispers ancient secrets. We uncover how modern techniques reveal the soul hidden within millennia-old geological formations. Each slab tells a story millions of years in the making.\n\nThe veining, the color variations, the imperfections—these are not flaws but fingerprints of the earth itself. Our role is to listen to what the stone wants to become. We recently worked with a rare pink onyx from Iran. The quarry had been closed for decades. When we finally sourced it, the stone sat in our studio for months.\n\nWe were waiting to understand it. The way light passed through it at different times of day. The way it changed temperature. Eventually, we knew: it wanted to be a bar. Not just any bar, but a gathering place where the stone itself would glow like a lantern at night.\n\nThis is the alchemy of stone. Not changing its nature, but revealing it. Not imposing our will, but partnering with geological time. The result is something that feels both ancient and utterly contemporary.\n\nStone teaches us about permanence in an impermanent world. It connects us to deep time. When you touch a marble surface, you are touching the memory of mountains.",
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
    content: "Light is the ultimate luxury material. We explore how masterful illumination transforms spaces into living, breathing entities. The interplay of light and shadow creates drama, intimacy, and wonder.\n\nA room can transform from solemn to celebratory with the flick of a switch—or the movement of the sun. Understanding this dance is essential to creating spaces that feel alive. We spend weeks studying the path of sunlight through a space before making any decisions about artificial lighting.\n\nThe ancient architects understood this. The Pantheon in Rome, with its single oculus, creates a beam of light that moves like a sundial across the interior. Every moment of the day offers a different experience. This is architecture as timepiece.\n\nIn our work, we think about layers of light. Ambient light for navigation. Task light for function. Accent light for drama. And always, always, the possibility of darkness. Because without darkness, light has no meaning.\n\nThe best spaces are those that change throughout the day. Morning light for coffee. Afternoon light for reading. Evening light for cocktails. Night light for intimacy. This is how we paint with shadows.",
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
    content: "Luxury and sustainability are no longer mutually exclusive. Discover how the industry's finest are embracing responsible craftsmanship. The most luxurious thing we can create is a future where beauty doesn't come at the earth's expense.\n\nFrom reclaimed materials to zero-waste production methods, the new wave of luxury is defined by its conscience. We recently completed a project using only salvaged materials. The wood came from a demolished barn. The stone from a closed quarry. The textiles from deadstock luxury fashion.\n\nThe result was not a compromise, but a revelation. The wood had a patina that cannot be manufactured. The stone had a history written in its veins. The textiles had a story that added depth to every surface.\n\nThis is the future of elegance. Not newness for its own sake, but meaning. Not consumption, but curation. The most sophisticated clients are no longer asking 'Is it new?' They are asking 'Is it meaningful?'\n\nSustainability is not a trend. It is a return to the way things were always done before the age of disposability. It is the ultimate luxury because it requires what all true luxury requires: time, thought, and care.",
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
    bio: "Design critic and curator with 15 years exploring the intersection of space and emotion. Former editor of Architectural Digest.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    role: "Editor at Large"
  },
  "James Croft": {
    bio: "Documentary photographer specializing in artisanal crafts. His work has been featured in Monocle and Kinfolk.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    role: "Visual Storyteller"
  },
  "Isabella Chen": {
    bio: "Materials specialist and geologist turned design consultant. She sources rare stones for the world's most exclusive projects.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
    role: "Material Curator"
  },
  "Marcus Webb": {
    bio: "Lighting designer with a background in theater. He brings dramatic sensibilities to residential and commercial spaces.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
    role: "Light Architect"
  },
  "Nina Patel": {
    bio: "Sustainability advocate and luxury brand consultant. She helps heritage houses transition to eco-conscious practices.",
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
  const [timeLeft, setTimeLeft] = useState("")
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  
  const totalSlides = blogPosts.length
  const AUTO_PLAY_DURATION = 5000
  
  // Load saved posts from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedPosts')
    if (saved) setSavedPosts(JSON.parse(saved))
    const savedClaps = localStorage.getItem('claps')
    if (savedClaps) setClaps(JSON.parse(savedClaps))
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('savedPosts', JSON.stringify(savedPosts))
  }, [savedPosts])
  
  useEffect(() => {
    localStorage.setItem('claps', JSON.stringify(claps))
  }, [claps])

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

  // Filter and search posts
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory
    const matchesSearch = searchQuery === "" || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Calculate layout based on filtered posts count
  const getFilteredCardStyle = (index: number, totalFiltered: number) => {
    const { radiusX, radiusY, cardWidth, isMobile } = config
    
    // If only 1 post, center it
    if (totalFiltered === 1) {
      return { x: 0, z: 0, scale: 1, rotateY: 0, opacity: 1, zIndex: 10, isActive: true }
    }
    
    // If 2 posts, side by side
    if (totalFiltered === 2) {
      const offset = index === 0 ? -1 : 1
      const x = offset * (cardWidth * 0.7)
      return { 
        x, 
        z: 0, 
        scale: 0.9, 
        rotateY: offset * -5, 
        opacity: 1, 
        zIndex: 10, 
        isActive: true 
      }
    }
    
    // If 3+ posts, use normal carousel with middle one active
    const activeFilteredIndex = filteredPosts.findIndex(p => blogPosts.indexOf(p) === activeIndex)
    let offset = index - activeFilteredIndex
    
    if (offset > totalFiltered / 2) offset -= totalFiltered
    if (offset < -totalFiltered / 2) offset += totalFiltered
    
    const angle = offset * (Math.PI / 6) 
    const x = Math.sin(angle) * radiusX
    const z = Math.cos(angle) * radiusY - radiusY
    const scale = 0.75 + (0.25 * ((z + radiusY) / radiusY))
    const rotateY = -offset * 15
    const opacity = 0.3 + (0.7 * ((z + radiusY) / radiusY))
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

  const handleMouseEnter = () => setIsAutoPlaying(false)
  const handleMouseLeave = () => setIsAutoPlaying(true)

  // Keyboard navigation
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

  // Reading progress and time left for modal
  useEffect(() => {
    if (!selectedPost) {
      setReadingProgress(0)
      setTimeLeft("")
      return
    }

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setReadingProgress(Math.min(100, Math.max(0, progress)))
      
      const totalMinutes = parseInt(selectedPost.readTime)
      const remaining = Math.ceil(totalMinutes * (1 - progress / 100))
      setTimeLeft(`${remaining} min left`)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [selectedPost])

  const toggleSave = (postId: number, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setSavedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    )
  }

  const handleClap = (postId: number, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setClaps(prev => ({
      ...prev,
      [postId]: (prev[postId] || 0) + 1
    }))
  }

  const sharePost = async (post: typeof blogPosts[0], e?: React.MouseEvent) => {
    e?.stopPropagation()
    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: `${typeof window !== 'undefined' ? window.location.href : ''}#blog-${post.id}`
    }
    
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      navigator.clipboard.writeText(shareData.url)
      alert('Link copied to clipboard')
    }
  }

  const getRelatedPosts = (currentPost: typeof blogPosts[0]) => {
    return blogPosts
      .filter(p => p.category === currentPost.category && p.id !== currentPost.id)
      .slice(0, 2)
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail("")
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  // Click any card to bring to center and open
  const handleCardClick = (post: typeof blogPosts[0], isActive: boolean) => {
    if (isActive) {
      setSelectedPost(post)
    } else {
      const postIndex = blogPosts.indexOf(post)
      setActiveIndex(postIndex)
      // Small delay then open
      setTimeout(() => setSelectedPost(post), 400)
    }
  }

  const currentPost = blogPosts[activeIndex]
  const isSaved = currentPost ? savedPosts.includes(currentPost.id) : false
  const currentClaps = currentPost ? claps[currentPost.id] || 0 : 0

  return (
    <>
      {/* Reading Progress Bar for Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 h-[2px] bg-foreground z-[60]"
            style={{ width: `${readingProgress}%` }}
          />
        )}
      </AnimatePresence>

      <section id="journal" className="relative h-screen w-full bg-background overflow-hidden flex items-center justify-center">
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
            className="text-center mb-6 md:mb-8"
          >
            <h2 className="text-4xl md:text-7xl font-serif italic text-foreground tracking-tight">
              The <span className="text-foreground/40 font-light">Journal</span>
            </h2>
            <div className="h-px w-12 bg-foreground/20 mx-auto mt-4" />
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 w-full max-w-md px-6"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-b border-foreground/20 py-2 pl-8 pr-4 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/40 text-foreground"
              />
              <svg className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </motion.div>

          {/* Category Filter Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex flex-wrap justify-center gap-2 px-6 max-w-4xl"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat)
                  setActiveIndex(0)
                }}
                className={`text-[9px] uppercase tracking-widest px-3 py-1.5 border transition-all duration-300 ${
                  selectedCategory === cat 
                    ? 'border-foreground bg-foreground text-background' 
                    : 'border-foreground/20 text-foreground/60 hover:border-foreground/40 hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
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
                    duration: 1.2,
                    ease: [0.19, 1, 0.22, 1],
                  }}
                >
                  <div className="relative w-full h-full bg-neutral-900 rounded-sm overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
                    <motion.div 
                      className="absolute inset-0"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6 }}
                    >
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${post.gradient} from-black/80 via-black/20 to-transparent`} />
                    </motion.div>

                    {/* Save Button */}
                    {style.isActive && (
                      <button
                        onClick={(e) => toggleSave(post.id, e)}
                        className="absolute top-4 right-4 z-20 p-2 bg-black/30 backdrop-blur-sm rounded-full hover:bg-black/50 transition-colors"
                      >
                        <svg 
                          className={`w-4 h-4 transition-colors ${isPostSaved ? 'text-red-400 fill-current' : 'text-white/70'}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    )}

                    <div className="absolute inset-0 p-6 flex flex-col justify-end text-white pb-10">
                      <motion.div
                        animate={{ y: style.isActive ? 0 : 20 }}
                        transition={{ duration: 0.8 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[9px] tracking-[0.3em] uppercase text-white/50 font-medium">
                            {post.category}
                          </span>
                          {style.isActive && (
                            <span className="text-[9px] text-white/40 flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              {post.views}
                            </span>
                          )}
                        </div>
                        
                        <h3 className="text-lg md:text-2xl font-serif italic mb-3 leading-tight [text-wrap:balance]">
                          {post.title}
                        </h3>
                        
                        <p className="text-[11px] text-white/70 line-clamp-2 font-light leading-relaxed mb-4">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                          <span className="text-[9px] tracking-widest uppercase text-white/40">{post.readTime}</span>
                          <div className="flex items-center gap-3">
                            {style.isActive && postClaps > 0 && (
                              <span className="text-[9px] text-white/60 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {postClaps}
                              </span>
                            )}
                            <span className="text-[9px] tracking-widest uppercase text-white/40 group-hover:text-white transition-colors flex items-center gap-2">
                              {style.isActive ? 'Read Story' : 'View'} <span className="text-sm">→</span>
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {style.isActive && filteredPosts.length > 2 && (
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
            }) : (
              <div className="text-center text-foreground/40 text-sm font-light">
                No stories found matching your criteria
              </div>
            )}
          </div>

          {/* Integrated Navigation Footer */}
          <div className="mt-20 flex flex-col items-center gap-10">
            <div className="flex items-center gap-12">
              <button 
                onClick={handlePrev} 
                disabled={filteredPosts.length <= 2}
                className={`group p-2 ${filteredPosts.length <= 2 ? 'opacity-30 cursor-not-allowed' : ''}`}
              >
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
                      onClick={() => filteredPosts.length > 2 && setActiveIndex(index)}
                      className={`relative h-[2px] overflow-hidden bg-foreground/10 transition-all duration-500 ${filteredPosts.length > 2 ? 'cursor-pointer' : ''}`}
                      style={{ width: isActive ? '60px' : '6px' }}
                    >
                      {isActive && filteredPosts.length > 2 && (
                        <motion.div 
                          initial={{ width: "0%" }}
                          animate={{ width: isAutoPlaying ? "100%" : "0%" }}
                          transition={{ 
                            duration: isAutoPlaying ? AUTO_PLAY_DURATION / 1000 : 0, 
                            ease: "linear" 
                          }}
                          key={activeIndex}
                          className="absolute inset-0 bg-foreground"
                        />
                      )}
                      {isActive && filteredPosts.length <= 2 && (
                        <div className="absolute inset-0 bg-foreground" />
                      )}
                    </div>
                  );
                })}
              </div>

              <button 
                onClick={handleNext} 
                disabled={filteredPosts.length <= 2}
                className={`group p-2 ${filteredPosts.length <= 2 ? 'opacity-30 cursor-not-allowed' : ''}`}
              >
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

        {/* Modal Overlay - FULL SECTION */}
        <AnimatePresence>
          {selectedPost && (
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 overflow-y-auto bg-background"
            >
              {/* Hero Section with Back Button */}
              <div className="relative h-[70vh] w-full">
                <img 
                  src={selectedPost.image} 
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background" />
                
                {/* Back Button */}
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="absolute top-6 left-6 z-50 flex items-center gap-3 px-4 py-2 bg-background/80 backdrop-blur-md rounded-sm border border-foreground/10 text-foreground hover:bg-background transition-all group"
                >
                  <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span className="text-[10px] uppercase tracking-widest font-bold">Back to Journal</span>
                </button>

                {/* Share & Save on Hero */}
                <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
                  <button 
                    onClick={() => toggleSave(selectedPost.id)}
                    className="p-3 bg-background/80 backdrop-blur-md rounded-sm border border-foreground/10 text-foreground hover:bg-background transition-all"
                  >
                    <svg 
                      className={`w-5 h-5 ${savedPosts.includes(selectedPost.id) ? 'text-red-400 fill-current' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => sharePost(selectedPost)}
                    className="p-3 bg-background/80 backdrop-blur-md rounded-sm border border-foreground/10 text-foreground hover:bg-background transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
                  <div className="max-w-4xl mx-auto">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-foreground/60 mb-4 block">
                      {selectedPost.category}
                    </span>
                    <h1 className="text-4xl md:text-7xl font-serif italic text-foreground mb-4">
                      {selectedPost.title}
                    </h1>
                    <div className="flex items-center gap-6 text-[10px] uppercase tracking-widest text-foreground/40">
                      <span>{selectedPost.readTime}</span>
                      <span>{selectedPost.views} reads</span>
                      <span>{selectedPost.date}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <div className="w-full max-w-4xl mx-auto px-6 py-16">
                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="space-y-16"
                >
                  {/* Quote Section */}
                  <div className="border-l-2 border-foreground/20 pl-8 py-4">
                    <p className="text-2xl md:text-3xl font-serif italic text-foreground/80 leading-relaxed">
                      "{selectedPost.excerpt}"
                    </p>
                  </div>

                  {/* Main Content */}
                  <div className="text-lg text-foreground/70 leading-relaxed font-light space-y-6">
                    {selectedPost.content.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="first-letter:text-5xl first-letter:font-serif first-letter:italic first-letter:float-left first-letter:mr-3 first-letter:mt-[-6px]">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Key Takeaways */}
                  <div className="bg-foreground/[0.02] border border-foreground/10 p-8 rounded-sm">
                    <h4 className="text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-6">Key Insights</h4>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-4 text-foreground/70 font-light">
                        <span className="w-1 h-1 bg-foreground/40 rounded-full mt-2.5 shrink-0" />
                        <span>Understanding the philosophy behind {selectedPost.category.toLowerCase()}</span>
                      </li>
                      <li className="flex items-start gap-4 text-foreground/70 font-light">
                        <span className="w-1 h-1 bg-foreground/40 rounded-full mt-2.5 shrink-0" />
                        <span>Practical applications for your own spaces</span>
                      </li>
                      <li className="flex items-start gap-4 text-foreground/70 font-light">
                        <span className="w-1 h-1 bg-foreground/40 rounded-full mt-2.5 shrink-0" />
                        <span>Expert perspectives from industry leaders</span>
                      </li>
                    </ul>
                  </div>

                  {/* Clap Section */}
                  <div className="text-center py-12 border-y border-foreground/10">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-6">
                      Did this resonate with you?
                    </p>
                    <motion.button 
                      onClick={() => handleClap(selectedPost.id)}
                      whileTap={{ scale: 1.1 }}
                      className="group inline-flex flex-col items-center gap-3"
                    >
                      <div className="w-20 h-20 rounded-full border-2 border-foreground/20 flex items-center justify-center group-hover:border-foreground/40 group-hover:bg-foreground/5 transition-all">
                        <svg className="w-10 h-10 text-foreground/60 group-hover:text-foreground transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-3xl font-serif italic text-foreground">{claps[selectedPost.id] || 0}</span>
                      <span className="text-[10px] uppercase tracking-widest text-foreground/40">Appreciations</span>
                    </motion.button>
                  </div>

                  {/* Author Section */}
                  <div className="flex items-start gap-6 py-8">
                    <img 
                      src={authors[selectedPost.author]?.avatar} 
                      alt={selectedPost.author}
                      className="w-20 h-20 rounded-full object-cover grayscale"
                    />
                    <div className="flex-1">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-1">Written by</p>
                      <h4 className="text-xl font-serif italic text-foreground mb-1">{selectedPost.author}</h4>
                      <p className="text-sm text-foreground/60 mb-3">{authors[selectedPost.author]?.role}</p>
                      <p className="text-sm text-foreground/50 font-light leading-relaxed">
                        {authors[selectedPost.author]?.bio}
                      </p>
                    </div>
                  </div>

                  {/* Related Posts */}
                  {getRelatedPosts(selectedPost).length > 0 && (
                    <div className="pt-8">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-8">Continue Reading</p>
                      <div className="grid md:grid-cols-2 gap-8">
                        {getRelatedPosts(selectedPost).map(related => (
                          <button
                            key={related.id}
                            onClick={() => {
                              setSelectedPost(related)
                              window.scrollTo(0, 0)
                            }}
                            className="group text-left"
                          >
                            <div className="aspect-[4/3] overflow-hidden rounded-sm mb-4">
                              <img src={related.image} alt={related.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" />
                            </div>
                            <span className="text-[9px] uppercase tracking-widest text-foreground/40">{related.category}</span>
                            <h4 className="font-serif italic text-xl mt-2 group-hover:text-foreground/70 transition-colors">{related.title}</h4>
                            <p className="text-sm text-foreground/50 mt-2 line-clamp-2 font-light">{related.excerpt}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Newsletter Signup */}
                <div className="mt-20 mb-12 p-12 bg-foreground/[0.02] border border-foreground/10 text-center">
                  <h3 className="text-3xl font-serif italic mb-4 text-foreground">Join The Inner Circle</h3>
                  <p className="text-foreground/60 mb-8 font-light max-w-md mx-auto">
                    Weekly insights on luxury design, delivered with intention. No spam, only inspiration.
                  </p>
                  {subscribed ? (
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-foreground font-serif italic text-lg"
                    >
                      Welcome to the circle. Check your inbox.
                    </motion.p>
                  ) : (
                    <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                      <input 
                        type="email" 
                        placeholder="Your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="flex-1 bg-transparent border-b border-foreground/20 py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/40 text-foreground text-center sm:text-left"
                      />
                      <button 
                        type="submit"
                        className="px-8 py-3 border border-foreground text-[10px] uppercase tracking-widest font-bold hover:bg-foreground hover:text-background transition-all"
                      >
                        Subscribe
                      </button>
                    </form>
                  )}
                </div>

                {/* Bottom Back Button */}
                <div className="text-center pb-12">
                  <button 
                    onClick={() => setSelectedPost(null)}
                    className="inline-flex items-center gap-3 text-foreground/40 hover:text-foreground transition-all group"
                  >
                    <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="text-[10px] uppercase tracking-widest font-bold">Back to All Stories</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  )
}