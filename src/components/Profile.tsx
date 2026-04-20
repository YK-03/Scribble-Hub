import { useMemo } from "react";
import { signOut } from "firebase/auth";
import { CalendarDays, FolderKanban, Inbox, LogOut, StickyNote } from "lucide-react";
import { useNavigate } from "react-router-dom";

import useAuth from "@/hooks/useAuth";
import { auth } from "@/lib/firebase";

import AppShell, { NOTE_CATEGORIES, getNotesMeta } from "./AppShell";

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

const formatDate = (value?: string | null) => {
  if (!value) {
    return "Unknown";
  }

  const parsed = Date.parse(value);

  if (Number.isNaN(parsed)) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
};

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const categoryBreakdown = useMemo(() => {
    return NOTE_CATEGORIES.map((category) => ({
      ...category,
      ...getNotesMeta(category.storageKey),
    }));
  }, []);

  const inboxCount = useMemo(() => {
    try {
      const quickNotes = JSON.parse(localStorage.getItem("quickNotes") || "[]");
      return Array.isArray(quickNotes) ? quickNotes.length : 0;
    } catch {
      return 0;
    }
  }, []);

  const totalNotes = categoryBreakdown.reduce((sum, category) => sum + category.count, 0);

  const handleLogout = async () => {
    try {
      sessionStorage.clear();
      await signOut(auth);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <AppShell>
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="border-b border-border bg-background/95 px-8 py-6 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Your account details and a quick view of everything stored in your workspace.
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-destructive px-4 text-sm font-semibold text-destructive-foreground transition-colors hover:bg-destructive/90"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || user.email || "Profile"}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-3xl font-semibold text-primary-foreground">
                    {getInitials(user?.displayName)}
                  </div>
                )}

                <div className="min-w-0">
                  <h2 className="truncate text-2xl font-semibold text-card-foreground">
                    {user?.displayName || "Unnamed user"}
                  </h2>
                  <p className="mt-2 truncate text-sm text-muted-foreground">
                    {user?.email || "No email available"}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    Joined {formatDate(user?.metadata.creationTime)}
                  </div>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:grid-cols-1">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <StickyNote className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">Total notes</span>
                </div>
                <p className="mt-4 text-3xl font-semibold text-card-foreground">{totalNotes}</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <Inbox className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">Inbox count</span>
                </div>
                <p className="mt-4 text-3xl font-semibold text-card-foreground">{inboxCount}</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <FolderKanban className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">Categories</span>
                </div>
                <p className="mt-4 text-3xl font-semibold text-card-foreground">{NOTE_CATEGORIES.length}</p>
              </div>
            </section>
          </div>

          <section className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-card-foreground">Notes by category</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Current note totals based on the existing local storage keys in your workspace.
              </p>
            </div>

            <div className="space-y-3">
              {categoryBreakdown.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background px-4 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${category.color}`} />
                    <span className="truncate text-sm font-medium text-foreground">
                      {category.name}
                    </span>
                  </div>
                  <span className="shrink-0 text-sm text-muted-foreground">
                    {category.count} {category.count === 1 ? "note" : "notes"}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
};

export default Profile;
