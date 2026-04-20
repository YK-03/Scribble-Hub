import React, { useState } from 'react';
import {
  SquarePen,
  Trash2,
  Plus,
  X,
  Search,
  Sparkles,
  Loader2,
  ClipboardList,
  Circle,
  CircleDot,
  CheckCircle,
  Book,
} from 'lucide-react';
import AppShell from '@/components/AppShell';

// Main App component for Learning Goals
export default function App() {
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: 'Master React Patterns',
      status: 'In Progress',
      progress: 50,
      subtasks: [
        { name: 'Understand Higher-Order Components', completed: true },
        { name: 'Learn about Render Props', completed: true },
        { name: 'Explore Custom Hooks', completed: false },
      ],
      description: 'This week I want to learn more about advanced React patterns and improve my understanding of state management.',
      resources: ['https://react.dev/learn', 'https://reactpatterns.com'],
      timestamp: '3 days ago'
    },
    {
      id: 2,
      title: 'Build a CI/CD Pipeline',
      status: 'To-Do',
      progress: 0,
      subtasks: [
        { name: 'Set up a Jenkins server', completed: false },
        { name: 'Create a build script for my app', completed: false },
        { name: 'Configure automated deployment', completed: false },
      ],
      description: 'Learn how to set up an automated CI/CD pipeline using Jenkins and Docker to streamline deployment workflows.',
      resources: ['https://www.jenkins.io/', 'https://aws.amazon.com/devops/cicd/'],
      timestamp: '1 week ago'
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGoal, setCurrentGoal] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [goalIdToDelete, setGoalIdToDelete] = useState(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleAdd = () => handleAddGoal();
  const toggleSubtask = (goalId, subtaskName) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const newSubtasks = goal.subtasks.map(subtask =>
          subtask.name === subtaskName ? { ...subtask, completed: !subtask.completed } : subtask
        );
        const completedCount = newSubtasks.filter(t => t.completed).length;
        const totalCount = newSubtasks.length;
        const newProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
        const newStatus = newProgress === 100 ? 'Completed' : (newProgress > 0 ? 'In Progress' : 'To-Do');
        return { ...goal, subtasks: newSubtasks, progress: newProgress, status: newStatus };
      }
      return goal;
    }));
  };

  const handleAddGoal = () => {
    setCurrentGoal(null);
    setIsModalOpen(true);
  };

  const handleEditGoal = (goal) => {
    setCurrentGoal(goal);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setGoalIdToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const handleStatusChange = (goalId, newStatus) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        let newProgress = goal.progress;
        let newSubtasks = goal.subtasks;
        if (newStatus === 'Completed') {
          newProgress = 100;
          newSubtasks = goal.subtasks.map(t => ({ ...t, completed: true }));
        } else if (newStatus === 'To-Do') {
          newProgress = 0;
          newSubtasks = goal.subtasks.map(t => ({ ...t, completed: false }));
        }
        return { ...goal, status: newStatus, progress: newProgress, subtasks: newSubtasks };
      }
      return goal;
    }));
  };

  const handleDeleteConfirm = () => {
    if (goalIdToDelete) {
      setGoals(goals.filter(goal => goal.id !== goalIdToDelete));
      setGoalIdToDelete(null);
      setIsConfirmModalOpen(false);
    }
  };

  const handleSaveGoal = (newGoalData) => {
    if (currentGoal) {
      setGoals(goals.map(goal =>
        goal.id === currentGoal.id
          ? { ...goal, ...newGoalData, timestamp: 'just now' }
          : goal
      ));
    } else {
      const newGoal = {
        id: Date.now(),
        ...newGoalData,
        timestamp: 'just now',
      };
      setGoals([newGoal, ...goals]);
    }
    setIsModalOpen(false);
  };

  const showMessageModal = (msg) => {
    setMessage(msg);
    setIsMessageModalOpen(true);
  };

  const filteredGoals = goals.filter(goal =>
    goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    goal.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppShell>
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between px-8 h-14 border-b border-border shrink-0">
          <h1 className="text-xl font-medium tracking-tight">Learning Goals</h1>

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
              New goal
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {filteredGoals.length > 0 ? (
              filteredGoals.map(goal => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onEdit={handleEditGoal}
                  onDelete={handleDeleteClick}
                  toggleSubtask={toggleSubtask}
                  onStatusChange={handleStatusChange}
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
        <GoalForm
          onSave={handleSaveGoal}
          onClose={() => setIsModalOpen(false)}
          initialData={currentGoal}
          onShowMessage={showMessageModal}
        />
      )}

      {isConfirmModalOpen && (
        <ConfirmationModal
          message="Are you sure you want to delete this goal?"
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

// Component for a single goal card
const GoalCard = ({ goal, onEdit, onDelete, toggleSubtask, onStatusChange }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle size={28} className="text-green-500" />;
      case 'In Progress':
        return <CircleDot size={28} className="text-blue-500" />;
      case 'To-Do':
        return <Circle size={28} className="text-neutral-400" />;
      default:
        return null;
    }
  };

  const getProgressColor = (progress) => {
    if (progress > 0) return 'bg-[#7F77DD]';
    return 'bg-muted';
  };

  return (
    <div className="bg-card rounded-xl border border-border p-5 hover:bg-accent/30 hover:border-border/80 transition-all duration-150 group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          {getStatusIcon(goal.status)}
          <h3 className="break-words text-lg font-bold text-foreground">{goal.title}</h3>
          <select
            value={goal.status}
            onChange={e => onStatusChange(goal.id, e.target.value)}
            className="ml-2 rounded border border-border bg-muted px-3 py-2 text-xs text-foreground focus:outline-none"
            style={{ minWidth: 130 }}
            aria-label="Set status"
          >
            <option value="To-Do">To-Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(goal)}
            className="rounded-full p-1 text-muted-foreground transition-colors hover:text-purple-600"
            aria-label="Edit goal"
          >
            <SquarePen size={18} />
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="rounded-full p-1 text-muted-foreground transition-colors hover:text-red-500"
            aria-label="Delete goal"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">{goal.description}</p>
      <div className="mb-4">
        <div className="flex justify-between items-center text-sm font-semibold mb-2">
          <span>Progress: {goal.progress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full ${getProgressColor(goal.progress)} transition-all duration-500`}
            style={{ width: `${goal.progress}%` }}
          ></div>
        </div>
      </div>

      <div className="text-sm">
        <div className="mb-2 flex items-center space-x-1 font-semibold text-foreground">
          <ClipboardList size={16} />
          <span>Sub-tasks</span>
        </div>
        <ul className="space-y-1">
          {goal.subtasks.map((task, index) => (
            <li key={index} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleSubtask(goal.id, task.name)}
                className="w-4 h-4 rounded accent-[#7F77DD]"
              />
              <span className={`text-muted-foreground ${task.completed ? 'line-through opacity-70' : ''}`}>{task.name}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-sm mt-4">
        <div className="mb-2 flex items-center space-x-1 font-semibold text-foreground">
          <Book size={16} />
          <span>Resources</span>
        </div>
        <ul className="list-disc list-inside space-y-1">
          {goal.resources.map((resource, index) => (
            <li key={index}>
              <a href={resource} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline dark:text-purple-400">
                {resource.length > 30 ? resource.substring(0, 30) + '...' : resource}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>{goal.timestamp}</span>
      </div>
    </div>
  );
};

// Component for the goal form (modal)
const GoalForm = ({ onSave, onClose, initialData, onShowMessage }) => {
  const [title, setTitle] = useState(initialData ? initialData.title : '');
  const [description, setDescription] = useState(initialData ? initialData.description : '');
  const [resources, setResources] = useState(initialData ? initialData.resources : ['']);
  const [subtasks, setSubtasks] = useState(initialData ? initialData.subtasks.map(t => t.name).join('\n') : '');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [isGeneratingResources, setIsGeneratingResources] = useState(false);

  const handleResourceChange = (index, value) => {
    const newResources = [...resources];
    newResources[index] = value;
    setResources(newResources);
  };

  const handleAddResource = () => {
    setResources([...resources, '']);
  };

  const handleRemoveResource = (index) => {
    const newResources = resources.filter((_, i) => i !== index);
    setResources(newResources);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && description) {
      const formattedSubtasks = subtasks.split('\n').filter(t => t.trim()).map(t => ({ name: t.trim(), completed: false }));
      const progress = formattedSubtasks.length > 0 ? Math.round(formattedSubtasks.filter(t => t.completed).length / formattedSubtasks.length * 100) : 0;
      onSave({
        title,
        description,
        status,
        progress,
        resources: resources.filter(r => r.trim()),
        subtasks: formattedSubtasks,
      });
    } else {
      onShowMessage('Please fill out the title and description.');
    }
  };

  const handleGenerateLearningPlan = async () => {
    if (!title.trim()) {
      onShowMessage('Please enter a goal title to generate a plan.');
      return;
    }

    setIsGeneratingPlan(true);
    const prompt = `Generate a learning plan for the goal: "${title}". The output must be a single JSON object with two keys: "description" (a string) and "subtasks" (an array of strings). The description should be a brief paragraph explaining the learning path. The subtasks should be a list of actionable steps. Do not include any other text or formatting. The response should be a valid JSON object.`;
    
    const payload = {
      contents: [{
        parts: [{ text: prompt }],
      }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            "description": { "type": "STRING" },
            "subtasks": {
              "type": "ARRAY",
              "items": { "type": "STRING" }
            }
          },
          "propertyOrdering": ["description", "subtasks"]
        }
      }
    };
    
    const apiKey = ""
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    let attempts = 0;
    const maxAttempts = 5;
    while (attempts < maxAttempts) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            if (result.candidates && result.candidates.length > 0) {
                const json = result.candidates[0].content.parts[0].text;
                const parsedJson = JSON.parse(json);
                setDescription(parsedJson.description || '');
                setSubtasks(parsedJson.subtasks ? parsedJson.subtasks.join('\n') : '');
                break;
            } else {
                console.error("API response lacked candidates.");
                attempts++;
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000));
            }
        } catch (error) {
            console.error("Fetch error:", error);
            attempts++;
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000));
        }
    }
    if (attempts === maxAttempts) {
        onShowMessage("Failed to generate a learning plan after several attempts. Please try again later.");
    }
    setIsGeneratingPlan(false);
  };

  const handleGenerateResources = async () => {
    if (!title.trim() && !description.trim()) {
      onShowMessage('Please enter a goal title or description to generate resources.');
      return;
    }

    setIsGeneratingResources(true);
    const prompt = `Generate a list of 5 resources (articles, tutorials, or books) for the learning goal: "${title}" with description "${description}". The output must be a single JSON object with a key "resources" which is an array of strings. Each string should be a URL. Do not include any other text or formatting. The response should be a valid JSON object.`;

    const payload = {
      contents: [{
        parts: [{ text: prompt }],
      }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            "resources": {
              "type": "ARRAY",
              "items": { "type": "STRING" }
            }
          },
          "propertyOrdering": ["resources"]
        }
      }
    };
    
    const apiKey = ""
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    let attempts = 0;
    const maxAttempts = 5;
    while (attempts < maxAttempts) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            if (result.candidates && result.candidates.length > 0) {
                const json = result.candidates[0].content.parts[0].text;
                const parsedJson = JSON.parse(json);
                setResources(parsedJson.resources || ['']);
                break;
            } else {
                console.error("API response lacked candidates.");
                attempts++;
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000));
            }
        } catch (error) {
            console.error("Fetch error:", error);
            attempts++;
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000));
        }
    }
    if (attempts === maxAttempts) {
        onShowMessage("Failed to generate resources after several attempts. Please try again later.");
    }
    setIsGeneratingResources(false);
  };


  return (
    <div className="fixed inset-0 bg-neutral-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative dark:bg-neutral-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-900 transition-colors dark:text-neutral-400 dark:hover:text-neutral-100"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-neutral-800 mb-6 dark:text-neutral-200">
          {initialData ? 'Edit Learning Goal' : 'New Learning Goal'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-1 dark:text-neutral-300" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              value={initialData && initialData.status ? initialData.status : 'To-Do'}
              onChange={e => initialData ? initialData.status = e.target.value : null}
              className="w-full px-5 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors dark:bg-neutral-700 dark:text-neutral-200 dark:border-neutral-600"
              style={{ minWidth: 130 }}
            >
              <option value="To-Do">To-Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-1 dark:text-neutral-300" htmlFor="title">
              Goal Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors dark:bg-neutral-700 dark:text-neutral-200 dark:border-neutral-600"
              placeholder="e.g., Learn TypeScript"
              required
            />
          </div>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300" htmlFor="description">
                Description
              </label>
              <button
                type="button"
                onClick={handleGenerateLearningPlan}
                disabled={isGeneratingPlan || !title.trim()}
                className="text-xs text-purple-600 font-semibold flex items-center space-x-1"
                aria-label="Generate AI plan"
              >
                {isGeneratingPlan ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                <span>✨ Generate Learning Plan</span>
              </button>
            </div>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 rounded-md h-24 resize-none focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors dark:bg-neutral-700 dark:text-neutral-200 dark:border-neutral-600"
              placeholder="e.g., Learn how to build a responsive website from scratch."
              required
            ></textarea>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 mb-2 dark:text-neutral-300">
              Sub-tasks (one per line)
            </label>
            <textarea
              value={subtasks}
              onChange={(e) => setSubtasks(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 rounded-md h-24 resize-none focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors dark:bg-neutral-700 dark:text-neutral-200 dark:border-neutral-600"
              placeholder="e.g.,&#10;Set up project structure&#10;Build the main component&#10;Add routing"
            ></textarea>
          </div>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Resources
              </label>
              <button
                type="button"
                onClick={handleGenerateResources}
                disabled={isGeneratingResources || !title.trim()}
                className="text-xs text-purple-600 font-semibold flex items-center space-x-1"
                aria-label="Generate AI resources"
              >
                {isGeneratingResources ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                <span>✨ Generate Resources</span>
              </button>
            </div>
            {resources.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleResourceChange(index, e.target.value)}
                  className="flex-grow px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors dark:bg-neutral-700 dark:text-neutral-200 dark:border-neutral-600"
                  placeholder="e.g., https://www.example.com/article"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveResource(index)}
                  className="p-1 text-neutral-500 hover:text-red-500 transition-colors rounded-full"
                  aria-label="Remove resource"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddResource}
              className="mt-2 w-full px-4 py-2 bg-neutral-100 text-neutral-600 rounded-md font-semibold hover:bg-neutral-200 transition-colors dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600 flex items-center justify-center space-x-2"
            >
              <Plus size={20} />
              <span>Add Resource</span>
            </button>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-neutral-200 text-neutral-700 rounded-md font-semibold hover:bg-neutral-300 transition-colors dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-md font-semibold shadow-md hover:bg-purple-700 transition-colors"
            >
              Save Goal
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
    <div className="bg-white rounded-lg shadow-xl max-w-sm p-6 relative text-center dark:bg-neutral-800">
      <p className="text-lg text-neutral-800 mb-6 dark:text-neutral-200">{message}</p>
      <div className="flex justify-center">
        <button
          onClick={onClose}
          className="px-6 py-2 bg-neutral-200 text-neutral-700 rounded-md font-semibold hover:bg-neutral-300 transition-colors dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);
