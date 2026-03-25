"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > window.innerHeight * 0.5)
    }
    window.addEventListener('scroll', toggleVisibility, { passive: true })
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 md:bottom-12 md:right-12 group"
          aria-label="Back to top"
        >
          {/* Mobile: Small minimal circle */}
          <div className="md:hidden relative w-10 h-10 flex items-center justify-center">
            <motion.div
              className="absolute inset-0 rounded-full border border-foreground/20 bg-background/80 backdrop-blur-sm"
              whileTap={{ scale: 0.95 }}
            />
            <motion.div
              className="absolute inset-0 rounded-full bg-foreground"
              initial={{ scale: 0 }}
              whileHover={{ scale: 1 }}
              transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
            />
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="relative z-10 text-foreground group-hover:text-background transition-colors duration-300"
            >
              <path d="M12 20V4M5 11l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Desktop: Elegant vertical line */}
          <div className="hidden md:flex flex-col items-center gap-3">
            <motion.div
              className="w-[1px] h-12 bg-foreground/30 origin-bottom"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1], delay: 0.1 }}
            />
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-foreground/60 group-hover:text-foreground transition-colors duration-500"
            >
              <path d="M12 20V4M5 11l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <motion.div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[1px] bg-foreground origin-top"
              initial={{ height: 0 }}
              whileHover={{ height: 20 }}
              transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
            />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  )
}