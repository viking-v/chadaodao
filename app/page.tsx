import { LandingHeader } from "@/components/landing/header"
import { HeroSection } from "@/components/landing/hero"
import { FeaturesSection } from "@/components/landing/features"
import { HowItWorksSection } from "@/components/landing/how-it-works"
import { CommissionSection } from "@/components/landing/commission"
import { LandingFooter } from "@/components/landing/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <LandingHeader />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CommissionSection />
      </main>
      <LandingFooter />
    </div>
  )
}
