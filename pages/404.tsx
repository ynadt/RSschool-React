import dynamic from 'next/dynamic';
import React, { FC } from 'react';
import { Provider } from 'react-redux';

import ErrorBoundaryWithTheme from '@/components/ErrorBoundary/ErrorBoundary';
import { ThemeProvider } from '@/context/ThemeContext';
import { wrapper } from '@/redux/store';
import Loader from '@components/Loader/Loader.tsx';

const NotFound = dynamic(() => import('@/components/NotFound/NotFound'), {
  suspense: true,
  loading: () => <Loader isLoading={true} error={null} />,
});

const Custom404: FC = () => {
  const { store } = wrapper.useWrappedStore({});

  return (
    <Provider store={store}>
      <ThemeProvider>
        <ErrorBoundaryWithTheme>
          <React.Suspense fallback={<Loader isLoading={true} error={null} />}>
            <NotFound />
          </React.Suspense>
        </ErrorBoundaryWithTheme>
      </ThemeProvider>
    </Provider>
  );
};

export default Custom404;
