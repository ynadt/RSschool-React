import { userEvent } from '@testing-library/user-event';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { customRender as render, screen } from '../../setupTests.tsx';
import store from '@/redux/store';
import Card from '@components/Card/Card';

describe('Card component', () => {
  const mockCardData = {
    mal_id: 1,
    title: 'Title 1',
    synopsis: 'Synopsis 1',
    image_url: 'https://via.placeholder.com/150',
    isActive: false,
  };

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <Provider store={store}>
        <BrowserRouter>{ui}</BrowserRouter>
      </Provider>,
    );
  };

  test('renders the relevant card data', () => {
    renderWithProviders(<Card {...mockCardData} />);
    expect(screen.getByText(mockCardData.title)).toBeInTheDocument();
    expect(screen.getByText(mockCardData.synopsis)).toBeInTheDocument();
  });

  test('clicking on a card opens a detailed card component', async () => {
    renderWithProviders(<Card {...mockCardData} />);

    const cardElement = screen.getByText(mockCardData.title).closest('.card');
    if (cardElement) {
      await userEvent.click(cardElement);
      expect(window.location.search).toBe(`?page=1&details=${mockCardData.mal_id}`);
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
