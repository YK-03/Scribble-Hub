import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#contact", label: "Contact" },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-card shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <img src="/pen-tool.png" alt="Scribble Hub Logo" className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold tracking-tight text-foreground dark:text-gray-200">
              Scribble Hub
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleScroll(e, link.href)}
              className="text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground dark:text-gray-400 dark:hover:text-gray-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {isMenuOpen ? (
        <div className="border-t border-border/70 bg-background/95 px-6 py-4 md:hidden dark:border-gray-800 dark:bg-gray-900/95">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                onClick={(e) => handleScroll(e, link.href)}
              >
                {link.label}
              </a>
            ))}
            </nav>
        </div>
      ) : null}
    </header>
  );
};

export default Header;
