import NoteCard from "@/components/NoteCard";
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

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

const NoteGrid = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const getNotePreview = (key, defaultContent) => {
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          const items = JSON.parse(stored);
          if (Array.isArray(items) && items.length > 0) {
            return {
              content: items[0].description || defaultContent,
              lastModified: items[0].timestamp || "",
            };
          }
        }
      } catch (e) {
        console.error(`Failed to parse localStorage item: ${key}`, e);
      }
      return { content: defaultContent, lastModified: "" };
    };

    const noteDefinitions = [
      { id: "1", title: "Project Ideas", link: "/projects", defaultContent: "Capture and develop your next big ideas.", storageKey: "projectIdeas" },
      { id: "2", title: "Meeting Notes", link: "/meeting", defaultContent: "Stay organized with smart meeting notes.", storageKey: "meetingNotes" },
      { id: "3", title: "Learning Goals", link: "/learning-goals", defaultContent: "Track your learning journey with personalized goals.", storageKey: "learningGoals" },
      { id: "4", title: "Reading List", content: "Your personal archive of knowledge. Track, summarize, and reflect on your reading journey.", link: "/reading-log" },
      { id: "5", title: "Recipe Ideas", content: "Your AI-powered culinary creative space. Turn any prompt into delicious, step-by-step recipes.", link: "/recipe-ideas" },
      { id: "6", title: "Art Playground", content: "A digital space for you to scribble, sketch, and doodle with a variety of colors and brush sizes.", link: "/art-playground" }
    ];

    const loadedNotes = noteDefinitions.map(note => {
      if (note.storageKey) {
        const { content, lastModified } = getNotePreview(note.storageKey, note.defaultContent);
        return { ...note, content, lastModified };
      }
      return note;
    });

    setNotes(loadedNotes);
  }, []);

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {notes.map((note) => (
        <motion.div key={note.id} variants={itemVariants}>
          <NoteCard
            id={note.id}
            title={note.title}
            content={note.content}
            lastModified={note.lastModified}
            onClick={() => navigate(note.link)}
            clickable={true}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default NoteGrid;