import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Icon from '../AppIcon';

const ThemeToggle = ({ className = '' }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      className={`press w-9 h-9 rounded-xl bg-paper border border-paper-dark flex items-center justify-center text-ink-light hover:text-ink hover:bg-paper-dark/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`}
    >
      <Icon
        name={isDarkMode ? 'Sun' : 'Moon'}
        size={17}
        className="animate-scale-in"
        key={isDarkMode ? 'sun' : 'moon'}
      />
    </button>
  );
};

export default ThemeToggle;
