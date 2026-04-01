"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  Heart, 
  Sparkles, 
  Coffee, 
  PartyPopper, 
  Briefcase,
  Building,
  ArrowRight,
  Crown,
  Users,
  Gift,
  Cake,
  ChevronRight,
  Quote,
  GraduationCap,
  Globe,
  Music,
  Calendar,
  Wine,
  Flower2,
  Star,
  Church,
  Landmark,
  Utensils
} from 'lucide-react'

interface ServiceCard {
  id: string
  title: string
  category: string
  description: string
  longDescription: string
  icon: any
  image: string
  features: string[]
  cta: {
    primary: { text: string; href: string }
    secondary?: { text: string; href: string }
  }
  priceNote?: string
  tags?: string[]
}

// All services from your ServicesCodex
const allServices: ServiceCard[] = [
  // Romance & Weddings - All 6 services (Wedding Decor is now featured separately)
  {
    id: 'engagement-parties',
    title: 'Engagement Parties',
    category: 'Romance & Weddings',
    description: 'Romantic setups, proposal backdrops',
    longDescription: 'Create the perfect moment with our bespoke engagement setups. From intimate dinner styling to dramatic proposal backdrops, we ensure your question gets the "yes" it deserves.',
    icon: Sparkles,
    image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&h=600&fit=crop',
    features: ['Proposal Backdrops', 'Intimate Dining Setup', 'Floral Installations', 'Custom Signage', 'Photo Opportunities'],
    cta: { primary: { text: 'Plan Your Proposal', href: '/contact' } },
    tags: ['Custom Quote']
  },
  {
    id: 'bridal-showers',
    title: 'Bridal Showers',
    category: 'Romance & Weddings',
    description: 'Feminine, elegant decor with custom backdrops',
    longDescription: 'Celebrate the bride-to-be with our elegant shower designs. Custom backdrops, sweet tables, and feminine touches that make for perfect photo opportunities.',
    icon: Gift,
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop',
    features: ['Custom Backdrops', 'Sweet Tables', 'Floral Arrangements', 'Photo Opportunities', 'Personalized Details'],
    cta: { primary: { text: 'Design a Shower', href: '/contact' } },
    tags: ['Custom Quote']
  },
  {
    id: 'rehearsal-dinners',
    title: 'Rehearsal Dinners',
    category: 'Romance & Weddings',
    description: 'Sophisticated table settings, ambient lighting',
    longDescription: 'Set the tone for your wedding weekend with sophisticated rehearsal dinner styling. Intimate lighting, personalized table settings, and warm ambiance.',
    icon: Wine,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
    features: ['Table Settings', 'Ambient Lighting', 'Personalized Details', 'Intimate Atmosphere'],
    cta: { primary: { text: 'Plan Rehearsal Dinner', href: '/contact' } },
    tags: ['Custom Quote']
  },
  {
    id: 'anniversary-celebrations',
    title: 'Anniversary Celebrations',
    category: 'Romance & Weddings',
    description: 'Milestone anniversaries, vow renewals',
    longDescription: 'Celebrate lasting love with nostalgic decor that honors your journey. From silver anniversaries to golden milestones, we create memories worth reliving.',
    icon: Crown,
    image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&h=600&fit=crop',
    features: ['Nostalgic Decor', 'Vow Renewal Styling', 'Milestone Celebrations', 'Custom Displays'],
    cta: { primary: { text: 'Celebrate Your Love', href: '/contact' } },
    tags: ['Custom Quote']
  },
  {
    id: 'traditional-ceremonies',
    title: 'Traditional Ceremonies',
    category: 'Romance & Weddings',
    description: 'Intimate ceremonies, recommitment celebrations',
    longDescription: 'Reaffirm your love with intimate ceremonies designed for recommitment. Elegant styling that honors your years together while creating new memories.',
    icon: Globe,
    image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&h=600&fit=crop',
    features: ['Ceremony Styling', 'Cultural Elements', 'Intimate Settings', 'Personal Touches'],
    cta: { primary: { text: 'Plan Your Ceremony', href: '/contact' } },
    tags: ['Custom Quote']
  },

  // Social & Celebrations - All 6 services
  {
    id: 'birthday-decor',
    title: 'Birthday Decor',
    category: 'Social & Celebrations',
    description: 'Milestone birthdays, themed parties',
    longDescription: 'From first birthdays to centenarian celebrations, we design age-appropriate themes that wow guests. Balloon installations, photo backdrops, and custom signage.',
    icon: Cake,
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=600&fit=crop',
    features: ['Balloon Installations', 'Photo Backdrops', 'Custom Signage', 'Themed Decor', 'Party Favors'],
    cta: { primary: { text: 'Celebrate With Us', href: '/contact' } },
    tags: ['Custom Quote']
  },
  {
    id: 'graduation-parties',
    title: 'Graduation Parties',
    category: 'Social & Celebrations',
    description: 'Personal celebrations, achievement backdrops',
    longDescription: 'Celebrate academic achievements with style. Custom backdrops for photos, themed decor for school colors, and setups that honor the graduate.',
    icon: GraduationCap,
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop',
    features: ['Custom Backdrops', 'School Color Themes', 'Photo Opportunities', 'Memory Displays', 'Achievement Highlights'],
    cta: { primary: { text: 'Honor the Graduate', href: '/contact' } },
    tags: ['Custom Quote']
  },
  {
    id: 'baby-showers',
    title: 'Baby Showers',
    category: 'Social & Celebrations',
    description: 'Gender reveal setups, whimsical themes',
    longDescription: 'Welcome new life with our whimsical baby shower designs. Gender reveal setups, dessert tables, and themes that range from classic to contemporary.',
    icon: PartyPopper,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop',
    features: ['Gender Reveal Setups', 'Dessert Tables', 'Whimsical Themes', 'Photo Opportunities', 'Guest Activities'],
    cta: { primary: { text: 'Celebrate Baby', href: '/contact' } },
    tags: ['Custom Quote']
  },
  {
    id: 'picnic-dates',
    title: 'Picnic Dates',
    category: 'Social & Celebrations',
    description: 'Luxury picnic setups with cushions, florals',
    longDescription: 'Romantic outdoor experiences complete with low tables, luxury cushions, grazing platters, and fresh florals. Perfect for proposals or anniversaries.',
    icon: Coffee,
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop',
    features: ['Low Tables', 'Luxury Cushions', 'Fresh Florals', 'Grazing Platters', 'Outdoor Setup'],
    cta: { primary: { text: 'Plan Your Picnic', href: '/contact' } },
    tags: ['Custom Quote']
  },
  {
    id: 'surprise-parties',
    title: 'Surprise Parties',
    category: 'Social & Celebrations',
    description: 'Full reveal setups, dramatic entrances',
    longDescription: 'The art of the surprise. We coordinate reveal moments, dramatic entrances, and custom signage that makes the guest of honor feel truly special.',
    icon: Star,
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
    features: ['Reveal Moments', 'Dramatic Entrances', 'Custom Signage', 'Themed Decor', 'Guest Experience'],
    cta: { primary: { text: 'Plan a Surprise', href: '/contact' } },
    tags: ['Custom Quote']
  },
  {
    id: 'memorial-services',
    title: 'Memorial Services',
    category: 'Social & Celebrations',
    description: 'Celebrations of life, tribute events',
    longDescription: 'Honor loved ones with dignity and grace. We create serene environments for celebrations of life, with thoughtful touches that reflect their legacy.',
    icon: Heart,
    image: 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=800&h=600&fit=crop',
    features: ['Serene Environments', 'Tribute Displays', 'Thoughtful Details', 'Memorial Styling'],
    cta: { primary: { text: 'Honor a Legacy', href: '/contact' } },
    tags: ['Custom Quote']
  },

  // Corporate & Professional - 6 services
  {
    id: 'corporate-events',
    title: 'Corporate Events',
    category: 'Corporate & Professional',
    description: 'Branded environments, stage design',
    longDescription: 'Professional events that reflect your brand identity. Networking lounges, branded stages, and environments designed for business and pleasure.',
    icon: Briefcase,
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop',
    features: ['Branded Stages', 'Networking Lounges', 'Custom Signage', 'Lighting Design', 'Brand Integration'],
    cta: { primary: { text: 'Elevate Your Brand', href: '/contact' } },
    tags: ['Custom Quote']
  },
  {
    id: 'product-launches',
    title: 'Product Launches',
    category: 'Corporate & Professional',
    description: 'Immersive brand activations',
    longDescription: 'Make your product unforgettable with immersive activations. Interactive displays, press-ready backdrops, and experiences that generate buzz.',
    icon: Sparkles,
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop',
    features: ['Interactive Displays', 'Press-Ready Backdrops', 'Brand Activations', 'Photo Opportunities'],
    cta: { primary: { text: 'Launch Your Product', href: '/contact' } },
    tags: ['Custom Quote']
  },
  {
    id: 'gala-dinners',
    title: 'Gala Dinners',
    category: 'Corporate & Professional',
    description: 'Luxurious table settings, red carpet',
    longDescription: 'Black-tie affairs executed with precision. Red carpet experiences, luxurious table settings, and dramatic lighting for unforgettable evenings.',
    icon: Crown,
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&h=600&fit=crop',
    features: ['Red Carpet Experiences', 'Luxurious Table Settings', 'Dramatic Lighting', 'VIP Lounges', 'Stage Design'],
    cta: { primary: { text: 'Plan Your Gala', href: '/contact' } },
    tags: ['Custom Quote']
  },
  {
    id: 'award-ceremonies',
    title: 'Award Ceremonies',
    category: 'Corporate & Professional',
    description: 'Stage grandeur, trophy displays',
    longDescription: 'Celebrate excellence with grandeur. Trophy displays, VIP lounges, and stage designs that honor achievement in style.',
    icon: Star,
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
    features: ['Stage Design', 'Trophy Displays', 'VIP Lounges', 'Award Presentations'],
    cta: { primary: { text: 'Honor Excellence', href: '/contact' } },
    tags: ['Custom Quote']
  },
  {
    id: 'conferences',
    title: 'Conferences',
    category: 'Corporate & Professional',
    description: 'Speaker stages, registration branding',
    longDescription: 'Professional conferences that inspire. Speaker stages, branded registration areas, and breakout rooms designed for learning and connection.',
    icon: Users,
    image: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=800&h=600&fit=crop',
    features: ['Speaker Stages', 'Registration Branding', 'Breakout Rooms', 'Networking Areas'],
    cta: { primary: { text: 'Plan Your Conference', href: '/contact' } },
    tags: ['Custom Quote']
  },
  {
    id: 'trade-shows',
    title: 'Trade Shows',
    category: 'Corporate & Professional',
    description: 'Booth design, branded activations',
    longDescription: 'Stand out on the exhibition floor with custom booth designs and branded activations that draw crowds and drive engagement.',
    icon: Building,
    image: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=800&h=600&fit=crop',
    features: ['Custom Booths', 'Branded Activations', 'Interactive Displays', 'Engagement Zones'],
    cta: { primary: { text: 'Design Your Booth', href: '/contact' } },
    tags: ['Custom Quote']
  },

  // Institutional & Scale - 6 services
  {
    id: 'graduation-ceremonies',
    title: 'Graduation Ceremonies',
    category: 'Institutional & Scale',
    description: 'Full school/university decor',
    longDescription: 'Large-scale commencement ceremonies for entire institutions. Stage design, photo opportunities, directional signage, and branded backdrops for thousands of guests.',
    icon: GraduationCap,
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop',
    features: ['Stage Design', 'Photo Opportunities', 'Directional Signage', 'Branded Backdrops', 'Large-Scale Setup'],
    cta: { primary: { text: 'Plan Commencement', href: '/contact' } },
    tags: ['Custom Quote']
  },
  {
    id: 'university-events',
    title: 'University Events',
    category: 'Institutional & Scale',
    description: "Freshers' balls, alumni galas",
    longDescription: 'Campus celebrations that become traditions. Freshers balls, alumni reunions, and faculty recognition nights designed for academic communities.',
    icon: Landmark,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    features: ['Themed Decor', 'Photo Opportunities', 'Campus Traditions', 'Alumni Celebrations'],
    cta: { primary: { text: 'Celebrate on Campus', href: '/contact' } },
    tags: ['Custom Quote']
  },
  {
    id: 'charity-galas',
    title: 'Charity Galas',
    category: 'Institutional & Scale',
    description: 'Elegant decor, mission-driven',
    longDescription: 'Fundraising events that inspire generosity. Elegant decor aligned with your mission, creating atmospheres where donors feel connected to your cause.',
    icon: Heart,
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&h=600&fit=crop',
    features: ['Elegant Decor', 'Mission Alignment', 'Donor Experiences', 'Fundraising Styling'],
    cta: { primary: { text: 'Plan Your Gala', href: '/contact' } },
    tags: ['Custom Quote']
  },
  {
    id: 'community-festivals',
    title: 'Community Festivals',
    category: 'Institutional & Scale',
    description: 'Large-scale installations',
    longDescription: 'Bring communities together with large-scale installations, multiple stages, and experiential zones that celebrate culture and connection.',
    icon: Music,
    image: 'https://images.unsplash.com/photo-1533174072545-7a4ce6eadca9?w=800&h=600&fit=crop',
    features: ['Large-Scale Installations', 'Multiple Stages', 'Experiential Zones', 'Community Engagement'],
    cta: { primary: { text: 'Create a Festival', href: '/contact' } },
    tags: ['Custom Quote']
  },
  {
    id: 'political-events',
    title: 'Political Events',
    category: 'Institutional & Scale',
    description: 'Rallies, inaugurations, diplomatic functions',
    longDescription: 'Professional staging for political and diplomatic occasions. Podium design, backdrop branding, and secure environment styling.',
    icon: Globe,
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&h=600&fit=crop',
    features: ['Podium Design', 'Backdrop Branding', 'Secure Styling', 'Professional Staging'],
    cta: { primary: { text: 'Plan Your Event', href: '/contact' } },
    tags: ['Custom Quote']
  },
  {
    id: 'religious-ceremonies',
    title: 'Religious Ceremonies',
    category: 'Institutional & Scale',
    description: 'Weddings, baptisms, cultural celebrations',
    longDescription: 'Respectful and beautiful decor for religious and cultural ceremonies. We honor traditions while bringing visual excellence to sacred spaces.',
    icon: Church,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
    features: ['Sacred Space Styling', 'Cultural Traditions', 'Floral Installations', 'Respectful Design'],
    cta: { primary: { text: 'Honor Your Tradition', href: '/contact' } },
    tags: ['Custom Quote']
  },

  // Culinary & Dining - 6 services
  {
    id: 'catering-presentation',
    title: 'Catering Presentation',
    category: 'Culinary & Dining',
    description: 'Food stations, buffet styling',
    longDescription: 'Elevate your culinary offerings with artful presentation. Food stations, buffet styling, and chef table setups that make dining an experience.',
    icon: Utensils,
    image: 'https://images.unsplash.com/photo-1555244162-803794f237d3?w=800&h=600&fit=crop',
    features: ['Food Stations', 'Buffet Styling', 'Chef Table Setups', 'Artful Presentation'],
    cta: { primary: { text: 'Elevate Your Dining', href: '/contact' } },
    tags: ['Custom Quote']
  },
  {
    id: 'bar-lounge',
    title: 'Bar & Lounge',
    category: 'Culinary & Dining',
    description: 'Signature drink stations, champagne walls',
    longDescription: 'Sophisticated drinking experiences. Champagne walls, signature cocktail stations, and lounge vignettes that encourage conversation.',
    icon: Coffee,
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&h=600&fit=crop',
    features: ['Champagne Walls', 'Signature Cocktail Stations', 'Lounge Vignettes', 'Bar Styling'],
    cta: { primary: { text: 'Design Your Bar', href: '/contact' } },
    tags: ['Custom Quote']
  },
  {
    id: 'cakes-confectionery',
    title: 'Cakes & Confectionery',
    category: 'Culinary & Dining',
    description: 'Custom cake displays, dessert tables',
    longDescription: 'Showcase sweet creations with custom displays. Tiered cake stands, dessert tablescapes, and pastry installations that look as good as they taste.',
    icon: Cake,
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=800&h=600&fit=crop',
    features: ['Custom Cake Displays', 'Dessert Tablescapes', 'Pastry Installations', 'Sweet Styling'],
    cta: { primary: { text: 'Display Your Sweets', href: '/contact' } },
    tags: ['Custom Quote']
  },
  {
    id: 'dining-experiences',
    title: 'Dining Experiences',
    category: 'Culinary & Dining',
    description: 'Tablescaping, thematic dining rooms',
    longDescription: 'Immersive dining environments. Thematic tablescaping, room transformations, and sensory details that turn meals into memories.',
    icon: Wine,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
    features: ['Tablescaping', 'Room Transformations', 'Thematic Design', 'Sensory Details'],
    cta: { primary: { text: 'Create an Experience', href: '/contact' } },
    tags: ['Custom Quote']
  },
  {
    id: 'food-festivals',
    title: 'Food Festivals',
    category: 'Culinary & Dining',
    description: 'Outdoor culinary events, tasting stations',
    longDescription: 'Large-scale culinary celebrations. Multiple vendor styling, tasting stations, and outdoor dining environments that bring food communities together.',
    icon: Music,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
    features: ['Vendor Styling', 'Tasting Stations', 'Outdoor Dining', 'Culinary Celebrations'],
    cta: { primary: { text: 'Plan a Food Festival', href: '/contact' } },
    tags: ['Custom Quote']
  },
  {
    id: 'private-chef',
    title: 'Private Chef Experiences',
    category: 'Culinary & Dining',
    description: 'Intimate dining, chef table styling',
    longDescription: 'Exclusive dining experiences in private settings. Chef table styling, intimate lighting, and personalized touches for memorable meals.',
    icon: Crown,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
    features: ['Chef Table Styling', 'Intimate Lighting', 'Personalized Touches', 'Exclusive Dining'],
    cta: { primary: { text: 'Book a Private Chef', href: '/contact' } },
    tags: ['Custom Quote']
  }
]

// Group services by category
const groupedServices = allServices.reduce((acc, service) => {
  if (!acc[service.category]) {
    acc[service.category] = []
  }
  acc[service.category].push(service)
  return acc
}, {} as Record<string, ServiceCard[]>)

export default function ServicesClient() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Simple Header - Minimal */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-20 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="h-px w-12 bg-foreground/20 mx-auto mb-6" />
          <h1 className="text-3xl md:text-4xl font-serif italic text-foreground">
            Our Services
          </h1>
        </motion.div>
      </div>

      {/* Featured Wedding Section - Single, prominent */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
        <div className="bg-background border border-foreground/10 rounded-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 p-8 md:p-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-foreground/60" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/40 font-medium">
                  Featured Service
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif italic text-foreground mb-4">
                Wedding Decor
              </h2>
              <p className="text-foreground/60 font-light leading-relaxed mb-6">
                From intimate ceremonies to grand receptions, we create immersive wedding environments. 
                Our team handles everything from floral installations to lighting design, ensuring your 
                special day reflects your unique love story.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="flex items-center gap-2 text-sm text-foreground/60">
                  <Crown size={14} className="text-foreground/40" />
                  <span>3 Curated Packages</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground/60">
                  <Users size={14} className="text-foreground/40" />
                  <span>100-1000+ Guests</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground/60">
                  <Flower2 size={14} className="text-foreground/40" />
                  <span>Custom Designs</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground/60">
                  <Calendar size={14} className="text-foreground/40" />
                  <span>Full Planning Support</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/quote"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-foreground text-background text-[11px] uppercase tracking-wider font-bold hover:bg-foreground/90 transition-colors rounded-full"
                >
                  Get Wedding Quote
                  <ArrowRight size={12} />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 border border-foreground/20 text-foreground text-[11px] uppercase tracking-wider font-bold hover:border-foreground/40 transition-colors rounded-full"
                >
                  Book Consultation
                </Link>
              </div>
              <p className="text-[10px] text-foreground/40 mt-6">
                ✨ Packages from KES 66,300 for 100 guests
              </p>
            </div>
            
            <div className="relative h-64 lg:h-auto rounded-xl overflow-hidden bg-foreground/5">
              <img
                src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop"
                alt="Wedding decor"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>

      {/* All Services Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
        {Object.entries(groupedServices).map(([category, categoryServices]) => (
          <div key={category} className="mb-20 last:mb-0">
            <h2 className="text-2xl font-serif italic text-foreground mb-8 border-l-2 border-foreground/20 pl-4">
              {category}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryServices.map((service) => {
                const Icon = service.icon
                const isExpanded = expandedId === service.id
                
                return (
                  <motion.div
                    key={service.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="relative"
                  >
                    <div
                      className={`bg-background border border-foreground/10 rounded-xl overflow-hidden transition-all duration-500 ${
                        isExpanded ? 'ring-1 ring-foreground/20' : 'hover:border-foreground/30'
                      }`}
                    >
                      {/* Image Preview */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                        
                        {/* Tags */}
                        <div className="absolute top-3 left-3 flex gap-2">
                          {service.tags?.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 text-[8px] font-medium uppercase tracking-wider rounded-full bg-foreground/20 text-foreground/70"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="p-1.5 rounded-lg bg-foreground/5 border border-foreground/10">
                            <Icon className="w-4 h-4 text-foreground/60" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-serif italic text-foreground">
                              {service.title}
                            </h3>
                            <p className="text-[11px] text-foreground/40 mt-0.5">
                              {service.description}
                            </p>
                          </div>
                        </div>

                        {/* Price Note */}
                        {service.priceNote && (
                          <p className="text-[10px] text-foreground/40 mt-2">
                            {service.priceNote}
                          </p>
                        )}

                        {/* Expand Button */}
                        <button
                          onClick={() => toggleExpand(service.id)}
                          className="mt-4 flex items-center gap-1 text-[10px] uppercase tracking-wider text-foreground/40 hover:text-foreground transition-colors group"
                        >
                          <span>{isExpanded ? 'Show less' : 'Discover more'}</span>
                          <ChevronRight
                            size={12}
                            className={`transition-transform duration-300 ${
                              isExpanded ? 'rotate-90' : 'group-hover:translate-x-0.5'
                            }`}
                          />
                        </button>

                        {/* Expanded Content */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="pt-4 mt-4 border-t border-foreground/10 space-y-4">
                                <p className="text-xs text-foreground/60 font-light leading-relaxed">
                                  {service.longDescription}
                                </p>
                                
                                {/* Features */}
                                <div>
                                  <p className="text-[9px] uppercase tracking-wider text-foreground/40 mb-2">
                                    What's Included
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {service.features.map((feature) => (
                                      <span
                                        key={feature}
                                        className="text-[9px] px-2 py-1 bg-foreground/5 border border-foreground/10 rounded-full text-foreground/50"
                                      >
                                        {feature}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                {/* CTAs */}
                                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                  <Link
                                    href={service.cta.primary.href}
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-foreground text-background text-[10px] uppercase tracking-wider font-bold hover:bg-foreground/90 transition-colors rounded-full"
                                  >
                                    {service.cta.primary.text}
                                    <ArrowRight size={10} />
                                  </Link>
                                  {service.cta.secondary && (
                                    <Link
                                      href={service.cta.secondary.href}
                                      className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-foreground/20 text-foreground text-[10px] uppercase tracking-wider font-bold hover:border-foreground/40 transition-colors rounded-full"
                                    >
                                      {service.cta.secondary.text}
                                    </Link>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Custom Quote CTA */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-20">
        <div className="bg-background border border-foreground/10 rounded-xl p-8 md:p-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-foreground/5 border border-foreground/10 rounded-full mb-6">
            <Quote className="w-3 h-3 text-foreground/60" />
            <span className="text-[8px] uppercase tracking-[0.2em] text-foreground/50 font-medium">
              Need Something Custom?
            </span>
          </div>
          
          <h2 className="text-2xl font-serif italic text-foreground mb-3">
            Create a Unique Experience
          </h2>
          
          <p className="text-foreground/50 max-w-xl mx-auto mb-6 font-light text-sm">
            Don't see exactly what you're looking for? Let's collaborate to design something extraordinary, 
            tailored specifically to your vision.
          </p>
          
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-foreground text-background text-[10px] uppercase tracking-wider font-bold hover:bg-foreground/90 transition-colors rounded-full"
          >
            Request Custom Quote
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </main>
  )
}