import Navbar from "@/components/marketing-navbar";
import Hero from "@/components/landing/Hero";
import FeatureGrid from "@/components/landing/FeatureGrid";
import ScientificValidation from "@/components/landing/ScientificValidation";
import HowItWorks from "@/components/landing/HowItWorks";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div>
      <main>
        <Hero />
        <FeatureGrid />
        <ScientificValidation />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
