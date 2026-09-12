import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const THEME_STORAGE_KEY = 'hospital-pharmacy-theme';

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (newTheme) => {
    if (newTheme === 'dark' || newTheme === 'light') {
      setThemeState(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
