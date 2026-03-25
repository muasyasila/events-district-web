// components/sections/ServicesAtelier.tsx

"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ArrowRight, Plus, Minus, Calendar, MessageCircle, X, Send } from 'lucide-react'

const categories = [
  {
    id: 'romance',
    title: 'Romance & Weddings',
    services: [
      { 
        name: 'Wedding Decor', 
        shortDesc: 'Ceremony arches, aisle styling, reception centerpieces',
        fullDesc: 'From intimate ceremonies to grand receptions, we create immersive wedding environments. Our team handles everything from floral installations to lighting design, ensuring your special day reflects your unique love story.',
        price: 2500,
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop',
        done: 47,
        trending: true,
        related: ['Rehearsal Dinners', 'Bridal Showers', 'Cakes & Confectionery']
      },
      { 
        name: 'Engagement Parties', 
        shortDesc: 'Romantic setups, proposal backdrops',
        fullDesc: 'Create the perfect moment with our bespoke engagement setups. From intimate dinner styling to dramatic proposal backdrops, we ensure your question gets the "yes" it deserves.',
        price: 800,
        image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400&h=300&fit=crop',
        done: 32,
        related: ['Picnic Dates', 'Wedding Decor', 'Dining Experiences']
      },
      { 
        name: 'Bridal Showers', 
        shortDesc: 'Feminine, elegant decor with custom backdrops',
        fullDesc: 'Celebrate the bride-to-be with our elegant shower designs. Custom backdrops, sweet tables, and feminine touches that make for perfect photo opportunities.',
        price: 600,
        image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=300&fit=crop',
        done: 28,
        related: ['Baby Showers', 'Anniversary Celebrations', 'Cakes & Confectionery']
      },
      { 
        name: 'Rehearsal Dinners', 
        shortDesc: 'Sophisticated table settings, ambient lighting',
        fullDesc: 'Set the tone for your wedding weekend with sophisticated rehearsal dinner styling. Intimate lighting, personalized table settings, and warm ambiance.',
        price: 1200,
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
        done: 19,
        related: ['Wedding Decor', 'Catering Presentation', 'Bar & Lounge']
      },
      { 
        name: 'Anniversary Celebrations', 
        shortDesc: 'Milestone anniversaries, vow renewals',
        fullDesc: 'Celebrate lasting love with nostalgic decor that honors your journey. From silver anniversaries to golden milestones, we create memories worth reliving.',
        price: 1500,
        image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=300&fit=crop',
        done: 22,
        related: ['Wedding Decor', 'Picnic Dates', 'Dining Experiences']
      },
      { 
        name: 'Traditional Ceremonies', 
        shortDesc: 'Intimate ceremonies, recommitment celebrations',
        fullDesc: 'Reaffirm your love with intimate ceremonies designed for recommitment. Elegant styling that honors your years together while creating new memories.',
        price: 1800,
        image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&h=300&fit=crop',
        done: 15,
        related: ['Wedding Decor', 'Anniversary Celebrations', 'Engagement Parties']
      }
    ]
  },
  {
    id: 'social',
    title: 'Social & Celebrations',
    services: [
      { 
        name: 'Birthday Decor', 
        shortDesc: 'Milestone birthdays, themed parties',
        fullDesc: 'From first birthdays to centenarian celebrations, we design age-appropriate themes that wow guests. Balloon installations, photo backdrops, and custom signage.',
        price: 500,
        image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop',
        done: 89,
        trending: true,
        related: ['Surprise Parties', 'Cakes & Confectionery', 'Bar & Lounge']
      },
      { 
        name: 'Graduation Parties', 
        shortDesc: 'Personal celebrations, achievement backdrops',
        fullDesc: 'Celebrate academic achievements with style. Custom backdrops for photos, themed decor for school colors, and setups that honor the graduate.',
        price: 700,
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop',
        done: 23,
        related: ['Graduation Ceremonies', 'Birthday Decor', 'Catering Presentation']
      },
      { 
        name: 'Baby Showers', 
        shortDesc: 'Gender reveal setups, whimsical themes',
        fullDesc: 'Welcome new life with our whimsical baby shower designs. Gender reveal setups, dessert tables, and themes that range from classic to contemporary.',
        price: 550,
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
        done: 41,
        related: ['Bridal Showers', 'Cakes & Confectionery', 'Picnic Dates']
      },
      { 
        name: 'Picnic Dates', 
        shortDesc: 'Luxury picnic setups with cushions, florals',
        fullDesc: 'Romantic outdoor experiences complete with low tables, luxury cushions, grazing platters, and fresh florals. Perfect for proposals or anniversaries.',
        price: 400,
        image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop',
        done: 35,
        related: ['Engagement Parties', 'Anniversary Celebrations', 'Catering Presentation']
      },
      { 
        name: 'Surprise Parties', 
        shortDesc: 'Full reveal setups, dramatic entrances',
        fullDesc: 'The art of the surprise. We coordinate reveal moments, dramatic entrances, and custom signage that makes the guest of honor feel truly special.',
        price: 900,
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop',
        done: 27,
        related: ['Birthday Decor', 'Corporate Events', 'Bar & Lounge']
      },
      { 
        name: 'Memorial Services', 
        shortDesc: 'Celebrations of life, tribute events',
        fullDesc: 'Honor loved ones with dignity and grace. We create serene environments for celebrations of life, with thoughtful touches that reflect their legacy.',
        price: 1100,
        image: 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=400&h=300&fit=crop',
        done: 12,
        related: ['Wedding Decor', 'Anniversary Celebrations', 'Dining Experiences']
      }
    ]
  },
  {
    id: 'corporate',
    title: 'Corporate & Professional',
    services: [
      { 
        name: 'Corporate Events', 
        shortDesc: 'Branded environments, stage design',
        fullDesc: 'Professional events that reflect your brand identity. Networking lounges, branded stages, and environments designed for business and pleasure.',
        price: 3000,
        image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop',
        done: 56,
        related: ['Conferences', 'Product Launches', 'Gala Dinners']
      },
      { 
        name: 'Product Launches', 
        shortDesc: 'Immersive brand activations',
        fullDesc: 'Make your product unforgettable with immersive activations. Interactive displays, press-ready backdrops, and experiences that generate buzz.',
        price: 5000,
        image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop',
        done: 34,
        trending: true,
        related: ['Trade Shows', 'Corporate Events', 'Conferences']
      },
      { 
        name: 'Gala Dinners', 
        shortDesc: 'Luxurious table settings, red carpet',
        fullDesc: 'Black-tie affairs executed with precision. Red carpet experiences, luxurious table settings, and dramatic lighting for unforgettable evenings.',
        price: 8000,
        image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400&h=300&fit=crop',
        done: 22,
        related: ['Award Ceremonies', 'Charity Galas', 'Corporate Events']
      },
      { 
        name: 'Award Ceremonies', 
        shortDesc: 'Stage grandeur, trophy displays',
        fullDesc: 'Celebrate excellence with grandeur. Trophy displays, VIP lounges, and stage designs that honor achievement in style.',
        price: 6500,
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop',
        done: 18,
        related: ['Gala Dinners', 'Conferences', 'Corporate Events']
      },
      { 
        name: 'Conferences', 
        shortDesc: 'Speaker stages, registration branding',
        fullDesc: 'Professional conferences that inspire. Speaker stages, branded registration areas, and breakout rooms designed for learning and connection.',
        price: 4000,
        image: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=400&h=300&fit=crop',
        done: 29,
        related: ['Corporate Events', 'Trade Shows', 'Product Launches']
      },
      { 
        name: 'Trade Shows', 
        shortDesc: 'Booth design, branded activations',
        fullDesc: 'Stand out on the exhibition floor with custom booth designs and branded activations that draw crowds and drive engagement.',
        price: 3500,
        image: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=400&h=300&fit=crop',
        done: 31,
        related: ['Product Launches', 'Conferences', 'Corporate Events']
      }
    ]
  },
  {
    id: 'institutional',
    title: 'Institutional & Scale',
    services: [
      { 
        name: 'Graduation Ceremonies', 
        shortDesc: 'Full school/university decor',
        fullDesc: 'Large-scale commencement ceremonies for entire institutions. Stage design, photo opportunities, directional signage, and branded backdrops for thousands of guests.',
        price: 15000,
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop',
        done: 12,
        related: ['University Events', 'Community Festivals', 'Conferences']
      },
      { 
        name: 'University Events', 
        shortDesc: "Freshers' balls, alumni galas",
        fullDesc: 'Campus celebrations that become traditions. Freshers balls, alumni reunions, and faculty recognition nights designed for academic communities.',
        price: 5000,
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop',
        done: 8,
        related: ['Graduation Ceremonies', 'Gala Dinners', 'Corporate Events']
      },
      { 
        name: 'Charity Galas', 
        shortDesc: 'Elegant decor, mission-driven',
        fullDesc: 'Fundraising events that inspire generosity. Elegant decor aligned with your mission, creating atmospheres where donors feel connected to your cause.',
        price: 7000,
        image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400&h=300&fit=crop',
        done: 14,
        related: ['Gala Dinners', 'Community Festivals', 'Award Ceremonies']
      },
      { 
        name: 'Community Festivals', 
        shortDesc: 'Large-scale installations',
        fullDesc: 'Bring communities together with large-scale installations, multiple stages, and experiential zones that celebrate culture and connection.',
        price: 20000,
        image: 'https://images.unsplash.com/photo-1533174072545-7a4ce6eadca9?w=400&h=300&fit=crop',
        done: 6,
        related: ['Graduation Ceremonies', 'Charity Galas', 'Trade Shows']
      },
      { 
        name: 'Political Events', 
        shortDesc: 'Rallies, inaugurations, diplomatic functions',
        fullDesc: 'Professional staging for political and diplomatic occasions. Podium design, backdrop branding, and secure environment styling.',
        price: 12000,
        image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=400&h=300&fit=crop',
        done: 9,
        related: ['Corporate Events', 'Conferences', 'Community Festivals']
      },
      { 
        name: 'Religious Ceremonies', 
        shortDesc: 'Weddings, baptisms, cultural celebrations',
        fullDesc: 'Respectful and beautiful decor for religious and cultural ceremonies. We honor traditions while bringing visual excellence to sacred spaces.',
        price: 3500,
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop',
        done: 17,
        related: ['Wedding Decor', 'Community Festivals', 'Anniversary Celebrations']
      }
    ]
  },
  {
    id: 'culinary',
    title: 'Culinary & Dining',
    services: [
      { 
        name: 'Catering Presentation', 
        shortDesc: 'Food stations, buffet styling',
        fullDesc: 'Elevate your culinary offerings with artful presentation. Food stations, buffet styling, and chef table setups that make dining an experience.',
        price: 1500,
        image: 'https://images.unsplash.com/photo-1555244162-803794f237d3?w=400&h=300&fit=crop',
        done: 67,
        related: ['Dining Experiences', 'Bar & Lounge', 'Wedding Decor']
      },
      { 
        name: 'Bar & Lounge', 
        shortDesc: 'Signature drink stations, champagne walls',
        fullDesc: 'Sophisticated drinking experiences. Champagne walls, signature cocktail stations, and lounge vignettes that encourage conversation.',
        price: 2000,
        image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&h=300&fit=crop',
        done: 43,
        trending: true,
        related: ['Catering Presentation', 'Dining Experiences', 'Corporate Events']
      },
      { 
        name: 'Cakes & Confectionery', 
        shortDesc: 'Custom cake displays, dessert tables',
        fullDesc: 'Showcase sweet creations with custom displays. Tiered cake stands, dessert tablescapes, and pastry installations that look as good as they taste.',
        price: 800,
        image: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=400&h=300&fit=crop',
        done: 52,
        related: ['Baby Showers', 'Bridal Showers', 'Wedding Decor']
      },
      { 
        name: 'Dining Experiences', 
        shortDesc: 'Tablescaping, thematic dining rooms',
        fullDesc: 'Immersive dining environments. Thematic tablescaping, room transformations, and sensory details that turn meals into memories.',
        price: 2500,
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
        done: 38,
        related: ['Catering Presentation', 'Gala Dinners', 'Anniversary Celebrations']
      },
      { 
        name: 'Food Festivals', 
        shortDesc: 'Outdoor culinary events, tasting stations',
        fullDesc: 'Large-scale culinary celebrations. Multiple vendor styling, tasting stations, and outdoor dining environments that bring food communities together.',
        price: 4500,
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
        done: 11,
        related: ['Community Festivals', 'Catering Presentation', 'Trade Shows']
      },
      { 
        name: 'Private Chef Experiences', 
        shortDesc: 'Intimate dining, chef table styling',
        fullDesc: 'Exclusive dining experiences in private settings. Chef table styling, intimate lighting, and personalized touches for memorable meals.',
        price: 1800,
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
        done: 24,
        related: ['Dining Experiences', 'Catering Presentation', 'Anniversary Celebrations']
      }
    ]
  }
]

const timeSlots = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
  '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'
]

const AUTO_ROTATE_INTERVAL = 6000

export function ServicesCodex() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { amount: 0.3 })
  const [activeCategory, setActiveCategory] = useState(0)
  const [expandedService, setExpandedService] = useState<string | null>(null)
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false)
  const [activeFormType, setActiveFormType] = useState<'consultation' | 'chat' | null>(null)
  const [progress, setProgress] = useState(0)
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '',
    date: '', 
    time: '',
    message: '', 
    question: '' 
  })

  const currentCategory = categories[activeCategory]

  // Get tomorrow's date for min date attribute (next day only)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  const nextCategory = useCallback(() => {
    // Pause auto-rotate when a service is expanded (+ clicked)
    if (expandedService) return
    
    setActiveCategory((prev) => (prev + 1) % categories.length)
    setProgress(0)
  }, [expandedService])

  useEffect(() => {
    // Only auto-rotate when:
    // 1. Section is in view
    // 2. NOT hovering interactive elements  
    // 3. NO service is expanded (blocks auto-rotate only, not manual clicks)
    if (!isInView || isHoveringInteractive || expandedService) return

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          nextCategory()
          return 0
        }
        return prev + (100 / (AUTO_ROTATE_INTERVAL / 100))
      })
    }, 100)

    return () => clearInterval(progressInterval)
  }, [isInView, isHoveringInteractive, expandedService, nextCategory])

  const handleCategoryClick = (index: number) => {
    setActiveCategory(index)
    setExpandedService(null)
    setActiveFormType(null)
    setProgress(0)
  }

  const toggleService = (serviceName: string) => {
    if (expandedService === serviceName) {
      // Clicking - : close service and form
      setExpandedService(null)
      setActiveFormType(null)
    } else {
      // Clicking + : expand service (pauses auto-scroll)
      setExpandedService(serviceName)
    }
  }

  const openConsultationForm = () => {
    setActiveFormType('consultation')
  }

  const openChatForm = () => {
    setActiveFormType('chat')
  }

  const switchToConsultation = () => {
    setActiveFormType('consultation')
    setFormData({ ...formData, question: '' })
  }

  const switchToChat = () => {
    setActiveFormType('chat')
    setFormData({ ...formData, date: '', time: '', message: '' })
  }

  const closeForm = () => {
    setActiveFormType(null)
    setFormData({ 
      name: '', 
      email: '', 
      phone: '',
      date: '', 
      time: '',
      message: '', 
      question: '' 
    })
  }

  const handleConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Consultation booked for ${formData.name}! We'll confirm your slot within 24 hours.`)
    closeForm()
    setExpandedService(null)
  }

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Question sent! We typically reply within 10 minutes.`)
    closeForm()
    setExpandedService(null)
  }

  return (
    <section 
      ref={sectionRef}
      className="relative w-full bg-background py-16 md:py-20 overflow-hidden border-t border-foreground/10 text-foreground"
    >
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        
        {/* Compact Header */}
        <div className="mb-8">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[10px] uppercase tracking-[0.8em] text-foreground/50 font-bold block mb-3"
          >
            Our Expertise
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-serif italic tracking-tighter"
          >
            Every Event, <span className="opacity-30">Elevated.</span>
          </motion.h2>
        </div>

        {/* Category Tabs - Always active, just close form on click */}
        <div className="flex gap-6 md:gap-8 mb-6 border-b border-foreground/10 pb-4 overflow-x-auto scrollbar-hide">
          {categories.map((cat, idx) => {
            const isActive = activeCategory === idx
            
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(idx)}
                onMouseEnter={() => setIsHoveringInteractive(true)}
                onMouseLeave={() => setIsHoveringInteractive(false)}
                className="group relative shrink-0"
              >
                <span className={`text-[11px] uppercase tracking-[0.2em] transition-colors duration-500 ${
                  isActive ? 'text-foreground' : 'text-foreground/40 hover:text-foreground/70'
                }`}>
                  {cat.title}
                </span>
                
                <motion.div 
                  className="absolute -bottom-4 left-0 h-[1px] bg-foreground"
                  initial={false}
                  animate={{ width: isActive ? '100%' : '0%' }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
                
                {isActive && !expandedService && (
                  <motion.div 
                    className="absolute -bottom-4 left-0 h-[1px] bg-foreground/20"
                    style={{ width: `${isHoveringInteractive ? 0 : progress}%` }}
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Stats Row */}
        <div className="flex gap-8 mb-6 pb-6 border-b border-foreground/10">
          <div>
            <p className="text-2xl font-bold text-foreground">100+</p>
            <p className="text-[10px] uppercase tracking-wider text-foreground/50 mt-1">Events Styled</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">50+</p>
            <p className="text-[10px] uppercase tracking-wider text-foreground/50 mt-1">Service Types</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">∞</p>
            <p className="text-[10px] uppercase tracking-wider text-foreground/50 mt-1">Possibilities</p>
          </div>
        </div>

        {/* Services Accordion */}
        <motion.div layout className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCategory.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-0"
            >
              {currentCategory.services.map((service, idx) => {
                const isExpanded = expandedService === service.name
                const isConsultation = activeFormType === 'consultation' && isExpanded
                const isChat = activeFormType === 'chat' && isExpanded
                
                return (
                  <motion.div
                    key={service.name}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-foreground/10 last:border-b-0"
                  >
                    {/* Service Header - Always clickable */}
                    <div
                      onClick={() => toggleService(service.name)}
                      onMouseEnter={() => setIsHoveringInteractive(true)}
                      onMouseLeave={() => setIsHoveringInteractive(false)}
                      className="w-full py-4 flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex-1 flex items-center gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm uppercase tracking-[0.15em] font-medium text-foreground group-hover:text-foreground/70 transition-colors">
                              {service.name}
                            </h4>
                            {service.trending && (
                              <span className="px-2 py-0.5 bg-foreground/10 text-[9px] uppercase tracking-wider rounded-full text-foreground/60">
                                Trending
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-foreground/50 mt-1 font-light flex items-center gap-2">
                            {service.shortDesc}
                            <span className="text-foreground/30">• {service.done} done</span>
                          </p>
                        </div>
                      </div>
                      
                      <div className={`ml-4 w-8 h-8 rounded-full border border-foreground/20 flex items-center justify-center transition-all duration-300 ${isExpanded ? 'bg-foreground text-background' : 'group-hover:border-foreground/40'}`}>
                        {isExpanded ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </div>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="pb-6 pt-2">
                            <div className="bg-muted/30 border border-foreground/10 rounded-sm overflow-hidden">
                              {/* Image Preview */}
                              <div className="relative h-48 w-full overflow-hidden">
                                <img 
                                  src={service.image} 
                                  alt={service.name}
                                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                                <div className="absolute bottom-4 left-6">
                                  <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/60 mb-1">Starting from</p>
                                  <p className="text-2xl font-serif italic text-foreground">${service.price.toLocaleString()}</p>
                                </div>
                              </div>

                              <div className="p-6">
                                <p className="text-sm text-foreground/70 leading-relaxed font-light mb-6">
                                  {service.fullDesc}
                                </p>

                                {/* Package Comparison */}
                                <div className="mb-6">
                                  <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-3">Package Options</p>
                                  <div className="grid grid-cols-3 gap-3">
                                    {['Essential', 'Signature', 'Bespoke'].map((tier, i) => {
                                      const multiplier = i + 1
                                      const tierPrice = service.price * multiplier
                                      return (
                                        <div key={tier} className={`p-3 border rounded-sm text-center transition-colors ${i === 1 ? 'border-foreground/30 bg-foreground/[0.03]' : 'border-foreground/10'}`}>
                                          <p className="text-[9px] uppercase tracking-wider text-foreground/50 mb-1">{tier}</p>
                                          <p className="text-sm font-medium text-foreground">${tierPrice.toLocaleString()}</p>
                                        </div>
                                      )
                                    })}
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                {!activeFormType ? (
                                  <div className="flex flex-col gap-3">
                                    {/* Primary: Book Consultation */}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        openConsultationForm()
                                      }}
                                      className="w-full flex items-center justify-center gap-2 py-3 bg-foreground text-background text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-foreground/90 transition-colors rounded-sm"
                                    >
                                      <Calendar className="w-3 h-3" />
                                      Book Consultation
                                    </button>
                                    
                                    {/* Secondary: Quick Question */}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        openChatForm()
                                      }}
                                      className="flex items-center justify-center gap-2 py-2 text-[10px] text-foreground/50 hover:text-foreground transition-colors"
                                    >
                                      <MessageCircle className="w-3 h-3" />
                                      <span className="underline underline-offset-4">Just a quick question?</span>
                                      <span className="text-foreground/30 ml-1">• We reply in 10 min</span>
                                    </button>
                                  </div>
                                ) : activeFormType === 'consultation' ? (
                                  /* Consultation Form - Full Details */
                                  <form
                                    onSubmit={handleConsultationSubmit}
                                    onClick={(e) => e.stopPropagation()}
                                    className="space-y-4 pt-4 border-t border-foreground/10"
                                  >
                                    <div className="flex justify-between items-center mb-2">
                                      <div>
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-foreground font-bold">Book Consultation</p>
                                        <p className="text-[9px] text-foreground/50 mt-0.5">We'll confirm within 24 hours</p>
                                      </div>
                                      <button 
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          closeForm()
                                        }}
                                        className="text-foreground/40 hover:text-foreground"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                      <input 
                                        type="text" 
                                        placeholder="Full Name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full bg-transparent border-b border-foreground/20 py-2 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/40 text-foreground"
                                        required
                                      />
                                      <input 
                                        type="email" 
                                        placeholder="Email Address"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full bg-transparent border-b border-foreground/20 py-2 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/40 text-foreground"
                                        required
                                      />
                                    </div>
                                    
                                    <input 
                                      type="tel" 
                                      placeholder="Phone Number"
                                      value={formData.phone}
                                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                      className="w-full bg-transparent border-b border-foreground/20 py-2 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/40 text-foreground"
                                    />
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                      {/* Date Input */}
                                      <div className="relative">
                                        <input 
                                          type="date" 
                                          min={minDate}
                                          placeholder="Preferred Date"
                                          value={formData.date}
                                          onChange={(e) => setFormData({...formData, date: e.target.value})}
                                          className={`w-full bg-transparent border-b border-foreground/20 py-2 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/40 ${formData.date ? 'text-foreground' : 'text-foreground/40'}`}
                                        />
                                      </div>
                                      
                                      {/* Time Select with Clear Button */}
                                      <div className="relative">
                                        <select 
                                          value={formData.time}
                                          onChange={(e) => setFormData({...formData, time: e.target.value})}
                                          className={`w-full bg-transparent border-b border-foreground/20 py-2 text-sm focus:outline-none focus:border-foreground transition-colors appearance-none cursor-pointer pr-8 ${formData.time ? 'text-foreground' : 'text-foreground/40'}`}
                                        >
                                          <option value="" className="bg-background text-foreground/40">Preferred Time</option>
                                          {timeSlots.map(time => (
                                            <option key={time} value={time} className="bg-background text-foreground">{time}</option>
                                          ))}
                                        </select>
                                        
                                        {/* Clear button - appears when time is selected */}
                                        {formData.time && (
                                          <button
                                            type="button"
                                            onClick={() => setFormData({...formData, time: ''})}
                                            className="absolute right-6 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/70"
                                          >
                                            <X className="w-3 h-3" />
                                          </button>
                                        )}
                                        
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                                          <svg className="w-4 h-4 text-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                          </svg>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <textarea 
                                      placeholder="Tell us about your event vision, estimated guest count, and any specific requirements..."
                                      value={formData.message}
                                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                                      rows={3}
                                      className="w-full bg-transparent border-b border-foreground/20 py-2 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/40 text-foreground resize-none"
                                      required
                                    />
                                    
                                    <button 
                                      type="submit"
                                      className="w-full py-3 bg-foreground text-background text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-foreground/90 transition-colors rounded-sm flex items-center justify-center gap-2"
                                    >
                                      <Calendar className="w-3 h-3" />
                                      Schedule Consultation
                                    </button>

                                    {/* Switch to Chat */}
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        switchToChat()
                                      }}
                                      className="w-full flex items-center justify-center gap-2 py-2 text-[10px] text-foreground/50 hover:text-foreground transition-colors"
                                    >
                                      <MessageCircle className="w-3 h-3" />
                                      <span className="underline underline-offset-4">Just a quick question instead?</span>
                                    </button>
                                  </form>
                                ) : (
                                  /* Chat Form - Quick Question Only */
                                  <form
                                    onSubmit={handleChatSubmit}
                                    onClick={(e) => e.stopPropagation()}
                                    className="space-y-4 pt-4 border-t border-foreground/10"
                                  >
                                    <div className="flex justify-between items-center mb-2">
                                      <div>
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-foreground font-bold">Quick Question</p>
                                        <p className="text-[9px] text-foreground/50 mt-0.5">Typical response time: 10 minutes</p>
                                      </div>
                                      <button 
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          closeForm()
                                        }}
                                        className="text-foreground/40 hover:text-foreground"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                    
                                    <input 
                                      type="text" 
                                      placeholder="Your Name"
                                      value={formData.name}
                                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                                      className="w-full bg-transparent border-b border-foreground/20 py-2 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/40 text-foreground"
                                      required
                                    />
                                    
                                    <input 
                                      type="email" 
                                      placeholder="Email for Reply"
                                      value={formData.email}
                                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                                      className="w-full bg-transparent border-b border-foreground/20 py-2 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/40 text-foreground"
                                      required
                                    />
                                    
                                    <textarea 
                                      placeholder="What's your question? Ask anything about this service..."
                                      value={formData.question}
                                      onChange={(e) => setFormData({...formData, question: e.target.value})}
                                      rows={4}
                                      className="w-full bg-transparent border-b border-foreground/20 py-2 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/40 text-foreground resize-none"
                                      required
                                    />
                                    
                                    <div className="flex gap-2">
                                      <button 
                                        type="submit"
                                        className="flex-1 py-3 bg-foreground text-background text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-foreground/90 transition-colors rounded-sm flex items-center justify-center gap-2"
                                      >
                                        <Send className="w-3 h-3" />
                                        Send Question
                                      </button>
                                    </div>

                                    {/* Switch to Consultation */}
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        switchToConsultation()
                                      }}
                                      className="w-full flex items-center justify-center gap-2 py-2 text-[10px] text-foreground/50 hover:text-foreground transition-colors"
                                    >
                                      <Calendar className="w-3 h-3" />
                                      <span className="underline underline-offset-4">Want to book a full consultation instead?</span>
                                    </button>
                                    
                                    <p className="text-[9px] text-foreground/40 text-center">
                                      Or WhatsApp us: <span className="text-foreground/60">+254 700 000 000</span>
                                    </p>
                                  </form>
                                )}

                                {/* Related Services */}
                                {!activeFormType && (
                                  <div className="mt-6 pt-6 border-t border-foreground/10">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-3">Pairs well with</p>
                                    <div className="flex flex-wrap gap-2">
                                      {service.related.map((relatedName) => (
                                        <button 
                                          key={relatedName}
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            categories.forEach((cat, catIdx) => {
                                              const svcIdx = cat.services.findIndex(s => s.name === relatedName)
                                              if (svcIdx !== -1) {
                                                handleCategoryClick(catIdx)
                                                setTimeout(() => setExpandedService(relatedName), 300)
                                              }
                                            })
                                          }}
                                          className="text-[10px] px-3 py-1.5 border border-foreground/20 rounded-full hover:bg-foreground hover:text-background transition-all duration-300 text-foreground/70"
                                        >
                                          {relatedName}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 pt-6 border-t border-foreground/10 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-xs text-foreground/50 text-center sm:text-left">
            Can't find what you're looking for? We love custom projects.
          </p>
          
          <button 
            onClick={() => expandedService && closeForm()}
            className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-foreground/70 hover:text-foreground transition-colors"
          >
            Request Custom Service
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Auto-play Status */}
        {isInView && (
          <div className="mt-6 flex justify-center">
            <p className="text-[9px] uppercase tracking-[0.3em] text-foreground/30 flex items-center gap-2">
              <span className={`w-1 h-1 rounded-full ${(isHoveringInteractive || expandedService) ? 'bg-foreground/20' : 'bg-foreground/50 animate-pulse'}`} />
              {expandedService ? 'Service Open - Paused' : isHoveringInteractive ? 'Paused' : `Auto-scrolling ${currentCategory.title}`}
            </p>
          </div>
        )}

      </div>
    </section>
  )
}