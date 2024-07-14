import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ErrorBoundary from '../src/components/ErrorBoundary';

const ProblematicComponent = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary component', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>Child component</div>
      </ErrorBoundary>,
    );
    expect(screen.getByText('Child component')).toBeInTheDocument();
  });

  it('displays fallback UI when an error is caught', () => {
    render(
      <ErrorBoundary>
        <ProblematicComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });
});
