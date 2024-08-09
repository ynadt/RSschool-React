'use client';

import dynamic from 'next/dynamic';
import React, { FC, Suspense } from 'react';

import { ThemeProvider } from '@/context/ThemeContext.tsx';
import ErrorBoundaryWithTheme from '@components/ErrorBoundary/ErrorBoundary.tsx';
import Loader from '@components/Loader/Loader.tsx';
import StoreProvider from '@components/StoreProvider/StoreProvider.tsx';

const NotFound = dynamic(() => import('@components/NotFound/NotFound.tsx'), {
  suspense: true,
  loading: () => <Loader isLoading={true} error={null} />,
});

const Custom404: FC = () => {
  return (
    <StoreProvider>
      <ThemeProvider>
        <ErrorBoundaryWithTheme>
          <Suspense fallback={<Loader isLoading={true} error={null} />}>
            <NotFound />
          </Suspense>
        </ErrorBoundaryWithTheme>
      </ThemeProvider>
    </StoreProvider>
  );
};

export default Custom404;
