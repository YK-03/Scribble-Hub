import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the shape of our theme context
interface ThemeContextProps {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}

// Create the context with an initial undefined value
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// Define the props for the ThemeProvider component
interface ThemeProviderProps {
  children: ReactNode;
}

// The provider component that manages the theme state
const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Get initial theme from localStorage, fallback to light if not set, and set localStorage if missing
  const getInitialTheme = (): 'dark' | 'light' => {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored === 'dark' || stored === 'light') {
        return stored;
      } else {
        localStorage.setItem('theme', 'light');
        return 'light';
      }
    }
    return 'light';
  };

  const [theme, setThemeState] = useState<'dark' | 'light'>(getInitialTheme);

  // Update the theme class on the HTML element whenever the theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Provide the theme state and a function to set the theme
  const value = {
    theme,
    setTheme: setThemeState,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to easily consume the theme context
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export { ThemeProvider, useTheme };
export default ThemeProvider;
