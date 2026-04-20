import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  SquarePen, Trash2, Plus, X, Search, Mic, Calendar, Users, ListTodo 
} from 'lucide-react';
import AppShell from '@/components/AppShell';

type SpeechRecognitionResultEvent = {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
};

type SpeechRecognitionErrorEvent = {
  error: string;
};

type SpeechRecognitionInstance = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

// TypeScript declarations for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}


// Main App component for Meeting Notes
export default function App() {
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
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleAdd = () => handleAddNote();

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
    <AppShell>
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between px-8 h-14 border-b border-border shrink-0">
          <h1 className="text-xl font-medium tracking-tight">Meeting Notes</h1>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 h-8 border border-border rounded-md bg-muted w-52">
              <Search size={13} className="text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Search…"
                value={searchQuery}
                onChange={handleSearchChange}
                className="border-none bg-transparent h-full p-0 text-sm outline-none w-full text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-1.5 bg-[#7F77DD] text-white text-sm font-medium rounded-md hover:bg-[#6e66cc] transition-colors"
            >
              <Plus size={14} />
              New meeting
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-8 py-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
              <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-4" />
                <h2 className="text-base font-medium text-foreground mb-1">
                  Nothing here yet
                </h2>
                <p className="text-sm text-muted-foreground max-w-xs">
                  {searchQuery
                    ? `No results for "${searchQuery}"`
                    : "Add your first entry to get started."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
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
    </AppShell>
  );
}

// Component for a single note card
const NoteCard = ({ note, onEdit, onDelete }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-card rounded-xl border border-border p-5 hover:bg-accent/30 hover:border-border/80 transition-all duration-150 cursor-pointer group" onClick={() => navigate(`/meeting/${note.id}`)}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="break-words text-lg font-bold text-foreground">{note.title}</h3>
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(note)}
            className="rounded-full p-1 text-muted-foreground transition-colors hover:text-purple-600"
            aria-label="Edit note"
          >
            <SquarePen size={18} />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="rounded-full p-1 text-muted-foreground transition-colors hover:text-red-500"
            aria-label="Delete note"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      <p className="mb-2 line-clamp-3 text-sm text-muted-foreground">{note.description}</p>
      <div className="mb-1 flex items-center space-x-1 text-xs text-muted-foreground">
        <Calendar size={12} />
        <span>{note.date}</span>
      </div>
      <div className="mb-1 flex items-center space-x-1 text-xs text-muted-foreground">
        <Users size={12} />
        <span>{note.attendees}</span>
      </div>
      <div className="mb-4 flex items-center space-x-1 text-xs text-muted-foreground">
        <ListTodo size={12} />
        <span>{note.actionItems.length} action items</span>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
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
