import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import StatsBar from "./StatsBar";
import HowItWorks from "./HowItWorks";
import FeaturesSection from "./FeaturesSection";
import Testimonials from "./Testimonials";
import CtaBanner from "./CtaBanner";
import Footer from "./Footer";

export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <StatsBar />
      <HowItWorks />
      <FeaturesSection />
      <Testimonials />
      <CtaBanner />
      <Footer />
    </main>
  );
}
