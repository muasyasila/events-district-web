"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Instagram, Twitter, Facebook, Mail, Phone, MapPin, Send, Heart, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Gold palette ─────────────────────────────────────────────────────────────
const gold = {
  light:    '#D4AF37',
  metallic: 'linear-gradient(135deg, #D4AF37 0%, #FFF2A8 50%, #D4AF37 100%)',
  shadow:   'rgba(212, 175, 55, 0.18)',
  glow:     'rgba(212, 175, 55, 0.07)',
  border:   'rgba(212, 175, 55, 0.22)',
}

// Flat service list — no dropdowns in footer (reduces cognitive load)
const SERVICE_LINKS = [
  { name: 'Wedding Décor', href: '/quote', badge: 'Instant Quote' },
  { name: 'Birthday Celebrations', href: '/contact' },
  { name: 'Corporate Galas', href: '/contact' },
  { name: 'Graduation Parties', href: '/contact' },
  { name: 'Picnic Dates', href: '/contact' },
  { name: 'Baby Showers', href: '/contact' },
  { name: 'Product Launches', href: '/contact' },
  { name: 'Award Ceremonies', href: '/contact' },
  { name: 'Community Festivals', href: '/contact' },
  { name: 'Private Dining', href: '/contact' },
  { name: 'All Services →', href: '/services' },
]

const QUICK_LINKS = [
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'The Journal', href: '/blog' },
  { name: 'Wedding Quote', href: '/quote' },
  { name: 'Free Planning Checklist', href: '/#get-quote' },
  { name: 'About Us', href: '/#about' },
  { name: 'Contact', href: '/contact' },
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Terms of Service', href: '/terms' },
]

const SOCIALS = [
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com', hoverColor: '#E1306C' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com', hoverColor: '#1DA1F2' },
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com', hoverColor: '#4267B2' },
  { name: 'Email', icon: Mail, href: 'mailto:hello@eventsdistrict.com', hoverColor: gold.light },
]

function GoldRule({ className = '' }: { className?: string }) {
  return <div className={`h-px flex-shrink-0 ${className}`} style={{ background: gold.metallic }} />
}

export default function LuxuryFooter() {
  const [email, setEmail] = useState('')
  const [subState, setSubState] = useState<'idle' | 'loading' | 'done'>('idle')

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubState('loading')
    await new Promise(r => setTimeout(r, 800))
    setSubState('done')
    setEmail('')
    setTimeout(() => setSubState('idle'), 4000)
  }

  const year = new Date().getFullYear()

  return (
    <footer className="relative bg-background overflow-hidden border-t" style={{ borderColor: gold.border }}>
      {/* Gold rule at very top */}
      <GoldRule />

      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full" style={{ background: `radial-gradient(circle, ${gold.glow} 0%, transparent 70%)` }} />
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full" style={{ background: `radial-gradient(circle, ${gold.glow} 0%, transparent 70%)` }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-14 md:py-20">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12 md:mb-16">

          {/* Col 1: Brand */}
          <div className="space-y-5">
            {/* Logo */}
            <Link href="/" className="group inline-flex items-baseline gap-0.5">
              <span className="text-lg font-light tracking-[0.15em] uppercase text-foreground">Events</span>
              <span
                className="text-lg font-bold tracking-[0.15em] uppercase bg-clip-text text-transparent"
                style={{ backgroundImage: gold.metallic, WebkitBackgroundClip: 'text' }}
              >
                District
              </span>
            </Link>

            <p className="text-sm text-foreground/50 font-light leading-relaxed">
              Creating extraordinary moments through exceptional design. 
              We transform your vision into unforgettable experiences — 
              across Kenya and beyond.
            </p>

            {/* Social icons */}
            <div className="flex gap-2.5 pt-1">
              {SOCIALS.map(s => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="group/social w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-200 hover:scale-105"
                  style={{ borderColor: gold.border }}
                >
                  <s.icon size={14} className="text-foreground/45 transition-colors group-hover/social:text-foreground" />
                </a>
              ))}
            </div>

            {/* Contact info */}
            <div className="space-y-2.5 pt-2 border-t" style={{ borderColor: gold.border }}>
              {[
                { icon: <Mail size={12} />, text: 'hello@eventsdistrict.com', href: 'mailto:hello@eventsdistrict.com' },
                { icon: <Phone size={12} />, text: '+254 700 000 000', href: 'tel:+254700000000' },
                { icon: <MapPin size={12} />, text: 'Nairobi, Kenya', href: undefined },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <span style={{ color: gold.light }}>{item.icon}</span>
                  {item.href ? (
                    <a href={item.href} className="text-xs text-foreground/50 hover:text-foreground transition-colors">{item.text}</a>
                  ) : (
                    <span className="text-xs text-foreground/50">{item.text}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Col 2: Services — flat list */}
          <div>
            <h5 className="text-[9px] uppercase tracking-[0.35em] mb-5" style={{ color: gold.light }}>Services</h5>
            <ul className="space-y-2.5">
              {SERVICE_LINKS.map(link => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm text-foreground/55 hover:text-foreground transition-colors"
                  >
                    <span>{link.name}</span>
                    {link.badge && (
                      <span
                        className="text-[7px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider"
                        style={{ background: gold.metallic, color: 'black' }}
                      >
                        {link.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Quick links */}
          <div>
            <h5 className="text-[9px] uppercase tracking-[0.35em] mb-5" style={{ color: gold.light }}>Quick Links</h5>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(link => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-foreground/55 hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Newsletter + CTA */}
          <div className="space-y-6">
            <div>
              <h5 className="text-[9px] uppercase tracking-[0.35em] mb-2" style={{ color: gold.light }}>Newsletter</h5>
              <p className="text-sm text-foreground/50 font-light mb-4 leading-relaxed">
                Monthly inspiration, planning tips, and exclusive offers. No spam.
              </p>

              <AnimatePresence mode="wait">
                {subState === 'done' ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-sm"
                    style={{ color: gold.light }}
                  >
                    <Heart size={13} fill={gold.light} />
                    Welcome to the inner circle!
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onSubmit={handleSubscribe}
                    className="flex gap-2"
                  >
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="flex-1 bg-transparent border-b border-foreground/20 py-2 text-sm text-foreground placeholder:text-foreground/35 focus:outline-none focus:border-foreground transition-colors min-w-0"
                    />
                    <button
                      type="submit"
                      disabled={subState === 'loading'}
                      className="p-2 rounded-full transition-all hover:scale-105 flex-shrink-0"
                      style={{ background: gold.metallic }}
                      aria-label="Subscribe"
                    >
                      {subState === 'loading' ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full" />
                      ) : (
                        <Send size={14} style={{ color: '#1a1400' }} />
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
              <p className="text-[9px] text-foreground/28 mt-2">Unsubscribe anytime.</p>
            </div>

            {/* Footer CTA */}
            <div
              className="rounded-xl p-4 border"
              style={{ borderColor: gold.border, background: gold.glow }}
            >
              <p className="text-xs text-foreground/50 mb-3 leading-snug">
                Ready to start planning? Get an instant quote for your wedding.
              </p>
              <Link
                href="/quote"
                className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold"
                style={{ color: gold.light }}
              >
                Get Wedding Quote <ArrowRight size={10} />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-7 border-t"
          style={{ borderColor: gold.border }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-foreground/35 order-2 md:order-1">
              © {year} Events District. All rights reserved.
            </p>

            {/* Legal links */}
            <div className="flex flex-wrap justify-center gap-5 text-xs text-foreground/35 order-1 md:order-2">
              {['About Us', 'Portfolio', 'Privacy Policy', 'Terms of Service'].map(item => (
                <Link key={item} href={`/${item.toLowerCase().replace(/ /g, '-')}`} className="hover:text-foreground transition-colors">
                  {item}
                </Link>
              ))}
            </div>

            <p className="text-[10px] text-foreground/28 order-3">
              Made by{' '}
              <span className="text-foreground/40 hover:text-foreground transition-colors cursor-default">
                Muasya Sila
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
