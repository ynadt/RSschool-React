import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import React, { ErrorInfo, ReactNode } from 'react';

import styles from './ErrorBoundary.module.css';
import { useTheme } from '@/context/ThemeContext.tsx';
import { ApiError, ApiJsonErrorResponse } from '@/types/types.ts';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: ApiError | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps & { theme: string }, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps & { theme: string }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: ApiError): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    const { theme, children } = this.props;
    if (this.state.hasError) {
      const errorMessage =
        (this.state.error as SerializedError)?.message ||
        (this.state.error as ApiJsonErrorResponse)?.message ||
        (this.state.error as FetchBaseQueryError)?.status ||
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

    return children;
  }
}

const ErrorBoundaryWithTheme: React.FC<ErrorBoundaryProps> = ({ children }) => {
  const { theme } = useTheme();
  return <ErrorBoundary theme={theme}>{children}</ErrorBoundary>;
};

export default ErrorBoundaryWithTheme;
