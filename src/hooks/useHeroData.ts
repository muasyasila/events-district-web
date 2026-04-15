import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface HeroSlide {
  id: number
  title: string
  subtitle: string
  description: string
  cta_text: string
  cta_link: string
  category: string
  image_url: string
  order_index: number
  is_active: boolean
}

interface Testimonial {
  id: number
  name: string
  role: string
  content: string
  rating: number
  avatar_url: string
  order_index: number
  is_active: boolean
}

export function useHeroData() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      
      const { data: slidesData } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })
      
      const { data: testimonialsData } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })
      
      setSlides(slidesData || [])
      setTestimonials(testimonialsData || [])
      setLoading(false)
    }
    
    fetchData()
  }, [])

  return { slides, testimonials, loading }
}