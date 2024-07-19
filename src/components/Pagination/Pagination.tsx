import React from 'react';
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
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const handlePageChange = (page: number) => {
    searchParams.set('page', page.toString());
    navigate(`?${searchParams.toString()}`);
    dispatch(setCurrentPage(page));
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageNumbersToShow = 5;
    let startPage = Math.max(currentPage - Math.floor(maxPageNumbersToShow / 2), 1);
    const endPage = Math.min(startPage + maxPageNumbersToShow - 1, totalPages);

    if (endPage - startPage + 1 < maxPageNumbersToShow) {
      startPage = Math.max(endPage - maxPageNumbersToShow + 1, 1);
    }

    if (startPage > 1) {
      pageNumbers.push(
        <span key="start-ellipsis" className={styles.ellipsis}>
          ...
        </span>,
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={currentPage === i ? styles.inactive : ''}
          onClick={() => handlePageChange(i)}
          disabled={currentPage === i}
        >
          {i}
        </button>,
      );
    }

    if (endPage < totalPages) {
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
        className={currentPage === 1 ? styles.inactive : ''}
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        Previous
      </button>
      {renderPageNumbers()}
      <button
        className={currentPage === totalPages || totalItems === 0 ? styles.inactive : ''}
        disabled={currentPage === totalPages || totalItems === 0}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
