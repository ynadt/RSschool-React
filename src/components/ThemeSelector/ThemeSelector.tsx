import './ThemeSelector.module.css';

import React from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

import { useTheme } from '@/context/ThemeContext.tsx';

const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(event.target.checked ? 'dark' : 'light');
  };

  return (
    <div className="theme-toggle-container">
      <input
        type="checkbox"
        className="theme-toggle-checkbox"
        id="theme-toggle"
        checked={theme === 'dark'}
        onChange={handleChange}
      />
      <label htmlFor="theme-toggle" className="theme-toggle-checkbox-label">
        <FaMoon />
        <FaSun />
        <span className="ball"></span>
      </label>
    </div>
  );
};

export default ThemeSelector;
