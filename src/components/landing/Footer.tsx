import { PenTool, Twitter, Github, Mail, Heart, Linkedin, ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const socialLinks = [
    { href: "https://x.com/awkdev005", icon: Twitter, label: "Twitter" },
    { href: "https://github.com/YK-03", icon: Github, label: "GitHub" },
    { href: "mailto:yash005kaushik@gmail.com", icon: Mail, label: "Email" },
    { href: "https://www.linkedin.com/in/yash005kaushik", icon: Linkedin, label: "LinkedIn" },
  ];

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <footer id="contact" className="relative bg-card border-t border-border scroll-mt-16">
      <div className="container mx-auto px-6">
        {/* Main Footer */}
        <div className="py-16">
          <div className="flex justify-start text-left">
            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                  <PenTool className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-[#ff7ee5] to-[#a855f7] bg-clip-text text-transparent">
                  Scribble Hub
                </span>
              </div>
              
              <p className="text-muted-foreground leading-relaxed max-w-md">
                Transform your thoughts into beautifully organized notes. 
                The all-in-one digital workspace for creative minds and organized thinkers.
              </p>

              {/* Social Links */}
              <div className="flex items-center justify-start gap-4">
                {socialLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      aria-label={link.label}
                      className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>
            </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Scribble Hub. All rights reserved.
            </p>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Made with 
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              for creative minds
            </div>
          </div>
        </div>

        {/* Back to top button */}
        <div className="absolute -top-6 right-10">
          <Button
            size="icon"
            className="rounded-full shadow-lg bg-primary hover:bg-primary/90"
            onClick={handleBackToTop}
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;