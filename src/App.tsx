import './App.css';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { useTheme } from '@/context/ThemeContext.tsx';
import useSearchTerm from '@/hooks/useSearchTerm';
import { useGetAnimeListQuery } from '@/redux/services/apiSlice';
import { setCurrentPage } from '@/redux/slices/currentPageSlice.ts';
import { RootState } from '@/redux/store';
import { ApiError } from '@/types/types.ts';
import CardDetails from '@components/CardDetails/CardDetails.tsx';
import CardList from '@components/CardList/CardList.tsx';
import FavoritesFlyout from '@components/FavoritesFlyout/FavoritesFlyout.tsx';
import Loader from '@components/Loader/Loader.tsx';
import Pagination from '@components/Pagination/Pagination.tsx';
import Search from '@components/Search/Search.tsx';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useSearchTerm('');
  const [searchParams, setSearchParams] = useSearchParams();
  const details = searchParams.get('details');
  const dispatch = useDispatch();
  const currentPage = useSelector((state: RootState) => state.currentPage.currentPage);
  const [error, setError] = useState<Error | null>(null);
  const cardListRef = useRef<HTMLDivElement>(null);
  const [lastPage, setLastPage] = useState(currentPage);

  const { data, error: apiError, isLoading } = useGetAnimeListQuery({ term: searchTerm, page: currentPage });
  const { theme } = useTheme();

  useEffect(() => {
    const page = searchParams.get('page');
    if (page) {
      dispatch(setCurrentPage(Number(page)));
    }
  }, [searchParams, dispatch]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setSearchParams({ page: '1' });
    dispatch(setCurrentPage(1));
  };

  const throwError = useCallback(() => {
    setError(new Error('Test error'));
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSearchParams({ page: searchParams.get('page') || '1' });
  }, [setSearchParams, searchParams]);

  const handleAppClick = useCallback(
    (event: MouseEvent) => {
      if (!(event.target instanceof HTMLElement)) return;
      const card = event.target.closest('.card');
      const paginationButton = event.target.closest('.pagination button');
      const paginationEllipsis = event.target.closest('.pagination span');
      const searchSection = event.target.closest('.search-section');
      const cardDetails = event.target.closest('.cardDetails');

      if (!card && !paginationButton && !paginationEllipsis && !searchSection && !cardDetails && details) {
        handleCloseDetails();
      }
    },
    [details, handleCloseDetails],
  );

  useEffect(() => {
    document.addEventListener('click', handleAppClick);
    return () => {
      document.removeEventListener('click', handleAppClick);
    };
  }, [handleAppClick]);

  const results = useMemo(() => data?.data || [], [data]);
  const totalItems = useMemo(() => data?.pagination.items.total || 0, [data]);

  useEffect(() => {
    if (cardListRef.current && lastPage !== currentPage) {
      cardListRef.current.scrollTo(0, 0);
      setLastPage(currentPage);
    }
  }, [currentPage, lastPage]);

  if (error) {
    throw error;
  }

  return (
    <div className={`App ${theme}`}>
      <div className="search-section">
        <Search onSearch={handleSearch} initialTerm={searchTerm} throwError={throwError} />
      </div>
      <div className="content-section">
        {isLoading || apiError ? (
          <Loader isLoading={isLoading} error={apiError as ApiError} />
        ) : (
          <div className="results-layout">
            <div className={`results-section ${results.length === 0 ? 'no-results' : ''}`} ref={cardListRef}>
              <CardList results={results} details={details} />
              {results.length > 0 && <Pagination currentPage={currentPage} totalItems={totalItems} itemsPerPage={25} />}
            </div>
            {results.length > 0 && details && (
              <div className="details-section">
                <CardDetails id={details} onClose={handleCloseDetails} />
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
