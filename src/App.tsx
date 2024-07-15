import React, { useState, useEffect } from 'react';
import './App.css';
import Search from './components/Search';
import CardList from './components/CardList';
import Pagination from './components/Pagination';
import useSearchTerm from './hooks/useSearchTerm';
import { useSearchParams } from 'react-router-dom';
import CardDetails from './components/CardDetails';
import FavoritesFlyout from './components/FavoritesFlyout';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useSearchTerm('');
  const [results, setResults] = useState<Array<{ mal_id: number; title: string; synopsis: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [shouldThrowError, setShouldThrowError] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1', 10);
  const details = searchParams.get('details');
  const itemsPerPage = 25;

  useEffect(() => {
    fetchResults(searchTerm, page);
  }, [searchTerm, page]);

  const fetchResults = (term: string, page: number) => {
    setLoading(true);
    setError(null);

    const apiEndpoint = term
      ? `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(term)}&page=${page}`
      : `https://api.jikan.moe/v4/anime?page=${page}`;

    fetch(apiEndpoint)
      .then((response) => response.json())
      .then((data) => {
        const results = (data.data || []).map((item: { mal_id: number; title: string; synopsis: string }) => ({
          mal_id: item.mal_id,
          title: item.title,
          synopsis: item.synopsis,
        }));
        setResults(results);
        setTotalItems(data.pagination.items.total);
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
    setSearchParams({ page: '1' });
  };

  const throwError = () => {
    setShouldThrowError(true);
  };

  const handleCloseDetails = () => {
    setSearchParams({ page: searchParams.get('page') || '1' });
  };

  const handleCardListClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!(event.target instanceof HTMLElement)) return;
    const card = event.target.closest('.card');
    const paginationButton = event.target.closest('.pagination button');
    const paginationEllipsis = event.target.closest('.pagination span');
    if (!card && !(paginationButton || paginationEllipsis) && details) {
      handleCloseDetails();
    }
  };

  if (shouldThrowError) {
    throw new Error('Test error');
  }

  return (
    <div className="App">
      <div className="search-section">
        <Search onSearch={handleSearch} initialTerm={searchTerm} throwError={throwError} />
      </div>
      <div className="content-section">
        {loading ? (
          <p className="loader">Loading...</p>
        ) : error ? (
          <p className="error">Error: {error.message}</p>
        ) : (
          <div className="results-layout">
            <div
              className={`results-section ${results.length === 0 ? 'no-results' : ''}`}
              onClick={handleCardListClick}
            >
              <CardList results={results} />
              {results.length > 0 && (
                <Pagination currentPage={page} totalItems={totalItems} itemsPerPage={itemsPerPage} />
              )}
            </div>
            {results.length > 0 && details && (
              <div className="details-section">
                <button className="close-button" onClick={handleCloseDetails}>
                  Close
                </button>
                <CardDetails id={details} />
              </div>
            )}
          </div>
        )}
      </div>
      <FavoritesFlyout />
    </div>
  );
};

export default App;
