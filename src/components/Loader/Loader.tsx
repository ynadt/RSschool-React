import React from 'react';
import { ApiError } from '@/types/types.ts';
import { Vortex } from 'react-loader-spinner';
import ErrorMessage from '../ErrorMessage/ErrorMessage.tsx';

interface LoaderProps {
  isLoading: boolean;
  error: ApiError | null;
}

const Loader: React.FC<LoaderProps> = ({ isLoading, error }) => {
  if (isLoading) {
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
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return null;
};

export default Loader;
