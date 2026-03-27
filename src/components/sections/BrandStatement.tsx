"use client"

import React, { useRef, useState, useEffect, useMemo } from 'react'
import { motion, useScroll, useTransform, AnimatePresence, useMotionValueEvent } from 'framer-motion'

// --- Types ---

interface StoryChapter {
  tag: string
  title:  string
  description: string
  img: string
}

// --- Constants ---

const STORY_CHAPTERS: StoryChapter[] = [
  {
    tag: "01. The Vision",
    title: "Artistry in Every Detail",
    description: "We believe that luxury isn't a price tag—it's a feeling. It's the way a room breathes before the first guest arrives.",
    img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200&h=800"
  },
  {
    tag: "02. The Craft",
    title: "Bespoke by Design",
    description: "Our curation process is intimate. We study your aesthetic to build structures that don't just occupy space, but command it.",
    img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200&h=800"
  },
  {
    tag: "03. The Moment",
    title: "Timed to Perfection",
    description: "From the first floral sculpture to the final toast, we manage the chaos so you can inhabit the magic.",
    img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=1200&h=800"
  }
]

const MOBILE_MULTIPLIER = 85
const DESKTOP_MULTIPLIER = 100
const EXTRA_SCROLL_SCREENS = 0.8 // Extra scroll space for last card to exit

// --- Utility Hooks ---

function useNavbarHeight() {
  const [navbarHeight, setNavbarHeight] = useState(0)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const findNavbar = () => {
      const selectors = [
        'nav', 'header', '[role="navigation"]', '.navbar', '.nav', 
        '#navbar', '.fixed.top-0', '.sticky.top-0',
      ]
      const navbar = selectors.map(s => document.querySelector(s)).find(el => el !== null)
      const height = navbar ? navbar.getBoundingClientRect().height : 80
      setNavbarHeight(height)
      setIsReady(true)
      document.documentElement.style.setProperty('--navbar-height', `${height}px`)
    }

    findNavbar()
    const observer = new ResizeObserver(findNavbar)
    const navbar = document.querySelector('nav') || document.querySelector('header')
    if (navbar) observer.observe(navbar)
    
    const mutationObserver = new MutationObserver(() => {
      if (!document.querySelector('nav') && !document.querySelector('header')) return
      findNavbar()
    })
    mutationObserver.observe(document.body, { childList: true, subtree: true })
    
    window.addEventListener('resize', findNavbar)
    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
      window.removeEventListener('resize', findNavbar)
    }
  }, [])

  return { navbarHeight, isReady }
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    const media = window.matchMedia(query)
    const update = () => setMatches(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [query])
  return matches
}

// --- Components ---

function NavbarSpacer() {
  return <div className="w-full bg-background" style={{ height: 'var(--navbar-height, 80px)' }} />
}

function ProgressIndicators({ count, activeIndex }: { count: number; activeIndex: number }) {
  return (
    <div className="flex justify-between items-center mb-6 gap-2">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="flex-1">
          <div className="h-[2px] bg-foreground/20 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-foreground"
              initial={false}
              animate={{ width: idx <= activeIndex ? '100%' : '0%' }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function ScrollHint({ isLast }: { isLast: boolean }) {
  return (
    <motion.div 
      className="flex justify-center mt-6"
      animate={{ y: [0, 5, 0] }}
      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
    >
      <div className="flex flex-col items-center gap-2">
        <span className="text-foreground/40 text-xs tracking-widest uppercase">
          {isLast ? 'Finish' : 'Scroll'}
        </span>
        <div className="w-5 h-8 border border-foreground/30 rounded-full flex justify-center">
          <motion.div 
            className="w-1 h-2 bg-foreground/60 rounded-full mt-1"
            animate={{ y: [0, 3, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          />
        </div>
      </div>
    </motion.div>
  )
}

// --- Mobile Version ---

function MobileStory({ navbarHeight }: { navbarHeight: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Map scroll progress to chapter index (only during the main scroll portion, not the extra buffer)
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Only count progress during the first (chapters/chapters+buffer) portion
    const effectiveProgress = Math.min(1, latest / (STORY_CHAPTERS.length / (STORY_CHAPTERS.length + 1)))
    const newIndex = Math.min(
      STORY_CHAPTERS.length - 1,
      Math.floor(effectiveProgress * STORY_CHAPTERS.length)
    )
    setActiveIndex(prev => prev !== newIndex ? newIndex : prev)
  })

  const currentChapter = STORY_CHAPTERS[activeIndex]

  return (
    <>
      <NavbarSpacer />
      <section 
        ref={containerRef} 
        className="relative bg-background" 
        style={{ height: `${(STORY_CHAPTERS.length + EXTRA_SCROLL_SCREENS) * MOBILE_MULTIPLIER}vh` }}
      >
        <div 
  className="h-screen sticky flex items-center justify-center overflow-hidden z-10" // Changed items-end to items-center
  style={{ top: 0 }} // Change navbarHeight to 0 to let it slide behind the nav if transparent
>
          <div className="absolute inset-0 z-0 bg-neutral-900">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                className="w-full h-full"
              >
                <img
                  src={currentChapter.img}
                  className="w-full h-full object-cover"
                  alt={currentChapter.title}
                  loading="eager"
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>

          <div className="relative z-10 w-full px-6 mb-8">
            <ProgressIndicators count={STORY_CHAPTERS.length} activeIndex={activeIndex} />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                className="bg-background/95 backdrop-blur-xl p-6 rounded-sm border-l-2 border-foreground shadow-2xl"
              >
                <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/60 block mb-2">
                  {currentChapter.tag}
                </span>
                <h3 className="text-2xl font-serif italic mb-3 leading-tight text-foreground">
                  {currentChapter.title}
                </h3>
                <p className="text-sm font-light leading-relaxed text-foreground/80">
                  {currentChapter.description}
                </p>
              </motion.div>
            </AnimatePresence>

            <ScrollHint isLast={activeIndex === STORY_CHAPTERS.length - 1} />
          </div>
        </div>
      </section>
    </>
  )
}

// --- Desktop Version ---

function DesktopStory({ navbarHeight }: { navbarHeight: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Create image progress that completes during the main scroll portion (not the extra buffer)
  // This ensures all 3 images cycle through during the first ~78% of scroll, then hold on last image
  const imageProgress = useTransform(
    scrollYProgress,
    [0, STORY_CHAPTERS.length / (STORY_CHAPTERS.length + EXTRA_SCROLL_SCREENS), 1],
    [0, 1, 1]
  )

  // For tracking which text card is active
  const [activeIndex, setActiveIndex] = useState(0)
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const effectiveProgress = Math.min(1, latest / (STORY_CHAPTERS.length / (STORY_CHAPTERS.length + EXTRA_SCROLL_SCREENS)))
    const newIndex = Math.min(
      STORY_CHAPTERS.length - 1,
      Math.floor(effectiveProgress * STORY_CHAPTERS.length)
    )
    setActiveIndex(prev => prev !== newIndex ? newIndex : prev)
  })

  const containerScale = useTransform(scrollYProgress, [0, 0.9, 1], [1, 1, 0.95])

  return (
    <>
      <NavbarSpacer />
      <section 
        ref={containerRef} 
        className="relative bg-background" 
        style={{ height: `${(STORY_CHAPTERS.length + EXTRA_SCROLL_SCREENS) * DESKTOP_MULTIPLIER}vh` }}
      >
        {/* Sticky Image Container */}
        <div 
          className="sticky top-0 w-full flex items-center justify-center overflow-hidden z-10" 
          style={{ 
            top: 'var(--navbar-height, 80px)', 
            height: 'calc(100vh - var(--navbar-height, 80px))' 
          }}
        >
          <motion.div 
            style={{ scale: containerScale }} 
            className="relative w-full flex items-center justify-center py-16"
          >
            <div className="relative w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] aspect-[16/9] shadow-2xl bg-neutral-900 overflow-hidden rounded-sm">
              {STORY_CHAPTERS.map((chapter, i) => {
                const segmentSize = 1 / STORY_CHAPTERS.length
                const start = i * segmentSize
                const end = (i + 1) * segmentSize
                
                // Crossfade: each image visible during its segment, fading at edges
                const fadeRange = 0.08 // 8% overlap for fade
                
                let opacityRange: number[]
                let opacityValues: number[]
                
                if (i === 0) {
                  opacityRange = [0, start, end - fadeRange, end]
                  opacityValues = [1, 1, 1, 0]
                } else if (i === STORY_CHAPTERS.length - 1) {
                  opacityRange = [start, start + fadeRange, end, 1]
                  opacityValues = [0, 1, 1, 1]
                } else {
                  opacityRange = [start, start + fadeRange, end - fadeRange, end]
                  opacityValues = [0, 1, 1, 0]
                }
                
                const opacity = useTransform(imageProgress, opacityRange, opacityValues)
                const scale = useTransform(
                  imageProgress,
                  opacityRange,
                  i === 0 ? [1, 1, 1, 1.05] : i === STORY_CHAPTERS.length - 1 ? [1.05, 1, 1, 1] : [1.05, 1, 1, 1.05]
                )
                
                return (
                  <motion.div 
                    key={i}
                    style={{ opacity, scale }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <img
                      src={chapter.img}
                      className="w-full h-full object-cover object-center"
                      alt=""
                      loading="eager"
                    />
                  </motion.div>
                )
              })}
              <div className="absolute inset-0 bg-black/20 pointer-events-none" />
            </div>
          </motion.div>
        </div>

        {/* Scrolling Text Cards */}
        <div className="relative z-20 pointer-events-none">
          {STORY_CHAPTERS.map((chapter, i) => (
            <div key={i} className="h-screen flex items-center px-4 sm:px-6 md:px-24 pointer-events-auto">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ 
                  margin: i === STORY_CHAPTERS.length - 1 ? "-40% 0px 0px 0px" : "-10% 0px -10% 0px", 
                  once: false 
                }}
                transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1], delay: 0.1 }}
                className="w-full sm:max-w-lg md:max-w-xl bg-background/95 dark:bg-background/90 backdrop-blur-md p-6 sm:p-8 md:p-12 border-l-2 border-foreground shadow-2xl text-foreground"
              >
                <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.5em] text-foreground/60 dark:text-foreground/50 block mb-3 sm:mb-4">
                  {chapter.tag}
                </span>
                <h3 className="text-3xl sm:text-4xl md:text-6xl font-serif italic mb-4 sm:mb-6 leading-tight text-foreground">
                  {chapter.title}
                </h3>
                <p className="text-base sm:text-lg md:text-xl font-light leading-relaxed text-foreground/80">
                  {chapter.description}
                </p>
              </motion.div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

// --- Main Export ---

export default function Story() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const { navbarHeight, isReady } = useNavbarHeight()

  if (!isReady) {
    return <div className="h-screen bg-background" />
  }

  // Simple fallback for reduced motion
  if (prefersReducedMotion) {
    return (
      <>
        <NavbarSpacer />
        <section className="relative bg-background py-20">
          <div className="max-w-6xl mx-auto px-6 space-y-32">
            {STORY_CHAPTERS.map((chapter, i) => (
              <div key={i} className="grid md:grid-cols-2 gap-12 items-center">
                <div className={i % 2 === 1 ? 'md:order-2' : ''}>
                  <div className="aspect-[16/9] bg-neutral-900 rounded-sm overflow-hidden">
                    <img src={chapter.img} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                </div>
                <div className={i % 2 === 1 ? 'md:order-1' : ''}>
                  <span className="text-[10px] uppercase tracking-[0.5em] text-foreground/60 block mb-4">
                    {chapter.tag}
                  </span>
                  <h3 className="text-4xl md:text-5xl font-serif italic mb-6 leading-tight">
                    {chapter.title}
                  </h3>
                  <p className="text-lg font-light leading-relaxed text-foreground/80">
                    {chapter.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </>
    )
  }

  return isMobile ? (
    <MobileStory navbarHeight={navbarHeight} />
  ) : (
    <DesktopStory navbarHeight={navbarHeight} />
  )
}