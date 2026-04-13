"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, Calendar, Check, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { sendChecklistEmail } from '@/app/actions/email'

const gold = {
  light:    '#D4AF37',
  metallic: 'linear-gradient(135deg, #D4AF37 0%, #FFF2A8 50%, #D4AF37 100%)',
  shadow:   'rgba(212, 175, 55, 0.22)',
  glow:     'rgba(212, 175, 55, 0.08)',
  border:   'rgba(212, 175, 55, 0.25)',
}

const CHECKLIST_HIGHLIGHTS = [
  '12-month planning timeline',
  'Budget allocation calculator',
  'Questions to ask your florist',
  'Day-of emergency kit list',
]

export default function ExitIntentPopup() {
  const [isOpen,    setIsOpen]    = useState(false)
  const [step,      setStep]      = useState<'form' | 'success'>('form')
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [form,      setForm]      = useState({ name: '', email: '', date: '' })
  const [triggered, setTriggered] = useState(false)

  const supabase = createClient()

  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate  = tomorrow.toISOString().split('T')[0]

  // ── Smart trigger: only fire if user has shown wedding intent ──
  useEffect(() => {
    // Check if already shown this session
    if (sessionStorage.getItem('exitPopupShown')) return

    // Check for wedding intent flag (set by WeddingPageTracker on quote pages)
    const hasWeddingIntent = sessionStorage.getItem('hasWeddingIntent') === 'true'
    if (!hasWeddingIntent) return

    // Function to show popup (called from multiple triggers)
    const showExitPopup = () => {
      if (triggered || isOpen) return
      
      setIsOpen(true)
      setTriggered(true)
      sessionStorage.setItem('exitPopupShown', 'true')
    }

    let mouseLeaveTimer: NodeJS.Timeout

    // TRIGGER 1: Mouse leaving from top of viewport
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY > 0) return      // Only trigger from top
      mouseLeaveTimer = setTimeout(showExitPopup, 100)
    }

    // TRIGGER 2: Page visibility change (e.g., switching tabs)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        showExitPopup()
      }
    }

    // TRIGGER 3: Before page unload (back button, link click, etc.)
    const handleBeforeUnload = () => {
      showExitPopup()
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      clearTimeout(mouseLeaveTimer)
    }
  }, [triggered, isOpen])

  // ── Esc to close ──
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false) }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  // ── Prevent body scroll when open ──
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error: dbError } = await supabase.from('leads').insert([{
        name:       form.name.trim(),
        email:      form.email.trim(),
        event_date: form.date || null,
        event_type: 'wedding',
        source:     'exit_intent_popup',
        status:     'new',
        notes:      `Exit intent capture${form.date ? ` | Wedding: ${form.date}` : ''}`,
      }])
      if (dbError) throw dbError

      await sendChecklistEmail(form.email.trim(), form.name.trim())
      setStep('success')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
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
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[300]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[301] w-[92%] max-w-[460px]"
          >
            <div
              className="rounded-2xl overflow-hidden shadow-2xl"
              style={{ background: 'rgba(8,6,0,0.97)', border: `1px solid ${gold.border}` }}
            >
              {/* Gold top rule */}
              <div className="h-px w-full" style={{ background: gold.metallic }} />

              {/* Close */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-white/8"
                style={{ border: `1px solid rgba(255,255,255,0.1)` }}
              >
                <X size={13} className="text-white/50" />
              </button>

              <AnimatePresence mode="wait">
                {step === 'form' ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  >
                    {/* Hero strip */}
                    <div
                      className="relative px-6 pt-8 pb-6 text-center"
                      style={{ background: `radial-gradient(ellipse at top, ${gold.glow} 0%, transparent 70%)` }}
                    >
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4" style={{ background: gold.glow, border: `1px solid ${gold.border}` }}>
                        <Sparkles size={10} style={{ color: gold.light }} />
                        <span className="text-[9px] uppercase tracking-[0.3em]" style={{ color: gold.light }}>
                          Free resource — no catch
                        </span>
                      </div>

                      <h2 className="text-xl md:text-2xl font-light text-white leading-tight mb-2">
                        One thing before you go.
                      </h2>
                      <p className="text-sm text-white/55 leading-relaxed">
                        We've helped 500+ couples plan their weddings. This checklist is the exact tool we use internally — yours free.
                      </p>
                    </div>

                    {/* Checklist highlights */}
                    <div className="px-6 pb-5">
                      <div className="grid grid-cols-2 gap-2 mb-5">
                        {CHECKLIST_HIGHLIGHTS.map((item, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <Check size={11} className="mt-0.5 flex-shrink-0" style={{ color: gold.light }} />
                            <span className="text-xs text-white/55 leading-snug">{item}</span>
                          </div>
                        ))}
                      </div>

                      {/* Form */}
                      {error && (
                        <div className="mb-3 px-3 py-2 rounded-xl text-xs text-red-400 border border-red-500/20 bg-red-500/8">{error}</div>
                      )}

                      <form onSubmit={handleSubmit} className="space-y-3">
                        <input
                          type="text"
                          required
                          placeholder="Your Name"
                          value={form.name}
                          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none transition-colors"
                          style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid rgba(255,255,255,0.09)` }}
                        />
                        <input
                          type="email"
                          required
                          placeholder="Email Address"
                          value={form.email}
                          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none transition-colors"
                          style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid rgba(255,255,255,0.09)` }}
                        />
                        <div className="relative">
                          <Calendar size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                          <input
                            type="date"
                            min={minDate}
                            value={form.date}
                            onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                            className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none transition-colors ${form.date ? 'text-white' : 'text-white/30'}`}
                            style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid rgba(255,255,255,0.09)` }}
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-[10px] uppercase tracking-widest font-bold text-black disabled:opacity-50"
                          style={{ background: gold.metallic, boxShadow: `0 6px 24px ${gold.shadow}` }}
                        >
                          {loading ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full" />
                          ) : (
                            <><Download size={13} /> Send Me the Checklist</>
                          )}
                        </button>
                      </form>

                      <p className="text-[8px] text-white/25 text-center mt-3">
                        No spam. Unsubscribe anytime. Your details are kept private.
                      </p>
                    </div>

                    {/* Dismiss link */}
                    <div className="text-center pb-5">
                      <button
                        onClick={handleClose}
                        className="text-[9px] text-white/25 hover:text-white/45 transition-colors uppercase tracking-wider"
                      >
                        No thanks, I'll plan without it
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  // ── Success state ──
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                    className="px-6 py-10 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
                      className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center"
                      style={{ background: gold.metallic }}
                    >
                      <Check size={20} style={{ color: '#1a1400' }} />
                    </motion.div>

                    <h3 className="text-xl font-light text-white mb-2">Check your inbox!</h3>
                    <p className="text-sm text-white/50 mb-2 leading-relaxed">
                      Your checklist is on its way to{' '}
                      <strong className="text-white/75">{form.email}</strong>.
                    </p>
                    <p className="text-xs text-white/35 mb-7">
                      While you wait — see exactly how much your wedding décor would cost.
                    </p>

                    <div className="space-y-2.5">
                      <Link
                        href="/quote"
                        onClick={handleClose}
                        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full text-[10px] uppercase tracking-widest font-bold text-black"
                        style={{ background: gold.metallic, boxShadow: `0 4px 20px ${gold.shadow}` }}
                      >
                        Get Your Instant Quote <ArrowRight size={11} />
                      </Link>
                      <button
                        onClick={handleClose}
                        className="w-full py-3 rounded-full text-[9px] uppercase tracking-wider text-white/35 hover:text-white/55 transition-colors border"
                        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
                      >
                        Close
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}