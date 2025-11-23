import Navbar from "@/components/marketing/navbar/marketing-navbar";
import Hero from "@/components/marketing/landing/hero";
import FeatureGrid from "@/components/marketing/landing/feature-grid";
import ScientificValidation from "@/components/marketing/landing/scientific-validation";
import HowItWorks from "@/components/marketing/landing/how-It-works";
import CTA from "@/components/marketing/landing/cta";
import Footer from "@/components/marketing/landing/footer";

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
