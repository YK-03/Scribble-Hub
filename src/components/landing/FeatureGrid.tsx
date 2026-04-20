import { Card } from "@/components/ui/card";
import {
  BookOpen,
  ChefHat,
  GraduationCap,
  Lightbulb,
  Palette,
  Users,
} from "lucide-react";

const features = [
  {
    icon: Lightbulb,
    title: "Project Ideas",
    description: "Capture concepts, sketch plans, and shape the work before it starts.",
  },
  {
    icon: Users,
    title: "Meeting Notes",
    description: "Keep summaries, attendees, and action items in a format you can actually reuse.",
  },
  {
    icon: GraduationCap,
    title: "Learning Goals",
    description: "Track skills, progress, and the milestones that matter to your growth.",
  },
  {
    icon: BookOpen,
    title: "Reading List",
    description: "Store highlights, links, and reflections from everything you read.",
  },
  {
    icon: ChefHat,
    title: "Recipe Ideas",
    description: "Save experiments, inspirations, and generated recipes in one calm space.",
  },
  {
    icon: Palette,
    title: "Art Playground",
    description: "Switch from structured notes to freeform thinking whenever you need it.",
  },
];

const FeatureGrid = () => {
  return (
    <section id="features" className="scroll-mt-20 px-6 py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            Features
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground dark:text-gray-200 sm:text-4xl">
            One focused workspace for every kind of note.
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground dark:text-gray-400">
            Each space is tailored for a different kind of thinking, but the experience stays
            consistent, calm, and easy to navigate.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Card
                key={feature.title}
                className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-xl hover:shadow-black/5 dark:border-gray-700 dark:bg-gray-800 dark:shadow-[0_14px_38px_rgba(0,0,0,0.28)] dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:hover:shadow-[0_20px_48px_rgba(0,0,0,0.38)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-muted transition-colors duration-300 group-hover:border-primary/30 group-hover:bg-primary/10 dark:border-gray-700 dark:bg-gray-700 dark:group-hover:border-primary/40 dark:group-hover:bg-primary/15">
                  <Icon className="h-5 w-5 text-foreground dark:text-gray-200" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground dark:text-gray-200">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground dark:text-gray-400">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
