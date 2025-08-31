import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  SquarePen,
  Trash2,
  Plus,
  X,
  Search,
  BookOpen,
  CheckCircle,
  Circle,
  Link as LinkIcon,
  Bookmark,
  BookmarkPlus,
  Moon,
  Sun,
  Loader2,
} from 'lucide-react';
import { useTheme } from './ThemeProvider';

// Main App component for the Reading Log
export default function App() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  const { searchterm } = useParams();

  // Dummy reading items for initial load
  const dummyReadingItems = [
    {
      id: 1,
      title: 'Clean Code',
      author: 'Robert C. Martin',
      isbn: '9780132350884',
      status: 'In Progress',
      progress: 75,
      isBookmarked: false,
      link: 'https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882',
      summary:
        'A foundational book for understanding professional software craftsmanship. Focused on writing code that is easy to read, understand, and maintain.',
      timestamp: '1 week ago',
    },
    {
      id: 2,
      title: 'The Pragmatic Programmer',
      author: 'Andrew Hunt & David Thomas',
      isbn: '9780201616224',
      status: 'To Read',
      progress: 0,
      isBookmarked: true,
      link: 'https://pragprog.com/titles/tpt20/',
      summary:
        'A classic guide to thinking and acting like a programmer. Covers various topics including personal responsibility, career development, and code reviews.',
      timestamp: '2 weeks ago',
    },
    {
      id: 3,
      title: 'Atomic Habits',
      author: 'James Clear',
      isbn: '9780735211292',
      status: 'Completed',
      progress: 100,
      isBookmarked: false,
      link: 'https://jamesclear.com/atomic-habits',
      summary:
        'Focuses on the power of small habits. A very practical and inspiring read for personal development.',
      timestamp: '3 weeks ago',
    },
  ];

  // State to manage the list of reading items
  const [readingItems, setReadingItems] = useState(dummyReadingItems);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReadingItem, setCurrentReadingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemIdToDelete, setItemIdToDelete] = useState(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [showBookmarked, setShowBookmarked] = useState(false);

  const toggleDarkMode = () => setTheme(isDarkMode ? 'light' : 'dark');

  useEffect(() => {
    if (searchterm) {
      setSearchQuery(decodeURIComponent(searchterm));
    } else {
      setSearchQuery('');
    }
  }, [searchterm]);

  const toggleBookmark = (id) => {
    setReadingItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item))
    );
  };

  const handleAddReadingItem = () => {
    setCurrentReadingItem(null);
    setIsModalOpen(true);
  };

  const handleEditReadingItem = (item) => {
    setCurrentReadingItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setItemIdToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (itemIdToDelete) {
      setReadingItems((prev) => prev.filter((item) => item.id !== itemIdToDelete));
      setItemIdToDelete(null);
      setIsConfirmModalOpen(false);
    }
  };

  const handleSaveReadingItem = (newItemData) => {
    if (currentReadingItem) {
      setReadingItems((prev) =>
        prev.map((item) =>
          item.id === currentReadingItem.id ? { ...item, ...newItemData, timestamp: 'just now' } : item
        )
      );
    } else {
      const newItem = {
        id: Date.now(),
        ...newItemData,
        timestamp: 'just now',
        isBookmarked: false,
      };
      setReadingItems((prev) => [newItem, ...prev]);
    }
    setIsModalOpen(false);
  };

  const showMessageModal = (msg) => {
    setMessage(msg);
    setIsMessageModalOpen(true);
  };

  const filteredItems = readingItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBookmark = showBookmarked ? item.isBookmarked : true;
    return matchesSearch && matchesBookmark;
  });

  return (
    <div
      className={`min-h-screen font-sans ${isDarkMode ? 'dark bg-neutral-900 text-neutral-100' : 'bg-neutral-50 text-neutral-900'}`}
    >
      <header className={`shadow-sm p-4 sticky top-0 z-10 ${isDarkMode ? 'bg-neutral-800' : 'bg-white'}`}>
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button onClick={() => navigate('/')} className="font-bold text-2xl text-purple-600 bg-transparent" aria-label="Go to homepage">
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
              onClick={() => setShowBookmarked((v) => !v)}
              className={`p-2 rounded-full transition-colors ${showBookmarked ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'}`}
              aria-label="Toggle bookmarked items"
            >
              <Bookmark size={20} />
            </button>
            <div className="relative">
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 pr-4 py-2 rounded-full ${isDarkMode ? 'bg-neutral-700 text-neutral-300' : 'bg-neutral-100 text-neutral-700'} focus:outline-none focus:ring-2 focus:ring-purple-300 transition-colors`}
              />
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-neutral-400' : 'text-neutral-400'}`} size={18} />
            </div>
            <button
              onClick={handleAddReadingItem}
              className="px-4 py-2 bg-purple-600 text-white rounded-full font-semibold shadow-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>New Reading Item</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold" style={{ color: isDarkMode ? '#E0E0E0' : '#121212' }}>
            Your Reading Log
          </h1>
          <p className="text-lg mt-2" style={{ color: isDarkMode ? '#B0B0B0' : '#888888' }}>
            Track, organize, and summarize your reading journey.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <ReadingCard key={item.id} item={item} onEdit={handleEditReadingItem} onDelete={handleDeleteClick} toggleBookmark={toggleBookmark} />
            ))
          ) : (
            <div className="col-span-full text-center text-neutral-500 p-8 dark:text-neutral-400">
              <p>No reading items found. Try adding a new one!</p>
            </div>
          )}
        </div>
      </main>

      {isModalOpen && <ReadingForm onSave={handleSaveReadingItem} onClose={() => setIsModalOpen(false)} initialData={currentReadingItem} onShowMessage={showMessageModal} />}

      {isConfirmModalOpen && <ConfirmationModal message="Are you sure you want to delete this reading item?" onConfirm={handleDeleteConfirm} onCancel={() => setIsConfirmModalOpen(false)} />}

      {isMessageModalOpen && <MessageModal message={message} onClose={() => setIsMessageModalOpen(false)} />}
    </div>
  );
}

// Component for a single reading card
const ReadingCard = ({ item, onEdit, onDelete, toggleBookmark }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle size={18} className="text-green-500" />;
      case 'In Progress':
        return <BookOpen size={18} className="text-blue-500" />;
      case 'To Read':
        return <Circle size={18} className="text-neutral-400" />;
      default:
        return null;
    }
  };
  const getProgressColor = (progress) => {
    if (progress === 100) return 'bg-green-500';
    if (progress > 0) return 'bg-blue-500';
    return 'bg-neutral-300 dark:bg-neutral-600';
  };

  const coverUrl = item.isbn ? `https://covers.openlibrary.org/b/isbn/${item.isbn}-M.jpg` : null;

  return (
    <div className="group bg-white rounded-lg shadow-md p-6 border border-neutral-200 hover:shadow-lg transition-shadow duration-300 dark:bg-neutral-800 dark:border-neutral-700">
      <div className="flex justify-end items-start mb-2 space-x-2">
        <button onClick={() => toggleBookmark(item.id)} className="p-1 transition-colors rounded-full" aria-label="Toggle bookmark">
          {item.isBookmarked ? <Bookmark size={20} className="text-purple-600 fill-current" /> : <BookmarkPlus size={20} className="text-neutral-400 group-hover:text-purple-600" />}
        </button>
        <button onClick={(e) => { e.stopPropagation(); onEdit(item); }} className="p-1 text-neutral-500 hover:text-purple-600 transition-colors rounded-full" aria-label="Edit item">
          <SquarePen size={18} />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(item.id); }} className="p-1 text-neutral-500 hover:text-red-500 transition-colors rounded-full" aria-label="Delete item">
          <Trash2 size={18} />
        </button>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        {coverUrl && (
          <img
            src={coverUrl}
            alt={`Cover for ${item.title}`}
            className="rounded-lg shadow-md flex-shrink-0"
            style={{ width: '100px', height: '150px', objectFit: 'cover' }}
            onError={(e) => {
              const img = e.currentTarget;
              // prevent infinite loop if placeholder also fails
              img.onerror = null;
              img.src = `https://placehold.co/100x150/e2e8f0/0f172a?text=${encodeURIComponent(item.title.split(' ')[0])}`;
            }}
          />
        )}
        {!coverUrl && (
          <div className="rounded-lg shadow-md flex-shrink-0 bg-neutral-200 text-neutral-800 flex items-center justify-center p-2 text-center" style={{ width: '100px', height: '150px' }}>
            No Cover
          </div>
        )}
        <div className="flex flex-col space-y-1 w-full">
          <div className="flex items-center space-x-2">
            {getStatusIcon(item.status)}
            <h3 className="font-bold text-lg text-neutral-800 break-words dark:text-neutral-200">{item.title}</h3>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">By: {item.author}</p>
          <div className="w-full h-2 bg-neutral-200 rounded-full mt-2 overflow-hidden dark:bg-neutral-700">
            <div className={`h-full ${getProgressColor(item.progress)} transition-all duration-500`} style={{ width: `${item.progress}%` }}></div>
          </div>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{item.progress}% Complete</span>
        </div>
      </div>

      <p className="text-sm text-neutral-600 line-clamp-3 mb-2 dark:text-neutral-400">{item.summary}</p>
      {item.link && (
        <div className="text-xs text-neutral-500 flex items-center space-x-1 mb-4 dark:text-neutral-400">
          <LinkIcon size={12} />
          <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
            View Resource
          </a>
        </div>
      )}
      <div className="flex justify-between items-center text-xs text-neutral-400 dark:text-neutral-500">
        <span>{item.timestamp}</span>
      </div>
    </div>
  );
};

// Component for the reading form (modal)
const ReadingForm = ({ onSave, onClose, initialData, onShowMessage }) => {
  const [title, setTitle] = useState(initialData ? initialData.title : '');
  const [author, setAuthor] = useState(initialData ? initialData.author : '');
  const [isbn, setIsbn] = useState(initialData ? initialData.isbn : '');
  const [status, setStatus] = useState(initialData ? initialData.status : 'To Read');
  const [link, setLink] = useState(initialData ? initialData.link : '');
  const [summary, setSummary] = useState(initialData ? initialData.summary : '');
  const [progress, setProgress] = useState(initialData ? Number(initialData.progress || 0) : 0);
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && author && summary) {
      onSave({
        title,
        author,
        isbn,
        status,
        link,
        summary,
        progress,
      });
    } else {
      onShowMessage('Please fill out the title, author, and summary.');
    }
  };

  const handleSearch = async () => {
    if (!title.trim()) {
      onShowMessage('Please enter a book title to search.');
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(title)}&limit=1`);
      const data = await response.json();
      if (data.docs && data.docs.length > 0) {
        const book = data.docs[0];
        setAuthor(book.author_name ? book.author_name.join(', ') : '');
        setIsbn(book.isbn ? book.isbn[0] : '');
      } else {
        onShowMessage('No book found for that title. Please enter the details manually.');
      }
    } catch (error) {
      console.error('Error fetching book data:', error);
      onShowMessage('Failed to fetch book data. Please check your network connection.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative dark:bg-neutral-800">
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-900 transition-colors dark:text-neutral-400 dark:hover:text-neutral-100" aria-label="Close modal">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-neutral-800 mb-6 dark:text-neutral-200">{initialData ? 'Edit Reading Item' : 'New Reading Item'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-1 dark:text-neutral-300" htmlFor="title">
              Title
            </label>
            <div className="flex items-center space-x-2">
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors dark:bg-neutral-700 dark:text-neutral-200 dark:border-neutral-600"
                placeholder="e.g., The Pragmatic Programmer"
                required
              />
              <button
                type="button"
                onClick={handleSearch}
                disabled={isSearching}
                className="p-2 bg-purple-600 text-white rounded-md font-semibold hover:bg-purple-700 transition-colors"
                aria-label="Search for book cover"
              >
                {isSearching ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-1 dark:text-neutral-300" htmlFor="author">
              Author
            </label>
            <input
              id="author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors dark:bg-neutral-700 dark:text-neutral-200 dark:border-neutral-600"
              placeholder="e.g., Andrew Hunt"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-1 dark:text-neutral-300" htmlFor="isbn">
              ISBN (Optional)
            </label>
            <input
              id="isbn"
              type="text"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors dark:bg-neutral-700 dark:text-neutral-200 dark:border-neutral-600"
              placeholder="e.g., 9780132350884"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1 dark:text-neutral-300" htmlFor="status">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors dark:bg-neutral-700 dark:text-neutral-200 dark:border-neutral-600"
              >
                <option>To Read</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1 dark:text-neutral-300" htmlFor="link">
                Link (Optional)
              </label>
              <input
                id="link"
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors dark:bg-neutral-700 dark:text-neutral-200 dark:border-neutral-600"
                placeholder="e.g., https://www.example.com"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-1 dark:text-neutral-300" htmlFor="progress">
              Progress
            </label>
            <input
              id="progress"
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer dark:bg-neutral-700"
            />
            <div className="text-right text-sm text-neutral-500 dark:text-neutral-400">{progress}%</div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 mb-1 dark:text-neutral-300" htmlFor="summary">
              Summary/Notes
            </label>
            <textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 rounded-md h-32 resize-none focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors dark:bg-neutral-700 dark:text-neutral-200 dark:border-neutral-600"
              placeholder="e.g., Focuses on the philosophy of development, rather than specific technologies."
              required
            ></textarea>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-neutral-200 text-neutral-700 rounded-md font-semibold hover:bg-neutral-300 transition-colors dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600"
            >
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 bg-purple-600 text-white rounded-md font-semibold shadow-md hover:bg-purple-700 transition-colors">
              Save Item
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
    <div className="bg-white rounded-lg shadow-xl max-w-sm p-6 relative text-center dark:bg-neutral-800">
      <p className="text-lg text-neutral-800 mb-6 dark:text-neutral-200">{message}</p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-neutral-200 text-neutral-700 rounded-md font-semibold hover:bg-neutral-300 transition-colors dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600"
        >
          Cancel
        </button>
        <button onClick={onConfirm} className="px-6 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors">
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
      <p className="text-lg text-neutral-800 mb-6 dark:text-neutral-200">{message}</p>
      <div className="flex justify-center">
        <button onClick={onClose} className="px-6 py-2 bg-neutral-200 text-neutral-700 rounded-md font-semibold hover:bg-neutral-300 transition-colors dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600">
          Close
        </button>
      </div>
    </div>
  </div>
);
