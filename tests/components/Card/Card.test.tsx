import { configureStore } from '@reduxjs/toolkit';
import { userEvent } from '@testing-library/user-event';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import React from 'react';
import { Provider } from 'react-redux';
import { describe, test, expect } from 'vitest';

import { createMockRouter } from '../../mocks/nextRouterMock';
import { customRender as render, screen } from '../../setupTests';
import { apiSlice } from '@/redux/services/apiSlice';
import currentPageReducer from '@/redux/slices/currentPageSlice';
import favoritesReducer from '@/redux/slices/favoritesSlice';
import Card from '@components/Card/Card';

const makeStore = () =>
  configureStore({
    reducer: {
      currentPage: currentPageReducer,
      favorites: favoritesReducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  });

describe('Card component', () => {
  const mockCardData = {
    mal_id: 1,
    title: 'Title 1',
    synopsis: 'Synopsis 1',
    images: { webp: { image_url: 'https://via.placeholder.com/150' } },
    isActive: false,
  };

  const renderWithProviders = (ui: React.ReactElement) => {
    const store = makeStore();
    const mockRouter = createMockRouter({});

    return render(
      <Provider store={store}>
        <RouterContext.Provider value={mockRouter}>{ui}</RouterContext.Provider>
      </Provider>,
    );
  };

  test('renders the relevant card data', () => {
    renderWithProviders(<Card {...mockCardData} />);
    expect(screen.getByText(mockCardData.title)).toBeInTheDocument();
    expect(screen.getByText(mockCardData.synopsis)).toBeInTheDocument();
  });

  test('clicking on a card opens a detailed card component', async () => {
    const mockRouter = createMockRouter({});
    render(
      <Provider store={makeStore()}>
        <RouterContext.Provider value={mockRouter}>
          <Card {...mockCardData} />
        </RouterContext.Provider>
      </Provider>,
    );

    const cardElement = screen.getByText(mockCardData.title).closest('.card');
    if (cardElement) {
      await userEvent.click(cardElement);
      expect(mockRouter.push).toHaveBeenCalledWith(`/?page=1&details=${mockCardData.mal_id}`);
    } else {
      throw new Error('Card element not found');
    }
  });

  test('clicking the favorite icon toggles favorite status', async () => {
    renderWithProviders(<Card {...mockCardData} />);

    const favoriteIcon = screen.getByRole('button', { name: /add to favorites/i });
    expect(favoriteIcon).toBeInTheDocument();

    await userEvent.click(favoriteIcon);

    const favoriteIconFilled = screen.getByRole('button', { name: /remove from favorites/i });
    expect(favoriteIconFilled).toBeInTheDocument();
  });
});
