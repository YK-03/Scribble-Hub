import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, WifiOff, Smartphone } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient" />
      
      {/* Floating Elements */}
      <div className="absolute top-10 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-10 right-1/4 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '3s' }} />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          {/* Badge */}
          
          {/* Heading */}
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to transform
            <br />
            <span className="bg-gradient-to-r from-accent to-white bg-clip-text text-transparent">
              your note-taking?
            </span>
          </h2>

          {/* Description */}
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            Start organizing your thoughts beautifully today. No credit card required, 
            cancel anytime. Your creativity deserves the best tools.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Link to="/signup">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 shadow-xl shadow-primary/25 px-8 py-4 text-lg font-semibold"
              >
                <ArrowRight className="w-5 h-5 mr-3" />
                Start Writing Now
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-white/60">
            <div className="flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm">Free forever plan</span>
            </div>
            <div className="flex items-center gap-2.5">
              <WifiOff className="w-4 h-4 text-blue-400" />
              <span className="text-sm">Works offline</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-indigo-400" />
              <span className="text-sm">Sync across devices</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;