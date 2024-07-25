import '@/index.css';
import '@/themes.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import AppRoutes from '@/AppRoutes';
import { ThemeProvider } from '@/context/ThemeContext';
import store from '@/redux/store';
import ErrorBoundaryWithTheme from '@components/ErrorBoundary/ErrorBoundary.tsx';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <ThemeProvider>
          <BrowserRouter>
            <ErrorBoundaryWithTheme>
              <AppRoutes />
            </ErrorBoundaryWithTheme>
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    </React.StrictMode>,
  );
} else {
  console.error('Failed to find the root element');
}
