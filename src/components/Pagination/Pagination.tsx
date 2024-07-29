import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import styles from './Pagination.module.css';
import { setCurrentPage } from '@/redux/slices/currentPageSlice.ts';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalItems, itemsPerPage }) => {
  const totalPages = useMemo(() => Math.ceil(totalItems / itemsPerPage), [totalItems, itemsPerPage]);
  const router = useRouter();
  const dispatch = useDispatch();

  const handlePageChange = (page: number) => {
    const query = { ...router.query, page: page.toString() };
    router.push({ pathname: router.pathname, query });
    dispatch(setCurrentPage(page));
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
      pageNumbers.push(
        <span key="start-ellipsis" className={styles.ellipsis}>
          ...
        </span>,
      );
    }

    for (let page = startPage; page <= endPage; page++) {
      pageNumbers.push(
        <button
          key={page}
          className={`${styles.pageNumber} ${currentPage === page ? styles.inactive : ''}`}
          onClick={() => handlePageChange(page)}
          disabled={currentPage === page}
        >
          {page}
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
