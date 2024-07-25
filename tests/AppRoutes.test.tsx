import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AppRoutes from '@/AppRoutes';
import { Provider } from 'react-redux';
import store from '@/redux/store';
import { ThemeProvider } from '@/context/ThemeContext';
import { MemoryRouter } from 'react-router-dom';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(
  http.get('https://api.jikan.moe/v4/anime', () => {
    return HttpResponse.json({ items: [] }); // Ensure 'items' key exists
  }),
);

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <Provider store={store}>
      <ThemeProvider>{ui}</ThemeProvider>
    </Provider>,
  );
};

describe('AppRoutes', () => {
  test('renders the home route', async () => {
    renderWithProviders(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>,
    );

    await waitFor(() => expect(screen.getByPlaceholderText('Search for anime')).toBeInTheDocument());
  });

  test('renders the NotFound route', async () => {
    renderWithProviders(
      <MemoryRouter initialEntries={['/some-non-existent-route']}>
        <AppRoutes />
      </MemoryRouter>,
    );

    await waitFor(() => expect(screen.getByText(/not found/i)).toBeInTheDocument());
  });
});
