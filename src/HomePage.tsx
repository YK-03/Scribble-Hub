import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import AppShell, { NOTE_CATEGORIES, getNotesMeta } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type CategoryWithMeta = (typeof NOTE_CATEGORIES)[number] & {
  count: number;
  lastModified: number | null;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
};

const timeAgo = (timestamp: number | null): string => {
  if (!timestamp) {
    return "";
  }

  const diff = Date.now() - timestamp;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;

  if (diff < hour) {
    const minutes = Math.max(1, Math.floor(diff / minute));
    return `${minutes}m ago`;
  }

  if (diff < day) {
    const hours = Math.max(1, Math.floor(diff / hour));
    return `${hours}h ago`;
  }

  if (diff < week) {
    const days = Math.max(1, Math.floor(diff / day));
    return `${days}d ago`;
  }

  const weeks = Math.max(1, Math.floor(diff / week));
  return `${weeks}w ago`;
};

const formatLastEdited = (timestamp: number | null): string => {
  if (!timestamp) {
    return "No recent edits";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(timestamp);
};

const Homepage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<CategoryWithMeta[]>(() =>
    NOTE_CATEGORIES.map((category) => ({
      ...category,
      count: 0,
      lastModified: null,
    })),
  );

  useEffect(() => {
    const readCategories = () => {
      setCategories(
        NOTE_CATEGORIES.map((category) => ({
          ...category,
          ...getNotesMeta(category.storageKey),
        })),
      );
    };

    readCategories();
    window.addEventListener("storage", readCategories);

    const intervalId = window.setInterval(readCategories, 2000);

    return () => {
      window.removeEventListener("storage", readCategories);
      window.clearInterval(intervalId);
    };
  }, []);

  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return categories;
    }

    return categories.filter((category) => {
      return category.name.toLowerCase().includes(query);
    });
  }, [categories, searchQuery]);

  const recentlyEdited = useMemo(() => {
    return categories
      .filter((category) => category.lastModified !== null)
      .sort((first, second) => (second.lastModified ?? 0) - (first.lastModified ?? 0))
      .slice(0, 4);
  }, [categories]);

  return (
    <AppShell>
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="border-b border-border bg-background/95 px-8 py-6 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">All categories</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Browse your workspace by category and pick up where you left off.
              </p>
            </div>

            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search categories"
                className="h-11 rounded-xl bg-card pl-10"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8">
          <section>
            <motion.div
              className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredCategories.map((category) => (
                <motion.button
                  key={category.id}
                  type="button"
                  variants={cardVariants}
                  onClick={() => navigate(category.link)}
                  className="group flex h-full cursor-pointer flex-col rounded-2xl border border-border bg-card p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:scale-[1.01] hover:border-primary/40 hover:bg-accent/40 hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.18),0_18px_40px_hsl(var(--background)/0.55)] dark:hover:bg-accent/60 dark:hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.28),0_22px_46px_hsl(0_0%_0%/0.45)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <span className={cn("h-3 w-3 shrink-0 rounded-full", category.color)} />
                        <h2 className="truncate text-lg font-semibold text-card-foreground">
                          {category.name}
                        </h2>
                      </div>
                    </div>
                    <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      {category.count} {category.count === 1 ? "note" : "notes"}
                    </span>
                  </div>

                  <p
                    className={cn(
                      "mt-4 flex-1 text-sm leading-6",
                      category.count > 0 ? "text-muted-foreground" : "italic text-muted-foreground",
                    )}
                  >
                    {category.count > 0
                      ? `Open ${category.name.toLowerCase()} and continue editing your notes.`
                      : "Nothing here yet. Add your first note."}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-sm text-muted-foreground">
                    <span>Last edited</span>
                    <span className="font-medium text-card-foreground">
                      {formatLastEdited(category.lastModified)}
                    </span>
                  </div>
                </motion.button>
              ))}
            </motion.div>

            {filteredCategories.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center text-sm italic text-muted-foreground">
                No categories match your search yet.
              </div>
            ) : null}
          </section>

          {recentlyEdited.length > 0 ? (
            <section className="mt-10">
              <h3 className="text-lg font-semibold tracking-tight">Recently edited</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                The categories with the freshest updates across your workspace.
              </p>

              <div className="mt-4 space-y-3">
                {recentlyEdited.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => navigate(category.link)}
                    className="flex w-full items-center justify-between gap-4 rounded-xl border border-border bg-card px-4 py-3 text-left transition-colors hover:bg-muted/40"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", category.color)} />
                      <span className="truncate text-sm font-medium text-card-foreground">
                        {category.name}
                      </span>
                    </div>
                    <span className="shrink-0 text-sm text-muted-foreground">
                      {timeAgo(category.lastModified)}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
};

export default Homepage;
