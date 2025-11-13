import Navbar from "@/components/marketing-navbar";
import Hero from "@/components/landing/hero";
import FeatureGrid from "@/components/landing/feature-grid";
import ScientificValidation from "@/components/landing/scientific-validation";
import HowItWorks from "@/components/landing/how-It-works";
import CTA from "@/components/landing/cta";
import Footer from "@/components/landing/footer";

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
