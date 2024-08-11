import { AppProps } from 'next/app';
import React, { FC, useEffect } from 'react';
import { Provider } from 'react-redux';

import ErrorBoundaryWithTheme from '@/components/ErrorBoundary/ErrorBoundary';
import { ThemeProvider } from '@/context/ThemeContext';
import { initializeFavorites } from '@/redux/slices/favoritesSlice';
import { wrapper } from '@/redux/store';
import './index.css';
import './themes.css';

const MyApp: FC<AppProps> = ({ Component, ...rest }) => {
  const { store, props } = wrapper.useWrappedStore({ rest });

  useEffect(() => {
    store.dispatch(initializeFavorites());
  }, [store]);

  return (
    <Provider store={store}>
      <ThemeProvider>
        <ErrorBoundaryWithTheme>
          <Component {...props.pageProps} />
        </ErrorBoundaryWithTheme>
      </ThemeProvider>
    </Provider>
  );
};

export default MyApp;
