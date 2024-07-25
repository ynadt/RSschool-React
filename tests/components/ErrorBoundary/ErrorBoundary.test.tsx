import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ThemeProvider } from '@/context/ThemeContext.tsx';
import ErrorBoundaryWithTheme from '@components/ErrorBoundary/ErrorBoundary.tsx';

const ProblematicComponent = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary component', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let reloadMock: () => void;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    reloadMock = vi.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, reload: reloadMock },
    });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, reload: window.location.reload },
    });
  });

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(<ThemeProvider>{ui}</ThemeProvider>);
  };

  it('renders children when no error occurs', () => {
    renderWithProviders(
      <ErrorBoundaryWithTheme>
        <div>Child component</div>
      </ErrorBoundaryWithTheme>,
    );
    expect(screen.getByText('Child component')).toBeInTheDocument();
  });

  it('displays fallback UI when an error is caught', () => {
    renderWithProviders(
      <ErrorBoundaryWithTheme>
        <ProblematicComponent />
      </ErrorBoundaryWithTheme>,
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('reloads the page when Try Again button is clicked', () => {
    renderWithProviders(
      <ErrorBoundaryWithTheme>
        <ProblematicComponent />
      </ErrorBoundaryWithTheme>,
    );

    fireEvent.click(screen.getByText('Try Again'));
    expect(reloadMock).toHaveBeenCalled();
  });
});
