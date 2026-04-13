"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Mail, Phone, MapPin, Clock, Instagram, Twitter, Facebook,
  Send, Check, ArrowRight, MessageCircle, Calculator, Sparkles, ChevronDown
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { sendContactNotification, sendAutoReply } from '@/app/actions/email'

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
  'Engagement Party',
  'Corporate Event',
  'Birthday Celebration',
  'Anniversary',
  'Graduation',
  'Baby Shower',
  'Product Launch',
  'Traditional Ceremony',
  'Social Gathering',
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

function StepDots({ step }: { step: 1 | 2 | 'done' }) {
  return (
    <div className="flex items-center gap-3 mb-7">
      {[1, 2].map(n => {
        const isActive = step === n
        const isDone   = (step === 2 && n === 1) || step === 'done'
        return (
          <div key={n} className="flex items-center gap-3 flex-1">
            <div
              className="flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-bold transition-all duration-300 flex-shrink-0"
              style={{
                background: isActive || isDone ? gold.metallic : 'transparent',
                border: `1px solid ${isActive || isDone ? gold.light : gold.border}`,
                color: isActive || isDone ? 'black' : undefined,
              }}
            >
              {isDone ? <Check size={12} /> : n}
            </div>
            {n < 2 && (
              <div className="flex-1 h-px transition-all duration-500" style={{ background: isDone ? gold.metallic : gold.border }} />
            )}
          </div>
        )
      })}
      <span className="text-[9px] uppercase tracking-wider text-foreground/35 flex-shrink-0">
        Step {step === 'done' ? '2' : step} of 2
      </span>
    </div>
  )
}

export default function ContactClient() {
  const supabase = createClient()

  const [step, setStep]         = useState<1 | 2 | 'done'>(1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]       = useState('')
  const [form, setForm]         = useState({
    eventType: '', customEvent: '', eventDate: '', guestCount: '',
    name: '', email: '', phone: '', message: '',
  })

  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate  = tomorrow.toISOString().split('T')[0]

  const update = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm(prev => ({ ...prev, [k]: e.target.value }))

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault()
    if (form.eventType) setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const { error: dbError } = await supabase.from('leads').insert([{
        name:       form.name.trim(),
        email:      form.email.trim(),
        phone:      form.phone || '',
        event_date: form.eventDate || null,
        event_type: form.eventType === 'Other' ? form.customEvent : form.eventType,
        source:     'contact_page',
        status:     'new',
        notes:      `Guests: ${form.guestCount || 'N/A'} | Message: ${form.message}`,
      }])
      if (dbError) throw dbError

      await sendContactNotification({
        name: form.name, email: form.email, phone: form.phone,
        eventType: form.eventType, eventDate: form.eventDate,
        guestCount: form.guestCount, message: form.message, howDidYouHear: '',
      })
      await sendAutoReply(form.email.trim(), form.name.trim())
      setStep('done')
    } catch {
      setError('Something went wrong. Please try again or email us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  const reset = () => {
    setStep(1)
    setForm({ eventType:'', customEvent:'', eventDate:'', guestCount:'', name:'', email:'', phone:'', message:'' })
    setError('')
  }

  return (
    <main className="min-h-screen bg-background text-foreground">

      {/* Gold top rule */}
      <GoldRule />

      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full" style={{ background: `radial-gradient(circle, ${gold.glow} 0%, transparent 70%)` }} />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full" style={{ background: `radial-gradient(circle, ${gold.glow} 0%, transparent 70%)` }} />
      </div>

      {/* Decorative bg text */}
      <div className="absolute top-10 left-6 pointer-events-none hidden lg:block select-none" style={{ opacity: 0.02 }}>
        <h2 className="text-[13vw] font-light leading-none text-foreground">Inquiry</h2>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pt-20 md:pt-28 pb-20">

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-14 md:mb-18"
        >
          <SectionLabel>The final step</SectionLabel>
          <div className="mt-4 grid md:grid-cols-2 gap-6 items-end">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground leading-[1.05]">
              Start your{' '}
              <span
                className="italic bg-clip-text text-transparent"
                style={{ backgroundImage: gold.metallic, WebkitBackgroundClip: 'text' }}
              >
                legacy.
              </span>
            </h1>
            <p className="text-sm text-foreground/50 leading-relaxed max-w-sm">
              From the heart of Nairobi to the most exclusive destinations — we translate your vision into an experience guests never forget.
            </p>
          </div>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-[360px_1fr] gap-10 lg:gap-16 items-start">

          {/* Left: contact info */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="space-y-5 lg:sticky lg:top-24"
          >
            {/* Contact details card */}
            <div className="rounded-2xl p-6 border space-y-5" style={{ borderColor: gold.border, background: gold.glow }}>
              <p className="text-[9px] uppercase tracking-[0.3em]" style={{ color: gold.light }}>Reach us directly</p>
              {[
                { icon: <MapPin size={13} />, label: 'Our Studio',     value: 'Nairobi, Kenya' },
                { icon: <Mail size={13} />,   label: 'Direct Email',   value: 'hello@eventsdistrict.com', href: 'mailto:hello@eventsdistrict.com' },
                { icon: <Phone size={13} />,  label: "Let's Talk",     value: '+254 700 000 000',          href: 'tel:+254700000000' },
                { icon: <Clock size={13} />,  label: 'Hours',          value: 'Mon–Fri 9AM–6PM · Sat 10AM–4PM' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: gold.metallic }}>
                    <span style={{ color: '#1a1400' }}>{item.icon}</span>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-foreground/38 mb-0.5">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-sm text-foreground/65 hover:text-foreground transition-colors">{item.value}</a>
                    ) : (
                      <p className="text-sm text-foreground/65">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Social icons */}
              <div className="flex gap-2 pt-1 border-t" style={{ borderColor: gold.border }}>
                {[
                  { icon: <Instagram size={13} />, href: 'https://instagram.com' },
                  { icon: <Twitter size={13} />,   href: 'https://twitter.com' },
                  { icon: <Facebook size={13} />,  href: 'https://facebook.com' },
                  { icon: <MessageCircle size={13} />, href: 'https://wa.me/254700000000' },
                ].map((s, i) => (
                  <a
                    key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full border flex items-center justify-center text-foreground/40 hover:text-foreground transition-all"
                    style={{ borderColor: gold.border }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick consult card */}
            <div className="rounded-2xl p-5 border" style={{ borderColor: gold.border, background: gold.glow }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center mb-3" style={{ background: gold.metallic }}>
                <Sparkles size={13} style={{ color: '#1a1400' }} />
              </div>
              <h4 className="text-sm font-light text-foreground mb-1.5">Prefer a call first?</h4>
              <p className="text-xs text-foreground/50 leading-relaxed mb-4">
                Schedule a free 30-minute discovery call with our lead designers.
              </p>
              <Link href="/contact?type=consultation" className="block w-full py-2.5 text-center text-[10px] uppercase tracking-widest font-bold rounded-full text-black" style={{ background: gold.metallic }}>
                Reserve a Slot
              </Link>
            </div>

            {/* Quick reassurance */}
            <div className="space-y-2 px-1">
              {['✦ Reply within 24 hours, guaranteed', '✦ No commitment required', '✦ Transparent itemised pricing'].map(t => (
                <p key={t} className="text-[9px] uppercase tracking-wider text-foreground/30">{t}</p>
              ))}
            </div>
          </motion.div>

          {/* Right: two-step form */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="rounded-2xl overflow-hidden border" style={{ borderColor: gold.border }}>
              <GoldRule />
              <div className="p-6 md:p-10">

                <AnimatePresence mode="wait">

                  {/* ── Step 1: event type ── */}
                  {step === 1 && (
                    <motion.form
                      key="step1"
                      initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
                      onSubmit={handleStep1}
                    >
                      <StepDots step={1} />
                      <h2 className="text-xl font-light text-foreground mb-1">Tell us about your event</h2>
                      <p className="text-sm text-foreground/45 mb-8 leading-relaxed">Just two quick things — no typing required.</p>

                      {/* Event type visual selector */}
                      <div className="mb-7">
                        <label className="block text-[9px] uppercase tracking-[0.3em] text-foreground/40 mb-3">What type of event?</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {EVENT_TYPES.map(type => (
                            <button
                              key={type} type="button"
                              onClick={() => setForm(f => ({ ...f, eventType: type }))}
                              className="py-2.5 px-3 rounded-xl text-xs border text-left transition-all duration-200"
                              style={{
                                borderColor: form.eventType === type ? gold.light : gold.border,
                                background:  form.eventType === type ? gold.metallic : 'transparent',
                                color:       form.eventType === type ? 'black' : undefined,
                              }}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Custom event description */}
                      <AnimatePresence>
                        {form.eventType === 'Other' && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mb-7"
                          >
                            <input
                              type="text" placeholder="Describe your event..."
                              value={form.customEvent} onChange={update('customEvent')}
                              className="w-full bg-transparent border-b border-foreground/20 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground transition-colors"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Date + guests */}
                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div>
                          <label className="block text-[9px] uppercase tracking-[0.3em] text-foreground/38 mb-2">Event date <span className="normal-case tracking-normal opacity-50">(optional)</span></label>
                          <input
                            type="date" min={minDate} value={form.eventDate} onChange={update('eventDate')}
                            className={`w-full bg-transparent border-b border-foreground/20 py-3 text-sm focus:outline-none focus:border-foreground transition-colors ${form.eventDate ? 'text-foreground' : 'text-foreground/30'}`}
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase tracking-[0.3em] text-foreground/38 mb-2">Guest count <span className="normal-case tracking-normal opacity-50">(approx.)</span></label>
                          <input
                            type="text" inputMode="numeric" placeholder="e.g. 150"
                            value={form.guestCount} onChange={update('guestCount')}
                            className="w-full bg-transparent border-b border-foreground/20 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground transition-colors"
                          />
                        </div>
                      </div>

                      <button
                        type="submit" disabled={!form.eventType}
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-full text-[10px] uppercase tracking-widest font-bold text-black disabled:opacity-35 disabled:cursor-not-allowed transition-all"
                        style={{ background: form.eventType ? gold.metallic : gold.border, boxShadow: form.eventType ? `0 4px 20px ${gold.shadow}` : 'none' }}
                      >
                        Continue <ArrowRight size={12} />
                      </button>
                    </motion.form>
                  )}

                  {/* ── Step 2: contact details ── */}
                  {step === 2 && (
                    <motion.form
                      key="step2"
                      initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
                      onSubmit={handleSubmit}
                    >
                      <StepDots step={2} />

                      {/* Summary chip */}
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs" style={{ background: gold.metallic, color: 'black' }}>
                        <Sparkles size={10} />
                        {form.eventType === 'Other' ? form.customEvent || 'Custom Event' : form.eventType}
                        {form.guestCount ? ` · ${form.guestCount} guests` : ''}
                        {form.eventDate ? ` · ${new Date(form.eventDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}` : ''}
                      </div>

                      <h2 className="text-xl font-light text-foreground mb-1">How do we reach you?</h2>
                      <p className="text-sm text-foreground/45 mb-8 leading-relaxed">We'll reply within 24 hours with a tailored concept and pricing.</p>

                      {error && (
                        <div className="mb-5 px-4 py-3 rounded-xl text-xs text-red-400 border border-red-500/20 bg-red-500/8">{error}</div>
                      )}

                      <div className="space-y-6 mb-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {[
                            { k: 'name',  label: 'Your Name',      type: 'text',  req: true,  ph: 'Your full name' },
                            { k: 'email', label: 'Email Address',  type: 'email', req: true,  ph: 'you@example.com' },
                          ].map(f => (
                            <div key={f.k} className="relative group">
                              <label className="block text-[9px] uppercase tracking-[0.3em] text-foreground/38 mb-2">{f.label}{f.req && ' *'}</label>
                              <input
                                type={f.type} required={f.req} placeholder={f.ph}
                                value={(form as any)[f.k]} onChange={update(f.k as any)}
                                className="w-full bg-transparent border-b border-foreground/20 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground transition-colors"
                              />
                              <div className="absolute bottom-0 left-0 h-px bg-foreground w-0 group-focus-within:w-full transition-all duration-500" />
                            </div>
                          ))}
                        </div>

                        <div className="relative group">
                          <label className="block text-[9px] uppercase tracking-[0.3em] text-foreground/38 mb-2">Phone <span className="normal-case tracking-normal opacity-50">(optional)</span></label>
                          <input
                            type="tel" placeholder="+254 700 000 000"
                            value={form.phone} onChange={update('phone')}
                            className="w-full bg-transparent border-b border-foreground/20 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground transition-colors"
                          />
                          <div className="absolute bottom-0 left-0 h-px bg-foreground w-0 group-focus-within:w-full transition-all duration-500" />
                        </div>

                        <div className="relative group">
                          <label className="block text-[9px] uppercase tracking-[0.3em] text-foreground/38 mb-2">Your Vision *</label>
                          <textarea
                            required rows={4} placeholder="Share your vision, theme, venue, or any specific requirements..."
                            value={form.message} onChange={update('message')}
                            className="w-full bg-transparent border-b border-foreground/20 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground transition-colors resize-none"
                          />
                          <div className="absolute bottom-0 left-0 h-px bg-foreground w-0 group-focus-within:w-full transition-all duration-500" />
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          type="button" onClick={() => setStep(1)}
                          className="sm:w-auto px-5 py-3.5 rounded-full text-[10px] uppercase tracking-widest font-medium text-foreground border transition-all"
                          style={{ borderColor: gold.border }}
                        >
                          ← Back
                        </button>
                        <button
                          type="submit" disabled={submitting}
                          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full text-[10px] uppercase tracking-widest font-bold text-black disabled:opacity-60"
                          style={{ background: gold.metallic, boxShadow: `0 4px 20px ${gold.shadow}` }}
                        >
                          {submitting ? (
                            <>
                              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} className="w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full" />
                              Sending…
                            </>
                          ) : (
                            <>Send Inquiry <Send size={11} /></>
                          )}
                        </button>
                      </div>

                      <p className="text-[9px] text-foreground/25 mt-4 text-center">
                        By submitting you agree to our privacy policy. We never share your details.
                      </p>
                    </motion.form>
                  )}

                  {/* ── Done ── */}
                  {step === 'done' && (
                    <motion.div
                      key="done"
                      initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                      className="py-10 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
                        className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center"
                        style={{ background: gold.metallic }}
                      >
                        <Check size={20} style={{ color: '#1a1400' }} />
                      </motion.div>
                      <h2 className="text-2xl font-light text-foreground mb-3">Inquiry received.</h2>
                      <p className="text-sm text-foreground/50 leading-relaxed mb-2 max-w-sm mx-auto">
                        Thank you, <strong className="text-foreground/75">{form.name.split(' ')[0] || 'there'}</strong>.
                        We'll review your <strong className="text-foreground/75">{(form.eventType === 'Other' ? form.customEvent : form.eventType).toLowerCase()}</strong>{' '}
                        inquiry and respond within 24 hours with a tailored concept.
                      </p>
                      <p className="text-xs text-foreground/35 mb-8">Check your inbox for an auto-reply confirmation.</p>

                      <div className="flex flex-col gap-3 max-w-xs mx-auto">
                        <Link
                          href="/quote"
                          className="block py-3 rounded-full text-[10px] uppercase tracking-widest font-bold text-black text-center"
                          style={{ background: gold.metallic }}
                        >
                          While you wait — get a quote
                        </Link>
                        <button
                          onClick={reset}
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

        {/* Bottom quote CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-14 rounded-2xl border p-8 md:p-10"
          style={{ borderColor: gold.border, background: gold.glow }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-6 h-px" style={{ background: gold.metallic }} />
                <span className="text-[9px] uppercase tracking-[0.3em]" style={{ color: gold.light }}>Need an instant estimate?</span>
              </div>
              <h3 className="text-xl font-light text-foreground mb-1">Wedding Quote Engine</h3>
              <p className="text-sm text-foreground/50 leading-relaxed max-w-md">
                Get live pricing based on your exact guest count — no waiting, no vague numbers.
              </p>
            </div>
            <Link
              href="/quote"
              className="flex-shrink-0 inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest text-black"
              style={{ background: gold.metallic, boxShadow: `0 6px 24px ${gold.shadow}` }}
            >
              <Calculator size={12} /> Calculate Your Quote
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
