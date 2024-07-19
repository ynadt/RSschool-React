import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from '../src/AppRoutes';
import ErrorBoundary from '@components/ErrorBoundary/ErrorBoundary.tsx';

describe('Main Application', () => {
  it('renders the main application without crashing', () => {
    render(
      <React.StrictMode>
        <ErrorBoundary>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ErrorBoundary>
      </React.StrictMode>,
    );

    expect(screen.getByText(/search/i)).toBeInTheDocument();
  });
});
