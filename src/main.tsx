import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './themes.css';
import ErrorBoundary from '@components/ErrorBoundary/ErrorBoundary.tsx';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import AppRoutes from './AppRoutes';
import store from './redux/store';
import { ThemeProvider } from './context/ThemeContext';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <ErrorBoundary>
          <ThemeProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </ThemeProvider>
        </ErrorBoundary>
      </Provider>
    </React.StrictMode>,
  );
} else {
  console.error('Failed to find the root element');
}
