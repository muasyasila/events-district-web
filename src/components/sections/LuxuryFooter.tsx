"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Heart, 
  Instagram, 
  Twitter, 
  Facebook, 
  Mail, 
  Phone, 
  MapPin, 
  Send,
  Sparkles,
  Calendar,
  Users,
  Crown,
  Coffee,
  Briefcase,
  ChevronDown,
  PartyPopper,
  Cake,
  GraduationCap,
  Gift,
  Music,
  Globe,
  Building,
  Church
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LuxuryFooter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [openServiceCategory, setOpenServiceCategory] = useState<string | null>(null)
  const pathname = usePathname()

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  const currentYear = new Date().getFullYear()

  // Service categories matching your ServicesCodex
  const serviceCategories = [
    {
      id: 'romance',
      title: 'Romance & Weddings',
      icon: <Heart size={14} />,
      services: [
        { name: 'Wedding Decor', href: '/quote', available: true },
        { name: 'Engagement Parties', href: '/contact', available: false },
        { name: 'Bridal Showers', href: '/contact', available: false },
        { name: 'Rehearsal Dinners', href: '/contact', available: false },
        { name: 'Anniversary Celebrations', href: '/contact', available: false },
        { name: 'Traditional Ceremonies', href: '/contact', available: false },
      ]
    },
    {
      id: 'social',
      title: 'Social & Celebrations',
      icon: <PartyPopper size={14} />,
      services: [
        { name: 'Birthday Decor', href: '/contact', available: false },
        { name: 'Graduation Parties', href: '/contact', available: false },
        { name: 'Baby Showers', href: '/contact', available: false },
        { name: 'Picnic Dates', href: '/contact', available: false },
        { name: 'Surprise Parties', href: '/contact', available: false },
        { name: 'Memorial Services', href: '/contact', available: false },
      ]
    },
    {
      id: 'corporate',
      title: 'Corporate & Professional',
      icon: <Briefcase size={14} />,
      services: [
        { name: 'Corporate Events', href: '/contact', available: false },
        { name: 'Product Launches', href: '/contact', available: false },
        { name: 'Gala Dinners', href: '/contact', available: false },
        { name: 'Award Ceremonies', href: '/contact', available: false },
        { name: 'Conferences', href: '/contact', available: false },
        { name: 'Trade Shows', href: '/contact', available: false },
      ]
    },
    {
      id: 'institutional',
      title: 'Institutional & Scale',
      icon: <Building size={14} />,
      services: [
        { name: 'Graduation Ceremonies', href: '/contact', available: false },
        { name: 'University Events', href: '/contact', available: false },
        { name: 'Charity Galas', href: '/contact', available: false },
        { name: 'Community Festivals', href: '/contact', available: false },
        { name: 'Political Events', href: '/contact', available: false },
        { name: 'Religious Ceremonies', href: '/contact', available: false },
      ]
    },
    {
      id: 'culinary',
      title: 'Culinary & Dining',
      icon: <Coffee size={14} />,
      services: [
        { name: 'Catering Presentation', href: '/contact', available: false },
        { name: 'Bar & Lounge', href: '/contact', available: false },
        { name: 'Cakes & Confectionery', href: '/contact', available: false },
        { name: 'Dining Experiences', href: '/contact', available: false },
        { name: 'Food Festivals', href: '/contact', available: false },
        { name: 'Private Chef Experiences', href: '/contact', available: false },
      ]
    }
  ]

  const resources = [
    { name: 'Wedding Quote', href: '/quote' },
    { name: 'The Journal', href: '/blog' },
    { name: 'Free Checklist', href: '/#free-guide' },
    { name: 'Custom Quote', href: '/contact' },
  ]

  const companyLinks = [
    { name: 'About Us', href: '/#about' },
    { name: 'Portfolio', href: '/#portfolio' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ]

  const socialLinks = [
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com', color: 'hover:text-pink-500' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com', color: 'hover:text-blue-400' },
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com', color: 'hover:text-blue-600' },
    { name: 'Email', icon: Mail, href: 'mailto:hello@eventsdistrict.com', color: 'hover:text-foreground' },
  ]

  const toggleServiceCategory = (categoryId: string) => {
    setOpenServiceCategory(openServiceCategory === categoryId ? null : categoryId)
  }

  return (
    <footer className="relative bg-background border-t border-foreground/10 overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-foreground/[0.01] rounded-full blur-[120px]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-foreground/[0.01] rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-20 relative z-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="text-xl font-bold tracking-[0.3em] uppercase text-foreground hover:opacity-80 transition-opacity block">
              Events<span className="font-extralight opacity-50">District</span>
            </Link>
            <p className="text-sm text-foreground/50 font-light leading-relaxed">
              Creating extraordinary moments through exceptional design. 
              We transform your vision into unforgettable experiences.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-full bg-foreground/5 border border-foreground/10 text-foreground/60 ${social.color} hover:bg-foreground/10 transition-all duration-300`}
                  aria-label={social.name}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>

            {/* Contact Info */}
            <div className="space-y-3 pt-4 border-t border-foreground/10">
              <div className="flex items-center gap-3 text-sm text-foreground/60 hover:text-foreground transition-colors">
                <Mail size={14} className="shrink-0" />
                <a href="mailto:hello@eventsdistrict.com" className="hover:underline">hello@eventsdistrict.com</a>
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground/60 hover:text-foreground transition-colors">
                <Phone size={14} className="shrink-0" />
                <a href="tel:+254700000000" className="hover:underline">+254 700 000 000</a>
              </div>
              <div className="flex items-start gap-3 text-sm text-foreground/60">
                <MapPin size={14} className="shrink-0 mt-0.5" />
                <span>Nairobi, Kenya</span>
              </div>
            </div>
          </div>

          {/* Services Column with Dropdowns */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/40 mb-6">Services</h4>
            <div className="space-y-3">
              {serviceCategories.map((category) => (
                <div key={category.id} className="border-b border-foreground/10 pb-2 last:border-0">
                  <button
                    onClick={() => toggleServiceCategory(category.id)}
                    className="flex items-center justify-between w-full group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-foreground/40 group-hover:text-foreground transition-colors">
                        {category.icon}
                      </span>
                      <span className="text-sm text-foreground/60 hover:text-foreground transition-colors">
                        {category.title}
                      </span>
                    </div>
                    <ChevronDown 
                      size={14} 
                      className={`text-foreground/40 transition-transform duration-300 ${
                        openServiceCategory === category.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  
                  <AnimatePresence>
                    {openServiceCategory === category.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-2 pb-1 pl-6 space-y-2">
                          {category.services.map((service) => (
                            <Link
                              key={service.name}
                              href={service.href}
                              className="flex items-center gap-2 text-xs text-foreground/50 hover:text-foreground transition-colors py-0.5"
                            >
                              <span className="w-1 h-1 bg-foreground/30 rounded-full" />
                              <span>{service.name}</span>
                              {!service.available && (
                                <span className="text-[7px] px-1 py-0.5 bg-foreground/10 text-foreground/40 rounded-full">
                                  Custom
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/40 mb-6">Resources</h4>
            <ul className="space-y-3">
              {resources.map((resource) => (
                <li key={resource.name}>
                  <Link 
                    href={resource.href}
                    className="text-sm text-foreground/60 hover:text-foreground transition-colors"
                  >
                    {resource.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/40 mb-6">Newsletter</h4>
            <p className="text-sm text-foreground/50 font-light mb-4">
              Subscribe for inspiration, trends, and exclusive offers.
            </p>
            
            {subscribed ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-sm text-green-500"
              >
                <Heart size={14} />
                <span>Welcome to the inner circle!</span>
              </motion.div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="flex-1 bg-transparent border-b border-foreground/20 py-2 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/40 text-foreground"
                />
                <button
                  type="submit"
                  className="p-2 hover:bg-foreground/10 rounded-full transition-colors"
                  aria-label="Subscribe"
                >
                  <Send size={16} className="text-foreground/60 hover:text-foreground transition-colors" />
                </button>
              </form>
            )}
            
            <p className="text-[9px] text-foreground/30 mt-4">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* Bottom Bar - Updated Layout */}
        <div className="mt-16 pt-8 border-t border-foreground/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright on Left */}
            <div className="order-2 md:order-1">
              <p className="text-xs text-foreground/40">
                © {currentYear} Events District. All rights reserved.
              </p>
            </div>
            
            {/* Company Links in Middle */}
            <div className="order-1 md:order-2 flex flex-wrap justify-center gap-6 text-xs text-foreground/40">
              {companyLinks.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className="hover:text-foreground transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            
            {/* Made by on Right */}
            <div className="order-3">
              <p className="text-[10px] text-foreground/30">
                Made by <span className="text-foreground/40 hover:text-foreground transition-colors">Muasya Sila</span>
              </p>
            </div>
          </div>
        </div>

        {/* Decorative Bottom Line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
      </div>
    </footer>
  )
}