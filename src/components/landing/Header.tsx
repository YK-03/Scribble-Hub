import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#contact", label: "Contact" }
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    if (isMenuOpen) setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full z-50 border-b border-border/20 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <img src="/pen-tool.png" alt="Scribble Hub Logo" className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#de6dc8] to-[#a855f7] bg-clip-text text-transparent ">
              Scribble Hub
            </span>
          </Link>

          {/* Desktop CTA */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleScroll(e, link.href)}
                className="cursor-pointer text-foreground/80 hover:text-primary transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button asChild>
               <Link to="/signup">Sign In</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden animate-fade-in border-t border-border/20 bg-background/95 py-4">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="cursor-pointer text-foreground/80 hover:text-primary transition-colors font-medium py-2 text-center"
                  onClick={(e) => handleScroll(e, link.href)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 border-t border-border/20 pt-4">
                <Button asChild variant="outline" className="w-full justify-center">
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;