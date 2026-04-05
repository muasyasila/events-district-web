"use client"

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, Sparkles, Calendar, Heart, ArrowRight, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { sendChecklistEmail } from '@/app/actions/email'

export default function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [weddingDate, setWeddingDate] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [hasShown, setHasShown] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  // Get tomorrow's date for min date attribute
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  // Check if popup has been shown in this session
  useEffect(() => {
    const popupShown = sessionStorage.getItem('exitPopupShown')
    if (popupShown) {
      setHasShown(true)
    }
  }, [])

  // Exit intent detection
  useEffect(() => {
    let mouseLeaveTimeout: NodeJS.Timeout

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse leaves the window from the top (cursor goes to address bar)
      if (e.clientY <= 0 && !hasShown && !isOpen && !isSuccess) {
        mouseLeaveTimeout = setTimeout(() => {
          setIsOpen(true)
          sessionStorage.setItem('exitPopupShown', 'true')
          setHasShown(true)
        }, 100)
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
      clearTimeout(mouseLeaveTimeout)
    }
  }, [hasShown, isOpen, isSuccess])

  // Handle escape key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Save to Supabase leads table
      const { error: dbError } = await supabase
        .from('leads')
        .insert([{
          name: name.trim(),
          email: email.trim(),
          event_date: weddingDate || null,
          event_type: 'wedding',
          source: 'exit_intent_popup',
          status: 'new',
          notes: `Captured via exit intent popup${weddingDate ? ` - Wedding Date: ${weddingDate}` : ''}`
        }])

      if (dbError) {
        console.error('Database error:', dbError)
        setError('Something went wrong. Please try again.')
        setIsLoading(false)
        return
      }

      // Send welcome email with checklist
      const emailResult = await sendChecklistEmail(email.trim(), name.trim())
      
      if (!emailResult.success) {
        console.error('Email error:', emailResult.error)
      }

      setIsSuccess(true)
      
      // Close popup after 3 seconds on success
      setTimeout(() => {
        setIsOpen(false)
        setIsSuccess(false)
        setEmail('')
        setName('')
        setWeddingDate('')
      }, 3000)
      
    } catch (err) {
      console.error('Error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200]"
          />
          
          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[201] w-[90%] max-w-md"
          >
            <div className="bg-background border border-foreground/10 rounded-2xl overflow-hidden shadow-2xl">
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-foreground/10 hover:bg-foreground/20 transition-colors text-foreground/60 hover:text-foreground"
              >
                <X size={16} />
              </button>

              {!isSuccess ? (
                <>
                  {/* Header */}
                  <div className="relative h-32 bg-gradient-to-r from-foreground/10 to-foreground/5 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-foreground/20 backdrop-blur-sm rounded-full mb-2">
                          <Sparkles className="w-3 h-3 text-foreground/80" />
                          <span className="text-[8px] uppercase tracking-[0.2em] text-foreground/80 font-medium">
                            Free Download
                          </span>
                        </div>
                        <h3 className="text-xl font-serif italic text-foreground">
                          Wait! Don't Go Empty-Handed
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-sm text-foreground/70 text-center mb-4">
                      Get our <strong>Ultimate Wedding Planning Checklist</strong> — absolutely free.
                      <span className="block text-xs text-foreground/50 mt-1">Used by 2,000+ happy couples</span>
                    </p>

                    <div className="flex items-center justify-center gap-4 mb-5">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle size={12} className="text-green-500" />
                        <span className="text-[10px] text-foreground/50">12-Month Timeline</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle size={12} className="text-green-500" />
                        <span className="text-[10px] text-foreground/50">Budget Calculator</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle size={12} className="text-green-500" />
                        <span className="text-[10px] text-foreground/50">Vendor Checklist</span>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                      <input
                        type="text"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 bg-foreground/5 border border-foreground/10 rounded-lg text-sm text-foreground focus:outline-none focus:border-foreground/30 transition-colors placeholder:text-foreground/40"
                      />
                      <input
                        type="email"
                        placeholder="Your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 bg-foreground/5 border border-foreground/10 rounded-lg text-sm text-foreground focus:outline-none focus:border-foreground/30 transition-colors placeholder:text-foreground/40"
                      />
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                        <input
                          type="date"
                          min={minDate}
                          value={weddingDate}
                          onChange={(e) => setWeddingDate(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 bg-foreground/5 border border-foreground/10 rounded-lg text-sm text-foreground focus:outline-none focus:border-foreground/30 transition-colors"
                          placeholder="Wedding date (optional)"
                        />
                      </div>
                      
                      {error && (
                        <p className="text-xs text-red-400">{error}</p>
                      )}
                      
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2.5 bg-foreground text-background text-[11px] uppercase tracking-wider font-bold rounded-full hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                              className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full"
                            />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <Download size={14} />
                            <span>Get Free Checklist</span>
                          </>
                        )}
                      </button>
                    </form>

                    <p className="text-[8px] text-foreground/30 text-center mt-4">
                      No spam. Unsubscribe anytime. We respect your privacy.
                    </p>
                  </div>
                </>
              ) : (
                // Success state
                <div className="p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4"
                  >
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </motion.div>
                  <h3 className="text-xl font-serif italic text-foreground mb-2">
                    Check Your Inbox!
                  </h3>
                  <p className="text-sm text-foreground/60">
                    Your wedding planning checklist is on its way to <strong>{email}</strong>
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-foreground/40">
                    <Heart size={12} />
                    <span>You're one step closer to your dream wedding</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}