import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  SquarePen,
  Trash2,
  Plus,
  X,
  Search,
  Users,
  Send,
  Loader2,
  Pin,
  Lightbulb,
} from 'lucide-react';
import AppShell from './AppShell';

const formatTimeAgo = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 5) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString();
};

export default function Projects() {
  const navigate = useNavigate();
  const { searchterm } = useParams();

  const dummyProjects = [
    { id: 1, title: 'Scribble Hub App', description: 'Brainstorming session for the new app. Features to include: real-time collaboration, markdown support, and beautiful UI design. Need to research websockets for this.', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), isPinned: true },
    { id: 2, title: 'Portfolio Website', description: 'Design and develop a new portfolio website to showcase recent projects. Focus on clean design, performance optimization, and mobile-first approach.', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), isPinned: false },
    { id: 3, title: 'E-commerce Redesign', description: 'Research and propose a complete redesign for an existing e-commerce platform. Focus on improving user experience, checkout flow, and product discovery.', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), isPinned: false },
    { id: 4, title: 'Project Management Tool', description: 'A project management tool with Kanban boards and Gantt charts.', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), isPinned: false },
  ];

  const [projects, setProjects] = useState(() => {
    const stored = localStorage.getItem('projectIdeas');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return dummyProjects;
      }
    }
    return dummyProjects;
  });

  useEffect(() => {
    localStorage.setItem('projectIdeas', JSON.stringify(projects));
  }, [projects]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [projectIdToDelete, setProjectIdToDelete] = useState(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isCollaboratorModalOpen, setIsCollaboratorModalOpen] = useState(false);

  useEffect(() => {
    if (searchterm) {
      setSearchQuery(decodeURIComponent(searchterm));
    } else {
      setSearchQuery('');
    }
  }, [searchterm]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim()) {
      navigate(`/projects/${encodeURIComponent(value)}`);
    } else {
      navigate(`/projects`);
    }
  };

  const handleAddProject = () => {
    setCurrentProject(null);
    setIsModalOpen(true);
  };

  const handleEditProject = (project) => {
    setCurrentProject(project);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setProjectIdToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (projectIdToDelete) {
      setProjects(projects.filter(project => project.id !== projectIdToDelete));
      setProjectIdToDelete(null);
      setIsConfirmModalOpen(false);
    }
  };

  const handleSaveProject = (title, description) => {
    if (currentProject) {
      setProjects(projects.map(project =>
        project.id === currentProject.id
          ? { ...project, title, description, timestamp: new Date().toISOString() }
          : project
      ));
    } else {
      const newProject = {
        id: Date.now(),
        title,
        description,
        timestamp: new Date().toISOString(),
        isPinned: false,
      };
      setProjects([newProject, ...projects]);
    }
    setIsModalOpen(false);
  };

  const handleTogglePin = (projectId) => {
    setProjects(projects.map(p => p.id === projectId ? { ...p, isPinned: !p.isPinned } : p));
  };

  const filteredProjects = projects
    .filter(project =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => (b.isPinned - a.isPinned) || (new Date(b.timestamp) - new Date(a.timestamp)));
  
  const handleOpenCollaboratorModal = (project) => {
    setCurrentProject(project);
    setIsCollaboratorModalOpen(true);
  };

  const handleInviteCollaborator = (email) => {
    if (!email) {
      setMessage("Please enter an email address.");
      setIsMessageModalOpen(true);
      return;
    }
    
    // This is a mock API call. In a real app, this would send an invite to a backend.
    console.log(`Inviting ${email} to collaborate on project: "${currentProject.title}"`);
    setMessage(`Invitation sent to ${email} successfully!`);
    setIsCollaboratorModalOpen(false);
    setIsMessageModalOpen(true);
  };

  return (
    <AppShell>
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="border-b border-border bg-background/95 px-8 py-6 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Your Project Ideas</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Capture, organize, and manage your thoughts for new projects.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="h-11 w-full rounded-xl border border-input bg-card pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring sm:w-72"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              </div>
              <button
                onClick={handleAddProject}
                className="inline-flex h-11 items-center justify-center space-x-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                <Plus size={18} />
                <span>New Project</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProjects.length > 0 ? (
              filteredProjects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={handleEditProject}
                  onDelete={handleDeleteClick}
                  onCollaborate={handleOpenCollaboratorModal}
                  onTogglePin={handleTogglePin}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center p-16 text-center text-muted-foreground">
                <Lightbulb className="mb-4 h-16 w-16 text-muted-foreground" />
                <h2 className="mb-2 text-2xl font-semibold text-foreground">
                  {searchQuery ? `No projects found for "${searchQuery}"` : "Your canvas is empty"}
                </h2>
                <p className="max-w-md text-lg text-muted-foreground">
                  {searchQuery ? "Try a different search term or clear the search." : "Start by adding a new project to capture your brilliant ideas!"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      

      {isModalOpen && (
        <ProjectForm
          onSave={handleSaveProject}
          onClose={() => setIsModalOpen(false)}
          initialData={currentProject}
          onShowMessage={msg => { setMessage(msg); setIsMessageModalOpen(true); }}
        />
      )}

      {isConfirmModalOpen && (
        <ConfirmationModal
          message="Are you sure you want to delete this project idea?"
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

      {isCollaboratorModalOpen && currentProject && (
        <CollaboratorModal
          project={currentProject}
          onInvite={handleInviteCollaborator}
          onClose={() => setIsCollaboratorModalOpen(false)}
        />
      )}
    </AppShell>
  );
}

const ProjectCard = ({ project, onEdit, onDelete, onCollaborate, onTogglePin }) => (
  <div className="group cursor-pointer rounded-lg border border-border bg-card p-6 shadow-md transition-shadow duration-300 hover:shadow-lg">
    <div className="flex justify-between items-start mb-4">
      <h3 className="break-words text-lg font-bold text-foreground">{project.title}</h3>
      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin(project.id);
          }}
          className={`rounded-full p-1 transition-colors ${project.isPinned ? 'text-purple-600' : 'text-muted-foreground hover:text-purple-600'}`}
          aria-label={project.isPinned ? "Unpin project" : "Pin project"}
        >
          <Pin size={18} className={project.isPinned ? 'fill-current' : ''} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(project);
          }}
          className="rounded-full p-1 text-muted-foreground transition-colors hover:text-purple-600"
          aria-label="Edit project"
        >
          <SquarePen size={18} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(project.id);
          }}
          className="rounded-full p-1 text-muted-foreground transition-colors hover:text-red-500"
          aria-label="Delete project"
        >
          <Trash2 size={18} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCollaborate(project);
          }}
          className="rounded-full p-1 text-muted-foreground transition-colors hover:text-purple-600"
          aria-label="Add collaborators"
        >
          <Users size={18} />
        </button>
      </div>
    </div>
    <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">{project.description}</p>
    <div className="flex items-center justify-between text-xs text-muted-foreground">
      <span>{formatTimeAgo(project.timestamp)}</span>
    </div>
  </div>
);

const ProjectForm = ({ onSave, onClose, initialData, onShowMessage }) => {
  const [title, setTitle] = useState(initialData ? initialData.title : '');
  const [description, setDescription] = useState(initialData ? initialData.description : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && description) {
      onSave(title, description);
    } else {
      onShowMessage("Please fill out both the title and description.");
    }
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
          {initialData ? 'Edit Project Idea' : 'New Project Idea'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-1" htmlFor="title">
              Project Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 dark:border-[#444444] rounded-md focus:ring-4 focus:ring-[#888888] focus:outline-none transition-colors bg-white text-neutral-900 dark:bg-[#121212] dark:text-[#E0E0E0] placeholder:italic placeholder:text-neutral-400 dark:placeholder:text-[#B0B0B0]"
              placeholder="e.g., My Awesome App"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 mb-1" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 dark:border-[#444444] rounded-md h-32 resize-none focus:ring-4 focus:ring-[#888888] focus:outline-none transition-colors bg-white text-neutral-900 dark:bg-[#121212] dark:text-[#E0E0E0] placeholder:italic placeholder:text-neutral-400 dark:placeholder:text-[#B0B0B0]"
              placeholder="e.g., A web application that helps users manage their daily tasks."
              required
            ></textarea>
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
              Save Idea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

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

const CollaboratorModal = ({ project, onInvite, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleInvite = async () => {
    setIsSending(true);
    await onInvite(email); // Simulate API call
    setIsSending(false);
    setEmail('');
  };

  return (
    <div className="fixed inset-0 bg-neutral-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-[#121212] rounded-lg shadow-xl w-full max-w-lg p-6 relative border dark:border-[#444444]">
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-900 transition-colors" aria-label="Close modal">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-neutral-800 dark:text-[#E0E0E0]">
          Add Collaborator to "{project.title}"
        </h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-700 mb-1 dark:text-neutral-300" htmlFor="collaborator-email">
            Collaborator's Email
          </label>
          <div className="flex items-center space-x-2">
            <input
              id="collaborator-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 dark:border-[#444444] rounded-md focus:ring-4 focus:ring-[#888888] focus:outline-none transition-colors bg-white text-neutral-900 dark:bg-[#121212] dark:text-[#E0E0E0]"
              placeholder="e.g., example@email.com"
            />
            <button
              type="button"
              onClick={handleInvite}
              disabled={isSending}
              className="p-2 bg-purple-600 text-white rounded-full font-semibold shadow-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              aria-label="Send invitation"
            >
              {isSending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
