'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useTheme } from '@/context/ThemeContext';
import { ApiError } from '@/types/types';
import CardDetails from '@components/CardDetails/CardDetails';
import CardList from '@components/CardList/CardList';
import FavoritesFlyout from '@components/FavoritesFlyout/FavoritesFlyout';
import Loader from '@components/Loader/Loader';
import Pagination from '@components/Pagination/Pagination';
import Search from '@components/Search/Search';
import useSearchTerm from '@hooks/useSearchTerm';
import { GetAnimeListResponse, useGetAnimeListQuery } from '@redux/services/apiSlice';
import { setCurrentPage } from '@redux/slices/currentPageSlice';
import { RootState } from '@redux/store';

const HomePage: React.FC<{ initialData: GetAnimeListResponse | null }> = ({ initialData }) => {
  const [searchTerm, setSearchTerm] = useSearchTerm('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const details = searchParams.get('details');
  const dispatch = useDispatch();
  const currentPage = useSelector((state: RootState) => state.currentPage.currentPage);
  const [error, setError] = useState<Error | null>(null);
  const cardListRef = useRef<HTMLDivElement>(null);
  const [lastPage, setLastPage] = useState(currentPage);

  const {
    data,
    error: apiError,
    isLoading,
  } = useGetAnimeListQuery(
    { term: searchTerm, page: currentPage },
    {
      skip: !initialData,
    },
  );
  const { theme } = useTheme();

  useEffect(() => {
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
    dispatch(setCurrentPage(page));
  }, [searchParams, dispatch]);

  const handleSearch = useCallback(
    (term: string) => {
      setSearchTerm(term);
      router.push(`/?page=1`);
      dispatch(setCurrentPage(1));
    },
    [router, dispatch, setSearchTerm],
  );

  const throwError = useCallback(() => {
    setError(new Error('Test error'));
  }, []);

  const handleCloseDetails = useCallback(() => {
    router.push(`/?page=${searchParams.get('page') || '1'}`);
  }, [router, searchParams]);

  const handleAppClick = useCallback(
    (event: MouseEvent) => {
      if (!(event.target instanceof HTMLElement)) return;
      const card = event.target.closest('.card');
      const paginationButton = event.target.closest('.pagination button');
      const paginationEllipsis = event.target.closest('.pagination span');
      const searchSection = event.target.closest('.search-section');
      const cardDetails = event.target.closest('.card-details');
      const favoritesFlyout = event.target.closest('.favorites-flyout');

      if (
        !card &&
        !paginationButton &&
        !paginationEllipsis &&
        !searchSection &&
        !cardDetails &&
        !favoritesFlyout &&
        details
      ) {
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

  const results = useMemo(() => data?.data || initialData?.data || [], [data, initialData]);
  const totalItems = useMemo(
    () => data?.pagination.items.total || initialData?.pagination.items.total || 0,
    [data, initialData],
  );

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

export default HomePage;
