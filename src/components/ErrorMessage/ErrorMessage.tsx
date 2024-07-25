import React from 'react';

import { ApiError } from '@/types/types.ts';

interface ErrorMessageProps {
  error: ApiError | null;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  if (!error) return null;

  let errorMessage = 'An error occurred';

  if ('status' in error) {
    switch (error.status) {
      case 400:
        errorMessage = 'Bad Request';
        break;
      case 404:
        errorMessage = 'Not Found';
        break;
      case 429:
        errorMessage = 'Too Many Requests';
        break;
      case 500:
        errorMessage = 'Internal Server Error';
        break;
      case 503:
        errorMessage = 'Service Unavailable';
        break;
      default:
        errorMessage = 'Network error';
    }
  } else if ('message' in error && typeof error.message === 'string') {
    errorMessage = error.message;
  }

  return <div>Error: {errorMessage}</div>;
};

export default ErrorMessage;
