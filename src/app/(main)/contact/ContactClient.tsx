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
  Calendar,
  Users,
  Crown,
  MessageCircle
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    eventType: '',
    guestCount: '',
    message: '',
    howDidYouHear: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

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

  const howDidYouHearOptions = [
    'Instagram',
    'Google Search',
    'Friend/Family',
    'Wedding Fair',
    'Blog/Journal',
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
      // Save to Supabase leads table
      const { error: dbError } = await supabase
        .from('leads')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          event_date: formData.eventDate || null,
          event_type: formData.eventType,
          source: 'contact_form',
          status: 'new',
          notes: `Guest Count: ${formData.guestCount || 'Not specified'}\nHow did you hear: ${formData.howDidYouHear || 'Not specified'}\n\nMessage: ${formData.message}`
        }])

      if (dbError) {
        console.error('Database error:', dbError)
        setError('Something went wrong. Please try again.')
        setIsSubmitting(false)
        return
      }

      // Here you could also send an email notification using your email service
      // For now, we'll just show success

      setIsSuccess(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        eventDate: '',
        eventType: '',
        guestCount: '',
        message: '',
        howDidYouHear: ''
      })
    } catch (err) {
      console.error('Error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-foreground/5 border border-foreground/10 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-foreground/60" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-medium">
              Let's Connect
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif italic text-foreground mb-4">
            Start Your Journey
          </h1>
          <p className="text-foreground/60 max-w-2xl mx-auto font-light">
            We'd love to hear about your vision. Whether it's a wedding, corporate event, 
            or social celebration, let's create something extraordinary together.
          </p>
          <div className="h-px w-12 bg-foreground/20 mx-auto mt-8" />
        </motion.div>
      </div>

      {/* Contact Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-background border border-foreground/10 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-foreground/5 border border-foreground/10">
                  <Mail className="w-5 h-5 text-foreground/60" />
                </div>
                <h3 className="text-lg font-serif italic text-foreground">Email Us</h3>
              </div>
              <a 
                href="mailto:hello@eventsdistrict.com" 
                className="text-foreground/60 hover:text-foreground transition-colors"
              >
                hello@eventsdistrict.com
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-background border border-foreground/10 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-foreground/5 border border-foreground/10">
                  <Phone className="w-5 h-5 text-foreground/60" />
                </div>
                <h3 className="text-lg font-serif italic text-foreground">Call Us</h3>
              </div>
              <a 
                href="tel:+254700000000" 
                className="text-foreground/60 hover:text-foreground transition-colors"
              >
                +254 700 000 000
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-background border border-foreground/10 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-foreground/5 border border-foreground/10">
                  <MapPin className="w-5 h-5 text-foreground/60" />
                </div>
                <h3 className="text-lg font-serif italic text-foreground">Visit Us</h3>
              </div>
              <p className="text-foreground/60">
                Nairobi, Kenya
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-background border border-foreground/10 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-foreground/5 border border-foreground/10">
                  <Clock className="w-5 h-5 text-foreground/60" />
                </div>
                <h3 className="text-lg font-serif italic text-foreground">Hours</h3>
              </div>
              <div className="space-y-1 text-foreground/60">
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <p>Sunday: Closed (Consultations by appointment)</p>
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-background border border-foreground/10 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-foreground/5 border border-foreground/10">
                  <Heart className="w-5 h-5 text-foreground/60" />
                </div>
                <h3 className="text-lg font-serif italic text-foreground">Follow Us</h3>
              </div>
              <div className="flex gap-4">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-foreground/5 border border-foreground/10 text-foreground/60 hover:text-foreground hover:border-foreground/30 transition-all">
                  <Instagram size={18} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-foreground/5 border border-foreground/10 text-foreground/60 hover:text-foreground hover:border-foreground/30 transition-all">
                  <Twitter size={18} />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-foreground/5 border border-foreground/10 text-foreground/60 hover:text-foreground hover:border-foreground/30 transition-all">
                  <Facebook size={18} />
                </a>
                <a href="https://wa.me/254700000000" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-foreground/5 border border-foreground/10 text-foreground/60 hover:text-foreground hover:border-foreground/30 transition-all">
                  <MessageCircle size={18} />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-background border border-foreground/10 rounded-xl p-6 md:p-8">
              {isSuccess ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-6">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-serif italic text-foreground mb-2">
                    Message Sent!
                  </h2>
                  <p className="text-foreground/60 mb-6">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="inline-flex items-center gap-2 text-sm text-foreground/50 hover:text-foreground transition-colors"
                  >
                    Send another message
                    <ArrowRight size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-serif italic text-foreground mb-6">
                    Tell Us About Your Vision
                  </h2>
                  
                  {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full bg-transparent border-b border-foreground/20 py-2 text-foreground focus:outline-none focus:border-foreground transition-colors"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full bg-transparent border-b border-foreground/20 py-2 text-foreground focus:outline-none focus:border-foreground transition-colors"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full bg-transparent border-b border-foreground/20 py-2 text-foreground focus:outline-none focus:border-foreground transition-colors"
                          placeholder="+254 XXX XXX XXX"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-2">
                          Event Date (Optional)
                        </label>
                        <input
                          type="date"
                          name="eventDate"
                          value={formData.eventDate}
                          onChange={handleChange}
                          className="w-full bg-transparent border-b border-foreground/20 py-2 text-foreground focus:outline-none focus:border-foreground transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-2">
                          Event Type *
                        </label>
                        <select
                          name="eventType"
                          value={formData.eventType}
                          onChange={handleChange}
                          required
                          className="w-full bg-transparent border-b border-foreground/20 py-2 text-foreground focus:outline-none focus:border-foreground transition-colors appearance-none cursor-pointer"
                        >
                          <option value="" className="bg-background">Select event type</option>
                          {eventTypes.map(type => (
                            <option key={type} value={type} className="bg-background">{type}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-2">
                          Estimated Guest Count
                        </label>
                        <select
                          name="guestCount"
                          value={formData.guestCount}
                          onChange={handleChange}
                          className="w-full bg-transparent border-b border-foreground/20 py-2 text-foreground focus:outline-none focus:border-foreground transition-colors appearance-none cursor-pointer"
                        >
                          <option value="" className="bg-background">Select guest count</option>
                          <option value="0-50">0-50 guests</option>
                          <option value="51-100">51-100 guests</option>
                          <option value="101-200">101-200 guests</option>
                          <option value="201-500">201-500 guests</option>
                          <option value="500+">500+ guests</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-2">
                        How Did You Hear About Us?
                      </label>
                      <select
                        name="howDidYouHear"
                        value={formData.howDidYouHear}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-foreground/20 py-2 text-foreground focus:outline-none focus:border-foreground transition-colors appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-background">Select an option</option>
                        {howDidYouHearOptions.map(option => (
                          <option key={option} value={option} className="bg-background">{option}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-2">
                        Your Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full bg-transparent border-b border-foreground/20 py-2 text-foreground focus:outline-none focus:border-foreground transition-colors resize-none"
                        placeholder="Tell us about your vision, what you're planning, and how we can help..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-foreground text-background text-[11px] uppercase tracking-wider font-bold hover:bg-foreground/90 transition-colors rounded-full flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>Sending...</>
                      ) : (
                        <>
                          Send Message
                          <Send size={14} />
                        </>
                      )}
                    </button>

                    <p className="text-[9px] text-foreground/30 text-center">
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
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-20">
        <div className="bg-background border border-foreground/10 rounded-xl p-8 md:p-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-foreground/5 border border-foreground/10 rounded-full mb-6">
            <CalculatorIcon className="w-3 h-3 text-foreground/60" />
            <span className="text-[8px] uppercase tracking-[0.2em] text-foreground/50 font-medium">
              Need an Instant Estimate?
            </span>
          </div>
          
          <h2 className="text-2xl font-serif italic text-foreground mb-3">
            Get Your Wedding Quote
          </h2>
          
          <p className="text-foreground/50 max-w-xl mx-auto mb-6 font-light text-sm">
            Use our interactive quote engine to get an instant estimate for your wedding decor.
          </p>
          
          <Link
            href="/quote"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-foreground text-background text-[10px] uppercase tracking-wider font-bold hover:bg-foreground/90 transition-colors rounded-full"
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