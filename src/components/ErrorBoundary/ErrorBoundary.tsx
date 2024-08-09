'use client';

import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import React, { ReactNode, useEffect, useState } from 'react';

import styles from './ErrorBoundary.module.css';
import { useTheme } from '@/context/ThemeContext';
import { ApiError, ApiJsonErrorResponse } from '@/types/types';

interface ErrorBoundaryProps {
  children: ReactNode;
}

const ErrorBoundaryWithTheme: React.FC<ErrorBoundaryProps> = ({ children }) => {
  const { theme } = useTheme();
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setHasError(true);
      setError(event.error);
    };

    window.addEventListener('error', handleError);
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  if (hasError && error) {
    const errorMessage =
      (error as SerializedError)?.message ||
      (error as ApiJsonErrorResponse)?.message ||
      (error as FetchBaseQueryError)?.status ||
      'An unexpected error occurred';

    return (
      <div className={`${styles.errorBoundary} ${styles[theme]}`}>
        <h1>Something went wrong.</h1>
        <p className={styles.errorMessage}>{errorMessage}</p>
        <button className={`${styles.errorButton} ${styles[theme]}`} onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default ErrorBoundaryWithTheme;
