import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

import heroImage from "@/assets/hero-illustration.jpg";

const HeroSection = () => {
  return (
    <section className="px-6 pb-16 pt-14 sm:pb-20 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-24">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
        <div className="max-w-2xl">
          
          <h1 className="mt-8 text-5xl font-semibold tracking-tight text-foreground dark:text-gray-200 sm:text-6xl lg:text-7xl">
            Notes that feel as clear as your best thinking.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground dark:text-gray-400 sm:text-xl">
            Scribble Hub gives you a clean workspace for capturing ideas, managing meetings,
            tracking reading, and shaping plans without the clutter of a noisy interface.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-xl bg-foreground px-6 text-base font-medium text-background transition-all duration-200 hover:scale-[1.02] hover:bg-foreground/90 hover:shadow-lg dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-100 dark:hover:shadow-[0_14px_36px_rgba(0,0,0,0.35)]"
            >
              <Link to="/signup">
                Start writing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-xl border-border bg-background/70 px-6 text-base font-medium transition-all duration-200 hover:scale-[1.02] hover:bg-muted dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <a href="#features">Explore features</a>
            </Button>
          </div>

          <div className="mt-10 flex flex-col gap-3 text-sm text-muted-foreground dark:text-gray-400 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Instant Google sign-in
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Clean dark and light mode
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Built for focused workflows
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.14),transparent_58%)] blur-2xl dark:bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.18),transparent_62%)]" />
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card/80 p-3 shadow-[0_24px_80px_hsl(var(--foreground)/0.08)] backdrop-blur sm:p-4 dark:border-gray-700 dark:bg-gray-800/90 dark:shadow-[0_26px_70px_rgba(0,0,0,0.42)]">
            <div className="absolute inset-x-10 top-0 h-24 bg-[radial-gradient(circle,_hsl(var(--accent)/0.22),transparent_68%)] blur-2xl dark:bg-[radial-gradient(circle,_hsl(var(--accent)/0.12),transparent_72%)]" />
            <img
              src={heroImage}
              alt="Scribble Hub workspace preview"
              className="relative w-full rounded-[1.4rem] border border-border/80 object-cover shadow-sm transition-transform duration-300 hover:scale-[1.01] dark:border-gray-700/80"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
