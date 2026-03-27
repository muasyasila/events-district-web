// components/sections/LeadMagnet.tsx

"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Download, Mail, Sparkles, Gift, Clock, Heart, X, Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { sendChecklistEmail } from '@/app/actions/email'
import styles from './LeadMagnet.module.css'

const checklistItems = [
  "12-Month Planning Timeline",
  "Vendor Comparison Spreadsheet",
  "Budget Allocation Calculator",
  "Venue Visit Checklist",
  "Questions to Ask Your Florist",
  "Questions to Ask Your Caterer",
  "Questions to Ask Your Photographer",
  "Decor Inspiration Mood Board Template",
  "Day-Of Emergency Kit List",
  "Guest List Manager",
  "Seating Chart Planner",
  "Final Week Countdown"
]

export default function LeadMagnet() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [weddingDate, setWeddingDate] = useState("")
  const [step, setStep] = useState<"form" | "success">("form")
  const [isLoading, setIsLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get tomorrow's date for min date attribute
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      // Save to Supabase with all tracking columns
      const { error: supabaseError } = await supabase
        .from('leads')
        .insert([{
          name: name.trim(),
          email: email.trim(),
          event_date: weddingDate || null,
          event_type: 'wedding',
          source: 'checklist_download',
          status: 'new',
          email_sent_week1: false,
          email_sent_week2: false,
          email_sent_month1: false,
          email_sent_month2: false,
          email_sent_month3: false,
          notes: `Downloaded wedding planning checklist${weddingDate ? ` - Wedding Date: ${weddingDate}` : ''}`
        }])
      
      if (supabaseError) {
        console.error('Error saving lead:', supabaseError)
        setError('Something went wrong. Please try again.')
        setIsLoading(false)
        return
      }
      
      // Send welcome email with checklist
      const emailResult = await sendChecklistEmail(email.trim(), name.trim())
      
      if (!emailResult.success) {
        console.error('Email error:', emailResult.error)
        // Don't show error to user - they still get the download
      }
      
      // Also save to localStorage as backup (optional)
      const leads = JSON.parse(localStorage.getItem('weddingLeads') || '[]')
      leads.push({
        name,
        email,
        weddingDate,
        date: new Date().toISOString(),
        source: 'checklist_download'
      })
      localStorage.setItem('weddingLeads', JSON.stringify(leads))
      
      setIsLoading(false)
      setStep("success")
      
      // Trigger download
      setTimeout(() => {
        downloadChecklist()
      }, 500)
      
    } catch (err) {
      console.error('Error:', err)
      setError('Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  const downloadChecklist = () => {
    // Create PDF content (in production, this would be a real PDF)
    const content = `
THE ULTIMATE WEDDING PLANNING CHECKLIST
By Events District

Congratulations on your engagement! This comprehensive checklist will guide you through every step of planning your perfect day.

CONTENTS:
${checklistItems.map(item => `• ${item}`).join('\n')}

---

12-MONTH PLANNING TIMELINE:

12 Months Before:
□ Set your budget
□ Create guest list draft
□ Choose wedding style/theme
□ Book venue
□ Start vendor research

11 Months Before:
□ Book photographer
□ Book videographer
□ Book caterer
□ Book florist
□ Shop for wedding dress

10 Months Before:
□ Book entertainment/DJ
□ Book officiant
□ Choose wedding party
□ Register for gifts
□ Book transportation

9 Months Before:
□ Send save-the-dates
□ Order wedding dress
□ Book rehearsal dinner venue
□ Book wedding planner
□ Book hair and makeup artist

8 Months Before:
□ Finalize guest list
□ Order wedding bands
□ Book honeymoon
□ Plan bridal shower
□ Book rentals (tables, chairs, linens)

7 Months Before:
□ Send invitations
□ Schedule cake tasting
□ Schedule menu tasting
□ Book florist
□ Book transportation

6 Months Before:
□ Plan ceremony details
□ Book musicians
□ Choose wedding party attire
□ Plan welcome bags
□ Book accommodations for out-of-town guests

5 Months Before:
□ Schedule hair and makeup trial
□ Take engagement photos
□ Write vows
□ Plan ceremony readings
□ Confirm vendor contracts

4 Months Before:
□ Finalize menu
□ Finalize bar selection
□ Plan seating chart
□ Confirm floral arrangements
□ Order wedding favors

3 Months Before:
□ Apply for marriage license
□ Finalize day-of timeline
□ Confirm all vendors
□ Schedule final dress fitting
□ Plan reception entertainment

2 Months Before:
□ Create seating chart
□ Finalize music playlist
□ Write thank you speeches
□ Confirm RSVPs
□ Plan reception flow

1 Month Before:
□ Final guest count
□ Confirm vendor arrival times
□ Pack emergency kit
□ Create place cards
□ Final meeting with vendors

Week Before:
□ Final dress fitting
□ Pick up wedding bands
□ Confirm honeymoon details
□ Pack for wedding day
□ Relax and enjoy

Wedding Day:
□ Eat a good breakfast
□ Trust your vendors
□ Stay present
□ Dance like nobody's watching
□ Soak in every moment

---

This checklist is a gift from Events District.
Ready to turn your vision into reality? Book a complimentary consultation at eventsdistrict.co.ke

© 2024 Events District. All rights reserved.
    `
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'Ultimate-Wedding-Planning-Checklist.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <section id="free-guide" className="relative w-full bg-background py-20 md:py-32 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Side - Value Proposition */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-foreground/5 border border-foreground/10 rounded-full mb-6">
              <Gift className="w-4 h-4 text-foreground/60" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/60 font-medium">
                Free Download
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif italic text-foreground leading-tight mb-6">
              The Wedding Planning Checklist{' '}
              <span className="text-foreground/30">Every Couple Needs</span>
            </h2>

            <p className="text-lg text-foreground/60 font-light leading-relaxed mb-8">
              Stop scrolling through Pinterest at 2 AM. Get the exact 12-month timeline, 
              budget calculator, and vendor questions that have helped 500+ couples 
              plan their dream weddings—without the stress.
            </p>

            {/* Social Proof */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-background bg-foreground/10 overflow-hidden"
                  >
                    <img 
                      src={`https://i.pravatar.cc/100?img=${i + 20}`}
                      alt="Happy couple"
                      className="w-full h-full object-cover grayscale"
                    />
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">2,847+ couples</p>
                <p className="text-xs text-foreground/40">downloaded this week</p>
              </div>
            </div>

            {/* What's Inside Preview */}
            <button
              onClick={() => setShowPreview(true)}
              className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-foreground/40 hover:text-foreground transition-colors"
            >
              <span>See what's inside</span>
              <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            </button>
          </motion.div>

          {/* Right Side - Form Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {step === "form" ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-background border border-foreground/10 p-8 md:p-10 rounded-sm shadow-2xl relative overflow-hidden"
                >
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-foreground/5 to-transparent" />
                  
                  <div className="relative z-10">
                    <h3 className="text-2xl font-serif italic text-foreground mb-2">
                      Get Your Free Checklist
                    </h3>
                    <p className="text-sm text-foreground/50 mb-8 font-light">
                      Enter your details below for instant access
                    </p>

                    {/* Error Message */}
                    {error && (
                      <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded text-sm">
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Name Input with Clear Button */}
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-2">
                          Your Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Sarah & Michael"
                            className="w-full bg-transparent border-b border-foreground/20 py-3 pr-8 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-foreground transition-colors"
                          />
                          {name && (
                            <button
                              type="button"
                              onClick={() => setName("")}
                              className="absolute right-0 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Email Input with Clear Button */}
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full bg-transparent border-b border-foreground/20 py-3 pl-8 pr-8 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-foreground transition-colors"
                          />
                          {email && (
                            <button
                              type="button"
                              onClick={() => setEmail("")}
                              className="absolute right-0 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Date Input with Single Calendar Icon */}
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-2">
                          Wedding Date (Optional)
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 pointer-events-none" />
                          <input
                            type="date"
                            min={minDate}
                            value={weddingDate}
                            onChange={(e) => setWeddingDate(e.target.value)}
                            placeholder="mm/dd/yyyy"
                            className={`w-full bg-transparent border-b border-foreground/20 py-3 pl-8 pr-4 focus:outline-none focus:border-foreground transition-colors ${
                              weddingDate ? 'text-foreground' : 'text-foreground/40'
                            }`}
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-8 py-4 bg-foreground text-background text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-foreground/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
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
                            <Download className="w-4 h-4" />
                            <span>Download Free Checklist</span>
                          </>
                        )}
                      </button>
                    </form>

                    <p className="text-[10px] text-foreground/30 text-center mt-6 leading-relaxed">
                      We respect your privacy. Unsubscribe anytime. 
                      By downloading, you agree to receive wedding planning tips.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-foreground text-background p-10 md:p-12 rounded-sm text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-16 h-16 mx-auto mb-6 rounded-full bg-background/20 flex items-center justify-center"
                  >
                    <Check className="w-8 h-8" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-serif italic mb-4">
                    Check Your Inbox!
                  </h3>
                  
                  <p className="text-background/70 mb-6 font-light">
                    Your Ultimate Wedding Planning Checklist is downloading now. 
                    We've also sent a copy to <strong>{email}</strong>
                  </p>

                  <div className="space-y-3">
                    <button
                      onClick={downloadChecklist}
                      className="w-full py-3 bg-background text-foreground text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-background/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download Again
                    </button>
                    
                    <a
                      href="#consultation"
                      className="block w-full py-3 border border-background/30 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-background/10 transition-colors"
                    >
                      Book Free Consultation
                    </a>
                  </div>

                  <p className="text-[10px] text-background/50 mt-6">
                    Join 2,000+ couples who planned their dream wedding with our help
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-20 pt-12 border-t border-foreground/10"
        >
          <p className="text-center text-[10px] uppercase tracking-[0.3em] text-foreground/30 mb-8">
            As Featured In
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40">
            {['Vogue', 'Harper\'s Bazaar', 'The Knot', 'Martha Stewart', 'Brides'].map((pub) => (
              <span key={pub} className="text-lg font-serif italic text-foreground">
                {pub}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/98 backdrop-blur-xl overflow-y-auto"
          >
            <div className="max-w-2xl mx-auto px-6 py-20">
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-2xl font-serif italic">What's Inside</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-foreground/5 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {checklistItems.map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 p-4 border border-foreground/10 rounded-sm"
                  >
                    <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 text-foreground/60" />
                    </div>
                    <span className="text-foreground/80 font-light">{item}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <button
                  onClick={() => {
                    setShowPreview(false)
                    document.getElementById('free-guide')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-foreground/90 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Get Free Access
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}