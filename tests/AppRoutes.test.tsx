import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import AppRoutes from '../src/AppRoutes';

describe('AppRoutes component', () => {
  it('renders App component for the root route', () => {
    render(
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>,
    );

    expect(screen.getByText(/search/i)).toBeInTheDocument();
  });
});
