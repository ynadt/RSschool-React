import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import App from '@/App';
import store from '@/redux/store';
import { ThemeProvider } from '@/context/ThemeContext';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const mockAnimeListResponse = {
  data: [
    {
      mal_id: 1,
      title: 'Naruto',
      synopsis: 'A story about a ninja.',
      images: {
        webp: { image_url: 'https://example.com/naruto.webp' },
      },
    },
  ],
  pagination: { items: { total: 1 } },
};

const mockAnimeDetailResponse = {
  data: {
    mal_id: 1,
    title: 'Naruto',
    synopsis: 'A story about a ninja.',
    images: {
      webp: { image_url: 'https://example.com/naruto.webp' },
    },
    genres: [{ name: 'Action' }, { name: 'Adventure' }],
    rating: 'PG-13',
  },
};

const server = setupServer(
  http.get('https://api.jikan.moe/v4/anime', () => {
    return HttpResponse.json(mockAnimeListResponse);
  }),
  http.get('https://api.jikan.moe/v4/anime/:id', () => {
    return HttpResponse.json(mockAnimeDetailResponse);
  }),
);

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => {
  server.resetHandlers();
  vi.resetAllMocks();
});
afterAll(() => server.close());

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <Provider store={store}>
      <ThemeProvider>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="*" element={ui} />
          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    </Provider>,
  );
};

describe('App', () => {
  it('renders search component', () => {
    renderWithProviders(<App />);
    expect(screen.getByPlaceholderText('Search for anime')).toBeInTheDocument();
  });

  it('handles search term input', async () => {
    renderWithProviders(<App />);
    const input = screen.getByPlaceholderText('Search for anime');
    fireEvent.change(input, { target: { value: 'Naruto' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => expect(screen.getByText('Naruto')).toBeInTheDocument());
  });

  it('handles pagination', async () => {
    renderWithProviders(<App />);
    const input = screen.getByPlaceholderText('Search for anime');
    fireEvent.change(input, { target: { value: 'Naruto' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => expect(screen.getByText('Naruto')).toBeInTheDocument());

    const nextPageButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextPageButton);

    await waitFor(() => expect(screen.getByText('Naruto')).toBeInTheDocument());
  });

  it('handles details view', async () => {
    renderWithProviders(<App />);
    const input = screen.getByPlaceholderText('Search for anime');
    fireEvent.change(input, { target: { value: 'Naruto' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => expect(screen.getByText('Naruto')).toBeInTheDocument());

    const card = screen.getByText('Naruto');
    fireEvent.click(card);

    await waitFor(() => expect(screen.getByText('A story about a ninja.')).toBeInTheDocument());

    expect(screen.getByText(/A story about a ninja\./i)).toBeInTheDocument();
  });

  it('handles theme change', () => {
    const { container } = renderWithProviders(<App />);
    expect(container.firstChild).toHaveClass('light');
  });

  it('handles API error', async () => {
    server.use(
      http.get('https://api.jikan.moe/v4/anime', () => {
        return new HttpResponse('Internal Server Error', {
          status: 500,
        });
      }),
    );

    renderWithProviders(<App />);
    const input = screen.getByPlaceholderText('Search for anime');
    fireEvent.change(input, { target: { value: 'Naruto' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => expect(screen.getByText(/error/i)).toBeInTheDocument());
  });
});
