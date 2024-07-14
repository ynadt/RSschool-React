import React, { useState } from 'react';

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
    <div className="search">
      <input type="text" value={searchTerm} onChange={handleChange} onKeyDown={handleKeyDown} />
      <button onClick={handleSearch}>Search</button>
      <button onClick={throwError}>Throw Error</button>
    </div>
  );
};

export default Search;
