import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  Loader2,
} from 'lucide-react';
import AppShell from '@/components/AppShell';

// Main App component for the Reading Log
export default function App() {
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
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleAdd = () => handleAddReadingItem();

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
    <AppShell>
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between px-8 h-14 border-b border-border shrink-0">
          <h1 className="text-xl font-medium tracking-tight">Reading List</h1>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowBookmarked((v) => !v)}
              className={`flex items-center justify-center px-3 h-8 border rounded-md transition-colors ${showBookmarked ? 'border-[#D85A30] bg-[#D85A30] text-white' : 'border-border bg-muted text-muted-foreground hover:bg-accent/30'}`}
              aria-label="Toggle bookmarked items"
            >
              <Bookmark size={13} />
            </button>
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
              New item
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <ReadingCard key={item.id} item={item} onEdit={handleEditReadingItem} onDelete={handleDeleteClick} toggleBookmark={toggleBookmark} />
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

      {isModalOpen && <ReadingForm onSave={handleSaveReadingItem} onClose={() => setIsModalOpen(false)} initialData={currentReadingItem} onShowMessage={showMessageModal} />}

      {isConfirmModalOpen && <ConfirmationModal message="Are you sure you want to delete this reading item?" onConfirm={handleDeleteConfirm} onCancel={() => setIsConfirmModalOpen(false)} />}

      {isMessageModalOpen && <MessageModal message={message} onClose={() => setIsMessageModalOpen(false)} />}
    </AppShell>
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
    if (progress === 100) return 'bg-[#1D9E75]';
    if (progress > 0) return 'bg-[#7F77DD]';
    return 'bg-muted';
  };

  const coverUrl = item.isbn ? `https://covers.openlibrary.org/b/isbn/${item.isbn}-M.jpg` : null;

  return (
    <div className="bg-card rounded-xl border border-border p-5 hover:bg-accent/30 hover:border-border/80 transition-all duration-150 group">
      <div className="flex justify-end items-start mb-2 space-x-2">
        <button onClick={() => toggleBookmark(item.id)} className="p-1 transition-colors rounded-full" aria-label="Toggle bookmark">
          {item.isBookmarked ? <Bookmark size={20} className="fill-current text-[#D85A30]" /> : <BookmarkPlus size={20} className="text-muted-foreground group-hover:text-[#D85A30]" />}
        </button>
        <button onClick={(e) => { e.stopPropagation(); onEdit(item); }} className="rounded-full p-1 text-muted-foreground transition-colors hover:text-purple-600" aria-label="Edit item">
          <SquarePen size={18} />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(item.id); }} className="rounded-full p-1 text-muted-foreground transition-colors hover:text-red-500" aria-label="Delete item">
          <Trash2 size={18} />
        </button>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        {coverUrl && (
          <img
            src={coverUrl}
            alt={`Cover for ${item.title}`}
            className="rounded-lg flex-shrink-0"
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
          <div className="flex flex-shrink-0 items-center justify-center rounded-lg bg-muted p-2 text-center text-foreground" style={{ width: '100px', height: '150px' }}>
            No Cover
          </div>
        )}
        <div className="flex flex-col space-y-1 w-full">
          <div className="flex items-center space-x-2">
            {getStatusIcon(item.status)}
            <h3 className="break-words text-lg font-bold text-foreground">{item.title}</h3>
          </div>
          <p className="text-sm text-muted-foreground">By: {item.author}</p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className={`h-full ${getProgressColor(item.progress)} transition-all duration-500`} style={{ width: `${item.progress}%` }}></div>
          </div>
          <span className="mt-1 text-xs text-muted-foreground">{item.progress}% Complete</span>
        </div>
      </div>

      <p className="mb-2 line-clamp-3 text-sm text-muted-foreground">{item.summary}</p>
      {item.link && (
        <div className="mb-4 flex items-center space-x-1 text-xs text-muted-foreground">
          <LinkIcon size={12} />
          <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
            View Resource
          </a>
        </div>
      )}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
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
