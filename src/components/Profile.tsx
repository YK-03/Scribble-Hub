import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  LogOut,
  Sun,
  Moon,
  Folder,
  BookOpen,
  CookingPot,
  PenTool,
} from 'lucide-react';
import { useTheme } from './ThemeProvider';

// A placeholder for a User Info component or a simple mock
const UserInfo = ({ userName, onLogout }) => (
    <div className="flex items-center space-x-4 mb-8">
        <div className="flex-shrink-0 w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-3xl font-bold">{userName[0]}</span>
        </div>
        <div>
            <h2 className="text-3xl font-bold text-white">Welcome, {userName}!</h2>
            <p className="text-sm text-gray-400">Your creative hub awaits.</p>
        </div>
    </div>
);

// Dashboard main component
export default function ProfileDashboard() {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
    const isDarkMode = theme === 'dark';
    const toggleDarkMode = () => setTheme(isDarkMode ? 'light' : 'dark');

    // Mock user data and categories
    const userName = 'John Doe';
    const categories = [
        { name: 'Projects', icon: <Folder size={40} />, description: 'Capture and manage ideas for your projects.', route: '/projects' },
        { name: 'Reading Log', icon: <BookOpen size={40} />, description: 'Track your reading journey and log summaries.', route: '/reading-log' },
        { name: 'Recipe Ideas', icon: <CookingPot size={40} />, description: 'Generate and save your culinary creations.', route: '/recipe-ideas' },
        { name: 'Art Playground', icon: <PenTool size={40} />, description: 'Unleash your creativity on a digital canvas.', route: '/art-playground' },
    ];

    const handleLogout = () => {
        // In a real application, you would handle Firebase signOut here.
        console.log('User logged out.');
        navigate('/signup');
    };

    return (
        <div className={`min-h-screen font-sans p-8 ${isDarkMode ? 'dark bg-neutral-900 text-neutral-100' : 'bg-neutral-50 text-neutral-900'}`}>
            <header className="sticky top-0 z-10 p-4 mb-8 flex justify-between items-center bg-transparent">
                <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">
                    Scribble Hub
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={toggleDarkMode}
                        className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'}`}
                        aria-label="Toggle dark mode"
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 text-white rounded-full font-semibold shadow-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </header>

            <main className="container mx-auto">
                <UserInfo userName={userName} onLogout={handleLogout} />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <Link
                            key={category.name}
                            to={category.route}
                            className={`block p-6 rounded-xl shadow-lg border border-transparent transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl 
                                ${isDarkMode ? 'bg-neutral-800 hover:border-purple-600' : 'bg-white hover:border-purple-600'}`}
                        >
                            <div className="flex items-center space-x-4 mb-4">
                                <div className={`p-3 rounded-full ${isDarkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-600'}`}>
                                    {category.icon}
                                </div>
                                <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-neutral-100' : 'text-neutral-900'}`}>{category.name}</h3>
                            </div>
                            <p className={`text-sm ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>{category.description}</p>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
