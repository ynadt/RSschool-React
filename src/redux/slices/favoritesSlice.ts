import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '@redux/store';

interface Favorite {
  mal_id: number;
  title: string;
  synopsis: string;
}

export interface FavoritesState {
  favorites: Favorite[];
}

const loadFavoritesFromLocalStorage = (): Favorite[] => {
  const favorites = localStorage.getItem('favorites');
  return favorites ? JSON.parse(favorites) : [];
};

const saveFavoritesToLocalStorage = (favorites: Favorite[]) => {
  localStorage.setItem('favorites', JSON.stringify(favorites));
};

const initialState: FavoritesState = {
  favorites: loadFavoritesFromLocalStorage(),
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite(state, action: PayloadAction<Favorite>) {
      state.favorites.push(action.payload);
      saveFavoritesToLocalStorage(state.favorites);
    },
    removeFavorite(state, action: PayloadAction<{ mal_id: number }>) {
      state.favorites = state.favorites.filter((item) => item.mal_id !== action.payload.mal_id);
      saveFavoritesToLocalStorage(state.favorites);
    },
    removeAllFavorites(state) {
      state.favorites = [];
      saveFavoritesToLocalStorage(state.favorites);
    },
  },
});

export const { addFavorite, removeFavorite, removeAllFavorites } = favoritesSlice.actions;

export const selectFavorites = (state: RootState) => state.favorites.favorites;

export default favoritesSlice.reducer;
