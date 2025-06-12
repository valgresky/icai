import { useState, useEffect } from 'react';

type Theme = 'dark' | 'light';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check for stored theme preference
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') return stored as Theme;
    
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'dark'; // Default to dark theme
  });

  useEffect(() => {
    // Remove all theme classes
    document.documentElement.classList.remove('dark', 'light');
    
    // Add current theme class
    document.documentElement.classList.add(theme);
    
    // Store theme preference
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return { theme, setTheme, toggleTheme };
};