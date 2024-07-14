import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>,
  );
} else {
  console.error('Failed to find the root element');
}
