import React from 'react';
import { ApiError } from '@/types/types.ts';
import { Vortex } from 'react-loader-spinner';

interface LoaderProps {
  isLoading: boolean;
  error: ApiError;
}

const Loader: React.FC<LoaderProps> = ({ isLoading, error }) => {
  if (isLoading)
    return (
      <Vortex
        visible={true}
        height="80"
        width="80"
        ariaLabel="vortex-loading"
        wrapperStyle={{}}
        wrapperClass="vortex-wrapper"
        colors={['red', 'green', 'blue', 'yellow', 'orange', 'purple']}
      />
    );

  if (error) {
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
  }

  return null;
};

export default Loader;
