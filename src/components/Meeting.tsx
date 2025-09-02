import React, { useState, useEffect } from 'react';
import { 
  Sun, Moon, SquarePen, Trash2, Plus, X, Search, Mic, Calendar, Users, ListTodo 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeProvider';

// TypeScript declarations for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}


// Main App component for Meeting Notes
export default function App() {
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  const toggleDarkMode = () => setTheme(isDarkMode ? 'light' : 'dark');
  const navigate = useNavigate();

  // Load notes from localStorage or use dummy notes if none exist
  const dummyNotes = [
    {
      id: 1,
      title: 'Q1 Roadmap Discussion',
      date: '2024-08-17',
      attendees: 'Jane, Mark, Sarah',
      description: 'Discussed the roadmap for Q1. Key points: focus on user experience, implement feedback system, and prepare for beta launch.',
      actionItems: ['Review Q1 performance data', 'Draft a plan for the new feedback system'],
      timestamp: '1 day ago'
    },
    {
      id: 2,
      title: 'UX Research Session',
      date: '2024-08-14',
      attendees: 'Alex, Chris, Maria',
      description: 'Analyzed user feedback and identified key pain points in the current onboarding flow. Decided to prototype a new tutorial.',
      actionItems: ['Prototype new tutorial', 'Schedule follow-up user testing'],
      timestamp: '3 days ago'
    },
    {
      id: 3,
      title: 'Sprint Planning',
      date: '2024-08-10',
      attendees: 'Team A',
      description: 'Finalized user stories for the next sprint. Assigned tasks to team members and set deadlines. Reviewed past sprint performance.',
      actionItems: ['Complete ticket #123', 'Update sprint backlog in Jira'],
      timestamp: '1 week ago'
    },
  ];
  const [notes, setNotes] = useState(() => {
    const stored = localStorage.getItem('meetingNotes');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // If parsed is an array, use it (even if empty)
        if (Array.isArray(parsed)) {
          return parsed;
        }
        return dummyNotes;
      } catch {
        return dummyNotes;
      }
    }
    return dummyNotes;
  });

  // Persist notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('meetingNotes', JSON.stringify(notes));
  }, [notes]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [noteIdToDelete, setNoteIdToDelete] = useState(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [message, setMessage] = useState('');

  // Function to open the modal for a new note
  const handleAddNote = () => {
    setCurrentNote(null);
    setIsModalOpen(true);
  };

  // Function to open the modal for editing an existing note
  const handleEditNote = (note) => {
    setCurrentNote(note);
    setIsModalOpen(true);
  };

  // Function to handle showing the custom delete confirmation modal
  const handleDeleteClick = (id) => {
    setNoteIdToDelete(id);
    setIsConfirmModalOpen(true);
  };

  // Function to perform the actual deletion after confirmation
  const handleDeleteConfirm = () => {
    if (noteIdToDelete) {
      setNotes(notes.filter(note => note.id !== noteIdToDelete));
      setNoteIdToDelete(null);
      setIsConfirmModalOpen(false);
    }
  };

  // Function to handle saving a note (add or edit)
  const handleSaveNote = (newNoteData) => {
    if (currentNote) {
      setNotes(notes.map(note =>
        note.id === currentNote.id
          ? { ...note, ...newNoteData, timestamp: 'just now' }
          : note
      ));
    } else {
      const newNote = {
        id: Date.now(),
        ...newNoteData,
        timestamp: 'just now',
      };
      setNotes([newNote, ...notes]);
    }
    setIsModalOpen(false);
  };

  // Function to show a custom message modal
  const showMessageModal = (msg) => {
    setMessage(msg);
    setIsMessageModalOpen(true);
  };

  // Filter notes based on the search query
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.attendees.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen font-sans ${isDarkMode ? 'dark bg-card text-[#E0E0E0]' : 'bg-neutral-50 text-neutral-900'}`}>
      <header className={`shadow-sm p-4 sticky top-0 z-10 ${isDarkMode ? 'bg-card' : 'bg-white'}`}>
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate("/homepage")}
              className="font-bold text-2xl text-purple-600 bg-transparent"
              aria-label="Go to homepage"
            >
              Scribble Hub
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'}`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={handleAddNote}
              className="px-4 py-2 bg-purple-600 text-white rounded-full font-semibold shadow-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>New Note</span>
            </button>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-800 dark:text-card-foreground dark:drop-shadow-lg">Your Meeting Notes</h1>
          <p className="text-lg text-neutral-500 mt-2 dark:text-muted-foreground">Capture and organize your thoughts from meetings.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredNotes.length > 0 ? (
            filteredNotes.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={handleEditNote}
                onDelete={handleDeleteClick}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-neutral-500 p-8 dark:text-muted-foreground">
              <h2 className="text-2xl font-semibold mb-2">No meeting notes found</h2>
              <p className="text-lg">Start by adding a new note to capture your meeting thoughts!</p>
            </div>
          )}
        </div>
      </main>
      {isModalOpen && (
        <NoteForm
          onSave={handleSaveNote}
          onClose={() => setIsModalOpen(false)}
          initialData={currentNote}
          onShowMessage={showMessageModal}
        />
      )}
      {isConfirmModalOpen && (
        <ConfirmationModal
          message="Are you sure you want to delete this note?"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setIsConfirmModalOpen(false)}
        />
      )}
      {isMessageModalOpen && (
        <MessageModal
          message={message}
          onClose={() => setIsMessageModalOpen(false)}
        />
      )}
    </div>
  );
}

// Component for a single note card
const NoteCard = ({ note, onEdit, onDelete }) => {
  const navigate = useNavigate();
  return (
    <div className="group bg-white rounded-lg shadow-md p-6 border border-neutral-200 hover:shadow-lg transition-shadow duration-300 dark:bg-card dark:border-border cursor-pointer" onClick={() => navigate(`/meeting/${note.id}`)}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-lg text-neutral-800 break-words dark:text-card-foreground">{note.title}</h3>
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(note)}
            className="p-1 text-neutral-500 hover:text-purple-600 transition-colors rounded-full"
            aria-label="Edit note"
          >
            <SquarePen size={18} />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-1 text-neutral-500 hover:text-red-500 transition-colors rounded-full"
            aria-label="Delete note"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    <p className="text-sm text-neutral-600 line-clamp-3 mb-2 dark:text-muted-foreground">{note.description}</p>
    <div className="text-xs text-neutral-500 flex items-center space-x-1 mb-1 dark:text-muted-foreground">
        <Calendar size={12} />
        <span>{note.date}</span>
      </div>
    <div className="text-xs text-neutral-500 flex items-center space-x-1 mb-1 dark:text-muted-foreground">
        <Users size={12} />
        <span>{note.attendees}</span>
      </div>
    <div className="text-xs text-neutral-500 flex items-center space-x-1 mb-4 dark:text-muted-foreground">
        <ListTodo size={12} />
        <span>{note.actionItems.length} action items</span>
      </div>
      <div className="flex justify-between items-center text-xs text-neutral-400 dark:text-muted-foreground">
        <span>{note.timestamp}</span>
      </div>
    </div>
  );
};

// Component for the note form (modal)
const NoteForm = ({ onSave, onClose, initialData, onShowMessage }) => {
  const [title, setTitle] = useState(initialData ? initialData.title : '');
  const [date, setDate] = useState(initialData ? initialData.date : new Date().toISOString().slice(0, 10));
  const [attendees, setAttendees] = useState(initialData ? initialData.attendees : '');
  const [description, setDescription] = useState(initialData ? initialData.description : '');
  const [actionItems, setActionItems] = useState(initialData ? initialData.actionItems : ['']);
  const [isListening, setIsListening] = useState(false);

  // Check for Web Speech API support
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const isSpeechSupported = !!SpeechRecognition;

  const handleActionItemChange = (index, value) => {
    const newActionItems = [...actionItems];
    newActionItems[index] = value;
    setActionItems(newActionItems);
  };

  const handleAddActionItem = () => {
    setActionItems([...actionItems, '']);
  };

  const handleRemoveActionItem = (index) => {
    const newActionItems = actionItems.filter((_, i) => i !== index);
    setActionItems(newActionItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && description && date) {
      // Filter out empty action items before saving
      const filteredActionItems = actionItems.filter(item => item.trim() !== '');
      onSave({
        title,
        date,
        attendees,
        description,
        actionItems: filteredActionItems,
      });
    } else {
      onShowMessage('Please fill out the title, date, and description.');
    }
  };

  const startListening = () => {
    if (!isSpeechSupported) {
      onShowMessage('Voice note feature not supported in this browser.');
      return;
    }

    setIsListening(true);
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setDescription(prevDesc => prevDesc + (prevDesc ? ' ' : '') + speechToText);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      onShowMessage(`Speech recognition error: ${event.error}`);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="fixed inset-0 bg-neutral-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
  <div className="bg-white dark:bg-[#121212] rounded-lg shadow-xl w-full max-w-lg p-6 relative border dark:border-[#444444]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-900 transition-colors"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
  <h2 className="text-2xl font-bold mb-6 text-neutral-800 dark:text-[#E0E0E0]">
          {initialData ? 'Edit Meeting Note' : 'New Meeting Note'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-1" htmlFor="title">
              Note Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 dark:border-[#444444] rounded-xl focus:ring-4 focus:ring-[#888888] focus:outline-none transition-colors bg-white text-neutral-900 dark:bg-[#121212] dark:text-[#E0E0E0] placeholder:italic placeholder:text-neutral-400 dark:placeholder:text-[#B0B0B0]"
              placeholder="e.g., Sprint Retrospective"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1" htmlFor="date">
                Date
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 dark:border-[#444444] rounded-xl focus:ring-4 focus:ring-[#888888] focus:outline-none transition-colors bg-white text-neutral-900 dark:bg-[#121212] dark:text-[#E0E0E0] placeholder:italic placeholder:text-neutral-400 dark:placeholder:text-[#B0B0B0]"
              required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1" htmlFor="attendees">
                Attendees
              </label>
              <input
                id="attendees"
                type="text"
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 dark:border-[#444444] rounded-xl focus:ring-4 focus:ring-[#888888] focus:outline-none transition-colors bg-white text-neutral-900 dark:bg-[#121212] dark:text-[#E0E0E0] placeholder:italic placeholder:text-neutral-400 dark:placeholder:text-[#B0B0B0]"
              placeholder="e.g., John, Jane, Chris"
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 mb-1" htmlFor="description">
              Discussion Summary
            </label>
            <div className="relative">
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 pr-12 border border-neutral-300 dark:border-[#444444] rounded-xl h-32 resize-none focus:ring-4 focus:ring-[#888888] focus:outline-none transition-colors bg-white text-neutral-900 dark:bg-[#121212] dark:text-[#E0E0E0] placeholder:italic placeholder:text-neutral-400 dark:placeholder:text-[#B0B0B0]"
                placeholder="e.g., Discussed the new project plan and next steps."
                required
              ></textarea>
              {isSpeechSupported && (
                <button
                  type="button"
                  onClick={startListening}
                  disabled={isListening}
                  className={`absolute bottom-3 right-3 p-1 rounded-full ${isListening ? 'bg-red-500 text-white' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'} transition-colors duration-200`}
                  aria-label="Start voice note"
                >
                  <Mic size={20} />
                </button>
              )}
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Action Items
            </label>
            {actionItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleActionItemChange(index, e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-[#444444] rounded-xl focus:ring-4 focus:ring-[#888888] focus:outline-none transition-colors bg-white text-neutral-900 dark:bg-[#121212] dark:text-[#E0E0E0] placeholder:italic placeholder:text-neutral-400 dark:placeholder:text-[#B0B0B0]"
              placeholder="e.g., Follow up with the design team"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveActionItem(index)}
                  className="p-1 text-neutral-500 hover:text-red-500 transition-colors rounded-full"
                  aria-label="Remove action item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddActionItem}
              className="mt-2 w-full px-4 py-2 bg-neutral-100 text-neutral-600 rounded-md font-semibold hover:bg-neutral-200 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus size={20} />
              <span>Add Action Item</span>
            </button>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-neutral-200 text-neutral-700 rounded-md font-semibold hover:bg-neutral-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-md font-semibold shadow-md hover:bg-purple-700 transition-colors"
            >
              Save Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Custom modal for confirmation (e.g., for deletion)
const ConfirmationModal = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-neutral-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg shadow-xl max-w-sm p-6 relative text-center">
      <p className="text-lg text-neutral-800 mb-6">{message}</p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-neutral-200 text-neutral-700 rounded-md font-semibold hover:bg-neutral-300 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-6 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

// Custom modal for displaying a simple message
const MessageModal = ({ message, onClose }) => (
  <div className="fixed inset-0 bg-neutral-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg shadow-xl max-w-sm p-6 relative text-center">
      <p className="text-lg text-neutral-800 mb-6">{message}</p>
      <div className="flex justify-center">
        <button
          onClick={onClose}
          className="px-6 py-2 bg-neutral-200 text-neutral-700 rounded-md font-semibold hover:bg-neutral-300 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);