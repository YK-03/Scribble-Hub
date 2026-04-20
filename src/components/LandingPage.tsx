import Header from "./landing/Header";
import HeroSection from "./landing/HeroSection";
import FeatureGrid from "./landing/FeatureGrid";
import CTASection from "./landing/CTASection";
import Footer from "./landing/Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-gray-900">
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.16),transparent_52%)] dark:bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.18),transparent_58%)]" />
        <div className="absolute inset-x-0 top-24 -z-10 mx-auto h-72 max-w-6xl rounded-full bg-[radial-gradient(circle,_hsl(var(--accent)/0.18),transparent_68%)] blur-3xl dark:bg-[radial-gradient(circle,_hsl(var(--accent)/0.1),transparent_72%)]" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-64 bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.45))] dark:bg-[linear-gradient(180deg,transparent,rgba(17,24,39,0.96))]" />
        <Header />
        <main className="relative">
          <HeroSection />
          <FeatureGrid />
          <CTASection />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
