import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import FavoritesFlyout from '@/components/FavoritesFlyout/FavoritesFlyout';
import { removeAllFavorites } from '@/redux/slices/favoritesSlice';
import { saveAs } from 'file-saver';
import { generateCSVContent } from '@/utils/csvUtils';

vi.mock('file-saver', () => ({
  saveAs: vi.fn(),
}));

vi.mock('@/utils/csvUtils', () => ({
  generateCSVContent: vi.fn(),
}));

const mockStore = configureStore([]);
const initialState = {
  favorites: {
    favorites: [],
  },
};
const populatedState = {
  favorites: {
    favorites: [
      { mal_id: 1, title: 'Test Anime 1', synopsis: 'Synopsis 1' },
      { mal_id: 2, title: 'Test Anime 2', synopsis: 'Synopsis 2' },
    ],
  },
};

describe('FavoritesFlyout component', () => {
  it('does not render when there are no favorites', () => {
    const store = mockStore(initialState);

    render(
      <Provider store={store}>
        <FavoritesFlyout />
      </Provider>,
    );

    expect(screen.queryByText(/favorites/)).toBeNull();
  });

  it('renders when there are favorites', () => {
    const store = mockStore(populatedState);

    render(
      <Provider store={store}>
        <FavoritesFlyout />
      </Provider>,
    );

    expect(screen.getByText(/2 animes are in favorites/)).toBeInTheDocument();
  });

  it('calls removeAllFavorites when "Remove all" button is clicked', () => {
    const store = mockStore(populatedState);
    store.dispatch = vi.fn();

    render(
      <Provider store={store}>
        <FavoritesFlyout />
      </Provider>,
    );

    fireEvent.click(screen.getByText('Remove all'));

    expect(store.dispatch).toHaveBeenCalledWith(removeAllFavorites());
  });

  it('calls generateCSVContent and saveAs when "Download" button is clicked', () => {
    const store = mockStore(populatedState);
    const csvContent = 'id,title,synopsis\n1,Test Anime 1,Synopsis 1\n2,Test Anime 2,Synopsis 2\n';
    (generateCSVContent as jest.Mock).mockReturnValue(csvContent);

    render(
      <Provider store={store}>
        <FavoritesFlyout />
      </Provider>,
    );

    fireEvent.click(screen.getByText('Download'));

    expect(generateCSVContent).toHaveBeenCalledWith(populatedState.favorites.favorites);
    expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), '2_favorites.csv');
  });

  it('hides the flyout when close button is clicked', () => {
    const store = mockStore(populatedState);

    render(
      <Provider store={store}>
        <FavoritesFlyout />
      </Provider>,
    );

    fireEvent.click(screen.getByText('×'));

    expect(screen.queryByText(/2 animes are in favorites/)).toBeNull();
  });
});
