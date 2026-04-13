"use client"

import Hero from "@/components/sections/HeroTemp"
import BrandStatement from "@/components/sections/BrandStatement"
import Blog from "@/app/(main)/blog/BlogCarousel"
import EpicTestimonials from "@/components/sections/testimonials"
import { ServicesCodex } from '@/components/sections/ServicesCodex'
import ConversionEngine from "@/components/sections/ConversionEngine";
import { ContactAtelier } from "@/components/sections/ContactAtelier";

export default function Home() {
  return (
    <div className="flex flex-col w-full bg-background">
      <Hero />
      <BrandStatement />
      <ServicesCodex />
      <ConversionEngine />      
      <EpicTestimonials />
      <ContactAtelier />  
    </div>
  )
}
