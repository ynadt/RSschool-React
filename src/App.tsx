import React, { useState, useEffect } from 'react';
import './App.css';
import Search from './components/Search';
import CardList from './components/CardList';
import useSearchTerm from './hooks/useSearchTerm';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useSearchTerm('');
  const [results, setResults] = useState<Array<{ mal_id: number; title: string; synopsis: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [shouldThrowError, setShouldThrowError] = useState(false);

  useEffect(() => {
    fetchResults(searchTerm);
  }, [searchTerm]);

  const fetchResults = (term: string) => {
    setLoading(true);
    setError(null);

    const apiEndpoint = term
      ? `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(term)}`
      : `https://api.jikan.moe/v4/anime`;

    fetch(apiEndpoint)
      .then((response) => response.json())
      .then((data) => {
        const results = (data.data || []).map((item: { mal_id: number; title: string; synopsis: string }) => ({
          mal_id: item.mal_id,
          title: item.title,
          synopsis: item.synopsis,
        }));
        setResults(results);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching results', error);
        setError(error);
        setLoading(false);
      });
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const throwError = () => {
    setShouldThrowError(true);
  };

  if (shouldThrowError) {
    throw new Error('Test error');
  }

  return (
    <div className="App">
      <div className="top-section">
        <Search onSearch={handleSearch} initialTerm={searchTerm} throwError={throwError} />
      </div>
      <div className="bottom-section">
        {loading ? <p className="loader">Loading...</p> : error ? null : <CardList results={results} />}
      </div>
    </div>
  );
};

export default App;
