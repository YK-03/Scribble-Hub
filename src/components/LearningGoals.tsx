import React, { useState } from 'react';
import { useTheme } from './ThemeProvider';
import {
  SquarePen,
  Trash2,
  Plus,
  X,
  Search,
  Sparkles,
  Loader2,
  Moon,
  Sun,
  ClipboardList,
  Circle,
  CircleDot,
  CheckCircle,
  Book,
  Link,
} from 'lucide-react';

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
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  const toggleDarkMode = () => setTheme(isDarkMode ? 'light' : 'dark');

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
    <div className={`min-h-screen font-sans ${isDarkMode ? 'dark bg-neutral-900 text-neutral-100' : 'bg-neutral-50 text-neutral-900'}`}>
      <header className={`shadow-sm p-4 sticky top-0 z-10 ${isDarkMode ? 'bg-neutral-800' : 'bg-white'}`}>
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.location.href = '/'}
              className="font-bold text-2xl text-purple-600 focus:outline-none"
              aria-label="Go to homepage"
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
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
            <div className="relative">
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 pr-4 py-2 rounded-full ${isDarkMode ? 'bg-neutral-700 text-neutral-300' : 'bg-neutral-100 text-neutral-700'} focus:outline-none focus:ring-2 focus:ring-purple-300 transition-colors`}
              />
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-neutral-400' : 'text-neutral-400'}`} size={18} />
            </div>
            <button
              onClick={handleAddGoal}
              className="px-4 py-2 bg-purple-600 text-white rounded-full font-semibold shadow-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>New Goal</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-800 dark:text-neutral-200">Your Learning Goals</h1>
          <p className="text-lg text-neutral-500 mt-2 dark:text-neutral-400">Set, track, and accomplish your learning objectives.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
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
            <div className="col-span-full text-center text-neutral-500 p-8 dark:text-neutral-400">
              <p>No learning goals found. Try adding a new one!</p>
            </div>
          )}
        </div>
      </main>

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
    </div>
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
    if (progress === 100) return 'bg-green-500';
    if (progress > 0) return 'bg-blue-500';
    return 'bg-neutral-300 dark:bg-neutral-600';
  };

  return (
    <div className="group bg-white rounded-lg shadow-md p-6 border border-neutral-200 hover:shadow-lg transition-shadow duration-300 dark:bg-neutral-800 dark:border-neutral-700">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          {getStatusIcon(goal.status)}
          <h3 className="font-bold text-lg text-neutral-800 break-words dark:text-neutral-200">{goal.title}</h3>
          <select
            value={goal.status}
            onChange={e => onStatusChange(goal.id, e.target.value)}
            className="ml-2 px-3 py-2 rounded bg-neutral-100 dark:bg-neutral-700 text-xs border border-neutral-300 dark:border-neutral-600 focus:outline-none"
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
            className="p-1 text-neutral-500 hover:text-purple-600 transition-colors rounded-full"
            aria-label="Edit goal"
          >
            <SquarePen size={18} />
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="p-1 text-neutral-500 hover:text-red-500 transition-colors rounded-full"
            aria-label="Delete goal"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      <p className="text-sm text-neutral-600 line-clamp-3 mb-4 dark:text-neutral-400">{goal.description}</p>
      <div className="mb-4">
        <div className="flex justify-between items-center text-sm font-semibold mb-2">
          <span>Progress: {goal.progress}%</span>
        </div>
        <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden dark:bg-neutral-700">
          <div
            className={`h-full ${getProgressColor(goal.progress)} transition-all duration-500`}
            style={{ width: `${goal.progress}%` }}
          ></div>
        </div>
      </div>

      <div className="text-sm">
        <div className="flex items-center space-x-1 mb-2 font-semibold text-neutral-700 dark:text-neutral-300">
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
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 dark:bg-neutral-700 dark:border-neutral-600"
              />
              <span className={`text-neutral-600 dark:text-neutral-400 ${task.completed ? 'line-through text-neutral-400 dark:text-neutral-500' : ''}`}>{task.name}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-sm mt-4">
        <div className="flex items-center space-x-1 mb-2 font-semibold text-neutral-700 dark:text-neutral-300">
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

      <div className="flex justify-between items-center text-xs text-neutral-400 mt-4 dark:text-neutral-500">
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