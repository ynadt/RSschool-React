import { configureStore, EnhancedStore } from '@reduxjs/toolkit';

import favoritesReducer, {
  addFavorite,
  FavoritesState,
  removeAllFavorites,
  removeFavorite,
  selectFavorites,
} from '@/redux/slices/favoritesSlice';
import { RootState } from '@/redux/store';

describe('favoritesSlice', () => {
  let store: EnhancedStore<{ favorites: FavoritesState }>;

  const initialState: FavoritesState = {
    favorites: [],
  };

  const favoriteItem = {
    mal_id: 1,
    title: 'Naruto',
    synopsis: 'A story about a ninja.',
  };

  beforeEach(() => {
    store = configureStore({
      reducer: {
        favorites: favoritesReducer,
      },
    });
  });

  it('should return the initial state', () => {
    const state: FavoritesState = store.getState().favorites;
    expect(state).toEqual(initialState);
  });

  it('should handle addFavorite action', () => {
    store.dispatch(addFavorite(favoriteItem));
    const state: FavoritesState = store.getState().favorites;
    expect(state.favorites).toContainEqual(favoriteItem);
  });

  it('should handle removeFavorite action', () => {
    store.dispatch(addFavorite(favoriteItem));
    store.dispatch(removeFavorite({ mal_id: 1 }));
    const state: FavoritesState = store.getState().favorites;
    expect(state.favorites).not.toContainEqual(favoriteItem);
  });

  it('should handle removeAllFavorites action', () => {
    store.dispatch(addFavorite(favoriteItem));
    store.dispatch(removeAllFavorites());
    const state: FavoritesState = store.getState().favorites;
    expect(state.favorites).toHaveLength(0);
  });

  it('should select favorites from state', () => {
    store.dispatch(addFavorite(favoriteItem));
    const state: RootState = store.getState() as RootState;
    const favorites = selectFavorites(state);
    expect(favorites).toContainEqual(favoriteItem);
  });
});
