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
  Sparkles,
  ChefHat,
  List,
  CookingPot,
  Share2,
  Mail,
  Copy,
  MessageCircle,
} from 'lucide-react';
import { useTheme } from './ThemeProvider';

// Main App component for Recipe Ideas
export default function App() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  const { searchterm } = useParams();

  // Dummy recipes for initial load
  const dummyRecipes = [
    {
      id: 1,
      title: 'Homemade Pasta with Garlic Sauce',
      ingredients: ['Pasta', 'Garlic', 'Olive oil', 'Parsley', 'Parmesan cheese'],
      instructions: ['Cook pasta according to package directions.', 'Sauté minced garlic in olive oil.', 'Toss pasta with garlic sauce and garnish with parsley and cheese.'],
      timestamp: '2 weeks ago'
    },
    {
      id: 2,
      title: 'Vegetarian Chickpea Curry',
      ingredients: ['Chickpeas', 'Coconut milk', 'Onion', 'Garlic', 'Ginger', 'Curry powder', 'Spinach'],
      instructions: ['Sauté onion, garlic, and ginger until fragrant.', 'Add curry powder and cook for one minute.', 'Stir in chickpeas and coconut milk.', 'Simmer for 15 minutes, then add spinach and cook until wilted.'],
      timestamp: '2 weeks ago'
    },
    {
      id: 3,
      title: 'Simple Chicken and Broccoli Pasta',
      ingredients: ['Chicken breast', 'Broccoli', 'Pasta', 'Olive oil', 'Garlic', 'Parmesan cheese'],
      instructions: ['Cook pasta.', 'Sauté chicken and broccoli.', 'Mix all ingredients together with garlic and olive oil.'],
      timestamp: '1 day ago'
    }
  ];

  // State to manage the list of recipes, loaded from localStorage if available
  const [recipes, setRecipes] = useState(() => {
    const stored = localStorage.getItem('recipeIdeas');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return dummyRecipes;
      }
    }
    return dummyRecipes;
  });

  // Persist recipes to localStorage whenever recipes change
  useEffect(() => {
    localStorage.setItem('recipeIdeas', JSON.stringify(recipes));
  }, [recipes]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [recipeIdToDelete, setRecipeIdToDelete] = useState(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Set the search query from the URL when the component mounts
  useEffect(() => {
    if (searchterm) {
      setSearchQuery(decodeURIComponent(searchterm));
    } else {
      setSearchQuery('');
    }
  }, [searchterm]);

  const toggleDarkMode = () => setTheme(isDarkMode ? 'light' : 'dark');

  const handleAddRecipe = () => {
    setCurrentRecipe(null);
    setIsModalOpen(true);
  };

  const handleEditRecipe = (recipe) => {
    setCurrentRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleShareClick = (recipe) => {
    setCurrentRecipe(recipe);
    setIsShareModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setRecipeIdToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (recipeIdToDelete) {
      setRecipes(recipes.filter(recipe => recipe.id !== recipeIdToDelete));
      setRecipeIdToDelete(null);
      setIsConfirmModalOpen(false);
    }
  };

  const handleSaveRecipe = (newRecipeData) => {
    if (currentRecipe) {
      setRecipes(recipes.map(recipe =>
        recipe.id === currentRecipe.id
          ? { ...recipe, ...newRecipeData, timestamp: 'just now' }
          : recipe
      ));
    } else {
      const newRecipe = {
        id: Date.now(),
        ...newRecipeData,
        timestamp: 'just now',
      };
      setRecipes([newRecipe, ...recipes]);
    }
    setIsModalOpen(false);
  };

  const showMessageModal = (msg) => {
    setMessage(msg);
    setIsMessageModalOpen(true);
  };

  // Filter recipes based on the search query
  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={`min-h-screen font-sans ${isDarkMode ? 'dark bg-neutral-900 text-neutral-100' : 'bg-neutral-50 text-neutral-900'}`}>
      <header className={`shadow-sm p-4 sticky top-0 z-10 ${isDarkMode ? 'bg-neutral-800' : 'bg-white'}`}>
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate('/homepage')}
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
              onClick={handleAddRecipe}
              className="px-4 py-2 bg-purple-600 text-white rounded-full font-semibold shadow-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>New Recipe</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-800 dark:text-neutral-200">Your Recipe Ideas</h1>
          <p className="text-lg text-neutral-500 mt-2 dark:text-neutral-400">Generate, save, and organize your culinary creations.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onEdit={handleEditRecipe}
                onDelete={handleDeleteClick}
                onShare={handleShareClick}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-neutral-500 p-8 dark:text-neutral-400">
              <p>No recipes found. Try generating a new one!</p>
            </div>
          )}
        </div>
      </main>

      {isModalOpen && (
        <RecipeForm
          onSave={handleSaveRecipe}
          onClose={() => setIsModalOpen(false)}
          initialData={currentRecipe}
          onShowMessage={showMessageModal}
        />
      )}

      {isConfirmModalOpen && (
        <ConfirmationModal
          message="Are you sure you want to delete this recipe?"
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
      {isShareModalOpen && currentRecipe && (
        <ShareModal
          recipe={currentRecipe}
          onClose={() => setIsShareModalOpen(false)}
          onShowMessage={showMessageModal}
        />
      )}
    </div>
  );
}

// Component for a single recipe card
const RecipeCard = ({ recipe, onEdit, onDelete, onShare }) => (
  <div className="group bg-white rounded-lg shadow-md p-6 border border-neutral-200 hover:shadow-lg transition-shadow duration-300 dark:bg-neutral-800 dark:border-neutral-700">
    <div className="flex justify-between items-start mb-4">
      <h3 className="font-bold text-lg text-neutral-800 break-words dark:text-neutral-200">{recipe.title}</h3>
      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(recipe)}
          className="p-1 text-neutral-500 hover:text-purple-600 transition-colors rounded-full"
          aria-label="Edit recipe"
        >
          <SquarePen size={18} />
        </button>
        <button
          onClick={() => onDelete(recipe.id)}
          className="p-1 text-neutral-500 hover:text-red-500 transition-colors rounded-full"
          aria-label="Delete recipe"
        >
          <Trash2 size={18} />
        </button>
        <button
          onClick={() => onShare(recipe)}
          className="p-1 text-neutral-500 hover:text-blue-500 transition-colors rounded-full"
          aria-label="Share recipe"
        >
          <Share2 size={18} />
        </button>
      </div>
    </div>
    <div className="text-sm text-neutral-600 dark:text-neutral-400">
      <div className="flex items-center space-x-1 mb-2">
        <CookingPot size={16} className="text-neutral-500" />
        <span className="font-semibold">Ingredients</span>
      </div>
      <ul className="list-disc list-inside mb-4">
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <div className="flex items-center space-x-1 mb-2">
        <List size={16} className="text-neutral-500" />
        <span className="font-semibold">Instructions</span>
      </div>
      <ol className="list-decimal list-inside">
        {recipe.instructions.map((instruction, index) => (
          <li key={index}>{instruction}</li>
        ))}
      </ol>
    </div>
    <div className="flex justify-between items-center text-xs text-neutral-400 mt-4 dark:text-neutral-500">
      <span>{recipe.timestamp}</span>
    </div>
  </div>
);

// Component for the recipe form (modal)
const RecipeForm = ({ onSave, onClose, initialData, onShowMessage }) => {
  const [title, setTitle] = useState(initialData ? initialData.title : '');
  const [ingredients, setIngredients] = useState(initialData ? initialData.ingredients.join('\n') : '');
  const [instructions, setInstructions] = useState(initialData ? initialData.instructions.join('\n') : '');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && ingredients && instructions) {
      onSave({
        title,
        ingredients: ingredients.split('\n').filter(i => i.trim()),
        instructions: instructions.split('\n').filter(i => i.trim()),
      });
    } else {
      onShowMessage('Please fill out all recipe fields.');
    }
  };

  const handleGenerateRecipe = async () => {
    if (!prompt.trim()) {
      onShowMessage('Please enter a prompt to generate a recipe.');
      return;
    }

    setIsGenerating(true);
    const generationPrompt = `Generate a recipe based on the following prompt: "${prompt}". The output must be a single JSON object with two keys: "recipeName" (a string) and "ingredients" (an array of strings). and "instructions" (an array of strings). Do not include any other text or formatting. The response should be a valid JSON object.`;

    const payload = {
      contents: [{
        parts: [{ text: generationPrompt }],
      }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            "recipeName": { "type": "STRING" },
            "ingredients": {
              "type": "ARRAY",
              "items": { "type": "STRING" }
            },
            "instructions": {
              "type": "ARRAY",
              "items": { "type": "STRING" }
            }
          },
          "propertyOrdering": ["recipeName", "ingredients", "instructions"]
        }
      }
    };
    
    const apiKey = import.meta.env.VITE_API_KEY;
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
              setTitle(parsedJson.recipeName || '');
              setIngredients(parsedJson.ingredients ? parsedJson.ingredients.join('\n') : '');
              setInstructions(parsedJson.instructions ? parsedJson.instructions.join('\n') : '');
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
        onShowMessage("Failed to generate recipe after several attempts. Please try again later.");
    }
    setIsGenerating(false);
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
          {initialData ? 'Edit Recipe' : 'New Recipe'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-1 dark:text-neutral-300" htmlFor="prompt">
              Generate from Prompt
            </label>
            <div className="flex items-center space-x-2">
              <input
                id="prompt"
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors dark:bg-neutral-700 dark:text-neutral-200 dark:border-neutral-600"
                placeholder="e.g., A quick pasta dish with broccoli and chicken"
              />
              <button
                type="button"
                onClick={handleGenerateRecipe}
                disabled={isGenerating}
                className="p-2 bg-purple-600 text-white rounded-md font-semibold hover:bg-purple-700 transition-colors"
                aria-label="Generate recipe"
              >
                {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-1 dark:text-neutral-300" htmlFor="title">
              Recipe Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors dark:bg-neutral-700 dark:text-neutral-200 dark:border-neutral-600"
              placeholder="e.g., Simple Chicken and Broccoli Pasta"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-1 dark:text-neutral-300" htmlFor="ingredients">
              Ingredients (one per line)
            </label>
            <textarea
              id="ingredients"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 rounded-md h-24 resize-none focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors dark:bg-neutral-700 dark:text-neutral-200 dark:border-neutral-600"
              placeholder="e.g.,&#10;1 cup of pasta&#10;1 broccoli head&#10;1 chicken breast"
              required
            ></textarea>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 mb-1 dark:text-neutral-300" htmlFor="instructions">
              Instructions (one per line)
            </label>
            <textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 rounded-md h-32 resize-none focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors dark:bg-neutral-700 dark:text-neutral-200 dark:border-neutral-600"
              placeholder="e.g.,&#10;1. Boil the pasta.&#10;2. Sauté the chicken and broccoli.&#10;3. Combine all ingredients."
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
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-md font-semibold shadow-md hover:bg-purple-700 transition-colors"
            >
              Save Recipe
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
    <div className="bg-white rounded-lg shadow-xl max-w-sm p-6 relative text-center">
      <p className="text-lg text-neutral-800 mb-6 dark:text-neutral-200">{message}</p>
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

// New modal for sharing recipes
const ShareModal = ({ recipe, onClose, onShowMessage }) => {
  const formatRecipeForSharing = (recipe) => {
    const ingredients = recipe.ingredients.map(i => `• ${i}`).join('\n');
    const instructions = recipe.instructions.map((i, index) => `${index + 1}. ${i}`).join('\n');
    return `${recipe.title}\n\nIngredients:\n${ingredients}\n\nInstructions:\n${instructions}`;
  };

  const handleShareOnWhatsApp = () => {
    const text = formatRecipeForSharing(recipe);
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareByEmail = () => {
    const subject = `Recipe: ${recipe.title}`;
    const body = formatRecipeForSharing(recipe);
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleCopyToClipboard = () => {
    const text = formatRecipeForSharing(recipe);
    document.execCommand('copy');
    const tempElement = document.createElement('textarea');
    tempElement.value = text;
    document.body.appendChild(tempElement);
    tempElement.select();
    document.execCommand('copy');
    document.body.removeChild(tempElement);
    onShowMessage('Recipe copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 bg-neutral-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 relative dark:bg-neutral-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-900 transition-colors dark:text-neutral-400 dark:hover:text-neutral-100"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-neutral-800 mb-6 dark:text-neutral-200">
          Share {recipe.title}
        </h2>
        <div className="flex justify-around space-x-4">
          <button
            onClick={handleShareOnWhatsApp}
            className="flex flex-col items-center p-4 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors min-w-[90px]"
            aria-label="Share on WhatsApp"
          >
            <MessageCircle size={28} />
            <span className="mt-2 text-xs">WhatsApp</span>
          </button>
          <button
            onClick={handleShareByEmail}
            className="flex flex-col items-center p-4 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors min-w-[90px]"
            aria-label="Share by Email"
          >
            <Mail size={28} />
            <span className="mt-2 text-xs">Email</span>
          </button>
          <button
            onClick={handleCopyToClipboard}
            className="flex flex-col items-center p-4 rounded-lg bg-gray-500 text-white font-semibold hover:bg-gray-600 transition-colors min-w-[90px]"
            aria-label="Copy to Clipboard"
          >
            <Copy size={28} />
            <span className="mt-2 text-xs">Copy Link</span>
          </button>
        </div>
      </div>
    </div>
  );
};
