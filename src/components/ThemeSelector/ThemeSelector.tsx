'use client';

import React from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

import styles from './ThemeSelector.module.css';
import { useTheme } from '@/context/ThemeContext.tsx';

const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(event.target.checked ? 'dark' : 'light');
  };

  return (
    <div className={`${styles.themeToggleContainer}`}>
      <input
        type="checkbox"
        className={`${styles.themeToggleCheckbox}`}
        id="theme-toggle"
        checked={theme === 'dark'}
        onChange={handleChange}
      />
      <label htmlFor="theme-toggle" className={`${styles.themeToggleCheckboxLabel}`}>
        <FaMoon />
        <FaSun />
        <span className={`${styles.ball}`}></span>
      </label>
    </div>
  );
};

export default ThemeSelector;
