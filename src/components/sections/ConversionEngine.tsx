"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Calculator, ArrowRight, Download, Mail, Check,
  X, Calendar, Users, Sparkles, ChevronDown, Clock, Gift
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { sendChecklistEmail } from '@/app/actions/email'
import Link from 'next/link'

// ─── Gold palette (matches full site) ────────────────────────────────────────
const gold = {
  light:    '#D4AF37',
  metallic: 'linear-gradient(135deg, #D4AF37 0%, #FFF2A8 50%, #D4AF37 100%)',
  shadow:   'rgba(212, 175, 55, 0.18)',
  glow:     'rgba(212, 175, 55, 0.07)',
  border:   'rgba(212, 175, 55, 0.22)',
}

// ─── Tier visual config (matches ServicesAtelier) ─────────────────────────────
const TIER_CONFIG = {
  essential: {
    label: 'Essential',
    badge: 'Beautifully curated',
    bg: 'linear-gradient(135deg, #4B5563 0%, #9CA3AF 50%, #4B5563 100%)',
    border: 'rgba(156, 163, 175, 0.35)',
    text: '#F9FAFB',
    sub: 'rgba(249,250,251,0.55)',
    glow: 'rgba(156,163,175,0.12)',
  },
  signature: {
    label: 'Signature',
    badge: 'Most popular',
    bg: 'linear-gradient(135deg, #1E3A5F 0%, #3B82F6 50%, #1E3A5F 100%)',
    border: 'rgba(59, 130, 246, 0.40)',
    text: '#DBEAFE',
    sub: 'rgba(219,234,254,0.55)',
    glow: 'rgba(59,130,246,0.15)',
  },
  luxury: {
    label: 'Luxury',
    badge: 'The full experience',
    bg: 'linear-gradient(135deg, #D4AF37 0%, #FFF2A8 50%, #D4AF37 100%)',
    border: 'rgba(212, 175, 55, 0.55)',
    text: '#1a1400',
    sub: 'rgba(26,20,0,0.55)',
    glow: 'rgba(212,175,55,0.22)',
  },
} as const

const CHECKLIST_ITEMS = [
  "12-Month Planning Timeline",
  "Vendor Comparison Spreadsheet",
  "Budget Allocation Calculator",
  "Venue Visit Checklist",
  "Questions to Ask Your Florist",
  "Questions to Ask Your Caterer",
  "Questions to Ask Your Photographer",
  "Décor Inspiration Mood Board Template",
  "Day-Of Emergency Kit List",
  "Guest List Manager",
  "Seating Chart Planner",
  "Final Week Countdown",
]

const GUEST_PRESETS = [50, 100, 150, 200, 300, 500]

// ─── Pricing fetcher ──────────────────────────────────────────────────────────
interface PricingTiers { essential: number; signature: number; luxury: number }

async function fetchPricingForGuests(guestCount: number): Promise<PricingTiers> {
  try {
    const supabase = createClient()
    const tiers = ['essential', 'signature', 'luxury'] as const
    const totals = { essential: 0, signature: 0, luxury: 0 }

    for (const tier of tiers) {
      const { data: items } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('setup_type', 'theater')
        .eq('tier', tier)
        .eq('is_active', true)

      if (!items) continue

      for (const item of items) {
        let quantity = item.base_quantity
        const ratio = guestCount / 100

        switch (item.scaling_rule) {
          case 'per_person':
            quantity = Math.ceil(ratio * item.base_quantity)
            break
          case 'per_table':
            quantity = Math.ceil(guestCount / 8)
            break
          case 'per_car':
            quantity = Math.min(Math.ceil(ratio) * item.base_quantity, 50)
            break
          case 'per_maid':
            quantity = Math.min(Math.ceil(ratio) * item.base_quantity, 12)
            break
        }

        const unitPrice = item.base_cost / item.base_quantity
        totals[tier] += Math.round(unitPrice * quantity)
      }
    }

    return totals
  } catch {
    // Fallback estimates scaled from 100-pax baseline
    const ratio = guestCount / 100
    return {
      essential: Math.round(85000 * ratio),
      signature: Math.round(150000 * ratio),
      luxury:    Math.round(260000 * ratio),
    }
  }
}

// ─── Shared atoms ──────────────────────────────────────────────────────────────
function GoldRule({ className = '' }: { className?: string }) {
  return <div className={`h-px flex-shrink-0 ${className}`} style={{ background: gold.metallic }} />
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <GoldRule className="w-8" />
      <span className="text-[9px] uppercase tracking-[0.35em]" style={{ color: gold.light }}>{children}</span>
    </div>
  )
}

// ─── BLOCK A: Interactive pricing calculator ──────────────────────────────────
function PricingCalculator() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  const [guestCount, setGuestCount] = useState(100)
  const [inputValue, setInputValue] = useState('100')
  const [pricing, setPricing] = useState<PricingTiers | null>(null)
  const [loading, setLoading] = useState(false)
  const [prevPricing, setPrevPricing] = useState<PricingTiers | null>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  const loadPricing = useCallback(async (guests: number) => {
    setLoading(true)
    const data = await fetchPricingForGuests(guests)
    setPrevPricing(prev => prev)
    setPricing(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadPricing(100)
  }, [])

  const handleGuestChange = (val: number) => {
    const clamped = Math.max(10, Math.min(2000, val))
    setGuestCount(clamped)
    setInputValue(String(clamped))
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => loadPricing(clamped), 600)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '')
    setInputValue(raw)
    const num = parseInt(raw)
    if (!isNaN(num) && num >= 10) {
      handleGuestChange(num)
    }
  }

  return (
    <div ref={ref} className="w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
        className="mb-8"
      >
        <SectionLabel>Live pricing</SectionLabel>
        <div className="mt-4 grid md:grid-cols-2 gap-4 items-end">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light leading-[1.08] text-foreground mt-2">
            See your{' '}
            <span
              className="italic bg-clip-text text-transparent"
              style={{ backgroundImage: gold.metallic, WebkitBackgroundClip: 'text' }}
            >
              exact
            </span>{' '}
            price.<br />Right now.
          </h2>
          <p className="text-sm text-foreground/50 leading-relaxed max-w-sm">
            No vague "starting from" numbers. Enter your guest count and
            watch real package prices calculate instantly from our live inventory.
          </p>
        </div>
      </motion.div>

      {/* Guest count input */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div
            className="flex items-center gap-4 px-5 py-3.5 rounded-2xl border flex-shrink-0"
            style={{ borderColor: gold.border, background: gold.glow }}
          >
            <Users size={15} style={{ color: gold.light }} className="flex-shrink-0" />
            <span className="text-xs text-foreground/50 uppercase tracking-wider flex-shrink-0">Guests</span>
            <input
              type="text"
              inputMode="numeric"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={() => setInputValue(String(guestCount))}
              className="w-20 bg-transparent text-xl font-light text-foreground focus:outline-none text-center tabular-nums"
              style={{ color: gold.light }}
            />
          </div>

          {/* Preset chips */}
          <div className="flex flex-wrap gap-2">
            {GUEST_PRESETS.map(preset => (
              <button
                key={preset}
                onClick={() => handleGuestChange(preset)}
                className="px-3 py-1.5 rounded-full text-xs border transition-all duration-200"
                style={{
                  borderColor: guestCount === preset ? gold.light : gold.border,
                  background: guestCount === preset ? gold.metallic : 'transparent',
                  color: guestCount === preset ? 'black' : undefined,
                }}
              >
                {preset}
              </button>
            ))}
            <span className="flex items-center text-[10px] text-foreground/35 px-1">or type any number</span>
          </div>
        </div>

        {/* Slider */}
        <div className="mt-4 relative">
          <input
            type="range"
            min={10}
            max={500}
            step={10}
            value={Math.min(guestCount, 500)}
            onChange={e => handleGuestChange(parseInt(e.target.value))}
            className="w-full h-1 appearance-none rounded-full cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${gold.light} 0%, ${gold.light} ${((Math.min(guestCount,500)-10)/490)*100}%, rgba(212,175,55,0.15) ${((Math.min(guestCount,500)-10)/490)*100}%, rgba(212,175,55,0.15) 100%)`
            }}
          />
          <style>{`
            input[type=range]::-webkit-slider-thumb {
              -webkit-appearance: none;
              width: 18px; height: 18px;
              border-radius: 50%;
              background: linear-gradient(135deg, #D4AF37 0%, #FFF2A8 50%, #D4AF37 100%);
              cursor: pointer;
              box-shadow: 0 0 8px rgba(212,175,55,0.4);
            }
            input[type=range]::-moz-range-thumb {
              width: 18px; height: 18px;
              border: none; border-radius: 50%;
              background: linear-gradient(135deg, #D4AF37 0%, #FFF2A8 50%, #D4AF37 100%);
              cursor: pointer;
            }
          `}</style>
          {guestCount > 500 && (
            <p className="text-[10px] text-foreground/35 mt-1.5">
              Slider shows up to 500 — your count of {guestCount} is calculated exactly.
            </p>
          )}
        </div>
      </motion.div>

      {/* Tier cards */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.25 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          {(['essential', 'signature', 'luxury'] as const).map((tier, i) => {
            const cfg = TIER_CONFIG[tier]
            const price = pricing?.[tier]
            const isLuxury = tier === 'luxury'

            return (
              <motion.div
                key={tier}
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
              >
                <Link
                  href={`/quote?tier=${tier}&guests=${guestCount}`}
                  className="group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 block"
                  style={{
                    border: `1px solid ${cfg.border}`,
                    boxShadow: `0 4px 24px ${cfg.glow}`,
                  }}
                >
                  <div className="absolute inset-0" style={{ background: cfg.bg }} />

                  {/* Luxury shimmer */}
                  {isLuxury && (
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                      style={{ background: 'linear-gradient(135deg, transparent 25%, rgba(255,255,255,0.18) 50%, transparent 75%)' }}
                    />
                  )}

                  <div className="relative z-10 p-5 flex flex-col h-full">
                    <div className="text-[8px] uppercase tracking-wider mb-3 font-medium" style={{ color: cfg.sub }}>
                      {cfg.badge}
                    </div>

                    <p className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: cfg.text }}>
                      {cfg.label}
                    </p>

                    {/* Animated price */}
                    <div className="mb-1" style={{ color: cfg.text }}>
                      {loading ? (
                        <div className="h-8 w-28 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.1)' }} />
                      ) : (
                        <motion.p
                          key={price}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-2xl md:text-3xl font-light tabular-nums"
                        >
                          {price ? `KES ${price.toLocaleString()}` : '—'}
                        </motion.p>
                      )}
                    </div>

                    <p className="text-[10px] mb-4" style={{ color: cfg.sub }}>
                      for {guestCount} guests · theater setup
                    </p>

                    <div className="mt-auto flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-medium" style={{ color: cfg.sub }}>
                      <span>Customise in quote engine</span>
                      <ArrowRight size={9} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Trust footnote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        >
          <p className="text-[10px] text-foreground/35">
            ✦ Live prices from our inventory · Changes with guest count · Theater setup shown
          </p>
          <Link
            href="/quote"
            className="inline-flex items-center gap-2 text-xs font-medium group/full"
            style={{ color: gold.light }}
          >
            <span className="underline underline-offset-4 group-hover/full:no-underline transition-all">
              Full quote engine — all setups, add-ons, custom items
            </span>
            <ArrowRight size={11} className="group-hover/full:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

// ─── BLOCK B: Lead magnet ──────────────────────────────────────────────────────
function LeadMagnetCard() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  const [step, setStep] = useState<'form' | 'success'>('form')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', date: '' })

  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await supabase.from('leads').insert([{
        name: formData.name.trim(),
        email: formData.email.trim(),
        event_date: formData.date || null,
        event_type: 'wedding',
        source: 'checklist_download',
        status: 'new',
        notes: `Checklist download${formData.date ? ` · Wedding: ${formData.date}` : ''}`,
      }])

      await sendChecklistEmail(formData.email.trim(), formData.name.trim())
      setStep('success')
      setTimeout(triggerDownload, 500)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const triggerDownload = () => {
    const content = `THE ULTIMATE WEDDING PLANNING CHECKLIST\nBy Events District\n\n${CHECKLIST_ITEMS.map(i => `☐ ${i}`).join('\n')}\n\n---\nReady to turn your vision into reality?\nBook a consultation at eventsdistrict.co.ke`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = Object.assign(document.createElement('a'), { href: url, download: 'Wedding-Planning-Checklist-EventsDistrict.txt' })
    document.body.appendChild(a); a.click()
    document.body.removeChild(a); URL.revokeObjectURL(url)
  }

  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
        className="rounded-2xl overflow-hidden border"
        style={{ borderColor: gold.border, background: gold.glow }}
      >
        {/* Top: value prop */}
        <div className="px-6 md:px-8 pt-7 pb-5 border-b" style={{ borderColor: gold.border }}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: gold.metallic }}
                >
                  <Gift size={13} style={{ color: '#1a1400' }} />
                </div>
                <span className="text-[9px] uppercase tracking-[0.3em]" style={{ color: gold.light }}>
                  Free wedding resource
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-light text-foreground leading-snug mb-2">
                The Wedding Planning{' '}
                <span
                  className="italic bg-clip-text text-transparent"
                  style={{ backgroundImage: gold.metallic, WebkitBackgroundClip: 'text' }}
                >
                  Checklist
                </span>
              </h3>
              <p className="text-sm text-foreground/50 leading-relaxed">
                A 12-month timeline, budget calculator, and vendor questions — the exact tools
                we use internally for every wedding we design.
              </p>
            </div>

            {/* Preview toggle */}
            <button
              onClick={() => setShowPreview(v => !v)}
              className="flex-shrink-0 flex items-center gap-1.5 text-[10px] uppercase tracking-wider transition-colors hover:text-foreground text-foreground/40 mt-1"
            >
              <span>{showPreview ? 'Hide' : 'Preview'}</span>
              <motion.div animate={{ rotate: showPreview ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={12} />
              </motion.div>
            </button>
          </div>

          {/* What's inside — collapsible */}
          <AnimatePresence>
            {showPreview && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
                className="overflow-hidden"
              >
                <div className="pt-4 grid grid-cols-2 gap-1.5">
                  {CHECKLIST_ITEMS.map((item, i) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex items-center gap-2"
                    >
                      <Check size={10} style={{ color: gold.light, flexShrink: 0 }} />
                      <span className="text-[10px] text-foreground/55 leading-relaxed">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom: form */}
        <div className="px-6 md:px-8 py-6">
          <AnimatePresence mode="wait">
            {step === 'form' ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {error && (
                  <div className="px-4 py-2.5 rounded-xl text-xs text-red-400 border border-red-500/20 bg-red-500/8">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.3em] text-foreground/40 mb-2">Your Name</label>
                    <div className="relative">
                      <input
                        type="text" required
                        placeholder="Sarah & Michael"
                        value={formData.name}
                        onChange={e => setFormData(d => ({ ...d, name: e.target.value }))}
                        className="w-full bg-transparent border-b border-foreground/20 py-2.5 pr-7 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground transition-colors"
                      />
                      {formData.name && (
                        <button type="button" onClick={() => setFormData(d => ({ ...d, name: '' }))} className="absolute right-0 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground transition-colors">
                          <X size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.3em] text-foreground/40 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail size={13} className="absolute left-0 top-1/2 -translate-y-1/2 text-foreground/35 pointer-events-none" />
                      <input
                        type="email" required
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={e => setFormData(d => ({ ...d, email: e.target.value }))}
                        className="w-full bg-transparent border-b border-foreground/20 py-2.5 pl-6 pr-7 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground transition-colors"
                      />
                      {formData.email && (
                        <button type="button" onClick={() => setFormData(d => ({ ...d, email: '' }))} className="absolute right-0 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground transition-colors">
                          <X size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-[0.3em] text-foreground/40 mb-2">
                    Wedding Date <span className="normal-case tracking-normal opacity-50">(optional — helps us personalise your timeline)</span>
                  </label>
                  <div className="relative">
                    <Calendar size={13} className="absolute left-0 top-1/2 -translate-y-1/2 text-foreground/35 pointer-events-none" />
                    <input
                      type="date" min={minDate}
                      value={formData.date}
                      onChange={e => setFormData(d => ({ ...d, date: e.target.value }))}
                      className={`w-full bg-transparent border-b border-foreground/20 py-2.5 pl-6 text-sm focus:outline-none focus:border-foreground transition-colors ${formData.date ? 'text-foreground' : 'text-foreground/30'}`}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold text-black disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    style={{ background: gold.metallic, boxShadow: `0 4px 20px ${gold.shadow}` }}
                  >
                    {loading ? (
                      <>
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} className="w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Download size={12} />
                        Send Me the Checklist
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[9px] text-foreground/28 leading-relaxed">
                  We send occasional wedding planning tips. No spam — unsubscribe anytime.
                </p>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-4 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
                  className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ background: gold.metallic }}
                >
                  <Check size={18} style={{ color: '#1a1400' }} />
                </motion.div>
                <h4 className="text-lg font-light text-foreground mb-2">Check your inbox!</h4>
                <p className="text-sm text-foreground/50 mb-5 leading-relaxed">
                  Your checklist is on its way to <strong className="text-foreground/80">{formData.email}</strong>
                  {' '}and downloading now.
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={triggerDownload}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-bold text-black"
                    style={{ background: gold.metallic }}
                  >
                    <Download size={11} /> Download Again
                  </button>
                  <Link
                    href="/contact"
                    className="block w-full py-2.5 rounded-full text-[10px] uppercase tracking-widest font-medium text-foreground border transition-all hover:border-amber-500/40 text-center"
                    style={{ borderColor: gold.border }}
                  >
                    Book Free Consultation
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function ConversionEngine() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-5%' })

  return (
    <section
      ref={ref}
      id="get-quote"
      className="relative w-full bg-background overflow-hidden border-t"
      style={{ borderColor: gold.border }}
    >
      {/* Ambient gold orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-60"
          style={{ background: `radial-gradient(circle, ${gold.glow} 0%, transparent 70%)` }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-[400px] h-[400px] rounded-full opacity-50"
          style={{ background: `radial-gradient(circle, ${gold.glow} 0%, transparent 70%)` }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24">

        {/* ── Main two-column layout ── */}
        <div className="grid lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-10 lg:gap-16 items-start">
          {/* Left: live pricing calculator */}
          <PricingCalculator />

          {/* Right: lead magnet */}
          <div className="lg:sticky lg:top-24">
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
            >
              {/* Context label */}
              <div className="mb-4">
                <SectionLabel>Not ready to quote yet?</SectionLabel>
                <p className="text-xs text-foreground/40 mt-2 ml-11">
                  Start here — get our planning tools free, then come back when you're ready.
                </p>
              </div>
              <LeadMagnetCard />
            </motion.div>
          </div>
        </div>

        {/* ── Bottom reassurance strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-14 md:mt-16 pt-8 border-t grid grid-cols-2 md:grid-cols-4 gap-6"
          style={{ borderColor: gold.border }}
        >
          {[
            { icon: <Clock size={13} />, label: 'Reply in 24 hrs', sub: 'Guaranteed response time' },
            { icon: <Users size={13} />, label: '500+ events done', sub: 'Across Kenya & beyond' },
            { icon: <Sparkles size={13} />, label: 'No hidden fees', sub: 'What you see is what you pay' },
            { icon: <Check size={13} />, label: '100% satisfaction', sub: 'Or we make it right' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.55 + i * 0.07 }}
              className="flex items-start gap-3"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: gold.glow, border: `1px solid ${gold.border}` }}
              >
                <span style={{ color: gold.light }}>{item.icon}</span>
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">{item.label}</p>
                <p className="text-[10px] text-foreground/40 mt-0.5">{item.sub}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
