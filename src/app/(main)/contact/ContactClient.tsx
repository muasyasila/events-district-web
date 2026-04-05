"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Instagram, 
  Twitter, 
  Facebook,
  Send,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Heart,
  MessageCircle,
  ChevronRight
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { sendContactNotification, sendAutoReply } from '@/app/actions/email'

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    eventType: '',
    message: '',
    phone: '' // Optional, kept but not required
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [submittedName, setSubmittedName] = useState('')

  const supabase = createClient()

  const eventTypes = [
    'Wedding',
    'Engagement Party',
    'Corporate Event',
    'Birthday Celebration',
    'Anniversary',
    'Social Gathering',
    'Other'
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const { error: dbError } = await supabase
        .from('leads')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone || '',
          event_date: null,
          event_type: formData.eventType,
          source: 'contact_form',
          status: 'new',
          notes: `Message: ${formData.message}`
        }])

      if (dbError) {
        console.error('Database error:', dbError)
        setError('Something went wrong. Please try again.')
        setIsSubmitting(false)
        return
      }

      await sendContactNotification({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
        eventType: formData.eventType,
        eventDate: '',
        guestCount: '',
        message: formData.message,
        howDidYouHear: ''
      })

      await sendAutoReply(formData.email, formData.name)

      setSubmittedName(formData.name)
      setIsSuccess(true)
      setFormData({
        name: '',
        email: '',
        eventType: '',
        message: '',
        phone: ''
      })
    } catch (err) {
      console.error('Error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Contact items for compact display on mobile
  const contactItems = [
    { icon: Mail, label: 'Email', value: 'hello@eventsdistrict.com', href: 'mailto:hello@eventsdistrict.com' },
    { icon: Phone, label: 'Phone', value: '+254 700 000 000', href: 'tel:+254700000000' },
    { icon: MapPin, label: 'Location', value: 'Nairobi, Kenya', href: null },
  ]

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-20 sm:pt-24 pb-8 sm:pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-foreground/5 border border-foreground/10 rounded-full mb-4 sm:mb-6">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-foreground/60" />
            <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-medium">
              Let's Connect
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif italic text-foreground mb-3 sm:mb-4">
            Start Your Journey
          </h1>
          <p className="text-sm sm:text-base text-foreground/60 max-w-2xl mx-auto font-light px-4">
            We'd love to hear about your vision. Whether it's a wedding, corporate event, 
            or social celebration, let's create something extraordinary together.
          </p>
          <div className="h-px w-12 bg-foreground/20 mx-auto mt-6 sm:mt-8" />
        </motion.div>
      </div>

      {/* Contact Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8">
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Contact Info - Compact Grid on Mobile */}
          <div className="lg:col-span-1">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-1 gap-3 sm:gap-4">
              {contactItems.map((item, idx) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 + idx * 0.1 }}
                    className="group bg-background border border-foreground/10 rounded-lg p-3 sm:p-4 hover:border-foreground/30 transition-all duration-300"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                      <div className="p-1.5 sm:p-2 rounded-lg bg-foreground/5 border border-foreground/10 group-hover:bg-foreground/10 transition-colors">
                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground/60" />
                      </div>
                      <h3 className="text-xs sm:text-sm font-medium text-foreground">{item.label}</h3>
                    </div>
                    {item.href ? (
                      <a 
                        href={item.href} 
                        className="text-xs sm:text-sm text-foreground/60 hover:text-foreground transition-colors block break-all"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-xs sm:text-sm text-foreground/60">{item.value}</p>
                    )}
                  </motion.div>
                )
              })}
              
              {/* Hours Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="group bg-background border border-foreground/10 rounded-lg p-3 sm:p-4 hover:border-foreground/30 transition-all duration-300"
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-foreground/5 border border-foreground/10 group-hover:bg-foreground/10 transition-colors">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground/60" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-medium text-foreground">Hours</h3>
                </div>
                <div className="space-y-0.5 text-xs sm:text-sm text-foreground/60">
                  <p>Mon - Fri: 9AM - 6PM</p>
                  <p>Sat: 10AM - 4PM</p>
                  <p className="text-foreground/40">Sun: Closed (By appointment)</p>
                </div>
              </motion.div>

              {/* Social Links Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="group bg-background border border-foreground/10 rounded-lg p-3 sm:p-4 hover:border-foreground/30 transition-all duration-300"
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-foreground/5 border border-foreground/10 group-hover:bg-foreground/10 transition-colors">
                    <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground/60" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-medium text-foreground">Follow Us</h3>
                </div>
                <div className="flex gap-2 sm:gap-3">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-1.5 sm:p-2 rounded-full bg-foreground/5 border border-foreground/10 text-foreground/60 hover:text-foreground hover:border-foreground/30 transition-all">
                    <Instagram size={14} className="sm:w-4 sm:h-4" />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-1.5 sm:p-2 rounded-full bg-foreground/5 border border-foreground/10 text-foreground/60 hover:text-foreground hover:border-foreground/30 transition-all">
                    <Twitter size={14} className="sm:w-4 sm:h-4" />
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-1.5 sm:p-2 rounded-full bg-foreground/5 border border-foreground/10 text-foreground/60 hover:text-foreground hover:border-foreground/30 transition-all">
                    <Facebook size={14} className="sm:w-4 sm:h-4" />
                  </a>
                  <a href="https://wa.me/254700000000" target="_blank" rel="noopener noreferrer" className="p-1.5 sm:p-2 rounded-full bg-foreground/5 border border-foreground/10 text-foreground/60 hover:text-foreground hover:border-foreground/30 transition-all">
                    <MessageCircle size={14} className="sm:w-4 sm:h-4" />
                  </a>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Contact Form - Streamlined to 5 fields */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-background border border-foreground/10 rounded-xl p-5 sm:p-6 md:p-8">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 sm:py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-green-500/10 mb-4 sm:mb-6"
                  >
                    <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
                  </motion.div>
                  
                  <h2 className="text-xl sm:text-2xl font-serif italic text-foreground mb-2">
                    Thank You, {submittedName}!
                  </h2>
                  
                  <p className="text-sm sm:text-base text-foreground/60 mb-4 sm:mb-6">
                    Your message has been received. We'll get back to you within 24 hours.
                  </p>
                  
                  <div className="bg-foreground/5 border border-foreground/10 rounded-lg p-3 sm:p-4 max-w-sm mx-auto mb-6 sm:mb-8">
                    <div className="flex items-center gap-2 justify-center mb-2">
                      <Sparkles className="w-3 h-3 text-foreground/40" />
                      <span className="text-[10px] sm:text-xs text-foreground/50">What happens next?</span>
                    </div>
                    <ul className="text-left space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-foreground/50">
                      <li className="flex items-center gap-2">
                        <CheckCircle size={10} className="text-green-500" />
                        <span>We'll review your vision</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={10} className="text-green-500" />
                        <span>We'll reach out via email/phone</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={10} className="text-green-500" />
                        <span>Schedule a consultation call</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      href="/"
                      className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-1.5 sm:py-2 border border-foreground/20 text-foreground text-[9px] sm:text-[10px] uppercase tracking-wider font-medium hover:border-foreground/40 transition-colors rounded-full"
                    >
                      Return Home
                    </Link>
                    <button
                      onClick={() => setIsSuccess(false)}
                      className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-1.5 sm:py-2 bg-foreground text-background text-[9px] sm:text-[10px] uppercase tracking-wider font-medium hover:bg-foreground/90 transition-colors rounded-full"
                    >
                      Send Another Message
                      <ArrowRight size={10} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <>
                  <h2 className="text-lg sm:text-xl font-serif italic text-foreground mb-4 sm:mb-6">
                    Tell Us About Your Vision
                  </h2>
                  
                  {error && (
                    <div className="mb-4 sm:mb-6 p-2.5 sm:p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    {/* Name - Required */}
                    <div>
                      <label className="block text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-foreground/40 mb-1.5 sm:mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-transparent border-b border-foreground/20 py-1.5 sm:py-2 text-sm text-foreground focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/40"
                        placeholder="Your name"
                      />
                    </div>

                    {/* Email - Required */}
                    <div>
                      <label className="block text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-foreground/40 mb-1.5 sm:mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-transparent border-b border-foreground/20 py-1.5 sm:py-2 text-sm text-foreground focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/40"
                        placeholder="you@example.com"
                      />
                    </div>

                    {/* Event Type - Required */}
                    <div>
                      <label className="block text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-foreground/40 mb-1.5 sm:mb-2">
                        Event Type *
                      </label>
                      <select
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleChange}
                        required
                        className="w-full bg-transparent border-b border-foreground/20 py-1.5 sm:py-2 text-sm text-foreground focus:outline-none focus:border-foreground transition-colors appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-background">Select event type</option>
                        {eventTypes.map(type => (
                          <option key={type} value={type} className="bg-background">{type}</option>
                        ))}
                      </select>
                    </div>

                    {/* Phone - Optional */}
                    <div>
                      <label className="block text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-foreground/40 mb-1.5 sm:mb-2">
                        Phone Number <span className="text-foreground/30">(Optional)</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-foreground/20 py-1.5 sm:py-2 text-sm text-foreground focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/40"
                        placeholder="+254 XXX XXX XXX"
                      />
                    </div>

                    {/* Message - Required */}
                    <div>
                      <label className="block text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-foreground/40 mb-1.5 sm:mb-2">
                        Your Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="w-full bg-transparent border-b border-foreground/20 py-1.5 sm:py-2 text-sm text-foreground focus:outline-none focus:border-foreground transition-colors resize-none placeholder:text-foreground/40"
                        placeholder="Tell us about your vision, what you're planning, and how we can help..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2 sm:py-2.5 bg-foreground text-background text-[9px] sm:text-[10px] uppercase tracking-wider font-bold hover:bg-foreground/90 transition-colors rounded-full flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="w-3 h-3 border-2 border-background/30 border-t-background rounded-full"
                          />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send size={12} />
                        </>
                      )}
                    </button>

                    <p className="text-[7px] sm:text-[8px] text-foreground/30 text-center">
                      We'll get back to you within 24 hours. Your information is kept confidential.
                    </p>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quote CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-20">
        <div className="bg-background border border-foreground/10 rounded-xl p-6 sm:p-8 md:p-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-foreground/5 border border-foreground/10 rounded-full mb-4 sm:mb-6">
            <CalculatorIcon className="w-3 h-3 text-foreground/60" />
            <span className="text-[7px] sm:text-[8px] uppercase tracking-[0.2em] text-foreground/50 font-medium">
              Need an Instant Estimate?
            </span>
          </div>
          
          <h2 className="text-xl sm:text-2xl font-serif italic text-foreground mb-2 sm:mb-3">
            Get Your Wedding Quote
          </h2>
          
          <p className="text-foreground/50 max-w-xl mx-auto mb-4 sm:mb-6 font-light text-xs sm:text-sm">
            Use our interactive quote engine to get an instant estimate for your wedding decor.
          </p>
          
          <Link
            href="/quote"
            className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 bg-foreground text-background text-[9px] sm:text-[10px] uppercase tracking-wider font-bold hover:bg-foreground/90 transition-colors rounded-full"
          >
            Calculate Your Quote
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </main>
  )
}

// Calculator Icon component
function CalculatorIcon({ size = 14, className = "" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="16" y1="14" x2="16" y2="18" />
      <line x1="12" y1="14" x2="12" y2="18" />
      <line x1="8" y1="14" x2="8" y2="18" />
      <line x1="8" y1="10" x2="16" y2="10" />
    </svg>
  )
}