"use client"

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ArrowRight, MapPin, Mail, Calendar, Phone, ChevronDown, Check, Sparkles } from 'lucide-react'
import Link from 'next/link'

// ─── Gold palette ─────────────────────────────────────────────────────────────
const gold = {
  light:    '#D4AF37',
  metallic: 'linear-gradient(135deg, #D4AF37 0%, #FFF2A8 50%, #D4AF37 100%)',
  shadow:   'rgba(212, 175, 55, 0.18)',
  glow:     'rgba(212, 175, 55, 0.07)',
  border:   'rgba(212, 175, 55, 0.22)',
}

const EVENT_TYPES = [
  'Wedding Ceremony',
  'Luxury Gala',
  'Corporate Event',
  'Birthday Celebration',
  'Graduation Party',
  'Anniversary',
  'Baby Shower',
  'Product Launch',
  'Traditional Ceremony',
  'Other',
]

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

// ─── Step indicator ────────────────────────────────────────────────────────────
function StepDots({ step }: { step: 1 | 2 | 'done' }) {
  return (
    <div className="flex items-center gap-3 mb-7">
      {[1, 2].map(n => {
        const isActive = step === n
        const isDone = (step === 2 && n === 1) || step === 'done'
        return (
          <React.Fragment key={n}>
            <div
              className="flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold transition-all duration-300"
              style={{
                background: isActive ? gold.metallic : isDone ? gold.metallic : 'transparent',
                border: `1px solid ${isActive || isDone ? gold.light : gold.border}`,
                color: isActive || isDone ? 'black' : undefined,
              }}
            >
              {isDone ? <Check size={11} /> : n}
            </div>
            {n < 2 && (
              <div className="flex-1 h-px transition-all duration-500" style={{ background: isDone ? gold.metallic : gold.border }} />
            )}
          </React.Fragment>
        )
      })}
      <div className="ml-1 text-[9px] uppercase tracking-wider text-foreground/40">
        Step {step === 'done' ? '2' : step} of 2
      </div>
    </div>
  )
}

export function ContactAtelier() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-8%' })

  const [step, setStep] = useState<1 | 2 | 'done'>(1)
  const [form, setForm] = useState({
    eventType: '',
    eventDate: '',
    guestCount: '',
    name: '',
    email: '',
    phone: '',
    message: '',
    customEvent: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault()
    if (form.eventType) setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1000)) // Replace with real submission
    setStep('done')
    setSubmitting(false)
  }

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  return (
    <section
      ref={ref}
      id="contact"
      className="relative w-full bg-background overflow-hidden border-t"
      style={{ borderColor: gold.border }}
    >
      {/* Decorative background text */}
      <div className="absolute top-8 left-8 pointer-events-none hidden lg:block select-none" style={{ opacity: 0.025 }}>
        <h2 className="text-[14vw] font-light leading-none text-foreground">Inquiry</h2>
      </div>

      {/* Gold orb */}
      <div
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${gold.glow} 0%, transparent 70%)` }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-12 md:mb-16"
        >
          <SectionLabel>The final step</SectionLabel>
          <div className="mt-4 grid md:grid-cols-2 gap-6 items-end">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground leading-[1.1]">
              Start your{' '}
              <span
                className="italic bg-clip-text text-transparent"
                style={{ backgroundImage: gold.metallic, WebkitBackgroundClip: 'text' }}
              >
                legacy.
              </span>
            </h2>
            <p className="text-sm text-foreground/50 leading-relaxed max-w-sm">
              From the heart of Nairobi to the most exclusive destinations — we translate
              your vision into an experience your guests never forget.
            </p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[380px_1fr] gap-10 lg:gap-16 items-start">

          {/* Left: contact info + consultation card */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="space-y-6 lg:sticky lg:top-24"
          >
            {/* Contact details */}
            <div
              className="rounded-2xl p-6 border space-y-5"
              style={{ borderColor: gold.border, background: gold.glow }}
            >
              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] mb-4" style={{ color: gold.light }}>
                  Reach us directly
                </p>
                {[
                  { icon: <MapPin size={14} />, label: 'Our Studio', value: 'Nairobi, Kenya' },
                  { icon: <Mail size={14} />, label: 'Direct Email', value: 'hello@eventsdistrict.com', href: 'mailto:hello@eventsdistrict.com' },
                  { icon: <Phone size={14} />, label: "Let's Talk", value: '+254 700 000 000', href: 'tel:+254700000000' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 group">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300 group-hover:scale-105"
                      style={{ background: gold.metallic }}
                    >
                      <span style={{ color: '#1a1400' }}>{item.icon}</span>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-foreground/40 mb-0.5">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm text-foreground/70">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Consultation card */}
            <div
              className="rounded-2xl p-6 border"
              style={{ borderColor: gold.border, background: gold.glow }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center mb-4"
                style={{ background: gold.metallic }}
              >
                <Calendar size={15} style={{ color: '#1a1400' }} />
              </div>
              <h4 className="text-base font-light text-foreground mb-2">Book a Consultation</h4>
              <p className="text-xs text-foreground/50 leading-relaxed mb-4">
                Schedule a private session with our lead designers.
                30 minutes, no obligation, completely free.
              </p>
              <Link
                href="/contact?type=consultation"
                className="block w-full py-3 text-center text-[10px] uppercase tracking-widest font-bold rounded-full text-black"
                style={{ background: gold.metallic, boxShadow: `0 4px 16px ${gold.shadow}` }}
              >
                Reserve a Slot
              </Link>
            </div>

            {/* Reassurance */}
            <div className="flex flex-col gap-2 px-1">
              {[
                '✦ Response within 24 hours, guaranteed',
                '✦ No commitment required',
                '✦ Transparent, itemised pricing',
              ].map(line => (
                <p key={line} className="text-[10px] text-foreground/35 uppercase tracking-wider">{line}</p>
              ))}
            </div>
          </motion.div>

          {/* Right: two-step form */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div
              className="rounded-2xl border overflow-hidden"
              style={{ borderColor: gold.border }}
            >
              <GoldRule />

              <div className="p-6 md:p-10">
                <AnimatePresence mode="wait">

                  {/* ── Step 1: Event type + date ── */}
                  {step === 1 && (
                    <motion.form
                      key="step1"
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
                      onSubmit={handleStep1}
                    >
                      <StepDots step={1} />
                      <h3 className="text-xl font-light text-foreground mb-1">Tell us about your event</h3>
                      <p className="text-sm text-foreground/45 mb-8 leading-relaxed">
                        Just two quick details — we'll handle the rest.
                      </p>

                      {/* Event type grid */}
                      <div className="mb-7">
                        <label className="block text-[9px] uppercase tracking-[0.3em] text-foreground/40 mb-3">
                          What type of event?
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {EVENT_TYPES.filter(t => t !== 'Other').map(type => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setForm(f => ({ ...f, eventType: type }))}
                              className="py-2.5 px-3 rounded-xl text-xs border text-left transition-all duration-200"
                              style={{
                                borderColor: form.eventType === type ? gold.light : gold.border,
                                background: form.eventType === type ? gold.metallic : 'transparent',
                                color: form.eventType === type ? 'black' : undefined,
                              }}
                            >
                              {type}
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => setForm(f => ({ ...f, eventType: 'Other' }))}
                            className="py-2.5 px-3 rounded-xl text-xs border text-left transition-all duration-200"
                            style={{
                              borderColor: form.eventType === 'Other' ? gold.light : gold.border,
                              background: form.eventType === 'Other' ? gold.metallic : 'transparent',
                              color: form.eventType === 'Other' ? 'black' : undefined,
                            }}
                          >
                            Other
                          </button>
                        </div>
                      </div>

                      {/* Custom event field */}
                      <AnimatePresence>
                        {form.eventType === 'Other' && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mb-7"
                          >
                            <input
                              type="text"
                              placeholder="Describe your event concept..."
                              value={form.customEvent}
                              onChange={update('customEvent')}
                              className="w-full bg-transparent border-b border-foreground/20 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground transition-colors"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Date + guest count */}
                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div>
                          <label className="block text-[9px] uppercase tracking-[0.3em] text-foreground/40 mb-2">
                            Event date <span className="normal-case tracking-normal opacity-50">(optional)</span>
                          </label>
                          <input
                            type="date"
                            min={minDate}
                            value={form.eventDate}
                            onChange={update('eventDate')}
                            className={`w-full bg-transparent border-b border-foreground/20 py-3 text-sm focus:outline-none focus:border-foreground transition-colors ${form.eventDate ? 'text-foreground' : 'text-foreground/30'}`}
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase tracking-[0.3em] text-foreground/40 mb-2">
                            Guest count <span className="normal-case tracking-normal opacity-50">(approx.)</span>
                          </label>
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="e.g. 150"
                            value={form.guestCount}
                            onChange={update('guestCount')}
                            className="w-full bg-transparent border-b border-foreground/20 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground transition-colors"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={!form.eventType}
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-full text-[10px] uppercase tracking-widest font-bold text-black disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        style={{ background: form.eventType ? gold.metallic : gold.border, boxShadow: form.eventType ? `0 4px 20px ${gold.shadow}` : 'none' }}
                      >
                        Continue
                        <ArrowRight size={12} />
                      </button>
                    </motion.form>
                  )}

                  {/* ── Step 2: Contact details ── */}
                  {step === 2 && (
                    <motion.form
                      key="step2"
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
                      onSubmit={handleSubmit}
                    >
                      <StepDots step={2} />

                      {/* Event summary chip */}
                      <div
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs"
                        style={{ background: gold.metallic, color: 'black' }}
                      >
                        <Sparkles size={11} />
                        {form.eventType}{form.guestCount ? ` · ${form.guestCount} guests` : ''}{form.eventDate ? ` · ${new Date(form.eventDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}` : ''}
                      </div>

                      <h3 className="text-xl font-light text-foreground mb-1">How do we reach you?</h3>
                      <p className="text-sm text-foreground/45 mb-8 leading-relaxed">
                        We'll reply within 24 hours with a tailored concept and pricing.
                      </p>

                      <div className="space-y-6 mb-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="relative group">
                            <input
                              type="text"
                              required
                              placeholder="Your Name"
                              value={form.name}
                              onChange={update('name')}
                              className="w-full bg-transparent border-b border-foreground/20 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground transition-colors"
                            />
                            <div className="absolute bottom-0 left-0 h-px bg-foreground w-0 group-focus-within:w-full transition-all duration-500" />
                          </div>
                          <div className="relative group">
                            <input
                              type="email"
                              required
                              placeholder="Email Address"
                              value={form.email}
                              onChange={update('email')}
                              className="w-full bg-transparent border-b border-foreground/20 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground transition-colors"
                            />
                            <div className="absolute bottom-0 left-0 h-px bg-foreground w-0 group-focus-within:w-full transition-all duration-500" />
                          </div>
                        </div>

                        <div className="relative group">
                          <input
                            type="tel"
                            placeholder="Phone Number (optional)"
                            value={form.phone}
                            onChange={update('phone')}
                            className="w-full bg-transparent border-b border-foreground/20 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground transition-colors"
                          />
                          <div className="absolute bottom-0 left-0 h-px bg-foreground w-0 group-focus-within:w-full transition-all duration-500" />
                        </div>

                        <div className="relative group">
                          <textarea
                            rows={3}
                            placeholder="Share your vision, theme, or any specific requirements..."
                            value={form.message}
                            onChange={update('message')}
                            className="w-full bg-transparent border-b border-foreground/20 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground transition-colors resize-none"
                          />
                          <div className="absolute bottom-0 left-0 h-px bg-foreground w-0 group-focus-within:w-full transition-all duration-500" />
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="sm:w-auto px-5 py-3.5 rounded-full text-[10px] uppercase tracking-widest font-medium text-foreground border transition-all hover:border-amber-500/40"
                          style={{ borderColor: gold.border }}
                        >
                          ← Back
                        </button>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full text-[10px] uppercase tracking-widest font-bold text-black disabled:opacity-60"
                          style={{ background: gold.metallic, boxShadow: `0 4px 20px ${gold.shadow}` }}
                        >
                          {submitting ? (
                            <>
                              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} className="w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full" />
                              Sending…
                            </>
                          ) : (
                            <>
                              Send Inquiry
                              <ArrowRight size={12} />
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-[9px] text-foreground/28 mt-4 text-center">
                        By submitting you agree to our privacy policy. We never share your details.
                      </p>
                    </motion.form>
                  )}

                  {/* ── Done state ── */}
                  {step === 'done' && (
                    <motion.div
                      key="done"
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-8 text-center"
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
                      <h3 className="text-2xl font-light text-foreground mb-3">Inquiry received.</h3>
                      <p className="text-sm text-foreground/50 leading-relaxed mb-6 max-w-sm mx-auto">
                        Thank you, {form.name.split(' ')[0] || 'there'}. We'll review your{' '}
                        <strong className="text-foreground/70">{form.eventType.toLowerCase()}</strong>{' '}
                        inquiry and respond within 24 hours with a tailored concept.
                      </p>
                      <div className="flex flex-col gap-2 max-w-xs mx-auto">
                        <Link
                          href="/quote"
                          className="block py-3 rounded-full text-[10px] uppercase tracking-widest font-bold text-black text-center"
                          style={{ background: gold.metallic }}
                        >
                          While you wait — get a quote
                        </Link>
                        <button
                          onClick={() => { setStep(1); setForm({ eventType:'', eventDate:'', guestCount:'', name:'', email:'', phone:'', message:'', customEvent:'' }) }}
                          className="py-3 rounded-full text-[10px] uppercase tracking-widest font-medium text-foreground border transition-all"
                          style={{ borderColor: gold.border }}
                        >
                          Submit another inquiry
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
