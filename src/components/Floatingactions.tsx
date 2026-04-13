"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Phone, ArrowUp, MessageCircle, Calculator, Calendar } from 'lucide-react'
import Link from 'next/link'

// ─── Config ───────────────────────────────────────────────────────────────────
const WHATSAPP_NUMBER = "254768842000"
const PHONE_NUMBER    = "+254768842000"

const gold = {
  light:    '#D4AF37',
  metallic: 'linear-gradient(135deg, #D4AF37 0%, #FFF2A8 50%, #D4AF37 100%)',
  shadow:   'rgba(212, 175, 55, 0.28)',
  glow:     'rgba(212, 175, 55, 0.10)',
  border:   'rgba(212, 175, 55, 0.28)',
}

// Wedding-specific quick replies that push toward conversion
const QUICK_REPLIES = [
  { label: "Get wedding quote",   msg: "Hi! I'd like to get a quote for my wedding décor. Can you help?" },
  { label: "Check availability",  msg: "Hello! I'd like to check your availability for my event date." },
  { label: "See packages",        msg: "What décor packages do you offer? I'd love to see pricing." },
  { label: "Book consultation",   msg: "I'd like to book a free consultation. When are you available?" },
]

// ─── WhatsApp SVG icon ────────────────────────────────────────────────────────
function WhatsAppIcon({ size = 22, className = '' }: { size?: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className}>
      <path d="M12.032 2.002c-5.514 0-9.99 4.476-9.99 9.99 0 1.75.454 3.478 1.318 5.003l-1.326 3.902 4.08-1.24c1.425.744 3.04 1.138 4.694 1.138 5.514 0 9.99-4.476 9.99-9.99 0-5.514-4.476-9.99-9.99-9.99zm4.81 12.464c-.1.284-.364.592-.664.68-.3.088-1.728.614-1.99.684-.262.07-.456.105-.662-.098-.204-.204-.784-.784-.96-.942-.178-.158-.316-.18-.474-.06-.158.12-.664.472-.848.57-.184.098-.31.15-.474-.048-.164-.198-.692-.82-.946-1.164-.254-.344-.544-.844-.166-.944.38-.1.646-.376.884-.64.238-.264.318-.454.476-.752.16-.298.08-.56-.044-.786-.124-.226-.652-1.476-.894-2.01-.232-.516-.47-.454-.646-.464-.176-.01-.38-.016-.586-.016-.206 0-.54.078-.822.39-.282.312-1.078 1.052-1.078 2.568 0 1.516 1.104 2.98 1.258 3.186.154.206 2.166 3.364 5.226 4.54.73.28 1.302.446 1.746.57.734.23 1.404.198 1.932.12.592-.09 1.822-.744 2.078-1.462.256-.718.256-1.334.18-1.462-.076-.128-.28-.204-.58-.33z" />
    </svg>
  )
}

// ─── Back to top button ───────────────────────────────────────────────────────
function BackToTop({ show }: { show: boolean }) {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.25, ease: [0.19, 1, 0.22, 1] }}
          onClick={scrollToTop}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 rounded-full flex items-center justify-center border backdrop-blur-md transition-colors hover:bg-foreground/5"
          style={{
            background: 'rgba(10,10,10,0.75)',
            borderColor: gold.border,
          }}
          aria-label="Back to top"
        >
          <ArrowUp size={14} style={{ color: gold.light }} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function FloatingActions() {
  const [isOpen,        setIsOpen]        = useState(false)
  const [message,       setMessage]       = useState('')
  const [showNotif,     setShowNotif]     = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)
  const btnRef   = useRef<HTMLButtonElement>(null)

  // Back-to-top visibility
  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 500)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Show notification bubble after 12s if popup not opened
  useEffect(() => {
    const t = setTimeout(() => {
      if (!isOpen) {
        setShowNotif(true)
        setTimeout(() => setShowNotif(false), 6000)
      }
    }, 12000)
    return () => clearTimeout(t)
  }, [isOpen])

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        isOpen &&
        popupRef.current  && !popupRef.current.contains(e.target as Node) &&
        btnRef.current    && !btnRef.current.contains(e.target as Node)
      ) setIsOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen])

  // Esc to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const openWhatsApp = (msg: string) => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank')
    setIsOpen(false)
    setMessage('')
  }

  const handleCall = () => {
    window.location.href = `tel:${PHONE_NUMBER}`
    setIsOpen(false)
  }

  return (
    <>
      {/* ── Floating cluster — bottom right ── */}
      {/* Layout (bottom to top): WhatsApp FAB → Back-to-top → Popup */}
      <div className="fixed bottom-6 right-5 z-50 flex flex-col items-center gap-2.5">

        {/* Back to top — sits above WhatsApp, never overlaps */}
        <BackToTop show={showBackToTop} />

        {/* WhatsApp notification bubble */}
        <AnimatePresence>
          {showNotif && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 16, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 16, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-16 right-0 w-52 px-4 py-3 rounded-2xl rounded-br-none text-sm shadow-xl"
              style={{ background: 'rgba(15,15,15,0.95)', border: `1px solid ${gold.border}` }}
            >
              <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: gold.light }}>
                💬 Quick question?
              </p>
              <p className="text-xs text-white/70 leading-snug">
                Chat with us on WhatsApp — we reply in minutes.
              </p>
              {/* Arrow */}
              <div
                className="absolute -bottom-2 right-4 w-3 h-3 rotate-45"
                style={{ background: gold.border, borderRight: `1px solid ${gold.border}`, borderBottom: `1px solid ${gold.border}` }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* WhatsApp FAB */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 20 }}
        >
          <motion.button
            ref={btnRef}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => { setIsOpen(o => !o); setShowNotif(false) }}
            className="relative w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-colors"
            style={{
              background: isOpen
                ? 'rgba(20,16,0,0.95)'
                : 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
              border:     `2px solid ${isOpen ? gold.border : 'transparent'}`,
              boxShadow:  isOpen
                ? `0 0 20px ${gold.shadow}`
                : '0 8px 32px rgba(37,211,102,0.35)',
            }}
            aria-label={isOpen ? 'Close chat' : 'Open WhatsApp chat'}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X size={22} style={{ color: gold.light }} />
                </motion.div>
              ) : (
                <motion.div key="wa" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <WhatsAppIcon size={24} className="text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </div>

      {/* ── Chat popup — positioned just to the left of the FAB cluster ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={popupRef}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.19, 1, 0.22, 1] }}
            className="fixed bottom-24 right-5 z-50 w-[340px] max-w-[calc(100vw-2rem)] rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: 'rgba(10,8,0,0.97)',
              border:     `1px solid ${gold.border}`,
              boxShadow:  `0 24px 60px rgba(0,0,0,0.6), 0 0 40px ${gold.shadow}`,
            }}
          >
            {/* Gold top rule */}
            <div className="h-px w-full" style={{ background: gold.metallic }} />

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
                >
                  <WhatsAppIcon size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Events District</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-[9px] uppercase tracking-wider text-emerald-400">Online · Replies in minutes</p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleCall}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] uppercase tracking-wider font-medium transition-all hover:scale-105"
                style={{ background: gold.metallic, color: 'black' }}
              >
                <Phone size={10} /> Call
              </button>
            </div>

            {/* Message bubble */}
            <div className="px-5 pb-4">
              <div
                className="px-4 py-3 rounded-2xl rounded-tl-none text-sm"
                style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid rgba(255,255,255,0.08)` }}
              >
                <p className="text-white/80 leading-relaxed">
                  👋 Hi! Welcome to <span style={{ color: gold.light }}>Events District</span>.
                </p>
                <p className="text-white/55 text-xs mt-1 leading-relaxed">
                  We design luxury events across Kenya. How can we help you today?
                </p>
              </div>
            </div>

            {/* Quick replies */}
            <div className="px-5 pb-4">
              <p className="text-[9px] uppercase tracking-[0.3em] mb-3" style={{ color: gold.light }}>
                Quick replies
              </p>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_REPLIES.map((qr, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => openWhatsApp(qr.msg)}
                    className="px-3 py-2 rounded-xl text-xs text-left transition-all"
                    style={{
                      background: 'rgba(212,175,55,0.08)',
                      border:     `1px solid ${gold.border}`,
                      color:      'rgba(255,255,255,0.7)',
                    }}
                  >
                    {qr.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Custom message input */}
            <div className="px-5 pb-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <p className="text-[9px] uppercase tracking-[0.3em] mt-3 mb-2" style={{ color: gold.light }}>
                Or type your own
              </p>
              <div className="flex gap-2">
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && message.trim()) { e.preventDefault(); openWhatsApp(message) } }}
                  placeholder="Type your message..."
                  rows={2}
                  className="flex-1 px-3 py-2 rounded-xl text-sm resize-none focus:outline-none placeholder:text-white/25 text-white/80"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border:     `1px solid rgba(255,255,255,0.08)`,
                  }}
                />
                <button
                  onClick={() => message.trim() && openWhatsApp(message)}
                  disabled={!message.trim()}
                  className="w-10 h-10 self-end rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
                  style={{ background: message.trim() ? gold.metallic : 'rgba(212,175,55,0.15)' }}
                >
                  <Send size={14} style={{ color: message.trim() ? 'black' : gold.light }} />
                </button>
              </div>
            </div>

            {/* CTA links */}
            <div
              className="flex items-center justify-between px-5 py-3 border-t"
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}
            >
              <Link
                href="/quote"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider transition-colors hover:opacity-80"
                style={{ color: gold.light }}
              >
                <Calculator size={10} /> Instant Quote
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider transition-colors hover:opacity-80"
                style={{ color: gold.light }}
              >
                <Calendar size={10} /> Book Consultation
              </Link>
            </div>

            <div className="px-5 pb-3 text-center">
              <p className="text-[8px] text-white/20">
                Opens WhatsApp · We respond within minutes
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
