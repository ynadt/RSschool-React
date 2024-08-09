'use client';

import React, { useState } from 'react';

import styles from './Search.module.css';
import ThemeSelector from '@components/ThemeSelector/ThemeSelector.tsx';

interface SearchProps {
  onSearch: (term: string) => void;
  initialTerm: string;
  throwError: () => void;
}

const Search: React.FC<SearchProps> = ({ onSearch, initialTerm, throwError }) => {
  const [searchTerm, setSearchTerm] = useState(initialTerm || '');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    onSearch(searchTerm.trim());
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={styles.search}>
      <input
        type="text"
        value={searchTerm}
        placeholder={'Search for anime'}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleSearch}>Search</button>
      <button onClick={throwError}>Throw Error</button>
      <ThemeSelector />
    </div>
  );
};

export default Search;
