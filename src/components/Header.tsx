import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, Ghost, Save, Inbox } from "lucide-react";
import { Sun, MoonStar } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "./ThemeProvider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const darkMode = theme === "dark";
  const handleThemeToggle = () => setTheme(darkMode ? "light" : "dark");
  const [quickNoteTitle, setQuickNoteTitle] = useState("");
  const [quickNote, setQuickNote] = useState("");
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);

  const handleSaveQuickNote = () => {
    if (!quickNote.trim() && !quickNoteTitle.trim()) return;

    const newNote = {
      id: `quick-note-${Date.now()}`,
      title: quickNoteTitle.trim() || "Untitled Note",
      content: quickNote.trim(),
      createdAt: new Date().toISOString(),
    };
    const quickNotes = JSON.parse(localStorage.getItem("quickNotes") || "[]");
    localStorage.setItem("quickNotes", JSON.stringify([newNote, ...quickNotes]));
    window.dispatchEvent(new Event('quickNotesChanged'));
    toast.success("Note captured to your inbox!");
    setQuickNoteTitle("");
    setQuickNote("");
    setIsQuickCaptureOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-sidebar backdrop-blur supports-[backdrop-filter]:bg-sidebar/95">
      <div className="container flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="text-xl font-bold bg-gradient-to-r from-[#de6dc8] to-[#a855f7] bg-clip-text text-transparent ">
            Scribble Hub
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sidebar-foreground/60 h-4 w-4" />
            <input
              type="text"
              placeholder="Search notes..."
              className="w-full pl-10 pr-4 py-2 bg-sidebar-accent border border-sidebar-border rounded-lg text-sidebar-foreground placeholder:text-sidebar-foreground/60 focus:outline-none focus:ring-2 focus:ring-sidebar-primary"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Dialog open={isQuickCaptureOpen} onOpenChange={setIsQuickCaptureOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm" className="bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground border-0">
                <PlusCircle className="h-4 w-4 mr-2" />
                New Note
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
                  onChange={(e) => setQuickNoteTitle(e.target.value)}
                  className="focus-visible:ring-primary"
                />
                <Textarea
                  placeholder="What's on your mind?"
                  className="min-h-[120px] focus-visible:ring-primary"
                  value={quickNote}
                  onChange={(e) => setQuickNote(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleSaveQuickNote}><Save className="mr-2 h-4 w-4" /> Save Note</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="flex items-center gap-1">
            <Button asChild variant="ghost" size="icon" className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-primary" title="View Inbox">
              <Link to="/inbox" aria-label="View Inbox">
                <Inbox className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="icon" className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-primary" title="View Archived Notes">
              <Link to="/archive" aria-label="View Archived Notes">
                <Ghost className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleThemeToggle}
              aria-label="Toggle theme"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-primary"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
            </Button>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
