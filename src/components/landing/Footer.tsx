import { ArrowUp, Github, Linkedin, Mail, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const socialLinks = [
    { href: "https://github.com/YK-03", icon: Github, label: "GitHub" },
    { href: "mailto:yash005kaushik@gmail.com", icon: Mail, label: "Email" },
    { href: "https://www.linkedin.com/in/yash005kaushik", icon: Linkedin, label: "LinkedIn" },
  ];

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      id="contact"
      className="scroll-mt-20 border-t border-border/70 bg-background/80 dark:border-gray-800 dark:bg-gray-900/50"
    >
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-card shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <PenTool className="h-5 w-5 text-foreground dark:text-gray-200" />
              </div>
              <div>
                <p className="text-base font-semibold tracking-tight text-foreground dark:text-gray-200">
                  Scribble Hub
                </p>
                <p className="text-sm text-muted-foreground dark:text-gray-400">
                  A calmer way to organize ideas.
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-7 text-muted-foreground dark:text-gray-400">
              Designed for people who want their notes to feel structured, useful, and easy to
              return to, whether they are planning projects or collecting everyday thoughts.
            </p>
          </div>

          <div className="flex flex-col gap-6 sm:items-end">
            <div className="flex items-center gap-3">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    aria-label={link.label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:border-primary/30 hover:text-foreground hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:text-gray-200 dark:hover:shadow-[0_12px_30px_rgba(0,0,0,0.28)]"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-fit rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={handleBackToTop}
              aria-label="Back to top"
            >
              <ArrowUp className="mr-2 h-4 w-4" />
              Back to top
            </Button>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border/70 pt-6 text-sm text-muted-foreground dark:border-gray-700 dark:text-gray-400 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Scribble Hub. All rights reserved.</p>
          <p>Built for thoughtful work.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
