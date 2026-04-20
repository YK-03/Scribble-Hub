import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Laptop2, MoonStar } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="px-6 py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-[0_20px_60px_hsl(var(--foreground)/0.06)] dark:border-gray-700 dark:bg-gray-800 dark:shadow-[0_22px_64px_rgba(0,0,0,0.36)]">
          <div className="grid gap-10 px-6 py-10 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-14 lg:py-14">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                Get Started
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground dark:text-gray-200 sm:text-4xl">
                Bring structure to ideas without losing your momentum.
              </h2>
              <p className="mt-4 text-base leading-8 text-muted-foreground dark:text-gray-400 sm:text-lg">
                Start with a simple workspace that feels polished on day one and stays useful as
                your notes, plans, and projects grow.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-xl bg-foreground px-6 text-base font-medium text-background transition-all duration-200 hover:scale-[1.02] hover:bg-foreground/90 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-100 dark:hover:shadow-[0_14px_36px_rgba(0,0,0,0.35)]"
                >
                  <Link to="/signup">
                    Create your workspace
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-border bg-background p-5 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Laptop2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground dark:text-gray-200">Designed for focus</p>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">Minimal interface, less friction.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-background p-5 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MoonStar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground dark:text-gray-200">Balanced themes</p>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">Clear in light mode, rich in dark mode.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-background p-5 sm:col-span-2 lg:col-span-1 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm leading-7 text-muted-foreground dark:text-gray-400">
                    Built for personal systems, meeting notes, reading logs, learning goals, and
                    everything in between.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
