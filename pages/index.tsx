import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CardDetails from '@/components/CardDetails/CardDetails';
import CardList from '@/components/CardList/CardList';
import FavoritesFlyout from '@/components/FavoritesFlyout/FavoritesFlyout';
import Loader from '@/components/Loader/Loader';
import Pagination from '@/components/Pagination/Pagination';
import Search from '@/components/Search/Search';
import { useTheme } from '@/context/ThemeContext';
import useSearchTerm from '@/hooks/useSearchTerm';
import { apiSlice, useGetAnimeListQuery } from '@/redux/services/apiSlice';
import { setCurrentPage } from '@/redux/slices/currentPageSlice';
import { RootState, wrapper } from '@/redux/store';
import { ApiError } from '@/types/types';

const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useSearchTerm('');
  const router = useRouter();
  const details = router.query.details as string;
  const dispatch = useDispatch();
  const currentPage = useSelector((state: RootState) => state.currentPage.currentPage);
  const [error, setError] = useState<Error | null>(null);
  const cardListRef = useRef<HTMLDivElement>(null);
  const [lastPage, setLastPage] = useState(currentPage);

  const { data, error: apiError, isLoading } = useGetAnimeListQuery({ term: searchTerm, page: currentPage });
  const { theme } = useTheme();

  useEffect(() => {
    const page = router.query.page ? Number(router.query.page) : 1;
    dispatch(setCurrentPage(page));
  }, [router.query.page, dispatch]);

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
    router.push(`/?page=${router.query.page || '1'}`);
  }, [router]);

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

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps((store) => async ({ query }) => {
  const page = query.page ? Number(query.page) : 1;
  const term = query.term ? String(query.term) : '';
  const details = query.details ? String(query.details) : '';

  store.dispatch(setCurrentPage(page));

  if (term) {
    store.dispatch(apiSlice.endpoints.getAnimeList.initiate({ term, page }));
  }

  if (details) {
    store.dispatch(apiSlice.endpoints.getAnimeDetails.initiate(details));
  }

  await Promise.all(store.dispatch(apiSlice.util.getRunningQueriesThunk()));

  return {
    props: {},
  };
});

export default Home;
