import { render, screen, waitFor } from '@testing-library/react';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import React from 'react';
import { Provider } from 'react-redux';
import { describe, it, expect, vi } from 'vitest';

import Custom404 from '../../pages/404.tsx';
import { createMockRouter } from '../mocks/nextRouterMock.ts';
import ErrorBoundaryWithTheme from '@/components/ErrorBoundary/ErrorBoundary';
import Loader from '@/components/Loader/Loader';
import { ThemeProvider } from '@/context/ThemeContext';
import { wrapper } from '@/redux/store';

vi.mock('next/dynamic', () => ({
  __esModule: true,
  default: (
    dynamicImport: () => Promise<{ default: React.ComponentType<object> }>,
    options: { suspense: boolean; loading: React.ComponentType<{ isLoading: boolean; error: null }> },
  ) => {
    const Component = React.lazy(dynamicImport);
    const LoadingComponent = options.loading;
    return (props: object) => (
      <React.Suspense fallback={<LoadingComponent isLoading={true} error={null} />}>
        <Component {...props} />
      </React.Suspense>
    );
  },
}));

describe('Custom404 page', () => {
  const mockRouter = createMockRouter({});

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(<RouterContext.Provider value={mockRouter}>{ui}</RouterContext.Provider>);
  };

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the NotFound component within the ErrorBoundary and ThemeProvider', async () => {
    renderWithProviders(<Custom404 />);

    await waitFor(() => expect(screen.getByTestId('loader')).toBeInTheDocument());

    await waitFor(() => expect(screen.getByText(/404 - Page Not Found/i)).toBeInTheDocument());
  });

  it('renders the ErrorBoundaryWithTheme component on error', async () => {
    const BrokenComponent = () => {
      throw new Error('Test error');
    };

    const Custom404WithError: React.FC = () => {
      const { store } = wrapper.useWrappedStore({});
      return (
        <Provider store={store}>
          <ThemeProvider>
            <ErrorBoundaryWithTheme>
              <React.Suspense fallback={<Loader isLoading={true} error={null} />}>
                <BrokenComponent />
              </React.Suspense>
            </ErrorBoundaryWithTheme>
          </ThemeProvider>
        </Provider>
      );
    };

    renderWithProviders(<Custom404WithError />);

    await waitFor(() => expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument());
  });
});
