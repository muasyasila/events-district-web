"use client"

import React, { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Star, CheckCircle2, Users, Calendar, Heart, Sparkles } from 'lucide-react'

// ─── Gold palette ─────────────────────────────────────────────────────────────
const gold = {
  light:    '#D4AF37',
  metallic: 'linear-gradient(135deg, #D4AF37 0%, #FFF2A8 50%, #D4AF37 100%)',
  shadow:   'rgba(212, 175, 55, 0.18)',
  glow:     'rgba(212, 175, 55, 0.07)',
  border:   'rgba(212, 175, 55, 0.22)',
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

const MILESTONES = [
  { year: '2014', title: 'Founded in Nairobi', desc: 'Started with a single wedding in Karen — 80 guests, a rented arch, and a vision for what luxury events in Kenya could look like.' },
  { year: '2016', title: 'First Corporate Contract', desc: 'Secured our first corporate gala for a Nairobi-based multinational. Proved that luxury event design wasn\'t just for weddings.' },
  { year: '2019', title: '100th Event', desc: 'Celebrated our 100th event — a landmark that confirmed we were building something real. The client cried at the reveal. So did we.' },
  { year: '2022', title: 'Regional Expansion', desc: 'Extended operations to Mombasa, Kisumu, and cross-border events in Tanzania and Uganda. The vision grew beyond Nairobi.' },
  { year: '2024', title: '500+ Events', desc: 'Over 500 events designed. Every single one different. Every single one built around one question: how do we make this person feel something unforgettable?' },
]

const VALUES = [
  {
    title: 'Detail is everything.',
    desc: 'We notice what others overlook — the angle of a centrepiece, the temperature of a lighting rig, the way a tablecloth drapes. These micro-decisions are what separate memorable from forgettable.',
    icon: <Sparkles size={16} />,
  },
  {
    title: 'Transparency first.',
    desc: 'No vague quotes. No surprise invoices. We tell you exactly what you\'re getting, exactly what it costs, and exactly why. Pricing you can present to your partner without a conversation.',
    icon: <CheckCircle2 size={16} />,
  },
  {
    title: 'Your story, not ours.',
    desc: 'We design for you, not for our portfolio. Every brief starts with listening. We want to understand your relationship, your aesthetic, your non-negotiables — before we suggest a single concept.',
    icon: <Heart size={16} />,
  },
  {
    title: 'Presence on the day.',
    desc: 'We don\'t hand over the keys and disappear. Our team is on-site from setup to breakdown. You walk in and feel exactly what you imagined — because we stayed to make sure of it.',
    icon: <Users size={16} />,
  },
]

const TEAM = [
  {
    name: 'Amelia Wanjiru',
    role: 'Creative Director & Founder',
    bio: '10+ years of luxury event design. Former set designer turned event architect. Every space she designs tells a story first, and looks beautiful second.',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    events: '300+ events led',
  },
  {
    name: 'Brian Ochieng',
    role: 'Head of Production',
    bio: 'The logistics genius behind the magic. Brian has never missed a setup deadline in six years. He treats every event like a military operation — with considerably better aesthetics.',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    events: '200+ events produced',
  },
  {
    name: 'Fatuma Hassan',
    role: 'Lead Floral Designer',
    bio: 'Trained in Nairobi and Amsterdam. Fatuma works with seasonal, locally sourced flowers wherever possible. Her installations have been photographed for three international publications.',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    events: '180+ floral designs',
  },
  {
    name: 'James Kariuki',
    role: 'Corporate Events Lead',
    bio: 'Background in brand strategy before event design. James understands that corporate events are brand experiences first. He bridges the gap between marketing brief and physical space.',
    avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
    events: '150+ corporate events',
  },
]

const STATS = [
  { value: '500+', label: 'Events Delivered', sub: 'since 2014' },
  { value: '10+', label: 'Years of Expertise', sub: 'in luxury décor' },
  { value: '4.9★', label: 'Average Rating', sub: 'from 150+ clients' },
  { value: '4', label: 'Cities Active', sub: 'Nairobi · Mombasa · Kisumu + beyond' },
]

export default function AboutPage() {
  const heroRef  = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY    = useTransform(scrollYProgress, [0, 1], [0, 80])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  const storyRef = useRef<HTMLDivElement>(null)
  const storyInView = useInView(storyRef, { once: true, margin: '-8%' })

  const valuesRef = useRef<HTMLDivElement>(null)
  const valuesInView = useInView(valuesRef, { once: true, margin: '-8%' })

  const teamRef = useRef<HTMLDivElement>(null)
  const teamInView = useInView(teamRef, { once: true, margin: '-8%' })

  const statsRef = useRef<HTMLDivElement>(null)
  const statsInView = useInView(statsRef, { once: true, margin: '-8%' })

  return (
    <main className="bg-background text-foreground overflow-hidden">

      {/* Gold top rule */}
      <GoldRule />

      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full" style={{ background: `radial-gradient(circle, ${gold.glow} 0%, transparent 70%)` }} />
        <div className="absolute bottom-1/3 left-0 w-96 h-96 rounded-full" style={{ background: `radial-gradient(circle, ${gold.glow} 0%, transparent 70%)` }} />
      </div>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center pt-24 pb-20 px-6 md:px-12 overflow-hidden">
        {/* Parallax background image */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 -z-10">
          <img
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=2000"
            alt="Events District event"
            className="w-full h-full object-cover opacity-[0.07]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 to-background" />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="max-w-6xl mx-auto w-full"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            >
              <SectionLabel>Our Story</SectionLabel>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-foreground leading-[1.0] mt-4 mb-6">
                We don't<br />decorate.{' '}
                <span
                  className="italic bg-clip-text text-transparent"
                  style={{ backgroundImage: gold.metallic, WebkitBackgroundClip: 'text' }}
                >
                  We design feelings.
                </span>
              </h1>
              <p className="text-base md:text-lg text-foreground/55 leading-relaxed max-w-md">
                Events District was founded on a simple belief: the spaces we inhabit shape how we feel.
                We exist to make those spaces unforgettable.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
              className="relative"
            >
              {/* Stacked images */}
              <div className="relative">
                <div
                  className="absolute -top-4 -right-4 w-48 h-64 rounded-2xl overflow-hidden border"
                  style={{ borderColor: gold.border }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=400"
                    alt="Events District team at work"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border"
                  style={{ borderColor: gold.border, boxShadow: `0 20px 60px ${gold.shadow}` }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800"
                    alt="Events District luxury event"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  {/* Floating badge */}
                  <div
                    className="absolute bottom-5 left-5 px-4 py-2.5 rounded-xl"
                    style={{ background: gold.metallic }}
                  >
                    <p className="text-[9px] uppercase tracking-[0.3em] text-black/60 mb-0.5">Based in</p>
                    <p className="text-sm font-bold text-black">Nairobi, Kenya</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── Founding story ─────────────────────────────────────────────────── */}
      <section className="border-t py-20 md:py-28 px-6 md:px-12" style={{ borderColor: gold.border }}>
        <div ref={storyRef} className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={storyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="grid md:grid-cols-2 gap-12 md:gap-20 items-start"
          >
            <div>
              <SectionLabel>How it started</SectionLabel>
              <h2 className="text-3xl md:text-4xl font-light text-foreground leading-[1.1] mt-4 mb-6">
                One wedding.{' '}
                <span className="italic" style={{ color: gold.light }}>A thousand lessons.</span>
              </h2>
              <div className="space-y-4 text-sm md:text-base text-foreground/60 leading-relaxed font-light">
                <p>
                  In 2014, our founder Amelia Wanjiru was hired to style her cousin's wedding in Karen.
                  The budget was tight. The venue was a borrowed garden. The brief was three words:
                  "make it beautiful."
                </p>
                <p>
                  She spent three weeks sourcing wildflowers from local markets, hand-building a ceremony arch
                  from eucalyptus branches, and pressing table linens herself the night before. When the bride
                  walked in, she cried.
                </p>
                <p>
                  Not because it was expensive. Because it felt like <em>her</em>.
                </p>
                <p>
                  That moment — that specific gap between what most event companies deliver and what a person
                  actually feels on their most important day — became the founding thesis of Events District.
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-6">
              {MILESTONES.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 16 }}
                  animate={storyInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-black text-[9px] font-bold"
                      style={{ background: gold.metallic }}
                    >
                      {m.year.slice(2)}
                    </div>
                    {i < MILESTONES.length - 1 && (
                      <div className="w-px flex-1 mt-2" style={{ background: gold.border, minHeight: 24 }} />
                    )}
                  </div>
                  <div className="pb-6">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] uppercase tracking-[0.3em]" style={{ color: gold.light }}>{m.year}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground mb-1">{m.title}</p>
                    <p className="text-sm text-foreground/50 leading-relaxed font-light">{m.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats strip ────────────────────────────────────────────────────── */}
      <div
        ref={statsRef}
        className="border-y py-12 md:py-14"
        style={{ borderColor: gold.border, background: gold.glow }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div
                  className="text-3xl md:text-4xl font-light mb-1.5 bg-clip-text text-transparent"
                  style={{ backgroundImage: gold.metallic, WebkitBackgroundClip: 'text' }}
                >
                  {s.value}
                </div>
                <p className="text-xs font-medium text-foreground">{s.label}</p>
                <p className="text-[10px] text-foreground/38 mt-0.5">{s.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Values ─────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-6 md:px-12 border-b" style={{ borderColor: gold.border }}>
        <div ref={valuesRef} className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="mb-12"
          >
            <SectionLabel>How we work</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-light text-foreground mt-4">
              The principles behind{' '}
              <span className="italic" style={{ color: gold.light }}>every event we design.</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
            {VALUES.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 md:p-8 rounded-2xl border"
                style={{ borderColor: gold.border, background: gold.glow }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center mb-5"
                  style={{ background: gold.metallic }}
                >
                  <span style={{ color: '#1a1400' }}>{v.icon}</span>
                </div>
                <h3 className="text-lg font-light text-foreground mb-3">{v.title}</h3>
                <p className="text-sm text-foreground/55 leading-relaxed font-light">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ───────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-6 md:px-12 border-b" style={{ borderColor: gold.border }}>
        <div ref={teamRef} className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={teamInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="mb-12"
          >
            <SectionLabel>The people</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-light text-foreground mt-4">
              The team behind{' '}
              <span className="italic" style={{ color: gold.light }}>the moments.</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {TEAM.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={teamInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group"
              >
                <div
                  className="rounded-2xl overflow-hidden border transition-all duration-300 group-hover:border-amber-500/30"
                  style={{ borderColor: gold.border }}
                >
                  {/* Avatar */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <span
                        className="text-[8px] px-2.5 py-1 rounded-full font-medium"
                        style={{ background: gold.metallic, color: 'black' }}
                      >
                        {member.events}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5" style={{ background: gold.glow }}>
                    <p className="text-sm font-medium text-foreground mb-0.5">{member.name}</p>
                    <p className="text-[10px] uppercase tracking-wider mb-3" style={{ color: gold.light }}>{member.role}</p>
                    <p className="text-xs text-foreground/50 leading-relaxed font-light">{member.bio}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonial pull-quote ─────────────────────────────────────────── */}
      <section className="py-20 md:py-24 px-6 md:px-12 border-b" style={{ borderColor: gold.border }}>
        <div className="max-w-4xl mx-auto text-center">
          <GoldRule className="w-12 mx-auto mb-10" />
          <p className="text-2xl md:text-3xl lg:text-4xl font-light text-foreground leading-relaxed mb-6">
            "They didn't just design our wedding. They made us feel like the most important people in the world for an entire day."
          </p>
          <div className="flex items-center justify-center gap-3">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="Amara Mensah"
              className="w-9 h-9 rounded-full object-cover"
              style={{ border: `1.5px solid ${gold.light}` }}
            />
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">Amara & Kofi Mensah</p>
              <p className="text-[10px] uppercase tracking-wider text-foreground/40">Garden Wedding · Nairobi, 2024</p>
            </div>
            <div className="flex items-center gap-0.5 ml-3">
              {[...Array(5)].map((_, i) => <Star key={i} size={11} fill={gold.light} color={gold.light} />)}
            </div>
          </div>
          <GoldRule className="w-12 mx-auto mt-10" />
        </div>
      </section>

      {/* ── Why choose us checklist ────────────────────────────────────────── */}
      <section className="py-20 md:py-24 px-6 md:px-12 border-b" style={{ borderColor: gold.border, background: gold.glow }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div>
              <SectionLabel>Why us</SectionLabel>
              <h2 className="text-3xl md:text-4xl font-light text-foreground mt-4 mb-8">
                What working with us actually looks like.
              </h2>
              <div className="space-y-4">
                {[
                  'Same-day wedding quote — live pricing, no guesswork',
                  'Dedicated event manager from consultation to completion',
                  'Full setup and breakdown included in every package',
                  'Flexible payment plans available',
                  'Response within 24 hours, guaranteed',
                  'On-site team presence throughout your event',
                  '100% satisfaction or we make it right',
                ].map((point, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" style={{ color: gold.light }} />
                    <span className="text-sm text-foreground/70">{point}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA panel */}
            <div className="space-y-4">
              <div className="rounded-2xl p-7 border" style={{ borderColor: gold.border, background: 'rgba(255,255,255,0.02)' }}>
                <p className="text-[9px] uppercase tracking-[0.3em] mb-2" style={{ color: gold.light }}>Ready to work together?</p>
                <h3 className="text-xl font-light text-foreground mb-3">Start with a free consultation.</h3>
                <p className="text-sm text-foreground/50 leading-relaxed mb-6">
                  30 minutes. No obligation. We'll listen to your vision, answer every question, and tell you honestly if we're the right fit.
                </p>
                <Link
                  href="/contact"
                  className="block w-full py-3.5 text-center text-[10px] uppercase tracking-widest font-bold rounded-full text-black"
                  style={{ background: gold.metallic, boxShadow: `0 4px 20px ${gold.shadow}` }}
                >
                  Book Free Consultation
                </Link>
              </div>

              <div className="rounded-2xl p-6 border" style={{ borderColor: gold.border }}>
                <p className="text-[9px] uppercase tracking-[0.3em] mb-2" style={{ color: gold.light }}>Planning a wedding?</p>
                <h3 className="text-base font-light text-foreground mb-2">See your exact price right now.</h3>
                <p className="text-xs text-foreground/45 mb-4 leading-relaxed">
                  Live pricing from our actual inventory — enter your guest count, get real numbers instantly.
                </p>
                <Link
                  href="/quote"
                  className="inline-flex items-center gap-2 text-xs font-medium group/q"
                  style={{ color: gold.light }}
                >
                  <span className="underline underline-offset-4 group-hover/q:no-underline transition-all">Get Instant Wedding Quote</span>
                  <ArrowRight size={10} className="group-hover/q:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <GoldRule className="w-12 mx-auto mb-10" />
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground leading-[1.05] mb-6">
            Your event deserves{' '}
            <span
              className="italic bg-clip-text text-transparent"
              style={{ backgroundImage: gold.metallic, WebkitBackgroundClip: 'text' }}
            >
              more than décor.
            </span>
          </h2>
          <p className="text-base text-foreground/50 leading-relaxed mb-10 max-w-xl mx-auto">
            It deserves a feeling. One your guests carry home and talk about for years. That's what we design.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest text-black"
              style={{ background: gold.metallic, boxShadow: `0 6px 28px ${gold.shadow}` }}
            >
              Start a Conversation <ArrowRight size={12} />
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs font-medium uppercase tracking-widest text-foreground border transition-all hover:border-amber-500/40"
              style={{ borderColor: gold.border }}
            >
              View Our Work
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
