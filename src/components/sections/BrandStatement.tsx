"use client"

import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'

const storyChapters = [
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

export default function Story() {
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [navbarHeight, setNavbarHeight] = useState(0)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Get navbar height
  useEffect(() => {
    const findNavbar = () => {
      // Try to find navbar by common selectors
      const possibleNavbars = [
        document.querySelector('nav'),
        document.querySelector('header'),
        document.querySelector('[role="navigation"]'),
        document.querySelector('.navbar'),
        document.querySelector('.nav'),
        document.querySelector('#navbar'),
        // Add any specific class your navbar might use
        document.querySelector('.fixed.top-0'), // Common for fixed navbars
        document.querySelector('.sticky.top-0'), // Common for sticky navbars
      ]
      
      const navbar = possibleNavbars.find(el => el !== null)
      if (navbar) {
        setNavbarHeight(navbar.getBoundingClientRect().height)
      } else {
        // Default fallback height if navbar not found
        setNavbarHeight(80)
      }
    }

    findNavbar()
    
    // Resize observer to handle navbar height changes
    const resizeObserver = new ResizeObserver(() => {
      findNavbar()
    })

    const navbar = document.querySelector('nav') || document.querySelector('header')
    if (navbar) {
      resizeObserver.observe(navbar)
    }

    window.addEventListener('resize', findNavbar)
    
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', findNavbar)
    }
  }, [])

  // Preload images
  useEffect(() => {
    let loadedCount = 0
    storyChapters.forEach((chapter) => {
      const img = new Image()
      img.src = chapter.img
      img.onload = () => {
        loadedCount++
        if (loadedCount === storyChapters.length) {
          setImagesLoaded(true)
        }
      }
    })
  }, [])

  // Always call useScroll (can't conditionally call hooks)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const containerScale = useTransform(scrollYProgress, [0, 0.9, 1], [1, 1, 0.95])

  // Mobile scroll handler
  useEffect(() => {
    if (!isMobile || !containerRef.current) return

    const handleScroll = () => {
      const element = containerRef.current
      if (!element) return

      const rect = element.getBoundingClientRect()
      const scrollTop = window.scrollY - rect.top
      const sectionHeight = element.offsetHeight
      const viewportHeight = window.innerHeight
      
      // Calculate progress through the section
      const scrollProgress = Math.min(1, Math.max(0, scrollTop / (sectionHeight - viewportHeight)))
      
      const newIndex = Math.min(
        storyChapters.length - 1,
        Math.floor(scrollProgress * storyChapters.length)
      )
      setActiveIndex(newIndex)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Call once to set initial index
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobile])

  // Mobile Version - Completely different experience
  if (isMobile) {
    return (
      <>
        {/* Invisible spacer that matches theme */}
        <div style={{ height: navbarHeight }} className="w-full bg-background" />
        <section ref={containerRef} className="relative bg-background">
          {/* Hero Image at top */}
          <div className="h-screen sticky top-0 flex items-end justify-center pb-20 overflow-hidden" style={{ top: navbarHeight }}>
            <div className="absolute inset-0 z-0">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeIndex}
                  src={storyChapters[activeIndex].img}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: imagesLoaded ? 1 : 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full h-full object-cover"
                  alt="Story background"
                  loading="eager"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            </div>

            {/* Progress indicators */}
            <div className="relative z-10 w-full px-6 mb-8">
              <div className="flex justify-between items-center mb-6 gap-1">
                {storyChapters.map((_, idx) => (
                  <div key={idx} className="flex-1">
                    <motion.div 
                      className="h-[2px] bg-foreground/20 rounded-full overflow-hidden"
                      initial={false}
                    >
                      <motion.div 
                        className="h-full bg-foreground"
                        animate={{ 
                          width: idx === activeIndex ? '100%' : 
                                 idx < activeIndex ? '100%' : '0%' 
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>
                  </div>
                ))}
              </div>

              {/* Active card */}
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: imagesLoaded ? 1 : 0, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                className="bg-background/95 backdrop-blur-xl p-8 rounded-sm border-l-2 border-foreground shadow-2xl"
              >
                <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/60 block mb-3">
                  {storyChapters[activeIndex].tag}
                </span>
                <h3 className="text-3xl font-serif italic mb-4 leading-tight text-foreground">
                  {storyChapters[activeIndex].title}
                </h3>
                <p className="text-base font-light leading-relaxed text-foreground/80">
                  {storyChapters[activeIndex].description}
                </p>
              </motion.div>

              {/* Scroll indicator */}
              <motion.div 
                className="flex justify-center mt-8"
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-foreground/40 text-xs tracking-widest">
                    {activeIndex === storyChapters.length - 1 ? 'FINISH' : 'CONTINUE'}
                  </span>
                  <div className="w-5 h-10 border border-foreground/30 rounded-full flex justify-center">
                    <motion.div 
                      className="w-1 h-2 bg-foreground/60 rounded-full mt-2"
                      animate={{ y: [0, 4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Spacer for scroll height - ensures we have enough scroll to cycle through all chapters */}
          <div style={{ height: `${(storyChapters.length) * 100}vh` }} />
        </section>
      </>
    )
  }

  // Desktop Version - Keep original with navbar offset
  return (
    <>
      {/* Invisible spacer that matches theme */}
      <div style={{ height: navbarHeight }} className="w-full bg-background" />
      <section ref={containerRef} className="relative h-[400vh] bg-background">
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden" style={{ top: navbarHeight }}>
          <motion.div 
            style={{ scale: containerScale }} 
            className="relative w-full h-full flex items-center justify-center"
          >
            <div className="relative w-[95%] sm:w-[90%] md:w-[80%] lg:w-[70%] aspect-[3/4] sm:aspect-[4/3] md:aspect-[16/9] shadow-2xl bg-neutral-900 overflow-hidden rounded-sm">
              {storyChapters.map((chapter, i) => {
                const segment = 1 / (storyChapters.length + 1)
                const start = i * segment
                const end = (i + 1) * segment
                
                return (
                  <ChapterImage 
                    key={`chapter-img-${i}`} 
                    img={chapter.img} 
                    progress={scrollYProgress} 
                    range={[start, end]} 
                  />
                )
              })}
              <div className="absolute inset-0 bg-black/20 pointer-events-none" />
            </div>
          </motion.div>
        </div>

        <div className="relative z-20">
          {storyChapters.map((chapter, i) => (
            <div key={`chapter-text-${i}`} className="h-screen flex items-center px-4 sm:px-6 md:px-24">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ margin: "-15% 0px -15% 0px", once: false }}
                transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
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
          <div className="h-screen pointer-events-none" />
        </div>
      </section>
    </>
  )
}

function ChapterImage({ img, progress, range }: { img: string; progress: any; range: [number, number] }) {
  const opacity = useTransform(
    progress, 
    [
      Math.max(0, range[0] - 0.1), 
      range[0], 
      range[1], 
      Math.min(1, range[1] + 0.1)
    ], 
    [0, 1, 1, 0]
  )
  
  const scale = useTransform(
    progress,
    [
      Math.max(0, range[0] - 0.1),
      range[0],
      range[1],
      Math.min(1, range[1] + 0.1)
    ],
    [1.1, 1, 1, 1.1]
  )
  
  return (
    <motion.div 
      style={{ opacity, scale }}
      className="absolute inset-0 w-full h-full"
    >
      <img
        src={img}
        className="w-full h-full object-cover object-center grayscale-[20%] hover:grayscale-0 transition-all duration-1000"
        alt="Story"
        loading="eager"
      />
    </motion.div>
  )
}