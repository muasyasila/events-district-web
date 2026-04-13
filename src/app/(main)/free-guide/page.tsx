"use client"

import React, { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Check, Download, Calendar, ArrowRight, Star, Users, Clock, CheckCircle2, Mail, X, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { sendChecklistEmail } from '@/app/actions/email'

// ─── Gold palette ─────────────────────────────────────────────────────────────
const gold = {
  light:    '#D4AF37',
  metallic: 'linear-gradient(135deg, #D4AF37 0%, #FFF2A8 50%, #D4AF37 100%)',
  shadow:   'rgba(212, 175, 55, 0.22)',
  glow:     'rgba(212, 175, 55, 0.07)',
  border:   'rgba(212, 175, 55, 0.25)',
}

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

// ─── Checklist data ───────────────────────────────────────────────────────────
const CHECKLIST_SECTIONS = [
  {
    title: '12-Month Planning Timeline',
    desc:  'Exactly what to do each month, from setting your budget to the final week countdown.',
    items: ['Set budget & guest list', 'Book venue & key vendors', 'Send save-the-dates', 'Final confirmations'],
    icon:  <Calendar size={16} />,
  },
  {
    title: 'Vendor Question Scripts',
    desc:  'The exact questions to ask your florist, caterer, and photographer — so you never walk away wondering.',
    items: ['Florist consultation questions', 'Caterer due diligence checklist', 'Photographer brief template', 'Décor vendor red flags'],
    icon:  <CheckCircle2 size={16} />,
  },
  {
    title: 'Budget Allocation Calculator',
    desc:  'The industry breakdown we follow internally — how to split your budget across décor, catering, photography, and more.',
    items: ['Category percentage breakdown', 'Hidden cost register', 'Buffer fund guidance', 'KES-specific pricing benchmarks'],
    icon:  <ArrowRight size={16} />,
  },
  {
    title: 'Day-Of Emergency Kit List',
    desc:  'The 27 items every bride should have in a bag on the morning of her wedding. Based on 500+ events.',
    items: ['Wardrobe emergency kit', 'First aid essentials', 'Vendor contact sheet', 'Timeline backup copy'],
    icon:  <Sparkles size={16} />,
  },
  {
    title: 'Seating Chart Planner',
    desc:  'A template that actually works for Kenyan weddings — accounting for family hierarchies and mixed guest lists.',
    items: ['Table layout templates', 'VIP section guide', 'Family seating etiquette', 'Last-minute swap protocol'],
    icon:  <Users size={16} />,
  },
  {
    title: 'Final Week Countdown',
    desc:  'A day-by-day checklist for the 7 days before your wedding, so nothing falls through the cracks.',
    items: ['7 days out: vendor confirmations', '3 days out: final brief', 'Day before: setup walkthrough', 'Morning of: the calm checklist'],
    icon:  <Clock size={16} />,
  },
]

const TESTIMONIALS = [
  {
    quote:  "I thought I had everything covered. The checklist showed me three things I'd completely missed. It saved us from a very stressful wedding morning.",
    name:   'Amara Mensah',
    event:  'Wedding · Karen Estate',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    quote:  "The vendor question script alone is worth downloading. I went into my florist meeting with confidence instead of guessing.",
    name:   'Priya Patel',
    event:  'Wedding · Nairobi',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    quote:  "Used the budget calculator and saved KES 40,000 by reallocating from an area where I was overspending.",
    name:   'Grace Kariuki',
    event:  'Wedding · Mombasa',
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
  },
]

// ─── Opt-in form component ────────────────────────────────────────────────────
function OptInForm({ compact = false }: { compact?: boolean }) {
  const supabase = createClient()
  const [step,    setStep]    = useState<'form' | 'success'>('form')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [form,    setForm]    = useState({ name: '', email: '', date: '' })

  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate  = tomorrow.toISOString().split('T')[0]

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
        source:     'checklist_page',
        status:     'new',
        notes:      `Checklist page opt-in${form.date ? ` | Wedding: ${form.date}` : ''}`,
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

  if (step === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${compact ? 'p-6' : 'p-8 md:p-10'} rounded-2xl border text-center`}
        style={{ borderColor: gold.border, background: gold.glow }}
      >
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center"
          style={{ background: gold.metallic }}
        >
          <Check size={20} style={{ color: '#1a1400' }} />
        </motion.div>
        <h3 className="text-xl font-light text-foreground mb-2">Check your inbox!</h3>
        <p className="text-sm text-foreground/55 mb-6 leading-relaxed">
          Your checklist is on the way to <strong className="text-foreground/80">{form.email}</strong>.
        </p>
        <Link
          href="/quote"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold text-black"
          style={{ background: gold.metallic, boxShadow: `0 4px 20px ${gold.shadow}` }}
        >
          Now get your wedding quote <ArrowRight size={11} />
        </Link>
      </motion.div>
    )
  }

  return (
    <div
      className={`${compact ? 'p-6' : 'p-8 md:p-10'} rounded-2xl border`}
      style={{ borderColor: gold.border, background: gold.glow }}
    >
      {!compact && (
        <div className="mb-6">
          <SectionLabel>Free download</SectionLabel>
          <h3 className="text-2xl font-light text-foreground mt-3 mb-1">
            Get the checklist free.
          </h3>
          <p className="text-sm text-foreground/50 leading-relaxed">
            Enter your details and we'll send it straight to your inbox. No spam, ever.
          </p>
        </div>
      )}

      {error && (
        <div className="mb-4 px-3 py-2.5 rounded-xl text-xs text-red-400 border border-red-500/20 bg-red-500/8">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative group">
            <label className="block text-[9px] uppercase tracking-[0.3em] text-foreground/38 mb-2">Your Name</label>
            <input
              type="text" required placeholder="Sarah & Michael"
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full bg-transparent border-b border-foreground/20 py-3 text-sm text-foreground placeholder:text-foreground/28 focus:outline-none focus:border-foreground transition-colors"
            />
            <div className="absolute bottom-0 left-0 h-px bg-foreground w-0 group-focus-within:w-full transition-all duration-500" />
          </div>
          <div className="relative group">
            <label className="block text-[9px] uppercase tracking-[0.3em] text-foreground/38 mb-2">Email Address</label>
            <div className="relative">
              <Mail size={12} className="absolute left-0 bottom-3.5 text-foreground/35 pointer-events-none" />
              <input
                type="email" required placeholder="you@example.com"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full bg-transparent border-b border-foreground/20 py-3 pl-5 text-sm text-foreground placeholder:text-foreground/28 focus:outline-none focus:border-foreground transition-colors"
              />
            </div>
            <div className="absolute bottom-0 left-0 h-px bg-foreground w-0 group-focus-within:w-full transition-all duration-500" />
          </div>
        </div>

        <div className="relative group">
          <label className="block text-[9px] uppercase tracking-[0.3em] text-foreground/38 mb-2">
            Wedding Date <span className="normal-case tracking-normal opacity-50">(optional — helps us personalise your timeline)</span>
          </label>
          <div className="relative">
            <Calendar size={12} className="absolute left-0 bottom-3.5 text-foreground/35 pointer-events-none" />
            <input
              type="date" min={minDate}
              value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className={`w-full bg-transparent border-b border-foreground/20 py-3 pl-5 text-sm focus:outline-none focus:border-foreground transition-colors ${form.date ? 'text-foreground' : 'text-foreground/28'}`}
            />
          </div>
          <div className="absolute bottom-0 left-0 h-px bg-foreground w-0 group-focus-within:w-full transition-all duration-500" />
        </div>

        <div className="pt-1">
          <button
            type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-full text-[10px] uppercase tracking-widest font-bold text-black disabled:opacity-50"
            style={{ background: gold.metallic, boxShadow: `0 6px 24px ${gold.shadow}` }}
          >
            {loading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full" />
            ) : (
              <><Download size={13} /> Send Me the Free Checklist</>
            )}
          </button>
          <p className="text-[9px] text-foreground/28 text-center mt-3">
            Sent instantly · No spam · Unsubscribe anytime
          </p>
        </div>
      </form>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ChecklistPage() {
  const heroRef     = useRef<HTMLDivElement>(null)
  const contentRef  = useRef<HTMLDivElement>(null)
  const proofRef    = useRef<HTMLDivElement>(null)
  const ctaRef      = useRef<HTMLDivElement>(null)

  const contentInView = useInView(contentRef, { once: true, margin: '-8%' })
  const proofInView   = useInView(proofRef,   { once: true, margin: '-8%' })
  const ctaInView     = useInView(ctaRef,     { once: true, margin: '-8%' })

  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden">

      {/* Gold top rule */}
      <GoldRule />

      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full" style={{ background: `radial-gradient(circle, ${gold.glow} 0%, transparent 70%)` }} />
        <div className="absolute bottom-1/3 left-0 w-80 h-80 rounded-full" style={{ background: `radial-gradient(circle, ${gold.glow} 0%, transparent 70%)` }} />
      </div>

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative pt-20 md:pt-28 pb-16 md:pb-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* Left: copy */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            >
              <SectionLabel>Free resource</SectionLabel>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground leading-[1.05] mt-4 mb-5">
                The wedding planning tool{' '}
                <span
                  className="italic bg-clip-text text-transparent"
                  style={{ backgroundImage: gold.metallic, WebkitBackgroundClip: 'text' }}
                >
                  we use on every event.
                </span>
              </h1>
              <p className="text-base md:text-lg text-foreground/55 leading-relaxed mb-7">
                After 500+ weddings, we've distilled everything a couple needs into one checklist.
                It's the internal tool our team uses. Now it's yours — completely free.
              </p>

              {/* Proof row */}
              <div className="flex flex-wrap gap-5 mb-7">
                {[
                  { value: '2,400+', label: 'couples downloaded' },
                  { value: '12',     label: 'planning tools in one doc' },
                  { value: '10+',    label: 'years of experience distilled' },
                ].map((s, i) => (
                  <div key={i}>
                    <p className="text-lg font-light" style={{ color: gold.light }}>{s.value}</p>
                    <p className="text-[10px] text-foreground/40 uppercase tracking-wider">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Feature list */}
              <div className="space-y-2.5">
                {[
                  '12-month planning timeline',
                  'Vendor question scripts (florist, caterer, photographer)',
                  'Budget allocation calculator (KES benchmarks)',
                  'Day-of emergency kit list',
                  'Final week countdown checklist',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <CheckCircle2 size={13} style={{ color: gold.light, flexShrink: 0 }} />
                    <span className="text-sm text-foreground/65">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: opt-in form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
            >
              <OptInForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────────────────────── */}
      <div className="border-y py-10" style={{ borderColor: gold.border, background: gold.glow }}>
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {[
              { icon: <Users size={14} />,   value: '2,400+',  label: 'couples have used this checklist' },
              { icon: <Star size={14} />,    value: '4.9 / 5', label: 'average rating from users' },
              { icon: <Check size={14} />,   value: '100%',    label: 'free — no hidden paywall' },
              { icon: <Clock size={14} />,   value: 'Instant', label: 'sent to your inbox immediately' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: gold.metallic }}>
                  <span style={{ color: '#1a1400' }}>{item.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.value}</p>
                  <p className="text-[10px] text-foreground/40">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── WHAT'S INSIDE ─────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-4 md:px-6 lg:px-8 border-b" style={{ borderColor: gold.border }}>
        <div ref={contentRef} className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={contentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="mb-12"
          >
            <SectionLabel>What's inside</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-light text-foreground mt-4">
              Six tools.{' '}
              <span className="italic" style={{ color: gold.light }}>One document.</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CHECKLIST_SECTIONS.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={contentInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.09 }}
                className="p-6 rounded-2xl border group"
                style={{ borderColor: gold.border, background: gold.glow }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center mb-4"
                  style={{ background: gold.metallic }}
                >
                  <span style={{ color: '#1a1400' }}>{section.icon}</span>
                </div>
                <h3 className="text-base font-medium text-foreground mb-2">{section.title}</h3>
                <p className="text-sm text-foreground/50 leading-relaxed mb-4 font-light">{section.desc}</p>
                <div className="space-y-1.5">
                  {section.items.map((item, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: gold.light }} />
                      <span className="text-xs text-foreground/45">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-24 px-4 md:px-6 lg:px-8 border-b" style={{ borderColor: gold.border }}>
        <div ref={proofRef} className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={proofInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="mb-10"
          >
            <SectionLabel>From couples who used it</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-light text-foreground mt-4">
              Real results.{' '}
              <span className="italic" style={{ color: gold.light }}>Real weddings.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={proofInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-2xl border"
                style={{ borderColor: gold.border, background: gold.glow }}
              >
                <div className="flex items-center gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} size={11} fill={gold.light} color={gold.light} />)}
                </div>
                <p className="text-sm text-foreground/65 leading-relaxed italic mb-5">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover" style={{ border: `1.5px solid ${gold.light}` }} />
                  <div>
                    <p className="text-xs font-medium text-foreground">{t.name}</p>
                    <p className="text-[9px] uppercase tracking-wider text-foreground/35">{t.event}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECOND OPT-IN (mid-page nudge) ───────────────────────────────────── */}
      <section className="py-16 md:py-20 px-4 md:px-6 lg:px-8 border-b" style={{ borderColor: gold.border }}>
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-sm text-foreground/45 mb-2">Still thinking about it?</p>
            <h3 className="text-2xl font-light text-foreground">
              It takes 20 seconds to get it.{' '}
              <span className="italic" style={{ color: gold.light }}>It could save your wedding day.</span>
            </h3>
          </div>
          <OptInForm compact />
        </div>
      </section>

      {/* ── CTA LADDER ───────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-4 md:px-6 lg:px-8">
        <div ref={ctaRef} className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="mb-10 text-center"
          >
            <SectionLabel>Ready for the next step?</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-light text-foreground mt-4 mb-3">
              The checklist is step one.
            </h2>
            <p className="text-foreground/50 text-sm max-w-md mx-auto">
              Once you know your timeline and budget, the natural next step is seeing what your actual wedding décor will cost.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                step:  '01',
                title: 'Get the Checklist',
                desc:  'You\'re here. Download it above and start with clarity.',
                cta:   null,
                isCurrentStep: true,
              },
              {
                step:  '02',
                title: 'See Your Exact Price',
                desc:  'Enter your guest count and get live package pricing from our actual inventory.',
                cta:   { label: 'Open Quote Engine', href: '/quote' },
                isCurrentStep: false,
              },
              {
                step:  '03',
                title: 'Book a Consultation',
                desc:  'Talk to our team. Free, 30 minutes, no commitment.',
                cta:   { label: 'Book Free Call', href: '/contact' },
                isCurrentStep: false,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative p-6 rounded-2xl border"
                style={{
                  borderColor: item.isCurrentStep ? gold.light : gold.border,
                  background:  item.isCurrentStep ? gold.glow : 'transparent',
                }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold mb-5"
                  style={{ background: item.isCurrentStep ? gold.metallic : 'transparent', border: `1px solid ${gold.border}`, color: item.isCurrentStep ? 'black' : gold.light }}
                >
                  {item.step}
                </div>
                <h3 className="text-base font-medium text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-foreground/50 leading-relaxed font-light mb-5">{item.desc}</p>
                {item.cta ? (
                  <Link
                    href={item.cta.href}
                    className="inline-flex items-center gap-2 text-xs font-medium group/cta"
                    style={{ color: gold.light }}
                  >
                    <span className="underline underline-offset-4 group-hover/cta:no-underline transition-all">
                      {item.cta.label}
                    </span>
                    <ArrowRight size={10} className="group-hover/cta:translate-x-0.5 transition-transform" />
                  </Link>
                ) : (
                  <span className="text-xs text-foreground/30 uppercase tracking-wider">✦ You are here</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
