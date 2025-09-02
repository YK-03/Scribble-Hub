import React, { useState, useEffect, useCallback } from 'react';
import Header from './src/components/Header';
import NoteCard from './src/components/NoteCard';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Inbox as InboxIcon, Save } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./src/components/ui/dialog";
import { Input } from "./src/components/ui/input";
import { Textarea } from "./src/components/ui/textarea";
import { Button } from "./src/components/ui/button";

// Define a type for our inbox notes for better type safety and code clarity.
interface QuickNote {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 12,
    },
  },
};

const InboxPage = () => {
  const [inboxNotes, setInboxNotes] = useState<QuickNote[]>([]);
  const [editingNote, setEditingNote] = useState<QuickNote | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const loadNotes = useCallback(() => {
    try {
      const notes = JSON.parse(localStorage.getItem('quickNotes') || '[]');
      setInboxNotes(notes);
    } catch (error) {
      console.error("Failed to load inbox notes from localStorage:", error);
      toast.error("Could not load your inbox notes.");
    }
  }, []);

  // Listen for changes to the inbox notes so the page updates automatically.
  useEffect(() => {
    loadNotes();
    window.addEventListener('quickNotesChanged', loadNotes);
    return () => {
      window.removeEventListener('quickNotesChanged', loadNotes);
    };
  }, [loadNotes]);

  const handleDeleteNote = (noteId: string) => {
    try {
      const updatedNotes = inboxNotes.filter((note) => note.id !== noteId);
      localStorage.setItem('quickNotes', JSON.stringify(updatedNotes));
      setInboxNotes(updatedNotes); // Update state immediately for responsiveness.
      toast.success("Note deleted from inbox.");
    } catch (error) {
      console.error("Failed to delete inbox note:", error);
      toast.error("Could not delete note.");
    }
  };
  const handleEditClick = (note: QuickNote) => {
    setEditingNote({ ...note });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingNote) return;

    try {
      const notes: QuickNote[] = JSON.parse(localStorage.getItem('quickNotes') || '[]');
      const noteIndex = notes.findIndex((n) => n.id === editingNote.id);

      if (noteIndex > -1) {
        notes[noteIndex] = editingNote;
        localStorage.setItem('quickNotes', JSON.stringify(notes));
        setInboxNotes(notes);
        toast.success("Note updated successfully!");
      }
      setIsEditDialogOpen(false);
      setEditingNote(null);
    } catch (error) {
      console.error("Failed to save edited note:", error);
      toast.error("Failed to save changes.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/20 dark:bg-background">
      <Header />
      <main className="container mx-auto px-6 py-8 flex-grow">
        <div className="flex items-center gap-3 mb-8">
          <InboxIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Inbox</h1>
        </div>
        
        {inboxNotes.length > 0 ? (
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" variants={containerVariants} initial="hidden" animate="visible">
            {inboxNotes.map((note) => (
              <motion.div key={note.id} variants={itemVariants}>
                <NoteCard
                  id={note.id}
                  title={note.title}
                  content={note.content}
                  lastModified={`Captured on ${new Date(note.createdAt).toLocaleDateString()}`}
                  onDelete={() => handleDeleteNote(note.id)}
                  onClick={() => handleEditClick(note)}
                  clickable={true}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-card/50 rounded-lg border border-dashed">
            <InboxIcon className="mx-auto h-16 w-16 text-muted-foreground" />
            <h2 className="mt-6 text-xl font-semibold">Your Inbox is Empty</h2>
            <p className="mt-2 text-muted-foreground">Use the "New Note" button in the header to capture your thoughts.</p>
          </div>
        )}
      </main>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
            <DialogDescription>
              Make changes to your captured thought. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              id="title"
              placeholder="Note Title"
              value={editingNote?.title || ''}
              onChange={(e) => setEditingNote(prev => prev ? { ...prev, title: e.target.value } : null)}
              className="focus-visible:ring-primary"
            />
            <Textarea
              placeholder="Note content..."
              className="min-h-[120px] focus-visible:ring-primary"
              value={editingNote?.content || ''}
              onChange={(e) => setEditingNote(prev => prev ? { ...prev, content: e.target.value } : null)}
            />
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSaveEdit}><Save className="mr-2 h-4 w-4" /> Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InboxPage;
