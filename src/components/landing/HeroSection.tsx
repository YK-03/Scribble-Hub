import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-illustration.jpg";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center justify-center py-20">
      {/* Gradient Background */}
      <div className="absolute inset-0 hero-gradient" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-accent/20 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-accent/30 rounded-full blur-lg animate-float" style={{ animationDelay: '4s' }} />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="space-y-8 animate-slide-up text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-white">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              AI-Powered Note Taking
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight">
              Capture Ideas,
              <br />
              <span className="bg-gradient-to-r from-accent to-white bg-clip-text text-transparent">
                Create Magic
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Transform your thoughts into beautifully organized notes. From project ideas to creative recipes, 
              Scribble Hub is your all-in-one digital workspace.
            </p>

            </div>

          {/* Hero Image */}
          <div className="relative animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative group">
              <div className="absolute -inset-2.5 bg-gradient-to-br from-primary to-accent rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-all duration-500" />
              <img 
                src={heroImage} 
                alt="Scribble Hub - AI-powered note taking interface" 
                className="relative w-full h-auto rounded-2xl shadow-2xl shadow-primary/30 transform group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;