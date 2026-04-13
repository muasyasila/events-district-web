"use client"

import Hero from "@/components/sections/HeroTemp"
import BrandStatement from "@/components/sections/BrandStatement"
import Blog from "@/app/(main)/blog/BlogCarousel"
import EpicTestimonials from "@/components/sections/testimonials"
import LeadMagnet from '@/components/sections/LeadMagnet'
import BackToTop from '@/components/BackToTop'
import { ServicesCodex } from '@/components/sections/ServicesCodex'
import ConversionEngine from "@/components/sections/ConversionEngine";
import { SocialAtelier } from "@/components/sections/SocialAtelier";
import { ContactAtelier } from "@/components/sections/ContactAtelier";
import { PartnershipAtelier } from "@/components/sections/PartnershipAtelier"
import WeddingQuoteSection from "@/components/sections/WeddingQuoteSection"
import BlogJournal from "@/components/sections/BlogJournal"

export default function Home() {
  return (
    <div className="flex flex-col w-full bg-background">
      <Hero />
      <BrandStatement />
      <ServicesCodex />
      <ConversionEngine />

      
      <Blog />
      <EpicTestimonials />
      <ContactAtelier />  
      <BackToTop />
    </div>
  )
}
