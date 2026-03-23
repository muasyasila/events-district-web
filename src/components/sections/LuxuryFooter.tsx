// components/sections/LuxuryFooter.tsx

"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Instagram, Youtube, Linkedin, Twitter, ArrowUpRight, Heart } from 'lucide-react'

// Custom TikTok Icon since lucide-react doesn't have it
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
)

export function LuxuryFooter() {
  const [email, setEmail] = useState<string>('')
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false)

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setTimeout(() => {
        setIsSubscribed(false)
        setEmail('')
      }, 3000)
    }
  }

  const socialLinks = [
    { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:text-pink-500' },
    { name: 'TikTok', icon: TikTokIcon, href: '#', color: 'hover:text-cyan-400' },
    { name: 'YouTube', icon: Youtube, href: '#', color: 'hover:text-red-500' },
    { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:text-blue-400' },
    { name: 'LinkedIn', icon: Linkedin, href: '#', color: 'hover:text-blue-600' },
  ]

  const footerLinks = [
    {
      title: 'Services',
      links: ['Weddings', 'Corporate Events', 'Private Parties', 'Galas']
    },
    {
      title: 'Company',
      links: ['About Us', 'Our Work', 'Careers', 'Press']
    },
    {
      title: 'Support',
      links: ['Contact', 'FAQ', 'Pricing', 'Privacy']
    }
  ]

  return (
    <footer className="relative bg-background border-t border-foreground/10">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl md:text-4xl font-serif italic text-foreground mb-4">
                Your Company
              </h3>
              <p className="text-foreground/60 text-sm leading-relaxed max-w-sm">
                Creating unforgettable moments through exceptional design. 
                Every event tells a story, and we're here to make yours legendary.
              </p>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex gap-4"
            >
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className={`w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center text-foreground/60 transition-all duration-300 hover:border-foreground/50 hover:scale-110 ${social.color}`}
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </motion.div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-4 grid grid-cols-3 gap-8">
            {footerLinks.map((column, idx) => (
              <motion.div
                key={column.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * (idx + 1) }}
              >
                <h4 className="text-xs uppercase tracking-widest text-foreground/40 mb-4">
                  {column.title}
                </h4>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a 
                        href="#" 
                        className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 inline-flex items-center gap-1 group"
                      >
                        {link}
                        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Newsletter Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-3"
          >
            <h4 className="text-xs uppercase tracking-widest text-foreground/40 mb-4">
              Stay Inspired
            </h4>
            <p className="text-sm text-foreground/60 mb-4">
              Subscribe for exclusive event inspiration and behind-the-scenes content.
            </p>
            
            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full bg-transparent border-b border-foreground/20 py-3 pr-12 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground/50 transition-colors"
                required
              />
              <button
                type="submit"
                className="absolute right-0 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
              >
                <ArrowUpRight className="w-5 h-5" />
              </button>
            </form>

            {isSubscribed && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-emerald-500 mt-2"
              >
                Welcome to the inner circle ✨
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-foreground/10">
        <div className="container mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-foreground/40">
              © {new Date().getFullYear()} Your Company. All rights reserved.
            </p>
            
            <p className="text-xs text-foreground/40 flex items-center gap-1">
              Crafted with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for extraordinary events
            </p>

            <div className="flex gap-6 text-xs text-foreground/40">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}