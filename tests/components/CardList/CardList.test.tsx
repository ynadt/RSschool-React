import '@testing-library/jest-dom';

import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import CardList from '@components/CardList/CardList.tsx';
import { apiSlice } from '@redux/services/apiSlice';
import currentPageReducer from '@redux/slices/currentPageSlice';
import favoritesReducer from '@redux/slices/favoritesSlice';

const mockResults = [
  {
    mal_id: 1,
    title: 'Test Anime 1',
    synopsis: 'Synopsis 1',
    images: { webp: { image_url: 'https://example.com/image1.webp' } },
  },
  {
    mal_id: 2,
    title: 'Test Anime 2',
    synopsis: 'Synopsis 2',
    images: { webp: { image_url: 'https://example.com/image2.webp' } },
  },
];

const renderWithProviders = (ui: React.ReactElement) => {
  const store = configureStore({
    reducer: {
      currentPage: currentPageReducer,
      favorites: favoritesReducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  });

  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>,
  );
};

describe('CardList component', () => {
  test('renders with valid results', () => {
    renderWithProviders(<CardList results={mockResults} details="1" ref={null} />);

    const cards = screen.getAllByRole('heading', { level: 3 });
    expect(cards).toHaveLength(mockResults.length);
    expect(screen.getByText('Test Anime 1')).toBeInTheDocument();
    expect(screen.getByText('Test Anime 2')).toBeInTheDocument();
  });

  test('renders "Oops, nothing is found." when results list is empty', () => {
    renderWithProviders(<CardList results={[]} details={null} ref={null} />);
    expect(screen.getByText('Oops, nothing is found.')).toBeInTheDocument();
  });

  test('renders "Oops, nothing is found." when results is not an array', () => {
    renderWithProviders(<CardList results={null as unknown as []} details={null} ref={null} />);
    expect(screen.getByText('Oops, nothing is found.')).toBeInTheDocument();
  });

  test('renders with an active card', () => {
    renderWithProviders(<CardList results={mockResults} details="2" ref={null} />);

    const activeCard = screen.getByText('Test Anime 2').closest('.card');
    expect(activeCard).toHaveClass('card');
    expect(activeCard).toHaveClass(/active/);
  });

  test('renders without crashing when no ref is provided', () => {
    renderWithProviders(<CardList results={mockResults} details="1" ref={null} />);

    const cards = screen.getAllByRole('heading', { level: 3 });
    expect(cards).toHaveLength(mockResults.length);
  });

  test('renders synopsis fallback when synopsis is not provided', () => {
    const resultsWithoutSynopsis = [
      {
        mal_id: 3,
        title: 'Test Anime 3',
        synopsis: '',
        images: { webp: { image_url: 'https://example.com/image3.webp' } },
      },
    ];

    renderWithProviders(<CardList results={resultsWithoutSynopsis} details="3" ref={null} />);

    expect(screen.getByText('No synopsis available')).toBeInTheDocument();
  });
});
