import React from 'react';
import './App.css';
import Search from '@components/Search/Search.tsx';
import CardList from '@components/CardList/CardList.tsx';
import Pagination from '@components/Pagination/Pagination.tsx';
import useSearchTerm from './hooks/useSearchTerm';
import { useSearchParams } from 'react-router-dom';
import CardDetails from '@components/CardDetails/CardDetails.tsx';
import { useGetAnimeListQuery } from './redux/services/apiSlice';
import FavoritesFlyout from '@components/FavoritesFlyout/FavoritesFlyout.tsx';
import Loader from '@components/Loader/Loader.tsx';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';
import { ApiError } from './types/types.ts';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useSearchTerm('');
  const [searchParams, setSearchParams] = useSearchParams();
  const details = searchParams.get('details');
  const currentPage = useSelector((state: RootState) => state.currentPage.currentPage);

  const { data, error, isLoading } = useGetAnimeListQuery({ term: searchTerm, page: currentPage });

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setSearchParams({ page: '1' });
  };

  const throwError = () => {
    throw new Error('Test error');
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

  const results = data?.data || [];
  const totalItems = data?.pagination.items.total || 0;

  return (
    <div className="App">
      <div className="search-section">
        <Search onSearch={handleSearch} initialTerm={searchTerm} throwError={throwError} />
      </div>
      <div className="content-section">
        {isLoading ? (
          <Loader isLoading={isLoading} error={error as ApiError} />
        ) : (
          <div className="results-layout">
            <div
              className={`results-section ${results.length === 0 ? 'no-results' : ''}`}
              onClick={handleCardListClick}
            >
              <CardList results={results} />
              {results.length > 0 && <Pagination currentPage={currentPage} totalItems={totalItems} itemsPerPage={25} />}
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
