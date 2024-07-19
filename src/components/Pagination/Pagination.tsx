import React, { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCurrentPage } from '@/redux/slices/currentPageSlice.ts';
import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalItems, itemsPerPage }) => {
  const totalPages = useMemo(() => Math.ceil(totalItems / itemsPerPage), [totalItems, itemsPerPage]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const handlePageChange = (page: number) => {
    searchParams.set('page', page.toString());
    navigate(`?${searchParams.toString()}`);
    dispatch(setCurrentPage(page));
  };

  const renderPageNumbers = () => {
    const pageNumbers = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
      const pageNumber = i + Math.max(currentPage - Math.floor(5 / 2), 1);
      return (
        <button
          key={pageNumber}
          className={`${styles.pageNumber} ${currentPage === pageNumber ? styles.inactive : ''}`}
          onClick={() => handlePageChange(pageNumber)}
          disabled={currentPage === pageNumber}
        >
          {pageNumber}
        </button>
      );
    });

    if (currentPage > 3) {
      pageNumbers.unshift(
        <span key="start-ellipsis" className={styles.ellipsis}>
          ...
        </span>,
      );
    }

    if (currentPage < totalPages - 2) {
      pageNumbers.push(
        <span key="end-ellipsis" className={styles.ellipsis}>
          ...
        </span>,
      );
    }

    return pageNumbers;
  };

  return (
    <div className={`${styles.pagination} pagination`}>
      <button
        className={`${styles.pageButton} ${currentPage === 1 ? styles.inactive : ''}`}
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        Previous
      </button>
      {renderPageNumbers()}
      <button
        className={`${styles.pageButton} ${currentPage === totalPages || totalItems === 0 ? styles.inactive : ''}`}
        disabled={currentPage === totalPages || totalItems === 0}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
