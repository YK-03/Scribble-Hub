/* eslint-disable react-refresh/only-export-components */
import { ReactNode, useEffect, useMemo, useState } from "react";
import { signOut } from "firebase/auth";
import { Archive, Home, Inbox, LogOut, MoonStar, PlusCircle, Save, Sun, UserCircle2 } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase";
import useAuth from "@/hooks/useAuth";

import { useTheme } from "./ThemeProvider";

export type CategoryDefinition = {
  id: string;
  name: string;
  link: string;
  storageKey: string;
  color: string;
};

export type NotesMeta = {
  count: number;
  lastModified: number | null;
};

export const NOTE_CATEGORIES: CategoryDefinition[] = [
  {
    id: "projects",
    name: "Projects",
    link: "/projects",
    storageKey: "projectIdeas",
    color: "bg-amber-500",
  },
  {
    id: "meeting-notes",
    name: "Meeting Notes",
    link: "/meeting",
    storageKey: "meetingNotes",
    color: "bg-sky-500",
  },
  {
    id: "learning-goals",
    name: "Learning Goals",
    link: "/learning-goals",
    storageKey: "learningGoals",
    color: "bg-emerald-500",
  },
  {
    id: "reading-log",
    name: "Reading Log",
    link: "/reading-log",
    storageKey: "readingLog",
    color: "bg-rose-500",
  },
  {
    id: "recipe-ideas",
    name: "Recipe Ideas",
    link: "/recipe-ideas",
    storageKey: "recipeIdeas",
    color: "bg-orange-500",
  },
  {
    id: "art-playground",
    name: "Art Playground",
    link: "/art-playground",
    storageKey: "artPlayground",
    color: "bg-fuchsia-500",
  },
];

const relativeTimePattern =
  /^(\d+)\s*(minute|minutes|hour|hours|day|days|week|weeks)\s+ago$/i;

const parseTimestamp = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  if (trimmed.toLowerCase() === "just now") {
    return Date.now();
  }

  const parsedDate = Date.parse(trimmed);

  if (!Number.isNaN(parsedDate)) {
    return parsedDate;
  }

  const relativeMatch = trimmed.match(relativeTimePattern);

  if (!relativeMatch) {
    return null;
  }

  const amount = Number(relativeMatch[1]);
  const unit = relativeMatch[2].toLowerCase();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;

  if (unit.startsWith("minute")) {
    return Date.now() - amount * minute;
  }

  if (unit.startsWith("hour")) {
    return Date.now() - amount * hour;
  }

  if (unit.startsWith("day")) {
    return Date.now() - amount * day;
  }

  if (unit.startsWith("week")) {
    return Date.now() - amount * week;
  }

  return null;
};

export const getNotesMeta = (storageKey: string): NotesMeta => {
  try {
    const storedValue = localStorage.getItem(storageKey);

    if (!storedValue) {
      return { count: 0, lastModified: null };
    }

    const parsedValue: unknown = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return { count: 0, lastModified: null };
    }

    const timestamps = parsedValue
      .map((note) => {
        if (note && typeof note === "object" && "timestamp" in note) {
          return parseTimestamp(note.timestamp);
        }

        if (note && typeof note === "object" && "lastModified" in note) {
          return parseTimestamp(note.lastModified);
        }

        return null;
      })
      .filter((timestamp): timestamp is number => timestamp !== null);

    return {
      count: parsedValue.length,
      lastModified: timestamps.length > 0 ? Math.max(...timestamps) : null,
    };
  } catch {
    return { count: 0, lastModified: null };
  }
};

const workspaceLinks = [
  { label: "Homepage", href: "/homepage", icon: Home },
  { label: "Inbox", href: "/inbox", icon: Inbox },
  { label: "Archive", href: "/archive", icon: Archive },
];

const SidebarLink = ({
  label,
  href,
  active,
  icon: Icon,
}: {
  label: string;
  href: string;
  active: boolean;
  icon: typeof Home;
}) => (
  <Link
    to={href}
    className={cn(
      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
      active
        ? "bg-sidebar-primary text-sidebar-primary-foreground"
        : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
    )}
  >
    <Icon className="h-4 w-4" />
    <span>{label}</span>
  </Link>
);

const AppShell = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const isDarkMode = theme === "dark";
  const [quickNoteTitle, setQuickNoteTitle] = useState("");
  const [quickNote, setQuickNote] = useState("");
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [categoryMeta, setCategoryMeta] = useState<Record<string, NotesMeta>>({});

  useEffect(() => {
    const refreshCounts = () => {
      const nextMeta = NOTE_CATEGORIES.reduce<Record<string, NotesMeta>>((accumulator, category) => {
        accumulator[category.id] = getNotesMeta(category.storageKey);
        return accumulator;
      }, {});

      setCategoryMeta(nextMeta);
    };

    refreshCounts();
    window.addEventListener("storage", refreshCounts);
    window.addEventListener("quickNotesChanged", refreshCounts as EventListener);

    const intervalId = window.setInterval(refreshCounts, 2000);

    return () => {
      window.removeEventListener("storage", refreshCounts);
      window.removeEventListener("quickNotesChanged", refreshCounts as EventListener);
      window.clearInterval(intervalId);
    };
  }, []);

  const noteCountTotal = useMemo(() => {
    return Object.values(categoryMeta).reduce((total, item) => total + item.count, 0);
  }, [categoryMeta]);

  const handleThemeToggle = () => setTheme(isDarkMode ? "light" : "dark");

  const getInitials = (name?: string | null) => {
    if (!name?.trim()) {
      return "?";
    }

    const initials = name
      .trim()
      .split(/\s+/)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("")
      .slice(0, 2);

    return initials || "?";
  };

  const firstName = user?.displayName?.trim()?.split(/\s+/)[0] || user?.email?.split("@")[0] || "Profile";

  const handleLogout = async () => {
    try {
      sessionStorage.clear();
      await signOut(auth);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Failed to sign out:", error);
      toast.error("Could not log out right now.");
    }
  };

  const handleSaveQuickNote = () => {
    if (!quickNote.trim() && !quickNoteTitle.trim()) {
      return;
    }

    const newNote = {
      id: `quick-note-${Date.now()}`,
      title: quickNoteTitle.trim() || "Untitled Note",
      content: quickNote.trim(),
      createdAt: new Date().toISOString(),
    };
    const quickNotes = JSON.parse(localStorage.getItem("quickNotes") || "[]");
    localStorage.setItem("quickNotes", JSON.stringify([newNote, ...quickNotes]));
    window.dispatchEvent(new Event("quickNotesChanged"));
    toast.success("Note captured to your inbox!");
    setQuickNoteTitle("");
    setQuickNote("");
    setIsQuickCaptureOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="border-b border-sidebar-border bg-sidebar lg:fixed lg:inset-y-0 lg:left-0 lg:w-72 lg:border-b-0 lg:border-r">
          <div className="flex h-full flex-col px-5 py-6">
            <div className="mb-8">
              <Link to="/homepage" className="inline-flex flex-col gap-1">
                <span className="text-2xl font-semibold tracking-tight text-sidebar-foreground">
                  scribblehub
                </span>
              </Link>
            </div>

            <section className="mb-6">
              <div className="mb-3 flex items-center justify-between px-3">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/50">
                  Workspace
                </span>
                <span className="rounded-full bg-sidebar-accent px-2 py-0.5 text-[11px] font-medium text-sidebar-foreground/70">
                  {noteCountTotal}
                </span>
              </div>
              <div className="space-y-1">
                {workspaceLinks.map((item) => (
                  <SidebarLink
                    key={item.href}
                    label={item.label}
                    href={item.href}
                    icon={item.icon}
                    active={location.pathname === item.href}
                  />
                ))}
              </div>
            </section>

            <section className="min-h-0 flex-1">
              <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/50">
                Categories
              </p>
              <div className="space-y-1 overflow-y-auto pr-1">
                {NOTE_CATEGORIES.map((category) => {
                  const meta = categoryMeta[category.id] ?? { count: 0, lastModified: null };

                  return (
                    <Link
                      key={category.id}
                      to={category.link}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors",
                        location.pathname.startsWith(category.link)
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      )}
                    >
                      <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", category.color)} />
                      <span className="min-w-0 flex-1 truncate text-sm font-medium">
                        {category.name}
                      </span>
                      {meta.count > 0 ? (
                        <span className="rounded-full bg-sidebar-border px-2 py-0.5 text-[11px] font-medium">
                          {meta.count}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </section>

            <div className="mt-6 space-y-3">
              <Link
                to="/profile"
                className="flex items-center gap-3 rounded-xl border border-sidebar-border bg-sidebar-accent/60 px-3 py-3 transition-colors hover:bg-sidebar-accent"
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || user.email || "Profile"}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
                    {getInitials(user?.displayName)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-sidebar-foreground">
                    {firstName}
                  </p>
                  <p className="truncate text-xs text-sidebar-foreground/60">
                    {user?.email || "View profile"}
                  </p>
                </div>
                <UserCircle2 className="h-4 w-4 shrink-0 text-sidebar-foreground/50" />
              </Link>

              <div className="flex items-center gap-2">
                <Dialog open={isQuickCaptureOpen} onOpenChange={setIsQuickCaptureOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex-1 justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Quick note
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                      <DialogTitle>Quick Capture</DialogTitle>
                      <DialogDescription>
                        Jot down a fleeting thought. It will be saved to your inbox.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Input
                        id="title"
                        placeholder="Title (optional)"
                        value={quickNoteTitle}
                        onChange={(event) => setQuickNoteTitle(event.target.value)}
                      />
                      <Textarea
                        placeholder="What's on your mind?"
                        className="min-h-[120px]"
                        value={quickNote}
                        onChange={(event) => setQuickNote(event.target.value)}
                      />
                    </div>
                    <DialogFooter>
                      <Button type="button" onClick={handleSaveQuickNote}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Note
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleThemeToggle}
                  aria-label="Toggle theme"
                  className="rounded-xl border border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent"
                >
                  {isDarkMode ? <Sun className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  aria-label="Log out"
                  className="rounded-xl border border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex min-h-screen flex-1 flex-col lg:ml-72">{children}</main>
      </div>
    </div>
  );
};

export default AppShell;
