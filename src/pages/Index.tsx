import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import FeatureGrid from "@/components/landing/FeatureGrid";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen force-light-theme">
      <Header />
      <main>
        <HeroSection />
        <FeatureGrid />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
