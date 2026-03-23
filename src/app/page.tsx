import Hero from "@/components/sections/HeroTemp"
import BrandStatement from "@/components/sections/BrandStatement"
import Blog from "@/components/sections/Blog"
import EpicTestimonials from "@/components/sections/testimonials"


import { SocialAtelier } from "@/components/sections/SocialAtelier";
import { ContactAtelier } from "@/components/sections/ContactAtelier";
import { PartnershipAtelier } from "@/components/sections/PartnershipAtelier"
import { LuxuryFooter } from "@/components/sections/LuxuryFooter";

export default function Home() {
  return (
    <div className="flex flex-col w-full bg-background">
      <Hero />
      <BrandStatement />
      <Blog />
      <EpicTestimonials />
      
      {/* This is the cool, kinetic social section */}

      <SocialAtelier />
      
      {/* This is the sleek, luxury contact section */}
      <ContactAtelier />
      <PartnershipAtelier />
      <LuxuryFooter />
    </div>
  )
}